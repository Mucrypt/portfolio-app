# Image Upload System Documentation

## Overview

This portfolio application now features an **enterprise-grade image upload system** that enables you to upload, manage, and delete images directly from the admin dashboard. No more manual URL input - everything is handled through an intuitive drag-and-drop interface with real-time validation and preview.

## 🌟 Features

### Core Capabilities

- ✅ **Drag & Drop Upload** - Intuitive file selection
- ✅ **Image Validation** - Automatic size, format, and dimension checks
- ✅ **Real-time Preview** - See images before uploading
- ✅ **Progress Tracking** - Visual upload progress indicators
- ✅ **Multiple Uploads** - Upload multiple images at once
- ✅ **Image Management** - Delete/replace images with one click
- ✅ **Optimized Storage** - Automatic file naming and organization
- ✅ **Error Handling** - Clear error messages and recovery
- ✅ **Responsive Design** - Works on all devices

### Technical Features

- 🔒 **Secure Upload** - Authenticated users only
- 📁 **Organized Storage** - Logical bucket structure
- 🎨 **Image Constraints** - Max 5MB, JPG/PNG/WebP/GIF
- ⚡ **Performance** - Optimized image delivery via CDN
- 🌐 **Public URLs** - Automatically generated public URLs
- 🔄 **Replace Capability** - Seamlessly replace old images

## 📋 Setup Instructions

### Step 1: Run SQL Migration

Go to your Supabase SQL Editor and run the migration file:

\`\`\`sql
-- File: supabase/migrations/create_storage_buckets.sql
\`\`\`

This creates:

- **6 Storage Buckets**: `blog-images`, `shop-images`, `services-images`, `courses-images`, `projects-images`, `media-library`
- **Storage Policies**: Allow authenticated users to upload/update/delete, public can view
- **Security**: Only authenticated users can modify, everyone can view

### Step 2: Run Projects Enhancement Migration

Run the projects table enhancement migration:

\`\`\`sql
-- File: supabase/migrations/enhance_projects_table.sql
\`\`\`

This adds:

- Image fields (thumbnail, featured image, gallery)
- Comprehensive project details
- Client information
- Results & metrics
- Awards & recognition
- SEO metadata
- Auto-generated slugs
- Full-text search

### Step 3: Regenerate Database Types

After running migrations, regenerate your TypeScript types:

\`\`\`bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
\`\`\`

Replace `YOUR_PROJECT_ID` with your Supabase project ID.

## 📁 Storage Bucket Structure

```
Supabase Storage
├── blog-images/
│   ├── featured/           # Featured blog images
│   └── gallery/            # Blog post galleries
├── shop-images/
│   ├── products/           # Product thumbnails
│   └── gallery/            # Product galleries
├── services-images/
│   ├── featured/           # Service featured images
│   └── gallery/            # Service galleries
├── courses-images/
│   ├── featured/           # Course featured images
│   └── gallery/            # Course galleries
├── projects-images/
│   ├── thumbnails/         # Project card thumbnails
│   ├── featured/           # Project hero images
│   └── gallery/            # Project screenshots
└── media-library/          # General media files
```

## 🎯 Usage Guide

### Uploading Images

1. **Navigate to Admin Section**
   - Go to any admin page (Blog, Shop, Services, Courses, Projects)
   - Click "Create New" or "Edit" existing item

2. **Upload Images**
   - Click the upload area or drag & drop images
   - Supported formats: JPG, PNG, WebP, GIF
   - Max size: 5MB per image
   - Multiple uploads supported (varies by field)

3. **Preview & Confirm**
   - See real-time preview of uploaded images
   - Progress bar shows upload status
   - Success indicator confirms upload

### Deleting Images

1. Hover over any uploaded image
2. Click the trash icon overlay
3. Confirm deletion
4. Image is removed from both database and storage

### Replacing Images

1. Upload a new image to replace existing one
2. System automatically deletes old image
3. Database reference updated to new URL

## 🔧 Image Upload Component API

### Basic Usage

```tsx
import ImageUpload from '@/components/admin/ImageUpload'

;<ImageUpload
  bucket='blog' // Required: Storage bucket name
  folder='featured' // Optional: Subfolder
  prefix='blog-featured' // Optional: Filename prefix
  value={imageUrl} // Current image URL(s)
  onChange={(url) => setUrl(url)} // Callback with new URL(s)
  multiple={false} // Single or multiple uploads
  label='Featured Image' // Field label
  description='Upload main image' // Helper text
  required={true} // Make field required
  aspectRatio='16/9' // Recommended ratio
  showPreview={true} // Show current images
/>
```

### Props

| Prop          | Type                                                                   | Default  | Description                             |
| ------------- | ---------------------------------------------------------------------- | -------- | --------------------------------------- |
| `bucket`      | `'blog' \| 'shop' \| 'services' \| 'courses' \| 'projects' \| 'media'` | Required | Storage bucket to use                   |
| `folder`      | `string`                                                               | -        | Optional subfolder within bucket        |
| `prefix`      | `string`                                                               | -        | Prefix for generated filenames          |
| `value`       | `string \| string[] \| null`                                           | -        | Current image URL(s)                    |
| `onChange`    | `(url: string \| string[] \| null) => void`                            | Required | Callback when image changes             |
| `onDelete`    | `(url: string) => void`                                                | -        | Optional delete callback                |
| `multiple`    | `boolean`                                                              | `false`  | Allow multiple images                   |
| `maxFiles`    | `number`                                                               | `10`     | Max images for multiple uploads         |
| `label`       | `string`                                                               | -        | Field label                             |
| `description` | `string`                                                               | -        | Helper text                             |
| `required`    | `boolean`                                                              | `false`  | Make field required                     |
| `disabled`    | `boolean`                                                              | `false`  | Disable upload                          |
| `aspectRatio` | `string`                                                               | -        | Recommended aspect ratio (e.g., '16/9') |
| `showPreview` | `boolean`                                                              | `true`   | Show preview of current images          |
| `className`   | `string`                                                               | -        | Additional CSS classes                  |

## 📝 Image Utilities

### Upload Single Image

```typescript
import { uploadImage } from '@/lib/storage/image-upload'

const result = await uploadImage(
  file, // File object
  'blog', // Bucket
  'featured', // Folder
  'blog-featured', // Prefix
)

if (result.success) {
  console.log('URL:', result.url)
  console.log('Path:', result.path)
} else {
  console.error('Error:', result.error)
}
```

### Upload Multiple Images

```typescript
import { uploadMultipleImages } from '@/lib/storage/image-upload'

const result = await uploadMultipleImages(
  fileArray, // File[] array
  'projects', // Bucket
  'gallery', // Folder
)

console.log(`${result.successCount} uploaded, ${result.failureCount} failed`)
result.results.forEach((r) => {
  if (r.success) console.log('URL:', r.url)
})
```

### Delete Image

```typescript
import { deleteImage } from '@/lib/storage/image-upload'

const result = await deleteImage(
  'blog', // Bucket
  'featured/image-123.jpg', // Path or full URL
)

if (result.success) {
  console.log('Image deleted')
}
```

### Replace Image

```typescript
import { replaceImage } from '@/lib/storage/image-upload'

const result = await replaceImage(
  newFile, // New file
  oldImageUrl, // Old URL (will be deleted)
  'shop', // Bucket
  'products', // Folder
)
```

### Validate Image

```typescript
import { validateImage } from '@/lib/storage/image-upload'

const validation = await validateImage(file)

if (validation.valid) {
  console.log('Image is valid!')
  if (validation.warnings) {
    validation.warnings.forEach((w) => console.warn(w))
  }
} else {
  console.error('Error:', validation.error)
}
```

## 🎨 Image Constraints

### Allowed Formats

- JPEG/JPG
- PNG
- WebP
- GIF

### Size Limits

- **Maximum**: 5MB per image
- **Minimum**: 1KB

### Dimension Limits

- **Minimum**: 100x100px
- **Maximum**: 4096x4096px

### Recommendations

- **Blog Featured**: 1200x630px (16:9)
- **Blog Gallery**: 1200x800px (3:2)
- **Shop Product**: 600x600px (1:1)
- **Shop Gallery**: 800x800px (1:1)
- **Service Featured**: 1200x675px (16:9)
- **Course Featured**: 1200x675px (16:9)
- **Project Thumbnail**: 600x400px (3:2)
- **Project Hero**: 1920x1080px (16:9)

## 🔒 Security

### Authentication

- All upload/update/delete operations require authentication
- Only logged-in users can modify images
- Public read access for viewing images

### File Validation

- Server-side format validation
- Size limit enforcement
- Dimension checking
- Malicious file detection

### Storage Policies

```sql
-- Users can upload to their designated buckets
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Users can update their images
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

-- Users can delete their images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Everyone can view images
CREATE POLICY "Public can view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

## 🚀 Performance

### CDN Delivery

- All images served via Supabase CDN
- Global edge caching
- Fast worldwide delivery

### Optimization Tips

1. **Compress Before Upload**: Use tools like TinyPNG
2. **Choose Right Format**: WebP for modern browsers, JPG for photos, PNG for graphics
3. **Optimize Dimensions**: Upload images at exact display size
4. **Lazy Loading**: Implemented via Next.js Image component

## 🛠️ Troubleshooting

### Upload Fails

**Problem**: Image won't upload

**Solutions**:

1. Check file size (max 5MB)
2. Verify file format (JPG/PNG/WebP/GIF only)
3. Ensure you're authenticated
4. Check browser console for errors
5. Verify Supabase connection

### Images Not Displaying

**Problem**: Uploaded images don't show

**Solutions**:

1. Check storage bucket policies
2. Verify public read access
3. Inspect image URL in browser
4. Check browser console for CORS errors
5. Ensure bucket exists in Supabase

### Slow Uploads

**Problem**: Upload takes too long

**Solutions**:

1. Compress images before uploading
2. Reduce image dimensions
3. Check internet connection
4. Try smaller file sizes

### Delete Doesn't Work

**Problem**: Can't delete images

**Solutions**:

1. Verify authentication
2. Check delete policy in Supabase
3. Ensure correct bucket/path
4. Look for console errors

## 📚 Integration Examples

### Blog Post with Featured Image

```tsx
const [formData, setFormData] = useState({
  title: '',
  content: '',
  featured_image_url: null,
  image_urls: []
})

// In your form
<ImageUpload
  bucket='blog'
  folder='featured'
  value={formData.featured_image_url}
  onChange={(url) => setFormData(prev => ({
    ...prev,
    featured_image_url: url as string | null
  }))}
  multiple={false}
  label='Featured Image'
  required={true}
/>

<ImageUpload
  bucket='blog'
  folder='gallery'
  value={formData.image_urls}
  onChange={(urls) => setFormData(prev => ({
    ...prev,
    image_urls: Array.isArray(urls) ? urls : []
  }))}
  multiple={true}
  maxFiles={10}
  label='Gallery Images'
/>
```

### Product with Thumbnail & Gallery

```tsx
<ImageUpload
  bucket='shop'
  folder='products'
  prefix='product'
  value={formData.thumbnail_url}
  onChange={(url) => setFormData({...formData, thumbnail_url: url as string})}
  multiple={false}
  label='Product Thumbnail'
  aspectRatio='1/1'
  required={true}
/>

<ImageUpload
  bucket='shop'
  folder='gallery'
  value={formData.image_urls}
  onChange={(urls) => setFormData({...formData, image_urls: urls as string[]})}
  multiple={true}
  maxFiles={8}
  label='Product Gallery'
/>
```

## 🎓 Best Practices

### 1. Image Naming

- System automatically generates unique filenames
- Format: `{prefix}-{sanitized-name}-{timestamp}-{random}.{ext}`
- Example: `blog-featured-my-article-1234567890-abc123.jpg`

### 2. Organization

- Use appropriate buckets for content types
- Utilize subfolders for categorization
- Consistent prefix naming convention

### 3. File Management

- Delete unused images to save storage
- Replace instead of creating duplicates
- Regular cleanup of test images

### 4. User Experience

- Always show image previews
- Provide clear feedback during upload
- Display helpful error messages
- Show upload progress

### 5. Performance

- Compress images before upload
- Use appropriate image dimensions
- Choose optimal file formats
- Implement lazy loading

## 📖 Advanced Usage

### Custom Validation

```typescript
import { validateImage, IMAGE_CONSTRAINTS } from '@/lib/storage/image-upload'

// Override default constraints
const customValidation = async (file: File) => {
  // Check custom size (2MB instead of 5MB)
  if (file.size > 2 * 1024 * 1024) {
    return { valid: false, error: 'Max 2MB allowed' }
  }

  // Use standard validation
  return validateImage(file)
}
```

### Batch Operations

```typescript
import { uploadMultipleImages, deleteImage } from '@/lib/storage/image-upload'

// Upload batch
const uploadBatch = async (files: File[]) => {
  const result = await uploadMultipleImages(files, 'media', 'uploads')

  // Get successful URLs
  const urls = result.results.filter((r) => r.success).map((r) => r.url!)

  return urls
}

// Delete batch
const deleteBatch = async (urls: string[]) => {
  await Promise.all(urls.map((url) => deleteImage('media', url)))
}
```

### Progress Tracking

The ImageUpload component handles progress internally, but you can track it manually:

```typescript
const uploadWithProgress = async (file: File) => {
  // Validate
  const validation = await validateImage(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Upload
  const result = await uploadImage(file, 'blog', 'featured')

  // Handle result
  if (result.success) {
    console.log('Uploaded:', result.url)
  }
}
```

## 🔗 Related Files

- **Component**: `/components/admin/ImageUpload.tsx`
- **Utilities**: `/lib/storage/image-upload.ts`
- **Migrations**:
  - `/supabase/migrations/create_storage_buckets.sql`
  - `/supabase/migrations/enhance_projects_table.sql`
- **Admin Pages**:
  - `/app/admin/blog/page.tsx`
  - `/app/admin/shop/page.tsx`
  - `/app/admin/services/page.tsx`
  - `/app/admin/courses/page.tsx`
  - `/app/admin/projects/page.tsx`
  - `/app/admin/media/page.tsx`

## 💡 Tips & Tricks

1. **Quick Replace**: Click on existing image then upload new one to replace
2. **Bulk Upload**: Select multiple files at once for gallery uploads
3. **Drag Multiple**: Drag multiple images together for faster upload
4. **Preview First**: Always check preview before saving
5. **Descriptive Names**: Use descriptive filenames for better organization
6. **Aspect Ratios**: Follow recommended aspect ratios for best display
7. **Mobile Testing**: Test uploads on mobile devices
8. **Error Recovery**: Failed uploads can be retried immediately

## 🎉 Success!

You now have a professional image upload system integrated throughout your portfolio application. This system provides:

- ✅ Intuitive drag-and-drop interface
- ✅ Real-time validation and feedback
- ✅ Secure, authenticated uploads
- ✅ Organized storage structure
- ✅ Fast CDN delivery
- ✅ Easy image management
- ✅ Mobile-friendly design

Happy uploading! 🚀
