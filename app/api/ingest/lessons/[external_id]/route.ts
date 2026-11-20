/** PATCH /api/ingest/lessons/{external_id} — partial update of one lesson (contract §2.2). */
import type { NextRequest } from 'next/server'
import type { Json } from '@/lib/supabase/database.types'
import { createAdminClient } from '@/lib/supabase/admin'
import { IngestError, dbError, handle, ok, readJson, siteUrl, validationError } from '@/lib/ingest/http'
import { patchLessonBody, pathId } from '@/lib/ingest/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PatchResult = {
  id: string
  external_id: string
  slug: string
  is_published: boolean
  video_ref: string | null
  course_slug: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ external_id: string }> },
) {
  return handle(request, async (dryRun, sender) => {
    const { external_id } = await params
    if (!pathId.safeParse(external_id).success) {
      throw new IngestError(404, 'lesson_not_found', `No lesson with external_id "${external_id.slice(0, 120)}".`)
    }

    const parsed = patchLessonBody.safeParse(await readJson(request))
    if (!parsed.success) throw validationError(parsed.error)

    const { data, error } = await createAdminClient().rpc('ingest_patch_lesson', {
      p_external_id: external_id,
      p_patch: parsed.data as unknown as Json,
      p_dry_run: dryRun,
      p_sender: sender,
    })
    if (error) throw dbError(error, 'patch_lesson')

    const l = data as unknown as PatchResult
    return ok(
      {
        lesson: {
          id: l.id,
          external_id: l.external_id,
          is_published: l.is_published,
          video_ref: l.video_ref,
          url: `${siteUrl(request)}/courses/${l.course_slug}/${l.slug}`,
        },
      },
      dryRun,
    )
  })
}
