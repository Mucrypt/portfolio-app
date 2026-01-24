/**
 * Enterprise-grade image upload utilities for Supabase Storage
 * Handles validation, optimization, and secure uploads
 */

import { createClient } from '@/lib/supabase/client'

export const IMAGE_CONSTRAINTS = {
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  minWidth: 100,
  minHeight: 100,
  maxWidth: 4096,
  maxHeight: 4096,
}

export const STORAGE_BUCKETS = {
  blog: 'blog-images',
  shop: 'shop-images',
  services: 'services-images',
  courses: 'courses-images',
  projects: 'projects-images',
  media: 'media-library',
} as const

export type BucketName = keyof typeof STORAGE_BUCKETS

export interface ImageValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
}

export interface ImageMetadata {
  width: number
  height: number
  size: number
  type: string
  name: string
}

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

/**
 * Validate image file before upload
 */
export async function validateImage(
  file: File,
): Promise<ImageValidationResult> {
  const warnings: string[] = []

  // Check file type
  if (!IMAGE_CONSTRAINTS.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${IMAGE_CONSTRAINTS.allowedExtensions.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${IMAGE_CONSTRAINTS.maxSizeMB}MB limit`,
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    }
  }

  // Validate image dimensions
  try {
    const dimensions = await getImageDimensions(file)

    if (
      dimensions.width < IMAGE_CONSTRAINTS.minWidth ||
      dimensions.height < IMAGE_CONSTRAINTS.minHeight
    ) {
      return {
        valid: false,
        error: `Image dimensions too small. Minimum: ${IMAGE_CONSTRAINTS.minWidth}x${IMAGE_CONSTRAINTS.minHeight}px`,
      }
    }

    if (
      dimensions.width > IMAGE_CONSTRAINTS.maxWidth ||
      dimensions.height > IMAGE_CONSTRAINTS.maxHeight
    ) {
      warnings.push(
        `Image is very large (${dimensions.width}x${dimensions.height}px). Consider resizing for better performance.`,
      )
    }

    // Warn about file size
    if (file.size > 2 * 1024 * 1024) {
      // 2MB
      warnings.push(
        `File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Consider optimizing for faster loading.`,
      )
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read image file. The file may be corrupted.',
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type,
        name: file.name,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Generate unique file name with timestamp
 */
export function generateFileName(
  originalName: string,
  prefix?: string,
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const extension = originalName.substring(originalName.lastIndexOf('.'))
  const sanitizedName = originalName
    .substring(0, originalName.lastIndexOf('.'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)

  if (prefix) {
    return `${prefix}-${sanitizedName}-${timestamp}-${random}${extension}`
  }

  return `${sanitizedName}-${timestamp}-${random}${extension}`
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: BucketName,
  folder?: string,
  prefix?: string,
): Promise<UploadResult> {
  const supabase = createClient()

  try {
    // Validate image
    const validation = await validateImage(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    // Generate unique file name
    const fileName = generateFileName(file.name, prefix)
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  bucket: BucketName,
  path: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    // Extract file path from URL if full URL is provided
    let filePath = path
    if (path.includes('supabase.co')) {
      const url = new URL(path)
      const pathParts = url.pathname.split('/')
      const bucketIndex = pathParts.indexOf(STORAGE_BUCKETS[bucket])
      if (bucketIndex !== -1) {
        filePath = pathParts.slice(bucketIndex + 1).join('/')
      }
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete image',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    }
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: BucketName,
  folder?: string,
  prefix?: string,
): Promise<{
  success: boolean
  results: UploadResult[]
  successCount: number
  failureCount: number
}> {
  const results: UploadResult[] = []

  for (const file of files) {
    const result = await uploadImage(file, bucket, folder, prefix)
    results.push(result)
  }

  const successCount = results.filter((r) => r.success).length
  const failureCount = results.filter((r) => !r.success).length

  return {
    success: successCount > 0,
    results,
    successCount,
    failureCount,
  }
}

/**
 * Replace existing image (upload new, delete old)
 */
export async function replaceImage(
  newFile: File,
  oldImageUrl: string | null | undefined,
  bucket: BucketName,
  folder?: string,
  prefix?: string,
): Promise<UploadResult> {
  try {
    // Upload new image
    const uploadResult = await uploadImage(newFile, bucket, folder, prefix)

    if (!uploadResult.success) {
      return uploadResult
    }

    // Delete old image if it exists
    if (oldImageUrl) {
      await deleteImage(bucket, oldImageUrl)
    }

    return uploadResult
  } catch (error) {
    console.error('Replace image error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to replace image',
    }
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
