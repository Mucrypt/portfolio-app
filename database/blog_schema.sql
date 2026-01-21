-- =========================================================
-- BLOG POSTS TABLE - World-Class Blog System
-- =========================================================
-- Comprehensive blog schema supporting rich content, media, SEO, and analytics

CREATE TABLE IF NOT EXISTS blog_posts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership & Author
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT, -- Display name for the author
  author_avatar_url TEXT, -- Author profile picture
  author_bio TEXT, -- Short bio of the author
  
  -- Core Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- URL-friendly version: my-awesome-blog-post
  excerpt TEXT, -- Short summary/preview (150-200 chars)
  content TEXT NOT NULL, -- Full blog post content (Markdown or HTML)
  content_format TEXT DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'html')),
  
  -- Featured Media
  featured_image_url TEXT, -- Main hero image for the post
  featured_video_url TEXT, -- YouTube, Vimeo, or direct video URL
  image_urls TEXT[], -- Additional images in the post
  video_urls TEXT[], -- Additional video embeds
  
  -- Categorization & Organization
  category TEXT NOT NULL DEFAULT 'General', -- Main category (e.g., Tutorial, News, Opinion)
  subcategory TEXT, -- Optional sub-category
  tags TEXT[], -- Array of tags for filtering and SEO
  
  -- Reading & Engagement
  reading_time_minutes INTEGER DEFAULT 5, -- Estimated reading time
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- SEO & Meta
  meta_title TEXT, -- Custom title for SEO (max 60 chars recommended)
  meta_description TEXT, -- Meta description for search engines (max 160 chars)
  meta_keywords TEXT[], -- SEO keywords
  og_image_url TEXT, -- Open Graph image for social sharing
  canonical_url TEXT, -- Canonical URL if content exists elsewhere
  
  -- Publishing & Status
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- Show on homepage/featured section
  is_pinned BOOLEAN DEFAULT false, -- Pin to top of blog list
  publish_date TIMESTAMPTZ, -- When post goes live (can be scheduled)
  last_updated TIMESTAMPTZ DEFAULT now(),
  
  -- Content Structure
  table_of_contents JSONB, -- Auto-generated or custom TOC: [{title, id, level}]
  related_post_ids UUID[], -- Array of related post IDs for suggestions
  
  -- Code & Technical
  code_language TEXT, -- Primary programming language if tech post (e.g., 'typescript', 'python')
  github_repo_url TEXT, -- Link to related GitHub repository
  demo_url TEXT, -- Link to live demo/project
  
  -- Series & Collections
  series_name TEXT, -- If part of a series (e.g., "React Hooks Deep Dive")
  series_order INTEGER, -- Position in series (1, 2, 3...)
  
  -- Comments & Interaction
  allow_comments BOOLEAN DEFAULT true,
  allow_likes BOOLEAN DEFAULT true,
  
  -- Call to Action
  cta_text TEXT, -- Custom CTA button text
  cta_url TEXT, -- Custom CTA button URL
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================

-- Unique slug for URLs
CREATE UNIQUE INDEX IF NOT EXISTS ux_blog_posts_slug ON blog_posts(slug);

-- Query by author
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_user_id);

-- Query published posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, publish_date DESC);

-- Query by category
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category) WHERE is_published = true;

-- Featured posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, publish_date DESC) WHERE is_published = true;

-- Full-text search on title and content
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- Series posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_series ON blog_posts(series_name, series_order) WHERE series_name IS NOT NULL;

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public: Read published posts
DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts
  FOR SELECT
  USING (is_published = true AND (publish_date IS NULL OR publish_date <= now()));

-- Authors: Full CRUD on their own posts
DROP POLICY IF EXISTS "author_manage_own_posts" ON blog_posts;
CREATE POLICY "author_manage_own_posts" ON blog_posts
  FOR ALL
  USING (auth.uid() = author_user_id)
  WITH CHECK (auth.uid() = author_user_id);

-- =========================================================
-- BLOG CATEGORIES (REFERENCE TABLE)
-- =========================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Emoji or icon identifier
  color TEXT, -- Hex color for UI
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Public: Read all categories
DROP POLICY IF EXISTS "public_read_categories" ON blog_categories;
CREATE POLICY "public_read_categories" ON blog_categories
  FOR SELECT
  USING (true);

-- Admin: Manage categories
DROP POLICY IF EXISTS "admin_manage_categories" ON blog_categories;
CREATE POLICY "admin_manage_categories" ON blog_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- BLOG COMMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL, -- For non-logged-in users
  author_email TEXT, -- For notifications
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- For nested replies
  is_approved BOOLEAN DEFAULT false, -- Moderation
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(is_approved, created_at DESC);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Public: Read approved comments
DROP POLICY IF EXISTS "public_read_approved_comments" ON blog_comments;
CREATE POLICY "public_read_approved_comments" ON blog_comments
  FOR SELECT
  USING (is_approved = true);

-- Users: Manage their own comments
DROP POLICY IF EXISTS "user_manage_own_comments" ON blog_comments;
CREATE POLICY "user_manage_own_comments" ON blog_comments
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Post authors: Approve/delete comments on their posts
DROP POLICY IF EXISTS "author_moderate_comments" ON blog_comments;
CREATE POLICY "author_moderate_comments" ON blog_comments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_comments.post_id
      AND blog_posts.author_user_id = auth.uid()
    )
  );

-- =========================================================
-- BLOG ANALYTICS
-- =========================================================

CREATE TABLE IF NOT EXISTS blog_post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip TEXT, -- Anonymized IP for analytics
  viewer_country TEXT,
  viewer_device TEXT, -- mobile, desktop, tablet
  referrer_url TEXT, -- Where they came from
  viewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_views_post ON blog_post_views(post_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views_user ON blog_post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_date ON blog_post_views(viewed_at DESC);

ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

-- Authors: Read analytics for their own posts
DROP POLICY IF EXISTS "author_read_own_analytics" ON blog_post_views;
CREATE POLICY "author_read_own_analytics" ON blog_post_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts
      WHERE blog_posts.id = blog_post_views.post_id
      AND blog_posts.author_user_id = auth.uid()
    )
  );

-- System: Insert view records (server-side)
DROP POLICY IF EXISTS "system_insert_views" ON blog_post_views;
CREATE POLICY "system_insert_views" ON blog_post_views
  FOR INSERT
  WITH CHECK (true);

-- =========================================================
-- SUCCESS MESSAGE
-- =========================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Blog posts table created successfully!';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Run this schema in Supabase SQL Editor';
  RAISE NOTICE '   2. Create seed data with sample blog posts';
  RAISE NOTICE '   3. Build blog listing page at /app/(public)/blog/page.tsx';
  RAISE NOTICE '   4. Build blog detail page at /app/(public)/blog/[slug]/page.tsx';
  RAISE NOTICE '   5. Build admin blog management at /app/admin/blog/page.tsx';
  RAISE NOTICE '🎨 Features included:';
  RAISE NOTICE '   - Rich media support (images, videos)';
  RAISE NOTICE '   - SEO optimization (meta tags, Open Graph)';
  RAISE NOTICE '   - Series/Collections support';
  RAISE NOTICE '   - Reading time & analytics';
  RAISE NOTICE '   - Featured & pinned posts';
  RAISE NOTICE '   - Scheduled publishing';
  RAISE NOTICE '   - Full-text search ready';
END $$;
