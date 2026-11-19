-- =====================================================================
-- Catalog: products, courses, course_modules, course_lessons (2026-11-19)
--
-- Shapes follow docs/ingest/CONTRACT.md v0.1 and lib/catalog/types.ts.
-- Reads:  public (anon) sees only what is live: non-draft products, published
--         lessons, and courses/modules that have at least one published lesson.
-- Writes: the owner (public.is_portfolio_admin()) from admin, or server routes
--         using the service role (ingest API, Lemon Squeezy webhook) — the service
--         role bypasses RLS and is never exposed to browsers.
-- Commerce tables (offers, purchases, subscriptions, entitlements) come in a
-- separate phase-2 migration.
-- =====================================================================

-- ---------------------------------------------------------------------
-- products: anything Romeo sells or showcases (app, source code, software, bundle)
-- ---------------------------------------------------------------------
CREATE TABLE public.products (
  id                         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                       text        NOT NULL UNIQUE
                                         CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 120),
  kind                       text        NOT NULL DEFAULT 'source_code'
                                         CHECK (kind IN ('app', 'source_code', 'software', 'course_bundle')),
  title                      text        NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  tagline                    text        CHECK (length(tagline) <= 200),
  pitch                      text        CHECK (length(pitch) <= 5000),
  for_whom                   text[]      NOT NULL DEFAULT '{}',
  stack                      text[]      NOT NULL DEFAULT '{}',
  source_code_includes       text[]      NOT NULL DEFAULT '{}',
  platforms                  text[]      NOT NULL DEFAULT '{}',
  live_url                   text        CHECK (live_url ~ '^https://'),
  download_url               text        CHECK (download_url ~ '^https://'),
  feature_suggestion_url     text        CHECK (feature_suggestion_url ~ '^https://'),
  showcase_video_ref         text        CHECK (showcase_video_ref ~ '^[A-Za-z0-9_-]{11}$'),
  showcase_duration_seconds  integer     CHECK (showcase_duration_seconds >= 0),
  -- [{ "src": "/products/<slug>/x.png" | "https://…", "label": "…", "alt"?: "…", "demo_data"?: bool }]
  screenshots                jsonb       NOT NULL DEFAULT '[]'::jsonb
                                         CHECK (jsonb_typeof(screenshots) = 'array'),
  status                     text        NOT NULL DEFAULT 'draft'
                                         CHECK (status IN ('draft', 'coming_soon', 'available', 'archived')),
  sort_order                 integer     NOT NULL DEFAULT 0,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.products IS
  'Catalog of everything Romeo builds and sells. Prices/provider ids live in commerce tables (phase 2), never here.';

CREATE INDEX idx_products_status_sort ON public.products (status, sort_order);

-- ---------------------------------------------------------------------
-- courses: Romeo's own (free) courses, one per series
-- ---------------------------------------------------------------------
CREATE TABLE public.courses (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id    text        NOT NULL UNIQUE
                             CHECK (external_id ~ '^[a-z0-9-]{1,120}$'),
  slug           text        NOT NULL UNIQUE
                             CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
  title          text        NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  description    text        NOT NULL CHECK (length(description) BETWEEN 1 AND 5000),
  thumbnail_url  text        CHECK (thumbnail_url ~ '^https://'),
  access         text        NOT NULL DEFAULT 'free'
                             CHECK (access IN ('free', 'paid', 'members')),
  product_id     uuid        REFERENCES public.products (id) ON DELETE SET NULL,
  playlist_id    text        CHECK (playlist_id ~ '^[A-Za-z0-9_-]{10,64}$'),
  source         text        NOT NULL DEFAULT 'ytfactory',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_product ON public.courses (product_id);

-- ---------------------------------------------------------------------
-- course_modules: optional grouping of lessons inside a course
-- ---------------------------------------------------------------------
CREATE TABLE public.course_modules (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    uuid        NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  external_id  text        NOT NULL CHECK (external_id ~ '^[a-z0-9-]{1,120}$'),
  title        text        NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  sort_order   integer     NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, external_id),
  UNIQUE (id, course_id)          -- target for the lessons' composite FK below
);

-- ---------------------------------------------------------------------
-- course_lessons: one episode = one lesson (YouTube video)
-- ---------------------------------------------------------------------
CREATE TABLE public.course_lessons (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         uuid        NOT NULL REFERENCES public.courses (id) ON DELETE CASCADE,
  module_id         uuid,
  external_id       text        NOT NULL UNIQUE             -- globally unique (contract §2.1)
                                CHECK (external_id ~ '^[a-z0-9-]{1,120}$'),
  slug              text        NOT NULL CHECK (slug ~ '^[a-z0-9-]{1,120}$'),
  title             text        NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  description       text        NOT NULL DEFAULT '' CHECK (length(description) <= 5000),
  objective         text        CHECK (length(objective) <= 1000),
  sort_order        integer     NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  duration_seconds  integer     CHECK (duration_seconds >= 0),
  video_provider    text        NOT NULL DEFAULT 'youtube' CHECK (video_provider IN ('youtube')),
  video_ref         text        CHECK (video_ref ~ '^[A-Za-z0-9_-]{11}$'),
  short_ref         text        CHECK (short_ref ~ '^[A-Za-z0-9_-]{11}$'),
  thumbnail_url     text        CHECK (thumbnail_url ~ '^https://'),
  transcript        text        CHECK (length(transcript) <= 100000),
  -- [{ "start": 37.9, "title": "…" }]
  chapters          jsonb       NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(chapters) = 'array'),
  -- [{ "label": "…", "url": "https://…", "type": "link|repo|doc|file" }]
  resources         jsonb       NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(resources) = 'array'),
  is_published      boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, slug),
  -- A lesson's module must belong to the same course (skipped when module_id is NULL).
  FOREIGN KEY (module_id, course_id) REFERENCES public.course_modules (id, course_id) ON DELETE SET NULL (module_id),
  -- Never show a lesson whose video isn't set (contract: publish_requires_video_ref).
  CONSTRAINT course_lessons_publish_requires_video CHECK (NOT is_published OR video_ref IS NOT NULL)
);

CREATE INDEX idx_course_lessons_course_sort ON public.course_lessons (course_id, sort_order);
CREATE INDEX idx_course_lessons_published   ON public.course_lessons (course_id) WHERE is_published;

-- ---------------------------------------------------------------------
-- updated_at triggers (reuse the baseline's set_updated_at())
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_products_updated_at       BEFORE UPDATE ON public.products       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_courses_updated_at        BEFORE UPDATE ON public.courses        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_course_modules_updated_at BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Is this course live (has at least one published lesson)?
-- SECURITY DEFINER so policies on courses/modules don't recurse through lesson RLS.
CREATE OR REPLACE FUNCTION public.course_is_live(p_course_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_lessons l
    WHERE l.course_id = p_course_id AND l.is_published
  );
$$;
REVOKE ALL ON FUNCTION public.course_is_live(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.course_is_live(uuid) TO anon, authenticated;

-- Public reads: only what is live.
CREATE POLICY "public read live products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (status IN ('coming_soon', 'available'));

CREATE POLICY "public read live courses" ON public.courses
  FOR SELECT TO anon, authenticated
  USING (public.course_is_live(id));

CREATE POLICY "public read modules of live courses" ON public.course_modules
  FOR SELECT TO anon, authenticated
  USING (public.course_is_live(course_id));

CREATE POLICY "public read published lessons" ON public.course_lessons
  FOR SELECT TO anon, authenticated
  USING (is_published);

-- Owner: full access (admin UI). The ingest API and webhooks use the service role.
CREATE POLICY "owner manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "owner manage courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "owner manage course_modules" ON public.course_modules
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

CREATE POLICY "owner manage course_lessons" ON public.course_lessons
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

-- Column-level: the transcript is large; the list pages never select it, but there's
-- nothing secret in it, so no extra restriction beyond "published".
