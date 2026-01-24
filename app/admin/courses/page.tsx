/**
 * Enterprise Admin Courses Page
 * Professional course management with videos and images
 * World-class UI for managing courses like a pro
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoUpload from '@/components/admin/VideoUpload'
import {
  BookOpen,
  Video,
  Image,
  Star,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Award,
  Target,
  Zap,
  Tag,
  List,
  User,
  Folder,
  Link2,
} from 'lucide-react'

type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string
  thumbnail_url: string | null
  promo_video_url: string | null
  gallery_images: string[] | null
  lesson_videos: string[] | null
  instructor_name: string
  platform: string
  affiliate_link: string
  original_price: number | null
  discounted_price: number | null
  currency: string | null
  duration_hours: number | null
  level: string | null
  category: string
  language: string | null
  rating: number | null
  students_count: number | null
  what_you_learn: string[] | null
  requirements: string[] | null
  tags: string[] | null
  is_featured: boolean | null
  is_published: boolean | null
  sort_order: number | null
  created_at: string | null
  updated_at: string | null
}

const platforms = [
  'Udemy',
  'Coursera',
  'Teachable',
  'LinkedIn Learning',
  'Pluralsight',
  'Skillshare',
  'Other',
]
const categories = [
  'Web Development',
  'Mobile Development',
  'Backend',
  'DevOps',
  'Data Science',
  'Design',
  'Business',
  'Other',
]
const levels = ['Beginner', 'Intermediate', 'Advanced']

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'details' | 'content'
  >('basic')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPublished, setFilterPublished] = useState<string>('all')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    thumbnail_url: '' as string | null,
    promo_video_url: '' as string | null,
    gallery_images: [] as string[],
    lesson_videos: [] as string[],
    instructor_name: '',
    platform: 'Udemy',
    affiliate_link: '',
    original_price: '',
    discounted_price: '',
    currency: 'USD',
    duration_hours: '',
    level: 'Beginner',
    category: 'Web Development',
    language: 'English',
    rating: '',
    students_count: '',
    what_you_learn: '',
    requirements: '',
    tags: '',
    is_featured: false,
    is_published: true,
    sort_order: '0',
  })

  async function loadCourses() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('owner_user_id', user.id)
      .order('sort_order', { ascending: true })

    setCourses(data || [])
  }

  useEffect(() => {
    loadCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  async function saveCourse() {
    if (!formData.title || !formData.affiliate_link) {
      setMessage({
        type: 'error',
        text: 'Title and Affiliate Link are required!',
      })
      return
    }

    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const courseData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      short_description: formData.short_description || null,
      description: formData.description,
      thumbnail_url: formData.thumbnail_url || null,
      promo_video_url: formData.promo_video_url || null,
      gallery_images:
        formData.gallery_images.length > 0 ? formData.gallery_images : null,
      lesson_videos:
        formData.lesson_videos.length > 0 ? formData.lesson_videos : null,
      instructor_name: formData.instructor_name,
      platform: formData.platform,
      affiliate_link: formData.affiliate_link,
      original_price: formData.original_price
        ? parseFloat(formData.original_price)
        : null,
      discounted_price: formData.discounted_price
        ? parseFloat(formData.discounted_price)
        : null,
      currency: formData.currency,
      duration_hours: formData.duration_hours
        ? parseFloat(formData.duration_hours)
        : null,
      level: formData.level,
      category: formData.category,
      language: formData.language,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      students_count: formData.students_count
        ? parseInt(formData.students_count)
        : 0,
      what_you_learn: formData.what_you_learn
        ? formData.what_you_learn.split('\n').filter(Boolean)
        : [],
      requirements: formData.requirements
        ? formData.requirements.split('\n').filter(Boolean)
        : [],
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      sort_order: parseInt(formData.sort_order) || 0,
      owner_user_id: user.id,
    }

    const { error } = editingCourse
      ? await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id)
      : await supabase.from('courses').insert(courseData)

    if (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } else {
      setMessage({
        type: 'success',
        text: editingCourse
          ? 'Course updated successfully! 🎉'
          : 'Course created successfully! 🎉',
      })
      resetForm()
      loadCourses()
    }
    setLoading(false)
    setTimeout(() => setMessage(null), 4000)
  }

  async function deleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (!error) {
      setMessage({ type: 'success', text: 'Course deleted successfully!' })
      loadCourses()
    }
    setTimeout(() => setMessage(null), 3000)
  }

  function editCourse(course: Course) {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || '',
      description: course.description,
      thumbnail_url: course.thumbnail_url || '',
      promo_video_url: course.promo_video_url || '',
      gallery_images: course.gallery_images || [],
      lesson_videos: course.lesson_videos || [],
      instructor_name: course.instructor_name,
      platform: course.platform,
      affiliate_link: course.affiliate_link,
      original_price: course.original_price?.toString() || '',
      discounted_price: course.discounted_price?.toString() || '',
      currency: course.currency || 'USD',
      duration_hours: course.duration_hours?.toString() || '',
      level: course.level || 'Beginner',
      category: course.category,
      language: course.language || 'English',
      rating: course.rating?.toString() || '',
      students_count: course.students_count?.toString() || '',
      what_you_learn: course.what_you_learn?.join('\n') || '',
      requirements: course.requirements?.join('\n') || '',
      tags: course.tags?.join(', ') || '',
      is_featured: course.is_featured || false,
      is_published: course.is_published || false,
      sort_order: course.sort_order?.toString() || '0',
    })
    setActiveTab('basic')
  }

  function resetForm() {
    setEditingCourse(null)
    setActiveTab('basic')
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      thumbnail_url: '',
      promo_video_url: '',
      gallery_images: [],
      lesson_videos: [],
      instructor_name: '',
      platform: 'Udemy',
      affiliate_link: '',
      original_price: '',
      discounted_price: '',
      currency: 'USD',
      duration_hours: '',
      level: 'Beginner',
      category: 'Web Development',
      language: 'English',
      rating: '',
      students_count: '',
      what_you_learn: '',
      requirements: '',
      tags: '',
      is_featured: false,
      is_published: true,
      sort_order: '0',
    })
  }

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || course.category === filterCategory
    const matchesPublished =
      filterPublished === 'all' ||
      (filterPublished === 'published' && course.is_published) ||
      (filterPublished === 'draft' && !course.is_published)

    return matchesSearch && matchesCategory && matchesPublished
  })

  // Stats
  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.is_published).length,
    featured: courses.filter((c) => c.is_featured).length,
    draft: courses.filter((c) => !c.is_published).length,
  }

  return (
    <div className='max-w-7xl mx-auto p-4 md:p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3'>
          <BookOpen className='w-8 h-8 md:w-10 md:h-10 text-blue-600' />
          Course Management
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Manage your courses like a pro with videos, images, and more
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Dashboard */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 md:p-6 rounded-xl border border-blue-200 dark:border-blue-800'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              Total Courses
            </span>
            <BookOpen className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          </div>
          <p className='text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100'>
            {stats.total}
          </p>
        </div>

        <div className='bg-green-50 dark:bg-green-900/20 p-4 md:p-6 rounded-xl border border-green-200 dark:border-green-800'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-green-600 dark:text-green-400'>
              Published
            </span>
            <Eye className='w-5 h-5 text-green-600 dark:text-green-400' />
          </div>
          <p className='text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100'>
            {stats.published}
          </p>
        </div>

        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 md:p-6 rounded-xl border border-yellow-200 dark:border-yellow-800'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>
              Featured
            </span>
            <Star className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
          </div>
          <p className='text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-100'>
            {stats.featured}
          </p>
        </div>

        <div className='bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
              Drafts
            </span>
            <EyeOff className='w-5 h-5 text-gray-600 dark:text-gray-400' />
          </div>
          <p className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100'>
            {stats.draft}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-white dark:bg-zinc-900 rounded-xl shadow border border-gray-200 dark:border-zinc-800 p-4 md:p-6 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Search Courses
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by title or instructor...'
              className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Filter by Status
            </label>
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='all'>All Status</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Form Section */}
        <div className='lg:col-span-2'>
          <div className='bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold flex items-center gap-3'>
                {editingCourse ? (
                  <>
                    <Edit className='w-6 h-6 text-blue-600' />
                    Edit Course
                  </>
                ) : (
                  <>
                    <Plus className='w-6 h-6 text-green-600' />
                    Add New Course
                  </>
                )}
              </h2>
              {editingCourse && (
                <button
                  onClick={resetForm}
                  className='flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors'
                >
                  <X className='w-5 h-5' />
                  Cancel
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className='flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-zinc-800'>
              {[
                { id: 'basic', label: 'Basic Info', icon: BookOpen },
                { id: 'media', label: 'Media', icon: Video },
                { id: 'details', label: 'Details', icon: Target },
                { id: 'content', label: 'Content', icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className='space-y-6'>
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block font-semibold mb-2'>
                        Course Title *
                      </label>
                      <input
                        type='text'
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='The Complete Web Development Bootcamp'
                        required
                      />
                    </div>
                    <div>
                      <label className='block font-semibold mb-2'>
                        Slug (URL)
                      </label>
                      <input
                        type='text'
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='complete-web-development-bootcamp'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block font-semibold mb-2'>
                      Short Description
                    </label>
                    <input
                      type='text'
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='One-line summary of the course'
                    />
                  </div>

                  <div>
                    <label className='block font-semibold mb-2'>
                      Full Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      rows={4}
                      placeholder='Detailed course description...'
                      required
                    />
                  </div>

                  <div className='grid md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block font-semibold mb-2'>
                        Instructor Name *
                      </label>
                      <input
                        type='text'
                        value={formData.instructor_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructor_name: e.target.value,
                          })
                        }
                        className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                      />
                    </div>
                    <div>
                      <label className='block font-semibold mb-2'>
                        Platform *
                      </label>
                      <select
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({ ...formData, platform: e.target.value })
                        }
                        className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      >
                        {platforms.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block font-semibold mb-2'>
                        Language
                      </label>
                      <input
                        type='text'
                        value={formData.language}
                        onChange={(e) =>
                          setFormData({ ...formData, language: e.target.value })
                        }
                        className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                      Affiliate Link * (Most Important!)
                    </label>
                    <input
                      type='url'
                      value={formData.affiliate_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          affiliate_link: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder='https://udemy.com/course/your-affiliate-link?referralCode=XYZ'
                      required
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      Your affiliate link from the platform - this is where
                      users will be redirected to purchase
                    </p>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className='space-y-8'>
                  {/* Promo Video */}
                  <div className='bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Video className='w-6 h-6 text-purple-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Promo Video (Optional)
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Upload a promotional video to showcase your course
                    </p>
                    <VideoUpload
                      bucket='courses'
                      folder='promos'
                      prefix='promo'
                      value={formData.promo_video_url}
                      onChange={(url) =>
                        setFormData({
                          ...formData,
                          promo_video_url: url as string | null,
                        })
                      }
                      multiple={false}
                      showPreview={true}
                    />
                  </div>

                  {/* Thumbnail Image */}
                  <div className='bg-linear-to-br from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Image className='w-6 h-6 text-green-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Course Thumbnail
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Upload a thumbnail image (recommended: 1200x675px or 16:9
                      ratio)
                    </p>
                    <ImageUpload
                      bucket='courses'
                      folder='thumbnails'
                      prefix='course-thumb'
                      value={formData.thumbnail_url}
                      onChange={(url) =>
                        setFormData({
                          ...formData,
                          thumbnail_url: url as string | null,
                        })
                      }
                      multiple={false}
                      aspectRatio='16/9'
                      showPreview={true}
                    />
                  </div>

                  {/* Gallery Images */}
                  <div className='bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border border-orange-200 dark:border-orange-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Image className='w-6 h-6 text-orange-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Gallery Images (Optional)
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Upload screenshots or images to showcase the course
                      content
                    </p>
                    <ImageUpload
                      bucket='courses'
                      folder='gallery'
                      prefix='gallery'
                      value={formData.gallery_images}
                      onChange={(urls) =>
                        setFormData({
                          ...formData,
                          gallery_images: Array.isArray(urls)
                            ? urls
                            : urls
                              ? [urls]
                              : [],
                        })
                      }
                      multiple={true}
                      maxFiles={8}
                      showPreview={true}
                    />
                  </div>

                  {/* Lesson Videos */}
                  <div className='bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-xl border border-blue-200 dark:border-blue-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Video className='w-6 h-6 text-blue-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Lesson Videos (Optional)
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Upload lesson preview videos or sample content
                    </p>
                    <VideoUpload
                      bucket='courses'
                      folder='lessons'
                      prefix='lesson'
                      value={formData.lesson_videos}
                      onChange={(urls) =>
                        setFormData({
                          ...formData,
                          lesson_videos: Array.isArray(urls)
                            ? urls
                            : urls
                              ? [urls]
                              : [],
                        })
                      }
                      multiple={true}
                      maxFiles={10}
                      showPreview={true}
                    />
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className='space-y-6'>
                  {/* Pricing */}
                  <div className='bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <DollarSign className='w-6 h-6 text-emerald-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Pricing
                      </h3>
                    </div>
                    <div className='grid md:grid-cols-4 gap-4'>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Original Price
                        </label>
                        <input
                          type='number'
                          step='0.01'
                          value={formData.original_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              original_price: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                          placeholder='199.99'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Discounted Price
                        </label>
                        <input
                          type='number'
                          step='0.01'
                          value={formData.discounted_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discounted_price: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                          placeholder='14.99'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Currency
                        </label>
                        <input
                          type='text'
                          value={formData.currency}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currency: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                          placeholder='USD'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Duration (hours)
                        </label>
                        <input
                          type='number'
                          step='0.5'
                          value={formData.duration_hours}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration_hours: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
                          placeholder='52.5'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Level */}
                  <div className='bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border border-blue-200 dark:border-blue-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Tag className='w-6 h-6 text-blue-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Category & Level
                      </h3>
                    </div>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Level *
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) =>
                            setFormData({ ...formData, level: e.target.value })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        >
                          {levels.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <TrendingUp className='w-6 h-6 text-purple-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Course Statistics
                      </h3>
                    </div>
                    <div className='grid md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Rating (out of 5)
                        </label>
                        <input
                          type='number'
                          step='0.1'
                          min='0'
                          max='5'
                          value={formData.rating}
                          onChange={(e) =>
                            setFormData({ ...formData, rating: e.target.value })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                          placeholder='4.7'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Students Count
                        </label>
                        <input
                          type='number'
                          value={formData.students_count}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              students_count: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                          placeholder='850000'
                        />
                      </div>
                      <div>
                        <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                          Sort Order
                        </label>
                        <input
                          type='number'
                          value={formData.sort_order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sort_order: e.target.value,
                            })
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className='block font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                      Tags (comma separated)
                    </label>
                    <input
                      type='text'
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      placeholder='JavaScript, React, Node.js, Full Stack'
                    />
                  </div>

                  {/* Toggles */}
                  <div className='flex flex-wrap gap-6'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_featured: e.target.checked,
                          })
                        }
                        className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer'
                      />
                      <span className='font-semibold text-gray-700 dark:text-gray-300'>
                        Featured Course
                      </span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={formData.is_published}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_published: e.target.checked,
                          })
                        }
                        className='w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer'
                      />
                      <span className='font-semibold text-gray-700 dark:text-gray-300'>
                        Published
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className='space-y-6'>
                  {/* What You'll Learn */}
                  <div className='bg-linear-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <Zap className='w-6 h-6 text-yellow-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        What You'll Learn
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Enter each learning outcome on a new line
                    </p>
                    <textarea
                      value={formData.what_you_learn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          what_you_learn: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all'
                      rows={6}
                      placeholder='Build 16 web development projects&#10;Master HTML, CSS, JavaScript&#10;Learn React and Node.js&#10;Deploy applications to production'
                    />
                  </div>

                  {/* Requirements */}
                  <div className='bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800'>
                    <div className='flex items-center gap-3 mb-4'>
                      <List className='w-6 h-6 text-red-600' />
                      <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Requirements
                      </h3>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Enter each requirement on a new line
                    </p>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                      className='w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
                      rows={4}
                      placeholder='No programming experience needed&#10;A computer with internet&#10;Basic English understanding'
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-zinc-700'>
                <button
                  onClick={saveCourse}
                  disabled={loading}
                  className='flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl'
                >
                  <Save className='w-5 h-5' />
                  {loading
                    ? 'Saving...'
                    : editingCourse
                      ? 'Update Course'
                      : 'Create Course'}
                </button>
                {editingCourse && (
                  <button
                    onClick={resetForm}
                    className='flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all'
                  >
                    <X className='w-5 h-5' />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Courses List Sidebar */}
        <div className='lg:col-span-1'>
          <div className='bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-zinc-800 sticky top-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-blue-600' />
                Your Courses ({filteredCourses.length})
              </h2>
            </div>

            <div className='space-y-4 max-h-150 overflow-y-auto pr-2'>
              {filteredCourses.length === 0 ? (
                <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                  <BookOpen className='w-12 h-12 mx-auto mb-3 opacity-50' />
                  <p className='font-semibold'>No courses found</p>
                  <p className='text-sm'>
                    Create your first course to get started!
                  </p>
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className='p-4 border border-gray-200 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 hover:shadow-md transition-all'
                  >
                    <div className='space-y-3'>
                      <div className='flex items-start justify-between'>
                        <h3 className='font-bold text-gray-900 dark:text-white text-sm line-clamp-2'>
                          {course.title}
                        </h3>
                        <div className='flex gap-1'>
                          <button
                            onClick={() => editCourse(course)}
                            className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                            title='Edit'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                            title='Delete'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
                          <User className='w-3 h-3' />
                          <span className='truncate'>
                            {course.instructor_name}
                          </span>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2 text-xs'>
                            {course.is_featured && (
                              <span className='px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium'>
                                <Star className='w-3 h-3 inline mr-1' />
                                Featured
                              </span>
                            )}
                            {!course.is_published && (
                              <span className='px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium'>
                                Draft
                              </span>
                            )}
                          </div>

                          <div className='text-xs font-semibold text-green-600 dark:text-green-400'>
                            {course.discounted_price || course.original_price}{' '}
                            {course.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
