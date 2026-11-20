/** POST /api/ingest/courses — upsert one course with its modules and lessons (contract §2.1). */
import type { NextRequest } from 'next/server'
import type { Json } from '@/lib/supabase/database.types'
import { createAdminClient } from '@/lib/supabase/admin'
import { dbError, handle, ok, readJson, siteUrl, validationError } from '@/lib/ingest/http'
import { upsertCourseBody } from '@/lib/ingest/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type UpsertResult = {
  course: { id: string; external_id: string; slug: string }
  modules: { created: number; updated: number }
  lessons: { created: number; updated: number }
}

export async function POST(request: NextRequest) {
  return handle(request, async (dryRun, sender) => {
    const parsed = upsertCourseBody.safeParse(await readJson(request))
    if (!parsed.success) throw validationError(parsed.error)

    const { data, error } = await createAdminClient().rpc('ingest_upsert_course', {
      p_payload: parsed.data as unknown as Json,
      p_dry_run: dryRun,
      p_sender: sender,
    })
    if (error) throw dbError(error, 'upsert_course')

    const result = data as unknown as UpsertResult
    return ok(
      {
        course: { ...result.course, url: `${siteUrl(request)}/courses/${result.course.slug}` },
        modules: result.modules,
        lessons: result.lessons,
      },
      dryRun,
    )
  })
}
