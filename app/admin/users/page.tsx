'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  AlertCircle,
  UserCheck,
  UserX,
  Shield,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react'

interface PublicUser {
  id: string
  auth_user_id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  user_role: string
  is_active: boolean
  email_verified: boolean
  created_at: string
  last_login_at: string | null
  preferences: {
    notifications: boolean
    marketing_emails: boolean
    newsletter: boolean
  }
}

interface UserStats {
  total: number
  active: number
  inactive: number
  verified: number
  unverified: number
  newToday: number
  newThisWeek: number
  newThisMonth: number
}

type FilterType = 'all' | 'active' | 'inactive' | 'verified' | 'unverified'
type SortField = 'created_at' | 'last_login_at' | 'email' | 'full_name'
type SortOrder = 'asc' | 'desc'

export default function UsersManagementPage() {
  const [users, setUsers] = useState<PublicUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<PublicUser[]>([])
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterAndSortUsers()
  }, [users, searchQuery, filterType, sortField, sortOrder])

  async function loadUsers() {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('public_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
      calculateStats(data || [])
    } catch (error: any) {
      console.error('Error loading users:', error)
      alert('Error loading users: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(userList: PublicUser[]) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    setStats({
      total: userList.length,
      active: userList.filter((u) => u.is_active).length,
      inactive: userList.filter((u) => !u.is_active).length,
      verified: userList.filter((u) => u.email_verified).length,
      unverified: userList.filter((u) => !u.email_verified).length,
      newToday: userList.filter((u) => new Date(u.created_at) >= today).length,
      newThisWeek: userList.filter((u) => new Date(u.created_at) >= weekAgo)
        .length,
      newThisMonth: userList.filter((u) => new Date(u.created_at) >= monthAgo)
        .length,
    })
  }

  function filterAndSortUsers() {
    let filtered = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.full_name?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    switch (filterType) {
      case 'active':
        filtered = filtered.filter((u) => u.is_active)
        break
      case 'inactive':
        filtered = filtered.filter((u) => !u.is_active)
        break
      case 'verified':
        filtered = filtered.filter((u) => u.email_verified)
        break
      case 'unverified':
        filtered = filtered.filter((u) => !u.email_verified)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'created_at' || sortField === 'last_login_at') {
        aVal = aVal ? new Date(aVal).getTime() : 0
        bVal = bVal ? new Date(bVal).getTime() : 0
      } else {
        aVal = aVal?.toString().toLowerCase() || ''
        bVal = bVal?.toString().toLowerCase() || ''
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredUsers(filtered)
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('public_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_active: !currentStatus } : u,
        ),
      )

      alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (error: any) {
      alert('Error updating user status: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function verifyUserEmail(userId: string) {
    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('public_users')
        .update({ email_verified: true })
        .eq('id', userId)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, email_verified: true } : u)),
      )

      alert('User email verified successfully')
    } catch (error: any) {
      alert('Error verifying email: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function deleteUser(userId: string) {
    if (
      !confirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
      )
    ) {
      return
    }

    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('public_users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setShowUserModal(false)
      alert('User deleted successfully')
    } catch (error: any) {
      alert('Error deleting user: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  function toggleUserSelection(userId: string) {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  function selectAllUsers() {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)))
    }
  }

  async function bulkActivateUsers() {
    if (selectedUsers.size === 0) return

    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('public_users')
        .update({ is_active: true })
        .in('id', Array.from(selectedUsers))

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.has(u.id) ? { ...u, is_active: true } : u,
        ),
      )

      setSelectedUsers(new Set())
      alert(`${selectedUsers.size} users activated successfully`)
    } catch (error: any) {
      alert('Error activating users: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function bulkDeactivateUsers() {
    if (selectedUsers.size === 0) return

    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('public_users')
        .update({ is_active: false })
        .in('id', Array.from(selectedUsers))

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.has(u.id) ? { ...u, is_active: false } : u,
        ),
      )

      setSelectedUsers(new Set())
      alert(`${selectedUsers.size} users deactivated successfully`)
    } catch (error: any) {
      alert('Error deactivating users: ' + error.message)
    } finally {
      setActionLoading(false)
    }
  }

  function exportToCSV() {
    const headers = [
      'ID',
      'Email',
      'Full Name',
      'Phone',
      'Role',
      'Status',
      'Email Verified',
      'Created At',
      'Last Login',
    ]

    const rows = filteredUsers.map((user) => [
      user.id,
      user.email,
      user.full_name,
      user.phone || '',
      user.user_role,
      user.is_active ? 'Active' : 'Inactive',
      user.email_verified ? 'Yes' : 'No',
      new Date(user.created_at).toLocaleString(),
      user.last_login_at
        ? new Date(user.last_login_at).toLocaleString()
        : 'Never',
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-zinc-400'>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-zinc-900 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3'>
              <Users className='w-8 h-8 text-blue-600' />
              User Management
            </h1>
            <p className='text-gray-600 dark:text-zinc-400 mt-1'>
              Manage and monitor all public users
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium'
          >
            <Download className='w-4 h-4' />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-zinc-400'>
                  Total Users
                </p>
                <p className='text-3xl font-bold text-gray-900 dark:text-white mt-1'>
                  {stats.total}
                </p>
              </div>
              <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <Users className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-zinc-500 mt-3'>
              {stats.newThisMonth} new this month
            </p>
          </div>

          <div className='bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-zinc-400'>
                  Active Users
                </p>
                <p className='text-3xl font-bold text-green-600 dark:text-green-400 mt-1'>
                  {stats.active}
                </p>
              </div>
              <div className='p-3 bg-green-100 dark:bg-green-900/30 rounded-lg'>
                <UserCheck className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-zinc-500 mt-3'>
              {stats.inactive} inactive
            </p>
          </div>

          <div className='bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-zinc-400'>
                  Verified
                </p>
                <p className='text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1'>
                  {stats.verified}
                </p>
              </div>
              <div className='p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
                <Shield className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-zinc-500 mt-3'>
              {stats.unverified} pending verification
            </p>
          </div>

          <div className='bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 dark:text-zinc-400'>
                  New This Week
                </p>
                <p className='text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1'>
                  {stats.newThisWeek}
                </p>
              </div>
              <div className='p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-orange-600 dark:text-orange-400' />
              </div>
            </div>
            <p className='text-xs text-gray-500 dark:text-zinc-500 mt-3'>
              {stats.newToday} today
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search by email, name, or phone...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
              />
            </div>

            {/* Filter */}
            <div className='flex gap-2'>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className='px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
              >
                <option value='all'>All Users</option>
                <option value='active'>Active Only</option>
                <option value='inactive'>Inactive Only</option>
                <option value='verified'>Verified Only</option>
                <option value='unverified'>Unverified Only</option>
              </select>

              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortField(field as SortField)
                  setSortOrder(order as SortOrder)
                }}
                className='px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
              >
                <option value='created_at-desc'>Newest First</option>
                <option value='created_at-asc'>Oldest First</option>
                <option value='last_login_at-desc'>Last Login (Recent)</option>
                <option value='last_login_at-asc'>Last Login (Oldest)</option>
                <option value='email-asc'>Email (A-Z)</option>
                <option value='email-desc'>Email (Z-A)</option>
                <option value='full_name-asc'>Name (A-Z)</option>
                <option value='full_name-desc'>Name (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between'>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''}{' '}
                selected
              </p>
              <div className='flex gap-2'>
                <button
                  onClick={bulkActivateUsers}
                  disabled={actionLoading}
                  className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors'
                >
                  Activate Selected
                </button>
                <button
                  onClick={bulkDeactivateUsers}
                  disabled={actionLoading}
                  className='px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors'
                >
                  Deactivate Selected
                </button>
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className='px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors'
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className='bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700'>
                <tr>
                  <th className='px-4 py-3 text-left'>
                    <input
                      type='checkbox'
                      checked={
                        selectedUsers.size === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={selectAllUsers}
                      className='w-4 h-4 rounded border-gray-300 dark:border-zinc-600'
                    />
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    Joined
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    Last Login
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-zinc-700'>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-4 py-12 text-center text-gray-500 dark:text-zinc-400'
                    >
                      <AlertCircle className='w-12 h-12 mx-auto mb-3 opacity-50' />
                      <p className='font-medium'>No users found</p>
                      <p className='text-sm mt-1'>
                        Try adjusting your search or filters
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className='hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors'
                    >
                      <td className='px-4 py-4'>
                        <input
                          type='checkbox'
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className='w-4 h-4 rounded border-gray-300 dark:border-zinc-600'
                        />
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold'>
                            {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className='font-medium text-gray-900 dark:text-white'>
                              {user.full_name}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-zinc-400'>
                              {user.user_role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-4'>
                        <p className='text-sm text-gray-900 dark:text-white'>
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className='text-sm text-gray-500 dark:text-zinc-400'>
                            {user.phone}
                          </p>
                        )}
                      </td>
                      <td className='px-4 py-4'>
                        <div className='flex flex-col gap-1'>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                              user.is_active
                                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                            }`}
                          >
                            {user.is_active ? (
                              <CheckCircle className='w-3 h-3' />
                            ) : (
                              <XCircle className='w-3 h-3' />
                            )}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {user.email_verified ? (
                            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'>
                              <Shield className='w-3 h-3' />
                              Verified
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'>
                              <AlertCircle className='w-3 h-3' />
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-zinc-400'>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className='px-4 py-4 text-sm text-gray-600 dark:text-zinc-400'>
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className='px-4 py-4 text-right'>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2'
                        >
                          <Eye className='w-4 h-4' />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-zinc-700 shadow-2xl'>
              {/* Modal Header */}
              <div className='p-6 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors'
                >
                  <XCircle className='w-6 h-6 text-gray-600 dark:text-zinc-400' />
                </button>
              </div>

              {/* Modal Body */}
              <div className='p-6 space-y-6'>
                {/* User Info */}
                <div className='flex items-center gap-4'>
                  <div className='w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl'>
                    {selectedUser.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {selectedUser.full_name}
                    </h4>
                    <p className='text-gray-600 dark:text-zinc-400'>
                      {selectedUser.email}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-zinc-500 capitalize'>
                      {selectedUser.user_role}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                    <p className='text-xs text-gray-500 dark:text-zinc-500 mb-1'>
                      Phone
                    </p>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {selectedUser.phone || 'Not provided'}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                    <p className='text-xs text-gray-500 dark:text-zinc-500 mb-1'>
                      Status
                    </p>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                    <p className='text-xs text-gray-500 dark:text-zinc-500 mb-1'>
                      Email Verified
                    </p>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {selectedUser.email_verified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                    <p className='text-xs text-gray-500 dark:text-zinc-500 mb-1'>
                      Member Since
                    </p>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg col-span-2'>
                    <p className='text-xs text-gray-500 dark:text-zinc-500 mb-1'>
                      Last Login
                    </p>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {selectedUser.last_login_at
                        ? new Date(selectedUser.last_login_at).toLocaleString()
                        : 'Never logged in'}
                    </p>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h5 className='font-semibold text-gray-900 dark:text-white mb-3'>
                    Preferences
                  </h5>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                      <span className='text-sm text-gray-700 dark:text-zinc-300'>
                        Notifications
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selectedUser.preferences.notifications
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {selectedUser.preferences.notifications ? 'On' : 'Off'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                      <span className='text-sm text-gray-700 dark:text-zinc-300'>
                        Marketing Emails
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selectedUser.preferences.marketing_emails
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {selectedUser.preferences.marketing_emails
                          ? 'On'
                          : 'Off'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg'>
                      <span className='text-sm text-gray-700 dark:text-zinc-300'>
                        Newsletter
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selectedUser.preferences.newsletter
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {selectedUser.preferences.newsletter ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Actions */}
              <div className='p-6 border-t border-gray-200 dark:border-zinc-700 flex flex-wrap gap-3'>
                {!selectedUser.email_verified && (
                  <button
                    onClick={() => verifyUserEmail(selectedUser.id)}
                    disabled={actionLoading}
                    className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50'
                  >
                    <Shield className='w-4 h-4' />
                    Verify Email
                  </button>
                )}
                <button
                  onClick={() =>
                    toggleUserStatus(selectedUser.id, selectedUser.is_active)
                  }
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    selectedUser.is_active
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {selectedUser.is_active ? (
                    <>
                      <Ban className='w-4 h-4' />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <CheckCircle className='w-4 h-4' />
                      Activate User
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteUser(selectedUser.id)}
                  disabled={actionLoading}
                  className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50'
                >
                  <XCircle className='w-4 h-4' />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
