/**
 * World-Class Public Courses Page
 * Enterprise-grade design to convert visitors into customers
 * Optimized for sales with videos, images, and professional UI
 */

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import {
  Star,
  Clock,
  Users,
  Award,
  TrendingUp,
  Play,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Heart,
} from 'lucide-react'

type Course = {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string
  thumbnail_url: string | null
  promo_video_url: string | null
  gallery_images: string[] | null
  instructor_name: string
  platform: string
  affiliate_link: string
  original_price: number | null
  discounted_price: number | null
  currency: string | null
  duration_hours: number | null
  level: string | null
  category: string
  language: string | null
  rating: number | null
  students_count: number | null
  what_you_learn: string[] | null
  is_featured: boolean | null
  tags: string[] | null
}

function formatPrice(price: number | null, currency: string | null) {
  if (!price) return 'Free'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(price)
}

function formatDuration(hours: number | null) {
  if (!hours) return ''
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (m > 0) return `${h}h ${m}m`
  return `${h}h`
}

function formatStudents(count: number | null) {
  if (!count) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M+`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`
  return count.toString()
}

export default async function CoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('sort_order', { ascending: true })

  const coursesData: Course[] = courses || []

  const featuredCourses = coursesData.filter((c) => c.is_featured).slice(0, 3)
  const regularCourses = coursesData.filter((c) => !c.is_featured)

  // Calculate stats
  const totalStudents = coursesData.reduce(
    (sum, c) => sum + (c.students_count || 0),
    0,
  )
  const totalHours = coursesData.reduce(
    (sum, c) => sum + (c.duration_hours || 0),
    0,
  )
  const averageRating =
    coursesData.reduce((sum, c) => sum + (c.rating || 0), 0) /
      coursesData.length || 0

  // Get unique categories
  const categories = Array.from(new Set(coursesData.map((c) => c.category)))

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24 overflow-hidden'>
        {/* Animated Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6'>
              <Zap className='w-4 h-4 text-yellow-300' />
              <span>Master In-Demand Skills</span>
            </div>

            <h1 className='text-5xl md:text-6xl font-bold mb-6 leading-tight'>
              Transform Your Career with
              <span className='block bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent'>
                Premium Online Courses
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed'>
              Learn from industry experts and join thousands of successful
              students who've accelerated their careers
            </p>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-8'>
              <div>
                <div className='text-4xl font-bold mb-2'>
                  {formatStudents(totalStudents)}
                </div>
                <div className='text-blue-200'>Students</div>
              </div>
              <div>
                <div className='text-4xl font-bold mb-2'>
                  {coursesData.length}
                </div>
                <div className='text-blue-200'>Courses</div>
              </div>
              <div>
                <div className='text-4xl font-bold mb-2'>
                  {averageRating.toFixed(1)}
                </div>
                <div className='text-blue-200 flex items-center justify-center gap-1'>
                  <Star className='w-4 h-4 text-yellow-300 fill-yellow-300' />
                  Rating
                </div>
              </div>
            </div>

            <div className='flex flex-wrap justify-center gap-4'>
              <a
                href='#courses'
                className='inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105'
              >
                Browse Courses
                <ArrowRight className='w-5 h-5' />
              </a>
              {featuredCourses[0] && (
                <a
                  href={`#course-${featuredCourses[0].id}`}
                  className='inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all'
                >
                  <Play className='w-5 h-5' />
                  See Featured Course
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className='absolute bottom-0 left-0 w-full'>
          <svg
            viewBox='0 0 1440 120'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z'
              fill='currentColor'
              className='text-white dark:text-zinc-950'
            />
          </svg>
        </div>
      </section>

      {/* Featured Courses - Hero Style */}
      {featuredCourses.length > 0 && (
        <section className='py-20 bg-linear-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-bold mb-4'>
                <Award className='w-4 h-4' />
                FEATURED COURSES
              </div>
              <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                Start Learning Today
              </h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                Our most popular courses, trusted by thousands of students
                worldwide
              </p>
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              {featuredCourses.map((course, idx) => (
                <div
                  key={course.id}
                  id={`course-${course.id}`}
                  className='group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-zinc-800'
                >
                  {/* Thumbnail/Video Preview */}
                  <div className='relative h-56 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden'>
                    {course.thumbnail_url ? (
                      <>
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                        {course.promo_video_url && (
                          <div className='absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors'>
                            <div className='w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                              <Play className='w-8 h-8 text-blue-600 ml-1' />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <TrendingUp className='w-20 h-20 text-gray-300 dark:text-zinc-700' />
                      </div>
                    )}

                    {/* Featured Badge */}
                    <div className='absolute top-4 right-4 px-3 py-1 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg'>
                      <Star className='w-3 h-3 fill-white' />
                      Featured
                    </div>

                    {/* Level Badge */}
                    <div className='absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-full text-xs font-bold shadow-lg'>
                      {course.level}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium'>
                        {course.platform}
                      </span>
                      <span className='px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium'>
                        {course.category}
                      </span>
                    </div>

                    <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2'>
                      {course.title}
                    </h3>

                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2'>
                      {course.short_description || course.description}
                    </p>

                    {/* Instructor */}
                    <div className='flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-zinc-800'>
                      <div className='w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                        {course.instructor_name.charAt(0)}
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {course.instructor_name}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Instructor
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-3 gap-2 mb-4'>
                      <div className='text-center'>
                        <div className='flex items-center justify-center gap-1 text-yellow-500 mb-1'>
                          <Star className='w-4 h-4 fill-yellow-500' />
                          <span className='text-sm font-bold text-gray-900 dark:text-white'>
                            {course.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Rating
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='flex items-center justify-center gap-1 mb-1'>
                          <Users className='w-4 h-4 text-blue-500' />
                          <span className='text-sm font-bold text-gray-900 dark:text-white'>
                            {formatStudents(course.students_count)}
                          </span>
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Students
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='flex items-center justify-center gap-1 mb-1'>
                          <Clock className='w-4 h-4 text-purple-500' />
                          <span className='text-sm font-bold text-gray-900 dark:text-white'>
                            {formatDuration(course.duration_hours)}
                          </span>
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Duration
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className='flex items-center justify-between'>
                      <div>
                        {course.discounted_price &&
                        course.discounted_price <
                          (course.original_price || 0) ? (
                          <div>
                            <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                              {formatPrice(
                                course.discounted_price,
                                course.currency,
                              )}
                            </div>
                            <div className='text-sm text-gray-500 dark:text-gray-400 line-through'>
                              {formatPrice(
                                course.original_price,
                                course.currency,
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {formatPrice(
                              course.discounted_price || course.original_price,
                              course.currency,
                            )}
                          </div>
                        )}
                      </div>

                      <a
                        href={course.affiliate_link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105'
                      >
                        Enroll Now
                        <ArrowRight className='w-4 h-4' />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Our Courses */}
      <section className='py-20 bg-white dark:bg-zinc-950'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              Why Students Love Our Courses
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Join thousands of satisfied learners who've transformed their
              careers
            </p>
          </div>

          <div className='grid md:grid-cols-4 gap-8'>
            {[
              {
                icon: Award,
                title: 'Expert Instructors',
                description:
                  'Learn from industry professionals with years of real-world experience',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Target,
                title: 'Project-Based Learning',
                description:
                  'Build real projects and add them to your portfolio',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Zap,
                title: 'Lifetime Access',
                description:
                  'Access course materials anytime, anywhere, forever',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Heart,
                title: 'Community Support',
                description:
                  'Connect with fellow students and get help when needed',
                color: 'from-red-500 to-pink-500',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className='text-center group hover:-translate-y-2 transition-transform duration-300'
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}
                  >
                    <Icon className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* All Courses */}
      {regularCourses.length > 0 && (
        <section id='courses' className='py-20 bg-gray-50 dark:bg-zinc-900'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4'>Explore All Courses</h2>
              <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                Find the perfect course to match your goals and skill level
              </p>
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-3 mb-12'>
              <button className='px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg'>
                All Courses
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className='px-6 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700'
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {regularCourses.map((course) => (
                <div
                  key={course.id}
                  className='bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-zinc-800'
                >
                  {/* Thumbnail */}
                  <div className='relative h-48 bg-linear-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden'>
                    {course.thumbnail_url ? (
                      <>
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className='w-full h-full object-cover'
                        />
                        {course.promo_video_url && (
                          <div className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
                            <div className='w-12 h-12 bg-white/90 rounded-full flex items-center justify-center'>
                              <Play className='w-6 h-6 text-blue-600 ml-1' />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <TrendingUp className='w-16 h-16 text-gray-300 dark:text-zinc-700' />
                      </div>
                    )}

                    <div className='absolute top-3 left-3 px-3 py-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-full text-xs font-bold'>
                      {course.level}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium'>
                        {course.platform}
                      </span>
                      <span className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium'>
                        {course.category}
                      </span>
                    </div>

                    <h3 className='text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2'>
                      {course.title}
                    </h3>

                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>
                      {course.short_description || course.description}
                    </p>

                    <div className='flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400'>
                      <div className='flex items-center gap-1'>
                        <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                        <span className='font-medium'>
                          {course.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Users className='w-4 h-4' />
                        <span>{formatStudents(course.students_count)}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-4 h-4' />
                        <span>{formatDuration(course.duration_hours)}</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800'>
                      <div>
                        {course.discounted_price &&
                        course.discounted_price <
                          (course.original_price || 0) ? (
                          <>
                            <div className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                              {formatPrice(
                                course.discounted_price,
                                course.currency,
                              )}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 line-through'>
                              {formatPrice(
                                course.original_price,
                                course.currency,
                              )}
                            </div>
                          </>
                        ) : (
                          <div className='text-xl font-bold text-gray-900 dark:text-white'>
                            {formatPrice(
                              course.discounted_price || course.original_price,
                              course.currency,
                            )}
                          </div>
                        )}
                      </div>

                      <a
                        href={course.affiliate_link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
                      >
                        Enroll
                        <ArrowRight className='w-4 h-4' />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className='py-20 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Ready to Start Your Learning Journey?
            </h2>
            <p className='text-xl text-white/90 mb-8'>
              Join our community of learners and take the first step towards
              mastering new skills
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <a
                href='#courses'
                className='inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:scale-105'
              >
                Browse All Courses
                <ArrowRight className='w-5 h-5' />
              </a>
              <button className='inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all'>
                <Heart className='w-5 h-5' />
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className='py-16 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                {formatStudents(totalStudents)}
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Happy Students
              </div>
            </div>
            <div>
              <div className='text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
                {Math.round(totalHours)}+
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Hours of Content
              </div>
            </div>
            <div>
              <div className='text-4xl font-bold text-green-600 dark:text-green-400 mb-2'>
                {averageRating.toFixed(1)}
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Average Rating
              </div>
            </div>
            <div>
              <div className='text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2'>
                100%
              </div>
              <div className='text-gray-600 dark:text-gray-400'>
                Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
