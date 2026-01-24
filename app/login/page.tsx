'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Check if user is admin (portfolio owner)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, owner_user_id')
          .eq('owner_user_id', data.user?.id)
          .single()

        // If admin, redirect to admin panel
        if (profile) {
          //console.log('Admin logged in:', data.user?.id)
          router.push('/admin/dashboard')
          return
        }

        // Otherwise, check if public user
        const { data: publicUser, error: publicUserError } = await supabase
          .from('public_users')
          .select('id')
          .eq('auth_user_id', data.user?.id)
          .single()

        if (publicUser) {
          //console.log('Public user logged in:', data.user?.id)
          // Only redirect to admin if explicitly requested, otherwise go to about page or intended destination
          const destination = redirectTo.startsWith('/admin')
            ? '/about'
            : redirectTo === '/'
              ? '/about'
              : redirectTo
          router.push(destination)
          return
        }

        // User exists but no profile found
        console.error('Public user lookup failed:', publicUserError)
        await supabase.auth.signOut()
        setError(
          'Account setup incomplete. This might be a database issue. Please contact support or try signing up again.',
        )
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        //console.log('New user created with ID:', data.user?.id)

        if (data.user?.identities?.length === 0) {
          setError('An account with this email already exists.')
        } else {
          alert(
            'Account created! Please check your email for verification. Then create your profile in the admin panel.',
          )
          setMode('signin')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-4'>
      {/* Back to Home Link */}
      <Link
        href='/'
        className='fixed top-4 left-4 z-50 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all text-sm flex items-center gap-2'
      >
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          />
        </svg>
        Back to Home
      </Link>

      <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md'>
        <h1 className='text-3xl font-bold mb-2 text-center bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
          Welcome Back
        </h1>
        <p className='text-gray-400 text-center mb-6 text-sm'>
          Sign in to access your account
        </p>

        {error && (
          <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium mb-2 text-gray-300'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
              placeholder='your@email.com'
              required
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium mb-2 text-gray-300'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
              placeholder='••••••••'
              required
              minLength={6}
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg'
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className='mt-6 pt-6 border-t border-gray-700'>
          <p className='text-center text-xs text-gray-500 mb-3'>
            Admin access only • Portfolio Owner
          </p>
          <div className='text-center text-sm'>
            <span className='text-gray-400'>
              Looking to create an account?{' '}
            </span>
            <Link
              href={`/signup?redirectTo=${redirectTo}`}
              className='text-blue-400 hover:text-blue-300 transition-colors font-semibold'
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto'></div>
            <p className='mt-4 text-gray-400'>Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
