# 🎬 Video Upload System - Complete Guide

## Overview

This enterprise-grade video upload system provides YouTube/Udemy-style fast loading and professional video management for your admin pages and public courses display.

## ✅ What's Included

### 1. Video Upload Utilities (`lib/storage/video-upload.ts`)

- **File Validation**: Type, size (500MB max), duration (2hr max)
- **Metadata Extraction**: Duration, resolution, file size using HTML5 Video API
- **Thumbnail Generation**: Automatic frame extraction at 10% of video duration
- **Progress Tracking**: Real-time upload progress callbacks
- **Multiple Formats**: mp4, webm, ogg, mov, avi, mkv
- **Compression Warnings**: Alerts for files >100MB or >1080p resolution
- **Smart Functions**:
  - `validateVideo()` - Validates and extracts metadata
  - `uploadVideo()` - Upload with progress tracking
  - `deleteVideo()` - Remove video from storage
  - `replaceVideo()` - Upload new + delete old atomically
  - `uploadMultipleVideos()` - Batch upload with per-file progress
  - `generateVideoThumbnail()` - Extract JPEG thumbnail from video
  - `getVideoMetadata()` - Get duration, width, height
  - `formatDuration()` - Format seconds to HH:MM:SS or MM:SS
  - `formatFileSize()` - Human-readable file sizes

### 2. VideoUpload Component (`components/admin/VideoUpload.tsx`)

- **Drag & Drop**: Modern drag-and-drop interface
- **Video Preview**: Built-in video player with controls
- **Thumbnail Preview**: Shows generated thumbnails before upload
- **Progress Bars**: Visual upload progress indicators
- **Multiple Videos**: Support for uploading multiple videos
- **Validation Feedback**: Real-time error messages
- **Duration & Size Display**: Shows video metadata
- **Delete Functionality**: Easy video removal
- **Props API** (same as ImageUpload for consistency):
  ```typescript
  bucket: VideoBucketName           // e.g., 'course-videos'
  folder?: string                    // e.g., 'promos'
  prefix?: string                    // e.g., 'promo'
  value?: string | string[]          // Current video URL(s)
  onChange: (url) => void            // Callback when video uploaded
  onDelete?: (url) => void           // Optional delete callback
  multiple?: boolean                 // Allow multiple videos
  maxFiles?: number                  // Max number of videos
  label?: string                     // Field label
  description?: string               // Help text
  required?: boolean                 // Required field
  disabled?: boolean                 // Disable upload
  showPreview?: boolean              // Show current videos
  className?: string                 // Custom CSS classes
  ```

### 3. Video Storage Buckets (`supabase/migrations/create_video_storage_buckets.sql`)

- **5 Buckets Created**:
  - `course-videos` - Course promo and lesson videos
  - `blog-videos` - Blog post videos
  - `project-videos` - Project showcase videos
  - `service-videos` - Service demonstration videos
  - `media-videos` - General media library
- **RLS Policies**: Public view, authenticated upload/update/delete
- **Size Limit**: 500MB per video (524,288,000 bytes)
- **MIME Types**: video/mp4, video/webm, video/ogg, video/quicktime, video/x-msvideo, video/x-matroska

### 4. World-Class Public Courses Page (`app/(public)/courses/new-page.tsx`)

- **Hero Section**: Gradient background with animated pattern and stats
- **Featured Courses**: Large cards with video preview overlays
- **Video Player Integration**: Play icons over thumbnails
- **Professional Stats Display**: Students, hours, ratings
- **Why Choose Section**: 4-card benefits showcase
- **All Courses Grid**: Responsive course catalog
- **Category Filters**: Easy course browsing
- **Trust Signals**: Stats footer with key metrics
- **CTA Sections**: Strategic conversion points
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Full dark theme compatibility

## 🚀 Quick Start

### Step 1: Run the Migration

```bash
# Go to Supabase Dashboard > SQL Editor
# Copy and paste the content of:
supabase/migrations/create_video_storage_buckets.sql
# Click "Run" to create the storage buckets
```

### Step 2: Update Courses Schema (if needed)

Add video fields to your courses table:

```sql
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS promo_video_url TEXT,
ADD COLUMN IF NOT EXISTS lesson_videos TEXT[];
```

### Step 3: Use VideoUpload in Admin Pages

```typescript
import VideoUpload from '@/components/admin/VideoUpload'

// Single video (e.g., promo video)
<VideoUpload
  bucket='course-videos'
  folder='promos'
  prefix='promo'
  value={formData.promo_video_url}
  onChange={(url) => setFormData({ ...formData, promo_video_url: url as string | null })}
  multiple={false}
  label='Promo Video'
  description='Upload a promotional video to showcase your course'
  showPreview={true}
/>

// Multiple videos (e.g., lesson videos)
<VideoUpload
  bucket='course-videos'
  folder='lessons'
  prefix='lesson'
  value={formData.lesson_videos}
  onChange={(urls) => setFormData({
    ...formData,
    lesson_videos: Array.isArray(urls) ? urls : urls ? [urls] : []
  })}
  multiple={true}
  maxFiles={10}
  label='Lesson Videos'
  description='Upload lesson preview videos or sample content'
  showPreview={true}
/>
```

### Step 4: Deploy the New Public Page

```bash
# Rename the new page to replace the old one
mv app/(public)/courses/page.tsx app/(public)/courses/page-old.tsx
mv app/(public)/courses/new-page.tsx app/(public)/courses/page.tsx

# Or keep both and test the new one at /courses/new-page
```

## 📖 Usage Examples

### Admin Courses Page Integration

The admin courses page now has 4 tabs:

1. **Basic Info**: Title, description, instructor, platform, affiliate link
2. **Media**: Promo video, thumbnail, gallery images, lesson videos
3. **Details**: Pricing, category, level, rating, students, tags
4. **Content**: What you'll learn, requirements

**Media Tab Example**:

```typescript
{activeTab === 'media' && (
  <div className='space-y-8'>
    {/* Promo Video */}
    <div className='bg-linear-to-br from-purple-50 to-blue-50 p-6 rounded-xl'>
      <VideoUpload
        bucket='course-videos'
        folder='promos'
        prefix='promo'
        value={formData.promo_video_url}
        onChange={(url) => setFormData({ ...formData, promo_video_url: url as string | null })}
        multiple={false}
        showPreview={true}
      />
    </div>

    {/* Lesson Videos */}
    <div className='bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl'>
      <VideoUpload
        bucket='course-videos'
        folder='lessons'
        prefix='lesson'
        value={formData.lesson_videos}
        onChange={(urls) => setFormData({
          ...formData,
          lesson_videos: Array.isArray(urls) ? urls : urls ? [urls] : []
        })}
        multiple={true}
        maxFiles={10}
        showPreview={true}
      />
    </div>
  </div>
)}
```

### Public Courses Page Features

**Featured Course Cards** (with video support):

```typescript
{course.thumbnail_url && (
  <>
    <img src={course.thumbnail_url} alt={course.title} />
    {course.promo_video_url && (
      <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
        <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center'>
          <Play className='w-8 h-8 text-blue-600' />
        </div>
      </div>
    )}
  </>
)}
```

## ⚡ Performance Optimizations

### 1. Video Constraints

- **Max Size**: 500MB (balances quality vs upload time)
- **Max Duration**: 2 hours (prevents extremely large files)
- **Compression Warnings**: Alerts when file >100MB or resolution >1080p

### 2. Thumbnail Generation

- Extracts frame at 10% of video duration for better preview
- JPEG format for smaller file size
- Quality set to 0.8 for good balance

### 3. Caching

- Cache-Control headers set to 3600 seconds (1 hour)
- Public cache enabled for faster subsequent loads

### 4. Metadata Pre-validation

- Validates file type, size, and metadata before upload
- Prevents invalid uploads early in the process

## 🎨 UI/UX Features

### VideoUpload Component

- **Status Indicators**:
  - Pending: Can be removed before upload
  - Uploading: Shows progress bar
  - Success: Green checkmark
  - Error: Red exclamation with message

- **Preview States**:
  - Thumbnail preview during upload
  - Video player for uploaded videos
  - Play icon overlay on thumbnails
  - Duration and resolution display

### Public Courses Page

- **Hero Section**: Gradient background, animated pattern, call-to-action
- **Featured Cards**: Large cards with hover effects, video play overlays
- **Stats Dashboard**: Real-time course statistics
- **Trust Signals**: Student count, hours, ratings displayed prominently
- **Responsive Grid**: Adapts to mobile, tablet, desktop
- **Dark Mode**: Full support for dark theme

## 🔧 Customization

### Change Video Constraints

Edit `lib/storage/video-upload.ts`:

```typescript
export const VIDEO_CONSTRAINTS = {
  maxSize: 524288000, // 500MB (change as needed)
  minSize: 1024, // 1KB
  allowedTypes: [
    'video/mp4',
    'video/webm',
    // Add more types if needed
  ],
  maxDuration: 7200, // 2 hours in seconds
}
```

### Change Thumbnail Settings

Edit the `generateVideoThumbnail` function:

```typescript
// Seek to different position (currently 10%)
const seekTime = duration * 0.1 // Change 0.10 to desired percentage

// Change quality (0.0 to 1.0)
const blob = await canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.8)
```

### Add Custom Video Buckets

1. Add to `lib/storage/video-upload.ts`:

```typescript
export const VIDEO_BUCKETS = {
  // existing buckets...
  'portfolio-videos': 'portfolio-videos',
} as const
```

2. Add migration SQL:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-videos', 'portfolio-videos', true, 524288000,
  ARRAY['video/mp4', 'video/webm', 'video/ogg']);
```

## 📊 Admin Integration Checklist

- [ ] Run video storage buckets migration in Supabase
- [ ] Add video fields to courses table (promo_video_url, lesson_videos)
- [ ] Update admin courses page with VideoUpload components
- [ ] Test video upload with various formats
- [ ] Verify thumbnail generation works
- [ ] Check progress tracking during upload
- [ ] Test video deletion
- [ ] Verify multiple video uploads work
- [ ] Test on mobile devices

## 🎯 Public Page Deployment Checklist

- [ ] Review the new public courses page design
- [ ] Test video play overlays
- [ ] Verify stats are calculating correctly
- [ ] Check responsive design on mobile/tablet
- [ ] Test dark mode display
- [ ] Verify affiliate links are working
- [ ] Check featured vs regular course display
- [ ] Test category filters
- [ ] Deploy to production

## 🐛 Troubleshooting

### Video Upload Fails

- Check file size is under 500MB
- Verify file format is supported
- Check Supabase storage bucket exists
- Verify authentication (user must be logged in)

### Thumbnail Not Generating

- Ensure browser supports HTML5 video
- Check video codec is supported by browser
- Try a different video format (mp4 is most compatible)

### Videos Not Loading on Public Page

- Check video URLs are public
- Verify RLS policies allow public SELECT
- Check CORS settings in Supabase

### Progress Bar Not Updating

- Ensure progress callback is properly connected
- Check browser console for errors
- Verify VideoUpload component is receiving onChange prop

## 🚀 Next Steps

1. **Add Video to Other Pages**: Use VideoUpload in blog, projects, services admin pages
2. **Enhance Player**: Add custom video player with advanced controls
3. **Add Transcoding**: Implement serverless video transcoding for multiple qualities
4. **Add Subtitles**: Support for video captions/subtitles
5. **Add Analytics**: Track video views and engagement
6. **Add Streaming**: Implement HLS/DASH for adaptive streaming

## 💡 Pro Tips

- **Keep videos short**: Under 5 minutes for promos, under 15 minutes for lessons
- **Compress before upload**: Use tools like HandBrake to reduce file size
- **Use mp4 format**: Most compatible across browsers
- **Add captions**: Makes content accessible to everyone
- **Test on mobile**: Ensure videos load fast on slow connections
- **Monitor storage**: Keep an eye on Supabase storage usage

## 🎉 Success!

You now have an enterprise-grade video upload system that rivals YouTube and Udemy. Your courses page will look world-class and convert visitors into customers!

---

**Need Help?** Check the inline comments in each file for detailed explanations of how everything works.
