/**
 * PATCH /api/ingest/products/{slug} — set a product's showcase video only (contract §2.3).
 * Price, copy and status are owner-only and can't be set here.
 */
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { IngestError, dbError, handle, ok, readJson, validationError } from '@/lib/ingest/http'
import { patchProductBody, pathId } from '@/lib/ingest/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const COLUMNS = 'slug, showcase_video_ref, showcase_duration_seconds'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return handle(request, async (dryRun) => {
    const { slug } = await params
    const notFound = new IngestError(404, 'product_not_found', `No product with slug "${slug.slice(0, 120)}".`)
    if (!pathId.safeParse(slug).success) throw notFound

    const parsed = patchProductBody.safeParse(await readJson(request))
    if (!parsed.success) throw validationError(parsed.error)

    const db = createAdminClient()

    if (dryRun) {
      const { data, error } = await db.from('products').select(COLUMNS).eq('slug', slug).maybeSingle()
      if (error) throw dbError(error, 'patch_product.dry_run')
      if (!data) throw notFound
      return ok({ product: { ...data, ...parsed.data } }, true)
    }

    const { data, error } = await db
      .from('products')
      .update(parsed.data)
      .eq('slug', slug)
      .select(COLUMNS)
      .maybeSingle()
    if (error) throw dbError(error, 'patch_product')
    if (!data) throw notFound
    return ok({ product: data })
  })
}
