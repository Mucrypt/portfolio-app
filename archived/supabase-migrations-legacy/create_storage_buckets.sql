-- Create Supabase Storage Buckets for Images
-- Run this in your Supabase SQL Editor

-- Create blog images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create shop images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-images', 'shop-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create services images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('services-images', 'services-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create courses images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('courses-images', 'courses-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create projects images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects-images', 'projects-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create media library bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media-library', 'media-library', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Allow authenticated users to upload, update, and delete their images

-- Blog Images Policies
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Shop Images Policies
CREATE POLICY "Authenticated users can upload shop images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY "Authenticated users can update shop images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'shop-images');

CREATE POLICY "Authenticated users can delete shop images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'shop-images');

CREATE POLICY "Public can view shop images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shop-images');

-- Services Images Policies
CREATE POLICY "Authenticated users can upload services images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services-images');

CREATE POLICY "Authenticated users can update services images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services-images');

CREATE POLICY "Authenticated users can delete services images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services-images');

CREATE POLICY "Public can view services images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services-images');

-- Courses Images Policies
CREATE POLICY "Authenticated users can upload courses images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'courses-images');

CREATE POLICY "Authenticated users can update courses images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'courses-images');

CREATE POLICY "Authenticated users can delete courses images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'courses-images');

CREATE POLICY "Public can view courses images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'courses-images');

-- Projects Images Policies
CREATE POLICY "Authenticated users can upload projects images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects-images');

CREATE POLICY "Authenticated users can update projects images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'projects-images');

CREATE POLICY "Authenticated users can delete projects images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'projects-images');

CREATE POLICY "Public can view projects images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'projects-images');

-- Media Library Policies
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-library');

CREATE POLICY "Authenticated users can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media-library');

CREATE POLICY "Authenticated users can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-library');

CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media-library');
