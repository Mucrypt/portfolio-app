'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUpUser } from '@/lib/auth/user'

function SignupForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await signUpUser(email, password, fullName)
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/login?redirectTo=${redirectTo}`)
      }, 2000)
    } catch (err: any) {
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(err.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white p-4'>
        <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-xl shadow-2xl w-full max-w-md text-center'>
          <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-green-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold mb-2 text-green-400'>
            Account Created!
          </h2>
          <p className='text-gray-300 mb-4'>
            Please check your email to verify your account.
          </p>
          <p className='text-sm text-gray-400'>Redirecting to login page...</p>
        </div>
      </div>
    )
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
        <div className='text-center mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-purple-600 mb-4'>
            <svg
              className='w-8 h-8 text-white'
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
          </div>
          <h1 className='text-3xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
            Create Account
          </h1>
          <p className='text-gray-400 text-sm'>
            Join to access exclusive features
          </p>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='fullName'
              className='block text-sm font-medium mb-2 text-gray-300'
            >
              Full Name
            </label>
            <input
              type='text'
              id='fullName'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
              placeholder='John Doe'
              required
            />
          </div>

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
            <p className='text-xs text-gray-500 mt-1'>Minimum 6 characters</p>
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium mb-2 text-gray-300'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
              placeholder='••••••••'
              required
              minLength={6}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
          >
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className='mt-6 text-center text-sm'>
          <span className='text-gray-400'>Already have an account? </span>
          <Link
            href={`/login?redirectTo=${redirectTo}`}
            className='text-blue-400 hover:text-blue-300 font-semibold'
          >
            Sign In
          </Link>
        </div>

        <div className='mt-6 pt-6 border-t border-gray-700'>
          <p className='text-xs text-gray-500 text-center'>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black text-white'>
          Loading...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
