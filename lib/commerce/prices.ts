/**
 * Display prices, read from Stripe (the price charged is always Stripe's; nothing here is trusted
 * for billing). Cached for 10 minutes per server instance.
 */
import 'server-only'
import { offerByKey } from './offers'
import { stripe } from './stripe'

export type DisplayPrice = { label: string; interval: 'month' | 'year' | null }

const TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { at: number; value: DisplayPrice | null }>()

export async function displayPrice(offerKey: string): Promise<DisplayPrice | null> {
  const offer = offerByKey(offerKey)
  if (!offer || !process.env.STRIPE_SECRET_KEY) return null

  const hit = cache.get(offer.priceId)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value

  let value: DisplayPrice | null = null
  try {
    const price = await stripe().prices.retrieve(offer.priceId)
    if (price.unit_amount != null && price.active) {
      value = {
        label: new Intl.NumberFormat('en', { style: 'currency', currency: price.currency }).format(
          price.unit_amount / 100,
        ),
        interval: (() => {
          const i = price.recurring?.interval
          return i === 'month' ? 'month' : i === 'year' ? 'year' : null
        })(),
      }
    }
  } catch (err) {
    console.error('[prices]', err instanceof Error ? err.message : err)
  }
  cache.set(offer.priceId, { at: Date.now(), value })
  return value
}
