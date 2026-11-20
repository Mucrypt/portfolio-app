import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react'
import { requireAdmin } from '@/lib/auth/checkAdmin'
import { getAdminCourse, type AdminLesson } from '@/lib/catalog/admin'
import { formatDuration, lessonImage, watchUrl } from '@/lib/catalog/youtube'
import { PublishModuleButton, PublishToggle } from '../PublishControls'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Course | Admin', robots: { index: false } }

function formatUpdated(iso: string) {
  return `${new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC`
}

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin()
  const { slug } = await params
  const course = await getAdminCourse(slug)
  if (!course) notFound()

  const groups = [
    ...course.modules.map((m) => ({
      key: m.id,
      moduleId: m.id as string | null,
      title: m.title,
      lessons: course.lessons.filter((l) => l.module_id === m.id),
    })),
    {
      key: 'none',
      moduleId: null,
      title: 'Lessons without a module',
      lessons: course.lessons.filter((l) => !l.module_id || !course.modules.some((m) => m.id === l.module_id)),
    },
  ].filter((g) => g.lessons.length > 0 || g.moduleId !== null)

  const published = course.lessons.filter((l) => l.is_published).length
  const withVideo = course.lessons.filter((l) => !!l.video_ref).length

  return (
    <div className='space-y-6'>
      <Link
        href='/admin/courses'
        className='inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400'
      >
        <ArrowLeft className='h-4 w-4' /> All courses
      </Link>

      <div className='rounded-lg bg-white p-6 shadow dark:bg-zinc-800'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{course.title}</h1>
            <p className='mt-1 text-xs text-gray-500'>
              {course.external_id} · from {course.source} · updated {formatUpdated(course.updated_at)}
            </p>
            {course.product && (
              <p className='mt-2 text-sm text-gray-700 dark:text-gray-300'>
                Product:{' '}
                <Link href={`/products/${course.product.slug}`} className='text-blue-700 hover:underline dark:text-blue-400'>
                  {course.product.title}
                </Link>
              </p>
            )}
          </div>
          <div className='text-right text-sm'>
            {published > 0 ? (
              <a
                href={`/courses/${course.slug}`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800 hover:underline dark:bg-green-900/40 dark:text-green-300'
              >
                Live on the site <ExternalLink className='h-3.5 w-3.5' />
              </a>
            ) : (
              <span className='rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700 dark:bg-zinc-700 dark:text-gray-300'>
                Hidden until a lesson is published
              </span>
            )}
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              {course.lessons.length} lessons · {withVideo} with video · {published} published
            </p>
          </div>
        </div>
      </div>

      {groups.map((group) => {
        const ready = group.lessons.filter((l) => !l.is_published && !!l.video_ref).length
        return (
          <section key={group.key} className='overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800'>
            <header className='flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-zinc-700'>
              <div>
                <h2 className='font-semibold text-gray-900 dark:text-white'>{group.title}</h2>
                <p className='text-xs text-gray-500'>
                  {group.lessons.length} lessons · {group.lessons.filter((l) => l.is_published).length} published
                </p>
              </div>
              <PublishModuleButton courseId={course.id} moduleId={group.moduleId} ready={ready} />
            </header>

            {group.lessons.length === 0 ? (
              <p className='px-4 py-6 text-sm text-gray-500'>No lessons in this module yet.</p>
            ) : (
              <ul className='divide-y divide-gray-100 dark:divide-zinc-700'>
                {group.lessons.map((lesson) => (
                  <LessonRow key={lesson.id} lesson={lesson} courseSlug={course.slug} />
                ))}
              </ul>
            )}
          </section>
        )
      })}

      <p className='text-xs text-gray-500'>
        YouTube&apos;s own privacy status isn&apos;t checked here. Only publish a lesson once its video is public (or
        unlisted) on YouTube, otherwise visitors see YouTube&apos;s error player.
      </p>
    </div>
  )
}

function LessonRow({ lesson, courseSlug }: { lesson: AdminLesson; courseSlug: string }) {
  const image = lessonImage(lesson)
  const duration = formatDuration(lesson.duration_seconds)

  return (
    <li className='flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center'>
      <div className='relative aspect-video w-full shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-zinc-700 sm:w-32'>
        {image ? (
          <Image src={image} alt='' fill sizes='128px' className='object-cover' />
        ) : (
          <span className='absolute inset-0 flex items-center justify-center text-xs text-gray-500'>No video yet</span>
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <p className='text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400'>
          Part {lesson.sort_order}
          {duration && <span className='ml-2 font-normal normal-case text-gray-500'>· {duration}</span>}
        </p>
        <p className='truncate font-medium text-gray-900 dark:text-white' title={lesson.title}>
          {lesson.title}
        </p>
        <p className='mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500'>
          <span>{lesson.has_transcript ? 'Transcript ✓' : 'No transcript'}</span>
          {lesson.video_ref ? (
            <a
              href={watchUrl(lesson.video_ref)}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-700 hover:underline dark:text-blue-400'
            >
              YouTube ↗
            </a>
          ) : (
            <span>No video_ref</span>
          )}
          {lesson.short_ref && <span>Short ✓</span>}
          <span>Updated {formatUpdated(lesson.updated_at)}</span>
        </p>
      </div>

      <div className='flex items-center gap-4 sm:justify-end'>
        <Link
          href={`/admin/courses/${courseSlug}/preview/${lesson.slug}`}
          className='inline-flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300'
        >
          <Eye className='h-4 w-4' /> Preview
        </Link>
        <div className='flex items-center gap-2'>
          <span className='w-16 text-right text-xs text-gray-500'>{lesson.is_published ? 'Published' : 'Hidden'}</span>
          <PublishToggle
            lessonId={lesson.id}
            published={lesson.is_published}
            hasVideo={!!lesson.video_ref}
            title={lesson.title}
          />
        </div>
      </div>
    </li>
  )
}
