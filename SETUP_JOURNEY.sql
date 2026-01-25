-- COPY THIS INTO SUPABASE SQL EDITOR
-- This will add the journey_content table to your database

-- Drop table if it exists (be careful in production!)
-- DROP TABLE IF EXISTS public.journey_content CASCADE;

-- Create Journey Content Table
CREATE TABLE IF NOT EXISTS public.journey_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Hero Section
  hero_title TEXT NOT NULL DEFAULT 'My Journey',
  hero_subtitle TEXT,
  hero_background_image TEXT,
  hero_background_video TEXT,
  
  -- Story Sections (JSON array for multiple sections)
  story_sections JSONB DEFAULT '[]'::jsonb,
  
  -- Milestones Timeline
  milestones JSONB DEFAULT '[]'::jsonb,
  
  -- Skills Evolution
  skills_journey JSONB DEFAULT '[]'::jsonb,
  
  -- Media Gallery
  photo_gallery JSONB DEFAULT '[]'::jsonb,
  video_gallery JSONB DEFAULT '[]'::jsonb,
  
  -- Testimonials/Recommendations
  testimonials JSONB DEFAULT '[]'::jsonb,
  
  -- Values & Philosophy
  core_values JSONB DEFAULT '[]'::jsonb,
  philosophy_statement TEXT,
  
  -- Fun Facts
  fun_facts JSONB DEFAULT '[]'::jsonb,
  
  -- Social Stats
  social_impact JSONB DEFAULT '{}'::jsonb,
  
  -- Call to Action
  cta_title TEXT,
  cta_description TEXT,
  cta_button_text TEXT,
  cta_button_link TEXT,
  
  -- Settings
  published BOOLEAN DEFAULT false,
  show_timeline BOOLEAN DEFAULT true,
  show_gallery BOOLEAN DEFAULT true,
  show_testimonials BOOLEAN DEFAULT true,
  show_stats BOOLEAN DEFAULT true,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_journey_content_owner ON public.journey_content(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_journey_content_published ON public.journey_content(published);

-- Enable RLS
ALTER TABLE public.journey_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Journey content is publicly readable when published" ON public.journey_content;
DROP POLICY IF EXISTS "Users can view their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can insert their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can update their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can delete their own journey content" ON public.journey_content;

-- Create policies
CREATE POLICY "Journey content is publicly readable when published"
  ON public.journey_content
  FOR SELECT
  USING (published = true);

CREATE POLICY "Users can view their own journey content"
  ON public.journey_content
  FOR SELECT
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can insert their own journey content"
  ON public.journey_content
  FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own journey content"
  ON public.journey_content
  FOR UPDATE
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete their own journey content"
  ON public.journey_content
  FOR DELETE
  USING (auth.uid() = owner_user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_journey_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_journey_content_updated_at ON public.journey_content;

CREATE TRIGGER update_journey_content_updated_at
  BEFORE UPDATE ON public.journey_content
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_content_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Journey content table created successfully! 🎉';
  RAISE NOTICE 'You can now access:';
  RAISE NOTICE '  - Admin: /admin/journey';
  RAISE NOTICE '  - Public: /journey';
END $$;
