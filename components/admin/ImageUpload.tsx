/**
 * Enterprise-grade Image Upload Component
 * Features: Drag & drop, preview, validation, progress tracking, multiple uploads
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react'
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  validateImage,
  formatFileSize,
  IMAGE_CONSTRAINTS,
  type BucketName,
  type UploadResult,
} from '@/lib/storage/image-upload'

interface ImageUploadProps {
  bucket: BucketName
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
  aspectRatio?: string // e.g., "16/9", "1/1", "4/3"
  showPreview?: boolean
  className?: string
}

interface FileWithPreview {
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export default function ImageUpload({
  bucket,
  folder,
  prefix,
  value,
  onChange,
  onDelete,
  multiple = false,
  maxFiles = 10,
  label,
  description,
  required = false,
  disabled = false,
  aspectRatio,
  showPreview = true,
  className = '',
}: ImageUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [validationError, setValidationError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get current images as array
  const currentImages = Array.isArray(value)
    ? value.filter((url): url is string => url !== null)
    : value
      ? [value]
      : []

  const handleFileSelect = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles || disabled) return

      setValidationError('')

      // Check max files limit
      const totalFiles =
        currentImages.length + selectedFiles.length + files.length
      if (totalFiles > maxFiles) {
        setValidationError(`Maximum ${maxFiles} images allowed`)
        return
      }

      if (!multiple && selectedFiles.length > 1) {
        setValidationError('Only one image can be uploaded')
        return
      }

      // Validate all files
      const fileArray = Array.from(selectedFiles)
      const validatedFiles: FileWithPreview[] = []

      for (const file of fileArray) {
        const validation = await validateImage(file)

        if (!validation.valid) {
          setValidationError(validation.error || 'Invalid file')
          continue
        }

        validatedFiles.push({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'pending',
        })
      }

      if (validatedFiles.length > 0) {
        setFiles((prev) => [...prev, ...validatedFiles])
        // Auto-upload
        handleUpload(validatedFiles)
      }
    },
    [bucket, currentImages.length, files.length, maxFiles, multiple, disabled],
  )

  const handleUpload = async (filesToUpload: FileWithPreview[]) => {
    setValidationError('')

    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.includes(f)
            ? { ...f, status: 'uploading' as const }
            : f,
        ),
      )

      if (multiple) {
        // Upload multiple files
        const results = await uploadMultipleImages(
          filesToUpload.map((f) => f.file),
          bucket,
          folder,
          prefix,
        )

        // Update files with results
        const updatedFiles = filesToUpload.map((f, index) => {
          const result = results.results[index]
          return {
            ...f,
            status: result.success ? ('success' as const) : ('error' as const),
            error: result.error,
            url: result.url,
            progress: 100,
          }
        })

        setFiles((prev) =>
          prev.map((f) => {
            const updated = updatedFiles.find((u) => u.file === f.file)
            return updated || f
          }),
        )

        // Update value with successful uploads
        const successUrls = updatedFiles.filter((f) => f.url).map((f) => f.url!)
        if (successUrls.length > 0) {
          onChange([...currentImages, ...successUrls])
        }

        // Clear successful uploads after delay
        setTimeout(() => {
          setFiles((prev) => prev.filter((f) => f.status !== 'success'))
        }, 2000)
      } else {
        // Upload single file
        const fileToUpload = filesToUpload[0]
        const result = await uploadImage(
          fileToUpload.file,
          bucket,
          folder,
          prefix,
        )

        if (result.success && result.url) {
          setFiles((prev) =>
            prev.map((f) =>
              f === fileToUpload
                ? { ...f, status: 'success', url: result.url, progress: 100 }
                : f,
            ),
          )

          onChange(result.url)

          // Clear after delay
          setTimeout(() => {
            setFiles([])
          }, 2000)
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f === fileToUpload
                ? { ...f, status: 'error', error: result.error, progress: 0 }
                : f,
            ),
          )
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      setValidationError(
        error instanceof Error ? error.message : 'Failed to upload images',
      )

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.includes(f)
            ? {
                ...f,
                status: 'error' as const,
                error: 'Upload failed',
                progress: 0,
              }
            : f,
        ),
      )
    }
  }

  const handleDelete = async (imageUrl: string) => {
    if (disabled) return

    try {
      const result = await deleteImage(bucket, imageUrl)

      if (result.success) {
        if (multiple) {
          onChange(currentImages.filter((url) => url !== imageUrl))
        } else {
          onChange(null)
        }

        onDelete?.(imageUrl)
      } else {
        setValidationError(result.error || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setValidationError('Failed to delete image')
    }
  }

  const removeFile = (fileToRemove: FileWithPreview) => {
    URL.revokeObjectURL(fileToRemove.preview)
    setFiles((prev) => prev.filter((f) => f !== fileToRemove))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (!disabled) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const totalImages =
    currentImages.length + files.filter((f) => f.status === 'success').length

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
      {(multiple || currentImages.length === 0) && totalImages < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
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
            accept={IMAGE_CONSTRAINTS.allowedTypes.join(',')}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled}
            className='hidden'
          />

          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
          />

          <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            {isDragging
              ? 'Drop images here'
              : 'Click to upload or drag and drop'}
          </p>

          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {IMAGE_CONSTRAINTS.allowedExtensions.join(', ').toUpperCase()} up to{' '}
            {IMAGE_CONSTRAINTS.maxSizeMB}MB
          </p>

          {multiple && (
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              {totalImages}/{maxFiles} images uploaded
            </p>
          )}
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className='flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <AlertCircle className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
          <p className='text-sm text-red-700 dark:text-red-300'>
            {validationError}
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {files.length > 0 && (
        <div className='space-y-2'>
          {files.map((file, index) => (
            <div
              key={index}
              className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
            >
              {/* Preview */}
              <div className='w-12 h-12 relative rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0'>
                {file.preview && (
                  <Image
                    src={file.preview}
                    alt='Preview'
                    fill
                    className='object-cover'
                  />
                )}
              </div>

              {/* File Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                  {file.file.name}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {formatFileSize(file.file.size)}
                </p>

                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className='mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
                    <div
                      className='bg-blue-500 h-1.5 rounded-full transition-all duration-300'
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {file.status === 'error' && file.error && (
                  <p className='text-xs text-red-500 mt-1'>{file.error}</p>
                )}
              </div>

              {/* Status Icon */}
              <div className='shrink-0'>
                {file.status === 'uploading' && (
                  <Loader2 className='w-5 h-5 text-blue-500 animate-spin' />
                )}
                {file.status === 'success' && (
                  <CheckCircle className='w-5 h-5 text-green-500' />
                )}
                {file.status === 'error' && (
                  <AlertCircle className='w-5 h-5 text-red-500' />
                )}
                {file.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file)
                    }}
                    className='p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
                  >
                    <X className='w-4 h-4 text-gray-500' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Images Preview */}
      {showPreview && currentImages.length > 0 && (
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Current Images
          </p>
          <div
            className={`grid gap-4 ${
              multiple
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 max-w-md'
            }`}
          >
            {currentImages.map((imageUrl, index) => (
              <div
                key={index}
                className='group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
              >
                <Image
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  fill
                  className='object-cover'
                />

                {/* Overlay with delete button */}
                {!disabled && (
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <button
                      onClick={() => handleDelete(imageUrl)}
                      className='p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
                      title='Delete image'
                    >
                      <Trash2 className='w-5 h-5 text-white' />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
        <p>
          • Supported formats: {IMAGE_CONSTRAINTS.allowedExtensions.join(', ')}
        </p>
        <p>• Maximum file size: {IMAGE_CONSTRAINTS.maxSizeMB}MB</p>
        <p>
          • Recommended dimensions: {IMAGE_CONSTRAINTS.minWidth}x
          {IMAGE_CONSTRAINTS.minHeight}px minimum
        </p>
        {aspectRatio && <p>• Recommended aspect ratio: {aspectRatio}</p>}
      </div>
    </div>
  )
}
