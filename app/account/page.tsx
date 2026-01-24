'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth/user'

interface PublicUser {
  id: string
  auth_user_id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  user_role: string
  is_active: boolean | null
  email_verified: boolean | null
  created_at: string | null
  last_login_at: string | null
  preferences: {
    notifications: boolean
    marketing_emails: boolean
    newsletter: boolean
  }
}

interface ContactInquiry {
  id: string
  subject: string
  message: string
  status: string | null
  created_at: string | null
  responded_at: string | null
}

interface ServiceRequest {
  id: string
  service_type: string
  project_title: string
  description: string
  status: string | null
  created_at: string | null
}

type TabType = 'profile' | 'activity' | 'services' | 'contacts' | 'settings'

export default function AccountPage() {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [services, setServices] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUserData() {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login?redirectTo=/account')
        return
      }

      // Load user profile
      const { data: publicUser, error: userError } = await supabase
        .from('public_users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (userError) {
        console.error('Error loading user:', userError)
        router.push('/login?redirectTo=/account')
        return
      }

      // Ensure preferences has a default value
      const userWithPreferences = {
        ...publicUser,
        preferences: (publicUser.preferences as {
          notifications: boolean
          marketing_emails: boolean
          newsletter: boolean
        }) || {
          notifications: true,
          marketing_emails: false,
          newsletter: false,
        },
      }

      setUser(userWithPreferences)
      setEditForm({
        full_name: publicUser.full_name || '',
        phone: publicUser.phone || '',
      })

      // Load contact inquiries
      const { data: inquiriesData } = await supabase
        .from('contact_inquiries')
        .select('*')
        .eq('user_id', publicUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (inquiriesData) setInquiries(inquiriesData)

      // Load service requests
      const { data: servicesData } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', publicUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (servicesData) setServices(servicesData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile() {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('public_users')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      setUser({
        ...user,
        full_name: editForm.full_name,
        phone: editForm.phone,
      })
      setEditing(false)
    } catch (error) {
      alert('Error updating profile: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePreferences(key: string, value: boolean) {
    if (!user) return

    const newPreferences = { ...user.preferences, [key]: value }

    try {
      const { error } = await supabase
        .from('public_users')
        .update({ preferences: newPreferences })
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, preferences: newPreferences })
    } catch (error) {
      alert('Error updating preferences: ' + (error as Error).message)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: '👤' },
    { id: 'activity' as TabType, label: 'Activity', icon: '📊' },
    { id: 'services' as TabType, label: 'Services', icon: '🛠️' },
    { id: 'contacts' as TabType, label: 'Contacts', icon: '📧' },
    { id: 'settings' as TabType, label: 'Settings', icon: '⚙️' },
  ]

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-500/20 text-gray-400 border-gray-500/30'

    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'read':
      case 'reviewing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'replied':
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'closed':
      case 'declined':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'completed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white'>
      {/* Header */}
      <header className='border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <Link
              href='/'
              className='flex items-center gap-2 text-xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity'
            >
              <span className='text-2xl'>←</span>
              <span>Back to Home</span>
            </Link>
            <button
              onClick={handleSignOut}
              className='px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all text-red-400 text-sm font-medium'
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='mb-8 bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8'>
          <div className='flex items-center gap-6'>
            <div className='w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-2xl'>
              {user.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold mb-2'>{user.full_name}</h1>
              <p className='text-gray-400 mb-1'>{user.email}</p>
              <div className='flex items-center gap-3'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.email_verified
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {user.email_verified ? '✓ Verified' : '⚠ Not Verified'}
                </span>
                <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize'>
                  {user.user_role}
                </span>
                {user.is_active && (
                  <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400'>
                    ● Active
                  </span>
                )}
              </div>
            </div>
            <div className='text-right text-sm text-gray-400'>
              <p>Member since</p>
              <p className='text-white font-medium'>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mb-6 flex gap-2 overflow-x-auto pb-2'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6'>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>Profile Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className='px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all text-blue-400 text-sm font-medium'
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      value={editForm.full_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, full_name: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                      placeholder='Optional'
                    />
                  </div>
                  <div className='flex gap-3'>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className='px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium disabled:opacity-50'
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false)
                        setEditForm({
                          full_name: user.full_name || '',
                          phone: user.phone || '',
                        })
                      }}
                      className='px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all font-medium'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-700'>
                    <p className='text-sm text-gray-400 mb-1'>Email</p>
                    <p className='text-white font-medium'>{user.email}</p>
                  </div>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-700'>
                    <p className='text-sm text-gray-400 mb-1'>Phone</p>
                    <p className='text-white font-medium'>
                      {user.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-700'>
                    <p className='text-sm text-gray-400 mb-1'>Account Status</p>
                    <p className='text-white font-medium'>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-900/50 rounded-lg border border-gray-700'>
                    <p className='text-sm text-gray-400 mb-1'>Last Login</p>
                    <p className='text-white font-medium'>
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h2 className='text-2xl font-bold mb-6'>Recent Activity</h2>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='p-6 bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl'>
                    <div className='text-3xl mb-2'>📧</div>
                    <div className='text-3xl font-bold mb-1'>
                      {inquiries.length}
                    </div>
                    <div className='text-gray-400 text-sm'>
                      Contact Inquiries
                    </div>
                  </div>
                  <div className='p-6 bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl'>
                    <div className='text-3xl mb-2'>🛠️</div>
                    <div className='text-3xl font-bold mb-1'>
                      {services.length}
                    </div>
                    <div className='text-gray-400 text-sm'>
                      Service Requests
                    </div>
                  </div>
                  <div className='p-6 bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl'>
                    <div className='text-3xl mb-2'>✓</div>
                    <div className='text-3xl font-bold mb-1'>
                      {services.filter((s) => s.status === 'completed').length}
                    </div>
                    <div className='text-gray-400 text-sm'>Completed</div>
                  </div>
                </div>

                <div className='mt-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Account Timeline
                  </h3>
                  <div className='space-y-3 text-sm'>
                    {user.created_at && (
                      <div className='flex items-center gap-3 text-gray-400'>
                        <div className='w-2 h-2 rounded-full bg-green-500'></div>
                        <span>
                          Account created{' '}
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {user.email_verified && (
                      <div className='flex items-center gap-3 text-gray-400'>
                        <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                        <span>Email verified</span>
                      </div>
                    )}
                    {user.last_login_at && (
                      <div className='flex items-center gap-3 text-gray-400'>
                        <div className='w-2 h-2 rounded-full bg-purple-500'></div>
                        <span>
                          Last login{' '}
                          {new Date(user.last_login_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>Service Requests</h2>
                <Link
                  href='/services'
                  className='px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all text-blue-400 text-sm font-medium'
                >
                  + New Request
                </Link>
              </div>
              {services.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>🛠️</div>
                  <p className='text-gray-400 mb-4'>No service requests yet</p>
                  <Link
                    href='/services'
                    className='inline-block px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium'
                  >
                    Request a Service
                  </Link>
                </div>
              ) : (
                <div className='space-y-4'>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className='p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <h3 className='text-lg font-semibold'>
                          {service.project_title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            service.status || 'pending',
                          )}`}
                        >
                          {service.status || 'pending'}
                        </span>
                      </div>
                      <p className='text-gray-400 text-sm mb-3 line-clamp-2'>
                        {service.description}
                      </p>
                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span className='capitalize'>
                          {service.service_type.replace('_', ' ')}
                        </span>
                        <span>
                          {service.created_at
                            ? new Date(service.created_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>Contact Inquiries</h2>
                <Link
                  href='/contact'
                  className='px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all text-blue-400 text-sm font-medium'
                >
                  + New Inquiry
                </Link>
              </div>
              {inquiries.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>📧</div>
                  <p className='text-gray-400 mb-4'>No contact inquiries yet</p>
                  <Link
                    href='/contact'
                    className='inline-block px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium'
                  >
                    Contact Us
                  </Link>
                </div>
              ) : (
                <div className='space-y-4'>
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className='p-6 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <h3 className='text-lg font-semibold'>
                          {inquiry.subject}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            inquiry.status || 'new',
                          )}`}
                        >
                          {inquiry.status || 'pending'}
                        </span>
                      </div>
                      <p className='text-gray-400 text-sm mb-3 line-clamp-2'>
                        {inquiry.message}
                      </p>
                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <span>
                          {inquiry.responded_at
                            ? `Responded ${new Date(
                                inquiry.responded_at,
                              ).toLocaleDateString()}`
                            : 'Awaiting response'}
                        </span>
                        <span>
                          {inquiry.created_at
                            ? new Date(inquiry.created_at).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className='text-2xl font-bold mb-6'>Account Settings</h2>
              <div className='space-y-6'>
                <div className='p-6 bg-gray-900/50 rounded-xl border border-gray-700'>
                  <h3 className='text-lg font-semibold mb-4'>Notifications</h3>
                  <div className='space-y-4'>
                    <label className='flex items-center justify-between cursor-pointer'>
                      <div>
                        <div className='font-medium'>Push Notifications</div>
                        <div className='text-sm text-gray-400'>
                          Get notified about updates and responses
                        </div>
                      </div>
                      <input
                        type='checkbox'
                        checked={user.preferences.notifications}
                        onChange={(e) =>
                          handleUpdatePreferences(
                            'notifications',
                            e.target.checked,
                          )
                        }
                        className='w-5 h-5 rounded bg-gray-700 border-gray-600'
                      />
                    </label>
                    <label className='flex items-center justify-between cursor-pointer'>
                      <div>
                        <div className='font-medium'>Marketing Emails</div>
                        <div className='text-sm text-gray-400'>
                          Receive emails about new services and promotions
                        </div>
                      </div>
                      <input
                        type='checkbox'
                        checked={user.preferences.marketing_emails}
                        onChange={(e) =>
                          handleUpdatePreferences(
                            'marketing_emails',
                            e.target.checked,
                          )
                        }
                        className='w-5 h-5 rounded bg-gray-700 border-gray-600'
                      />
                    </label>
                    <label className='flex items-center justify-between cursor-pointer'>
                      <div>
                        <div className='font-medium'>Newsletter</div>
                        <div className='text-sm text-gray-400'>
                          Stay updated with our monthly newsletter
                        </div>
                      </div>
                      <input
                        type='checkbox'
                        checked={user.preferences.newsletter}
                        onChange={(e) =>
                          handleUpdatePreferences(
                            'newsletter',
                            e.target.checked,
                          )
                        }
                        className='w-5 h-5 rounded bg-gray-700 border-gray-600'
                      />
                    </label>
                  </div>
                </div>

                <div className='p-6 bg-red-500/5 rounded-xl border border-red-500/20'>
                  <h3 className='text-lg font-semibold mb-2 text-red-400'>
                    Danger Zone
                  </h3>
                  <p className='text-sm text-gray-400 mb-4'>
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button className='px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all text-red-400 text-sm font-medium'>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
