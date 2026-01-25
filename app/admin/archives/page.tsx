'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import VideoUpload from '@/components/admin/VideoUpload'
import {
  Plus,
  Trash2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages as LanguagesIcon,
  Code,
  Settings,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import Link from 'next/link'

type Profile = {
  id: string
  full_name: string
  headline: string | null
  bio: string | null
  location: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  cv_url: string | null
  hero_video_url: string | null
  hero_background_image: string | null
  socials: any
  role_tags: string[]
}

type Experience = {
  id?: string
  company: string
  title: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean | null
  highlights: string[] | null
  owner_user_id?: string
}

type Skill = {
  id?: string
  name: string
  category: string
  level: number
  owner_user_id?: string
}

type Education = {
  id?: string
  school: string
  program: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  notes: string | null
  owner_user_id?: string
}

type Certificate = {
  id?: string
  name: string
  issuer: string | null
  url: string | null
  year: number | null
  owner_user_id?: string
}

type Language = {
  id?: string
  name: string
  level: string | null
  owner_user_id?: string
}

export default function AdminArchivesPage() {
  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'experience'
    | 'education'
    | 'skills'
    | 'certificates'
    | 'languages'
  >('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Profile state
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    headline: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    avatar_url: '',
    cv_url: '',
    hero_video_url: '',
    hero_background_image: '',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
    role_tags: [],
  })

  // Collections state
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [languages, setLanguages] = useState<Language[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .single()

      if (profileData) {
        setProfile({
          ...profileData,
          socials: profileData.socials || {
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
          },
          role_tags: profileData.role_tags || [],
        })
      }

      // Fetch experiences
      const { data: expData } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false })

      if (expData)
        setExperiences(
          expData.map((exp: any) => ({
            ...exp,
            location: exp.location || '',
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            highlights: exp.highlights || [],
          })),
        )

      // Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('level', { ascending: false })

      if (skillsData) setSkills(skillsData)

      // Fetch education
      const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false })

      if (eduData)
        setEducation(
          eduData.map((edu: any) => ({
            ...edu,
            program: edu.program || '',
            location: edu.location || '',
            start_date: edu.start_date || '',
            end_date: edu.end_date || '',
            notes: edu.notes || '',
          })),
        )

      // Fetch certificates
      const { data: certData } = await supabase
        .from('certificates')
        .select('*')
        .order('year', { ascending: false })

      if (certData)
        setCertificates(
          certData.map((cert: any) => ({
            ...cert,
            issuer: cert.issuer || '',
            url: cert.url || '',
            year: cert.year || new Date().getFullYear(),
          })),
        )

      // Fetch languages
      const { data: langData } = await supabase.from('languages').select('*')

      if (langData)
        setLanguages(
          langData.map((lang: any) => ({
            ...lang,
            level: lang.level || 'Native',
          })),
        )
    } catch (error) {
      console.error('Error fetching data:', error)
      showMessage('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Profile handlers
  async function saveProfile() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          cv_url: profile.cv_url,
          hero_video_url: profile.hero_video_url,
          hero_background_image: profile.hero_background_image,
          socials: profile.socials,
          role_tags: profile.role_tags,
        })
        .eq('id', profile.id)

      if (error) throw error
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      showMessage('error', 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  function updateProfile(field: string, value: any) {
    setProfile({ ...profile, [field]: value })
  }

  function updateSocial(platform: string, value: string) {
    setProfile({
      ...profile,
      socials: { ...profile.socials, [platform]: value },
    })
  }

  function addRoleTag() {
    setProfile({ ...profile, role_tags: [...profile.role_tags, ''] })
  }

  function updateRoleTag(index: number, value: string) {
    const updated = [...profile.role_tags]
    updated[index] = value
    setProfile({ ...profile, role_tags: updated })
  }

  function removeRoleTag(index: number) {
    setProfile({
      ...profile,
      role_tags: profile.role_tags.filter((_, i) => i !== index),
    })
  }

  // Experience handlers
  function addExperience() {
    setExperiences([
      {
        company: '',
        title: '',
        location: '',
        start_date: '',
        end_date: '',
        is_current: false,
        highlights: [],
      },
      ...experiences,
    ])
  }

  function updateExperience(index: number, field: string, value: any) {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    setExperiences(updated)
  }

  function removeExperience(index: number) {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  async function saveExperience(index: number) {
    setSaving(true)
    try {
      const supabase = createClient()
      const exp = experiences[index]

      if (exp.id) {
        // Update existing
        const { error } = await supabase
          .from('experiences')
          .update(exp)
          .eq('id', exp.id)
        if (error) throw error
      } else {
        // Insert new
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('experiences')
          .insert({ ...exp, owner_user_id: user.id })
          .select()
          .single()
        if (error) throw error
        if (data) {
          const updated = [...experiences]
          updated[index] = {
            ...data,
            location: data.location || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            highlights: data.highlights || [],
          }
          setExperiences(updated)
        }
      }
      showMessage('success', 'Experience saved!')
    } catch (error) {
      console.error('Error saving experience:', error)
      showMessage('error', 'Failed to save experience')
    } finally {
      setSaving(false)
    }
  }

  async function deleteExperience(index: number) {
    const exp = experiences[index]
    if (!exp.id) {
      removeExperience(index)
      return
    }

    if (!confirm('Delete this experience?')) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', exp.id)
      if (error) throw error
      removeExperience(index)
      showMessage('success', 'Experience deleted!')
    } catch (error) {
      console.error('Error deleting experience:', error)
      showMessage('error', 'Failed to delete experience')
    } finally {
      setSaving(false)
    }
  }

  // Skill handlers
  function addSkill() {
    setSkills([{ name: '', category: 'Technical', level: 80 }, ...skills])
  }

  function updateSkill(index: number, field: string, value: any) {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    setSkills(updated)
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index))
  }

  async function saveSkill(index: number) {
    setSaving(true)
    try {
      const supabase = createClient()
      const skill = skills[index]

      if (skill.id) {
        const { error } = await supabase
          .from('skills')
          .update(skill)
          .eq('id', skill.id)
        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('skills')
          .insert({ ...skill, owner_user_id: user.id })
          .select()
          .single()
        if (error) throw error
        if (data) {
          const updated = [...skills]
          updated[index] = data
          setSkills(updated)
        }
      }
      showMessage('success', 'Skill saved!')
    } catch (error) {
      console.error('Error saving skill:', error)
      showMessage('error', 'Failed to save skill')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSkill(index: number) {
    const skill = skills[index]
    if (!skill.id) {
      removeSkill(index)
      return
    }

    if (!confirm('Delete this skill?')) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id)
      if (error) throw error
      removeSkill(index)
      showMessage('success', 'Skill deleted!')
    } catch (error) {
      console.error('Error deleting skill:', error)
      showMessage('error', 'Failed to delete skill')
    } finally {
      setSaving(false)
    }
  }

  // Education handlers
  function addEducation() {
    setEducation([
      {
        school: '',
        program: '',
        location: '',
        start_date: '',
        end_date: '',
        notes: '',
      },
      ...education,
    ])
  }

  function updateEducation(index: number, field: string, value: any) {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  function removeEducation(index: number) {
    setEducation(education.filter((_, i) => i !== index))
  }

  async function saveEducation(index: number) {
    setSaving(true)
    try {
      const supabase = createClient()
      const edu = education[index]

      if (edu.id) {
        const { error } = await supabase
          .from('education')
          .update(edu)
          .eq('id', edu.id)
        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('education')
          .insert({ ...edu, owner_user_id: user.id })
          .select()
          .single()
        if (error) throw error
        if (data) {
          const updated = [...education]
          updated[index] = {
            ...data,
            program: data.program || '',
            location: data.location || '',
            start_date: data.start_date || '',
            end_date: data.end_date || '',
            notes: data.notes || '',
          }
          setEducation(updated)
        }
      }
      showMessage('success', 'Education saved!')
    } catch (error) {
      console.error('Error saving education:', error)
      showMessage('error', 'Failed to save education')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEducation(index: number) {
    const edu = education[index]
    if (!edu.id) {
      removeEducation(index)
      return
    }

    if (!confirm('Delete this education?')) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', edu.id)
      if (error) throw error
      removeEducation(index)
      showMessage('success', 'Education deleted!')
    } catch (error) {
      console.error('Error deleting education:', error)
      showMessage('error', 'Failed to delete education')
    } finally {
      setSaving(false)
    }
  }

  // Certificate handlers
  function addCertificate() {
    setCertificates([
      { name: '', issuer: '', url: '', year: new Date().getFullYear() },
      ...certificates,
    ])
  }

  function updateCertificate(index: number, field: string, value: any) {
    const updated = [...certificates]
    updated[index] = { ...updated[index], [field]: value }
    setCertificates(updated)
  }

  function removeCertificate(index: number) {
    setCertificates(certificates.filter((_, i) => i !== index))
  }

  async function saveCertificate(index: number) {
    setSaving(true)
    try {
      const supabase = createClient()
      const cert = certificates[index]

      if (cert.id) {
        const { error } = await supabase
          .from('certificates')
          .update(cert)
          .eq('id', cert.id)
        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('certificates')
          .insert({ ...cert, owner_user_id: user.id })
          .select()
          .single()
        if (error) throw error
        if (data) {
          const updated = [...certificates]
          updated[index] = {
            ...data,
            issuer: data.issuer || '',
            url: data.url || '',
            year: data.year || new Date().getFullYear(),
          }
          setCertificates(updated)
        }
      }
      showMessage('success', 'Certificate saved!')
    } catch (error) {
      console.error('Error saving certificate:', error)
      showMessage('error', 'Failed to save certificate')
    } finally {
      setSaving(false)
    }
  }

  async function deleteCertificate(index: number) {
    const cert = certificates[index]
    if (!cert.id) {
      removeCertificate(index)
      return
    }

    if (!confirm('Delete this certificate?')) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', cert.id)
      if (error) throw error
      removeCertificate(index)
      showMessage('success', 'Certificate deleted!')
    } catch (error) {
      console.error('Error deleting certificate:', error)
      showMessage('error', 'Failed to delete certificate')
    } finally {
      setSaving(false)
    }
  }

  // Language handlers
  function addLanguage() {
    setLanguages([{ name: '', level: 'Native' }, ...languages])
  }

  function updateLanguage(index: number, field: string, value: any) {
    const updated = [...languages]
    updated[index] = { ...updated[index], [field]: value }
    setLanguages(updated)
  }

  function removeLanguage(index: number) {
    setLanguages(languages.filter((_, i) => i !== index))
  }

  async function saveLanguage(index: number) {
    setSaving(true)
    try {
      const supabase = createClient()
      const lang = languages[index]

      if (lang.id) {
        const { error } = await supabase
          .from('languages')
          .update(lang)
          .eq('id', lang.id)
        if (error) throw error
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('languages')
          .insert({ ...lang, owner_user_id: user.id })
          .select()
          .single()
        if (error) throw error
        if (data) {
          const updated = [...languages]
          updated[index] = {
            ...data,
            level: data.level || 'Native',
          }
          setLanguages(updated)
        }
      }
      showMessage('success', 'Language saved!')
    } catch (error) {
      console.error('Error saving language:', error)
      showMessage('error', 'Failed to save language')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLanguage(index: number) {
    const lang = languages[index]
    if (!lang.id) {
      removeLanguage(index)
      return
    }

    if (!confirm('Delete this language?')) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', lang.id)
      if (error) throw error
      removeLanguage(index)
      showMessage('success', 'Language deleted!')
    } catch (error) {
      console.error('Error deleting language:', error)
      showMessage('error', 'Failed to delete language')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'languages', label: 'Languages', icon: LanguagesIcon },
  ] as const

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-zinc-950'>
      {/* Header */}
      <div className='bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link
                href='/admin'
                className='p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors'
              >
                <ArrowLeft className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              </Link>
              <div>
                <h1 className='text-2xl font-black text-gray-900 dark:text-white'>
                  Archives Management
                </h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Manage your professional CV and portfolio
                </p>
              </div>
            </div>
            <Link
              href='/archives'
              target='_blank'
              className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2'
            >
              <Settings className='w-4 h-4' />
              Preview Archives
            </Link>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className='fixed top-20 right-4 z-50 animate-slide-in'>
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400' />
            ) : (
              <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
            )}
            <span
              className={`text-sm font-medium ${
                message.type === 'success'
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
              }`}
            >
              {message.text}
            </span>
            <button
              onClick={() => setMessage(null)}
              className='ml-2 hover:opacity-70'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className='bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex gap-1 overflow-x-auto'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className='space-y-6'>
            {/* Basic Info */}
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Basic Information
              </h2>

              <div className='space-y-4'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      value={profile.full_name}
                      onChange={(e) =>
                        updateProfile('full_name', e.target.value)
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                      placeholder='John Doe'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Email *
                    </label>
                    <input
                      type='email'
                      value={profile.email || ''}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                      placeholder='john@example.com'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Headline
                  </label>
                  <input
                    type='text'
                    value={profile.headline || ''}
                    onChange={(e) => updateProfile('headline', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                    placeholder='Senior Full Stack Developer | AI Enthusiast'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Bio
                  </label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    rows={4}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                    placeholder='Tell your professional story...'
                  />
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Location
                    </label>
                    <input
                      type='text'
                      value={profile.location || ''}
                      onChange={(e) =>
                        updateProfile('location', e.target.value)
                      }
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                      placeholder='San Francisco, CA'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      value={profile.phone || ''}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white'
                      placeholder='+1 (555) 123-4567'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Role Tags
                  </label>
                  <div className='space-y-2'>
                    {profile.role_tags.map((tag, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={tag}
                          onChange={(e) => updateRoleTag(index, e.target.value)}
                          className='flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Developer'
                        />
                        <button
                          onClick={() => removeRoleTag(index)}
                          className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addRoleTag}
                      className='px-4 py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors w-full'
                    >
                      + Add Role Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Media & Assets
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Avatar
                  </label>
                  <ImageUpload
                    value={profile.avatar_url}
                    onChange={(url) =>
                      updateProfile('avatar_url', url as string)
                    }
                    bucket='media'
                    folder='avatars'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Hero Background Image
                  </label>
                  <ImageUpload
                    value={profile.hero_background_image}
                    onChange={(url) =>
                      updateProfile('hero_background_image', url as string)
                    }
                    bucket='media'
                    folder='hero'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Hero Video (Optional)
                  </label>
                  <VideoUpload
                    value={profile.hero_video_url}
                    onChange={(url) =>
                      updateProfile('hero_video_url', url as string)
                    }
                    bucket='media'
                    folder='hero'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    CV/Resume (PDF)
                  </label>
                  <input
                    type='url'
                    value={profile.cv_url || ''}
                    onChange={(e) => updateProfile('cv_url', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='https://example.com/cv.pdf'
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Social Links
              </h2>

              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    GitHub
                  </label>
                  <input
                    type='url'
                    value={profile.socials?.github || ''}
                    onChange={(e) => updateSocial('github', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='https://github.com/username'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    LinkedIn
                  </label>
                  <input
                    type='url'
                    value={profile.socials?.linkedin || ''}
                    onChange={(e) => updateSocial('linkedin', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='https://linkedin.com/in/username'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Twitter
                  </label>
                  <input
                    type='url'
                    value={profile.socials?.twitter || ''}
                    onChange={(e) => updateSocial('twitter', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='https://twitter.com/username'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Website
                  </label>
                  <input
                    type='url'
                    value={profile.socials?.website || ''}
                    onChange={(e) => updateSocial('website', e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                    placeholder='https://yourwebsite.com'
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className='flex justify-end'>
              <button
                onClick={saveProfile}
                disabled={saving}
                className='px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {saving ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4' />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Work Experience
              </h2>
              <button
                onClick={addExperience}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Experience
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <Briefcase className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No experience added yet.
                </p>
              </div>
            ) : (
              experiences.map((exp, index) => (
                <div
                  key={index}
                  className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Experience {index + 1}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => saveExperience(index)}
                        disabled={saving}
                        className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteExperience(index)}
                        disabled={saving}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Company *
                        </label>
                        <input
                          type='text'
                          value={exp.company}
                          onChange={(e) =>
                            updateExperience(index, 'company', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Company Name'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Job Title *
                        </label>
                        <input
                          type='text'
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(index, 'title', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Senior Developer'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Location
                      </label>
                      <input
                        type='text'
                        value={exp.location || ''}
                        onChange={(e) =>
                          updateExperience(index, 'location', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='New York, NY'
                      />
                    </div>

                    <div className='grid md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Start Date
                        </label>
                        <input
                          type='month'
                          value={exp.start_date || ''}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              'start_date',
                              e.target.value,
                            )
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          End Date
                        </label>
                        <input
                          type='month'
                          value={exp.end_date || ''}
                          onChange={(e) =>
                            updateExperience(index, 'end_date', e.target.value)
                          }
                          disabled={exp.is_current || false}
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 disabled:opacity-50'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Currently Working
                        </label>
                        <label className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={exp.is_current || false}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                'is_current',
                                e.target.checked,
                              )
                            }
                            className='w-4 h-4'
                          />
                          <span className='text-sm'>Current Role</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Highlights (one per line)
                      </label>
                      <textarea
                        value={exp.highlights?.join('\n') || ''}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            'highlights',
                            e.target.value.split('\n').filter(Boolean),
                          )
                        }
                        rows={6}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Led team of 5 developers&#10;Increased performance by 40%&#10;Implemented CI/CD pipeline'
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Education
              </h2>
              <button
                onClick={addEducation}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Education
              </button>
            </div>

            {education.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <GraduationCap className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No education added yet.
                </p>
              </div>
            ) : (
              education.map((edu, index) => (
                <div
                  key={index}
                  className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                >
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Education {index + 1}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => saveEducation(index)}
                        disabled={saving}
                        className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteEducation(index)}
                        disabled={saving}
                        className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          School/University *
                        </label>
                        <input
                          type='text'
                          value={edu.school}
                          onChange={(e) =>
                            updateEducation(index, 'school', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='University Name'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Program/Degree *
                        </label>
                        <input
                          type='text'
                          value={edu.program || ''}
                          onChange={(e) =>
                            updateEducation(index, 'program', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Bachelor of Science in Computer Science'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Location
                      </label>
                      <input
                        type='text'
                        value={edu.location ?? ''}
                        onChange={(e) =>
                          updateEducation(index, 'location', e.target.value)
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='Boston, MA'
                      />
                    </div>

                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Start Date
                        </label>
                        <input
                          type='month'
                          value={edu.start_date || ''}
                          onChange={(e) =>
                            updateEducation(index, 'start_date', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          End Date
                        </label>
                        <input
                          type='month'
                          value={edu.end_date || ''}
                          onChange={(e) =>
                            updateEducation(index, 'end_date', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Notes (GPA, honors, etc.)
                      </label>
                      <textarea
                        value={edu.notes || ''}
                        onChange={(e) =>
                          updateEducation(index, 'notes', e.target.value)
                        }
                        rows={3}
                        className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        placeholder='GPA: 3.8/4.0, Summa Cum Laude'
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Technical Skills
              </h2>
              <button
                onClick={addSkill}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Skill
              </button>
            </div>

            {skills.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <Code className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No skills added yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-6'>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                        Skill {index + 1}
                      </h3>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => saveSkill(index)}
                          disabled={saving}
                          className='px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteSkill(index)}
                          disabled={saving}
                          className='p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Skill Name *
                        </label>
                        <input
                          type='text'
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(index, 'name', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='JavaScript'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Category
                        </label>
                        <select
                          value={skill.category}
                          onChange={(e) =>
                            updateSkill(index, 'category', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        >
                          <option value='Technical'>Technical</option>
                          <option value='Frontend'>Frontend</option>
                          <option value='Backend'>Backend</option>
                          <option value='DevOps'>DevOps</option>
                          <option value='Database'>Database</option>
                          <option value='Tools'>Tools</option>
                          <option value='Design'>Design</option>
                          <option value='Soft Skills'>Soft Skills</option>
                        </select>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Proficiency Level: {skill.level}%
                        </label>
                        <input
                          type='range'
                          min='0'
                          max='100'
                          step='5'
                          value={skill.level}
                          onChange={(e) =>
                            updateSkill(
                              index,
                              'level',
                              parseInt(e.target.value),
                            )
                          }
                          className='w-full'
                        />
                        <div className='h-2 bg-gray-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden'>
                          <div
                            className='h-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 transition-all'
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Certificates & Credentials
              </h2>
              <button
                onClick={addCertificate}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Certificate
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <Award className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No certificates added yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-2 gap-6'>
                {certificates.map((cert, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                        Certificate {index + 1}
                      </h3>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => saveCertificate(index)}
                          disabled={saving}
                          className='px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteCertificate(index)}
                          disabled={saving}
                          className='p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Certificate Name *
                        </label>
                        <input
                          type='text'
                          value={cert.name}
                          onChange={(e) =>
                            updateCertificate(index, 'name', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='AWS Certified Solutions Architect'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Issuer *
                        </label>
                        <input
                          type='text'
                          value={cert.issuer || ''}
                          onChange={(e) =>
                            updateCertificate(index, 'issuer', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='Amazon Web Services'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Year
                        </label>
                        <input
                          type='number'
                          value={cert.year || ''}
                          onChange={(e) =>
                            updateCertificate(
                              index,
                              'year',
                              parseInt(e.target.value),
                            )
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='2024'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Credential URL
                        </label>
                        <input
                          type='url'
                          value={cert.url || ''}
                          onChange={(e) =>
                            updateCertificate(index, 'url', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='https://credential.com/...'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LANGUAGES TAB */}
        {activeTab === 'languages' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                Languages
              </h2>
              <button
                onClick={addLanguage}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
              >
                <Plus className='w-4 h-4' />
                Add Language
              </button>
            </div>

            {languages.length === 0 ? (
              <div className='bg-white dark:bg-zinc-900 rounded-xl p-12 border border-gray-200 dark:border-zinc-800 text-center'>
                <LanguagesIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400'>
                  No languages added yet.
                </p>
              </div>
            ) : (
              <div className='grid md:grid-cols-3 gap-6'>
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                        Language {index + 1}
                      </h3>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => saveLanguage(index)}
                          disabled={saving}
                          className='px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
                        >
                          Save
                        </button>
                        <button
                          onClick={() => deleteLanguage(index)}
                          disabled={saving}
                          className='p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Language *
                        </label>
                        <input
                          type='text'
                          value={lang.name}
                          onChange={(e) =>
                            updateLanguage(index, 'name', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                          placeholder='English'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                          Proficiency Level
                        </label>
                        <select
                          value={lang.level || 'Native'}
                          onChange={(e) =>
                            updateLanguage(index, 'level', e.target.value)
                          }
                          className='w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800'
                        >
                          <option value='Native'>Native</option>
                          <option value='Fluent'>Fluent</option>
                          <option value='Professional'>Professional</option>
                          <option value='Intermediate'>Intermediate</option>
                          <option value='Basic'>Basic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
