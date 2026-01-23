import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  thumbnail_url: string | null
  instructor_name: string
  platform: string
  original_price: number | null
  discounted_price: number | null
  currency: string
  duration_hours: number | null
  level: string
  category: string
  rating: number | null
  students_count: number
  tags: string[] | null
  is_featured: boolean
}

function formatPrice(price: number | null, currency: string) {
  if (!price) return 'Free'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    price,
  )
}

function formatDuration(hours: number | null) {
  if (!hours) return ''
  return `${hours}h`
}

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })

  const featuredCourses = (courses || [])
    .filter((c: Course) => c.is_featured)
    .slice(0, 3)
  const allCourses = courses || []

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Background */}
      <div className='fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20' />
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
            </svg>
            Level Up Your Skills
          </div>
          <h1 className='text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6'>
            Recommended Courses
          </h1>
          <p className='text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto'>
            Handpicked courses from top platforms. Learn from the best
            instructors and advance your career with cutting-edge skills.
          </p>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className='mb-20'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-3xl font-black text-zinc-900 dark:text-white'>
                ⭐ Featured Courses
              </h2>
            </div>
            <div className='grid md:grid-cols-3 gap-6'>
              {featuredCourses.map((course: Course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className='group relative'
                >
                  <div className='absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity' />
                  <div className='relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all group-hover:scale-[1.02]'>
                    {/* Thumbnail */}
                    <div className='aspect-video bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden'>
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center text-white text-6xl font-black opacity-20'>
                          📚
                        </div>
                      )}
                      <div className='absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-xs font-black text-zinc-900 dark:text-white'>
                        {course.platform}
                      </div>
                      <div className='absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-black'>
                        ⭐ Featured
                      </div>
                    </div>

                    <div className='p-6'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className='px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold'>
                          {course.category}
                        </span>
                        <span className='px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold'>
                          {course.level}
                        </span>
                      </div>

                      <h3 className='text-xl font-black text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors'>
                        {course.title}
                      </h3>

                      <p className='text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2'>
                        {course.short_description}
                      </p>

                      <div className='flex items-center gap-2 mb-4 text-xs text-zinc-500 dark:text-zinc-400'>
                        <span>👨‍🏫 {course.instructor_name}</span>
                        {course.duration_hours && (
                          <span>
                            • ⏱️ {formatDuration(course.duration_hours)}
                          </span>
                        )}
                      </div>

                      {course.rating && (
                        <div className='flex items-center gap-2 mb-4'>
                          <div className='flex items-center gap-1'>
                            <span className='text-yellow-500'>⭐</span>
                            <span className='text-sm font-bold text-zinc-900 dark:text-white'>
                              {course.rating}
                            </span>
                          </div>
                          {course.students_count > 0 && (
                            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                              ({course.students_count.toLocaleString()}{' '}
                              students)
                            </span>
                          )}
                        </div>
                      )}

                      <div className='flex items-end justify-between'>
                        <div>
                          {course.discounted_price ? (
                            <div className='flex items-center gap-2'>
                              <span className='text-2xl font-black text-zinc-900 dark:text-white'>
                                {formatPrice(
                                  course.discounted_price,
                                  course.currency,
                                )}
                              </span>
                              {course.original_price && (
                                <span className='text-sm text-zinc-400 dark:text-zinc-500 line-through'>
                                  {formatPrice(
                                    course.original_price,
                                    course.currency,
                                  )}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className='text-2xl font-black text-zinc-900 dark:text-white'>
                              {formatPrice(
                                course.original_price,
                                course.currency,
                              )}
                            </span>
                          )}
                        </div>
                        <span className='px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-bold group-hover:shadow-lg transition-shadow'>
                          View Course →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-3xl font-black text-zinc-900 dark:text-white'>
              All Courses ({allCourses.length})
            </h2>
          </div>

          {allCourses.length === 0 ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>📚</div>
              <h3 className='text-2xl font-black text-zinc-900 dark:text-white mb-2'>
                No Courses Yet
              </h3>
              <p className='text-zinc-600 dark:text-zinc-400'>
                Check back soon for new courses!
              </p>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {allCourses.map((course: Course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className='group relative'
                >
                  <div className='relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all group-hover:scale-[1.02]'>
                    {/* Thumbnail */}
                    <div className='aspect-video bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden'>
                      {course.thumbnail_url ? (
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center text-white text-5xl font-black opacity-20'>
                          📚
                        </div>
                      )}
                      <div className='absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 text-xs font-black text-zinc-900 dark:text-white'>
                        {course.platform}
                      </div>
                      {course.is_featured && (
                        <div className='absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-black'>
                          ⭐
                        </div>
                      )}
                    </div>

                    <div className='p-5'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold'>
                          {course.category}
                        </span>
                        <span className='px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold'>
                          {course.level}
                        </span>
                      </div>

                      <h3 className='text-lg font-black text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors'>
                        {course.title}
                      </h3>

                      <div className='flex items-center gap-2 mb-3 text-xs text-zinc-500 dark:text-zinc-400'>
                        <span className='truncate'>
                          👨‍🏫 {course.instructor_name}
                        </span>
                      </div>

                      {course.rating && (
                        <div className='flex items-center gap-2 mb-3'>
                          <span className='text-yellow-500 text-sm'>⭐</span>
                          <span className='text-sm font-bold text-zinc-900 dark:text-white'>
                            {course.rating}
                          </span>
                        </div>
                      )}

                      <div className='flex items-center justify-between'>
                        <div>
                          {course.discounted_price ? (
                            <div className='flex items-center gap-2'>
                              <span className='text-xl font-black text-zinc-900 dark:text-white'>
                                {formatPrice(
                                  course.discounted_price,
                                  course.currency,
                                )}
                              </span>
                              {course.original_price && (
                                <span className='text-xs text-zinc-400 dark:text-zinc-500 line-through'>
                                  {formatPrice(
                                    course.original_price,
                                    course.currency,
                                  )}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className='text-xl font-black text-zinc-900 dark:text-white'>
                              {formatPrice(
                                course.original_price,
                                course.currency,
                              )}
                            </span>
                          )}
                        </div>
                        <span className='text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform'>
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className='relative mt-20'>
          <div className='absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl' />
          <div className='relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm p-12 text-center'>
            <h2 className='text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4'>
              Looking for Custom Training?
            </h2>
            <p className='text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto'>
              I also offer personalized 1-on-1 mentorship and custom training
              programs tailored to your needs.
            </p>
            <Link
              href='/contact'
              className='inline-block px-8 py-4 rounded-xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-xl transition-all hover:scale-105'
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
