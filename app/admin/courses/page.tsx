'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string
  thumbnail_url: string | null
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
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    thumbnail_url: '',
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
      setMessage('Title and Affiliate Link are required!')
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
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage(editingCourse ? 'Course updated!' : 'Course created!')
      resetForm()
      loadCourses()
    }
    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course?')) return
    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (!error) {
      setMessage('Course deleted!')
      loadCourses()
    }
    setTimeout(() => setMessage(''), 3000)
  }

  function editCourse(course: Course) {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || '',
      description: course.description,
      thumbnail_url: course.thumbnail_url || '',
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
  }

  function resetForm() {
    setEditingCourse(null)
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      thumbnail_url: '',
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

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Manage Courses</h1>

      {message && (
        <div className='mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded'>
          {message}
        </div>
      )}

      {/* Form */}
      <div className='mb-8 p-6 border rounded-xl dark:bg-zinc-800'>
        <h2 className='text-2xl font-bold mb-6'>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h2>

        <div className='space-y-6'>
          {/* Basic Info */}
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='block font-semibold mb-2'>Course Title *</label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='The Complete Web Development Bootcamp'
                required
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>Slug (URL)</label>
              <input
                type='text'
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
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
                setFormData({ ...formData, short_description: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
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
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              rows={5}
              placeholder='Detailed course description...'
              required
            />
          </div>

          {/* Instructor & Platform */}
          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <label className='block font-semibold mb-2'>
                Instructor Name *
              </label>
              <input
                type='text'
                value={formData.instructor_name}
                onChange={(e) =>
                  setFormData({ ...formData, instructor_name: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                required
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>Platform *</label>
              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block font-semibold mb-2'>Language</label>
              <input
                type='text'
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              />
            </div>
          </div>

          {/* Affiliate Link */}
          <div>
            <label className='block font-semibold mb-2'>
              Affiliate Link * (Most Important!)
            </label>
            <input
              type='url'
              value={formData.affiliate_link}
              onChange={(e) =>
                setFormData({ ...formData, affiliate_link: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              placeholder='https://udemy.com/course/your-affiliate-link?referralCode=XYZ'
              required
            />
            <p className='text-xs text-zinc-500 mt-1'>
              Your affiliate link from the platform
            </p>
          </div>

          {/* Pricing */}
          <div className='grid md:grid-cols-4 gap-4'>
            <div>
              <label className='block font-semibold mb-2'>Original Price</label>
              <input
                type='number'
                step='0.01'
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='199.99'
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>
                Discounted Price
              </label>
              <input
                type='number'
                step='0.01'
                value={formData.discounted_price}
                onChange={(e) =>
                  setFormData({ ...formData, discounted_price: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='14.99'
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>Currency</label>
              <input
                type='text'
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='USD'
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>
                Duration (hours)
              </label>
              <input
                type='number'
                step='0.5'
                value={formData.duration_hours}
                onChange={(e) =>
                  setFormData({ ...formData, duration_hours: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='52.5'
              />
            </div>
          </div>

          {/* Category & Level */}
          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <label className='block font-semibold mb-2'>Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block font-semibold mb-2'>Level *</label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block font-semibold mb-2'>Thumbnail URL</label>
              <input
                type='url'
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='https://...'
              />
            </div>
          </div>

          {/* Stats */}
          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <label className='block font-semibold mb-2'>
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
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='4.7'
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>Students Count</label>
              <input
                type='number'
                value={formData.students_count}
                onChange={(e) =>
                  setFormData({ ...formData, students_count: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
                placeholder='850000'
              />
            </div>
            <div>
              <label className='block font-semibold mb-2'>Sort Order</label>
              <input
                type='number'
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: e.target.value })
                }
                className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              />
            </div>
          </div>

          {/* What You'll Learn */}
          <div>
            <label className='block font-semibold mb-2'>
              What You'll Learn (one per line)
            </label>
            <textarea
              value={formData.what_you_learn}
              onChange={(e) =>
                setFormData({ ...formData, what_you_learn: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              rows={4}
              placeholder='Build 16 web development projects&#10;Master HTML, CSS, JavaScript&#10;Learn React and Node.js'
            />
          </div>

          {/* Requirements */}
          <div>
            <label className='block font-semibold mb-2'>
              Requirements (one per line)
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              rows={3}
              placeholder='No programming experience needed&#10;A computer with internet'
            />
          </div>

          {/* Tags */}
          <div>
            <label className='block font-semibold mb-2'>
              Tags (comma separated)
            </label>
            <input
              type='text'
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className='w-full px-4 py-2 border rounded dark:bg-zinc-700'
              placeholder='JavaScript, React, Node.js, Full Stack'
            />
          </div>

          {/* Toggles */}
          <div className='flex gap-6'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className='w-4 h-4'
              />
              <span className='font-semibold'>Featured Course</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({ ...formData, is_published: e.target.checked })
                }
                className='w-4 h-4'
              />
              <span className='font-semibold'>Published</span>
            </label>
          </div>

          {/* Buttons */}
          <div className='flex gap-3'>
            <button
              onClick={saveCourse}
              disabled={loading}
              className='px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50'
            >
              {loading
                ? 'Saving...'
                : editingCourse
                  ? 'Update Course'
                  : 'Create Course'}
            </button>
            {editingCourse && (
              <button
                onClick={resetForm}
                className='px-6 py-2 bg-zinc-500 text-white rounded font-semibold hover:bg-zinc-600'
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses List */}
      <h2 className='text-2xl font-bold mb-4'>
        Your Courses ({courses.length})
      </h2>
      <div className='space-y-4'>
        {courses.map((course) => (
          <div
            key={course.id}
            className='p-6 border rounded-xl dark:bg-zinc-800 flex justify-between items-start'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h3 className='text-xl font-bold'>{course.title}</h3>
                {course.is_featured && (
                  <span className='px-2 py-1 rounded bg-yellow-500 text-white text-xs font-bold'>
                    ⭐ Featured
                  </span>
                )}
                {!course.is_published && (
                  <span className='px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-xs font-bold'>
                    Draft
                  </span>
                )}
              </div>
              <div className='text-sm text-zinc-600 dark:text-zinc-400 space-y-1'>
                <p>
                  👨‍🏫 {course.instructor_name} • 📚 {course.platform} • 🎯{' '}
                  {course.level}
                </p>
                <p>
                  📁 {course.category} • ⏱️ {course.duration_hours}h • 💰 $
                  {course.discounted_price || course.original_price}
                </p>
                <p className='text-xs text-purple-600 dark:text-purple-400 truncate'>
                  🔗 {course.affiliate_link}
                </p>
              </div>
            </div>
            <div className='flex gap-2 ml-4'>
              <button
                onClick={() => editCourse(course)}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Edit
              </button>
              <button
                onClick={() => deleteCourse(course.id)}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
