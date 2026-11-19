-- Create Journey Content Table
-- This table stores your personal story, journey milestones, achievements, and media

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
  -- Each section: {
  --   id: string,
  --   title: string,
  --   subtitle: string,
  --   content: string (rich text/markdown),
  --   year: string,
  --   images: string[],
  --   videos: string[],
  --   achievements: string[],
  --   tags: string[],
  --   background_color: string,
  --   layout: 'left' | 'right' | 'center' | 'full'
  -- }
  
  -- Milestones Timeline
  milestones JSONB DEFAULT '[]'::jsonb,
  -- Each milestone: {
  --   id: string,
  --   year: string,
  --   month: string,
  --   title: string,
  --   description: string,
  --   icon: string,
  --   image: string,
  --   category: 'education' | 'career' | 'achievement' | 'personal'
  -- }
  
  -- Skills Evolution
  skills_journey JSONB DEFAULT '[]'::jsonb,
  -- Each skill: {
  --   skill_name: string,
  --   year_started: string,
  --   proficiency: number (1-100),
  --   milestones: string[]
  -- }
  
  -- Media Gallery
  photo_gallery JSONB DEFAULT '[]'::jsonb,
  -- Each photo: {
  --   id: string,
  --   url: string,
  --   caption: string,
  --   year: string,
  --   category: string
  -- }
  
  video_gallery JSONB DEFAULT '[]'::jsonb,
  -- Each video: {
  --   id: string,
  --   url: string,
  --   title: string,
  --   description: string,
  --   thumbnail: string,
  --   duration: string
  -- }
  
  -- Testimonials/Recommendations
  testimonials JSONB DEFAULT '[]'::jsonb,
  -- Each testimonial: {
  --   id: string,
  --   name: string,
  --   role: string,
  --   company: string,
  --   avatar: string,
  --   quote: string,
  --   relationship: string
  -- }
  
  -- Values & Philosophy
  core_values JSONB DEFAULT '[]'::jsonb,
  -- Each value: {
  --   title: string,
  --   description: string,
  --   icon: string
  -- }
  
  philosophy_statement TEXT,
  
  -- Fun Facts
  fun_facts JSONB DEFAULT '[]'::jsonb,
  -- Each fact: string
  
  -- Social Stats
  social_impact JSONB DEFAULT '{}'::jsonb,
  -- {
  --   projects_completed: number,
  --   years_experience: number,
  --   clients_served: number,
  --   cups_of_coffee: number,
  --   lines_of_code: number,
  --   github_stars: number
  -- }
  
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

-- Create indexes (with IF NOT EXISTS for safe re-runs)
CREATE INDEX IF NOT EXISTS idx_journey_content_owner ON public.journey_content(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_journey_content_published ON public.journey_content(published);

-- Enable RLS
ALTER TABLE public.journey_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for safe re-runs)
DROP POLICY IF EXISTS "Journey content is publicly readable when published" ON public.journey_content;
DROP POLICY IF EXISTS "Users can view their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can insert their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can update their own journey content" ON public.journey_content;
DROP POLICY IF EXISTS "Users can delete their own journey content" ON public.journey_content;

-- Policies
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

-- Create updated_at trigger (drop if exists for safe re-runs)
DROP TRIGGER IF EXISTS update_journey_content_updated_at ON public.journey_content;
DROP FUNCTION IF EXISTS update_journey_content_updated_at();

CREATE OR REPLACE FUNCTION update_journey_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_journey_content_updated_at
  BEFORE UPDATE ON public.journey_content
  FOR EACH ROW
  EXECUTE FUNCTION update_journey_content_updated_at();

-- Insert default journey content for existing users (optional)
-- You can manually insert your content through the admin interface
