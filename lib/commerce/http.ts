/** Small helpers shared by the browser-facing commerce routes. */
import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'

export function siteOrigin(request: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).replace(/\/+$/, '')
}

/** Form posts must come from this site (defence in depth on top of SameSite=Lax cookies). */
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  return origin === request.nextUrl.origin || origin === siteOrigin(request)
}

/** A same-site path to come back to, or the fallback. Never an absolute URL (no open redirect). */
export function safeReturnPath(value: unknown, fallback: string) {
  return typeof value === 'string' && /^\/(?!\/)[A-Za-z0-9/_\-?=&.]{0,300}$/.test(value) ? value : fallback
}

/** 303 so the browser follows a POST with a GET. */
export function seeOther(url: string) {
  return NextResponse.redirect(url, 303)
}
