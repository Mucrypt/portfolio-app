/**
 * Catalog reads for public pages (Server Components only).
 *
 * Uses the anon-key server client, so RLS decides what is visible: published
 * lessons, non-draft products, and courses that have at least one published
 * lesson. Every query also filters explicitly, so the pages stay correct even
 * if a policy is loosened later.
 */
import { createClient } from '@/lib/supabase/server'
import type {
  Course,
  CourseDetail,
  CourseModule,
  CourseSummary,
  Lesson,
  Product,
} from './types'
import { lessonImage } from './youtube'

// Typed client: column names in every select are checked against the generated
// Database types. jsonb columns (chapters, resources, screenshots) come back as
// `Json`, so rows are narrowed to the shapes in ./types where they're returned.
const db = createClient

const LESSON_LIST_COLUMNS =
  'id, course_id, module_id, external_id, slug, title, description, objective, sort_order, duration_seconds, video_provider, video_ref, short_ref, thumbnail_url, chapters, resources, is_published'

function logError(where: string, error: { message: string } | null) {
  if (error) console.error(`[catalog] ${where}: ${error.message}`)
}

export async function listCourses(): Promise<CourseSummary[]> {
  const supabase = await db()

  const [{ data: courses, error: cErr }, { data: lessons, error: lErr }] =
    await Promise.all([
      supabase.from('courses').select('*'),
      supabase
        .from('course_lessons')
        .select('course_id, sort_order, duration_seconds, video_ref, thumbnail_url')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
    ])
  logError('listCourses.courses', cErr)
  logError('listCourses.lessons', lErr)
  if (!courses || !lessons) return []

  const productIds = [
    ...new Set(
      (courses as Course[]).map((c) => c.product_id).filter((id): id is string => !!id),
    ),
  ]
  const { data: products } = productIds.length
    ? await supabase.from('products').select('id, slug, title').in('id', productIds)
    : { data: [] as { id: string; slug: string; title: string }[] }

  const summaries: CourseSummary[] = []
  for (const course of courses as Course[]) {
    const own = (lessons as Pick<Lesson, 'course_id' | 'duration_seconds' | 'video_ref' | 'thumbnail_url'>[])
      .filter((l) => l.course_id === course.id)
    if (own.length === 0) continue // not listed until a lesson is public

    const product = products?.find((p) => p.id === course.product_id) ?? null
    summaries.push({
      ...course,
      lesson_count: own.length,
      total_seconds: own.reduce((sum, l) => sum + (l.duration_seconds ?? 0), 0),
      cover_url: course.thumbnail_url ?? lessonImage(own[0]),
      product: product ? { slug: product.slug, title: product.title } : null,
    })
  }
  return summaries.sort((a, b) => a.title.localeCompare(b.title))
}

/**
 * `preview: true` includes unpublished lessons. Only call it after requireAdmin():
 * RLS still hides drafts from everyone but the owner, so a misuse leaks nothing,
 * but the page would 404 for visitors instead of rendering.
 */
type ReadOptions = { preview?: boolean }

export async function getCourse(slug: string, opts: ReadOptions = {}): Promise<CourseDetail | null> {
  const supabase = await db()

  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Course>()
  logError('getCourse', error)
  if (!course) return null

  const [{ data: modules }, { data: lessons }, { data: product }] = await Promise.all([
    supabase
      .from('course_modules')
      .select('id, course_id, external_id, title, sort_order')
      .eq('course_id', course.id)
      .order('sort_order', { ascending: true }),
    (() => {
      const q = supabase.from('course_lessons').select(LESSON_LIST_COLUMNS).eq('course_id', course.id)
      return (opts.preview ? q : q.eq('is_published', true)).order('sort_order', { ascending: true })
    })(),
    course.product_id
      ? supabase
          .from('products')
          .select('slug, title, tagline')
          .eq('id', course.product_id)
          .maybeSingle<Pick<Product, 'slug' | 'title' | 'tagline'>>()
      : Promise.resolve({ data: null }),
  ])

  const published = ((lessons ?? []) as Omit<Lesson, 'transcript'>[]).map((l) => ({
    ...l,
    transcript: null,
    chapters: Array.isArray(l.chapters) ? l.chapters : [],
    resources: Array.isArray(l.resources) ? l.resources : [],
  }))
  if (published.length === 0) return null

  return {
    ...course,
    modules: (modules ?? []) as CourseModule[],
    lessons: published,
    product: product ?? null,
  }
}

export type LessonPage = {
  course: CourseDetail
  lesson: Lesson
  prev: Lesson | null
  next: Lesson | null
}

export async function getLesson(
  courseSlug: string,
  lessonSlug: string,
  opts: ReadOptions = {},
): Promise<LessonPage | null> {
  const course = await getCourse(courseSlug, opts)
  if (!course) return null

  const index = course.lessons.findIndex((l) => l.slug === lessonSlug)
  if (index === -1) return null

  // The transcript is only loaded for the lesson being viewed (they can be ~35 KB each).
  const supabase = await db()
  const tq = supabase.from('course_lessons').select('transcript').eq('id', course.lessons[index].id)
  const { data } = await (opts.preview ? tq : tq.eq('is_published', true)).maybeSingle<{
    transcript: string | null
  }>()

  return {
    course,
    lesson: { ...course.lessons[index], transcript: data?.transcript ?? null },
    prev: course.lessons[index - 1] ?? null,
    next: course.lessons[index + 1] ?? null,
  }
}

const PRODUCT_COLUMNS =
  'id, slug, kind, title, tagline, pitch, for_whom, stack, source_code_includes, platforms, live_url, download_url, feature_suggestion_url, showcase_video_ref, showcase_duration_seconds, screenshots, status, sort_order'

function normaliseProduct(p: Product): Product {
  return {
    ...p,
    for_whom: p.for_whom ?? [],
    stack: p.stack ?? [],
    source_code_includes: p.source_code_includes ?? [],
    platforms: p.platforms ?? [],
    screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
  }
}

export async function listProducts(): Promise<Product[]> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .in('status', ['coming_soon', 'available'])
    .order('sort_order', { ascending: true })
  logError('listProducts', error)
  return ((data ?? []) as Product[]).map(normaliseProduct)
}

export type ProductPage = {
  product: Product
  courses: CourseSummary[]
}

export async function getProduct(slug: string): Promise<ProductPage | null> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .in('status', ['coming_soon', 'available'])
    .maybeSingle<Product>()
  logError('getProduct', error)
  if (!data) return null

  const courses = (await listCourses()).filter((c) => c.product_id === data.id)
  return { product: normaliseProduct(data), courses }
}

/** Buy / membership UI stays hidden until checkout, webhook and entitlements are live (phase 2). */
export function commerceEnabled() {
  return process.env.COMMERCE_ENABLED === 'true'
}
