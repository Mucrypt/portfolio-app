-- =====================================================================
-- Ingest API support (2026-11-19) — docs/ingest/CONTRACT.md v0.1
--
-- * ingest_upsert_course / ingest_patch_lesson: each request is applied in one
--   transaction (all or nothing). With p_dry_run = true every check runs, then the
--   writes are rolled back inside a sub-block and the would-be result is returned.
-- * Business errors are raised as SQLSTATE P0001 with MESSAGE = the contract's error
--   code (unknown_product, unknown_module, lesson_not_found,
--   lesson_belongs_to_other_course, publish_requires_video_ref), DETAIL = a human
--   message and HINT = the payload path. The route maps them to HTTP statuses.
-- * Field semantics: a key that is absent leaves the column unchanged; an explicit
--   JSON null clears it. Nothing is ever deleted.
-- * ingest_rate_hit: shared fixed-window counter (60/min) for all function instances.
-- * course-thumbnails: public bucket for course/product art. Only the service role
--   writes to it (no storage.objects policies for it), anyone can read by URL.
--
-- All functions are SECURITY INVOKER and executable by service_role only.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Write one lesson (insert or partial update). Internal helper.
-- Returns true when the lesson was created.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ingest_write_lesson(
  p_course_id uuid,
  p_lesson    jsonb,
  p_path      text DEFAULT ''
)
  RETURNS boolean
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  v_existing   public.course_lessons;
  v_module_id  uuid;
  v_published  boolean;
  v_video_ref  text;
BEGIN
  SELECT * INTO v_existing
  FROM public.course_lessons
  WHERE external_id = p_lesson->>'external_id'
  FOR UPDATE;

  IF v_existing.id IS NOT NULL AND v_existing.course_id <> p_course_id THEN
    RAISE EXCEPTION 'lesson_belongs_to_other_course' USING
      ERRCODE = 'P0001',
      DETAIL  = format('Lesson "%s" already belongs to a different course.', p_lesson->>'external_id'),
      HINT    = p_path || 'external_id';
  END IF;

  IF p_lesson ? 'module_external_id' AND jsonb_typeof(p_lesson->'module_external_id') <> 'null' THEN
    SELECT id INTO v_module_id
    FROM public.course_modules
    WHERE course_id = p_course_id AND external_id = p_lesson->>'module_external_id';

    IF v_module_id IS NULL THEN
      RAISE EXCEPTION 'unknown_module' USING
        ERRCODE = 'P0001',
        DETAIL  = format('Module "%s" is not in this payload or this course.', p_lesson->>'module_external_id'),
        HINT    = p_path || 'module_external_id';
    END IF;
  END IF;

  -- Check the final state up front so the caller gets 422, not a constraint error.
  v_published := CASE WHEN p_lesson ? 'is_published'
                      THEN (p_lesson->>'is_published')::boolean
                      ELSE coalesce(v_existing.is_published, false) END;
  v_video_ref := CASE WHEN p_lesson ? 'video_ref'
                      THEN p_lesson->>'video_ref'
                      ELSE v_existing.video_ref END;
  IF v_published AND v_video_ref IS NULL THEN
    RAISE EXCEPTION 'publish_requires_video_ref' USING
      ERRCODE = 'P0001',
      DETAIL  = format('Lesson "%s" cannot be published without a video_ref.', p_lesson->>'external_id'),
      HINT    = p_path || 'is_published';
  END IF;

  IF v_existing.id IS NULL THEN
    INSERT INTO public.course_lessons (
      course_id, module_id, external_id, slug, title, description, objective,
      sort_order, duration_seconds, video_provider, video_ref, short_ref,
      thumbnail_url, transcript, chapters, resources, is_published
    ) VALUES (
      p_course_id,
      v_module_id,
      p_lesson->>'external_id',
      p_lesson->>'slug',
      p_lesson->>'title',
      coalesce(p_lesson->>'description', ''),
      p_lesson->>'objective',
      (p_lesson->>'sort_order')::integer,
      (p_lesson->>'duration_seconds')::integer,
      coalesce(p_lesson->>'video_provider', 'youtube'),
      p_lesson->>'video_ref',
      p_lesson->>'short_ref',
      p_lesson->>'thumbnail_url',
      p_lesson->>'transcript',
      coalesce(p_lesson->'chapters', '[]'::jsonb),
      coalesce(p_lesson->'resources', '[]'::jsonb),
      v_published
    );
    RETURN true;
  END IF;

  UPDATE public.course_lessons SET
    module_id        = CASE WHEN p_lesson ? 'module_external_id' THEN v_module_id ELSE module_id END,
    slug             = CASE WHEN p_lesson ? 'slug'             THEN p_lesson->>'slug'             ELSE slug END,
    title            = CASE WHEN p_lesson ? 'title'            THEN p_lesson->>'title'            ELSE title END,
    description      = CASE WHEN p_lesson ? 'description'      THEN p_lesson->>'description'      ELSE description END,
    objective        = CASE WHEN p_lesson ? 'objective'        THEN p_lesson->>'objective'        ELSE objective END,
    sort_order       = CASE WHEN p_lesson ? 'sort_order'       THEN (p_lesson->>'sort_order')::integer ELSE sort_order END,
    duration_seconds = CASE WHEN p_lesson ? 'duration_seconds' THEN (p_lesson->>'duration_seconds')::integer ELSE duration_seconds END,
    video_provider   = CASE WHEN p_lesson ? 'video_provider'   THEN p_lesson->>'video_provider'   ELSE video_provider END,
    video_ref        = v_video_ref,
    short_ref        = CASE WHEN p_lesson ? 'short_ref'        THEN p_lesson->>'short_ref'        ELSE short_ref END,
    thumbnail_url    = CASE WHEN p_lesson ? 'thumbnail_url'    THEN p_lesson->>'thumbnail_url'    ELSE thumbnail_url END,
    transcript       = CASE WHEN p_lesson ? 'transcript'       THEN p_lesson->>'transcript'       ELSE transcript END,
    chapters         = CASE WHEN p_lesson ? 'chapters'         THEN p_lesson->'chapters'          ELSE chapters END,
    resources        = CASE WHEN p_lesson ? 'resources'        THEN p_lesson->'resources'         ELSE resources END,
    is_published     = v_published
  WHERE id = v_existing.id;
  RETURN false;
END;
$$;

-- ---------------------------------------------------------------------
-- POST /api/ingest/courses
-- p_payload = { course: {...}, modules?: [...], lessons: [...] } (already zod-validated)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ingest_upsert_course(
  p_payload jsonb,
  p_dry_run boolean DEFAULT false
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  c              jsonb := p_payload->'course';
  v_course       public.courses;
  v_product_id   uuid;
  v_item         jsonb;
  v_idx          integer;
  v_inserted     boolean;
  v_mod_created  integer := 0;
  v_mod_updated  integer := 0;
  v_les_created  integer := 0;
  v_les_updated  integer := 0;
  v_result       jsonb;
BEGIN
  BEGIN
    IF c ? 'product_slug' AND jsonb_typeof(c->'product_slug') <> 'null' THEN
      SELECT id INTO v_product_id FROM public.products WHERE slug = c->>'product_slug';
      IF v_product_id IS NULL THEN
        RAISE EXCEPTION 'unknown_product' USING
          ERRCODE = 'P0001',
          DETAIL  = format('No product with slug "%s". Products are created by the site owner.', c->>'product_slug'),
          HINT    = 'course.product_slug';
      END IF;
    END IF;

    SELECT * INTO v_course FROM public.courses WHERE external_id = c->>'external_id' FOR UPDATE;

    IF v_course.id IS NULL THEN
      INSERT INTO public.courses (external_id, slug, title, description, thumbnail_url, access, product_id, playlist_id)
      VALUES (
        c->>'external_id',
        coalesce(c->>'slug', c->>'external_id'),
        c->>'title',
        c->>'description',
        c->>'thumbnail_url',
        c->>'access',
        v_product_id,
        c->>'playlist_id'
      )
      RETURNING * INTO v_course;
    ELSE
      UPDATE public.courses SET
        slug          = CASE WHEN c ? 'slug'          THEN c->>'slug'          ELSE slug END,
        title         = c->>'title',
        description   = c->>'description',
        thumbnail_url = CASE WHEN c ? 'thumbnail_url' THEN c->>'thumbnail_url' ELSE thumbnail_url END,
        access        = c->>'access',
        product_id    = CASE WHEN c ? 'product_slug'  THEN v_product_id        ELSE product_id END,
        playlist_id   = CASE WHEN c ? 'playlist_id'   THEN c->>'playlist_id'   ELSE playlist_id END
      WHERE id = v_course.id
      RETURNING * INTO v_course;
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(coalesce(p_payload->'modules', '[]'::jsonb)) LOOP
      INSERT INTO public.course_modules (course_id, external_id, title, sort_order)
      VALUES (v_course.id, v_item->>'external_id', v_item->>'title', (v_item->>'sort_order')::integer)
      ON CONFLICT (course_id, external_id) DO UPDATE
        SET title = EXCLUDED.title, sort_order = EXCLUDED.sort_order
      RETURNING (xmax = 0) INTO v_inserted;
      IF v_inserted THEN v_mod_created := v_mod_created + 1; ELSE v_mod_updated := v_mod_updated + 1; END IF;
    END LOOP;

    v_idx := 0;
    FOR v_item IN SELECT * FROM jsonb_array_elements(coalesce(p_payload->'lessons', '[]'::jsonb)) LOOP
      IF public.ingest_write_lesson(v_course.id, v_item, 'lessons.' || v_idx || '.') THEN
        v_les_created := v_les_created + 1;
      ELSE
        v_les_updated := v_les_updated + 1;
      END IF;
      v_idx := v_idx + 1;
    END LOOP;

    v_result := jsonb_build_object(
      'course',  jsonb_build_object('id', v_course.id, 'external_id', v_course.external_id, 'slug', v_course.slug),
      'modules', jsonb_build_object('created', v_mod_created, 'updated', v_mod_updated),
      'lessons', jsonb_build_object('created', v_les_created, 'updated', v_les_updated)
    );

    IF p_dry_run THEN
      RAISE EXCEPTION 'dry_run' USING ERRCODE = 'PDRY1';  -- undo this block's writes
    END IF;
  EXCEPTION WHEN SQLSTATE 'PDRY1' THEN
    NULL;  -- writes rolled back; v_result (a local variable) is kept
  END;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------
-- PATCH /api/ingest/lessons/{external_id}
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ingest_patch_lesson(
  p_external_id text,
  p_patch       jsonb,
  p_dry_run     boolean DEFAULT false
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
  v_result    jsonb;
BEGIN
  BEGIN
    SELECT course_id INTO v_course_id FROM public.course_lessons WHERE external_id = p_external_id;
    IF v_course_id IS NULL THEN
      RAISE EXCEPTION 'lesson_not_found' USING
        ERRCODE = 'P0001',
        DETAIL  = format('No lesson with external_id "%s". Create it with POST /api/ingest/courses first.', p_external_id),
        HINT    = 'external_id';
    END IF;

    -- slug and external_id are rejected by the route's schema; strip them here too.
    PERFORM public.ingest_write_lesson(
      v_course_id,
      (p_patch - 'slug' - 'external_id') || jsonb_build_object('external_id', p_external_id),
      ''
    );

    SELECT jsonb_build_object(
             'id', l.id, 'external_id', l.external_id, 'slug', l.slug,
             'is_published', l.is_published, 'video_ref', l.video_ref, 'course_slug', c.slug)
      INTO v_result
    FROM public.course_lessons l
    JOIN public.courses c ON c.id = l.course_id
    WHERE l.external_id = p_external_id;

    IF p_dry_run THEN
      RAISE EXCEPTION 'dry_run' USING ERRCODE = 'PDRY1';
    END IF;
  EXCEPTION WHEN SQLSTATE 'PDRY1' THEN
    NULL;
  END;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------
-- GET /api/ingest/courses/{external_id}: state including unpublished lessons.
-- Returns NULL when the course doesn't exist. Transcripts are not returned,
-- only whether one is set.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ingest_get_course(p_external_id text)
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'course', jsonb_build_object(
      'id', c.id, 'external_id', c.external_id, 'slug', c.slug, 'title', c.title,
      'access', c.access, 'product_slug', p.slug, 'playlist_id', c.playlist_id,
      'thumbnail_url', c.thumbnail_url, 'updated_at', c.updated_at),
    'modules', coalesce((
      SELECT jsonb_agg(jsonb_build_object('external_id', m.external_id, 'title', m.title, 'sort_order', m.sort_order)
                       ORDER BY m.sort_order, m.external_id)
      FROM public.course_modules m WHERE m.course_id = c.id), '[]'::jsonb),
    'lessons', coalesce((
      SELECT jsonb_agg(jsonb_build_object(
               'external_id', l.external_id, 'slug', l.slug, 'module_external_id', m.external_id,
               'sort_order', l.sort_order, 'video_ref', l.video_ref, 'short_ref', l.short_ref,
               'is_published', l.is_published, 'has_transcript', l.transcript IS NOT NULL,
               'updated_at', l.updated_at)
             ORDER BY l.sort_order, l.external_id)
      FROM public.course_lessons l
      LEFT JOIN public.course_modules m ON m.id = l.module_id
      WHERE l.course_id = c.id), '[]'::jsonb)
  )
  FROM public.courses c
  LEFT JOIN public.products p ON p.id = c.product_id
  WHERE c.external_id = p_external_id;
$$;

-- ---------------------------------------------------------------------
-- Rate limiting: one row per (bucket, minute). Service role only.
-- ---------------------------------------------------------------------
CREATE TABLE public.ingest_rate_windows (
  bucket        text        NOT NULL CHECK (length(bucket) <= 64),
  window_start  timestamptz NOT NULL,
  hits          integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);
ALTER TABLE public.ingest_rate_windows ENABLE ROW LEVEL SECURITY;
-- No policies: anon/authenticated can never read or write it.
REVOKE ALL ON TABLE public.ingest_rate_windows FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.ingest_rate_hit(p_bucket text)
  RETURNS integer
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  v_hits integer;
BEGIN
  INSERT INTO public.ingest_rate_windows (bucket, window_start, hits)
  VALUES (p_bucket, date_trunc('minute', now()), 1)
  ON CONFLICT (bucket, window_start) DO UPDATE
    SET hits = public.ingest_rate_windows.hits + 1
  RETURNING hits INTO v_hits;

  DELETE FROM public.ingest_rate_windows WHERE window_start < now() - interval '1 hour';
  RETURN v_hits;
END;
$$;

-- ---------------------------------------------------------------------
-- Privileges: service_role only (Supabase grants new functions to anon and
-- authenticated by default, so revoke explicitly).
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.ingest_write_lesson(uuid, jsonb, text)        FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_upsert_course(jsonb, boolean)          FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_patch_lesson(text, jsonb, boolean)     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_rate_hit(text)                         FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_get_course(text)                       FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ingest_get_course(text)                    TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_write_lesson(uuid, jsonb, text)     TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_upsert_course(jsonb, boolean)       TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_patch_lesson(text, jsonb, boolean)  TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_rate_hit(text)                      TO service_role;

-- ---------------------------------------------------------------------
-- Storage: public bucket for course/product art (contract §2.4)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-thumbnails', 'course-thumbnails', true, 4194304,
        ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
