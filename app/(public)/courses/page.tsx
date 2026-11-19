import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle, Clock, ArrowRight } from 'lucide-react'
import { listCourses } from '@/lib/catalog/queries'
import { formatDuration } from '@/lib/catalog/youtube'

export const metadata: Metadata = {
  title: 'Free Courses | Romeo Mukulah',
  description:
    'Free video courses where real software gets built from an empty folder to production, every line explained.',
}

export default async function CoursesPage() {
  const courses = await listCourses()

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <header className='mx-auto mb-14 max-w-3xl text-center'>
          <h1 className='mb-5 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl'>
            Free courses
          </h1>
          <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
            Each course builds a real product from an empty folder to production, step by step,
            with every line explained. Watch free here or on YouTube. The finished source code of
            each product is in{' '}
            <Link href='/products' className='font-medium text-blue-600 hover:underline dark:text-blue-400'>
              Products
            </Link>
            .
          </p>
        </header>

        {courses.length === 0 ? (
          <div className='mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700'>
            <PlayCircle className='mx-auto mb-4 h-10 w-10 text-gray-400' />
            <h2 className='mb-2 text-xl font-semibold text-gray-900 dark:text-white'>
              The first course is on its way
            </h2>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              Episodes appear here as they go live on YouTube. In the meantime, see what is being built.
            </p>
            <Link
              href='/products'
              className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700'
            >
              See the products <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        ) : (
          <div className='grid gap-8 md:grid-cols-2'>
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className='group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800'
              >
                <div className='relative aspect-video bg-gray-100 dark:bg-gray-900'>
                  {course.cover_url ? (
                    <Image
                      src={course.cover_url}
                      alt=''
                      fill
                      sizes='(min-width: 768px) 50vw, 100vw'
                      className='object-cover'
                    />
                  ) : (
                    <PlayCircle className='absolute inset-0 m-auto h-14 w-14 text-gray-400' />
                  )}
                  <span className='absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white'>
                    Free
                  </span>
                </div>
                <div className='p-6'>
                  <h2 className='mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                    {course.title}
                  </h2>
                  <p className='mb-4 line-clamp-3 text-gray-600 dark:text-gray-400'>{course.description}</p>
                  <div className='flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='inline-flex items-center gap-1.5'>
                      <PlayCircle className='h-4 w-4' />
                      {course.lesson_count} {course.lesson_count === 1 ? 'episode' : 'episodes'}
                    </span>
                    {formatDuration(course.total_seconds) && (
                      <span className='inline-flex items-center gap-1.5'>
                        <Clock className='h-4 w-4' />
                        {formatDuration(course.total_seconds)}
                      </span>
                    )}
                    {course.product && <span>Builds: {course.product.title}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
