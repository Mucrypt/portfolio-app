-- Enhance Projects Table for World-Class Portfolio Showcase
-- This migration adds comprehensive fields for professional project presentation

-- Add new columns to projects table
ALTER TABLE projects

-- Images & Media
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS demo_video_url TEXT,
ADD COLUMN IF NOT EXISTS hero_video_url TEXT,

-- Project Details
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Web Development',
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_logo_url TEXT,
ADD COLUMN IF NOT EXISTS client_website_url TEXT,
ADD COLUMN IF NOT EXISTS client_industry TEXT,

-- Links & URLs
ADD COLUMN IF NOT EXISTS live_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS case_study_url TEXT,
ADD COLUMN IF NOT EXISTS figma_url TEXT,
ADD COLUMN IF NOT EXISTS behance_url TEXT,
ADD COLUMN IF NOT EXISTS dribbble_url TEXT,

-- Project Metrics
ADD COLUMN IF NOT EXISTS duration_months INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0,

-- Technologies & Skills
ADD COLUMN IF NOT EXISTS primary_language TEXT,
ADD COLUMN IF NOT EXISTS frameworks TEXT[],
ADD COLUMN IF NOT EXISTS tools TEXT[],
ADD COLUMN IF NOT EXISTS platforms TEXT[],
ADD COLUMN IF NOT EXISTS apis_used TEXT[],

-- Features & Highlights
ADD COLUMN IF NOT EXISTS key_features TEXT[],
ADD COLUMN IF NOT EXISTS challenges TEXT[],
ADD COLUMN IF NOT EXISTS solutions TEXT[],
ADD COLUMN IF NOT EXISTS learnings TEXT[],
ADD COLUMN IF NOT EXISTS highlights TEXT[],

-- Results & Impact
ADD COLUMN IF NOT EXISTS results_metrics JSONB,
ADD COLUMN IF NOT EXISTS testimonial TEXT,
ADD COLUMN IF NOT EXISTS testimonial_author TEXT,
ADD COLUMN IF NOT EXISTS testimonial_position TEXT,
ADD COLUMN IF NOT EXISTS testimonial_avatar_url TEXT,

-- Awards & Recognition
ADD COLUMN IF NOT EXISTS awards TEXT[],
ADD COLUMN IF NOT EXISTS press_coverage TEXT[],
ADD COLUMN IF NOT EXISTS featured_in TEXT[],

-- SEO & Meta
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS og_image_url TEXT,

-- Project Classification
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS complexity_level TEXT DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS project_role TEXT,
ADD COLUMN IF NOT EXISTS contribution_percentage INTEGER,

-- Display & Status
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_award_winning BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_open_source BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_in_portfolio BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_priority INTEGER DEFAULT 0,

-- Timestamps
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Create index on featured and published status
CREATE INDEX IF NOT EXISTS idx_projects_featured_published ON projects(featured, is_published);

-- Create index on sort_order and display_priority
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_priority DESC, sort_order ASC);

-- Create full-text search index on title and description
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(tagline, ''))
);

-- Create trigger to auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_project_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    
    -- Ensure uniqueness by appending timestamp if needed
    WHILE EXISTS (SELECT 1 FROM projects WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_generate_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION generate_project_slug();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_update_timestamp
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Professional portfolio projects with comprehensive details for showcase';
COMMENT ON COLUMN projects.thumbnail_url IS 'Main thumbnail image for grid/card view (recommended: 600x400px)';
COMMENT ON COLUMN projects.featured_image_url IS 'Large hero image for project detail page (recommended: 1920x1080px)';
COMMENT ON COLUMN projects.gallery_images IS 'Array of additional project screenshots and images';
COMMENT ON COLUMN projects.results_metrics IS 'JSON object containing quantifiable project results (e.g., {"performance": "+50%", "users": "10K+"})';
COMMENT ON COLUMN projects.complexity_level IS 'Project complexity: Simple, Medium, Complex, Enterprise';
COMMENT ON COLUMN projects.display_priority IS 'Higher number = shown first (0-100)';

-- Sample data update (optional - updates existing projects with sensible defaults)
UPDATE projects SET
  is_published = COALESCE(is_published, true),
  show_in_portfolio = COALESCE(show_in_portfolio, true),
  display_priority = COALESCE(display_priority, 0),
  complexity_level = COALESCE(complexity_level, 'Medium'),
  category = COALESCE(category, 'Web Development'),
  views_count = COALESCE(views_count, 0),
  likes_count = COALESCE(likes_count, 0),
  shares_count = COALESCE(shares_count, 0)
WHERE is_published IS NULL OR category IS NULL;
