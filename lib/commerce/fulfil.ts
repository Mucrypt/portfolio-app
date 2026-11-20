/**
 * Turn verified Stripe events into purchases, subscriptions and entitlements.
 *
 * Rules:
 *  - The event only tells us *what* changed. Amounts, prices, status and customer are re-read
 *    from Stripe's API, never trusted from the payload.
 *  - The buyer is the site user mapped to the Stripe customer (lib/commerce/customers.ts).
 *  - Only price ids listed in lib/commerce/offers.ts grant anything.
 *  - Every write is an upsert keyed on provider ids, so replays and out-of-order events converge.
 */
import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { offerByPriceId } from './offers'
import { userForCustomer } from './customers'
import { PROVIDER, stripe, type Stripe } from './stripe'

/** Members keep access this long past the paid period while a renewal is retried. */
const GRACE_MS = 3 * 24 * 60 * 60 * 1000

/** Not an error worth retrying: recorded on the event and answered 200. */
export class Unfulfillable extends Error {}

function idOf(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null
  return typeof ref === 'string' ? ref : ref.id
}

function must<R extends { error: { message: string } | null; data: unknown }>(result: R, where: string): R['data'] {
  if (result.error) throw new Error(`${where}: ${result.error.message}`)
  return result.data
}

// --- one-off purchases ---------------------------------------------------------

async function fulfilCheckout(sessionId: string) {
  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })

  if (session.mode === 'subscription') {
    // Access comes from the subscription itself; sync it now in case its own event is late.
    const subId = idOf(session.subscription)
    if (subId) await syncSubscription(subId)
    return
  }
  if (session.mode !== 'payment') throw new Unfulfillable(`unexpected checkout mode ${session.mode}`)
  if (session.payment_status !== 'paid') return // async payment: wait for async_payment_succeeded

  const userId = await userForCustomer(idOf(session.customer))
  if (!userId) throw new Unfulfillable(`checkout ${session.id}: customer not created by the site`)
  if (session.client_reference_id && session.client_reference_id !== userId) {
    throw new Unfulfillable(`checkout ${session.id}: client_reference_id does not match the customer`)
  }

  const items = session.line_items?.data ?? []
  if (items.length !== 1) throw new Unfulfillable(`checkout ${session.id}: expected 1 line item, got ${items.length}`)
  const priceId = idOf(items[0].price)
  const offer = offerByPriceId(priceId)
  if (!offer || offer.grants.kind !== 'product') {
    throw new Unfulfillable(`checkout ${session.id}: price ${priceId} is not a product offer`)
  }

  const db = createAdminClient()
  const product = must(
    await db.from('products').select('id').eq('slug', offer.grants.productSlug).maybeSingle(),
    'product lookup',
  )
  if (!product) throw new Error(`product ${offer.grants.productSlug} missing`) // retry once the row exists

  // The order id is the PaymentIntent (refund events reference it); fall back to the session.
  const orderId = idOf(session.payment_intent) ?? session.id

  must(
    await db.from('purchases').upsert(
      {
        user_id: userId,
        product_id: product.id,
        provider: PROVIDER,
        provider_order_id: orderId,
        provider_price_id: priceId,
        amount_total: session.amount_total,
        currency: session.currency,
      },
      { onConflict: 'provider,provider_order_id', ignoreDuplicates: true },
    ),
    'purchase upsert',
  )
  must(
    await db.from('entitlements').upsert(
      {
        user_id: userId,
        kind: 'product',
        product_id: product.id,
        provider: PROVIDER,
        source: 'purchase',
        source_ref: orderId,
      },
      { onConflict: 'provider,source,source_ref', ignoreDuplicates: true },
    ),
    'purchase entitlement',
  )
}

async function fulfilRefund(chargeId: string) {
  const charge = await stripe().charges.retrieve(chargeId)
  const orderId = idOf(charge.payment_intent)
  if (!orderId) return
  // Only a full refund removes access; partial refunds are goodwill and keep it.
  if (!charge.refunded || charge.amount_refunded < charge.amount) return

  const db = createAdminClient()
  const purchase = must(
    await db
      .from('purchases')
      .update({ status: 'refunded' })
      .eq('provider', PROVIDER)
      .eq('provider_order_id', orderId)
      .select('id'),
    'purchase refund',
  )
  if (!purchase?.length) return // a subscription invoice; the subscription events handle access
  must(
    await db
      .from('entitlements')
      .update({ revoked_at: new Date().toISOString(), note: 'refunded' })
      .eq('provider', PROVIDER)
      .eq('source', 'purchase')
      .eq('source_ref', orderId)
      .is('revoked_at', null),
    'revoke refunded entitlement',
  )
}

// --- subscriptions ---------------------------------------------------------------

type Normalised = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'paused'

function normalise(status: Stripe.Subscription.Status): Normalised {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'paused':
      return 'paused'
    case 'incomplete':
      return 'incomplete'
    default:
      return 'canceled' // canceled, incomplete_expired
  }
}

export async function syncSubscription(subscriptionId: string) {
  const sub = await stripe().subscriptions.retrieve(subscriptionId)

  const customerId = idOf(sub.customer)
  const userId = await userForCustomer(customerId)
  if (!userId) throw new Unfulfillable(`subscription ${sub.id}: customer not created by the site`)

  const item = sub.items.data[0]
  const priceId = idOf(item?.price)
  const offer = offerByPriceId(priceId)
  if (!offer || offer.grants.kind !== 'membership') {
    throw new Unfulfillable(`subscription ${sub.id}: price ${priceId} is not a membership offer`)
  }

  const status = normalise(sub.status)
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : null

  const db = createAdminClient()
  must(
    await db.from('subscriptions').upsert(
      {
        user_id: userId,
        provider: PROVIDER,
        provider_subscription_id: sub.id,
        provider_customer_id: customerId,
        provider_price_id: priceId,
        plan: offer.plan ?? null,
        status,
        provider_status: sub.status,
        current_period_end: periodEnd?.toISOString() ?? null,
        cancel_at_period_end: sub.cancel_at_period_end,
      },
      { onConflict: 'provider,provider_subscription_id' },
    ),
    'subscription upsert',
  )

  // Access window: paid period + grace while active or retrying; closed otherwise.
  const live = (status === 'active' || status === 'past_due') && periodEnd
  const endsAt = live ? new Date(periodEnd.getTime() + GRACE_MS) : new Date()

  if (!live) {
    // Never create an entitlement just to close it (e.g. incomplete checkouts).
    must(
      await db
        .from('entitlements')
        .update({ ends_at: endsAt.toISOString() })
        .eq('provider', PROVIDER)
        .eq('source', 'subscription')
        .eq('source_ref', sub.id),
      'close membership',
    )
    return
  }
  must(
    await db.from('entitlements').upsert(
      {
        user_id: userId,
        kind: 'membership',
        product_id: null,
        provider: PROVIDER,
        source: 'subscription',
        source_ref: sub.id,
        starts_at: new Date(sub.start_date * 1000).toISOString(),
        ends_at: endsAt.toISOString(),
      },
      { onConflict: 'provider,source,source_ref' },
    ),
    'membership entitlement',
  )
}

// --- dispatcher -------------------------------------------------------------------

/** Events the webhook endpoint should be subscribed to in Stripe. */
export const HANDLED_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'charge.refunded',
] as const

export async function processEvent(event: Stripe.Event): Promise<'handled' | 'ignored'> {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      await fulfilCheckout(event.data.object.id)
      return 'handled'
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
    case 'customer.subscription.resumed':
      await syncSubscription(event.data.object.id)
      return 'handled'
    case 'charge.refunded':
      await fulfilRefund(event.data.object.id)
      return 'handled'
    default:
      return 'ignored'
  }
}
