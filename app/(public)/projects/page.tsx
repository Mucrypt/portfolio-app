import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import {
  Award,
  Calendar,
  ExternalLink,
  Github,
  Users,
  Star,
  Clock,
  TrendingUp,
  Code,
  Sparkles,
  Globe,
  FileText,
  Play,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch published projects from Supabase with all enhanced fields
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('show_in_portfolio', true)
    .order('display_priority', { ascending: false })
    .order('created_at', { ascending: false })

  // Get featured projects
  const featuredProjects =
    projects?.filter((p) => p.featured && p.is_published) || []

  // Get all categories
  const categories = Array.from(
    new Set(projects?.map((p) => p.category).filter(Boolean)),
  )

  // Get award-winning projects
  const awardWinningProjects =
    projects?.filter((p) => p.is_award_winning && p.is_published) || []

  return (
    <div className='min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6'>
            Featured Projects
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed'>
            Explore my portfolio of{' '}
            <strong className='text-gray-900 dark:text-white'>
              real, production-ready solutions
            </strong>{' '}
            that solve real problems. Each project showcases technical
            expertise, innovative thinking, and measurable results.
          </p>

          {/* Stats Bar */}
          <div className='mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                {projects?.length || 0}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Total Projects
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='text-3xl font-bold text-purple-600 dark:text-purple-400'>
                {featuredProjects.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Featured
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='text-3xl font-bold text-yellow-600 dark:text-yellow-400'>
                {awardWinningProjects.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Award-Winning
              </div>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
              <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                {categories.length}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Categories
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className='mb-20'>
            <div className='flex items-center gap-3 mb-8'>
              <Star className='w-8 h-8 text-yellow-500' />
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Featured Projects
              </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {featuredProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className='group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300'
                >
                  {/* Project Image */}
                  <div className='relative h-64 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden'>
                    {project.featured_image_url || project.thumbnail_url ? (
                      <Image
                        src={
                          project.featured_image_url || project.thumbnail_url!
                        }
                        alt={project.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <Code className='w-24 h-24 text-white/30' />
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className='absolute top-4 left-4 flex flex-wrap gap-2'>
                      {project.featured && (
                        <span className='px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1'>
                          <Star className='w-3 h-3' />
                          Featured
                        </span>
                      )}
                      {project.is_award_winning && (
                        <span className='px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1'>
                          <Award className='w-3 h-3' />
                          Award Winner
                        </span>
                      )}
                      {project.is_highlighted && (
                        <span className='px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1'>
                          <Sparkles className='w-3 h-3' />
                          Highlighted
                        </span>
                      )}
                    </div>

                    {/* Quick Links Overlay */}
                    <div className='absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform'
                          title='View Live Project'
                        >
                          <ExternalLink className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform'
                          title='View Source Code'
                        >
                          <Github className='w-5 h-5 text-gray-900 dark:text-white' />
                        </a>
                      )}
                      {project.demo_video_url && (
                        <a
                          href={project.demo_video_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform'
                          title='Watch Demo'
                        >
                          <Play className='w-5 h-5 text-red-600 dark:text-red-400' />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-6'>
                    {/* Category & Status */}
                    <div className='flex items-center gap-2 mb-3'>
                      {project.category && (
                        <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full'>
                          {project.category}
                        </span>
                      )}
                      {project.status && (
                        <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full'>
                          {project.status}
                        </span>
                      )}
                      {project.is_open_source && (
                        <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full'>
                          Open Source
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {project.title}
                    </h3>

                    {/* Tagline */}
                    {project.tagline && (
                      <p className='text-sm font-medium text-blue-600 dark:text-blue-400 mb-3'>
                        {project.tagline}
                      </p>
                    )}

                    {/* Summary */}
                    {project.summary && (
                      <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>
                        {project.summary}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className='flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400'>
                      {project.year && (
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-4 h-4' />
                          <span>{project.year}</span>
                        </div>
                      )}
                      {project.client_name && (
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          <span>{project.client_name}</span>
                        </div>
                      )}
                      {project.duration_months && (
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          <span>{project.duration_months} months</span>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className='flex flex-wrap gap-2 mb-4'>
                        {project.tech_stack.slice(0, 6).map((tech, idx) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full'
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 6 && (
                          <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full'>
                            +{project.tech_stack.length - 6} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Key Features */}
                    {project.key_features &&
                      project.key_features.length > 0 && (
                        <div className='mb-4'>
                          <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            Key Features:
                          </h4>
                          <ul className='space-y-1'>
                            {project.key_features
                              .slice(0, 3)
                              .map((feature, idx) => (
                                <li
                                  key={idx}
                                  className='text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2'
                                >
                                  <span className='text-blue-500 mt-1'>✓</span>
                                  <span className='line-clamp-1'>
                                    {feature}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}

                    {/* Testimonial Preview */}
                    {project.testimonial && project.testimonial_author && (
                      <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-blue-500'>
                        <p className='text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2 mb-2'>
                          "{project.testimonial}"
                        </p>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold'>
                          — {project.testimonial_author}
                          {project.testimonial_position &&
                            `, ${project.testimonial_position}`}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
                        >
                          <Globe className='w-4 h-4' />
                          View Live
                        </a>
                      )}
                      {project.case_study_url && (
                        <a
                          href={project.case_study_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
                        >
                          <FileText className='w-4 h-4' />
                          Case Study
                        </a>
                      )}
                      {!project.live_url &&
                        !project.case_study_url &&
                        project.github_url && (
                          <a
                            href={project.github_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
                          >
                            <Github className='w-4 h-4' />
                            View Code
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects Section */}
        <div>
          <div className='flex items-center gap-3 mb-8'>
            <Code className='w-8 h-8 text-blue-600 dark:text-blue-400' />
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              All Projects
            </h2>
          </div>

          {projects && projects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'
                >
                  {/* Project Thumbnail */}
                  <div className='relative h-48 bg-linear-to-br from-gray-400 to-gray-600 overflow-hidden'>
                    {project.thumbnail_url ? (
                      <Image
                        src={project.thumbnail_url}
                        alt={project.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                    ) : (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <Code className='w-16 h-16 text-white/30' />
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className='absolute top-3 left-3 flex flex-col gap-2'>
                      {project.featured && (
                        <span className='px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-lg'>
                          ⭐ Featured
                        </span>
                      )}
                      {project.is_award_winning && (
                        <span className='px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded shadow-lg'>
                          🏆 Award
                        </span>
                      )}
                    </div>

                    {/* Gallery Indicator */}
                    {project.gallery_images &&
                      project.gallery_images.length > 0 && (
                        <div className='absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center gap-1'>
                          <Image
                            src='/placeholder.svg'
                            alt=''
                            width={12}
                            height={12}
                            className='w-3 h-3'
                          />
                          {project.gallery_images.length} images
                        </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    {/* Category */}
                    {project.category && (
                      <div className='mb-3'>
                        <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full'>
                          {project.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1'>
                      {project.title}
                    </h3>

                    {/* Tagline or Summary */}
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                      {project.tagline || project.summary}
                    </p>

                    {/* Meta Info */}
                    <div className='flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-500'>
                      {project.year && (
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' />
                          {project.year}
                        </div>
                      )}
                      {project.status && (
                        <span className='px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded'>
                          {project.status}
                        </span>
                      )}
                    </div>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className='flex flex-wrap gap-1 mb-4'>
                        {project.tech_stack.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className='px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded'
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded'>
                            +{project.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick Links */}
                    <div className='flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700'>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded text-center transition-colors'
                          title='View Live'
                        >
                          Live Site
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded transition-colors'
                          title='GitHub'
                        >
                          <Github className='w-4 h-4' />
                        </a>
                      )}
                      {project.case_study_url && (
                        <a
                          href={project.case_study_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded transition-colors'
                          title='Case Study'
                        >
                          <FileText className='w-4 h-4' />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700'>
              <Code className='w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                No Projects Yet
              </h3>
              <p className='text-gray-500 dark:text-gray-500'>
                Check back soon for exciting new projects!
              </p>
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className='mt-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Have a Project in Mind?
          </h2>
          <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>
            Let's work together to bring your ideas to life. I'm always open to
            discussing new projects, creative ideas, or opportunities to be part
            of your vision.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/contact'
              className='px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg'
            >
              Get in Touch
            </Link>
            <Link
              href='/services'
              className='px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors'
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
