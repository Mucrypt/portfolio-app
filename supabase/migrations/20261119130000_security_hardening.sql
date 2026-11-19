-- =====================================================================
-- Security hardening (2026-11-19)
--
-- Fixes found while auditing the pulled baseline (20261119122323_remote_schema.sql):
--  1. services / service_reviews / service_inquiries: "admin" policies only checked
--     auth.uid() IS NOT NULL, so ANY signed-up visitor could read every inquiry
--     (names, emails, phones), and edit/delete services and reviews.
--  2. profiles: readable by anyone (USING true), exposing the owner's email + phone.
--     Now owner-only; the public reads a column-limited view instead.
--  3. Storage: any authenticated user could upload/overwrite/delete in every bucket.
--  4. blog_post_views / user_activity_log: anyone could insert arbitrary rows.
--  5. SECURITY DEFINER functions without a fixed search_path.
--
-- Owner check everywhere: public.is_portfolio_admin() (already in the baseline):
-- true when auth.uid() owns a row in public.profiles.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 5. Pin search_path on SECURITY DEFINER functions (prevents search_path hijacking)
-- ---------------------------------------------------------------------
ALTER FUNCTION public.is_portfolio_admin()       SET search_path = public;
ALTER FUNCTION public.is_admin(uuid)             SET search_path = public;
ALTER FUNCTION public.is_public_user()           SET search_path = public;
ALTER FUNCTION public.get_user_type()            SET search_path = public;
ALTER FUNCTION public.get_public_user()          SET search_path = public;
ALTER FUNCTION public.update_user_last_login()   SET search_path = public;

-- is_admin(uuid) answers "is this arbitrary user id the owner?" — nothing in the app
-- calls it, so don't let anonymous or signed-in clients probe it.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------
-- 1. Owner-only management of services, reviews and service inquiries
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "admin_manage_services" ON public.services;
CREATE POLICY "owner_manage_services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "admin_manage_reviews" ON public.service_reviews;
CREATE POLICY "owner_manage_reviews" ON public.service_reviews
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "admin_manage_inquiries" ON public.service_inquiries;
CREATE POLICY "owner_manage_inquiries" ON public.service_inquiries
  FOR ALL TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());
-- ("anyone_insert_inquiry" stays: the public services pages submit inquiries.)

-- Same intent, sturdier check (the old ones used "IN (SELECT owner_user_id FROM profiles LIMIT 1)").
DROP POLICY IF EXISTS "Admin can view all inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Admin can update inquiries" ON public.contact_inquiries;
CREATE POLICY "owner_read_contact_inquiries" ON public.contact_inquiries
  FOR SELECT TO authenticated USING (public.is_portfolio_admin());
CREATE POLICY "owner_update_contact_inquiries" ON public.contact_inquiries
  FOR UPDATE TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can view all service requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admin can update service requests" ON public.service_requests;
CREATE POLICY "owner_read_service_requests" ON public.service_requests
  FOR SELECT TO authenticated USING (public.is_portfolio_admin());
CREATE POLICY "owner_update_service_requests" ON public.service_requests
  FOR UPDATE TO authenticated
  USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can view all activity" ON public.user_activity_log;
CREATE POLICY "owner_read_activity" ON public.user_activity_log
  FOR SELECT TO authenticated USING (public.is_portfolio_admin());

-- ---------------------------------------------------------------------
-- 2. profiles: owner-only table, public column-limited view
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "public read profiles" ON public.profiles;
CREATE POLICY "owner read profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_user_id);
-- ("owner write profiles" from the baseline stays.)

-- Everything the public site may show — deliberately WITHOUT email and phone.
-- A plain (definer) view: it reads profiles as the view owner, so it bypasses the
-- owner-only policy above but can only ever return these columns.
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id, owner_user_id, full_name, headline, location, bio, role_tags, avatar_url,
  cv_url, socials, updated_at, public_slug, portfolio_title, hero_video_url,
  hero_background_image, story_title, story_subtitle, featured_quote,
  featured_quote_author, gallery_images, gallery_videos, achievements, milestones,
  fun_facts, testimonials, story_sections, call_to_action
FROM public.profiles;

REVOKE ALL ON public.public_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_profiles TO anon, authenticated;

COMMENT ON VIEW public.public_profiles IS
  'Public, column-limited view of profiles (no email/phone). The site reads this; profiles itself is owner-only.';

-- ---------------------------------------------------------------------
-- 4. No more anonymous junk inserts
-- ---------------------------------------------------------------------
-- Nothing in the app writes blog_post_views from the client; inserts now need the
-- service role (server-side).
DROP POLICY IF EXISTS "system_insert_views" ON public.blog_post_views;

-- The activity logger may record a row for "nobody" or for the signed-in user only.
DROP POLICY IF EXISTS "System can insert activity" ON public.user_activity_log;
CREATE POLICY "insert own or anonymous activity" ON public.user_activity_log
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    user_id IS NULL
    OR user_id IN (SELECT pu.id FROM public.public_users pu WHERE pu.auth_user_id = auth.uid())
  );

-- ---------------------------------------------------------------------
-- 3. Storage: only the owner writes to the site's content buckets
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload shop images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update shop images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete shop images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload courses images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update courses images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete courses images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload projects images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update projects images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete projects images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete course videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload service videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update service videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete service videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update media videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media videos" ON storage.objects;

CREATE POLICY "Owner can upload site content" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN (
      'blog-images', 'shop-images', 'services-images', 'courses-images',
      'projects-images', 'media-library',
      'course-videos', 'blog-videos', 'project-videos', 'service-videos', 'media-videos'
    )
    AND public.is_portfolio_admin()
  );

CREATE POLICY "Owner can update site content" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id IN (
      'blog-images', 'shop-images', 'services-images', 'courses-images',
      'projects-images', 'media-library',
      'course-videos', 'blog-videos', 'project-videos', 'service-videos', 'media-videos'
    )
    AND public.is_portfolio_admin()
  )
  WITH CHECK (
    bucket_id IN (
      'blog-images', 'shop-images', 'services-images', 'courses-images',
      'projects-images', 'media-library',
      'course-videos', 'blog-videos', 'project-videos', 'service-videos', 'media-videos'
    )
    AND public.is_portfolio_admin()
  );

CREATE POLICY "Owner can delete site content" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id IN (
      'blog-images', 'shop-images', 'services-images', 'courses-images',
      'projects-images', 'media-library',
      'course-videos', 'blog-videos', 'project-videos', 'service-videos', 'media-videos'
    )
    AND public.is_portfolio_admin()
  );
-- ("Public can view …" SELECT policies stay: these buckets serve public site media.)
