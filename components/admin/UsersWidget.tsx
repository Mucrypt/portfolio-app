'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react'

interface UserStats {
  total: number
  active: number
  inactive: number
  verified: number
  unverified: number
  newThisWeek: number
  newThisMonth: number
}

export default function UsersWidget() {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    newThisWeek: 0,
    newThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  const supabase = createClient()

  useEffect(() => {
    loadUserStats()
  }, [])

  async function loadUserStats() {
    try {
      const { data: users, error } = await supabase
        .from('public_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      setStats({
        total: users.length,
        active: users.filter((u) => u.is_active).length,
        inactive: users.filter((u) => !u.is_active).length,
        verified: users.filter((u) => u.email_verified).length,
        unverified: users.filter((u) => !u.email_verified).length,
        newThisWeek: users.filter((u) => new Date(u.created_at) >= weekAgo)
          .length,
        newThisMonth: users.filter((u) => new Date(u.created_at) >= monthAgo)
          .length,
      })

      setRecentUsers(users.slice(0, 5))
    } catch (error) {
      console.error('Error loading user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/3'></div>
          <div className='space-y-3'>
            <div className='h-4 bg-gray-200 dark:bg-zinc-700 rounded'></div>
            <div className='h-4 bg-gray-200 dark:bg-zinc-700 rounded'></div>
            <div className='h-4 bg-gray-200 dark:bg-zinc-700 rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-zinc-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-600 rounded-lg'>
              <Users className='w-6 h-6 text-white' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                User Management
              </h3>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                Public user statistics
              </p>
            </div>
          </div>
          <Link
            href='/admin/users'
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'
          >
            Manage Users
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='p-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
          <div className='flex items-center gap-2 mb-2'>
            <Users className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            <p className='text-xs text-blue-600 dark:text-blue-400 font-medium'>
              Total Users
            </p>
          </div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.total}
          </p>
        </div>

        <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
          <div className='flex items-center gap-2 mb-2'>
            <UserCheck className='w-5 h-5 text-green-600 dark:text-green-400' />
            <p className='text-xs text-green-600 dark:text-green-400 font-medium'>
              Active
            </p>
          </div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.active}
          </p>
        </div>

        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
          <div className='flex items-center gap-2 mb-2'>
            <Shield className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            <p className='text-xs text-purple-600 dark:text-purple-400 font-medium'>
              Verified
            </p>
          </div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.verified}
          </p>
        </div>

        <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800'>
          <div className='flex items-center gap-2 mb-2'>
            <TrendingUp className='w-5 h-5 text-orange-600 dark:text-orange-400' />
            <p className='text-xs text-orange-600 dark:text-orange-400 font-medium'>
              New (Week)
            </p>
          </div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {stats.newThisWeek}
          </p>
        </div>
      </div>

      {/* Recent Users */}
      <div className='p-6 border-t border-gray-200 dark:border-zinc-700'>
        <h4 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>
          Recent Sign-ups
        </h4>
        <div className='space-y-3'>
          {recentUsers.length === 0 ? (
            <p className='text-sm text-gray-500 dark:text-zinc-400 text-center py-4'>
              No users yet
            </p>
          ) : (
            recentUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold'>
                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {user.full_name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-zinc-400'>
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-500 dark:text-zinc-400'>
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <div className='flex items-center gap-1 mt-1'>
                    {user.is_active && (
                      <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
                    )}
                    {user.email_verified && (
                      <Shield className='w-3 h-3 text-blue-600 dark:text-blue-400' />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className='p-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Activity className='w-4 h-4 text-gray-500 dark:text-zinc-400' />
              <span className='text-gray-600 dark:text-zinc-400'>
                {stats.newThisMonth} new this month
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <UserX className='w-4 h-4 text-gray-500 dark:text-zinc-400' />
              <span className='text-gray-600 dark:text-zinc-400'>
                {stats.inactive} inactive
              </span>
            </div>
          </div>
          <Link
            href='/admin/users'
            className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  )
}
