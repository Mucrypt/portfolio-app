import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LessonView from '@/components/catalog/LessonView'
import { getLesson } from '@/lib/catalog/queries'
import { lessonImage } from '@/lib/catalog/youtube'

type Params = { params: Promise<{ slug: string; lesson: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, lesson: lessonSlug } = await params
  const page = await getLesson(slug, lessonSlug)
  if (!page) return { title: 'Lesson not found' }
  const image = lessonImage(page.lesson)
  return {
    title: `${page.lesson.title} | ${page.course.title}`,
    description: (page.lesson.objective || page.lesson.description).slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  }
}

export default async function LessonPage({ params }: Params) {
  const { slug, lesson: lessonSlug } = await params
  const page = await getLesson(slug, lessonSlug)
  if (!page) notFound()

  return (
    <LessonView
      page={page}
      courseHref={`/courses/${slug}`}
      lessonHrefBase={`/courses/${slug}`}
    />
  )
}
