import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import {
  Clock,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Tag,
  TrendingUp,
  Bookmark,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Romeo Mukula - Developer Insights & Tutorials',
  description:
    'Explore articles, tutorials, and insights on web development, mobile apps, DevOps, and modern software engineering practices.',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  category: string
  tags: string[] | null
  reading_time_minutes: number | null
  views_count: number | null
  likes_count: number
  comments_count: number
  is_featured: boolean
  is_pinned: boolean
  publish_date: string
  author_name: string
  author_avatar_url: string | null
  code_language: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  post_count: number | null
}

async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .lte('publish_date', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('is_featured', { ascending: false })
    .order('publish_date', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return (data || []) as BlogPost[]
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []) as Category[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(dateString)
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category || 'all'
  const posts = await getBlogPosts(category)
  const categories = await getCategories()

  const featuredPosts = posts.filter((post) => post.is_featured).slice(0, 3)
  const pinnedPosts = posts.filter(
    (post) => post.is_pinned && !post.is_featured,
  )
  const regularPosts = posts.filter(
    (post) => !post.is_featured && !post.is_pinned,
  )

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 sm:py-10 md:py-16 lg:py-20'>
        <div className='absolute inset-0 bg-black/20'></div>
        <div className='container mx-auto px-3 sm:px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full mb-3 sm:mb-4 md:mb-6'>
              <TrendingUp className='w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4' />
              <span className='text-xs sm:text-xs md:text-sm font-medium'>
                Developer Insights & Tutorials
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent'>
              Blog
            </h1>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed'>
              Explore in-depth articles on web development, mobile apps, DevOps,
              and modern software engineering practices
            </p>

            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 px-1 sm:px-2'>
              <Link
                href='/blog?category=all'
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all min-h-9 flex items-center justify-center ${
                  category === 'all' || !category
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.name}`}
                  className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all min-h-9 flex items-center justify-center ${
                    category === cat.name
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <span className='mr-0.5 sm:mr-1'>{cat.icon}</span>
                  <span className='hidden sm:inline'>{cat.name}</span>
                  <span className='sm:hidden'>{cat.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && category === 'all' && (
        <section className='container mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 md:-mt-12 lg:-mt-16 relative z-20 mb-6 sm:mb-8 md:mb-12 lg:mb-16'>
          <div className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl lg:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8'>
            <div className='flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6'>
              <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500' />
              <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
                Featured Posts
              </h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'>
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className='group relative overflow-hidden rounded-xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300'
                >
                  {post.featured_image_url && (
                    <div className='relative h-40 sm:h-44 md:h-48 overflow-hidden'>
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent'></div>
                      {index === 0 && (
                        <div className='absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-yellow-500 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-xs font-bold'>
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  )}

                  <div className='p-3 sm:p-4 md:p-5 lg:p-6'>
                    <div className='flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3'>
                      <span className='text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full'>
                        {post.category}
                      </span>
                      <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {getTimeAgo(post.publish_date)}
                      </span>
                    </div>

                    <h3 className='text-base sm:text-lg md:text-lg font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
                      {post.title}
                    </h3>

                    <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-3.5 md:mb-4 line-clamp-2 leading-relaxed'>
                      {post.excerpt}
                    </p>

                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center gap-2 sm:gap-2.5 md:gap-3'>
                        <span className='flex items-center gap-0.5 sm:gap-1'>
                          <Clock className='w-3 h-3' />
                          {post.reading_time_minutes}min
                        </span>
                        <span className='flex items-center gap-0.5 sm:gap-1'>
                          <Eye className='w-3 h-3' />
                          <span className='hidden xs:inline'>
                            {post.views_count ?? 0}
                          </span>
                          <span className='xs:hidden'>
                            {(post.views_count ?? 0) > 999
                              ? `${((post.views_count ?? 0) / 1000).toFixed(1)}k`
                              : (post.views_count ?? 0)}
                          </span>
                        </span>
                      </div>
                      {post.code_language && (
                        <span className='bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-mono truncate max-w-15 sm:max-w-none'>
                          {post.code_language}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className='container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-12'>
        <div className='grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
          {/* Blog Posts */}
          <div className='lg:col-span-2 space-y-6 sm:space-y-6 md:space-y-8'>
            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className='space-y-2.5 sm:space-y-3 md:space-y-4'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2'>
                  <Bookmark className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600' />
                  Pinned Posts
                </h2>
                {pinnedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} isPinned />
                ))}
              </div>
            )}

            {/* Regular Posts */}
            <div className='space-y-2.5 sm:space-y-3 md:space-y-4'>
              {pinnedPosts.length > 0 && (
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
                  Latest Posts
                </h2>
              )}
              {regularPosts.length > 0 ? (
                regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className='text-center py-8 sm:py-10 md:py-12 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl'>
                  <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400'>
                    No posts found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6'>
            {/* Categories Widget */}
            <div className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-5 md:p-6'>
              <h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-3.5 md:mb-4'>
                Categories
              </h3>
              <div className='space-y-2 sm:space-y-2.5 md:space-y-3'>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.name}`}
                    className='flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group min-h-11'
                    style={{ borderLeft: `3px solid ${cat.color}` }}
                  >
                    <div className='flex items-center gap-2 sm:gap-2.5 md:gap-3 min-w-0'>
                      <span className='text-xl sm:text-2xl shrink-0'>
                        {cat.icon}
                      </span>
                      <div className='min-w-0'>
                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate'>
                          {cat.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {cat.post_count}{' '}
                          {cat.post_count === 1 ? 'post' : 'posts'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            {posts.length > 0 && (
              <div className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-5 md:p-6'>
                <h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-3.5 md:mb-4 flex items-center gap-1.5 sm:gap-2'>
                  <Tag className='w-4 h-4 sm:w-5 sm:h-5' />
                  Popular Tags
                </h3>
                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                  {Array.from(new Set(posts.flatMap((post) => post.tags || [])))
                    .slice(0, 15)
                    .map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className='bg-linear-to-br from-blue-600 to-purple-600 rounded-lg md:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 text-white'>
              <h3 className='text-lg sm:text-xl font-bold mb-1.5 sm:mb-2'>
                📬 Stay Updated
              </h3>
              <p className='text-xs sm:text-sm text-blue-100 mb-3 sm:mb-4 leading-relaxed'>
                Get the latest posts delivered right to your inbox.
              </p>
              <input
                type='email'
                placeholder='your@email.com'
                className='w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 mb-2.5 sm:mb-3 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm'
              />
              <button className='w-full bg-white text-blue-600 font-semibold py-2.5 sm:py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base min-h-11 sm:min-h-0'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogPostCard({
  post,
  isPinned = false,
}: {
  post: BlogPost
  isPinned?: boolean
}) {
  return (
    <article className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group'>
      <div className='flex flex-col md:flex-row'>
        {post.featured_image_url && (
          <Link
            href={`/blog/${post.slug}`}
            className='md:w-1/3 relative h-40 sm:h-44 md:h-auto overflow-hidden'
          >
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-500'
            />
            {isPinned && (
              <div className='absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-purple-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                <Bookmark className='w-3 h-3' />
                <span className='hidden sm:inline'>Pinned</span>
              </div>
            )}
          </Link>
        )}

        <div
          className={`${post.featured_image_url ? 'md:w-2/3' : 'w-full'} p-3 sm:p-4 md:p-5 lg:p-6`}
        >
          {/* Author & Date */}
          <div className='flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2.5 sm:mb-3 md:mb-4'>
            {post.author_avatar_url && (
              <Image
                src={post.author_avatar_url}
                alt={post.author_name}
                width={28}
                height={28}
                className='rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10'
              />
            )}
            <div className='flex-1 min-w-0'>
              <p className='font-medium text-xs sm:text-sm md:text-base text-gray-900 dark:text-white truncate'>
                {post.author_name}
              </p>
              <div className='flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs text-gray-500 dark:text-gray-400'>
                <Calendar className='w-3 h-3 shrink-0' />
                <span className='truncate text-xs'>
                  {formatDate(post.publish_date)}
                </span>
                <span className='hidden sm:inline'>•</span>
                <Clock className='w-3 h-3 hidden sm:inline' />
                <span className='hidden sm:inline'>
                  {post.reading_time_minutes} min
                </span>
              </div>
            </div>
            <span
              className='px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold text-white shrink-0'
              style={{ backgroundColor: getCategoryColor(post.category) }}
            >
              <span className='hidden sm:inline'>{post.category}</span>
              <span className='sm:hidden'>{post.category.split(' ')[0]}</span>
            </span>
          </div>

          {/* Title & Excerpt */}
          <Link href={`/blog/${post.slug}`}>
            <h2 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 md:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug'>
              {post.title}
            </h2>
          </Link>

          <p className='text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-2.5 sm:mb-3 md:mb-4 line-clamp-2 leading-relaxed'>
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4'>
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='px-2 py-0.5 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats & CTA */}
          <div className='flex items-center justify-between pt-2.5 sm:pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs text-gray-500 dark:text-gray-400'>
              <span className='flex items-center gap-0.5 sm:gap-1'>
                <Eye className='w-3 h-3 md:w-4 md:h-4' />
                <span className='hidden sm:inline'>
                  {(post.views_count ?? 0).toLocaleString()}
                </span>
                <span className='sm:hidden'>
                  {(post.views_count ?? 0) > 999
                    ? `${((post.views_count ?? 0) / 1000).toFixed(1)}k`
                    : (post.views_count ?? 0)}
                </span>
              </span>
              <span className='flex items-center gap-0.5 sm:gap-1'>
                <Heart className='w-3 h-3 md:w-4 md:h-4' />
                {post.likes_count}
              </span>
              <span className='flex items-center gap-0.5 sm:gap-1'>
                <MessageCircle className='w-3 h-3 md:w-4 md:h-4' />
                {post.comments_count}
              </span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className='text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-0.5 sm:gap-1 group shrink-0'
            >
              <span className='hidden sm:inline'>Read More</span>
              <span className='sm:hidden'>Read</span>
              <span className='group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform'>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Web Development': '#3B82F6',
    'Mobile Apps': '#8B5CF6',
    DevOps: '#10B981',
    Tutorials: '#F59E0B',
    'Case Studies': '#EF4444',
    News: '#EC4899',
  }
  return colors[category] || '#6B7280'
}
