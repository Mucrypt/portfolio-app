'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface DropdownProps {
  user: User | null
  isAdmin: boolean
  onSignOut?: () => void
}

export default function UserDropdown({
  user,
  isAdmin,
  onSignOut,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!user) {
    // Not logged in - Show "Get Started" button with dropdown
    return (
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='px-5 py-2.5 rounded-xl font-bold text-sm bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2'
        >
          <span>Get Started</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>

        {isOpen && (
          <div className='absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50'>
            <div className='p-2'>
              <Link
                href='/signup'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-4 py-3.5 rounded-lg bg-linear-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:text-white transition-all group touch-manipulation'
              >
                <svg
                  className='w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
                <div>
                  <div className='font-bold text-sm text-zinc-900 dark:text-white group-hover:text-white'>
                    Sign Up
                  </div>
                  <div className='text-xs text-zinc-500 group-hover:text-white/80'>
                    Create new account
                  </div>
                </div>
              </Link>

              <Link
                href='/login'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group touch-manipulation'
              >
                <svg
                  className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                <div>
                  <div className='font-bold text-sm text-zinc-900 dark:text-white'>
                    Login
                  </div>
                  <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Access your account
                  </div>
                </div>
              </Link>
            </div>

            <div className='border-t border-zinc-200 dark:border-zinc-800 p-2'>
              <Link
                href='/contact'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all touch-manipulation'
              >
                <svg
                  className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                  Need Help?
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Logged in - Show user menu
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U'
  const userName = user.email?.split('@')[0] || 'User'

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all touch-manipulation min-h-11'
      >
        <div className='w-8 h-8 rounded-full bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900'>
          <span className='text-sm font-bold text-white'>{userInitial}</span>
        </div>
        <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 hidden sm:block'>
          {userName}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-600 dark:text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50'>
          {/* User Info Header */}
          <div className='px-4 py-3 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30'>
                <span className='text-lg font-bold text-white'>
                  {userInitial}
                </span>
              </div>
              <div>
                <div className='font-bold text-sm text-white'>{userName}</div>
                <div className='text-xs text-white/80 truncate max-w-45'>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Links */}
          {isAdmin && (
            <div className='p-2 border-b border-zinc-200 dark:border-zinc-800'>
              <Link
                href='/admin/dashboard'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group'
              >
                <svg
                  className='w-5 h-5 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
                <div>
                  <div className='text-sm font-bold text-zinc-900 dark:text-white'>
                    ⚡ Dashboard
                  </div>
                  <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Admin panel
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Main Menu */}
          <div className='p-2'>
            <Link
              href='/account'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all touch-manipulation'
            >
              <svg
                className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <div>
                <div className='text-sm font-semibold text-zinc-900 dark:text-white'>
                  My Account
                </div>
                <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                  Profile & settings
                </div>
              </div>
            </Link>

            <Link
              href='/courses'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all touch-manipulation'
            >
              <svg
                className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                My Courses
              </span>
            </Link>

            <Link
              href='/shop'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all touch-manipulation'
            >
              <svg
                className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
              <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                My Orders
              </span>
            </Link>
          </div>

          {/* Bottom Actions */}
          <div className='border-t border-zinc-200 dark:border-zinc-800 p-2'>
            <Link
              href='/contact'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all touch-manipulation'
            >
              <svg
                className='w-5 h-5 text-zinc-600 dark:text-zinc-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
              <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                Help & Support
              </span>
            </Link>

            {onSignOut && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  onSignOut()
                }}
                className='w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group touch-manipulation'
              >
                <svg
                  className='w-5 h-5 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
                <span className='text-sm font-semibold text-red-600 dark:text-red-400'>
                  Sign Out
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
