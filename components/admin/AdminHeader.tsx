'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ExternalLink, Bell, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  // Initialize notifications count directly instead of in useEffect
  const [notifications] = useState(3)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    const page = segments[segments.length - 1] || 'dashboard'
    return page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')
  }

  return (
    <header className='shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-zinc-800/80'>
      <div className='flex items-center justify-between px-6 py-4'>
        {/* Left: Page Title & Breadcrumb */}
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {getPageTitle()}
          </h1>
          <div className='flex items-center gap-2 mt-1'>
            <Link
              href='/admin'
              className='text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors'
            >
              Admin
            </Link>
            <span className='text-xs text-gray-400'>/</span>
            <span className='text-xs text-gray-600 dark:text-zinc-400 font-medium'>
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className='flex items-center gap-3'>
          {/* Search Button */}
          <button
            className='p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors'
            title='Search'
          >
            <Search className='w-5 h-5' />
          </button>

          {/* Notifications */}
          <button
            className='relative p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors'
            title='Notifications'
          >
            <Bell className='w-5 h-5' />
            {notifications > 0 && (
              <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
                {notifications}
              </span>
            )}
          </button>

          {/* View Site */}
          <Link
            href='/'
            target='_blank'
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-colors'
          >
            <ExternalLink className='w-4 h-4' />
            <span>View Site</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-lg shadow-red-600/30 hover:shadow-xl'
          >
            <LogOut className='w-4 h-4' />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
