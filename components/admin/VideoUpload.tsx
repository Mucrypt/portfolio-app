/**
 * Enterprise Video Upload Component
 * Reusable component for uploading and managing videos
 * Optimized for performance like YouTube/Udemy
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import {
  uploadVideo,
  deleteVideo,
  validateVideo,
  formatFileSize,
  formatDuration,
  generateVideoThumbnail,
  type VideoBucketName,
} from '@/lib/storage/video-upload'
import {
  Upload,
  X,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Film,
} from 'lucide-react'

interface VideoUploadProps {
  bucket: VideoBucketName
  folder?: string
  prefix?: string
  value?: string | string[] | null
  onChange: (url: string | string[] | null) => void
  onDelete?: (url: string) => void
  multiple?: boolean
  maxFiles?: number
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  showPreview?: boolean
  className?: string
}

interface VideoWithPreview {
  file: File
  preview: string
  thumbnail?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
  metadata?: {
    duration?: number
    width?: number
    height?: number
    size: number
  }
}

export default function VideoUpload({
  bucket,
  folder,
  prefix,
  value,
  onChange,
  onDelete,
  multiple = false,
  maxFiles = 5,
  label,
  description,
  required = false,
  disabled = false,
  showPreview = true,
  className = '',
}: VideoUploadProps) {
  const [videos, setVideos] = useState<VideoWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentUrls = Array.isArray(value) ? value : value ? [value] : []

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const newVideos: VideoWithPreview[] = []

      for (const file of fileArray) {
        // Check max files limit
        if (
          multiple &&
          videos.length + newVideos.length + currentUrls.length >= maxFiles
        ) {
          alert(`Maximum ${maxFiles} videos allowed`)
          break
        }

        // Validate video
        const validation = await validateVideo(file)
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`)
          continue
        }

        // Show warnings
        if (validation.warnings && validation.warnings.length > 0) {
          console.warn(`${file.name}:`, validation.warnings)
        }

        // Generate thumbnail
        const thumbnail = await generateVideoThumbnail(file)

        newVideos.push({
          file,
          preview: URL.createObjectURL(file),
          thumbnail: thumbnail || undefined,
          progress: 0,
          status: 'pending',
          metadata: validation.metadata,
        })
      }

      setVideos((prev) => [...prev, ...newVideos])

      // Auto-upload
      for (let i = 0; i < newVideos.length; i++) {
        await uploadSingleVideo(videos.length + i)
      }
    },
    [videos, multiple, maxFiles, currentUrls.length],
  )

  const uploadSingleVideo = async (index: number) => {
    setVideos((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], status: 'uploading', progress: 0 }
      return updated
    })

    const video = videos[index]
    if (!video) return

    try {
      const result = await uploadVideo(
        video.file,
        bucket,
        folder,
        prefix,
        (progress) => {
          setVideos((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], progress }
            return updated
          })
        },
      )

      if (result.success && result.url) {
        setVideos((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            status: 'success',
            progress: 100,
            url: result.url,
            metadata: result.metadata,
          }
          return updated
        })

        // Update parent component
        if (multiple) {
          const newUrls = [...currentUrls, result.url]
          onChange(newUrls)
        } else {
          onChange(result.url)
        }
      } else {
        setVideos((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            status: 'error',
            error: result.error || 'Upload failed',
          }
          return updated
        })
      }
    } catch (error) {
      setVideos((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        }
        return updated
      })
    }
  }

  const handleDelete = async (
    urlToDelete: string,
    isFromList: boolean = false,
  ) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const result = await deleteVideo(bucket, urlToDelete)

      if (result.success) {
        if (isFromList) {
          // Remove from current URLs
          if (multiple) {
            const newUrls = currentUrls.filter((url) => url !== urlToDelete)
            onChange(newUrls.length > 0 ? newUrls : null)
          } else {
            onChange(null)
          }
        }

        onDelete?.(urlToDelete)
      } else {
        alert(`Failed to delete: ${result.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete video')
    }
  }

  const removeFromQueue = (index: number) => {
    const video = videos[index]
    if (video) {
      URL.revokeObjectURL(video.preview)
      if (video.thumbnail) {
        URL.revokeObjectURL(video.thumbnail)
      }
    }
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          {description}
        </p>
      )}

      {/* Upload Area */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='video/*'
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFileSelect(e.target.files)}
          className='hidden'
        />

        <div className='flex flex-col items-center space-y-3'>
          <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full'>
            <Upload className='w-8 h-8 text-blue-600 dark:text-blue-400' />
          </div>

          <div>
            <p className='text-base font-medium text-gray-700 dark:text-gray-300'>
              Click to upload or drag and drop
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              MP4, WebM, OGG (Max 500MB, up to 2 hours)
            </p>
          </div>

          {multiple && (
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Upload up to {maxFiles} videos
            </p>
          )}
        </div>
      </div>

      {/* Upload Queue */}
      {videos.length > 0 && (
        <div className='space-y-3'>
          {videos.map((video, index) => (
            <div
              key={index}
              className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'
            >
              {/* Thumbnail/Preview */}
              <div className='relative w-24 h-16 shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden'>
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt='Video thumbnail'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <Film className='w-8 h-8 text-gray-400' />
                  </div>
                )}
                <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                  <Play className='w-6 h-6 text-white' />
                </div>
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                  {video.file.name}
                </p>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {formatFileSize(video.file.size)}
                  </span>
                  {video.metadata?.duration && (
                    <>
                      <span className='text-gray-400'>•</span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatDuration(video.metadata.duration)}
                      </span>
                    </>
                  )}
                  {video.metadata?.width && video.metadata?.height && (
                    <>
                      <span className='text-gray-400'>•</span>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {video.metadata.width}x{video.metadata.height}
                      </span>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {video.status === 'uploading' && (
                  <div className='mt-2'>
                    <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full transition-all duration-300'
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {video.status === 'error' && video.error && (
                  <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                    {video.error}
                  </p>
                )}
              </div>

              {/* Status Icon */}
              <div className='shrink-0'>
                {video.status === 'uploading' && (
                  <Loader2 className='w-5 h-5 text-blue-600 animate-spin' />
                )}
                {video.status === 'success' && (
                  <CheckCircle2 className='w-5 h-5 text-green-600' />
                )}
                {video.status === 'error' && (
                  <AlertCircle className='w-5 h-5 text-red-600' />
                )}
                {video.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromQueue(index)
                    }}
                    className='p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded'
                  >
                    <X className='w-4 h-4 text-gray-500' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Videos */}
      {showPreview && currentUrls.length > 0 && (
        <div className='space-y-3'>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Current Videos
          </p>
          <div className='grid grid-cols-1 gap-3'>
            {currentUrls.map((url, index) => (
              <div
                key={url}
                className='relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'
              >
                <video
                  src={url}
                  controls
                  preload='metadata'
                  className='w-full h-48 object-cover bg-black'
                />
                <button
                  onClick={() => handleDelete(url, true)}
                  className='absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                  title='Delete video'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
