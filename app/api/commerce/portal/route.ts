/** POST /api/commerce/portal — open Stripe's billing portal (manage or cancel membership, invoices). */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PROVIDER, stripe } from '@/lib/commerce/stripe'
import { sameOrigin, seeOther, siteOrigin } from '@/lib/commerce/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const site = siteOrigin(request)
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return seeOther(`${site}/login?redirectTo=/account/billing`)

  const { data: customer } = await createAdminClient()
    .from('commerce_customers')
    .select('provider_customer_id')
    .eq('user_id', user.id)
    .eq('provider', PROVIDER)
    .maybeSingle()
  if (!customer) return seeOther(`${site}/account/billing`)

  try {
    const portal = await stripe().billingPortal.sessions.create({
      customer: customer.provider_customer_id,
      return_url: `${site}/account/billing`,
    })
    return seeOther(portal.url)
  } catch (err) {
    console.error('[portal]', err instanceof Error ? err.message : err)
    return seeOther(`${site}/account/billing?error=portal`)
  }
}
