/**
 * GET /api/commerce/download/{product-slug} — the buyer's source-code zip.
 * Checks the signed-in user's entitlement on the server, then redirects to a 60-second signed URL
 * for the private `product-files` bucket. No public link to a paid file ever exists.
 */
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { siteOrigin } from '@/lib/commerce/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SIGNED_URL_SECONDS = 60
const NO_STORE = { 'Cache-Control': 'no-store' }

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const site = siteOrigin(request)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return new Response('Not found', { status: 404, headers: NO_STORE })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.redirect(`${site}/login?redirectTo=/account/billing`, 303)

  const db = createAdminClient()
  const { data: product } = await db.from('products').select('id').eq('slug', slug).maybeSingle()
  if (!product) return new Response('Not found', { status: 404, headers: NO_STORE })

  const now = new Date().toISOString()
  const [{ data: entitlement }, { data: isOwner }] = await Promise.all([
    db
      .from('entitlements')
      .select('id')
      .eq('user_id', user.id)
      .eq('kind', 'product')
      .eq('product_id', product.id)
      .is('revoked_at', null)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gt.${now}`)
      .limit(1)
      .maybeSingle(),
    supabase.rpc('is_portfolio_admin'),
  ])
  if (!entitlement && isOwner !== true) {
    return new Response('You need to buy this source code first.', { status: 403, headers: NO_STORE })
  }

  const { data: file } = await db
    .from('product_files')
    .select('storage_path, filename')
    .eq('product_id', product.id)
    .eq('is_current', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!file) return new Response('The download isn’t ready yet. Please contact support.', { status: 404, headers: NO_STORE })

  const { data: signed, error } = await db.storage
    .from('product-files')
    .createSignedUrl(file.storage_path, SIGNED_URL_SECONDS, { download: file.filename })
  if (error || !signed) {
    console.error('[download] sign failed', error?.message)
    return new Response('Download unavailable, please try again.', { status: 500, headers: NO_STORE })
  }
  return new Response(null, { status: 303, headers: { ...NO_STORE, Location: signed.signedUrl } })
}
