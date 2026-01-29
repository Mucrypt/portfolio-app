import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import BlogPostTracker from '@/components/analytics/BlogPostTracker'
import {
  Clock,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Tag,
  User,
  Github,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  content_format: string | null
  featured_image_url: string | null
  featured_video_url: string | null
  image_urls: string[] | null
  video_urls: string[] | null
  category: string
  subcategory: string | null
  tags: string[] | null
  reading_time_minutes: number | null
  views_count: number | null
  likes_count: number | null
  comments_count: number | null
  shares_count: number | null
  publish_date: string | null
  author_user_id: string
  author_name: string | null
  author_avatar_url: string | null
  author_bio: string | null
  meta_title: string | null
  meta_description: string | null
  code_language: string | null
  github_repo_url: string | null
  demo_url: string | null
  series_name: string | null
  series_order: number | null
  related_post_ids: string[] | null
  cta_text: string | null
  cta_url: string | null
  table_of_contents: { heading: string; id: string; level: number }[] | null
}

interface RelatedBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  category: string
  reading_time_minutes: number | null
  publish_date: string | null
}

interface Comment {
  id: string
  content: string
  author_name: string
  author_email: string | null
  likes_count: number | null
  created_at: string | null
  parent_comment_id: string | null
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .lte('publish_date', new Date().toISOString())
    .single()

  if (error || !data) {
    return null
  }

  // Increment view count (fire and forget)
  supabase
    .from('blog_posts')
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq('id', data.id)
    .then()

  return data as BlogPost
}

async function getRelatedPosts(
  postId: string,
  category: string,
  limit = 3,
): Promise<RelatedBlogPost[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select(
      'id, title, slug, excerpt, featured_image_url, category, reading_time_minutes, publish_date',
    )
    .eq('is_published', true)
    .eq('category', category)
    .neq('id', postId)
    .lte('publish_date', new Date().toISOString())
    .order('publish_date', { ascending: false })
    .limit(limit)

  return data || []
}

async function getComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return data || []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.meta_title || `${post.title} | Blog`,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.publish_date || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category)
  const comments = await getComments(post.id)

  // Organize comments by parent/child
  const topLevelComments = comments.filter((c) => !c.parent_comment_id)
  const replies = comments.filter((c) => c.parent_comment_id)

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden'>
      {/* Track blog post view */}
      <BlogPostTracker
        postId={post.id}
        postTitle={post.title}
        category={post.category}
      />

      {/* Back Navigation */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <div className='container mx-auto px-4 py-3 md:py-4'>
          <Link
            href='/blog'
            className='inline-flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
          >
            <ArrowLeft className='w-3 h-3 md:w-4 md:h-4' />
            <span className='hidden sm:inline'>Back to Blog</span>
            <span className='sm:hidden'>Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.featured_image_url && (
        <div className='relative h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden'>
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent'></div>

          {/* Title Overlay on Hero */}
          <div className='absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 lg:p-8 text-white'>
            <div className='container mx-auto px-2 sm:px-0'>
              <div className='max-w-4xl'>
                <div className='flex flex-wrap items-center gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3'>
                  <span className='px-2 py-0.5 md:px-3 md:py-1 bg-blue-600 rounded-full text-xs font-semibold'>
                    {post.category}
                  </span>
                  {post.series_name && (
                    <span className='px-2 py-0.5 md:px-3 md:py-1 bg-purple-600 rounded-full text-xs font-semibold'>
                      {post.series_name} - Part {post.series_order}
                    </span>
                  )}
                </div>
                <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1.5 sm:mb-2 md:mb-3 leading-tight'>
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 line-clamp-2'>
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-12 max-w-full'>
        <div className='grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <article className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg overflow-hidden'>
              {/* Article Header (if no hero image) */}
              {!post.featured_image_url && (
                <div className='p-3 sm:p-4 md:p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700'>
                  <div className='flex flex-wrap items-center gap-1.5 md:gap-2 mb-3 md:mb-4'>
                    <span className='px-2 py-0.5 md:px-3 md:py-1 bg-blue-600 text-white rounded-full text-xs md:text-sm font-semibold'>
                      {post.category}
                    </span>
                    {post.series_name && (
                      <span className='px-2 py-0.5 md:px-3 md:py-1 bg-purple-600 text-white rounded-full text-xs md:text-sm font-semibold'>
                        {post.series_name} - Part {post.series_order}
                      </span>
                    )}
                  </div>
                  <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4 leading-tight'>
                    {post.title}
                  </h1>
                  {post.excerpt && (
                    <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300'>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              )}

              {/* Author & Meta Info */}
              <div className='p-3 sm:p-4 md:p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4'>
                  <div className='flex items-center gap-2.5 sm:gap-3 md:gap-4'>
                    {post.author_avatar_url ? (
                      <Image
                        src={post.author_avatar_url}
                        alt={post.author_name || 'Author'}
                        width={40}
                        height={40}
                        className='rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14'
                      />
                    ) : (
                      <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0'>
                        <User className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white' />
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <p className='font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg truncate'>
                        {post.author_name}
                      </p>
                      {post.author_bio && (
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>
                          {post.author_bio}
                        </p>
                      )}
                      <div className='flex items-center gap-2 md:gap-3 mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3 md:w-4 md:h-4' />
                          <span className='hidden sm:inline'>
                            {post.publish_date
                              ? new Date(post.publish_date).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  },
                                )
                              : 'N/A'}
                          </span>
                          <span className='sm:hidden'>
                            {post.publish_date
                              ? new Date(post.publish_date).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  },
                                )
                              : 'N/A'}
                          </span>
                        </span>
                        <span>•</span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3 md:w-4 md:h-4' />
                          {post.reading_time_minutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className='flex items-center gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                    <button className='flex items-center gap-1 hover:text-red-600 transition-colors min-h-11 sm:min-h-0 -my-2 sm:my-0'>
                      <Heart className='w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5' />
                      <span>{post.likes_count}</span>
                    </button>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5' />
                      <span className='hidden sm:inline'>
                        {(post.views_count || 0).toLocaleString()}
                      </span>
                      <span className='sm:hidden'>
                        {(post.views_count || 0) > 999
                          ? `${((post.views_count || 0) / 1000).toFixed(1)}k`
                          : post.views_count || 0}
                      </span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <MessageCircle className='w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5' />
                      <span>{post.comments_count}</span>
                    </span>
                    <button className='flex items-center gap-1 hover:text-blue-600 transition-colors min-h-11 sm:min-h-0 -my-2 sm:my-0'>
                      <Share2 className='w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5' />
                      <span className='hidden sm:inline'>
                        {post.shares_count}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Video */}
              {post.featured_video_url && (
                <div className='p-3 sm:p-4 md:p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700'>
                  <div className='aspect-video rounded-lg overflow-hidden'>
                    {post.featured_video_url.includes('youtube.com') ||
                    post.featured_video_url.includes('youtu.be') ? (
                      <iframe
                        src={post.featured_video_url.replace(
                          'watch?v=',
                          'embed/',
                        )}
                        className='w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                    ) : (
                      <video controls className='w-full h-full'>
                        <source src={post.featured_video_url} />
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className='p-3 sm:p-4 md:p-6 lg:p-8'>
                <div className='prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none wrap-break-word prose-headings:font-bold prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl lg:prose-h1:text-4xl prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h3:text-base sm:prose-h3:text-lg md:prose-h3:text-xl lg:prose-h3:text-2xl prose-p:text-sm sm:prose-p:text-base prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:break-words prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:break-words prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:text-xs sm:prose-pre:text-sm prose-pre:overflow-x-auto prose-pre:max-w-full prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-lg prose-img:max-w-full prose-ul:text-sm sm:prose-ul:text-base prose-ol:text-sm sm:prose-ol:text-base'>
                  {post.content_format === 'markdown' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={{
                        img: ({ ...props }) => {
                          const src =
                            typeof props.src === 'string' ? props.src : ''
                          return (
                            <Image
                              {...props}
                              src={src}
                              alt={props.alt || ''}
                              width={800}
                              height={600}
                              className='rounded-lg my-4'
                            />
                          )
                        },
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  )}
                </div>

                {/* Additional Images */}
                {post.image_urls && post.image_urls.length > 0 && (
                  <div className='mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4'>
                    {post.image_urls.map((url, index) => (
                      <div
                        key={index}
                        className='relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden'
                      >
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Additional Videos */}
                {post.video_urls && post.video_urls.length > 0 && (
                  <div className='mt-4 sm:mt-6 md:mt-8 space-y-3 sm:space-y-4'>
                    {post.video_urls.map((url, index) => (
                      <div
                        key={index}
                        className='aspect-video rounded-lg overflow-hidden'
                      >
                        {url.includes('youtube.com') ||
                        url.includes('youtu.be') ? (
                          <iframe
                            src={url.replace('watch?v=', 'embed/')}
                            className='w-full h-full'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                          />
                        ) : (
                          <video controls className='w-full h-full'>
                            <source src={url} />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(post.github_repo_url || post.demo_url) && (
                  <div className='mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4'>
                    {post.github_repo_url && (
                      <a
                        href={post.github_repo_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-gray-900 text-white text-sm md:text-base rounded-lg hover:bg-gray-800 transition-colors'
                      >
                        <Github className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='hidden sm:inline'>View on GitHub</span>
                        <span className='sm:hidden'>GitHub</span>
                      </a>
                    )}
                    {post.demo_url && (
                      <a
                        href={post.demo_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors'
                      >
                        <ExternalLink className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='hidden sm:inline'>View Demo</span>
                        <span className='sm:hidden'>Demo</span>
                      </a>
                    )}
                  </div>
                )}

                {/* CTA */}
                {post.cta_text && post.cta_url && (
                  <div className='mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg text-white'>
                    <h3 className='text-base sm:text-lg md:text-xl font-bold mb-2'>
                      {post.cta_text}
                    </h3>
                    <a
                      href={post.cta_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 mt-2 sm:mt-3 md:mt-4 px-4 py-2.5 sm:py-2 md:px-6 md:py-3 bg-white text-blue-600 text-sm md:text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors min-h-11 sm:min-h-0'
                    >
                      Learn More
                      <ChevronRight className='w-4 h-4 md:w-5 md:h-5' />
                    </a>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className='px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 lg:pb-8'>
                  <div className='flex items-center gap-1.5 sm:gap-2 flex-wrap'>
                    <Tag className='w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400' />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className='px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs md:text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className='p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2'>
                  <MessageCircle className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' />
                  Comments ({post.comments_count})
                </h2>

                {topLevelComments.length > 0 ? (
                  <div className='space-y-3 sm:space-y-4 md:space-y-6'>
                    {topLevelComments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        replies={replies.filter(
                          (r) => r.parent_comment_id === comment.id,
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <p className='text-sm md:text-base text-gray-500 dark:text-gray-400 text-center py-6 md:py-8'>
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6'>
            {/* Quick Actions (Sticky) */}
            <div className='lg:sticky lg:top-4 bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-3 sm:p-4 md:p-6'>
              <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-2 sm:space-y-2.5 md:space-y-3'>
                <button className='w-full flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 md:px-4 md:py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm md:text-base rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium min-h-11 sm:min-h-0'>
                  <Heart className='w-4 h-4 md:w-5 md:h-5' />
                  <span className='hidden sm:inline'>Like Post</span>
                  <span className='sm:hidden'>Like</span>
                </button>
                <button className='w-full flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm md:text-base rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium min-h-11 sm:min-h-0'>
                  <Bookmark className='w-4 h-4 md:w-5 md:h-5' />
                  <span className='hidden sm:inline'>Save for Later</span>
                  <span className='sm:hidden'>Save</span>
                </button>
                <button className='w-full flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 md:px-4 md:py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm md:text-base rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors font-medium min-h-11 sm:min-h-0'>
                  <Share2 className='w-4 h-4 md:w-5 md:h-5' />
                  <span className='hidden sm:inline'>Share Post</span>
                  <span className='sm:hidden'>Share</span>
                </button>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className='bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow-lg p-3 sm:p-4 md:p-6'>
                <h3 className='text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4'>
                  Related Posts
                </h3>
                <div className='space-y-2.5 sm:space-y-3 md:space-y-4'>
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className='block group'
                    >
                      <div className='flex gap-2 sm:gap-2.5 md:gap-3'>
                        {relatedPost.featured_image_url && (
                          <div className='relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 rounded-md overflow-hidden'>
                            <Image
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.title}
                              fill
                              className='object-cover group-hover:scale-110 transition-transform'
                            />
                          </div>
                        )}
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug'>
                            {relatedPost.title}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1'>
                            {relatedPost.reading_time_minutes} min read
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CommentCard({
  comment,
  replies,
}: {
  comment: Comment
  replies: Comment[]
}) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4'>
      <div className='flex items-start gap-2 sm:gap-3'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm sm:text-base'>
          {comment.author_name[0].toUpperCase()}
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1'>
            <p className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate'>
              {comment.author_name}
            </p>
            <span className='text-xs text-gray-500 dark:text-gray-400 shrink-0'>
              {comment.created_at
                ? new Date(comment.created_at).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <p className='text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-relaxed'>
            {comment.content}
          </p>
          <div className='flex items-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400'>
            <button className='hover:text-red-600 transition-colors flex items-center gap-1 min-h-8 -my-1'>
              <Heart className='w-3 h-3' />
              {comment.likes_count}
            </button>
            <button className='hover:text-blue-600 transition-colors min-h-8 -my-1'>
              Reply
            </button>
          </div>

          {/* Nested Replies */}
          {replies.length > 0 && (
            <div className='mt-2.5 sm:mt-3 md:mt-4 space-y-2.5 sm:space-y-3 pl-3 sm:pl-4 md:pl-6 border-l-2 border-gray-200 dark:border-gray-700'>
              {replies.map((reply) => (
                <div key={reply.id} className='flex items-start gap-2 sm:gap-3'>
                  <div className='w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0'>
                    {reply.author_name[0].toUpperCase()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1'>
                      <p className='font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate'>
                        {reply.author_name}
                      </p>
                      <span className='text-xs text-gray-500 dark:text-gray-400 shrink-0'>
                        {reply.created_at
                          ? new Date(reply.created_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <p className='text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed'>
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
