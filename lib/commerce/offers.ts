/**
 * What the site sells, and what each sale unlocks. Provider-neutral.
 *
 * Each offer maps to a provider price id from env (sandbox and live ids differ, so they live in
 * env, not the database). The webhook only honours price ids listed here: a payment for any
 * other price grants nothing.
 *
 * Adding a product for sale: add an entry here and its STRIPE_PRICE_* variable in env.
 */
import 'server-only'

export type Grant = { kind: 'membership' } | { kind: 'product'; productSlug: string }

export type Offer = {
  key: string
  mode: 'subscription' | 'payment'
  plan?: 'monthly' | 'yearly'
  priceEnv: string
  grants: Grant
}

export const OFFERS: readonly Offer[] = [
  { key: 'member-monthly', mode: 'subscription', plan: 'monthly', priceEnv: 'STRIPE_PRICE_MEMBER_MONTHLY', grants: { kind: 'membership' } },
  { key: 'member-yearly', mode: 'subscription', plan: 'yearly', priceEnv: 'STRIPE_PRICE_MEMBER_YEARLY', grants: { kind: 'membership' } },
  {
    key: 'source-squad-streaks',
    mode: 'payment',
    priceEnv: 'STRIPE_PRICE_SQUAD_STREAKS_SOURCE',
    grants: { kind: 'product', productSlug: 'squad-streaks' },
  },
]

export function offerByKey(key: string): (Offer & { priceId: string }) | null {
  const offer = OFFERS.find((o) => o.key === key)
  const priceId = offer ? process.env[offer.priceEnv] : undefined
  return offer && priceId ? { ...offer, priceId } : null
}

export function offerByPriceId(priceId: string | null | undefined): Offer | null {
  if (!priceId) return null
  return OFFERS.find((o) => process.env[o.priceEnv] === priceId) ?? null
}

/** The source-code offer for a product, if one is configured. */
export function productOfferKey(productSlug: string): string | null {
  const offer = OFFERS.find((o) => o.grants.kind === 'product' && o.grants.productSlug === productSlug)
  return offer && process.env[offer.priceEnv] ? offer.key : null
}

/** Buy / membership UI and endpoints stay off until checkout, webhook and entitlements are live and tested. */
export function commerceEnabled() {
  return process.env.COMMERCE_ENABLED === 'true'
}
