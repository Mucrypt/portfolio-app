/**
 * Strict zod schemas for the ingest API — mirror docs/ingest/CONTRACT.md v0.2
 * and the CHECK constraints in supabase/migrations/20261119130200_catalog.sql.
 *
 * Strict objects reject unknown keys. No `.default()` anywhere: whether a key
 * is present matters (absent = leave unchanged, null = clear), so parsed
 * objects are passed to the database exactly as sent.
 */
import { z } from 'zod'

const ID_RE = /^[a-z0-9-]{1,120}$/
const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/
const PLAYLIST_RE = /^[A-Za-z0-9_-]{10,64}$/

const externalId = z.string().regex(ID_RE, 'Must match ^[a-z0-9-]{1,120}$')
const youtubeId = z.string().regex(YOUTUBE_ID_RE, 'Must be an 11-character YouTube id')

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}
const httpsUrl = z.string().max(2048).refine(isHttpsUrl, 'Must be an https:// URL')

/** Public URL prefix of the course-thumbnails bucket. */
export function assetUrlPrefix() {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/+$/, '')
  return `${base}/storage/v1/object/public/course-thumbnails/`
}
const assetUrl = httpsUrl.refine(
  (v) => v.startsWith(assetUrlPrefix()),
  'Must be a URL returned by POST /api/ingest/assets',
)

const oneDecimal = (n: number) => Math.abs(n * 10 - Math.round(n * 10)) < 1e-6

const chapter = z.strictObject({
  start: z.number().nonnegative().max(86_400).refine(oneDecimal, 'At most 1 decimal place'),
  title: z.string().min(1).max(150),
})

const chapters = z
  .array(chapter)
  .max(200)
  .refine(
    (list) => list.every((c, i) => i === 0 || c.start >= list[i - 1].start),
    'Chapters must be sorted by start ascending',
  )

const resource = z.strictObject({
  label: z.string().min(1).max(150),
  url: httpsUrl,
  type: z.enum(['link', 'repo', 'doc', 'file']),
})

// Lesson fields other than the keys (external_id, slug).
const lessonBody = {
  module_external_id: externalId.nullable().optional(),
  title: z.string().min(1).max(150),
  description: z.string().max(5000),
  objective: z.string().max(1000).nullable().optional(),
  sort_order: z.number().int().nonnegative().max(1_000_000),
  duration_seconds: z.number().int().nonnegative().max(86_400).nullable().optional(),
  video_provider: z.literal('youtube'),
  video_ref: youtubeId.nullable().optional(),
  short_ref: youtubeId.nullable().optional(),
  thumbnail_url: httpsUrl.nullable().optional(),
  transcript: z.string().max(100_000).nullable().optional(),
  chapters: chapters.optional(),
  resources: z.array(resource).max(50).optional(),
  is_published: z.boolean().optional(),
}

export const lessonInput = z.strictObject({
  external_id: externalId,
  slug: externalId,
  ...lessonBody,
})

export const moduleInput = z.strictObject({
  external_id: externalId,
  title: z.string().min(1).max(150),
  sort_order: z.number().int().nonnegative().max(1_000_000),
})

export const courseInput = z.strictObject({
  external_id: externalId,
  slug: externalId.optional(),
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(5000),
  thumbnail_url: assetUrl.nullable().optional(),
  access: z.literal('free'),
  product_slug: externalId.nullable().optional(),
  playlist_id: z.string().regex(PLAYLIST_RE, 'Must be a YouTube playlist id').nullable().optional(),
})

function duplicates(values: string[]) {
  const seen = new Set<string>()
  const dupes = new Set<string>()
  for (const v of values) (seen.has(v) ? dupes : seen).add(v)
  return [...dupes]
}

export const upsertCourseBody = z
  .strictObject({
    course: courseInput,
    modules: z.array(moduleInput).max(50).optional(),
    lessons: z.array(lessonInput).max(200),
  })
  .superRefine((body, ctx) => {
    for (const id of duplicates((body.modules ?? []).map((m) => m.external_id))) {
      ctx.addIssue({ code: 'custom', path: ['modules'], message: `Duplicate module external_id "${id}"` })
    }
    for (const id of duplicates(body.lessons.map((l) => l.external_id))) {
      ctx.addIssue({ code: 'custom', path: ['lessons'], message: `Duplicate lesson external_id "${id}"` })
    }
    for (const slug of duplicates(body.lessons.map((l) => l.slug))) {
      ctx.addIssue({ code: 'custom', path: ['lessons'], message: `Duplicate lesson slug "${slug}"` })
    }
  })

/** PATCH /lessons/{external_id}: any subset of lesson fields except external_id and slug. */
export const patchLessonBody = z
  .strictObject(
    Object.fromEntries(
      Object.entries(lessonBody).map(([k, v]) => [k, (v as z.ZodType).optional()]),
    ) as { [K in keyof typeof lessonBody]: z.ZodOptional<(typeof lessonBody)[K]> },
  )
  .refine((b) => Object.keys(b).length > 0, 'Send at least one field')

/** PATCH /products/{slug}: media fields only. */
export const patchProductBody = z
  .strictObject({
    showcase_video_ref: youtubeId.nullable().optional(),
    showcase_duration_seconds: z.number().int().nonnegative().max(86_400).nullable().optional(),
  })
  .refine((b) => Object.keys(b).length > 0, 'Send at least one field')

export const pathId = externalId

export const assetKind = z.enum(['course', 'product'])
