-- =====================================================================
-- Ingest: one token per sender, one sender per course (2026-11-20)
-- docs/ingest/CONTRACT.md v0.2.1
--
-- * courses.source records the sender that created the course
--   ('ytfactory' | 'studio'; 'admin' reserved for courses made in the admin).
-- * ingest_upsert_course / ingest_patch_lesson take p_sender. A sender may only
--   change courses (and their lessons) it created:
--   RAISE 'course_owned_by_other_sender' (P0001) → HTTP 409.
-- * p_sender defaults to 'ytfactory' so the previous deployment, which calls the
--   functions without it, keeps working until the new code is live.
-- * ingest_get_course also returns course.source.
-- =====================================================================

ALTER TABLE public.courses
  ADD CONSTRAINT courses_source_check CHECK (source IN ('ytfactory', 'studio', 'admin'));

-- Signatures change, so drop and recreate (one transaction: no gap).
DROP FUNCTION public.ingest_upsert_course(jsonb, boolean);
DROP FUNCTION public.ingest_patch_lesson(text, jsonb, boolean);

CREATE OR REPLACE FUNCTION public.ingest_assert_sender(p_sender text)
  RETURNS void
  LANGUAGE plpgsql
  IMMUTABLE
  SET search_path = public
AS $$
BEGIN
  IF p_sender IS NULL OR p_sender NOT IN ('ytfactory', 'studio') THEN
    RAISE EXCEPTION 'invalid sender' USING ERRCODE = '22023';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------
-- POST /api/ingest/courses
-- ---------------------------------------------------------------------
CREATE FUNCTION public.ingest_upsert_course(
  p_payload jsonb,
  p_dry_run boolean DEFAULT false,
  p_sender  text    DEFAULT 'ytfactory'
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
  PERFORM public.ingest_assert_sender(p_sender);

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

    IF v_course.id IS NOT NULL AND v_course.source <> p_sender THEN
      RAISE EXCEPTION 'course_owned_by_other_sender' USING
        ERRCODE = 'P0001',
        DETAIL  = format('Course "%s" is managed by another sender (%s).', v_course.external_id, v_course.source),
        HINT    = 'course.external_id';
    END IF;

    IF v_course.id IS NULL THEN
      INSERT INTO public.courses (external_id, slug, title, description, thumbnail_url, access, product_id, playlist_id, source)
      VALUES (
        c->>'external_id',
        coalesce(c->>'slug', c->>'external_id'),
        c->>'title',
        c->>'description',
        c->>'thumbnail_url',
        c->>'access',
        v_product_id,
        c->>'playlist_id',
        p_sender
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
      RAISE EXCEPTION 'dry_run' USING ERRCODE = 'PDRY1';
    END IF;
  EXCEPTION WHEN SQLSTATE 'PDRY1' THEN
    NULL;
  END;

  RETURN v_result;
END;
$$;

-- ---------------------------------------------------------------------
-- PATCH /api/ingest/lessons/{external_id}
-- ---------------------------------------------------------------------
CREATE FUNCTION public.ingest_patch_lesson(
  p_external_id text,
  p_patch       jsonb,
  p_dry_run     boolean DEFAULT false,
  p_sender      text    DEFAULT 'ytfactory'
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
  v_source    text;
  v_result    jsonb;
BEGIN
  PERFORM public.ingest_assert_sender(p_sender);

  BEGIN
    SELECT l.course_id, c.source INTO v_course_id, v_source
    FROM public.course_lessons l
    JOIN public.courses c ON c.id = l.course_id
    WHERE l.external_id = p_external_id;

    IF v_course_id IS NULL THEN
      RAISE EXCEPTION 'lesson_not_found' USING
        ERRCODE = 'P0001',
        DETAIL  = format('No lesson with external_id "%s". Create it with POST /api/ingest/courses first.', p_external_id),
        HINT    = 'external_id';
    END IF;

    IF v_source <> p_sender THEN
      RAISE EXCEPTION 'course_owned_by_other_sender' USING
        ERRCODE = 'P0001',
        DETAIL  = format('Lesson "%s" belongs to a course managed by another sender (%s).', p_external_id, v_source),
        HINT    = 'external_id';
    END IF;

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
-- GET: add course.source
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
      'access', c.access, 'source', c.source, 'product_slug', p.slug, 'playlist_id', c.playlist_id,
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
-- Privileges: service_role only
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.ingest_assert_sender(text)                       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_upsert_course(jsonb, boolean, text)       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ingest_patch_lesson(text, jsonb, boolean, text)  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ingest_assert_sender(text)                    TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_upsert_course(jsonb, boolean, text)    TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_patch_lesson(text, jsonb, boolean, text) TO service_role;
