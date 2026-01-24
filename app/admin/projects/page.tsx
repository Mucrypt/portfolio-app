'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { Database } from '@/types/db'

type Project = Database['public']['Tables']['projects']['Row']

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    tech_stack: '',
    featured: false,
    sort_order: 0,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const payload = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        tech_stack: formData.tech_stack.split(',').map((t) => t.trim()),
        featured: formData.featured,
        sort_order: formData.sort_order,
      }

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({ ...payload, owner_user_id: user.id })
        if (error) throw error
      }

      resetForm()
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  async function handleDelete(project: Project) {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
      if (error) throw error
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setFormData({
      title: project.title,
      summary: project.summary || '',
      description: project.description || '',
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      featured: project.featured ?? false,
      sort_order: project.sort_order,
    })
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      title: '',
      summary: '',
      description: '',
      tech_stack: '',
      featured: false,
      sort_order: 0,
    })
    setShowForm(false)
    setEditingProject(null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Projects</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-zinc-800 p-6 rounded-lg shadow mb-6'
        >
          <h2 className='text-xl font-semibold mb-4'>
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Title *</label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Summary</label>
              <input
                type='text'
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                placeholder='Brief one-liner about the project'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                rows={4}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Tech Stack (comma-separated)
              </label>
              <input
                type='text'
                value={formData.tech_stack}
                onChange={(e) =>
                  setFormData({ ...formData, tech_stack: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                placeholder='React, TypeScript, Node.js'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Sort Order
                </label>
                <input
                  type='number'
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                />
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className='mr-2'
                />
                <label className='text-sm font-medium'>Featured Project</label>
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
          >
            {editingProject ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'summary', label: 'Summary' },
          { key: 'featured', label: 'Featured' },
          { key: 'sort_order', label: 'Order' },
        ]}
        data={projects.map((p) => ({
          ...p,
          featured: p.featured ? 'Yes' : 'No',
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
