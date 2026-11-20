/** Owner-only preview of a lesson page, including hidden lessons. */
import { notFound } from 'next/navigation'
import LessonView from '@/components/catalog/LessonView'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { getLesson } from '@/lib/catalog/queries'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Lesson preview | Admin', robots: { index: false, follow: false } }

export default async function AdminLessonPreviewPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>
}) {
  await requireAdmin()
  const { slug, lesson } = await params
  const page = await getLesson(slug, lesson, { preview: true })
  if (!page) notFound()

  return (
    <LessonView
      page={page}
      courseHref={`/admin/courses/${slug}`}
      lessonHrefBase={`/admin/courses/${slug}/preview`}
      preview
    />
  )
}
