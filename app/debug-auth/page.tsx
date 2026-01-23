'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface DebugInfo {
  authUser: any
  publicUser: any
  profile: any
  error: string | null
}

export default function AuthDebugPage() {
  const [info, setInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const supabase = createClient()
    const result: DebugInfo = {
      authUser: null,
      publicUser: null,
      profile: null,
      error: null,
    }

    try {
      // Get auth user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      result.authUser = user
        ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            email_confirmed_at: user.email_confirmed_at,
          }
        : null

      if (authError) {
        result.error = `Auth error: ${authError.message}`
      }

      if (user) {
        // Try to get public_users record
        const { data: publicUser, error: publicError } = await supabase
          .from('public_users')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        result.publicUser = publicUser
        if (publicError) {
          result.error =
            (result.error || '') +
            ` | Public user error: ${publicError.message} (${publicError.code})`
        }

        // Try to get profile (admin check)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('owner_user_id', user.id)
          .single()

        result.profile = profile
        if (profileError && profileError.code !== 'PGRST116') {
          result.error =
            (result.error || '') + ` | Profile error: ${profileError.message}`
        }
      }
    } catch (err: any) {
      result.error = `Unexpected error: ${err.message}`
    }

    setInfo(result)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Authentication Debug Info</h1>

        {/* Error Display */}
        {info?.error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg'>
            <h3 className='font-semibold text-red-400 mb-2'>
              Errors Detected:
            </h3>
            <p className='text-red-300 text-sm'>{info.error}</p>
          </div>
        )}

        {/* Auth User */}
        <div className='mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-blue-400'>
            Auth User (auth.users)
          </h2>
          {info?.authUser ? (
            <pre className='bg-gray-900 p-4 rounded overflow-x-auto text-xs'>
              {JSON.stringify(info.authUser, null, 2)}
            </pre>
          ) : (
            <p className='text-gray-400'>Not authenticated</p>
          )}
        </div>

        {/* Public User */}
        <div className='mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-green-400'>
            Public User (public_users)
          </h2>
          {info?.publicUser ? (
            <pre className='bg-gray-900 p-4 rounded overflow-x-auto text-xs'>
              {JSON.stringify(info.publicUser, null, 2)}
            </pre>
          ) : (
            <p className='text-gray-400'>
              {info?.authUser
                ? 'No public_users record found (RLS might be blocking)'
                : 'Not applicable - not authenticated'}
            </p>
          )}
        </div>

        {/* Admin Profile */}
        <div className='mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-purple-400'>
            Admin Profile (profiles)
          </h2>
          {info?.profile ? (
            <pre className='bg-gray-900 p-4 rounded overflow-x-auto text-xs'>
              {JSON.stringify(info.profile, null, 2)}
            </pre>
          ) : (
            <p className='text-gray-400'>
              {info?.authUser
                ? 'Not an admin user'
                : 'Not applicable - not authenticated'}
            </p>
          )}
        </div>

        {/* Status Summary */}
        <div className='p-6 bg-gray-800 rounded-lg border border-gray-700'>
          <h2 className='text-xl font-semibold mb-4 text-yellow-400'>
            Status Summary
          </h2>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-center gap-2'>
              <span
                className={info?.authUser ? 'text-green-500' : 'text-red-500'}
              >
                {info?.authUser ? '✓' : '✗'}
              </span>
              <span>Authenticated in Supabase Auth</span>
            </li>
            <li className='flex items-center gap-2'>
              <span
                className={info?.publicUser ? 'text-green-500' : 'text-red-500'}
              >
                {info?.publicUser ? '✓' : '✗'}
              </span>
              <span>Public user record exists</span>
            </li>
            <li className='flex items-center gap-2'>
              <span
                className={info?.profile ? 'text-green-500' : 'text-gray-500'}
              >
                {info?.profile ? '✓' : '—'}
              </span>
              <span>Admin profile (only for portfolio owner)</span>
            </li>
          </ul>

          {info?.authUser && !info?.publicUser && (
            <div className='mt-4 p-4 bg-yellow-500/10 border border-yellow-500 rounded'>
              <p className='text-yellow-400 text-sm'>
                <strong>⚠ Issue Detected:</strong> You are authenticated but
                your public_users record is missing or RLS is blocking access.
                Run the SQL fix script in Supabase to resolve this.
              </p>
            </div>
          )}
        </div>

        <div className='mt-8 flex gap-4'>
          <button
            onClick={checkAuth}
            className='px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
          >
            Refresh
          </button>
          <Link
            href='/'
            className='px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors'
          >
            Back to Home
          </Link>
          <Link
            href='/login'
            className='px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors'
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
