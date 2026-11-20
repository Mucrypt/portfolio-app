/**
 * POST /api/commerce/checkout — form post with `offer` (and optional `return_to`).
 * Signed-in, email-verified users only. Redirects to Stripe's hosted checkout.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commerceEnabled, offerByKey } from '@/lib/commerce/offers'
import { CommerceUserError, getOrCreateCustomer } from '@/lib/commerce/customers'
import { getViewer } from '@/lib/commerce/access'
import { managedPayments, stripe } from '@/lib/commerce/stripe'
import { IMMEDIATE_ACCESS_NOTICE } from '@/lib/legal'
import { safeReturnPath, sameOrigin, seeOther, siteOrigin } from '@/lib/commerce/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const site = siteOrigin(request)
  if (!commerceEnabled()) return seeOther(`${site}/membership`)
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })

  const form = await request.formData().catch(() => null)
  const returnTo = safeReturnPath(form?.get('return_to'), '/membership')
  const offer = offerByKey(String(form?.get('offer') ?? ''))
  if (!offer) return seeOther(`${site}${returnTo}`)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return seeOther(`${site}/login?redirectTo=${encodeURIComponent(returnTo)}`)

  // Don't sell what they already have.
  const viewer = await getViewer()
  if (offer.grants.kind === 'membership' && viewer.isMember) return seeOther(`${site}/account/billing`)
  if (offer.grants.kind === 'product') {
    const { data: product } = await supabase
      .from('products')
      .select('id, status')
      .eq('slug', offer.grants.productSlug)
      .maybeSingle()
    if (!product || product.status !== 'available') return seeOther(`${site}${returnTo}`)
    if (viewer.ownedProductIds.has(product.id)) return seeOther(`${site}/account/billing`)
  }

  let customer: string
  try {
    customer = await getOrCreateCustomer(user)
  } catch (err) {
    if (err instanceof CommerceUserError) return seeOther(`${site}/account/billing?error=verify_email`)
    console.error('[checkout] customer', err instanceof Error ? err.message : err)
    return seeOther(`${site}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=error`)
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: offer.mode,
      line_items: [{ price: offer.priceId, quantity: 1 }],
      customer,
      client_reference_id: user.id,
      metadata: { user_id: user.id, offer: offer.key },
      ...(offer.mode === 'subscription' ? { subscription_data: { metadata: { user_id: user.id, offer: offer.key } } } : {}),
      // With Managed Payments, Stripe is the seller and shows its own consumer terms; it rejects
      // custom_text. Without it (sandbox fallback), show our immediate-access notice ourselves.
      ...(managedPayments()
        ? { managed_payments: { enabled: true } }
        : { custom_text: { submit: { message: IMMEDIATE_ACCESS_NOTICE } } }),
      success_url: `${site}/account/billing?checkout=success`,
      cancel_url: `${site}${returnTo}`,
    })
    if (!session.url) throw new Error('no checkout url')
    return seeOther(session.url)
  } catch (err) {
    console.error('[checkout] session', err instanceof Error ? err.message : err)
    return seeOther(`${site}${returnTo}${returnTo.includes('?') ? '&' : '?'}checkout=error`)
  }
}
