/**
 * Service-role Supabase client. Bypasses RLS — server routes only.
 *
 * `server-only` makes the build fail if this module is ever imported from a
 * client component, so the key can't end up in a browser bundle.
 */
import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let cached: SupabaseClient<Database> | null = null

export function createAdminClient(): SupabaseClient<Database> {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase admin client is not configured (missing URL or service-role key)')
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return cached
}
