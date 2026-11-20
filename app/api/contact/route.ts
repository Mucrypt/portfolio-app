/**
 * POST /api/contact — the public contact form. Saves the message for the owner (admin → Messages).
 *
 * Defences: same-origin only, 32 KB body cap, strict zod body, a hidden honeypot field, and a
 * rate limit per visitor (hashed IP, never stored) plus a site-wide cap.
 */
import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 32 * 1024
const PER_VISITOR_PER_MINUTE = 3
const SITE_WIDE_PER_MINUTE = 30

const body = z.strictObject({
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.email('Please enter a valid email address.').trim().max(254),
  subject: z.string().trim().min(1, 'Please add a subject.').max(150),
  message: z.string().trim().min(10, 'Please write at least a sentence.').max(5000),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(200).optional(),
})

function reply(status: number, payload: Record<string, unknown>) {
  return NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store' } })
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '')
  return origin === request.nextUrl.origin || (!!site && origin === site)
}

/** A per-visitor bucket that can't be reversed to an IP (salted with a server secret). */
function visitorBucket(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return `contact:${createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)}`
}

async function overLimit(db: ReturnType<typeof createAdminClient>, bucket: string, limit: number) {
  const { data, error } = await db.rpc('ingest_rate_hit', { p_bucket: bucket })
  if (error) {
    console.error('[contact] rate limiter unavailable', error.message)
    return false // fail open; the honeypot and validation still apply
  }
  return typeof data === 'number' && data > limit
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reply(403, { error: 'Forbidden' })
  if (!/^application\/json\b/i.test(request.headers.get('content-type') ?? '')) {
    return reply(415, { error: 'Unsupported content type' })
  }
  if (Number(request.headers.get('content-length') ?? '0') > MAX_BODY_BYTES) {
    return reply(413, { error: 'Your message is too long.' })
  }

  let raw: unknown
  try {
    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) return reply(413, { error: 'Your message is too long.' })
    raw = JSON.parse(text)
  } catch {
    return reply(400, { error: 'Something went wrong. Please try again.' })
  }

  const parsed = body.safeParse(raw)
  if (!parsed.success) {
    return reply(400, { error: parsed.error.issues[0]?.message ?? 'Please check the form.' })
  }
  // Bots fill every field. Pretend it worked so they don't adapt.
  if (parsed.data.website) return reply(200, { message: 'Message sent successfully' })

  const db = createAdminClient()
  if (
    (await overLimit(db, visitorBucket(request), PER_VISITOR_PER_MINUTE)) ||
    (await overLimit(db, 'contact:all', SITE_WIDE_PER_MINUTE))
  ) {
    return reply(429, { error: 'Too many messages. Please wait a minute and try again.' })
  }

  const { name, email, subject, message } = parsed.data
  const { error } = await db.from('contact_inquiries').insert({
    name,
    email: email.toLowerCase(),
    subject,
    message,
    inquiry_type: 'general',
    status: 'new',
  })
  if (error) {
    console.error('[contact] save failed', error.code, error.message)
    return reply(500, { error: 'Your message couldn’t be sent. Please try again in a moment.' })
  }
  return reply(200, { message: 'Message sent successfully' })
}
