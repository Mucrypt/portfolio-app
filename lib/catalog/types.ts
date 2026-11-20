/**
 * Catalog types: products, courses, modules, lessons.
 *
 * These mirror the catalog migration (supabase/migrations/*_catalog.sql) and the
 * ingest contract (docs/ingest/CONTRACT.md). Once that migration is applied and
 * `npm run db:types` has regenerated lib/supabase/database.types.ts, these can be
 * replaced by the generated `Tables<'…'>` types.
 */

export type ProductKind = 'app' | 'source_code' | 'software' | 'course_bundle'
export type ProductStatus = 'draft' | 'coming_soon' | 'available' | 'archived'

export type Screenshot = {
  /** Path under /public (e.g. /products/squad-streaks/app-today.png) or an absolute https URL */
  src: string
  /** Caption shown under the image, e.g. "App: demo accounts (emulator)" */
  label: string
  /** Short alt text; falls back to label */
  alt?: string | null
  /** True for dashboard/analytics shots — rendered with a visible "Demo data" badge */
  demo_data?: boolean
}

export type Product = {
  id: string
  slug: string
  kind: ProductKind
  title: string
  tagline: string | null
  pitch: string | null
  for_whom: string[]
  stack: string[]
  source_code_includes: string[]
  platforms: string[]
  live_url: string | null
  download_url: string | null
  feature_suggestion_url: string | null
  showcase_video_ref: string | null
  showcase_duration_seconds: number | null
  screenshots: Screenshot[]
  status: ProductStatus
  sort_order: number
}

export type CourseAccess = 'free' | 'members'
export type LessonAccess = 'inherit' | 'free_preview'

export type Chapter = { start: number; title: string }
export type Resource = {
  label: string
  url: string
  type: 'link' | 'repo' | 'doc' | 'file'
}

export type CourseModule = {
  id: string
  course_id: string
  external_id: string
  title: string
  sort_order: number
}

export type Lesson = {
  id: string
  course_id: string
  module_id: string | null
  external_id: string
  slug: string
  title: string
  description: string
  objective: string | null
  sort_order: number
  duration_seconds: number | null
  video_provider: 'youtube'
  video_ref: string | null
  short_ref: string | null
  thumbnail_url: string | null
  transcript: string | null
  chapters: Chapter[]
  resources: Resource[]
  is_published: boolean
  access: LessonAccess
  /**
   * True when the reader may not see this lesson's content (members-only, not a member).
   * A locked lesson carries only outline fields: video_ref, transcript, chapters and resources are empty.
   */
  locked: boolean
}

export type Course = {
  id: string
  external_id: string
  slug: string
  title: string
  description: string
  thumbnail_url: string | null
  access: CourseAccess
  product_id: string | null
  playlist_id: string | null
}

/** Course card data for the /courses list (only published lessons are counted). */
export type CourseSummary = Course & {
  lesson_count: number
  total_seconds: number
  cover_url: string | null
  product: Pick<Product, 'slug' | 'title'> | null
}

export type CourseDetail = Course & {
  modules: CourseModule[]
  lessons: Lesson[]
  product: Pick<Product, 'slug' | 'title' | 'tagline'> | null
}
