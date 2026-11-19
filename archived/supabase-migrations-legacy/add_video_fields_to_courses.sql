-- =====================================================
-- Add Video Fields to Courses Table
-- Enhances courses with promo and lesson videos
-- =====================================================

-- Add promo_video_url column (single video for course promotion)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS promo_video_url TEXT;

-- Add gallery_images column (multiple images for course showcase)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Add lesson_videos column (multiple videos for lesson previews)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS lesson_videos TEXT[];

-- Add comments
COMMENT ON COLUMN courses.promo_video_url IS 'URL of the promotional video for the course';
COMMENT ON COLUMN courses.gallery_images IS 'Array of image URLs for course gallery/screenshots';
COMMENT ON COLUMN courses.lesson_videos IS 'Array of video URLs for lesson previews/samples';
