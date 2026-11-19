-- =====================================================================
-- Retire placeholder content (2026-11-19)
--
-- Decided by Romeo: hide everything that isn't his own real work. Nothing is
-- deleted — rows are only unpublished, so any of it can be restored later.
--
--  * blog_posts: all 9 were placeholder ideas (one claims "10,000 users").
--  * courses: 13 affiliate listings of other people's Udemy courses. The table is
--    renamed to affiliate_courses so the name `courses` can hold Romeo's own
--    courses (next migration).
--  * shop_products: 12 seeded affiliate/digital products. /shop now redirects to
--    /products.
--  * service_reviews: none are approved today; this keeps it that way explicitly.
-- =====================================================================

UPDATE public.blog_posts      SET is_published = false WHERE is_published IS DISTINCT FROM false;
UPDATE public.shop_products   SET is_published = false WHERE is_published IS DISTINCT FROM false;
UPDATE public.service_reviews SET is_approved  = false WHERE is_approved  IS DISTINCT FROM false;

-- Old affiliate courses → affiliate_courses (kept for history, unpublished).
UPDATE public.courses SET is_published = false WHERE is_published IS DISTINCT FROM false;

ALTER TABLE public.courses RENAME TO affiliate_courses;

-- Index/constraint names are schema-wide; rename them so the new `courses`
-- table can use the natural names.
ALTER TABLE public.affiliate_courses RENAME CONSTRAINT courses_pkey TO affiliate_courses_pkey;
ALTER INDEX public.idx_courses_category RENAME TO idx_affiliate_courses_category;
ALTER INDEX public.idx_courses_featured RENAME TO idx_affiliate_courses_featured;
ALTER INDEX public.idx_courses_owner    RENAME TO idx_affiliate_courses_owner;
ALTER INDEX public.idx_courses_platform RENAME TO idx_affiliate_courses_platform;
ALTER INDEX public.ux_courses_slug      RENAME TO ux_affiliate_courses_slug;
ALTER TRIGGER trg_courses_updated_at ON public.affiliate_courses RENAME TO trg_affiliate_courses_updated_at;

COMMENT ON TABLE public.affiliate_courses IS
  'Retired 2026-11-19: old affiliate listings (other people''s courses). Unpublished; kept for history.';
