'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { signOut } from '@/lib/auth/user'
import UserDropdown from './UserDropdown'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },

  { href: '/projects', label: 'Projects' },
  { href: '/shop', label: 'Shop' },
  { href: '/courses', label: 'Courses' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAdmin, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-lg border-b border-zinc-200 dark:border-zinc-800'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 md:px-6'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <div className='relative'>
              <div className='absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity' />
              <div className='relative h-12 w-12 rounded-xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center'>
                <span className='text-2xl font-black text-white'>R</span>
              </div>
            </div>
            <div className='hidden sm:block'>
              <div className='text-lg font-black text-zinc-900 dark:text-white leading-tight'>
                Romeo Mukulah
              </div>
              <div className='text-xs font-bold text-zinc-500 dark:text-zinc-400'>
                Full-Stack Developer
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-1'>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA Buttons */}
          <div className='hidden lg:flex items-center gap-3'>
            {!loading && (
              <UserDropdown
                user={user}
                isAdmin={isAdmin}
                onSignOut={handleSignOut}
              />
            )}
            <Link
              href='/contact'
              className='px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all'
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6 text-zinc-900 dark:text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='lg:hidden pb-6 animate-in fade-in slide-in-from-top-2 duration-300'>
            <nav className='flex flex-col gap-2'>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? 'bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href='/contact'
                onClick={() => setIsMobileMenuOpen(false)}
                className='mt-2 px-4 py-3 rounded-xl font-bold text-center bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white'
              >
                Hire Me
              </Link>

              {/* Mobile User Menu */}
              {!loading && (
                <div className='mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800'>
                  <UserDropdown
                    user={user}
                    isAdmin={isAdmin}
                    onSignOut={handleSignOut}
                  />
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
