'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/admin/DataTable'
import { Database } from '@/types/db'

type Skill = Database['public']['Tables']['skills']['Row']
type SkillInsert = Database['public']['Tables']['skills']['Insert']

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 3,
    sort_order: 0,
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
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

      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingSkill.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('skills')
          .insert({ ...formData, owner_user_id: user.id })
        if (error) throw error
      }

      setFormData({ name: '', category: '', level: 3, sort_order: 0 })
      setShowForm(false)
      setEditingSkill(null)
      fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  async function handleDelete(skill: Skill) {
    if (!confirm('Are you sure you want to delete this skill?')) return
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id)
      if (error) throw error
      fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  function handleEdit(skill: Skill) {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      sort_order: skill.sort_order,
    })
    setShowForm(true)
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Skills</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingSkill(null)
            setFormData({ name: '', category: '', level: 3, sort_order: 0 })
          }}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          {showForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className='bg-white dark:bg-zinc-800 p-6 rounded-lg shadow mb-6'
        >
          <h2 className='text-xl font-semibold mb-4'>
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Name</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Category</label>
              <input
                type='text'
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                placeholder='e.g., Software, Construction'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Level (1-5)
              </label>
              <input
                type='number'
                min='1'
                max='5'
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className='w-full px-3 py-2 border rounded-lg dark:bg-zinc-700'
                required
              />
            </div>
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
          </div>
          <button
            type='submit'
            className='mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
          >
            {editingSkill ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'level', label: 'Level' },
          { key: 'sort_order', label: 'Order' },
        ]}
        data={skills}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
