'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Code,
  Users,
  Star,
  Play,
  Quote,
  TrendingUp,
  Zap,
  Target,
  Lightbulb,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

type JourneyContent = {
  id: string
  hero_title: string
  hero_subtitle: string | null
  hero_background_image: string | null
  hero_background_video: string | null
  story_sections: any[]
  milestones: any[]
  skills_journey: any[]
  photo_gallery: any[]
  video_gallery: any[]
  testimonials: any[]
  core_values: any[]
  philosophy_statement: string | null
  fun_facts: any[]
  social_impact: any
  cta_title: string | null
  cta_description: string | null
  cta_button_text: string | null
  cta_button_link: string | null
  show_timeline: boolean
  show_gallery: boolean
  show_testimonials: boolean
  show_stats: boolean
}

const categoryIcons = {
  education: GraduationCap,
  career: Briefcase,
  achievement: Award,
  personal: Heart,
}

export default function JourneyPage() {
  const [content, setContent] = useState<JourneyContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchJourneyContent()
  }, [])

  useEffect(() => {
    if (!content || loading) return

    // Hero Animation
    const heroTimeline = gsap.timeline()
    heroTimeline
      .from('.hero-title', {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power4.out',
      })
      .from(
        '.hero-subtitle',
        {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.6',
      )
      .from(
        '.hero-scroll-indicator',
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        '-=0.3',
      )

    // Stats Counter Animation
    if (content.show_stats && statsRef.current) {
      const statElements = statsRef.current.querySelectorAll('.stat-number')
      statElements.forEach((element) => {
        const target = parseInt(element.getAttribute('data-target') || '0')
        ScrollTrigger.create({
          trigger: element,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(element, {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function () {
                const value = Math.ceil(
                  (this.targets()[0] as HTMLElement).innerText as any,
                )
                ;(element as HTMLElement).innerText = value.toLocaleString()
              },
            })
          },
          once: true,
        })
      })
    }

    // Timeline Items Animation
    if (content.show_timeline && timelineRef.current) {
      const timelineItems =
        timelineRef.current.querySelectorAll('.timeline-item')
      timelineItems.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        })
      })
    }

    // Story Sections Parallax
    const storySections = document.querySelectorAll('.story-section')
    storySections.forEach((section) => {
      const image = section.querySelector('.story-image')
      if (image) {
        gsap.to(image, {
          y: -50,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    })

    // Gallery Animation
    if (content.show_gallery && galleryRef.current) {
      const galleryItems = galleryRef.current.querySelectorAll('.gallery-item')
      galleryItems.forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: (index % 4) * 0.1,
        })
      })
    }

    // Testimonials Animation
    const testimonials = document.querySelectorAll('.testimonial-card')
    testimonials.forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Values Cards Animation
    const valueCards = document.querySelectorAll('.value-card')
    valueCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        rotateY: 90,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: index * 0.15,
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [content, loading])

  async function fetchJourneyContent() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('journey_content')
        .select('*')
        .eq('published', true)
        .single()

      if (error) throw error
      setContent({
        ...data,
        story_sections: (data.story_sections as any) || [],
        milestones: (data.milestones as any) || [],
        skills_journey: (data.skills_journey as any) || [],
        photo_gallery: (data.photo_gallery as any) || [],
        video_gallery: (data.video_gallery as any) || [],
        testimonials: (data.testimonials as any) || [],
        core_values: (data.core_values as any) || [],
        fun_facts: (data.fun_facts as any) || [],
        social_impact: (data.social_impact as any) || {},
        show_timeline: data.show_timeline ?? false,
        show_gallery: data.show_gallery ?? false,
        show_testimonials: data.show_testimonials ?? false,
        show_stats: data.show_stats ?? false,
      })
    } catch (error) {
      console.error('Error fetching journey content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-brrom-purple-900 via-blue-900 to-indigo-900'>
        <div className='relative'>
          <div className='w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin' />
          <div
            className='absolute inset-0 w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin'
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black text-white'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Journey Coming Soon</h1>
          <p className='text-gray-400'>The story is being written...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='relative overflow-hidden bg-black'>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className='relative min-h-screen flex items-center justify-center overflow-hidden'
      >
        {/* Background Video/Image */}
        {content.hero_background_video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className='absolute inset-0 w-full h-full object-cover opacity-40'
          >
            <source src={content.hero_background_video} type='video/mp4' />
          </video>
        ) : content.hero_background_image ? (
          <Image
            src={content.hero_background_image}
            alt='Hero background'
            fill
            className='object-cover opacity-40'
            priority
          />
        ) : (
          <div className='absolute inset-0 bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-80' />
        )}

        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -top-48 -left-48 animate-pulse' />
          <div
            className='absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 -bottom-48 -right-48 animate-pulse'
            style={{ animationDelay: '1s' }}
          />
          <div
            className='absolute w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Content */}
        <div className='relative z-10 text-center px-4 max-w-5xl mx-auto'>
          <h1 className='hero-title text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight'>
            {content.hero_title}
          </h1>
          {content.hero_subtitle && (
            <p className='hero-subtitle text-xl md:text-2xl lg:text-3xl text-purple-300 font-light max-w-3xl mx-auto leading-relaxed'>
              {content.hero_subtitle}
            </p>
          )}

          {/* Scroll Indicator */}
          <div className='hero-scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2'>
            <div className='flex flex-col items-center gap-2 text-white/70 animate-bounce'>
              <span className='text-sm font-medium'>Scroll to explore</span>
              <div className='w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2'>
                <div className='w-1 h-3 bg-white/70 rounded-full' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Stats */}
      {content.show_stats &&
        content.social_impact &&
        Object.keys(content.social_impact).length > 0 && (
          <section
            ref={statsRef}
            className='py-24 bg-linear-to-b from-black via-zinc-900 to-black'
          >
            <div className='max-w-7xl mx-auto px-4'>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
                {content.social_impact.projects_completed && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-4'>
                      <Target className='w-8 h-8 text-purple-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.projects_completed}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      Projects Completed
                    </div>
                  </div>
                )}
                {content.social_impact.years_experience && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-2xl mb-4'>
                      <TrendingUp className='w-8 h-8 text-blue-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.years_experience}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      Years Experience
                    </div>
                  </div>
                )}
                {content.social_impact.clients_served && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4'>
                      <Users className='w-8 h-8 text-green-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.clients_served}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      Clients Served
                    </div>
                  </div>
                )}
                {content.social_impact.cups_of_coffee && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-2xl mb-4'>
                      <Zap className='w-8 h-8 text-amber-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.cups_of_coffee}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      Cups of Coffee
                    </div>
                  </div>
                )}
                {content.social_impact.lines_of_code && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-2xl mb-4'>
                      <Code className='w-8 h-8 text-pink-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.lines_of_code}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      Lines of Code
                    </div>
                  </div>
                )}
                {content.social_impact.github_stars && (
                  <div className='text-center'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4'>
                      <Star className='w-8 h-8 text-yellow-400' />
                    </div>
                    <div
                      className='stat-number text-4xl font-black text-white mb-2'
                      data-target={content.social_impact.github_stars}
                    >
                      0
                    </div>
                    <div className='text-sm text-gray-400 font-medium'>
                      GitHub Stars
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      {/* Story Sections */}
      {content.story_sections && content.story_sections.length > 0 && (
        <section className='py-24 bg-black'>
          {content.story_sections.map((section: any, index: number) => (
            <div
              key={section.id || index}
              className={`story-section max-w-7xl mx-auto px-4 ${index > 0 ? 'mt-32' : ''}`}
            >
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  section.layout === 'right' ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Text Content */}
                <div
                  className={`space-y-6 ${section.layout === 'right' ? 'lg:order-2' : ''}`}
                >
                  {section.year && (
                    <div className='inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30'>
                      <Calendar className='w-4 h-4 text-purple-400' />
                      <span className='text-sm font-semibold text-purple-300'>
                        {section.year}
                      </span>
                    </div>
                  )}
                  <h2 className='text-4xl md:text-5xl font-black text-white leading-tight'>
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className='text-xl text-purple-300 font-medium'>
                      {section.subtitle}
                    </p>
                  )}
                  <div className='prose prose-invert prose-lg max-w-none'>
                    <p className='text-gray-300 leading-relaxed'>
                      {section.content}
                    </p>
                  </div>
                  {section.achievements && section.achievements.length > 0 && (
                    <div className='space-y-3 mt-8'>
                      {section.achievements.map(
                        (achievement: string, i: number) => (
                          <div key={i} className='flex items-start gap-3'>
                            <Award className='w-5 h-5 text-yellow-400 shrink-0 mt-1' />
                            <span className='text-gray-300'>{achievement}</span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  {section.tags && section.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-6'>
                      {section.tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          className='px-3 py-1 bg-zinc-800 text-purple-300 text-sm rounded-full border border-purple-500/30'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                {section.images && section.images.length > 0 && (
                  <div
                    className={`relative ${section.layout === 'right' ? 'lg:order-1' : ''}`}
                  >
                    <div className='story-image relative h-96 lg:h-125 rounded-2xl overflow-hidden'>
                      <Image
                        src={section.images[0]}
                        alt={section.title}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent' />
                    </div>
                    {section.images.length > 1 && (
                      <div className='grid grid-cols-2 gap-4 mt-4'>
                        {section.images
                          .slice(1, 3)
                          .map((img: string, i: number) => (
                            <div
                              key={i}
                              className='relative h-48 rounded-xl overflow-hidden'
                            >
                              <Image
                                src={img}
                                alt=''
                                fill
                                className='object-cover'
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Timeline */}
      {content.show_timeline &&
        content.milestones &&
        content.milestones.length > 0 && (
          <section
            ref={timelineRef}
            className='py-24 bg-linear-to-brom-black via-zinc-900 to-black'
          >
            <div className='max-w-5xl mx-auto px-4'>
              <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                  Milestones & Achievements
                </h2>
                <p className='text-xl text-gray-400'>
                  Key moments that shaped my journey
                </p>
              </div>

              <div className='relative'>
                {/* Timeline Line */}
                <div className='absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-500 via-blue-500 to-pink-500 hidden lg:block' />

                <div className='space-y-12'>
                  {content.milestones.map((milestone: any, index: number) => {
                    const Icon =
                      categoryIcons[
                        milestone.category as keyof typeof categoryIcons
                      ] || Award
                    const isEven = index % 2 === 0

                    return (
                      <div
                        key={milestone.id || index}
                        className={`timeline-item relative flex items-center ${
                          isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        }`}
                      >
                        {/* Content */}
                        <div
                          className={`w-full lg:w-5/12 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}
                        >
                          <div className='bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-purple-500/50 transition-colors'>
                            <div
                              className={`flex items-center gap-3 mb-3 ${isEven ? 'lg:justify-end' : ''}`}
                            >
                              <div className='flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full'>
                                <Calendar className='w-4 h-4 text-purple-400' />
                                <span className='text-sm font-semibold text-purple-300'>
                                  {milestone.month} {milestone.year}
                                </span>
                              </div>
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>
                              {milestone.title}
                            </h3>
                            <p className='text-gray-400'>
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        {/* Icon */}
                        <div className='absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-linear-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-black shadow-lg shadow-purple-500/50 lg:flex'>
                          <Icon className='w-8 h-8 text-white' />
                        </div>

                        {/* Spacer */}
                        <div className='hidden lg:block lg:w-5/12' />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Core Values */}
      {content.core_values && content.core_values.length > 0 && (
        <section className='py-24 bg-black'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                Core Values & Philosophy
              </h2>
              {content.philosophy_statement && (
                <p className='text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed'>
                  {content.philosophy_statement}
                </p>
              )}
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {content.core_values.map((value: any, index: number) => (
                <div
                  key={index}
                  className='value-card group bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105'
                >
                  <div className='w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                    <Lightbulb className='w-7 h-7 text-purple-400' />
                  </div>
                  <h3 className='text-xl font-bold text-white mb-2'>
                    {value.title}
                  </h3>
                  <p className='text-gray-400'>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {content.show_gallery &&
        content.photo_gallery &&
        content.photo_gallery.length > 0 && (
          <section
            ref={galleryRef}
            className='py-24 bg-linear-to-b from-black via-zinc-900 to-black'
          >
            <div className='max-w-7xl mx-auto px-4'>
              <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                  Moments Captured
                </h2>
                <p className='text-xl text-gray-400'>
                  A visual journey through time
                </p>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {content.photo_gallery.map((photo: any, index: number) => (
                  <div
                    key={photo.id || index}
                    className='gallery-item group relative aspect-square rounded-xl overflow-hidden cursor-pointer'
                  >
                    <Image
                      src={photo.url}
                      alt={photo.caption || ''}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='absolute bottom-0 left-0 right-0 p-4'>
                        {photo.caption && (
                          <p className='text-white text-sm font-medium'>
                            {photo.caption}
                          </p>
                        )}
                        {photo.year && (
                          <p className='text-purple-300 text-xs mt-1'>
                            {photo.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Video Gallery */}
      {content.video_gallery && content.video_gallery.length > 0 && (
        <section className='py-24 bg-black'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                Video Stories
              </h2>
              <p className='text-xl text-gray-400'>Watch my journey unfold</p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {content.video_gallery.map((video: any, index: number) => (
                <div
                  key={video.id || index}
                  className='group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-zinc-900'
                  onClick={() => setSelectedVideo(video)}
                >
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-linear-to-br from-purple-900 to-blue-900' />
                  )}
                  <div className='absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center'>
                    <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                      <Play className='w-8 h-8 text-white ml-1' fill='white' />
                    </div>
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent'>
                    <h3 className='text-white font-bold'>{video.title}</h3>
                    {video.duration && (
                      <p className='text-purple-300 text-sm mt-1'>
                        {video.duration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4'
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className='relative w-full max-w-5xl aspect-video'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className='absolute -top-12 right-0 text-white hover:text-purple-400 transition-colors'
            >
              <span className='text-4xl'>×</span>
            </button>
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className='w-full h-full rounded-xl'
            />
          </div>
        </div>
      )}

      {/* Testimonials */}
      {content.show_testimonials &&
        content.testimonials &&
        content.testimonials.length > 0 && (
          <section className='py-24 bg-linear-to-b from-black via-zinc-900 to-black'>
            <div className='max-w-7xl mx-auto px-4'>
              <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                  What People Say
                </h2>
                <p className='text-xl text-gray-400'>
                  Testimonials from colleagues and clients
                </p>
              </div>

              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {content.testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={testimonial.id || index}
                    className='testimonial-card bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-purple-500/50 transition-colors'
                  >
                    <Quote className='w-10 h-10 text-purple-400 mb-4' />
                    <p className='text-gray-300 mb-6 leading-relaxed'>
                      "{testimonial.quote}"
                    </p>
                    <div className='flex items-center gap-4'>
                      {testimonial.avatar && (
                        <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className='object-cover'
                          />
                        </div>
                      )}
                      <div>
                        <p className='text-white font-bold'>
                          {testimonial.name}
                        </p>
                        <p className='text-sm text-gray-400'>
                          {testimonial.role}
                        </p>
                        {testimonial.company && (
                          <p className='text-sm text-purple-400'>
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Fun Facts */}
      {content.fun_facts && content.fun_facts.length > 0 && (
        <section className='py-24 bg-black'>
          <div className='max-w-4xl mx-auto px-4'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-black text-white mb-4'>
                Fun Facts About Me
              </h2>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              {content.fun_facts.map((fact: string, index: number) => (
                <div
                  key={index}
                  className='bg-linear-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500 transition-colors'
                >
                  <p className='text-gray-200 text-lg'>{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {content.cta_title && (
        <section className='py-32 bg-linear-to-brrom-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden'>
          {/* Animated Background */}
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 top-0 left-0 animate-pulse' />
            <div
              className='absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-0 right-0 animate-pulse'
              style={{ animationDelay: '1s' }}
            />
          </div>

          <div className='relative z-10 max-w-4xl mx-auto px-4 text-center'>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight'>
              {content.cta_title}
            </h2>
            {content.cta_description && (
              <p className='text-xl text-purple-200 mb-10 leading-relaxed max-w-2xl mx-auto'>
                {content.cta_description}
              </p>
            )}
            {content.cta_button_text && content.cta_button_link && (
              <a
                href={content.cta_button_link}
                className='inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-purple-500/50'
              >
                {content.cta_button_text}
                <Zap className='w-5 h-5' />
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
