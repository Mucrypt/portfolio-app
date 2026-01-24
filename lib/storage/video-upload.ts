/**
 * Enterprise Video Upload System
 * Handles video uploads, validation, and management with Supabase Storage
 * Optimized for fast loading and best practices like YouTube/Udemy
 */

import { createClient } from '@/lib/supabase/client'

// Video constraints for enterprise-grade uploads
export const VIDEO_CONSTRAINTS = {
  maxSize: 500 * 1024 * 1024, // 500MB max
  minSize: 1024, // 1KB min
  allowedTypes: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
  ],
  allowedExtensions: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'],
  maxDuration: 7200, // 2 hours in seconds
}

// Video storage buckets
export const VIDEO_BUCKETS = {
  courses: 'course-videos',
  blog: 'blog-videos',
  projects: 'project-videos',
  services: 'service-videos',
  media: 'media-videos',
} as const

export type VideoBucketName = keyof typeof VIDEO_BUCKETS

interface VideoValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
  metadata?: {
    duration?: number
    width?: number
    height?: number
    size: number
  }
}

interface VideoUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
  metadata?: {
    duration?: number
    width?: number
    height?: number
    size: number
  }
}

/**
 * Get video metadata (duration, dimensions) using HTML5 Video API
 */
export async function getVideoMetadata(
  file: File,
): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'))
    }

    video.src = URL.createObjectURL(file)
  })
}

/**
 * Validate video file before upload
 */
export async function validateVideo(
  file: File,
): Promise<VideoValidationResult> {
  const warnings: string[] = []

  // Check file type
  if (!VIDEO_CONSTRAINTS.allowedTypes.includes(file.type)) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !VIDEO_CONSTRAINTS.allowedExtensions.includes(`.${ext}`)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${VIDEO_CONSTRAINTS.allowedExtensions.join(', ')}`,
      }
    }
  }

  // Check file size
  if (file.size > VIDEO_CONSTRAINTS.maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${formatFileSize(VIDEO_CONSTRAINTS.maxSize)}`,
    }
  }

  if (file.size < VIDEO_CONSTRAINTS.minSize) {
    return {
      valid: false,
      error: 'File too small. Minimum size: 1KB',
    }
  }

  try {
    // Get video metadata
    const metadata = await getVideoMetadata(file)

    // Check duration
    if (metadata.duration > VIDEO_CONSTRAINTS.maxDuration) {
      return {
        valid: false,
        error: `Video too long. Maximum duration: ${VIDEO_CONSTRAINTS.maxDuration / 60} minutes`,
      }
    }

    // Warnings for optimal settings
    if (metadata.width > 1920 || metadata.height > 1080) {
      warnings.push(
        'Video resolution is higher than Full HD (1920x1080). Consider compressing for faster loading.',
      )
    }

    if (file.size > 100 * 1024 * 1024) {
      // 100MB
      warnings.push(
        'Large file size detected. Consider compressing for better user experience.',
      )
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata: {
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        size: file.size,
      },
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read video metadata. File may be corrupted.',
    }
  }
}

/**
 * Generate unique filename for video
 */
export function generateVideoFileName(file: File, prefix?: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .substring(0, 50)

  const ext = file.name.split('.').pop()
  const nameWithoutExt = sanitizedName.replace(`.${ext}`, '')

  return prefix
    ? `${prefix}-${nameWithoutExt}-${timestamp}-${randomStr}.${ext}`
    : `${nameWithoutExt}-${timestamp}-${randomStr}.${ext}`
}

/**
 * Upload video to Supabase Storage with progress tracking
 */
export async function uploadVideo(
  file: File,
  bucket: VideoBucketName,
  folder?: string,
  prefix?: string,
  onProgress?: (progress: number) => void,
): Promise<VideoUploadResult> {
  try {
    // Validate video
    const validation = await validateVideo(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Generate unique filename
    const fileName = generateVideoFileName(file, prefix)
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const supabase = createClient()

    // Upload with progress tracking
    const { data, error } = await supabase.storage
      .from(VIDEO_BUCKETS[bucket])
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(VIDEO_BUCKETS[bucket]).getPublicUrl(data.path)

    return {
      success: true,
      url: publicUrl,
      path: data.path,
      metadata: validation.metadata,
    }
  } catch (error) {
    console.error('Video upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete video from storage
 */
export async function deleteVideo(
  bucket: VideoBucketName,
  pathOrUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Extract path from URL if full URL provided
    let path = pathOrUrl
    if (pathOrUrl.includes('supabase.co')) {
      const urlParts = pathOrUrl.split('/storage/v1/object/public/')
      if (urlParts.length > 1) {
        const afterBucket = urlParts[1].split('/').slice(1).join('/')
        path = afterBucket
      }
    }

    const { error } = await supabase.storage
      .from(VIDEO_BUCKETS[bucket])
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Video delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}

/**
 * Upload multiple videos
 */
export async function uploadMultipleVideos(
  files: File[],
  bucket: VideoBucketName,
  folder?: string,
  prefix?: string,
  onProgress?: (fileIndex: number, progress: number) => void,
): Promise<{
  results: VideoUploadResult[]
  successCount: number
  failureCount: number
}> {
  const results: VideoUploadResult[] = []
  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < files.length; i++) {
    const result = await uploadVideo(
      files[i],
      bucket,
      folder,
      prefix,
      (progress) => onProgress?.(i, progress),
    )

    results.push(result)
    if (result.success) {
      successCount++
    } else {
      failureCount++
    }
  }

  return { results, successCount, failureCount }
}

/**
 * Replace existing video
 */
export async function replaceVideo(
  newFile: File,
  oldVideoUrl: string,
  bucket: VideoBucketName,
  folder?: string,
  prefix?: string,
): Promise<VideoUploadResult> {
  try {
    // Upload new video
    const uploadResult = await uploadVideo(newFile, bucket, folder, prefix)

    if (uploadResult.success && oldVideoUrl) {
      // Delete old video (don't fail if deletion fails)
      await deleteVideo(bucket, oldVideoUrl).catch(console.error)
    }

    return uploadResult
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Replace failed',
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

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format duration for display (seconds to HH:MM:SS or MM:SS)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get video thumbnail from video element
 */
export async function generateVideoThumbnail(
  videoFile: File,
): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    video.onloadeddata = () => {
      // Seek to 10% of video for better thumbnail
      video.currentTime = video.duration * 0.1
    }

    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          resolve(null)
        }
      }, 'image/jpeg')

      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => resolve(null)

    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}
