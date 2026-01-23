import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server-side function to check if the current user is authenticated and is the portfolio owner
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not the owner
 * Returns the authenticated user if they are the owner
 */
export async function requireAdmin() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Verify user owns a profile (is the portfolio owner)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, owner_user_id, full_name, email')
    .eq('owner_user_id', user.id)
    .single()

  if (profileError || !profile) {
    // User is authenticated but doesn't own the portfolio
    redirect('/')
  }

  return { user, profile }
}

/**
 * Server-side function to check if user is authenticated (doesn't verify ownership)
 * Returns the user or null if not authenticated
 */
export async function getAuthUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
