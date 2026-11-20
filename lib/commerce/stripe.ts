/**
 * Stripe (Managed Payments, merchant of record). The only file that talks to Stripe's API.
 * Server-only: the secret key never reaches a browser.
 */
import 'server-only'
import Stripe from 'stripe'

export const PROVIDER = 'stripe'

let client: Stripe | null = null

export function stripe(): Stripe {
  if (client) return client
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  // apiVersion: the SDK's pinned version (stripe@23.1.0 → 2026-10-28.endive), so types and API agree.
  client = new Stripe(key, { maxNetworkRetries: 2, timeout: 20_000, appInfo: { name: 'romeomukulah.org' } })
  return client
}

/**
 * Managed Payments makes Stripe the merchant of record (tax, disputes). It must also be accepted
 * in the Stripe dashboard. STRIPE_MANAGED_PAYMENTS=false turns it off (e.g. a sandbox where the
 * terms aren't accepted yet); anything else leaves it on.
 */
export function managedPayments(): boolean {
  return process.env.STRIPE_MANAGED_PAYMENTS !== 'false'
}

/**
 * Verify a webhook on the raw body: HMAC-SHA256 with a constant-time compare and a 5-minute
 * timestamp tolerance (Stripe SDK). Throws if the signature is missing or wrong.
 */
export function verifyWebhook(rawBody: string, signature: string | null): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  if (!signature) throw new Error('missing Stripe-Signature header')
  return stripe().webhooks.constructEvent(rawBody, signature, secret)
}

export type { Stripe }
