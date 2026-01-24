'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Github,
  Award,
  Users,
  Calendar,
  TrendingUp,
  Star,
  Code,
  Briefcase,
  Globe,
  FileText,
  X,
  Save,
  Copy,
  Sparkles,
  Target,
} from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'details' | 'tech' | 'results'
  >('basic')

  const supabase = createClient()

  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    title: '',
    slug: '',
    tagline: '',
    summary: '',
    description: '',
    category: 'Web Development',
    subcategory: '',
    thumbnail_url: '',
    featured_image_url: '',
    gallery_images: [],
    demo_video_url: '',
    client_name: '',
    live_url: '',
    github_url: '',
    case_study_url: '',
    duration_months: null,
    team_size: null,
    project_type: 'Client Project',
    status: 'Completed',
    year: new Date().getFullYear(),
    primary_language: '',
    tech_stack: [],
    frameworks: [],
    tools: [],
    key_features: [],
    challenges: [],
    solutions: [],
    results_metrics: {},
    testimonial: '',
    testimonial_author: '',
    testimonial_position: '',
    awards: [],
    tags: [],
    complexity_level: 'Medium',
    project_role: 'Full Stack Developer',
    contribution_percentage: 100,
    featured: false,
    is_published: true,
    is_highlighted: false,
    is_award_winning: false,
    is_open_source: false,
    show_in_portfolio: true,
    display_priority: 0,
    sort_order: 0,
  })

  const categories = [
    'Web Development',
    'Mobile Apps',
    'Desktop Applications',
    'E-commerce',
    'SaaS Platform',
    'Enterprise Software',
    'API Development',
    'UI/UX Design',
    'DevOps',
    'AI/ML',
    'Blockchain',
    'Game Development',
    'IoT',
    'Other',
  ]

  const complexityLevels = ['Simple', 'Medium', 'Complex', 'Enterprise']
  const projectTypes = [
    'Client Project',
    'Personal Project',
    'Open Source',
    'Freelance',
    'Agency',
    'Startup',
    'Product',
  ]
  const statusOptions = [
    'Planning',
    'In Progress',
    'Completed',
    'Launched',
    'Maintenance',
    'Archived',
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, categoryFilter])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_priority', { ascending: false })
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const filterProjects = () => {
    let filtered = [...projects]

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tagline?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (project) => project.category === categoryFilter,
      )
    }

    setFilteredProjects(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(formData as any)
          .eq('id', editingProject.id)

        if (error) throw error
        alert('Project updated successfully!')
      } else {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error('Not authenticated')

        const { error } = await supabase.from('projects').insert({
          ...formData,
          owner_user_id: userData.user.id,
        } as any)

        if (error) throw error
        alert('Project created successfully!')
      }

      fetchProjects()
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project: ' + (error as Error).message)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    } else {
      fetchProjects()
    }
  }

  const handleDuplicate = async (project: Project) => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const duplicate = {
      ...project,
      id: undefined,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy-${Date.now()}`,
      owner_user_id: userData.user.id,
    }

    const { error } = await supabase.from('projects').insert(duplicate as any)

    if (error) {
      console.error('Error duplicating project:', error)
      alert('Error duplicating project')
    } else {
      fetchProjects()
    }
  }

  const togglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published })
      .eq('id', project.id)

    if (error) {
      console.error('Error toggling publish status:', error)
    } else {
      fetchProjects()
    }
  }

  const toggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ featured: !project.featured })
      .eq('id', project.id)

    if (error) {
      console.error('Error toggling featured status:', error)
    } else {
      fetchProjects()
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      title: '',
      slug: '',
      tagline: '',
      summary: '',
      description: '',
      category: 'Web Development',
      subcategory: '',
      thumbnail_url: '',
      featured_image_url: '',
      gallery_images: [],
      demo_video_url: '',
      client_name: '',
      live_url: '',
      github_url: '',
      case_study_url: '',
      duration_months: null,
      team_size: null,
      project_type: 'Client Project',
      status: 'Completed',
      year: new Date().getFullYear(),
      primary_language: '',
      tech_stack: [],
      frameworks: [],
      tools: [],
      key_features: [],
      challenges: [],
      solutions: [],
      results_metrics: {},
      testimonial: '',
      testimonial_author: '',
      testimonial_position: '',
      awards: [],
      tags: [],
      complexity_level: 'Medium',
      project_role: 'Full Stack Developer',
      contribution_percentage: 100,
      featured: false,
      is_published: true,
      is_highlighted: false,
      is_award_winning: false,
      is_open_source: false,
      show_in_portfolio: true,
      display_priority: 0,
      sort_order: 0,
    })
    setActiveTab('basic')
  }

  const parseArray = (value: string): string[] => {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const parseCommaArray = (value: string): string[] => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
              <Briefcase className='w-8 h-8 text-blue-600' />
              Project Portfolio Manager
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Showcase your work with world-class project presentations
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl'
          >
            <Plus className='w-5 h-5' />
            Add New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Total Projects
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {projects.length}
                </p>
              </div>
              <Briefcase className='w-10 h-10 text-blue-500 opacity-20' />
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Featured
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {projects.filter((p) => p.featured).length}
                </p>
              </div>
              <Star className='w-10 h-10 text-yellow-500 opacity-20' />
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Published
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {projects.filter((p) => p.is_published).length}
                </p>
              </div>
              <Eye className='w-10 h-10 text-green-500 opacity-20' />
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Award Winning
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {projects.filter((p) => p.is_award_winning).length}
                </p>
              </div>
              <Award className='w-10 h-10 text-purple-500 opacity-20' />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <input
              type='text'
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className='max-w-7xl mx-auto'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center'>
            <Briefcase className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              No projects found
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group'
              >
                {/* Thumbnail */}
                <div className='relative h-48 bg-linear-to-br from-blue-500 to-purple-600 overflow-hidden'>
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Code className='w-16 h-16 text-white opacity-50' />
                    </div>
                  )}

                  {/* Badges */}
                  <div className='absolute top-2 right-2 flex flex-col gap-2'>
                    {project.featured && (
                      <span className='px-2 py-1 bg-yellow-500 text-white rounded text-xs font-bold flex items-center gap-1'>
                        <Star className='w-3 h-3' />
                        Featured
                      </span>
                    )}
                    {project.is_award_winning && (
                      <span className='px-2 py-1 bg-purple-500 text-white rounded text-xs font-bold flex items-center gap-1'>
                        <Award className='w-3 h-3' />
                        Award
                      </span>
                    )}
                    {project.is_open_source && (
                      <span className='px-2 py-1 bg-green-500 text-white rounded text-xs font-bold flex items-center gap-1'>
                        <Github className='w-3 h-3' />
                        Open
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className='absolute top-2 left-2'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        project.is_published
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {project.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <div className='mb-3'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  {project.summary && (
                    <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3'>
                      {project.summary}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {project.category && (
                      <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs'>
                        {project.category}
                      </span>
                    )}
                    {project.status && (
                      <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs'>
                        {project.status}
                      </span>
                    )}
                    {project.year && (
                      <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {project.year}
                      </span>
                    )}
                  </div>

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className='flex flex-wrap gap-1 mb-3'>
                      {project.tech_stack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs'
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs'>
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleEdit(project)}
                      className='flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm'
                    >
                      <Edit className='w-4 h-4' />
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(project)}
                      className='p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                      title={project.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {project.is_published ? (
                        <EyeOff className='w-4 h-4' />
                      ) : (
                        <Eye className='w-4 h-4' />
                      )}
                    </button>
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.featured
                          ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      title='Toggle Featured'
                    >
                      <Star className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDuplicate(project)}
                      className='p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                      title='Duplicate'
                    >
                      <Copy className='w-4 h-4' />
                    </button>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                        title='View Live'
                      >
                        <ExternalLink className='w-4 h-4' />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(project.id)}
                      className='p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors'
                      title='Delete'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
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
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl my-8'>
            {/* Form Header */}
            <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                {editingProject ? (
                  <>
                    <Edit className='w-6 h-6 text-blue-600' />
                    Edit Project
                  </>
                ) : (
                  <>
                    <Plus className='w-6 h-6 text-blue-600' />
                    Create New Project
                  </>
                )}
              </h2>
              <button
                onClick={resetForm}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              >
                <X className='w-6 h-6 text-gray-600 dark:text-gray-400' />
              </button>
            </div>

            {/* Tabs */}
            <div className='flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto'>
              {[
                { id: 'basic', label: 'Basic Info', icon: FileText },
                { id: 'media', label: 'Media', icon: Globe },
                { id: 'details', label: 'Details', icon: Briefcase },
                { id: 'tech', label: 'Tech Stack', icon: Code },
                { id: 'results', label: 'Results', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className='w-4 h-4' />
                  {tab.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 max-h-[70vh] overflow-y-auto'
            >
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Project Title <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.title || ''}
                      onChange={(e) => {
                        const title = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          title,
                          slug: title
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-'),
                        }))
                      }}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='E-commerce Platform Redesign'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Tagline
                    </label>
                    <input
                      type='text'
                      value={formData.tagline || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagline: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Transforming online shopping experience'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Summary
                    </label>
                    <textarea
                      value={formData.summary || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      rows={3}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Brief summary (2-3 sentences)'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Full Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={8}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Detailed project description...'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Category <span className='text-red-500'>*</span>
                      </label>
                      <select
                        required
                        value={formData.category || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Status
                      </label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className='space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                      Display Settings
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      {[
                        { key: 'is_published', label: 'Published', icon: Eye },
                        { key: 'featured', label: 'Featured', icon: Star },
                        {
                          key: 'show_in_portfolio',
                          label: 'Show in Portfolio',
                          icon: Globe,
                        },
                        {
                          key: 'is_highlighted',
                          label: 'Highlighted',
                          icon: Sparkles,
                        },
                        {
                          key: 'is_award_winning',
                          label: 'Award Winning',
                          icon: Award,
                        },
                        {
                          key: 'is_open_source',
                          label: 'Open Source',
                          icon: Github,
                        },
                      ].map(({ key, label, icon: Icon }) => (
                        <label
                          key={key}
                          className='flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                        >
                          <input
                            type='checkbox'
                            checked={
                              (formData[
                                key as keyof typeof formData
                              ] as boolean) || false
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                          />
                          <Icon className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                          <span className='text-sm text-gray-700 dark:text-gray-300'>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className='space-y-6'>
                  <ImageUpload
                    bucket='projects'
                    folder='thumbnails'
                    prefix='project-thumb'
                    value={formData.thumbnail_url}
                    onChange={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail_url: url as string | null,
                      }))
                    }
                    multiple={false}
                    label='Thumbnail Image'
                    description='Card/grid thumbnail (recommended: 600x400px or 3:2 ratio)'
                    aspectRatio='3/2'
                    showPreview={true}
                    required={true}
                  />

                  <ImageUpload
                    bucket='projects'
                    folder='featured'
                    prefix='project-hero'
                    value={formData.featured_image_url}
                    onChange={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured_image_url: url as string | null,
                      }))
                    }
                    multiple={false}
                    label='Featured Hero Image'
                    description='Main hero image for project detail page (recommended: 1920x1080px or 16:9 ratio)'
                    aspectRatio='16/9'
                    showPreview={true}
                  />

                  <ImageUpload
                    bucket='projects'
                    folder='gallery'
                    prefix='project-gallery'
                    value={formData.gallery_images}
                    onChange={(urls) =>
                      setFormData((prev) => ({
                        ...prev,
                        gallery_images: Array.isArray(urls)
                          ? urls
                          : urls
                            ? [urls]
                            : null,
                      }))
                    }
                    multiple={true}
                    maxFiles={12}
                    label='Project Gallery'
                    description='Screenshots, mockups, and project images'
                    showPreview={true}
                  />
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Client Name
                      </label>
                      <input
                        type='text'
                        value={formData.client_name || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            client_name: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='Acme Corporation'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Live URL
                      </label>
                      <input
                        type='url'
                        value={formData.live_url || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            live_url: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='https://...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        GitHub URL
                      </label>
                      <input
                        type='url'
                        value={formData.github_url || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            github_url: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='https://github.com/...'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Case Study URL
                      </label>
                      <input
                        type='url'
                        value={formData.case_study_url || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            case_study_url: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='https://...'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tech Stack Tab */}
              {activeTab === 'tech' && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Tech Stack (comma-separated)
                    </label>
                    <input
                      type='text'
                      value={formData.tech_stack?.join(', ') || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tech_stack: parseCommaArray(e.target.value),
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='React, Node.js, PostgreSQL, Next.js'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Key Features (one per line)
                    </label>
                    <textarea
                      value={formData.key_features?.join('\n') || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          key_features: parseArray(e.target.value),
                        }))
                      }
                      rows={4}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='Real-time collaboration&#10;Advanced analytics dashboard&#10;AI-powered recommendations'
                    />
                  </div>
                </div>
              )}

              {/* Results Tab */}
              {activeTab === 'results' && (
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Testimonial
                    </label>
                    <textarea
                      value={formData.testimonial || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          testimonial: e.target.value,
                        }))
                      }
                      rows={4}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                      placeholder='"Working with this developer was amazing..."'
                    />
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Author Name
                      </label>
                      <input
                        type='text'
                        value={formData.testimonial_author || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            testimonial_author: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='John Doe'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Position
                      </label>
                      <input
                        type='text'
                        value={formData.testimonial_position || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            testimonial_position: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                        placeholder='CEO, Acme Corp'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className='flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8'>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2'
                >
                  <X className='w-4 h-4' />
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2'
                >
                  <Save className='w-4 h-4' />
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
