# Enterprise-Grade Image Upload System Documentation

## 🎯 Overview

This is a comprehensive, production-ready image upload and management system for your portfolio application. It includes:

- ✅ **Drag & Drop Upload** - Modern drag-and-drop interface
- ✅ **Image Validation** - File type, size, and dimension checks
- ✅ **Auto-optimization** - File naming and organization
- ✅ **Multiple Uploads** - Batch upload support
- ✅ **Preview & Management** - View, update, and delete images
- ✅ **Supabase Storage Integration** - Secure cloud storage
- ✅ **Enterprise Security** - Row-level security policies
- ✅ **Media Library** - Central hub for all images
- ✅ **Reusable Component** - Use across all admin pages

## 📁 Files Created

### Core Files

1. `/lib/storage/image-upload.ts` - Image upload utilities and helpers
2. `/components/admin/ImageUpload.tsx` - Reusable upload component
3. `/app/admin/media/page.tsx` - Media library management page
4. `/supabase/migrations/create_storage_buckets.sql` - Storage setup SQL

### Integration (Updated)

- `/app/admin/blog/page.tsx` - Blog image uploads
- `/app/admin/shop/page.tsx` - Product image uploads
- `/app/admin/services/page.tsx` - Service image uploads
- `/app/admin/courses/page.tsx` - Course image uploads

## 🚀 Setup Instructions

### Step 1: Create Storage Buckets

**IMPORTANT:** You must run this SQL in your Supabase SQL Editor first!

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `/supabase/migrations/create_storage_buckets.sql`
4. Copy the entire SQL content
5. Paste it in the SQL Editor
6. Click **Run** to execute

This will create 6 storage buckets:

- `blog-images` - Blog post images
- `shop-images` - Product images
- `services-images` - Service images
- `courses-images` - Course images
- `projects-images` - Project images
- `media-library` - General media files

### Step 2: Verify Storage Setup

1. Go to **Storage** in your Supabase dashboard
2. You should see all 6 buckets listed
3. Each bucket should be marked as **Public**
4. Policies should show authenticated users can upload/delete

### Step 3: Test the System

1. Start your development server: `npm run dev`
2. Navigate to `/admin/media` to access the Media Library
3. Try uploading an image to test the system
4. If you see errors, check that storage buckets are created

## 💡 Usage Guide

### Using ImageUpload Component

```tsx
import ImageUpload from '@/components/admin/ImageUpload'

// Single image upload
<ImageUpload
  bucket='blog'
  folder='featured'
  prefix='blog-featured'
  value={imageUrl}
  onChange={(url) => setImageUrl(url as string | null)}
  multiple={false}
  label='Featured Image'
  description='Upload a featured image (recommended: 1200x630px)'
  aspectRatio='16/9'
  showPreview={true}
  required={true}
/>

// Multiple images upload
<ImageUpload
  bucket='blog'
  folder='gallery'
  prefix='blog-gallery'
  value={imageUrls}
  onChange={(urls) => setImageUrls(urls as string[])}
  multiple={true}
  maxFiles={10}
  label='Gallery Images'
  description='Upload multiple images for gallery'
  showPreview={true}
/>
```

### Component Props

| Prop          | Type                       | Default  | Description                                       |
| ------------- | -------------------------- | -------- | ------------------------------------------------- |
| `bucket`      | BucketName                 | required | Storage bucket ('blog', 'shop', 'services', etc.) |
| `folder`      | string                     | optional | Folder within bucket                              |
| `prefix`      | string                     | optional | Filename prefix                                   |
| `value`       | string \| string[] \| null | required | Current image URL(s)                              |
| `onChange`    | function                   | required | Callback when images change                       |
| `onDelete`    | function                   | optional | Callback when image deleted                       |
| `multiple`    | boolean                    | false    | Allow multiple file selection                     |
| `maxFiles`    | number                     | 10       | Maximum files for multiple upload                 |
| `label`       | string                     | optional | Input label text                                  |
| `description` | string                     | optional | Help text                                         |
| `required`    | boolean                    | false    | Mark field as required                            |
| `disabled`    | boolean                    | false    | Disable uploads                                   |
| `aspectRatio` | string                     | optional | Recommended aspect ratio (e.g., '16/9')           |
| `showPreview` | boolean                    | true     | Show image previews                               |

### Available Buckets

```typescript
'blog' // Blog post images
'shop' // Product images
'services' // Service images
'courses' // Course images
'projects' // Project images
'media' // Media library (general)
```

### Image Validation Rules

- **Allowed formats:** JPG, JPEG, PNG, WebP, GIF
- **Max file size:** 5MB
- **Min dimensions:** 100x100px
- **Max dimensions:** 4096x4096px
- **Automatic validation** on file selection
- **User-friendly error messages**

## 🎨 Features by Page

### Blog Admin (`/admin/blog`)

- **Featured Image:** Single upload for blog post cover
- **Gallery Images:** Multiple images for blog content
- Recommended: 1200x630px (16:9 ratio)

### Shop Admin (`/admin/shop`)

- **Product Thumbnail:** Main product image (1:1 ratio)
- **Product Gallery:** Multiple product images
- Recommended: 600x600px square thumbnails

### Services Admin (`/admin/services`)

- **Featured Image:** Service showcase image
- **Gallery Images:** Service portfolio images
- Recommended: 1200x630px (16:9 ratio)

### Courses Admin (`/admin/courses`)

- **Course Thumbnail:** Course cover image
- Recommended: 1200x675px (16:9 ratio)

### Media Library (`/admin/media`)

- **Central Management:** View all uploaded images
- **Bulk Upload:** Upload up to 20 images at once
- **Search & Filter:** Find images by name
- **Grid/List View:** Switch between views
- **Copy URL:** Quickly copy image URLs
- **Download:** Download original images
- **Delete:** Remove unwanted images

## 🔒 Security Features

- ✅ **Authentication Required** - Only authenticated users can upload
- ✅ **Public Read Access** - Images publicly accessible via URL
- ✅ **Row-Level Security** - Supabase RLS policies
- ✅ **File Validation** - Type and size checks
- ✅ **Sanitized Filenames** - Safe filename generation
- ✅ **Unique Names** - Timestamp + random string prevents conflicts

## 🎯 Best Practices

### Image Optimization Tips

1. **Compress images** before upload (tools: TinyPNG, ImageOptim)
2. **Use WebP format** when possible for better compression
3. **Resize to target dimensions** before upload
4. **Delete unused images** to save storage space

### Recommended Image Dimensions

- **Blog Featured:** 1200x630px (OG image size)
- **Product Thumbnail:** 600x600px (1:1 ratio)
- **Course Thumbnail:** 1200x675px (16:9 ratio)
- **Service Images:** 1200x630px (16:9 ratio)
- **Profile Pictures:** 400x400px (1:1 ratio)

### File Naming Convention

Auto-generated format: `{prefix}-{sanitized-name}-{timestamp}-{random}.{ext}`

Example: `blog-featured-my-awesome-post-1706112000000-a7b9c.jpg`

## 🛠️ Utility Functions

```typescript
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  replaceImage,
  validateImage,
  formatFileSize,
} from '@/lib/storage/image-upload'

// Upload single image
const result = await uploadImage(file, 'blog', 'featured', 'blog-post')

// Upload multiple images
const result = await uploadMultipleImages(files, 'shop', 'gallery')

// Delete image
const result = await deleteImage('blog', imageUrl)

// Replace image (upload new, delete old)
const result = await replaceImage(newFile, oldUrl, 'blog')

// Validate image
const validation = await validateImage(file)

// Format file size
const formatted = formatFileSize(1024576) // "1.00 MB"
```

## 🐛 Troubleshooting

### "Failed to load media files"

- **Solution:** Run the SQL migration to create storage buckets
- Check Supabase dashboard → Storage → Buckets exist

### "Failed to upload image"

- **Check:** User is authenticated
- **Check:** File size under 5MB
- **Check:** File type is allowed (JPG, PNG, WebP, GIF)
- **Check:** Storage bucket exists in Supabase

### "Permission denied"

- **Check:** Storage policies are created (run SQL migration)
- **Check:** User is logged in
- **Check:** Bucket is set to public

### Images not showing

- **Check:** Image URL is correct
- **Check:** Bucket is public in Supabase
- **Check:** CORS settings in Supabase (usually auto-configured)

### TypeScript errors

- **Check:** All files are saved
- **Check:** Run `npm run type-check`
- **Check:** Restart TypeScript server in VS Code

## 📊 Storage Management

### Monitor Storage Usage

1. Go to Supabase Dashboard
2. Navigate to **Storage** → **Usage**
3. View storage by bucket
4. Free tier: 1GB storage, paid plans available

### Clean Up Old Images

1. Use Media Library (`/admin/media`)
2. Search for old/unused images
3. Delete images no longer needed
4. Deleted images free up storage space

## 🚀 Production Considerations

### Before Going Live

- [ ] Verify all storage buckets created
- [ ] Test upload in each admin page
- [ ] Test image deletion
- [ ] Check public URL access
- [ ] Monitor storage usage
- [ ] Set up backup strategy (Supabase auto-backups)

### Performance Tips

- Images served from Supabase CDN (fast globally)
- Use Next.js Image component (automatic optimization)
- Consider Cloudflare/CDN for additional caching
- Implement image lazy loading

### Scaling Considerations

- Free tier: 1GB storage, 2GB bandwidth
- Pro tier: 100GB storage, 200GB bandwidth
- Enterprise: Unlimited with custom pricing
- Monitor usage in Supabase dashboard

## 📝 Migration Notes

### Migrating Existing Images

If you have seeded images that you want to keep:

1. Images can stay at current URLs (no breaking changes)
2. New uploads will use the new system
3. Gradually replace old URLs with uploaded images
4. Old external URLs will continue to work

### Database Schema

No database changes required! The system uses:

- Existing image URL fields in your tables
- Supabase Storage (separate from database)
- No additional tables needed

## 🎉 What's Next?

Your image upload system is now ready! You can:

1. ✅ Upload images in Blog admin
2. ✅ Upload images in Shop admin
3. ✅ Upload images in Services admin
4. ✅ Upload images in Courses admin
5. ✅ Manage all images in Media Library
6. ✅ Delete old/unused images
7. ✅ Copy image URLs for use elsewhere

## 💬 Support

If you encounter issues:

1. Check the Troubleshooting section
2. Verify storage buckets in Supabase
3. Check browser console for errors
4. Review Supabase logs

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**
