/**
 * POST /api/webhooks/stripe — Stripe events (Managed Payments).
 *
 * 1. Verify the signature on the raw body before parsing anything.
 * 2. Record the event id; an event already processed is acknowledged and skipped.
 * 3. Process (lib/commerce/fulfil.ts re-reads everything from Stripe's API).
 * 4. 2xx on success or on a permanent problem (recorded for the owner); 5xx so Stripe retries
 *    a temporary one.
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PROVIDER, verifyWebhook, type Stripe } from '@/lib/commerce/stripe'
import { Unfulfillable, processEvent } from '@/lib/commerce/fulfil'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 512 * 1024

function reply(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (declared > MAX_BODY_BYTES) return reply(413, { error: 'payload_too_large' })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return reply(413, { error: 'payload_too_large' })

  let event: Stripe.Event
  try {
    event = verifyWebhook(raw, request.headers.get('stripe-signature'))
  } catch (err) {
    // Wrong secret / forged / replayed outside the tolerance window. Don't say which.
    console.warn('[stripe-webhook] signature rejected', err instanceof Error ? err.message : '')
    return reply(400, { error: 'invalid_signature' })
  }

  const db = createAdminClient()

  // Idempotency: one row per event id. ignoreDuplicates → no row back when it already existed.
  const { data: inserted, error: insertError } = await db
    .from('commerce_events')
    .upsert(
      { provider: PROVIDER, event_id: event.id, type: event.type },
      { onConflict: 'provider,event_id', ignoreDuplicates: true },
    )
    .select('event_id')
  if (insertError) {
    console.error('[stripe-webhook] event log failed', insertError.message)
    return reply(500, { error: 'retry' })
  }

  if (!inserted?.length) {
    const { data: seen } = await db
      .from('commerce_events')
      .select('processed_at, attempts')
      .eq('provider', PROVIDER)
      .eq('event_id', event.id)
      .single()
    if (seen?.processed_at) return reply(200, { received: true, duplicate: true })
    await db
      .from('commerce_events')
      .update({ attempts: (seen?.attempts ?? 1) + 1 })
      .eq('provider', PROVIDER)
      .eq('event_id', event.id)
  }

  try {
    const outcome = await processEvent(event)
    await db
      .from('commerce_events')
      .update({ processed_at: new Date().toISOString(), last_error: null })
      .eq('provider', PROVIDER)
      .eq('event_id', event.id)
    return reply(200, { received: true, outcome })
  } catch (err) {
    const message = (err instanceof Error ? err.message : String(err)).slice(0, 1000)
    const permanent = err instanceof Unfulfillable
    await db
      .from('commerce_events')
      .update({ last_error: message, ...(permanent ? { processed_at: new Date().toISOString() } : {}) })
      .eq('provider', PROVIDER)
      .eq('event_id', event.id)
    console.error(`[stripe-webhook] ${event.type} ${event.id} ${permanent ? 'unfulfillable' : 'failed'}: ${message}`)
    return permanent ? reply(200, { received: true, outcome: 'unfulfillable' }) : reply(500, { error: 'retry' })
  }
}
