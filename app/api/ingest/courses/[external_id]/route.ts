/** GET /api/ingest/courses/{external_id} — current state, unpublished lessons included (contract §2.1a). */
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { IngestError, dbError, handle, ok, siteUrl } from '@/lib/ingest/http'
import { pathId } from '@/lib/ingest/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CourseState = {
  course: { slug: string } & Record<string, unknown>
  modules: unknown[]
  lessons: unknown[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ external_id: string }> },
) {
  return handle(request, async () => {
    const { external_id } = await params
    if (!pathId.safeParse(external_id).success) {
      throw new IngestError(404, 'course_not_found', `No course with external_id "${external_id.slice(0, 120)}".`)
    }

    const { data, error } = await createAdminClient().rpc('ingest_get_course', { p_external_id: external_id })
    if (error) throw dbError(error, 'get_course')
    if (!data) throw new IngestError(404, 'course_not_found', `No course with external_id "${external_id}".`)

    const state = data as unknown as CourseState
    return ok({
      course: { ...state.course, url: `${siteUrl(request)}/courses/${state.course.slug}` },
      modules: state.modules,
      lessons: state.lessons,
    })
  })
}
