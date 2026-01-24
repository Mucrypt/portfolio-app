'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  Image as ImageIcon,
  Github,
  ExternalLink,
  Save,
  X,
  BookOpen,
  Clock,
  TrendingUp,
  Pin,
  Star,
  Copy,
  FileText,
  RefreshCw,
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  content_format: string | null
  featured_image_url: string | null
  featured_video_url: string | null
  image_urls: string[] | string | null
  video_urls: string[] | string | null
  category: string
  subcategory: string | null
  tags: string[] | string | null
  reading_time_minutes: number | null
  views_count: number | null
  likes_count: number | null
  comments_count: number | null
  shares_count: number | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | string | null
  og_image_url: string | null
  canonical_url: string | null
  is_published: boolean | null
  is_featured: boolean | null
  is_pinned: boolean | null
  publish_date: string | null
  last_updated: string | null
  code_language: string | null
  github_repo_url: string | null
  demo_url: string | null
  series_name: string | null
  series_order: number | null
  related_post_ids: string[] | string | null
  allow_comments: boolean | null
  allow_likes: boolean | null
  cta_text: string | null
  cta_url: string | null
  author_user_id: string
  author_name: string | null
  author_avatar_url: string | null
  author_bio: string | null
  created_at: string | null
  updated_at: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'published' | 'draft' | 'scheduled'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    content_format: 'markdown',
    featured_image_url: '',
    featured_video_url: '',
    category: 'Tutorials',
    subcategory: '',
    tags: [],
    reading_time_minutes: 5,
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    is_published: false,
    is_featured: false,
    is_pinned: false,
    publish_date: null,
    code_language: '',
    github_repo_url: '',
    demo_url: '',
    series_name: '',
    series_order: null,
    allow_comments: true,
    allow_likes: true,
    cta_text: '',
    cta_url: '',
  })

  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      alert('Error fetching posts: ' + error.message)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }, [supabase])

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    setCategories(data || [])
  }, [supabase])

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  function handleTagsChange(tagsString: string) {
    const tagsArray = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)
    setFormData((prev) => ({ ...prev, tags: tagsArray }))
  }

  function handleKeywordsChange(keywordsString: string) {
    const keywordsArray = keywordsString
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k)
    setFormData((prev) => ({ ...prev, meta_keywords: keywordsArray }))
  }

  function handleImageUrlsChange(urlsString: string) {
    const urlsArray = urlsString
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u)
    setFormData((prev) => ({ ...prev, image_urls: urlsArray }))
  }

  function handleVideoUrlsChange(urlsString: string) {
    const urlsArray = urlsString
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u)
    setFormData((prev) => ({ ...prev, video_urls: urlsArray }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert('Title and content are required!')
      return
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to create posts')
      return
    }

    const postData = {
      ...formData,
      title: formData.title!,
      content: formData.content!,
      slug: formData.slug || generateSlug(formData.title || ''),
      author_user_id: user.id,
      author_name: formData.author_name || user.email?.split('@')[0] || 'Admin',
      publish_date:
        formData.publish_date ||
        (formData.is_published ? new Date().toISOString() : null),
      // Normalize array fields
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : formData.tags
          ? [formData.tags]
          : null,
      meta_keywords: Array.isArray(formData.meta_keywords)
        ? formData.meta_keywords
        : formData.meta_keywords
          ? [formData.meta_keywords]
          : null,
      image_urls: Array.isArray(formData.image_urls)
        ? formData.image_urls
        : formData.image_urls
          ? [formData.image_urls]
          : null,
      video_urls: Array.isArray(formData.video_urls)
        ? formData.video_urls
        : formData.video_urls
          ? [formData.video_urls]
          : null,
      related_post_ids: Array.isArray(formData.related_post_ids)
        ? formData.related_post_ids
        : formData.related_post_ids
          ? [formData.related_post_ids]
          : null,
    }

    if (editingPost) {
      // Update existing post
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost.id)

      if (error) {
        console.error('Error updating post:', error)
        alert('Error updating post: ' + error.message)
      } else {
        alert('Post updated successfully!')
        resetForm()
        fetchPosts()
      }
    } else {
      // Create new post
      const { error } = await supabase.from('blog_posts').insert([postData])

      if (error) {
        console.error('Error creating post:', error)
        alert('Error creating post: ' + error.message)
      } else {
        alert('Post created successfully!')
        resetForm()
        fetchPosts()
      }
    }
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post)
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags : [],
      meta_keywords: Array.isArray(post.meta_keywords)
        ? post.meta_keywords
        : [],
      image_urls: Array.isArray(post.image_urls) ? post.image_urls : [],
      video_urls: Array.isArray(post.video_urls) ? post.video_urls : [],
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        'Are you sure you want to delete this post? This action cannot be undone.',
      )
    ) {
      return
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post: ' + error.message)
    } else {
      alert('Post deleted successfully!')
      fetchPosts()
    }
  }

  async function handleDuplicate(post: BlogPost) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const duplicateData = {
      ...post,
      id: undefined,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${Date.now()}`,
      is_published: false,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: undefined,
      updated_at: undefined,
      // Normalize array fields
      tags: Array.isArray(post.tags)
        ? post.tags
        : post.tags
          ? [post.tags]
          : null,
      meta_keywords: Array.isArray(post.meta_keywords)
        ? post.meta_keywords
        : post.meta_keywords
          ? [post.meta_keywords]
          : null,
      image_urls: Array.isArray(post.image_urls)
        ? post.image_urls
        : post.image_urls
          ? [post.image_urls]
          : null,
      video_urls: Array.isArray(post.video_urls)
        ? post.video_urls
        : post.video_urls
          ? [post.video_urls]
          : null,
      related_post_ids: Array.isArray(post.related_post_ids)
        ? post.related_post_ids
        : post.related_post_ids
          ? [post.related_post_ids]
          : null,
    }

    const { error } = await supabase.from('blog_posts').insert([duplicateData])

    if (error) {
      alert('Error duplicating post: ' + error.message)
    } else {
      alert('Post duplicated successfully!')
      fetchPosts()
    }
  }

  async function togglePublish(post: BlogPost) {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_published: !post.is_published,
        publish_date: !post.is_published
          ? new Date().toISOString()
          : post.publish_date,
      })
      .eq('id', post.id)

    if (error) {
      alert('Error updating post: ' + error.message)
    } else {
      fetchPosts()
    }
  }

  async function toggleFeature(post: BlogPost) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ is_featured: !post.is_featured })
      .eq('id', post.id)

    if (error) {
      alert('Error updating post: ' + error.message)
    } else {
      fetchPosts()
    }
  }

  async function togglePin(post: BlogPost) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ is_pinned: !post.is_pinned })
      .eq('id', post.id)

    if (error) {
      alert('Error updating post: ' + error.message)
    } else {
      fetchPosts()
    }
  }

  function resetForm() {
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      content_format: 'markdown',
      featured_image_url: '',
      featured_video_url: '',
      category: 'Tutorials',
      subcategory: '',
      tags: [],
      reading_time_minutes: 5,
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      is_published: false,
      is_featured: false,
      is_pinned: false,
      publish_date: null,
      code_language: '',
      github_repo_url: '',
      demo_url: '',
      series_name: '',
      series_order: null,
      allow_comments: true,
      allow_likes: true,
      cta_text: '',
      cta_url: '',
    })
    setShowForm(false)
  }

  function getFilteredPosts() {
    let filtered = posts

    // Filter by status
    if (filterStatus === 'published') {
      filtered = filtered.filter(
        (p) =>
          p.is_published &&
          (!p.publish_date || new Date(p.publish_date) <= new Date()),
      )
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter((p) => !p.is_published)
    } else if (filterStatus === 'scheduled') {
      filtered = filtered.filter(
        (p) =>
          p.is_published &&
          p.publish_date &&
          new Date(p.publish_date) > new Date(),
      )
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredPosts = getFilteredPosts()
  const stats = {
    total: posts.length,
    published: posts.filter(
      (p) =>
        p.is_published &&
        (!p.publish_date || new Date(p.publish_date) <= new Date()),
    ).length,
    draft: posts.filter((p) => !p.is_published).length,
    scheduled: posts.filter(
      (p) =>
        p.is_published &&
        p.publish_date &&
        new Date(p.publish_date) > new Date(),
    ).length,
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
              <BookOpen className='w-8 h-8 text-blue-600' />
              Blog Management
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Create, edit, and manage your blog posts
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg'
          >
            <Plus className='w-5 h-5' />
            New Post
          </button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-4 gap-4'>
          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                  Total Posts
                </p>
                <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                  {stats.total}
                </p>
              </div>
              <FileText className='w-8 h-8 text-blue-600 dark:text-blue-400 opacity-50' />
            </div>
          </div>
          <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-green-600 dark:text-green-400 font-medium'>
                  Published
                </p>
                <p className='text-2xl font-bold text-green-700 dark:text-green-300'>
                  {stats.published}
                </p>
              </div>
              <Eye className='w-8 h-8 text-green-600 dark:text-green-400 opacity-50' />
            </div>
          </div>
          <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-yellow-600 dark:text-yellow-400 font-medium'>
                  Drafts
                </p>
                <p className='text-2xl font-bold text-yellow-700 dark:text-yellow-300'>
                  {stats.draft}
                </p>
              </div>
              <EyeOff className='w-8 h-8 text-yellow-600 dark:text-yellow-400 opacity-50' />
            </div>
          </div>
          <div className='bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-purple-600 dark:text-purple-400 font-medium'>
                  Scheduled
                </p>
                <p className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                  {stats.scheduled}
                </p>
              </div>
              <Calendar className='w-8 h-8 text-purple-600 dark:text-purple-400 opacity-50' />
            </div>
          </div>
        </div>
      </div>

      <div className='p-6'>
        {/* Filters & Search */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6'>
          <div className='flex items-center gap-4'>
            <input
              type='text'
              placeholder='Search posts...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <div className='flex gap-2'>
              {(['all', 'published', 'draft', 'scheduled'] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
            <button
              onClick={fetchPosts}
              className='p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
            >
              <RefreshCw className='w-5 h-5 text-gray-700 dark:text-gray-300' />
            </button>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center'>
            <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              No posts found
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
              >
                <div className='flex'>
                  {post.featured_image_url && (
                    <div className='w-48 h-48 relative shrink-0'>
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}

                  <div className='flex-1 p-6'>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          {post.is_pinned && (
                            <span className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-bold flex items-center gap-1'>
                              <Pin className='w-3 h-3' />
                              Pinned
                            </span>
                          )}
                          {post.is_featured && (
                            <span className='px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs font-bold flex items-center gap-1'>
                              <Star className='w-3 h-3' />
                              Featured
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              post.is_published &&
                              (!post.publish_date ||
                                new Date(post.publish_date) <= new Date())
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : post.publish_date &&
                                    new Date(post.publish_date) > new Date()
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {post.is_published &&
                            (!post.publish_date ||
                              new Date(post.publish_date) <= new Date())
                              ? 'Published'
                              : post.publish_date &&
                                  new Date(post.publish_date) > new Date()
                                ? 'Scheduled'
                                : 'Draft'}
                          </span>
                          <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold'>
                            {post.category}
                          </span>
                        </div>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3'>
                            {post.excerpt}
                          </p>
                        )}

                        <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                          <span className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            {post.reading_time_minutes}min
                          </span>
                          <span className='flex items-center gap-1'>
                            <Eye className='w-4 h-4' />
                            {(post.views_count ?? 0).toLocaleString()}
                          </span>
                          <span className='flex items-center gap-1'>
                            <TrendingUp className='w-4 h-4' />
                            {post.likes_count} likes
                          </span>
                          <span className='flex items-center gap-1'>
                            <Calendar className='w-4 h-4' />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className='flex flex-col gap-2 ml-4'>
                        <button
                          onClick={() => handleEdit(post)}
                          className='p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors'
                          title='Edit'
                        >
                          <Edit className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => togglePublish(post)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.is_published
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                          }`}
                          title={post.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {post.is_published ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                        <button
                          onClick={() => toggleFeature(post)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.is_featured
                              ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          title='Toggle Featured'
                        >
                          <Star className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => togglePin(post)}
                          className={`p-2 rounded-lg transition-colors ${
                            post.is_pinned
                              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          title='Toggle Pin'
                        >
                          <Pin className='w-5 h-5' />
                        </button>
                        <button
                          onClick={() => handleDuplicate(post)}
                          className='p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                          title='Duplicate'
                        >
                          <Copy className='w-5 h-5' />
                        </button>
                        <a
                          href={`/blog/${post.slug}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                          title='View Post'
                        >
                          <ExternalLink className='w-5 h-5' />
                        </a>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className='p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors'
                          title='Delete'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-6 overflow-y-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl my-8'>
            <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button
                onClick={resetForm}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              >
                <X className='w-6 h-6 text-gray-600 dark:text-gray-400' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              {/* Basic Info */}
              <div className='space-y-4'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <FileText className='w-5 h-5' />
                  Basic Information
                </h3>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Title *
                  </label>
                  <input
                    type='text'
                    value={formData.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Slug (URL)
                  </label>
                  <input
                    type='text'
                    value={formData.slug || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                  />
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    URL: /blog/{formData.slug || 'your-post-slug'}
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    value={formData.excerpt || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={3}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    placeholder='A brief summary of your post (150-200 characters)'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Content * (
                    {formData.content_format === 'markdown'
                      ? 'Markdown'
                      : 'HTML'}
                    )
                  </label>
                  <div className='flex gap-2 mb-2'>
                    <button
                      type='button'
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          content_format: 'markdown',
                        }))
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        formData.content_format === 'markdown'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Markdown
                    </button>
                    <button
                      type='button'
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          content_format: 'html',
                        }))
                      }
                      className={`px-3 py-1 rounded text-sm ${
                        formData.content_format === 'html'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      HTML
                    </button>
                  </div>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={20}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                    placeholder='Write your post content here...'
                    required
                  />
                </div>
              </div>

              {/* Media */}
              <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <ImageIcon className='w-5 h-5' />
                  Media
                </h3>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Featured Image URL
                    </label>
                    <input
                      type='url'
                      value={formData.featured_image_url || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured_image_url: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='https://example.com/image.jpg'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Featured Video URL
                    </label>
                    <input
                      type='url'
                      value={formData.featured_video_url || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured_video_url: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='https://youtube.com/watch?v=...'
                    />
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Additional Images (one per line)
                    </label>
                    <textarea
                      value={
                        Array.isArray(formData.image_urls)
                          ? formData.image_urls.join('\n')
                          : ''
                      }
                      onChange={(e) => handleImageUrlsChange(e.target.value)}
                      rows={4}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                      placeholder='https://example.com/image1.jpg&#10;https://example.com/image2.jpg'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Additional Videos (one per line)
                    </label>
                    <textarea
                      value={
                        Array.isArray(formData.video_urls)
                          ? formData.video_urls.join('\n')
                          : ''
                      }
                      onChange={(e) => handleVideoUrlsChange(e.target.value)}
                      rows={4}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm'
                      placeholder='https://youtube.com/watch?v=...&#10;https://vimeo.com/...'
                    />
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Tag className='w-5 h-5' />
                  Categorization
                </h3>

                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Category *
                    </label>
                    <select
                      value={formData.category || 'Tutorials'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Subcategory
                    </label>
                    <input
                      type='text'
                      value={formData.subcategory || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subcategory: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Programming Languages'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Reading Time (minutes)
                    </label>
                    <input
                      type='number'
                      value={formData.reading_time_minutes || 5}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reading_time_minutes: parseInt(e.target.value),
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      min='1'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Tags (comma-separated)
                  </label>
                  <input
                    type='text'
                    value={
                      Array.isArray(formData.tags)
                        ? formData.tags.join(', ')
                        : ''
                    }
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    placeholder='typescript, react, nextjs, tutorial'
                  />
                </div>
              </div>

              {/* SEO */}
              <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                  SEO Optimization
                </h3>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Meta Title (60 chars)
                  </label>
                  <input
                    type='text'
                    value={formData.meta_title || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_title: e.target.value,
                      }))
                    }
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    maxLength={60}
                    placeholder='Custom title for search engines'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Meta Description (160 chars)
                  </label>
                  <textarea
                    value={formData.meta_description || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_description: e.target.value,
                      }))
                    }
                    rows={2}
                    maxLength={160}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    placeholder='Description shown in search results'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Keywords (comma-separated)
                  </label>
                  <input
                    type='text'
                    value={
                      Array.isArray(formData.meta_keywords)
                        ? formData.meta_keywords.join(', ')
                        : ''
                    }
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    placeholder='keyword1, keyword2, keyword3'
                  />
                </div>
              </div>

              {/* Technical */}
              <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Github className='w-5 h-5' />
                  Technical & Links
                </h3>

                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Code Language
                    </label>
                    <input
                      type='text'
                      value={formData.code_language || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          code_language: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='typescript'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      GitHub Repository
                    </label>
                    <input
                      type='url'
                      value={formData.github_repo_url || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          github_repo_url: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='https://github.com/...'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Demo URL
                    </label>
                    <input
                      type='url'
                      value={formData.demo_url || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          demo_url: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='https://demo.example.com'
                    />
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Series Name
                    </label>
                    <input
                      type='text'
                      value={formData.series_name || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          series_name: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='React Hooks Series'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Series Order
                    </label>
                    <input
                      type='number'
                      value={formData.series_order || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          series_order: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='1'
                      min='1'
                    />
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      CTA Button Text
                    </label>
                    <input
                      type='text'
                      value={formData.cta_text || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cta_text: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Get Started'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      CTA Button URL
                    </label>
                    <input
                      type='url'
                      value={formData.cta_url || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cta_url: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='https://...'
                    />
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                  <Calendar className='w-5 h-5' />
                  Publishing Options
                </h3>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Publish Date (leave empty for now)
                    </label>
                    <input
                      type='datetime-local'
                      value={
                        formData.publish_date
                          ? new Date(formData.publish_date)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          publish_date: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>

                <div className='flex flex-wrap gap-4'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.is_published || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                      className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Published
                    </span>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.is_featured || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_featured: e.target.checked,
                        }))
                      }
                      className='w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Featured
                    </span>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.is_pinned || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_pinned: e.target.checked,
                        }))
                      }
                      className='w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Pinned
                    </span>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.allow_comments || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allow_comments: e.target.checked,
                        }))
                      }
                      className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Allow Comments
                    </span>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.allow_likes || false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          allow_likes: e.target.checked,
                        }))
                      }
                      className='w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500'
                    />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Allow Likes
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex gap-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
                <button
                  type='submit'
                  className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold'
                >
                  <Save className='w-5 h-5' />
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
