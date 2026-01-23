import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'user'

export interface UserProfile {
  id: string
  owner_user_id: string
  full_name: string
  email: string | null
  role: UserRole
  avatar_url: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<User | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Check if user is admin (owns the portfolio)
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, owner_user_id')
    .eq('owner_user_id', user.id)
    .single()

  return !!profile
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Check if user is admin (portfolio owner)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('owner_user_id', user.id)
    .single()

  if (profile) return 'admin'

  // Check if user exists in public_users table
  const { data: publicUser } = await supabase
    .from('public_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (publicUser) return 'user'

  return null
}

/**
 * Sign up a new public user
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'user',
      },
    },
  })

  if (error) throw error

  // The database trigger will automatically create the public_users record
  // No need to manually insert here

  return data
}

/**
 * Sign in user
 */
export async function signInUser(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Try to get admin profile first
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('owner_user_id', user.id)
    .single()

  if (adminProfile) {
    return {
      ...adminProfile,
      role: 'admin' as UserRole,
    }
  }

  // Get public user profile
  const { data: publicProfile } = await supabase
    .from('public_users')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (publicProfile) {
    return {
      id: publicProfile.id,
      owner_user_id: publicProfile.auth_user_id,
      full_name: publicProfile.full_name,
      email: publicProfile.email,
      role: 'user' as UserRole,
      avatar_url: publicProfile.avatar_url,
      created_at: publicProfile.created_at,
      updated_at: publicProfile.updated_at,
    }
  }

  return null
}
