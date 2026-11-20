/**
 * What the current visitor may access. Reads through the user's own session, so RLS limits it
 * to their own rows.
 */
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export type Viewer = {
  userId: string | null
  emailVerified: boolean
  isMember: boolean
  ownedProductIds: Set<string>
}

export async function getViewer(): Promise<Viewer> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { userId: null, emailVerified: false, isMember: false, ownedProductIds: new Set() }

  const now = new Date().toISOString()
  const [{ data: member }, { data: owned }] = await Promise.all([
    supabase.rpc('i_am_member'),
    supabase
      .from('entitlements')
      .select('product_id')
      .eq('user_id', user.id) // the owner can read everyone's rows; only count the viewer's own
      .eq('kind', 'product')
      .is('revoked_at', null)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gt.${now}`),
  ])

  return {
    userId: user.id,
    emailVerified: !!user.email_confirmed_at,
    isMember: member === true,
    ownedProductIds: new Set((owned ?? []).map((e) => e.product_id).filter((id): id is string => !!id)),
  }
}
