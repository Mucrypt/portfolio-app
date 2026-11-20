/**
 * Site user ↔ provider customer. A customer is created only by the server, for a signed-in user
 * whose email is verified, with that email. The webhook resolves every payment to a user through
 * this mapping, never through an email or user id typed into a form.
 */
import 'server-only'
import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { PROVIDER, stripe } from './stripe'

export class CommerceUserError extends Error {}

/** The user may buy only with a verified email. */
export function assertVerified(user: User): string {
  if (!user.email || !user.email_confirmed_at) {
    throw new CommerceUserError('Please verify your email address before buying.')
  }
  return user.email.toLowerCase()
}

export async function getOrCreateCustomer(user: User): Promise<string> {
  const email = assertVerified(user)
  const db = createAdminClient()

  const { data: existing, error } = await db
    .from('commerce_customers')
    .select('provider_customer_id')
    .eq('user_id', user.id)
    .eq('provider', PROVIDER)
    .maybeSingle()
  if (error) throw new Error(`customer lookup failed: ${error.message}`)
  if (existing) return existing.provider_customer_id

  // Idempotency key: two quick clicks create one customer, not two.
  const customer = await stripe().customers.create(
    { email, metadata: { user_id: user.id } },
    { idempotencyKey: `customer:${user.id}` },
  )

  const { error: insertError } = await db
    .from('commerce_customers')
    .upsert(
      { user_id: user.id, provider: PROVIDER, provider_customer_id: customer.id },
      { onConflict: 'user_id,provider', ignoreDuplicates: true },
    )
  if (insertError) throw new Error(`customer save failed: ${insertError.message}`)

  // If a concurrent request won the race, use the stored id.
  const { data: stored } = await db
    .from('commerce_customers')
    .select('provider_customer_id')
    .eq('user_id', user.id)
    .eq('provider', PROVIDER)
    .single()
  return stored?.provider_customer_id ?? customer.id
}

/** The site user for a provider customer, or null if this customer wasn't created by the site. */
export async function userForCustomer(customerId: string | null | undefined): Promise<string | null> {
  if (!customerId) return null
  const { data } = await createAdminClient()
    .from('commerce_customers')
    .select('user_id')
    .eq('provider', PROVIDER)
    .eq('provider_customer_id', customerId)
    .maybeSingle()
  return data?.user_id ?? null
}
