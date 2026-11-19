/**
 * Shared plumbing for /api/ingest/* (docs/ingest/CONTRACT.md):
 * bearer auth (constant time), rate limiting, size-limited body reading,
 * the error envelope, and mapping database errors to contract errors.
 */
import 'server-only'
import { createHash, timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import type { ZodError } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

export const JSON_LIMIT_BYTES = 1024 * 1024 // 1 MB
export const ASSET_LIMIT_BYTES = 4 * 1024 * 1024 // 4 MB per file
const MULTIPART_LIMIT_BYTES = ASSET_LIMIT_BYTES + 64 * 1024 // file + form overhead
const RATE_LIMIT_PER_MINUTE = 60

export type Issue = { path: string; message: string }

export class IngestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public issues: Issue[] = [],
    public headers: Record<string, string> = {},
  ) {
    super(message)
  }
}

const NO_STORE = { 'Cache-Control': 'no-store' }

export function ok(body: Record<string, unknown>, dryRun = false) {
  return NextResponse.json(
    { ok: true, ...(dryRun ? { dry_run: true } : {}), ...body },
    { status: 200, headers: NO_STORE },
  )
}

export function fail(err: IngestError, dryRun = false) {
  return NextResponse.json(
    {
      ok: false,
      ...(dryRun ? { dry_run: true } : {}),
      error: err.code,
      message: err.message,
      issues: err.issues,
    },
    { status: err.status, headers: { ...NO_STORE, ...err.headers } },
  )
}

/** `?dry_run=1` exactly; anything else is a real call (contract §2.5). */
export function isDryRun(request: NextRequest) {
  return request.nextUrl.searchParams.get('dry_run') === '1'
}

export function siteUrl(request: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/+$/, '')
}

// --- auth -------------------------------------------------------------------

function digest(value: string) {
  return createHash('sha256').update(value, 'utf8').digest()
}

/** Compare SHA-256 digests so neither the content nor the length leaks through timing. */
function tokenMatches(presented: string, expected: string | undefined) {
  if (!expected || expected.length < 32) return false
  return timingSafeEqual(digest(presented), digest(expected))
}

export function requireToken(request: NextRequest) {
  const header = request.headers.get('authorization') ?? ''
  const match = /^Bearer ([^\s]+)$/.exec(header)
  const presented = match?.[1] ?? ''

  // Evaluate both so the time taken doesn't depend on which one matched.
  const current = tokenMatches(presented, process.env.INGEST_TOKEN)
  const next = tokenMatches(presented, process.env.INGEST_TOKEN_NEXT)
  if (!presented || !(current || next)) {
    throw new IngestError(401, 'unauthorized', 'Missing or invalid token.')
  }
}

// --- rate limit -------------------------------------------------------------

export async function enforceRateLimit() {
  const { data, error } = await createAdminClient().rpc('ingest_rate_hit', { p_bucket: 'ingest' })
  if (error) {
    // Fail open: a counter outage shouldn't block ingest, and auth already passed.
    console.error(`[ingest] rate limiter unavailable: ${error.code ?? ''} ${error.message}`)
    return
  }
  if (typeof data === 'number' && data > RATE_LIMIT_PER_MINUTE) {
    const retryAfter = 60 - new Date().getUTCSeconds()
    throw new IngestError(429, 'rate_limited', `More than ${RATE_LIMIT_PER_MINUTE} requests a minute. Back off.`, [], {
      'Retry-After': String(retryAfter),
    })
  }
}

// --- bodies -----------------------------------------------------------------

/** Read the body without ever buffering more than `limit` bytes. */
async function readLimited(request: NextRequest, limit: number, what: string): Promise<Uint8Array> {
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (declared > limit) {
    throw new IngestError(413, 'payload_too_large', `${what} is larger than ${limit} bytes.`)
  }
  if (!request.body) return new Uint8Array()

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > limit) {
      await reader.cancel()
      throw new IngestError(413, 'payload_too_large', `${what} is larger than ${limit} bytes.`)
    }
    chunks.push(value)
  }
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}

export async function readJson(request: NextRequest): Promise<unknown> {
  const type = request.headers.get('content-type') ?? ''
  if (!/^application\/json\b/i.test(type)) {
    throw new IngestError(415, 'unsupported_media_type', 'Content-Type must be application/json.')
  }
  const bytes = await readLimited(request, JSON_LIMIT_BYTES, 'JSON body')
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  } catch {
    throw new IngestError(400, 'invalid_json', 'The body is not valid JSON.')
  }
}

export async function readMultipart(request: NextRequest): Promise<FormData> {
  const type = request.headers.get('content-type') ?? ''
  if (!/^multipart\/form-data\b/i.test(type)) {
    throw new IngestError(415, 'unsupported_media_type', 'Content-Type must be multipart/form-data.')
  }
  const bytes = await readLimited(request, MULTIPART_LIMIT_BYTES, 'Upload')
  try {
    return await new Response(bytes as BodyInit, { headers: { 'content-type': type } }).formData()
  } catch {
    throw new IngestError(400, 'validation_failed', 'The multipart body could not be parsed.')
  }
}

// --- errors -----------------------------------------------------------------

export function validationError(error: ZodError) {
  const issues = error.issues.slice(0, 50).map((i) => ({
    path: i.path.map(String).join('.'),
    message: i.message,
  }))
  return new IngestError(
    400,
    'validation_failed',
    `The body failed validation (${error.issues.length} issue${error.issues.length === 1 ? '' : 's'}).`,
    issues,
  )
}

const BUSINESS_ERRORS: Record<string, number> = {
  unknown_product: 422,
  unknown_module: 422,
  publish_requires_video_ref: 422,
  lesson_belongs_to_other_course: 409,
  lesson_not_found: 404,
}

type DbError = { code?: string; message: string; details?: string | null; hint?: string | null }

/** Map an error from the ingest database functions to a contract error. */
export function dbError(error: DbError, where: string): IngestError {
  if (error.code === 'P0001' && error.message in BUSINESS_ERRORS) {
    const issues = error.hint ? [{ path: error.hint, message: error.details ?? error.message }] : []
    return new IngestError(BUSINESS_ERRORS[error.message], error.message, error.details ?? error.message, issues)
  }
  if (error.code === '23505') {
    return new IngestError(409, 'slug_taken', 'A course or lesson with that slug already exists.')
  }
  // Never echo database internals to the caller.
  console.error(`[ingest] ${where}: ${error.code ?? ''} ${error.message}`)
  return new IngestError(500, 'internal_error', 'Something went wrong on the site. Safe to retry.')
}

/**
 * Wrap a handler: auth → rate limit → handler, with every failure turned into
 * the contract's error envelope.
 */
export async function handle(
  request: NextRequest,
  run: (dryRun: boolean) => Promise<NextResponse>,
): Promise<NextResponse> {
  const dryRun = isDryRun(request)
  try {
    requireToken(request)
    await enforceRateLimit()
    return await run(dryRun)
  } catch (err) {
    if (err instanceof IngestError) return fail(err, dryRun && err.status !== 401)
    console.error('[ingest] unexpected error', err instanceof Error ? err.message : err)
    return fail(new IngestError(500, 'internal_error', 'Something went wrong on the site. Safe to retry.'), dryRun)
  }
}
