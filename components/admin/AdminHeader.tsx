'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, ExternalLink, Bell, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [notifications] = useState(3)
  const [showMobileActions, setShowMobileActions] = useState(false)

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
    <header className='shadow-sm border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-30 backdrop-blur-lg bg-white/80 dark:bg-zinc-800/80'>
      <div className='flex items-center justify-between px-4 md:px-6 py-3 md:py-4'>
        {/* Left: Mobile Menu + Title */}
        <div className='flex items-center gap-3 flex-1 min-w-0'>
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors touch-manipulation'
            aria-label='Toggle menu'
          >
            <Menu className='w-5 h-5 text-gray-700 dark:text-zinc-300' />
          </button>

          {/* Page Title */}
          <div className='min-w-0 flex-1'>
            <h1 className='text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate'>
              {getPageTitle()}
            </h1>
            <div className='hidden sm:flex items-center gap-2 mt-1'>
              <Link
                href='/admin'
                className='text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors'
              >
                Admin
              </Link>
              <span className='text-xs text-gray-400'>/</span>
              <span className='text-xs text-gray-600 dark:text-zinc-400 font-medium truncate'>
                {getPageTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className='flex items-center gap-2 md:gap-3'>
          {/* Desktop Actions */}
          <div className='hidden md:flex items-center gap-3'>
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

          {/* Mobile Actions Toggle */}
          <button
            onClick={() => setShowMobileActions(!showMobileActions)}
            className='md:hidden relative p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors touch-manipulation'
            aria-label='More options'
          >
            {showMobileActions ? (
              <X className='w-5 h-5' />
            ) : (
              <>
                <Bell className='w-5 h-5' />
                {notifications > 0 && (
                  <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white'>
                    {notifications}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Actions Dropdown */}
      {showMobileActions && (
        <div className='md:hidden border-t border-gray-200 dark:border-zinc-700 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200'>
          {/* Search */}
          <button className='w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors touch-manipulation'>
            <Search className='w-5 h-5' />
            <span>Search</span>
          </button>

          {/* Notifications */}
          <button className='w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors touch-manipulation'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5' />
              <span>Notifications</span>
            </div>
            {notifications > 0 && (
              <span className='flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white'>
                {notifications}
              </span>
            )}
          </button>

          {/* View Site */}
          <Link
            href='/'
            target='_blank'
            className='w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-colors touch-manipulation'
            onClick={() => setShowMobileActions(false)}
          >
            <ExternalLink className='w-5 h-5' />
            <span>View Site</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              setShowMobileActions(false)
              handleLogout()
            }}
            className='w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-lg touch-manipulation'
          >
            <LogOut className='w-5 h-5' />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  )
}
