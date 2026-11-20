-- =====================================================================
-- Commerce (phase 2): purchases, subscriptions, entitlements, members-only
-- lesson gating, private product files (2026-11-20)
--
-- Provider-agnostic: every provider-specific id lives in a `provider_*` column next to a
-- `provider` column ('stripe' today, 'mukupay' later). Adding a provider needs no schema change.
--
-- Who writes what:
--   * The Stripe webhook (server route, service role) writes events, customers, purchases,
--     subscriptions and entitlements. Nothing here is writable from a browser.
--   * The owner (is_portfolio_admin()) can read everything and grant/revoke entitlements.
--   * A signed-in user can read only their own purchases, subscriptions and entitlements.
--
-- Access rule (single source of truth: public.has_membership / public.lesson_is_open):
--   a published lesson's full content (video, transcript, chapters, resources) is readable when
--   its course is free, or the lesson is a free preview, or the reader has an active membership,
--   or the reader is the owner. Everyone else gets only the outline (public.course_outline).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Access columns on the catalog
-- ---------------------------------------------------------------------
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_access_check;
ALTER TABLE public.courses
  ADD CONSTRAINT courses_access_check CHECK (access IN ('free', 'members'));

ALTER TABLE public.course_lessons
  ADD COLUMN access text NOT NULL DEFAULT 'inherit'
    CONSTRAINT course_lessons_access_check CHECK (access IN ('inherit', 'free_preview'));

COMMENT ON COLUMN public.course_lessons.access IS
  'inherit = same as the course; free_preview = open to everyone even in a members course.';

-- Owner switch: members-only lessons can't be published until commerce is live.
CREATE TABLE public.site_flags (
  name        text        PRIMARY KEY CHECK (name ~ '^[a-z_]{1,60}$'),
  enabled     boolean     NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manage site_flags" ON public.site_flags
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());
CREATE TRIGGER trg_site_flags_updated_at BEFORE UPDATE ON public.site_flags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_flags (name, enabled) VALUES ('members_content', false)
  ON CONFLICT (name) DO NOTHING;

-- Refuse to publish a members-only lesson (not a free preview) while members_content is off.
CREATE OR REPLACE FUNCTION public.guard_members_publish()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF NEW.is_published AND NEW.access = 'inherit'
     AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = NEW.course_id AND c.access = 'members')
     AND NOT COALESCE((SELECT enabled FROM public.site_flags WHERE name = 'members_content'), false)
  THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'members_content_disabled',
      DETAIL  = 'Members-only lessons can''t be published until memberships are live.';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_members_publish() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_course_lessons_members_publish
  BEFORE INSERT OR UPDATE OF is_published, access, course_id ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.guard_members_publish();

-- A course switched to members while it already has published, non-preview lessons would
-- silently lock content people could see before; make that an explicit owner decision.
CREATE OR REPLACE FUNCTION public.guard_course_members_switch()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF NEW.access = 'members' AND OLD.access IS DISTINCT FROM 'members'
     AND NOT COALESCE((SELECT enabled FROM public.site_flags WHERE name = 'members_content'), false)
     AND EXISTS (SELECT 1 FROM public.course_lessons l
                 WHERE l.course_id = NEW.id AND l.is_published AND l.access = 'inherit')
  THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'members_content_disabled',
      DETAIL  = 'This course has published lessons; memberships aren''t live yet.';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_course_members_switch() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_courses_members_switch
  BEFORE UPDATE OF access ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.guard_course_members_switch();

-- ---------------------------------------------------------------------
-- 2. Commerce tables
-- ---------------------------------------------------------------------

-- Every provider event we've seen, keyed on the provider's event id (idempotency).
CREATE TABLE public.commerce_events (
  provider       text        NOT NULL CHECK (provider ~ '^[a-z0-9_]{1,30}$'),
  event_id       text        NOT NULL CHECK (length(event_id) BETWEEN 1 AND 255),
  type           text        NOT NULL CHECK (length(type) BETWEEN 1 AND 120),
  received_at    timestamptz NOT NULL DEFAULT now(),
  processed_at   timestamptz,
  attempts       integer     NOT NULL DEFAULT 1,
  last_error     text        CHECK (length(last_error) <= 1000),
  PRIMARY KEY (provider, event_id)
);

-- Site user ↔ provider customer (needed for the billing portal and to attach subscriptions).
CREATE TABLE public.commerce_customers (
  user_id               uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  provider              text        NOT NULL CHECK (provider ~ '^[a-z0-9_]{1,30}$'),
  provider_customer_id  text        NOT NULL CHECK (length(provider_customer_id) BETWEEN 1 AND 255),
  created_at            timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider),
  UNIQUE (provider, provider_customer_id)
);

-- One-off purchases (source code).
CREATE TABLE public.purchases (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  product_id         uuid        NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  provider           text        NOT NULL CHECK (provider ~ '^[a-z0-9_]{1,30}$'),
  provider_order_id  text        NOT NULL CHECK (length(provider_order_id) BETWEEN 1 AND 255),
  provider_price_id  text        CHECK (length(provider_price_id) <= 255),
  amount_total       integer     CHECK (amount_total >= 0),   -- minor units, as charged (from the provider API)
  currency           text        CHECK (currency ~ '^[a-z]{3}$'),
  status             text        NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'refunded')),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_order_id)
);
CREATE INDEX idx_purchases_user ON public.purchases (user_id);

-- Membership subscriptions (the provider's view, mirrored).
CREATE TABLE public.subscriptions (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid        NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  provider                  text        NOT NULL CHECK (provider ~ '^[a-z0-9_]{1,30}$'),
  provider_subscription_id  text        NOT NULL CHECK (length(provider_subscription_id) BETWEEN 1 AND 255),
  provider_customer_id      text        CHECK (length(provider_customer_id) <= 255),
  provider_price_id         text        CHECK (length(provider_price_id) <= 255),
  plan                      text        CHECK (plan IN ('monthly', 'yearly')),
  -- normalised status; the provider's own word goes in provider_status
  status                    text        NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'paused')),
  provider_status           text        CHECK (length(provider_status) <= 60),
  current_period_end        timestamptz,
  cancel_at_period_end      boolean     NOT NULL DEFAULT false,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subscription_id)
);
CREATE INDEX idx_subscriptions_user ON public.subscriptions (user_id);

-- What a user may access. Derived from purchases/subscriptions by the webhook, or granted by
-- the owner. Access checks read only this table.
CREATE TABLE public.entitlements (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  kind        text        NOT NULL CHECK (kind IN ('membership', 'product')),
  product_id  uuid        REFERENCES public.products (id) ON DELETE RESTRICT,
  provider    text        NOT NULL CHECK (provider ~ '^[a-z0-9_]{1,30}$'),  -- 'stripe', …, or 'admin' for grants
  source      text        NOT NULL CHECK (source IN ('subscription', 'purchase', 'grant')),
  source_ref  text        NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 255), -- provider sub/order id, or a grant id
  starts_at   timestamptz NOT NULL DEFAULT now(),
  ends_at     timestamptz,                 -- NULL = no end (purchases, lifetime grants)
  revoked_at  timestamptz,
  note        text        CHECK (length(note) <= 500),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entitlements_product_matches_kind CHECK ((kind = 'product') = (product_id IS NOT NULL)),
  UNIQUE (provider, source, source_ref)
);
CREATE INDEX idx_entitlements_user_active ON public.entitlements (user_id, kind) WHERE revoked_at IS NULL;

CREATE TRIGGER trg_purchases_updated_at     BEFORE UPDATE ON public.purchases     FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_entitlements_updated_at  BEFORE UPDATE ON public.entitlements  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Paid files (source-code zips). Objects live in the private `product-files` bucket and are
-- handed out only as short-lived signed URLs by the server, after an entitlement check.
CREATE TABLE public.product_files (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  storage_path  text        NOT NULL UNIQUE CHECK (storage_path ~ '^[a-z0-9][a-z0-9/._-]{0,250}$' AND storage_path !~ '\.\.'),
  filename      text        NOT NULL CHECK (length(filename) BETWEEN 1 AND 200),
  version       text        CHECK (length(version) <= 40),
  size_bytes    bigint      CHECK (size_bytes >= 0),
  is_current    boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_files_product ON public.product_files (product_id) WHERE is_current;

-- ---------------------------------------------------------------------
-- 3. RLS
-- ---------------------------------------------------------------------
ALTER TABLE public.commerce_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerce_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files      ENABLE ROW LEVEL SECURITY;

-- commerce_events: service role only (no policies at all), and no table privileges either.
REVOKE ALL ON public.commerce_events FROM anon, authenticated;

-- Customers: the owner only (users never need their provider customer id).
REVOKE ALL ON public.commerce_customers FROM anon;
CREATE POLICY "owner read commerce_customers" ON public.commerce_customers
  FOR SELECT TO authenticated USING (public.is_portfolio_admin());

-- Purchases / subscriptions: readable by their owner and by the site owner. No client writes.
REVOKE ALL ON public.purchases, public.subscriptions FROM anon;
CREATE POLICY "user read own purchases" ON public.purchases
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_portfolio_admin());
CREATE POLICY "user read own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_portfolio_admin());

-- Entitlements: readable by their owner; the site owner can read and grant/revoke.
REVOKE ALL ON public.entitlements FROM anon;
CREATE POLICY "user read own entitlements" ON public.entitlements
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_portfolio_admin());
CREATE POLICY "owner manage entitlements" ON public.entitlements
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

-- Product files: owner only. Buyers never read this table; the server does, after a check.
REVOKE ALL ON public.product_files FROM anon;
CREATE POLICY "owner manage product_files" ON public.product_files
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

-- ---------------------------------------------------------------------
-- 4. Access functions
-- ---------------------------------------------------------------------

-- Does this user have an active membership right now?
CREATE OR REPLACE FUNCTION public.has_membership(p_user_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT p_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.entitlements e
    WHERE e.user_id = p_user_id
      AND e.kind = 'membership'
      AND e.revoked_at IS NULL
      AND e.starts_at <= now()
      AND (e.ends_at IS NULL OR e.ends_at > now())
  );
$$;
REVOKE ALL ON FUNCTION public.has_membership(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_membership(uuid) TO service_role;

-- The caller's own membership (what pages and policies use).
CREATE OR REPLACE FUNCTION public.i_am_member()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT public.has_membership(auth.uid());
$$;
REVOKE ALL ON FUNCTION public.i_am_member() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.i_am_member() TO anon, authenticated, service_role;

-- Is this lesson open to everyone (free course, or a free preview)? Ignores publish state.
CREATE OR REPLACE FUNCTION public.lesson_is_open(p_course_id uuid, p_access text)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT p_access = 'free_preview'
      OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = p_course_id AND c.access = 'free');
$$;
REVOKE ALL ON FUNCTION public.lesson_is_open(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lesson_is_open(uuid, text) TO anon, authenticated, service_role;

-- Lesson rows (with video, transcript, chapters, resources) are readable only when open or
-- the reader is a member. The owner policy ("owner manage course_lessons") still covers drafts.
DROP POLICY IF EXISTS "public read published lessons" ON public.course_lessons;
CREATE POLICY "public read published lessons" ON public.course_lessons
  FOR SELECT TO anon, authenticated
  USING (is_published AND (public.lesson_is_open(course_id, access) OR public.i_am_member()));

-- The outline of a live course: safe columns of every published lesson, locked or not, so
-- visitors can see what a members course contains. No video, transcript, chapters or resources.
CREATE OR REPLACE FUNCTION public.course_outline(p_course_id uuid)
  RETURNS TABLE (
    id uuid, course_id uuid, module_id uuid, external_id text, slug text, title text,
    description text, objective text, sort_order integer, duration_seconds integer,
    thumbnail_url text, access text, is_open boolean
  )
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT l.id, l.course_id, l.module_id, l.external_id, l.slug, l.title,
         l.description, l.objective, l.sort_order, l.duration_seconds,
         l.thumbnail_url, l.access, public.lesson_is_open(l.course_id, l.access)
  FROM public.course_lessons l
  WHERE l.course_id = p_course_id AND l.is_published
  ORDER BY l.sort_order;
$$;
REVOKE ALL ON FUNCTION public.course_outline(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.course_outline(uuid) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- 5. Private bucket for paid files (no storage policies = nobody but the service role)
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-files', 'product-files', false, 524288000,
        ARRAY['application/zip', 'application/x-zip-compressed', 'application/octet-stream'])
ON CONFLICT (id) DO UPDATE SET public = false;
