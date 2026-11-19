import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, Package } from 'lucide-react'
import LessonPlayer from '@/components/catalog/LessonPlayer'
import { getLesson } from '@/lib/catalog/queries'
import { formatDuration, isYouTubeId, lessonImage, watchUrl } from '@/lib/catalog/youtube'

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

  const { course, lesson, prev, next } = page
  const hasVideo = isYouTubeId(lesson.video_ref)

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8'>
        <Link
          href={`/courses/${course.slug}`}
          className='mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400'
        >
          <ArrowLeft className='h-4 w-4' /> {course.title}
        </Link>

        <div className='mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
          Part {lesson.sort_order} of {course.lessons.length} published
          {formatDuration(lesson.duration_seconds) && (
            <span className='ml-2 font-normal normal-case text-gray-500 dark:text-gray-400'>
              · {formatDuration(lesson.duration_seconds)}
            </span>
          )}
        </div>
        <h1 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl'>{lesson.title}</h1>

        {hasVideo ? (
          <LessonPlayer videoId={lesson.video_ref!} title={lesson.title} chapters={lesson.chapters} />
        ) : (
          <div className='flex aspect-video w-full items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800'>
            The video for this lesson is coming soon.
          </div>
        )}

        <div className='mt-10 grid gap-10 lg:grid-cols-3'>
          <div className='space-y-8 lg:col-span-2'>
            {lesson.objective && (
              <section>
                <h2 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>In this lesson</h2>
                <p className='leading-relaxed text-gray-700 dark:text-gray-300'>{lesson.objective}</p>
              </section>
            )}

            <section>
              <h2 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>About this episode</h2>
              <p className='whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300'>
                {lesson.description}
              </p>
              {hasVideo && (
                <a
                  href={watchUrl(lesson.video_ref!)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400'
                >
                  Watch on YouTube <ExternalLink className='h-3.5 w-3.5' />
                </a>
              )}
            </section>

            {lesson.transcript && (
              <details className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
                <summary className='cursor-pointer select-none px-5 py-4 font-semibold text-gray-900 dark:text-white'>
                  Transcript
                </summary>
                <div className='max-h-[32rem] overflow-y-auto whitespace-pre-line border-t border-gray-200 px-5 py-4 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:text-gray-300'>
                  {lesson.transcript}
                </div>
              </details>
            )}
          </div>

          <aside className='space-y-6'>
            {lesson.resources.length > 0 && (
              <section className='rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800'>
                <h2 className='mb-3 font-bold text-gray-900 dark:text-white'>Resources</h2>
                <ul className='space-y-2 text-sm'>
                  {lesson.resources.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1.5 text-blue-600 hover:underline dark:text-blue-400'
                      >
                        {r.label} <ExternalLink className='h-3.5 w-3.5' />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {course.product && (
              <section className='rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/40'>
                <h2 className='mb-1 font-bold text-gray-900 dark:text-white'>{course.product.title}</h2>
                {course.product.tagline && (
                  <p className='mb-3 text-sm text-gray-700 dark:text-gray-300'>{course.product.tagline}</p>
                )}
                <Link
                  href={`/products/${course.product.slug}`}
                  className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300'
                >
                  <Package className='h-4 w-4' /> See the finished product
                </Link>
              </section>
            )}
          </aside>
        </div>

        <nav className='mt-12 grid gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2'>
          {prev ? (
            <Link
              href={`/courses/${course.slug}/${prev.slug}`}
              className='rounded-xl border border-gray-200 p-4 hover:border-blue-600 dark:border-gray-700'
            >
              <span className='inline-flex items-center gap-1 text-xs text-gray-500'>
                <ArrowLeft className='h-3 w-3' /> Previous · Part {prev.sort_order}
              </span>
              <span className='mt-1 block font-semibold text-gray-900 dark:text-white'>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className='rounded-xl border border-gray-200 p-4 text-right hover:border-blue-600 dark:border-gray-700'
            >
              <span className='inline-flex items-center gap-1 text-xs text-gray-500'>
                Next · Part {next.sort_order} <ArrowRight className='h-3 w-3' />
              </span>
              <span className='mt-1 block font-semibold text-gray-900 dark:text-white'>{next.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
