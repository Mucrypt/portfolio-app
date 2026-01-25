'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Play,
  Award,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Download,
  ExternalLink,
  Calendar,
  Building,
  Languages,
  Star,
  Target,
  Zap,
  Heart,
  Coffee,
  ChevronDown,
  Sun,
  Loader2,
  Users,
  Rocket,
  Terminal,
  Cpu,
  Database,
  Cloud,
  Shield,
  Network,
  BarChart,
  PieChart,
  TrendingUp,
  Command,
  GitBranch,
  Server,
  Lock,
  Globe as GlobeIcon,
  MessageSquare,
  Code2,
  Layers,
  Box,
  TerminalSquare,
  Workflow,
  Palette,
  Smartphone,
  Globe as Earth,
  Wind,
  Zap as Lightning,
  Hexagon,
  CircuitBoard,
  Binary,
  Atom,
  Brain,
  LineChart,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
  Map,
  Briefcase as Case,
} from 'lucide-react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Profile = {
  id: string
  owner_user_id: string | null
  full_name: string
  headline: string | null
  bio: string | null
  location: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  cv_url: string | null
  hero_video_url: string | null
  hero_background_image: string | null
  socials: any | null
  role_tags: string[] | null
}

type Experience = {
  id: string
  company: string
  title: string
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean | null
  highlights: string[] | null
}

type Skill = {
  id: string
  name: string
  category: string
  level: number
}

type Education = {
  id: string
  school: string
  program: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  notes: string | null
}

type Certificate = {
  id: string
  name: string
  issuer: string | null
  url: string | null
  year: number | null
}

type Language = {
  id: string
  name: string
  level: string | null
}

type Project = {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  featured: boolean | null
  project_links: Array<{
    label: string
    url: string
  }>
}

export default function ArchivesPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [playingVideo, setPlayingVideo] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isClient, setIsClient] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const heroRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Pick the most recently updated profile (avoids `.single()` breaking if multiple profiles exist).
        const profileRes = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!profileRes.data) {
          setProfile(null)
          return
        }

        const activeProfile = profileRes.data as Profile
        setProfile(activeProfile)

        // Align with admin behavior: all portfolio tables are scoped by `owner_user_id`.
        const ownerUserId = activeProfile.owner_user_id
        if (!ownerUserId) {
          console.warn(
            'profiles.owner_user_id is missing; skipping owner-scoped fetches',
          )
          return
        }

        const [
          experiencesRes,
          skillsRes,
          educationRes,
          certificatesRes,
          languagesRes,
          projectsRes,
          projectsCountRes,
        ] = await Promise.all([
          supabase
            .from('experiences')
            .select('*')
            .eq('owner_user_id', ownerUserId)
            .order('start_date', { ascending: false }),
          supabase
            .from('skills')
            .select('*')
            .eq('owner_user_id', ownerUserId)
            .order('sort_order', { ascending: true }),
          supabase
            .from('education')
            .select('*')
            .eq('owner_user_id', ownerUserId)
            .order('start_date', { ascending: false }),
          supabase
            .from('certificates')
            .select('*')
            .eq('owner_user_id', ownerUserId)
            .order('year', { ascending: false }),
          supabase
            .from('languages')
            .select('*')
            .eq('owner_user_id', ownerUserId)
            .order('sort_order', { ascending: true }),
          supabase
            .from('projects')
            .select('*, project_links(*)')
            .eq('owner_user_id', ownerUserId)
            .eq('featured', true)
            .order('sort_order', { ascending: true })
            .limit(6),
          supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('owner_user_id', ownerUserId),
        ])

        if (experiencesRes.data)
          setExperiences(experiencesRes.data as Experience[])
        if (skillsRes.data) setSkills(skillsRes.data as Skill[])
        if (educationRes.data) setEducation(educationRes.data as Education[])
        if (certificatesRes.data)
          setCertificates(certificatesRes.data as Certificate[])
        if (languagesRes.data) setLanguages(languagesRes.data as Language[])
        if (projectsRes.data) setProjects(projectsRes.data as Project[])
        setProjectCount(projectsCountRes.count ?? 0)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!profile || loading || !isClient) return

    // Create master timeline
    const masterTimeline = gsap.timeline()

    // Hero animations
    const heroTimeline = gsap.timeline({ delay: 0.2 })
    heroTimeline
      .from('.hero-badge', {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
      .from(
        '.hero-avatar',
        {
          opacity: 0,
          scale: 0.5,
          rotation: -180,
          duration: 1,
          ease: 'back.out(1.7)',
        },
        '-=0.4',
      )
      .from(
        '.hero-name',
        {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.6',
      )
      .from(
        '.hero-headline',
        {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.6',
      )
      .from(
        '.hero-tag',
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.4',
      )
      .from(
        '.hero-contact',
        {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4',
      )

    // Stats counter animation
    const statCards = document.querySelectorAll('.stat-card')
    statCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 70%',
        },
        immediateRender: false,
        y: 100,
        opacity: 0,
        rotation: 10,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
      })
    })

    // Skills bars animation
    const skillBars = document.querySelectorAll('.skill-bar')
    skillBars.forEach((bar, index) => {
      gsap.from(bar, {
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 70%',
        },
        immediateRender: false,
        width: 0,
        duration: 1.5,
        delay: index * 0.05,
        ease: 'power2.out',
      })
    })

    // Experience cards stagger
    const experienceCards = document.querySelectorAll('.experience-card')
    gsap.from(experienceCards, {
      scrollTrigger: {
        trigger: experienceRef.current,
        start: 'top 70%',
      },
      immediateRender: false,
      x: -100,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
    })

    // Project cards grid
    const projectCards = document.querySelectorAll('.project-card')
    gsap.from(projectCards, {
      scrollTrigger: {
        trigger: projectsRef.current,
        start: 'top 70%',
      },
      immediateRender: false,
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })

    // Floating elements
    gsap.to('.float-slow', {
      y: -30,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    gsap.to('.float-medium', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5,
    })

    gsap.to('.float-fast', {
      y: -15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1,
    })

    // Rotate decorative elements
    gsap.to('.rotate-slow', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
    })

    // Tech stack floating
    gsap.to('.tech-float', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    })

    // Scroll observer for active section
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    sections.forEach((section) => observer.observe(section))

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      observer.disconnect()
    }
  }, [profile, loading, isClient])

  const handlePlayVideo = () => {
    setPlayingVideo(true)
  }

  useEffect(() => {
    if (!playingVideo) {
      videoRef.current?.pause()
      return
    }

    const play = async () => {
      try {
        await videoRef.current?.play()
      } catch {
        // Ignore autoplay/play errors (browser policies, etc.)
      }
    }

    void play()
  }, [playingVideo])

  const formatDate = (date: string | null) => {
    if (!date) return ''
    const d = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(d)
  }

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, any> = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      website: Globe,
    }
    return icons[platform.toLowerCase()] || Globe
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const safeExternalUrl = (value: string | null | undefined) => {
    if (!value) return null
    try {
      const url = new URL(value)
      if (url.protocol === 'http:' || url.protocol === 'https:')
        return url.toString()
      return null
    } catch {
      return null
    }
  }

  const calculateYearsExperience = (items: Experience[]) => {
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000
    const timestamps = items
      .map((exp) => (exp.start_date ? new Date(exp.start_date).getTime() : NaN))
      .filter((t) => Number.isFinite(t)) as number[]

    if (timestamps.length === 0) return 0
    const earliest = Math.min(...timestamps)
    const yearsFloat = (Date.now() - earliest) / msPerYear
    if (!Number.isFinite(yearsFloat) || yearsFloat <= 0) return 0
    return Math.max(1, Math.floor(yearsFloat))
  }

  // Add a fallback for when the page loads
  if (!isClient || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-zinc-950'>
        <div className='text-center'>
          <div className='relative'>
            <div className='h-24 w-24 rounded-full border-4 border-blue-600/20 animate-ping absolute' />
            <div className='h-24 w-24 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-pink-600 border-l-blue-600 animate-spin' />
          </div>
          <p className='mt-8 text-xl text-gray-600 dark:text-zinc-400 font-bold'>
            Loading Professional Profile...
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-zinc-950'>
        <div className='text-center'>
          <div className='h-24 w-24 rounded-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6'>
            <span className='text-4xl font-black text-white'>!</span>
          </div>
          <p className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Profile Not Configured
          </p>
          <p className='text-gray-600 dark:text-zinc-400 mb-6'>
            Please configure your profile in the admin panel.
          </p>
          <Link
            href='/admin/archives'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg transition-all'
          >
            Configure Profile
          </Link>
        </div>
      </div>
    )
  }

  const socials = (profile.socials || {}) as Record<string, string>
  const totalExperience = calculateYearsExperience(experiences)
  const totalProjects = projectCount || projects.length
  const totalSkills = skills.length
  const totalCertificates = certificates.length

  const heroVideoUrl = safeExternalUrl(profile.hero_video_url)
  const heroBackgroundImageUrl = safeExternalUrl(profile.hero_background_image)

  // Tech stack icons
  const techIcons = [
    { icon: Terminal, color: 'text-blue-500' },
    { icon: Cpu, color: 'text-purple-500' },
    { icon: Database, color: 'text-green-500' },
    { icon: Cloud, color: 'text-cyan-500' },
    { icon: Shield, color: 'text-red-500' },
    { icon: Network, color: 'text-yellow-500' },
    { icon: GitBranch, color: 'text-pink-500' },
    { icon: Server, color: 'text-indigo-500' },
  ]

  return (
    <div
      className={`min-h-screen ${theme === 'light' ? 'bg-linear-to-br from-gray-50 to-white' : 'bg-linear-to-br from-gray-900 to-zinc-950'} transition-colors duration-500`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${theme === 'light' ? 'bg-white text-gray-900 shadow-lg' : 'bg-zinc-800 text-white shadow-lg'} hover:scale-110 transition-all duration-300 backdrop-blur-sm`}
      >
        <Sun className='h-5 w-5' />
      </button>

      {/* Navigation Dots */}
      <div className='fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3'>
        {['hero', 'stats', 'experience', 'skills', 'projects', 'contact'].map(
          (section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 w-4 h-4'
                  : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400'
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(section)?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              <span className='sr-only'>{section}</span>
            </a>
          ),
        )}
      </div>

      {/* Animated Tech Elements */}
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        {techIcons.map((tech, idx) => {
          const Icon = tech.icon
          return (
            <div
              key={idx}
              className={`absolute tech-float ${tech.color} opacity-5 dark:opacity-10`}
              style={{
                left: `${(idx + 1) * 12}%`,
                top: `${(idx * 15) % 100}%`,
                fontSize: '2rem',
              }}
            >
              <Icon className='h-12 w-12' />
            </div>
          )
        })}
      </div>

      {/* HERO SECTION */}
      <section
        id='hero'
        ref={heroRef}
        className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6'
      >
        {/* Hero Media Background (admin-managed) */}
        {heroBackgroundImageUrl && !playingVideo && (
          <Image
            src={heroBackgroundImageUrl}
            alt=''
            fill
            priority
            sizes='100vw'
            className='absolute inset-0 -z-10 object-cover'
          />
        )}
        {heroVideoUrl && playingVideo && (
          <video
            ref={videoRef}
            className='absolute inset-0 -z-10 h-full w-full object-cover'
            src={heroVideoUrl}
            muted
            loop
            playsInline
            preload='metadata'
          />
        )}
        {(heroBackgroundImageUrl || (heroVideoUrl && playingVideo)) && (
          <div className='absolute inset-0 -z-10 bg-black/30 dark:bg-black/50' />
        )}

        {/* Animated Grid Background */}
        <div className='absolute inset-0 opacity-5 dark:opacity-10'>
          <div className='absolute inset-0 bg-[linear-gradient(90deg,#333_1px,transparent_1px)] bg-size-[40px_40px]' />
          <div className='absolute inset-0 bg-[linear-gradient(0deg,#333_1px,transparent_1px)] bg-size-[40px_40px]' />
        </div>

        {/* Hero Content */}
        <div className='relative z-10 max-w-7xl mx-auto w-full'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Column - Profile */}
            <div className='space-y-8'>
              {/* Badge */}
              <div className='inline-flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-gray-300 dark:border-white/10 hero-badge'>
                <Sparkles className='h-5 w-5 text-yellow-500 animate-pulse' />
                <span className='text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase'>
                  Enterprise Architect
                </span>
              </div>

              {/* Name & Headline */}
              <div>
                <h1 className='text-5xl md:text-7xl lg:text-8xl font-black mb-4'>
                  <span className='bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600'>
                    {profile.full_name.split(' ')[0]}
                  </span>
                  <br />
                  <span className='text-gray-900 dark:text-white'>
                    {profile.full_name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                {profile.headline && (
                  <p className='text-xl md:text-2xl text-gray-600 dark:text-zinc-300 font-medium mb-6'>
                    {profile.headline}
                  </p>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className='text-lg text-gray-700 dark:text-zinc-300 leading-relaxed max-w-2xl'>
                  {profile.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className='flex flex-wrap gap-4'>
                {profile.location && (
                  <div className='flex items-center gap-2 text-gray-700 dark:text-zinc-300'>
                    <MapPin className='h-5 w-5 text-blue-600' />
                    <span className='font-medium'>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className='flex items-center gap-2 text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    <Mail className='h-5 w-5' />
                    <span className='font-medium'>{profile.email}</span>
                  </a>
                )}
              </div>

              {/* Social Links */}
              <div className='flex items-center gap-4'>
                {Object.entries(socials).map(([platform, url]) => {
                  const safeUrl = safeExternalUrl(url)
                  if (!safeUrl) return null
                  const Icon = getSocialIcon(platform)
                  return (
                    <a
                      key={platform}
                      href={safeUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='p-3 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-700 dark:text-zinc-300 hover:text-white hover:bg-linear-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300'
                    >
                      <Icon className='h-6 w-6' />
                    </a>
                  )
                })}
              </div>

              {/* Optional Hero Reel */}
              {heroVideoUrl && (
                <div>
                  <button
                    type='button'
                    onClick={() => setPlayingVideo((v) => !v)}
                    className='px-6 py-3 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-white dark:hover:bg-white/15 transition-all flex items-center gap-2'
                  >
                    <Play className='h-5 w-5' />
                    {playingVideo ? 'Stop Reel' : 'Play Reel'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Avatar & Stats */}
            <div className='space-y-8'>
              {/* Avatar */}
              {profile.avatar_url && (
                <div className='relative mx-auto lg:mx-0 lg:ml-auto'>
                  <div className='absolute -inset-4 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 blur-3xl animate-pulse' />
                  <div className='relative'>
                    <div className='absolute -inset-2 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl animate-spin opacity-30' />
                    <div className='relative h-64 w-64 rounded-3xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl'>
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        fill
                        className='object-cover'
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {totalExperience}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Years Experience
                  </div>
                </div>
                <div className='p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {totalProjects}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Projects
                  </div>
                </div>
                <div className='p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {totalSkills}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Skills
                  </div>
                </div>
                <div className='p-4 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {totalCertificates}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Certifications
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                {profile.cv_url && (
                  <a
                    href={safeExternalUrl(profile.cv_url) || '#'}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2'
                  >
                    <Download className='h-5 w-5' />
                    Download Resume
                  </a>
                )}
                <Link
                  href='#contact'
                  className='flex-1 px-6 py-3 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2'
                >
                  <MessageSquare className='h-5 w-5' />
                  Contact Me
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
            <ChevronDown className='h-6 w-6 text-gray-400 dark:text-zinc-500' />
          </div>
        </div>
      </section>

      {/* STATS DASHBOARD */}
      <section
        id='stats'
        ref={statsRef}
        className='py-20 px-4 md:px-6 bg-linear-to-b from-transparent to-gray-100/50 dark:to-zinc-900/50'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Key Metrics & Impact
            </h2>
            <p className='text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto'>
              Quantitative overview of professional achievements and delivered
              value across enterprise projects
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='stat-card group p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='p-3 rounded-xl bg-blue-600/10 dark:bg-blue-600/20'>
                  <Briefcase className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {totalExperience}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Years Experience
                  </div>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                Enterprise-level project delivery and architecture
              </p>
            </div>

            <div className='stat-card group p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-purple-600/50 transition-all duration-300'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='p-3 rounded-xl bg-purple-600/10 dark:bg-purple-600/20'>
                  <Rocket className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {totalProjects}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Projects Delivered
                  </div>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                Scalable solutions from concept to production
              </p>
            </div>

            <div className='stat-card group p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-pink-600/50 transition-all duration-300'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='p-3 rounded-xl bg-pink-600/10 dark:bg-pink-600/20'>
                  <Zap className='h-8 w-8 text-pink-600 dark:text-pink-400' />
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {totalSkills}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Technical Skills
                  </div>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                Full-stack proficiency across modern tech stacks
              </p>
            </div>

            <div className='stat-card group p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-green-600/50 transition-all duration-300'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='p-3 rounded-xl bg-green-600/10 dark:bg-green-600/20'>
                  <Award className='h-8 w-8 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {totalCertificates}+
                  </div>
                  <div className='text-sm text-gray-600 dark:text-zinc-400'>
                    Certifications
                  </div>
                </div>
              </div>
              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                Industry-recognized credentials and specializations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section
        id='experience'
        ref={experienceRef}
        className='py-20 px-4 md:px-6 bg-linear-to-b from-gray-100/50 dark:from-zinc-900/50 to-transparent'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2'>
                Professional Journey
              </h2>
              <p className='text-gray-600 dark:text-zinc-400'>
                Enterprise experience and leadership roles
              </p>
            </div>
            <div className='p-3 rounded-xl bg-linear-to-r from-blue-600/10 to-purple-600/10 border border-gray-300 dark:border-white/10'>
              <Case className='h-8 w-8 text-blue-600 dark:text-blue-400' />
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className='experience-card group p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <div className='p-2 rounded-lg bg-blue-600/10 dark:bg-blue-600/20'>
                        <Building className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                      </div>
                      <span className='font-bold text-gray-900 dark:text-white'>
                        {exp.company}
                      </span>
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                      {exp.title}
                    </h3>
                  </div>
                  {exp.is_current && (
                    <span className='px-3 py-1 rounded-full bg-green-600/10 dark:bg-green-600/20 border border-green-600/30 dark:border-green-600/50 text-green-800 dark:text-green-400 text-xs font-bold'>
                      CURRENT
                    </span>
                  )}
                </div>

                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-zinc-400 mb-4'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    {formatDate(exp.start_date)} -{' '}
                    {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                  </div>
                  {exp.location && (
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      {exp.location}
                    </div>
                  )}
                </div>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className='space-y-2'>
                    {exp.highlights.slice(0, 3).map((highlight, idx) => (
                      <li
                        key={idx}
                        className='flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300'
                      >
                        <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0' />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section
        id='skills'
        ref={skillsRef}
        className='py-20 px-4 md:px-6 bg-linear-to-b from-transparent to-gray-100/50 dark:to-zinc-900/50'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Technical Expertise
            </h2>
            <p className='text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto'>
              Comprehensive skill set across modern development stacks and
              enterprise architecture
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Skills by Category */}
            <div className='space-y-8'>
              {skills
                .reduce(
                  (acc, skill) => {
                    const category = acc.find((c) => c.name === skill.category)
                    if (category) {
                      category.skills.push(skill)
                    } else {
                      acc.push({
                        name: skill.category,
                        skills: [skill],
                      })
                    }
                    return acc
                  },
                  [] as Array<{ name: string; skills: Skill[] }>,
                )
                .slice(0, 3)
                .map((category) => (
                  <div key={category.name} className='space-y-4'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {category.name}
                    </h3>
                    <div className='space-y-3'>
                      {category.skills.slice(0, 5).map((skill) => (
                        <div key={skill.id}>
                          <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                              {skill.name}
                            </span>
                            <span className='text-xs text-gray-600 dark:text-zinc-400'>
                              {skill.level}%
                            </span>
                          </div>
                          <div className='h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden'>
                            <div
                              className='skill-bar h-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full'
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Languages & Certificates */}
            <div className='space-y-8'>
              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                    Languages
                  </h3>
                  <div className='grid grid-cols-2 gap-3'>
                    {languages.map((lang) => (
                      <div
                        key={lang.id}
                        className='p-3 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'
                      >
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {lang.name}
                        </div>
                        <div className='text-xs text-gray-600 dark:text-zinc-400'>
                          {lang.level}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {certificates.length > 0 && (
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                    Certifications
                  </h3>
                  <div className='space-y-3'>
                    {certificates.slice(0, 4).map((cert) => (
                      <a
                        key={cert.id}
                        href={cert.url || '#'}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block p-3 rounded-xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300 group'
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <div className='font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                              {cert.name}
                            </div>
                            <div className='text-xs text-gray-600 dark:text-zinc-400'>
                              {cert.issuer} • {cert.year}
                            </div>
                          </div>
                          <ExternalLink className='h-4 w-4 text-gray-400 dark:text-zinc-500' />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section
        id='projects'
        ref={projectsRef}
        className='py-20 px-4 md:px-6 bg-linear-to-b from-gray-100/50 dark:from-zinc-900/50 to-transparent'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2'>
                Featured Work
              </h2>
              <p className='text-gray-600 dark:text-zinc-400'>
                Enterprise-grade solutions and innovative projects
              </p>
            </div>
            <Link
              href='/projects'
              className='px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2'
            >
              View All
              <ArrowRight className='h-5 w-5' />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className='project-card group block'
              >
                <div className='relative rounded-2xl overflow-hidden bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 hover:border-blue-600/50 transition-all duration-300 h-full'>
                  {project.thumbnail_url && (
                    <div className='relative aspect-video overflow-hidden'>
                      <Image
                        src={project.thumbnail_url}
                        alt={project.title}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                      />
                      <div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                  )}
                  <div className='p-6'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className='text-gray-600 dark:text-zinc-400 mb-4'>
                        {project.description}
                      </p>
                    )}
                    {project.project_links &&
                      project.project_links.length > 0 && (
                        <div className='flex items-center gap-2'>
                          {project.project_links.map((link, idx) => (
                            <span
                              key={idx}
                              className='text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1'
                            >
                              {link.label}
                              <ExternalLink className='h-3 w-3' />
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id='contact'
        ref={contactRef}
        className='py-20 px-4 md:px-6 bg-linear-to-b from-transparent to-gray-100/50 dark:to-zinc-900/50'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
              Let's Build Together
            </h2>
            <p className='text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto'>
              Ready to transform your vision into enterprise-grade solutions?
              Let's discuss your next project.
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Contact Info */}
            <div className='space-y-6'>
              <div className='p-6 rounded-2xl bg-linear-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                  Contact Information
                </h3>
                <div className='space-y-4'>
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className='flex items-center gap-3 text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    >
                      <Mail className='h-5 w-5' />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className='flex items-center gap-3 text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                    >
                      <Phone className='h-5 w-5' />
                      <span>{profile.phone}</span>
                    </a>
                  )}
                  {profile.location && (
                    <div className='flex items-center gap-3 text-gray-700 dark:text-zinc-300'>
                      <MapPin className='h-5 w-5' />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className='p-6 rounded-2xl bg-linear-to-r from-green-600/10 to-blue-600/10 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                  Availability
                </h3>
                <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                  <CheckCircle className='h-5 w-5' />
                  <span className='font-medium'>Open for Opportunities</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='lg:col-span-2'>
              <div className='p-8 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                  Start a Conversation
                </h3>
                <form className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2'>
                        Name
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600'
                        placeholder='Your name'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        className='w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600'
                        placeholder='your@email.com'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2'>
                      Project Type
                    </label>
                    <select className='w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600'>
                      <option value=''>Select project type</option>
                      <option value='web'>Web Development</option>
                      <option value='mobile'>Mobile App</option>
                      <option value='saas'>SaaS Platform</option>
                      <option value='consulting'>Technical Consulting</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2'>
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className='w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600'
                      placeholder='Tell me about your project...'
                    />
                  </div>
                  <button
                    type='submit'
                    className='w-full px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-xl transition-all hover:scale-105'
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className='py-8 px-4 md:px-6 border-t border-gray-300 dark:border-white/10'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-8 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
                <span className='text-sm font-bold text-white'>R</span>
              </div>
              <div>
                <div className='text-sm font-bold text-gray-900 dark:text-white'>
                  {profile.full_name}
                </div>
                <div className='text-xs text-gray-600 dark:text-zinc-400'>
                  Enterprise Architect & Full-Stack Developer
                </div>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null
                const Icon = getSocialIcon(platform)
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                  >
                    <Icon className='h-5 w-5' />
                  </a>
                )
              })}
            </div>
            <div className='text-sm text-gray-600 dark:text-zinc-400'>
              © {new Date().getFullYear()} Professional Archives
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
