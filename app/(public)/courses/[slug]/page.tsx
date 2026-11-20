import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Lock, PlayCircle, Package } from 'lucide-react'
import { getCourse } from '@/lib/catalog/queries'
import { formatDuration, lessonImage, playlistEmbedUrl } from '@/lib/catalog/youtube'
import type { CourseDetail, Lesson } from '@/lib/catalog/types'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: `${course.title} | ${course.access === 'members' ? 'Members course' : 'Free course'}`,
    description: course.description.slice(0, 160),
  }
}

/** Groups published lessons under their modules; lessons without a module go last. */
function groupLessons(course: CourseDetail) {
  const groups = course.modules
    .map((m) => ({ title: m.title, lessons: course.lessons.filter((l) => l.module_id === m.id) }))
    .filter((g) => g.lessons.length > 0)
  const loose = course.lessons.filter(
    (l) => !l.module_id || !course.modules.some((m) => m.id === l.module_id),
  )
  if (loose.length) groups.push({ title: groups.length ? 'More episodes' : 'Episodes', lessons: loose })
  return groups
}

function LessonRow({ courseSlug, lesson }: { courseSlug: string; lesson: Lesson }) {
  const img = lessonImage(lesson)
  return (
    <Link
      href={`/courses/${courseSlug}/${lesson.slug}`}
      className='group flex gap-4 rounded-xl p-3 transition hover:bg-gray-50 dark:hover:bg-gray-800'
    >
      <div className='relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 sm:w-44'>
        {img ? (
          <Image src={img} alt='' fill sizes='176px' className='object-cover' />
        ) : (
          <PlayCircle className='absolute inset-0 m-auto h-8 w-8 text-gray-400' />
        )}
      </div>
      <div className='min-w-0'>
        <div className='mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
          Part {lesson.sort_order}
          {lesson.locked && (
            <span className='ml-2 inline-flex items-center gap-1 normal-case text-gray-500 dark:text-gray-400'>
              <Lock className='h-3 w-3' /> Members
            </span>
          )}
          {!lesson.locked && lesson.access === 'free_preview' && (
            <span className='ml-2 normal-case text-green-700 dark:text-green-400'>Free preview</span>
          )}
          {formatDuration(lesson.duration_seconds) && (
            <span className='ml-2 font-normal normal-case text-gray-500 dark:text-gray-400'>
              · {formatDuration(lesson.duration_seconds)}
            </span>
          )}
        </div>
        <h3 className='font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
          {lesson.title}
        </h3>
        {lesson.objective && (
          <p className='mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400'>{lesson.objective}</p>
        )}
      </div>
    </Link>
  )
}

export default async function CourseDetailPage({ params }: Params) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()

  const totalSeconds = course.lessons.reduce((s, l) => s + (l.duration_seconds ?? 0), 0)
  const playlist = course.playlist_id ? playlistEmbedUrl(course.playlist_id) : null
  const first = course.lessons[0]

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
        <Link
          href='/courses'
          className='mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400'
        >
          <ArrowLeft className='h-4 w-4' /> All courses
        </Link>

        <header className='mb-10'>
          {course.access === 'members' ? (
            <span className='mb-4 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white'>
              Members course
            </span>
          ) : (
            <span className='mb-4 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white'>
              Free course
            </span>
          )}
          <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-5xl'>{course.title}</h1>
          <p className='mb-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
            {course.description}
          </p>
          <div className='flex flex-wrap items-center gap-5 text-sm text-gray-600 dark:text-gray-400'>
            <span className='inline-flex items-center gap-1.5'>
              <PlayCircle className='h-4 w-4' /> {course.lessons.length}{' '}
              {course.lessons.length === 1 ? 'episode' : 'episodes'} published
            </span>
            {formatDuration(totalSeconds) && (
              <span className='inline-flex items-center gap-1.5'>
                <Clock className='h-4 w-4' /> {formatDuration(totalSeconds)}
              </span>
            )}
          </div>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              href={`/courses/${course.slug}/${first.slug}`}
              className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700'
            >
              <PlayCircle className='h-5 w-5' /> Start with Part {first.sort_order}
            </Link>
            {course.product && (
              <Link
                href={`/products/${course.product.slug}`}
                className='inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-200'
              >
                <Package className='h-5 w-5' /> See {course.product.title}
              </Link>
            )}
          </div>
        </header>

        {playlist && (
          <div className='relative mb-12 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl'>
            <iframe
              src={playlist}
              title={`${course.title} playlist`}
              className='absolute inset-0 h-full w-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            />
          </div>
        )}

        <section aria-labelledby='curriculum'>
          <h2 id='curriculum' className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
            Curriculum
          </h2>
          <div className='space-y-8'>
            {groupLessons(course).map((group) => (
              <div key={group.title}>
                <h3 className='mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                  {group.title}
                </h3>
                <div className='divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white p-2 dark:divide-gray-800 dark:border-gray-700 dark:bg-gray-900'>
                  {group.lessons.map((lesson) => (
                    <LessonRow key={lesson.id} courseSlug={course.slug} lesson={lesson} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
