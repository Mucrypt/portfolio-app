import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define routes that require authentication
  const protectedPublicRoutes = ['/contact', '/shop']
  const isProtectedRoute = protectedPublicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  // Redirect unauthenticated users from protected public routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/signup'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Protect admin routes - require authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Verify user is the owner by checking if they have any data in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, owner_user_id')
      .eq('owner_user_id', user.id)
      .single()

    // If user is authenticated but not the owner, deny access
    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login' && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const url = request.nextUrl.clone()

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('owner_user_id', user.id)
      .single()

    // Redirect admins to /admin/dashboard, public users to home or their intended destination
    if (profile) {
      url.pathname = redirectTo || '/admin/dashboard'
    } else {
      // For public users, go to home unless they have a specific non-admin destination
      url.pathname =
        redirectTo && !redirectTo.startsWith('/admin') ? redirectTo : '/'
    }
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
