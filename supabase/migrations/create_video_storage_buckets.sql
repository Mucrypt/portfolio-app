-- =====================================================
-- Video Storage Buckets Migration
-- Creates storage buckets for video content
-- Optimized for fast loading (YouTube/Udemy style)
-- =====================================================

-- Create course-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- Create blog-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-videos',
  'blog-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- Create project-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-videos',
  'project-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- Create service-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'service-videos',
  'service-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- Create media-videos bucket (general purpose)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-videos',
  'media-videos',
  true,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Storage Policies for course-videos
-- =====================================================

-- Allow public to view videos
CREATE POLICY "Public can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload course videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-videos');

-- Allow authenticated users to update their videos
CREATE POLICY "Authenticated users can update course videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-videos')
WITH CHECK (bucket_id = 'course-videos');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete course videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-videos');

-- =====================================================
-- Storage Policies for blog-videos
-- =====================================================

CREATE POLICY "Public can view blog videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-videos');

CREATE POLICY "Authenticated users can upload blog videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-videos');

CREATE POLICY "Authenticated users can update blog videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-videos')
WITH CHECK (bucket_id = 'blog-videos');

CREATE POLICY "Authenticated users can delete blog videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-videos');

-- =====================================================
-- Storage Policies for project-videos
-- =====================================================

CREATE POLICY "Public can view project videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-videos');

CREATE POLICY "Authenticated users can upload project videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Authenticated users can update project videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-videos')
WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Authenticated users can delete project videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-videos');

-- =====================================================
-- Storage Policies for service-videos
-- =====================================================

CREATE POLICY "Public can view service videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-videos');

CREATE POLICY "Authenticated users can upload service videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-videos');

CREATE POLICY "Authenticated users can update service videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'service-videos')
WITH CHECK (bucket_id = 'service-videos');

CREATE POLICY "Authenticated users can delete service videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'service-videos');

-- =====================================================
-- Storage Policies for media-videos
-- =====================================================

CREATE POLICY "Public can view media videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'media-videos');

CREATE POLICY "Authenticated users can upload media videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-videos');

CREATE POLICY "Authenticated users can update media videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media-videos')
WITH CHECK (bucket_id = 'media-videos');

CREATE POLICY "Authenticated users can delete media videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-videos');
