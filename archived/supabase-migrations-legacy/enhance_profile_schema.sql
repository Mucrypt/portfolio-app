-- =====================================================
-- ENHANCED PROFILE SCHEMA FOR WORLD-CLASS ABOUT PAGE
-- =====================================================
-- This migration adds rich media and storytelling fields to the profiles table
-- Run this in Supabase SQL Editor to enhance your profile with:
-- - Hero video background
-- - Journey timeline with media
-- - Gallery images and videos
-- - Achievements and milestones
-- - Featured testimonials
-- - Rich story sections

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS hero_video_url TEXT,
ADD COLUMN IF NOT EXISTS hero_background_image TEXT,
ADD COLUMN IF NOT EXISTS story_title TEXT DEFAULT 'My Journey',
ADD COLUMN IF NOT EXISTS story_subtitle TEXT,
ADD COLUMN IF NOT EXISTS featured_quote TEXT,
ADD COLUMN IF NOT EXISTS featured_quote_author TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery_videos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS fun_facts JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS story_sections JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS call_to_action JSONB DEFAULT '{"primary": {"text": "Let''s Work Together", "link": "/contact"}, "secondary": {"text": "View Projects", "link": "/projects"}}';

-- Add comments for documentation
COMMENT ON COLUMN profiles.hero_video_url IS 'Background video URL for hero section (MP4, WebM)';
COMMENT ON COLUMN profiles.hero_background_image IS 'Fallback/poster image for hero section';
COMMENT ON COLUMN profiles.story_title IS 'Title for the story/journey section';
COMMENT ON COLUMN profiles.story_subtitle IS 'Subtitle for the story section';
COMMENT ON COLUMN profiles.featured_quote IS 'Inspirational quote to display prominently';
COMMENT ON COLUMN profiles.featured_quote_author IS 'Author of the featured quote';
COMMENT ON COLUMN profiles.gallery_images IS 'Array of image URLs for photo gallery';
COMMENT ON COLUMN profiles.gallery_videos IS 'Array of video URLs for media gallery';

COMMENT ON COLUMN profiles.achievements IS 'Array of achievement objects: [{"title": "...", "description": "...", "icon": "...", "date": "...", "image": "..."}]';
COMMENT ON COLUMN profiles.milestones IS 'Array of milestone objects: [{"year": "2024", "title": "...", "description": "...", "icon": "...", "image": "..."}]';
COMMENT ON COLUMN profiles.fun_facts IS 'Array of fun facts: [{"label": "Projects Completed", "value": "150+", "icon": "..."}]';
COMMENT ON COLUMN profiles.testimonials IS 'Array of testimonials: [{"name": "...", "role": "...", "company": "...", "content": "...", "avatar": "...", "rating": 5}]';
COMMENT ON COLUMN profiles.story_sections IS 'Array of story sections: [{"title": "...", "content": "...", "image": "...", "video": "...", "order": 1}]';
COMMENT ON COLUMN profiles.call_to_action IS 'CTA buttons config: {"primary": {"text": "...", "link": "..."}, "secondary": {...}}';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_public_slug ON profiles(public_slug);

-- =====================================================
-- SAMPLE DATA STRUCTURE (Optional - Uncomment to use)
-- =====================================================

-- Example: Update your profile with sample data
-- Replace 'your-user-id-here' with your actual owner_user_id

/*
UPDATE profiles
SET
  hero_video_url = NULL, -- Add your Supabase video URL here
  hero_background_image = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920',
  story_title = 'My Journey',
  story_subtitle = 'From curious beginner to passionate developer',
  featured_quote = 'The best way to predict the future is to create it.',
  featured_quote_author = 'Peter Drucker',
  
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'
  ],
  
  gallery_videos = ARRAY[]::TEXT[], -- Add your video URLs
  
  achievements = '[
    {
      "title": "First Open Source Contribution",
      "description": "Made my first contribution to a major open-source project",
      "icon": "code",
      "date": "2023-06",
      "image": null
    },
    {
      "title": "Launched First SaaS Product",
      "description": "Built and launched a successful SaaS application with 1000+ users",
      "icon": "rocket",
      "date": "2023-12",
      "image": null
    },
    {
      "title": "Spoke at Tech Conference",
      "description": "Delivered a keynote speech at a major tech conference",
      "icon": "mic",
      "date": "2024-03",
      "image": null
    },
    {
      "title": "Reached 10K Followers",
      "description": "Built an engaged community of developers and creators",
      "icon": "users",
      "date": "2024-08",
      "image": null
    }
  ]'::jsonb,
  
  milestones = '[
    {
      "year": "2020",
      "title": "Started Coding Journey",
      "description": "Wrote my first line of code and fell in love with programming",
      "icon": "sparkles",
      "image": null
    },
    {
      "year": "2021",
      "title": "First Freelance Project",
      "description": "Completed my first paid project and started my freelance career",
      "icon": "briefcase",
      "image": null
    },
    {
      "year": "2022",
      "title": "Launched Portfolio",
      "description": "Built my professional portfolio and online presence",
      "icon": "globe",
      "image": null
    },
    {
      "year": "2023",
      "title": "Joined Dream Company",
      "description": "Landed my dream job as a senior developer",
      "icon": "award",
      "image": null
    },
    {
      "year": "2024",
      "title": "Built Multiple Products",
      "description": "Launched several successful products and grew my business",
      "icon": "trending-up",
      "image": null
    }
  ]'::jsonb,
  
  fun_facts = '[
    {
      "label": "Projects Completed",
      "value": "150+",
      "icon": "folder"
    },
    {
      "label": "Cups of Coffee",
      "value": "5,000+",
      "icon": "coffee"
    },
    {
      "label": "Lines of Code",
      "value": "1M+",
      "icon": "code"
    },
    {
      "label": "Happy Clients",
      "value": "50+",
      "icon": "heart"
    }
  ]'::jsonb,
  
  testimonials = '[
    {
      "name": "Sarah Johnson",
      "role": "Product Manager",
      "company": "TechCorp",
      "content": "Working with Romeo was an absolute pleasure. His attention to detail and technical expertise exceeded all expectations.",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      "rating": 5
    },
    {
      "name": "Michael Chen",
      "role": "CEO",
      "company": "StartupXYZ",
      "content": "Romeo transformed our vision into reality. The quality of work and professionalism was outstanding.",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      "rating": 5
    },
    {
      "name": "Emily Rodriguez",
      "role": "Designer",
      "company": "Creative Studio",
      "content": "A true professional who brings both technical skill and creative problem-solving to every project.",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      "rating": 5
    }
  ]'::jsonb,
  
  story_sections = '[
    {
      "title": "The Beginning",
      "content": "My journey into tech started with curiosity and a laptop. I taught myself to code late at night after work, driven by the desire to build things that matter.",
      "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      "video": null,
      "order": 1
    },
    {
      "title": "Finding My Path",
      "content": "After countless tutorials, failed projects, and late nights, I discovered my passion for full-stack development. Each challenge made me stronger and more determined.",
      "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "video": null,
      "order": 2
    },
    {
      "title": "Building & Scaling",
      "content": "From solo projects to leading development teams, I learned that great software is built by great people. Today, I help businesses transform their ideas into scalable solutions.",
      "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "video": null,
      "order": 3
    }
  ]'::jsonb,
  
  call_to_action = '{
    "primary": {
      "text": "Let''s Work Together",
      "link": "/contact"
    },
    "secondary": {
      "text": "View My Work",
      "link": "/projects"
    }
  }'::jsonb

WHERE owner_user_id = 'your-user-id-here';
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Profile schema enhanced successfully! ✅';
  RAISE NOTICE 'New columns added: hero_video_url, hero_background_image, story sections, achievements, milestones, testimonials, and more!';
  RAISE NOTICE 'Update your profile through the admin dashboard to add your story and media.';
END $$;
