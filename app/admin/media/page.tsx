/**
 * Media Library Admin Page
 * Central hub for managing all uploaded images across the portfolio
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  Image as ImageIcon,
  Trash2,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Folder,
  Search,
  Grid3x3,
  List,
} from 'lucide-react'
import {
  STORAGE_BUCKETS,
  deleteImage,
  formatFileSize,
  type BucketName,
} from '@/lib/storage/image-upload'

interface MediaFile {
  name: string
  id: string
  bucket_id: string
  created_at: string
  updated_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

export default function AdminMediaPage() {
  const [selectedBucket, setSelectedBucket] = useState<BucketName>('media')
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchFiles()
  }, [selectedBucket])

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase.storage
        .from(STORAGE_BUCKETS[selectedBucket])
        .list()

      if (fetchError) throw fetchError

      setFiles(data || [])
    } catch (err) {
      console.error('Error fetching files:', err)
      setError(
        'Failed to load media files. Make sure storage buckets are created.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return

    try {
      const result = await deleteImage(selectedBucket, file.name)

      if (result.success) {
        fetchFiles()
      } else {
        alert(`Failed to delete: ${result.error}`)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete file')
    }
  }

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS[selectedBucket])
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const downloadFile = async (file: MediaFile) => {
    const url = getPublicUrl(file.name)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
                <ImageIcon className='w-8 h-8 text-blue-600' />
                Media Library
              </h1>
              <p className='text-gray-600 dark:text-gray-400 mt-1'>
                Manage all your uploaded images across your portfolio
              </p>
            </div>

            {/* View Toggle */}
            <div className='flex gap-2'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid3x3 className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Bucket Selector */}
          <div className='flex gap-2 flex-wrap'>
            {(Object.keys(STORAGE_BUCKETS) as BucketName[]).map((bucket) => (
              <button
                key={bucket}
                onClick={() => setSelectedBucket(bucket)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedBucket === bucket
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Folder className='w-4 h-4' />
                {bucket.charAt(0).toUpperCase() + bucket.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-6'>
        {/* Error Alert */}
        {error && (
          <div className='mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <AlertCircle className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
            <div className='flex-1'>
              <p className='text-sm text-red-700 dark:text-red-300 font-medium'>
                {error}
              </p>
              <p className='text-xs text-red-600 dark:text-red-400 mt-1'>
                Please run the SQL migration in Supabase SQL Editor to create
                the storage buckets.
              </p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className='mb-8'>
          <ImageUpload
            bucket={selectedBucket}
            folder={undefined}
            prefix={`${selectedBucket}-upload`}
            value={null}
            onChange={() => {
              fetchFiles()
            }}
            multiple={true}
            maxFiles={20}
            label={`Upload to ${selectedBucket} bucket`}
            description='Upload images to the selected storage bucket'
            showPreview={false}
          />
        </div>

        {/* Search */}
        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search files...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Files List */}
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center'>
            <ImageIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              {files.length === 0
                ? 'No files in this bucket yet'
                : 'No files match your search'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {filteredFiles.map((file) => {
              const publicUrl = getPublicUrl(file.name)

              return (
                <div
                  key={file.id}
                  className='group relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors'
                >
                  <Image
                    src={publicUrl}
                    alt={file.name}
                    fill
                    className='object-cover'
                  />

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4'>
                    <p className='text-white text-xs font-medium text-center truncate w-full'>
                      {file.name}
                    </p>
                    <p className='text-white/80 text-xs'>
                      {formatFileSize(file.metadata.size)}
                    </p>

                    <div className='flex gap-2 mt-2'>
                      <button
                        onClick={() => copyToClipboard(publicUrl)}
                        className='p-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors'
                        title='Copy URL'
                      >
                        {copiedUrl === publicUrl ? (
                          <CheckCircle className='w-4 h-4 text-white' />
                        ) : (
                          <Copy className='w-4 h-4 text-white' />
                        )}
                      </button>
                      <button
                        onClick={() => downloadFile(file)}
                        className='p-2 bg-green-500 hover:bg-green-600 rounded transition-colors'
                        title='Download'
                      >
                        <Download className='w-4 h-4 text-white' />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className='p-2 bg-red-500 hover:bg-red-600 rounded transition-colors'
                        title='Delete'
                      >
                        <Trash2 className='w-4 h-4 text-white' />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {filteredFiles.map((file) => {
                const publicUrl = getPublicUrl(file.name)

                return (
                  <div
                    key={file.id}
                    className='flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors'
                  >
                    {/* Thumbnail */}
                    <div className='w-16 h-16 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0'>
                      <Image
                        src={publicUrl}
                        alt={file.name}
                        fill
                        className='object-cover'
                      />
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-gray-900 dark:text-white truncate'>
                        {file.name}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {formatFileSize(file.metadata.size)} • Uploaded{' '}
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2 shrink-0'>
                      <button
                        onClick={() => copyToClipboard(publicUrl)}
                        className='p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors'
                        title='Copy URL'
                      >
                        {copiedUrl === publicUrl ? (
                          <CheckCircle className='w-5 h-5' />
                        ) : (
                          <Copy className='w-5 h-5' />
                        )}
                      </button>
                      <button
                        onClick={() => downloadFile(file)}
                        className='p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors'
                        title='Download'
                      >
                        <Download className='w-5 h-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className='p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors'
                        title='Delete'
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className='mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>
              {filteredFiles.length}{' '}
              {filteredFiles.length === 1 ? 'file' : 'files'} in{' '}
              <span className='font-medium text-gray-900 dark:text-white'>
                {selectedBucket}
              </span>{' '}
              bucket
            </span>
            <span className='text-gray-600 dark:text-gray-400'>
              Total size:{' '}
              <span className='font-medium text-gray-900 dark:text-white'>
                {formatFileSize(
                  filteredFiles.reduce((sum, f) => sum + f.metadata.size, 0),
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
