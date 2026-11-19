/**
 * POST /api/ingest/assets — upload course/product art, get back its public URL (contract §2.4).
 * Stored at course-thumbnails/{kind}/{external_id}/{sha256}.{ext}, so the same file
 * always gets the same URL. The file type is decided from its bytes, not its name.
 */
import { createHash } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ASSET_LIMIT_BYTES, IngestError, handle, ok, readMultipart } from '@/lib/ingest/http'
import { assetKind, assetUrlPrefix, pathId } from '@/lib/ingest/schemas'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BUCKET = 'course-thumbnails'

function sniffImage(b: Uint8Array): { ext: string; mime: string } | null {
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) {
    return { ext: 'png', mime: 'image/png' }
  }
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' }
  }
  if (b.length >= 12 && String.fromCharCode(...b.subarray(0, 4)) === 'RIFF' &&
      String.fromCharCode(...b.subarray(8, 12)) === 'WEBP') {
    return { ext: 'webp', mime: 'image/webp' }
  }
  return null
}

export async function POST(request: NextRequest) {
  return handle(request, async (dryRun) => {
    const form = await readMultipart(request)

    const issues: { path: string; message: string }[] = []
    const allowed = new Set(['file', 'kind', 'external_id'])
    for (const key of new Set(form.keys())) {
      if (!allowed.has(key)) issues.push({ path: key, message: 'Unknown field' })
    }
    const file = form.get('file')
    const kind = assetKind.safeParse(form.get('kind'))
    const externalId = pathId.safeParse(form.get('external_id'))
    if (!(file instanceof File)) issues.push({ path: 'file', message: 'Required: one image file' })
    if (form.getAll('file').length > 1) issues.push({ path: 'file', message: 'Send one file per request' })
    if (!kind.success) issues.push({ path: 'kind', message: 'Must be "course" or "product"' })
    if (!externalId.success) issues.push({ path: 'external_id', message: 'Must match ^[a-z0-9-]{1,120}$' })
    if (issues.length || !(file instanceof File) || !kind.success || !externalId.success) {
      throw new IngestError(400, 'validation_failed', 'The upload failed validation.', issues)
    }

    if (file.size > ASSET_LIMIT_BYTES) {
      throw new IngestError(413, 'payload_too_large', `The file is larger than ${ASSET_LIMIT_BYTES} bytes.`)
    }
    const bytes = new Uint8Array(await file.arrayBuffer())
    const type = sniffImage(bytes)
    if (!type) {
      throw new IngestError(415, 'unsupported_media_type', 'The file must be a PNG, JPEG or WebP image.')
    }

    const hash = createHash('sha256').update(bytes).digest('hex')
    const path = `${kind.data}/${externalId.data}/${hash}.${type.ext}`
    const url = `${assetUrlPrefix()}${path}`

    if (!dryRun) {
      const { error } = await createAdminClient()
        .storage.from(BUCKET)
        .upload(path, bytes, { contentType: type.mime, upsert: false, cacheControl: '31536000' })
      // Same bytes → same path: an existing object is the file we'd have written.
      const exists = error && /exists|duplicate/i.test(error.message)
      if (error && !exists) {
        console.error(`[ingest] asset upload failed: ${error.message}`)
        throw new IngestError(500, 'internal_error', 'The file could not be stored. Safe to retry.')
      }
    }

    return ok({ url }, dryRun)
  })
}
