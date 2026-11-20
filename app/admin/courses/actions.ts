'use server'

/**
 * Publishing is the owner's decision (ingest only ever sends video ids).
 *
 * Server actions are public POST endpoints, so each one re-checks the owner
 * with requireAdmin() and validates its input. Writes use the owner's session:
 * RLS ("owner manage course_lessons") and the course_lessons_publish_requires_video
 * constraint are the final guards.
 */
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { ok: true; count?: number } | { ok: false; message: string }

const uuid = z.string().uuid()

function refresh() {
  revalidatePath('/admin/courses', 'layout')
  revalidatePath('/courses', 'layout')
  revalidatePath('/products', 'layout')
}

export async function setLessonPublished(lessonId: string, published: boolean): Promise<ActionResult> {
  await requireAdmin()
  const input = z.object({ lessonId: uuid, published: z.boolean() }).safeParse({ lessonId, published })
  if (!input.success) return { ok: false, message: 'Invalid request.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('course_lessons')
    .update({ is_published: input.data.published })
    .eq('id', input.data.lessonId)
    .select('id')
  if (error) {
    if (error.code === '23514') return { ok: false, message: 'This lesson has no YouTube video yet.' }
    console.error(`[admin courses] publish lesson: ${error.code ?? ''} ${error.message}`)
    return { ok: false, message: 'Could not save. Try again.' }
  }
  if (!data?.length) return { ok: false, message: 'Lesson not found.' }

  refresh()
  return { ok: true, count: data.length }
}

/** Publish every hidden lesson in a module (or the lessons with no module) that has a video. */
export async function publishModuleLessons(courseId: string, moduleId: string | null): Promise<ActionResult> {
  await requireAdmin()
  const input = z.object({ courseId: uuid, moduleId: uuid.nullable() }).safeParse({ courseId, moduleId })
  if (!input.success) return { ok: false, message: 'Invalid request.' }

  const supabase = await createClient()
  let query = supabase
    .from('course_lessons')
    .update({ is_published: true })
    .eq('course_id', input.data.courseId)
    .eq('is_published', false)
    .not('video_ref', 'is', null)
  query = input.data.moduleId ? query.eq('module_id', input.data.moduleId) : query.is('module_id', null)

  const { data, error } = await query.select('id')
  if (error) {
    console.error(`[admin courses] publish module: ${error.code ?? ''} ${error.message}`)
    return { ok: false, message: 'Could not save. Try again.' }
  }

  refresh()
  return { ok: true, count: data?.length ?? 0 }
}
