'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoUpload from '@/components/admin/VideoUpload'
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  Smile,
  Zap,
  ArrowLeft,
} from 'lucide-react'

type JourneyContent = {
  id?: string
  owner_user_id?: string
  hero_title: string
  hero_subtitle: string
  hero_background_image: string
  hero_background_video: string
  story_sections: any[]
  milestones: any[]
  skills_journey: any[]
  photo_gallery: any[]
  video_gallery: any[]
  testimonials: any[]
  core_values: any[]
  philosophy_statement: string
  fun_facts: string[]
  social_impact: {
    projects_completed?: number
    years_experience?: number
    clients_served?: number
    cups_of_coffee?: number
    lines_of_code?: number
    github_stars?: number
  }
  cta_title: string
  cta_description: string
  cta_button_text: string
  cta_button_link: string
  published: boolean
  show_timeline: boolean
  show_gallery: boolean
  show_testimonials: boolean
  show_stats: boolean
  meta_title: string
  meta_description: string
}

const initialContent: JourneyContent = {
  hero_title: 'My Journey',
  hero_subtitle: '',
  hero_background_image: '',
  hero_background_video: '',
  story_sections: [],
  milestones: [],
  skills_journey: [],
  photo_gallery: [],
  video_gallery: [],
  testimonials: [],
  core_values: [],
  philosophy_statement: '',
  fun_facts: [],
  social_impact: {},
  cta_title: '',
  cta_description: '',
  cta_button_text: '',
  cta_button_link: '',
  published: false,
  show_timeline: true,
  show_gallery: true,
  show_testimonials: true,
  show_stats: true,
  meta_title: '',
  meta_description: '',
}

const categoryOptions = [
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'career', label: 'Career', icon: Briefcase },
  { value: 'achievement', label: 'Achievement', icon: Award },
  { value: 'personal', label: 'Personal', icon: Heart },
]

export default function AdminJourneyPage() {
  const [content, setContent] = useState<JourneyContent>(initialContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('hero')

  const supabase = createClient()

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('journey_content')
        .select('*')
        .eq('owner_user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setContent(data as JourneyContent)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload = {
        ...content,
        owner_user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (content.id) {
        const { error } = await supabase
          .from('journey_content')
          .update(payload)
          .eq('id', content.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('journey_content')
          .insert([payload])

        if (error) throw error
      }

      setMessage('Journey content saved successfully!')
      setTimeout(() => setMessage(''), 3000)
      fetchContent()
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage('Error saving content. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Story Section Functions
  function addStorySection() {
    setContent({
      ...content,
      story_sections: [
        ...content.story_sections,
        {
          id: Date.now().toString(),
          title: '',
          subtitle: '',
          content: '',
          year: '',
          images: [],
          videos: [],
          achievements: [],
          tags: [],
          layout: 'left',
        },
      ],
    })
  }

  function updateStorySection(index: number, field: string, value: any) {
    const updated = [...content.story_sections]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, story_sections: updated })
  }

  function removeStorySection(index: number) {
    setContent({
      ...content,
      story_sections: content.story_sections.filter((_, i) => i !== index),
    })
  }

  // Milestone Functions
  function addMilestone() {
    setContent({
      ...content,
      milestones: [
        ...content.milestones,
        {
          id: Date.now().toString(),
          year: '',
          month: '',
          title: '',
          description: '',
          category: 'achievement',
        },
      ],
    })
  }

  function updateMilestone(index: number, field: string, value: any) {
    const updated = [...content.milestones]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, milestones: updated })
  }

  function removeMilestone(index: number) {
    setContent({
      ...content,
      milestones: content.milestones.filter((_, i) => i !== index),
    })
  }

  // Photo Gallery Functions
  function addPhoto() {
    setContent({
      ...content,
      photo_gallery: [
        ...content.photo_gallery,
        {
          id: Date.now().toString(),
          url: '',
          caption: '',
          year: '',
          category: '',
        },
      ],
    })
  }

  function updatePhoto(index: number, field: string, value: any) {
    const updated = [...content.photo_gallery]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, photo_gallery: updated })
  }

  function removePhoto(index: number) {
    setContent({
      ...content,
      photo_gallery: content.photo_gallery.filter((_, i) => i !== index),
    })
  }

  // Video Gallery Functions
  function addVideo() {
    setContent({
      ...content,
      video_gallery: [
        ...content.video_gallery,
        {
          id: Date.now().toString(),
          url: '',
          title: '',
          description: '',
          thumbnail: '',
          duration: '',
        },
      ],
    })
  }

  function updateVideo(index: number, field: string, value: any) {
    const updated = [...content.video_gallery]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, video_gallery: updated })
  }

  function removeVideo(index: number) {
    setContent({
      ...content,
      video_gallery: content.video_gallery.filter((_, i) => i !== index),
    })
  }

  // Testimonial Functions
  function addTestimonial() {
    setContent({
      ...content,
      testimonials: [
        ...content.testimonials,
        {
          id: Date.now().toString(),
          name: '',
          role: '',
          company: '',
          avatar: '',
          quote: '',
          relationship: '',
        },
      ],
    })
  }

  function updateTestimonial(index: number, field: string, value: any) {
    const updated = [...content.testimonials]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, testimonials: updated })
  }

  function removeTestimonial(index: number) {
    setContent({
      ...content,
      testimonials: content.testimonials.filter((_, i) => i !== index),
    })
  }

  // Core Value Functions
  function addCoreValue() {
    setContent({
      ...content,
      core_values: [
        ...content.core_values,
        {
          title: '',
          description: '',
          icon: '',
        },
      ],
    })
  }

  function updateCoreValue(index: number, field: string, value: any) {
    const updated = [...content.core_values]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, core_values: updated })
  }

  function removeCoreValue(index: number) {
    setContent({
      ...content,
      core_values: content.core_values.filter((_, i) => i !== index),
    })
  }

  // Fun Fact Functions
  function addFunFact() {
    setContent({
      ...content,
      fun_facts: [...content.fun_facts, ''],
    })
  }

  function updateFunFact(index: number, value: string) {
    const updated = [...content.fun_facts]
    updated[index] = value
    setContent({ ...content, fun_facts: updated })
  }

  function removeFunFact(index: number) {
    setContent({
      ...content,
      fun_facts: content.fun_facts.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600' />
      </div>
    )
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Zap },
    { id: 'story', label: 'Story Sections', icon: MessageSquare },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'values', label: 'Values & Facts', icon: Lightbulb },
    { id: 'stats', label: 'Stats & CTA', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Eye },
  ]

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-zinc-950'>
      {/* Header */}
      <div className='bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-20'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <a
                href='/admin'
                className='p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors'
              >
                <ArrowLeft className='w-5 h-5' />
              </a>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  Journey Management
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Create your world-class story
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() =>
                  setContent({ ...content, published: !content.published })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  content.published
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400'
                }`}
              >
                {content.published ? (
                  <Eye className='w-4 h-4' />
                ) : (
                  <EyeOff className='w-4 h-4' />
                )}
                {content.published ? 'Published' : 'Draft'}
              </button>
              <a
                href='/journey'
                target='_blank'
                className='px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors'
              >
                Preview
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className='flex items-center gap-2 px-6 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50'
              >
                <Save className='w-4 h-4' />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <p className='text-green-800 dark:text-green-300 text-sm font-medium'>
                {message}
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className='flex gap-2 mt-6 overflow-x-auto pb-2'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className='space-y-6'>
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Hero Section
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Hero Title
                  </label>
                  <input
                    type='text'
                    value={content.hero_title}
                    onChange={(e) =>
                      setContent({ ...content, hero_title: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                    placeholder='My Journey'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Hero Subtitle
                  </label>
                  <textarea
                    value={content.hero_subtitle}
                    onChange={(e) =>
                      setContent({ ...content, hero_subtitle: e.target.value })
                    }
                    rows={3}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                    placeholder='A compelling subtitle that captures your journey'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Background Image
                  </label>
                  <ImageUpload
                    value={content.hero_background_image}
                    onChange={(url: string | string[] | null) =>
                      setContent({
                        ...content,
                        hero_background_image: url as string,
                      })
                    }
                    bucket='media'
                    folder='journey/hero'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Background Video (Optional - overrides image)
                  </label>
                  <VideoUpload
                    value={content.hero_background_video}
                    onChange={(url: string | string[] | null) =>
                      setContent({
                        ...content,
                        hero_background_video: url as string,
                      })
                    }
                    bucket='media'
                    folder='journey/hero'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Story Sections Tab */}
        {activeTab === 'story' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Story Sections
              </h2>
              <button
                onClick={addStorySection}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Section
              </button>
            </div>

            {content.story_sections.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <MessageSquare className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No story sections yet. Click "Add Section" to start telling
                  your story.
                </p>
              </div>
            ) : (
              content.story_sections.map((section, index) => (
                <div
                  key={section.id}
                  className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-3'>
                      <GripVertical className='w-5 h-5 text-gray-400' />
                      <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                        Section {index + 1}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeStorySection(index)}
                      className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Year
                      </label>
                      <input
                        type='text'
                        value={section.year}
                        onChange={(e) =>
                          updateStorySection(index, 'year', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='2020'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Layout
                      </label>
                      <select
                        value={section.layout}
                        onChange={(e) =>
                          updateStorySection(index, 'layout', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                      >
                        <option value='left'>Image Left</option>
                        <option value='right'>Image Right</option>
                        <option value='center'>Centered</option>
                        <option value='full'>Full Width</option>
                      </select>
                    </div>
                  </div>

                  <div className='mt-4 space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Title
                      </label>
                      <input
                        type='text'
                        value={section.title}
                        onChange={(e) =>
                          updateStorySection(index, 'title', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Section title'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Subtitle
                      </label>
                      <input
                        type='text'
                        value={section.subtitle}
                        onChange={(e) =>
                          updateStorySection(index, 'subtitle', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Section subtitle'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Content
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          updateStorySection(index, 'content', e.target.value)
                        }
                        rows={6}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Tell your story...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Achievements (one per line)
                      </label>
                      <textarea
                        value={section.achievements?.join('\n') || ''}
                        onChange={(e) =>
                          updateStorySection(
                            index,
                            'achievements',
                            e.target.value.split('\n').filter(Boolean),
                          )
                        }
                        rows={4}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Achievement 1&#10;Achievement 2&#10;Achievement 3'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Tags (comma-separated)
                      </label>
                      <input
                        type='text'
                        value={section.tags?.join(', ') || ''}
                        onChange={(e) =>
                          updateStorySection(
                            index,
                            'tags',
                            e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          )
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='tag1, tag2, tag3'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Images (Upload multiple - first image is featured)
                      </label>
                      <div className='space-y-2'>
                        {section.images?.map(
                          (img: string, imgIndex: number) => (
                            <div
                              key={imgIndex}
                              className='flex items-center gap-2'
                            >
                              <input
                                type='text'
                                value={img}
                                readOnly
                                className='flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800'
                              />
                              <button
                                onClick={() => {
                                  const updated = section.images.filter(
                                    (_: any, i: number) => i !== imgIndex,
                                  )
                                  updateStorySection(index, 'images', updated)
                                }}
                                className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </div>
                          ),
                        )}
                        <ImageUpload
                          value={null}
                          onChange={(url: string | string[] | null) => {
                            if (url) {
                              const newUrl = Array.isArray(url) ? url[0] : url
                              const updated = [
                                ...(section.images || []),
                                newUrl,
                              ]
                              updateStorySection(index, 'images', updated)
                            }
                          }}
                          bucket='media'
                          folder='journey/story'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Timeline Milestones
              </h2>
              <button
                onClick={addMilestone}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Milestone
              </button>
            </div>

            {content.milestones.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <Calendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No milestones yet. Click "Add Milestone" to create your
                  timeline.
                </p>
              </div>
            ) : (
              content.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Milestone {index + 1}
                    </h3>
                    <button
                      onClick={() => removeMilestone(index)}
                      className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>

                  <div className='grid md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Month
                      </label>
                      <input
                        type='text'
                        value={milestone.month}
                        onChange={(e) =>
                          updateMilestone(index, 'month', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='January'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Year
                      </label>
                      <input
                        type='text'
                        value={milestone.year}
                        onChange={(e) =>
                          updateMilestone(index, 'year', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='2024'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Category
                      </label>
                      <select
                        value={milestone.category}
                        onChange={(e) =>
                          updateMilestone(index, 'category', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                      >
                        {categoryOptions.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='mt-4 space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Title
                      </label>
                      <input
                        type='text'
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(index, 'title', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Milestone title'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Description
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) =>
                          updateMilestone(index, 'description', e.target.value)
                        }
                        rows={3}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Describe this milestone...'
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className='space-y-8'>
            {/* Photo Gallery */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <ImageIcon className='w-6 h-6' />
                  Photo Gallery
                </h2>
                <button
                  onClick={addPhoto}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  Add Photo
                </button>
              </div>

              {content.photo_gallery.length === 0 ? (
                <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                  <ImageIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    No photos yet.
                  </p>
                </div>
              ) : (
                <div className='grid md:grid-cols-2 gap-6'>
                  {content.photo_gallery.map((photo, index) => (
                    <div
                      key={photo.id}
                      className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-bold text-gray-900 dark:text-white'>
                          Photo {index + 1}
                        </h3>
                        <button
                          onClick={() => removePhoto(index)}
                          className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>

                      <div className='space-y-4'>
                        <ImageUpload
                          value={photo.url}
                          onChange={(url: string | string[] | null) =>
                            updatePhoto(index, 'url', (url as string) || '')
                          }
                          bucket='media'
                          folder='journey/gallery'
                        />

                        <input
                          type='text'
                          value={photo.caption}
                          onChange={(e) =>
                            updatePhoto(index, 'caption', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Photo caption'
                        />

                        <div className='grid grid-cols-2 gap-4'>
                          <input
                            type='text'
                            value={photo.year}
                            onChange={(e) =>
                              updatePhoto(index, 'year', e.target.value)
                            }
                            className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                            placeholder='Year'
                          />
                          <input
                            type='text'
                            value={photo.category}
                            onChange={(e) =>
                              updatePhoto(index, 'category', e.target.value)
                            }
                            className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                            placeholder='Category'
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Gallery */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <VideoIcon className='w-6 h-6' />
                  Video Gallery
                </h2>
                <button
                  onClick={addVideo}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  Add Video
                </button>
              </div>

              {content.video_gallery.length === 0 ? (
                <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                  <VideoIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    No videos yet.
                  </p>
                </div>
              ) : (
                <div className='grid md:grid-cols-2 gap-6'>
                  {content.video_gallery.map((video, index) => (
                    <div
                      key={video.id}
                      className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-bold text-gray-900 dark:text-white'>
                          Video {index + 1}
                        </h3>
                        <button
                          onClick={() => removeVideo(index)}
                          className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>

                      <div className='space-y-4'>
                        <VideoUpload
                          value={video.url}
                          onChange={(url: string | string[] | null) =>
                            updateVideo(index, 'url', (url as string) || '')
                          }
                          bucket='media'
                          folder='journey/videos'
                        />

                        <input
                          type='text'
                          value={video.title}
                          onChange={(e) =>
                            updateVideo(index, 'title', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Video title'
                        />

                        <textarea
                          value={video.description}
                          onChange={(e) =>
                            updateVideo(index, 'description', e.target.value)
                          }
                          rows={2}
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Video description'
                        />

                        <div className='grid grid-cols-2 gap-4'>
                          <input
                            type='text'
                            value={video.duration}
                            onChange={(e) =>
                              updateVideo(index, 'duration', e.target.value)
                            }
                            className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                            placeholder='Duration (e.g., 5:30)'
                          />
                          <div>
                            <ImageUpload
                              value={video.thumbnail}
                              onChange={(url: string | string[] | null) =>
                                updateVideo(
                                  index,
                                  'thumbnail',
                                  (url as string) || '',
                                )
                              }
                              bucket='media'
                              folder='journey/thumbnails'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Testimonials
              </h2>
              <button
                onClick={addTestimonial}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Testimonial
              </button>
            </div>

            {content.testimonials.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <MessageSquare className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No testimonials yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-6'>
                {content.testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='font-bold text-gray-900 dark:text-white'>
                        Testimonial {index + 1}
                      </h3>
                      <button
                        onClick={() => removeTestimonial(index)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>

                    <div className='space-y-4'>
                      <textarea
                        value={testimonial.quote}
                        onChange={(e) =>
                          updateTestimonial(index, 'quote', e.target.value)
                        }
                        rows={4}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Quote...'
                      />

                      <div className='grid grid-cols-2 gap-4'>
                        <input
                          type='text'
                          value={testimonial.name}
                          onChange={(e) =>
                            updateTestimonial(index, 'name', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Name'
                        />
                        <input
                          type='text'
                          value={testimonial.role}
                          onChange={(e) =>
                            updateTestimonial(index, 'role', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Role/Title'
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <input
                          type='text'
                          value={testimonial.company}
                          onChange={(e) =>
                            updateTestimonial(index, 'company', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Company'
                        />
                        <input
                          type='text'
                          value={testimonial.relationship}
                          onChange={(e) =>
                            updateTestimonial(
                              index,
                              'relationship',
                              e.target.value,
                            )
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Relationship'
                        />
                      </div>

                      <ImageUpload
                        value={testimonial.avatar}
                        onChange={(url: string | string[] | null) =>
                          updateTestimonial(
                            index,
                            'avatar',
                            (url as string) || '',
                          )
                        }
                        bucket='media'
                        folder='journey/avatars'
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Values & Facts Tab */}
        {activeTab === 'values' && (
          <div className='space-y-8'>
            {/* Core Values */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Core Values
                </h2>
                <button
                  onClick={addCoreValue}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  Add Value
                </button>
              </div>

              <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Philosophy Statement
                </label>
                <textarea
                  value={content.philosophy_statement}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      philosophy_statement: e.target.value,
                    })
                  }
                  rows={4}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                  placeholder='Your personal philosophy or guiding principles...'
                />
              </div>

              {content.core_values.length === 0 ? (
                <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                  <Lightbulb className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    No core values yet.
                  </p>
                </div>
              ) : (
                <div className='grid md:grid-cols-2 gap-6'>
                  {content.core_values.map((value, index) => (
                    <div
                      key={index}
                      className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-bold text-gray-900 dark:text-white'>
                          Value {index + 1}
                        </h3>
                        <button
                          onClick={() => removeCoreValue(index)}
                          className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>

                      <div className='space-y-4'>
                        <input
                          type='text'
                          value={value.title}
                          onChange={(e) =>
                            updateCoreValue(index, 'title', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Value title'
                        />
                        <textarea
                          value={value.description}
                          onChange={(e) =>
                            updateCoreValue(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          rows={3}
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Description...'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fun Facts */}
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Smile className='w-6 h-6' />
                  Fun Facts
                </h2>
                <button
                  onClick={addFunFact}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  Add Fact
                </button>
              </div>

              {content.fun_facts.length === 0 ? (
                <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                  <Smile className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    No fun facts yet.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {content.fun_facts.map((fact, index) => (
                    <div
                      key={index}
                      className='bg-white dark:bg-zinc-900 rounded-xl p-4 border border-gray-200 dark:border-zinc-800 flex items-center gap-4'
                    >
                      <input
                        type='text'
                        value={fact}
                        onChange={(e) => updateFunFact(index, e.target.value)}
                        className='flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Fun fact...'
                      />
                      <button
                        onClick={() => removeFunFact(index)}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats & CTA Tab */}
        {activeTab === 'stats' && (
          <div className='space-y-8'>
            {/* Social Impact Stats */}
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2'>
                <TrendingUp className='w-6 h-6' />
                Social Impact Stats
              </h2>

              <div className='grid md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Projects Completed
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.projects_completed || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          projects_completed: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Years Experience
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.years_experience || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          years_experience: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Clients Served
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.clients_served || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          clients_served: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Cups of Coffee
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.cups_of_coffee || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          cups_of_coffee: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Lines of Code
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.lines_of_code || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          lines_of_code: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    GitHub Stars
                  </label>
                  <input
                    type='number'
                    value={content.social_impact.github_stars || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        social_impact: {
                          ...content.social_impact,
                          github_stars: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='0'
                  />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2'>
                <Zap className='w-6 h-6' />
                Call to Action
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    CTA Title
                  </label>
                  <input
                    type='text'
                    value={content.cta_title}
                    onChange={(e) =>
                      setContent({ ...content, cta_title: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='Ready to work together?'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    CTA Description
                  </label>
                  <textarea
                    value={content.cta_description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        cta_description: e.target.value,
                      })
                    }
                    rows={3}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='Describe the action you want visitors to take...'
                  />
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Button Text
                    </label>
                    <input
                      type='text'
                      value={content.cta_button_text}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          cta_button_text: e.target.value,
                        })
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                      placeholder='Get in Touch'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Button Link
                    </label>
                    <input
                      type='text'
                      value={content.cta_button_link}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          cta_button_link: e.target.value,
                        })
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                      placeholder='/contact'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className='space-y-6'>
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Display Settings
              </h2>

              <div className='space-y-4'>
                <label className='flex items-center justify-between'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Show Timeline
                  </span>
                  <input
                    type='checkbox'
                    checked={content.show_timeline}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        show_timeline: e.target.checked,
                      })
                    }
                    className='w-5 h-5 text-purple-600 rounded'
                  />
                </label>

                <label className='flex items-center justify-between'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Show Photo Gallery
                  </span>
                  <input
                    type='checkbox'
                    checked={content.show_gallery}
                    onChange={(e) =>
                      setContent({ ...content, show_gallery: e.target.checked })
                    }
                    className='w-5 h-5 text-purple-600 rounded'
                  />
                </label>

                <label className='flex items-center justify-between'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Show Testimonials
                  </span>
                  <input
                    type='checkbox'
                    checked={content.show_testimonials}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        show_testimonials: e.target.checked,
                      })
                    }
                    className='w-5 h-5 text-purple-600 rounded'
                  />
                </label>

                <label className='flex items-center justify-between'>
                  <span className='text-gray-700 dark:text-gray-300'>
                    Show Stats
                  </span>
                  <input
                    type='checkbox'
                    checked={content.show_stats}
                    onChange={(e) =>
                      setContent({ ...content, show_stats: e.target.checked })
                    }
                    className='w-5 h-5 text-purple-600 rounded'
                  />
                </label>
              </div>
            </div>

            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                SEO Settings
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Meta Title
                  </label>
                  <input
                    type='text'
                    value={content.meta_title}
                    onChange={(e) =>
                      setContent({ ...content, meta_title: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='My Journey | Portfolio'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Meta Description
                  </label>
                  <textarea
                    value={content.meta_description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        meta_description: e.target.value,
                      })
                    }
                    rows={3}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='Explore my journey as a developer...'
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
