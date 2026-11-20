/**
 * Catalog reads for the owner's admin pages. Uses the owner's own session
 * (anon key + cookies), so RLS ("owner manage …" policies) decides access: the
 * owner sees unpublished lessons and hidden courses; anyone else sees only what
 * is public. Callers must still run requireAdmin() first.
 */
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export type AdminCourseRow = {
  id: string
  external_id: string
  slug: string
  title: string
  source: string
  updated_at: string
  product: { slug: string; title: string } | null
  lessons_total: number
  lessons_with_video: number
  lessons_published: number
}

export type AdminLesson = {
  id: string
  module_id: string | null
  external_id: string
  slug: string
  title: string
  sort_order: number
  duration_seconds: number | null
  video_ref: string | null
  short_ref: string | null
  thumbnail_url: string | null
  has_transcript: boolean | null
  is_published: boolean
  updated_at: string
}

export type AdminModule = { id: string; external_id: string; title: string; sort_order: number }

export type AdminCourseDetail = Omit<AdminCourseRow, 'lessons_total' | 'lessons_with_video' | 'lessons_published'> & {
  description: string
  modules: AdminModule[]
  lessons: AdminLesson[]
}

export async function listAdminCourses(): Promise<AdminCourseRow[]> {
  const supabase = await createClient()
  const [{ data: courses, error: cErr }, { data: lessons, error: lErr }, { data: products }] =
    await Promise.all([
      supabase.from('courses').select('id, external_id, slug, title, source, updated_at, product_id').order('title'),
      supabase.from('course_lessons').select('course_id, video_ref, is_published'),
      supabase.from('products').select('id, slug, title'),
    ])
  if (cErr) console.error(`[admin catalog] courses: ${cErr.message}`)
  if (lErr) console.error(`[admin catalog] lessons: ${lErr.message}`)

  return (courses ?? []).map((c) => {
    const own = (lessons ?? []).filter((l) => l.course_id === c.id)
    const product = (products ?? []).find((p) => p.id === c.product_id)
    return {
      id: c.id,
      external_id: c.external_id,
      slug: c.slug,
      title: c.title,
      source: c.source,
      updated_at: c.updated_at,
      product: product ? { slug: product.slug, title: product.title } : null,
      lessons_total: own.length,
      lessons_with_video: own.filter((l) => !!l.video_ref).length,
      lessons_published: own.filter((l) => l.is_published).length,
    }
  })
}

export async function getAdminCourse(slug: string): Promise<AdminCourseDetail | null> {
  const supabase = await createClient()
  const { data: course, error } = await supabase
    .from('courses')
    .select('id, external_id, slug, title, description, source, updated_at, product_id')
    .eq('slug', slug)
    .maybeSingle()
  if (error) console.error(`[admin catalog] course: ${error.message}`)
  if (!course) return null

  const [{ data: modules }, { data: lessons }, { data: product }] = await Promise.all([
    supabase
      .from('course_modules')
      .select('id, external_id, title, sort_order')
      .eq('course_id', course.id)
      .order('sort_order'),
    supabase
      .from('course_lessons')
      .select(
        'id, module_id, external_id, slug, title, sort_order, duration_seconds, video_ref, short_ref, thumbnail_url, has_transcript, is_published, updated_at',
      )
      .eq('course_id', course.id)
      .order('sort_order'),
    course.product_id
      ? supabase.from('products').select('slug, title').eq('id', course.product_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return {
    id: course.id,
    external_id: course.external_id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    source: course.source,
    updated_at: course.updated_at,
    product: product ?? null,
    modules: modules ?? [],
    lessons: lessons ?? [],
  }
}
