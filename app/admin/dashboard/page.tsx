import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSystemMetrics() {
  const supabase = await createClient()

  // Get total counts from all tables
  const [
    { count: projectsCount },
    { count: blogPostsCount },
    { count: coursesCount },
    { count: servicesCount },
    { count: shopItemsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('shop_products').select('*', { count: 'exact', head: true }),
  ])

  // Get recent activities (last 10 updates)
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  return {
    counts: {
      projects: projectsCount || 0,
      blogPosts: blogPostsCount || 0,
      courses: coursesCount || 0,
      services: servicesCount || 0,
      shopItems: shopItemsCount || 0,
    },
    recentActivities: [
      ...(recentProjects || []).map((p: any) => ({ type: 'project', ...p })),
      ...(recentPosts || []).map((p: any) => ({ type: 'blog', ...p })),
    ]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, 10),
  }
}

export default async function AdminDashboardPage() {
  // Verify user is authenticated and is the owner
  const { user, profile } = await requireAdmin()

  const metrics = await getSystemMetrics()

  return (
    <Suspense fallback={<div className='p-8'>Loading dashboard...</div>}>
      <DashboardClient initialMetrics={metrics} />
    </Suspense>
  )
}
