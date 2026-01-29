'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type AboutPageRow = {
  hero_eyebrow: string | null
  hero_title: string
  hero_subtitle: string | null
  intro: string | null
  mission: string | null
  cta_primary_label: string | null
  cta_primary_href: string | null
  cta_secondary_label: string | null
  cta_secondary_href: string | null
}

type AboutSectionRow = {
  id: string
  title: string | null
  subtitle: string | null
  content: string
  kind: string | null
  sort_order: number | null
}

type AboutTimelineRow = {
  id: string
  country: string
  city: string | null
  title: string
  period: string | null
  description: string
  icon: string | null
  sort_order: number | null
}

type AboutHighlightRow = {
  id: string
  group_key: string
  title: string
  description: string
  icon: string | null
  sort_order: number | null
}

type AboutQuoteRow = {
  id: string
  quote: string
  caption: string | null
  theme: string | null
  sort_order: number | null
}

type SkillRow = {
  id: string
  name: string
  level: number
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 px-3 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-100 backdrop-blur'>
      {children}
    </span>
  )
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className='mb-8'>
      {eyebrow ? (
        <div className='text-xs font-black tracking-wider text-zinc-500 dark:text-zinc-400 mb-2'>
          {eyebrow}
        </div>
      ) : null}
      <h2 className='text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight'>
        {title}
      </h2>
      {subtitle ? (
        <p className='mt-3 text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl'>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

function splitParagraphs(text?: string | null) {
  if (!text) return []
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function pickTopQuote(quotes: AboutQuoteRow[]) {
  const sorted = quotes
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  return sorted[0] ?? null
}

export default function AboutClient({
  aboutPage,
  timeline,
  sections,
  highlights,
  quotes,
  softwareSkills,
}: {
  aboutPage: AboutPageRow | null
  timeline: AboutTimelineRow[]
  sections: AboutSectionRow[]
  highlights: AboutHighlightRow[]
  quotes: AboutQuoteRow[]
  softwareSkills: SkillRow[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const storyRef = useRef<HTMLDivElement>(null)
  const craftToCodeRef = useRef<HTMLDivElement>(null)
  const techStackRef = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)

  // Group highlights
  const craftHighlights = useMemo(
    () => highlights.filter((h) => h.group_key === 'craft_to_code').slice(0, 3),
    [highlights],
  )

  const principleHighlights = useMemo(
    () => highlights.filter((h) => h.group_key === 'principles').slice(0, 6),
    [highlights],
  )

  const heroEyebrow =
    aboutPage?.hero_eyebrow ?? '🌍 Cameroon → Algeria → Italy → Software'
  const heroTitle =
    aboutPage?.hero_title ??
    'I build things that last — first with wood, now with code.'
  const heroSubtitle =
    aboutPage?.hero_subtitle ??
    'From craftsmanship to software engineering (self-taught).'
  const heroIntro =
    aboutPage?.intro ??
    'My story isn’t a “perfect path.” It’s proof that discipline can survive displacement, and that curiosity can become a career — even when life tries to shut every door.'
  const mission =
    aboutPage?.mission ??
    'Build reliable products that solve real problems, with the same responsibility I learned on construction sites.'

  const cta1Label = aboutPage?.cta_primary_label ?? 'View My Work'
  const cta1Href = aboutPage?.cta_primary_href ?? '/projects'
  const cta2Label = aboutPage?.cta_secondary_label ?? 'Back to CV Home'
  const cta2Href = aboutPage?.cta_secondary_href ?? '/'

  const storyParagraphs = useMemo(() => {
    // Prefer CMS paragraphs; fallback to your current ones if none exist
    const fromCms = sections
      .filter((s) => (s.kind ?? '').toLowerCase() === 'story')
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .flatMap((s) => splitParagraphs(s.content))

    if (fromCms.length) return fromCms

    return [
      `Even before I knew what a computer was, I was obsessed with technology. As a kid, I used to spend my lunch money playing video games — not only for fun, but because I kept asking: “How does this work?”`,
      `Life didn’t give me an easy path. The crisis back home, immigration struggle, bureaucracy, and starting from zero taught me something powerful: you can lose everything except your mindset.`,
      `In an immigration center, I started watching tutorials — WordPress first, then coding. I bought domains, practiced daily, and eventually committed fully: YouTube, Udemy, W3Schools… every day.`,
    ]
  }, [sections])

  const topQuote = useMemo(() => pickTopQuote(quotes), [quotes])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context((self) => {
      const q = self.selector
      if (!q) return

      // Ensure visible defaults (prevents half-faded)
      gsap.set(
        [
          q('.js-hero'),
          q('.js-hero-sub'),
          q('.js-fade'),
          q('.js-card'),
          q('.js-tech'),
          q('.js-quote'),
          q('.js-philo'),
          q('.js-close'),
        ],
        { opacity: 1, y: 0, x: 0, scale: 1 },
      )

      // HERO
      gsap.from(q('.js-hero'), {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        overwrite: 'auto',
      })

      gsap.from(q('.js-hero-sub'), {
        opacity: 0,
        y: 18,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: 'auto',
      })

      // STORY
      gsap.from(q('.js-fade'), {
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // CARDS
      gsap.from(q('.js-card'), {
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 80%',
          once: true,
        },
        opacity: 0,
        y: 22,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.12,
        ease: 'back.out(1.2)',
        overwrite: 'auto',
      })

      // CRAFT → CODE
      gsap.from(q('.js-quote'), {
        scrollTrigger: {
          trigger: craftToCodeRef.current,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      })

      // TECH
      gsap.from(q('.js-tech'), {
        scrollTrigger: {
          trigger: techStackRef.current,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 14,
        scale: 0.98,
        duration: 0.45,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      })

      // PHILOSOPHY
      gsap.from(q('.js-philo'), {
        scrollTrigger: {
          trigger: philosophyRef.current,
          start: 'top 85%',
          once: true,
        },
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto',
      })

      // CLOSING
      gsap.from(q('.js-close'), {
        scrollTrigger: {
          trigger: closingRef.current,
          start: 'top 90%',
          once: true,
        },
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      // Background parallax
      gsap.to(q('.gradient-bg'), {
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        backgroundPosition: '50% 100%',
        overwrite: 'auto',
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
      setTimeout(() => ScrollTrigger.refresh(), 150)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // timeline cards (CMS)
  const timelineCards = useMemo(() => {
    const sorted = timeline
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    // For your current layout, keep 3 cards (Cameroon/Algeria/Italy) if present
    const prefer = ['Cameroon', 'Algeria', 'Italy']
    const picked = prefer
      .map((c) =>
        sorted.find((x) => x.country.toLowerCase() === c.toLowerCase()),
      )
      .filter(Boolean) as AboutTimelineRow[]

    // If not found, fallback first 3
    return picked.length ? picked.slice(0, 3) : sorted.slice(0, 3)
  }, [timeline])

  // tech stack from skills (software category)
  const techCards = useMemo(() => {
    // Deduplicate skills by name (case-insensitive)
    const seen = new Set<string>()
    const uniqueSkills = softwareSkills.filter((s) => {
      const key = s.name.toLowerCase().trim()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    const list = uniqueSkills.slice(0, 16)

    // Comprehensive emoji mapping for production-ready tech stack
    const map: Record<string, string> = {
      // Frontend
      react: '⚛️',
      'next.js': '▲',
      next: '▲',
      'react native': '📱',
      typescript: '💎',
      javascript: '🟡',
      vue: '💚',
      angular: '🅰️',

      // Backend
      node: '🟢',
      'node.js': '🟢',
      express: '🚂',
      nestjs: '🐈',
      python: '🐍',
      django: '🎸',
      flask: '🧪',

      // Databases
      postgresql: '🐘',
      postgres: '🐘',
      mongodb: '🍃',
      mysql: '🐬',
      redis: '🔴',

      // Cloud & Infrastructure
      aws: '☁️',
      'amazon web services': '☁️',
      'google cloud': '☁️',
      gcp: '☁️',
      azure: '☁️',
      vercel: '▲',
      netlify: '💠',
      heroku: '💜',

      // DevOps & CI/CD
      docker: '🐳',
      kubernetes: '⚓',
      k8s: '⚓',
      'github actions': '⚙️',
      gitlab: '🦊',
      jenkins: '🔧',
      'ci/cd': '🔄',
      terraform: '🏗️',

      // Backend as a Service
      supabase: '⚡',
      firebase: '🔥',

      // Testing & Quality
      jest: '🃏',
      cypress: '🌲',
      playwright: '🎭',
      testing: '✅',
      'unit testing': '✅',

      // Security & Monitoring
      sentry: '🚨',
      datadog: '🐕',
      grafana: '📊',
      security: '🔒',

      // Tools & Others
      git: '📦',
      github: '🐙',
      vscode: '💻',
      linux: '🐧',
      nginx: '🟩',
      graphql: '💜',
      rest: '🔌',
      'rest api': '🔌',
    }

    const iconFor = (name: string) => {
      const key = name.trim().toLowerCase()
      return map[key] ?? '🧩'
    }

    return list.map((s) => ({
      id: s.id,
      name: s.name,
      icon: iconFor(s.name),
    }))
  }, [softwareSkills])

  return (
    <div ref={containerRef} className='relative overflow-hidden'>
      {/* Background */}
      <div
        className='gradient-bg fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20'
        style={{ backgroundSize: '200% 200%', backgroundPosition: '50% 0%' }}
      />
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className='max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20'>
        {/* HERO */}
        <section className='relative'>
          <div className='js-hero inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 backdrop-blur'>
            <span className='text-sm font-bold text-blue-700 dark:text-blue-300'>
              {heroEyebrow}
            </span>
          </div>

          <div className='mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
            <div className='lg:col-span-8'>
              <h1 className='js-hero text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-zinc-900 dark:text-white'>
                {heroTitle.includes('—') ? (
                  <>
                    {heroTitle.split('—')[0].trim()} —{' '}
                    <span className='bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600'>
                      {heroTitle.split('—').slice(1).join('—').trim()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600'>
                      {heroTitle}
                    </span>
                  </>
                )}
              </h1>

              <p className='js-hero-sub mt-6 text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed'>
                {heroIntro}
              </p>

              <p className='js-hero-sub mt-4 text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed'>
                {heroSubtitle}
              </p>

              <div className='js-hero-sub mt-6 flex flex-wrap gap-2'>
                <Pill>Full-Stack Mindset</Pill>
                <Pill>Construction Discipline</Pill>
                <Pill>Self-Taught Developer</Pill>
                <Pill>Build → Ship → Improve</Pill>
              </div>

              <div className='js-hero-sub mt-10 flex flex-col sm:flex-row gap-3'>
                <Link
                  href={cta1Href}
                  className='rounded-2xl px-6 py-3 font-black text-white bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95 text-center'
                >
                  {cta1Label}
                </Link>
                <Link
                  href={cta2Href}
                  className='rounded-2xl px-6 py-3 font-black border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur text-zinc-900 dark:text-white hover:shadow text-center'
                >
                  {cta2Label}
                </Link>
              </div>
            </div>

            <div className='lg:col-span-4'>
              <div className='js-hero-sub rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur p-6 shadow-xl'>
                <div className='text-xs font-black tracking-wider text-zinc-500 dark:text-zinc-400'>
                  THE DIFFERENCE
                </div>

                <div className='mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed'>
                  <p>
                    <span className='font-bold text-zinc-900 dark:text-white'>
                      Craftsmanship
                    </span>{' '}
                    taught me precision.
                  </p>
                  <p>
                    <span className='font-bold text-zinc-900 dark:text-white'>
                      Migration
                    </span>{' '}
                    taught me resilience.
                  </p>
                  <p>
                    <span className='font-bold text-zinc-900 dark:text-white'>
                      Software
                    </span>{' '}
                    gave me a way to scale creativity — globally.
                  </p>
                </div>

                <div className='mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-3 text-center'>
                  <div>
                    <div className='text-xl font-black text-zinc-900 dark:text-white'>
                      {Math.max(3, (timeline?.length ?? 0) > 0 ? 3 : 3)}+
                    </div>
                    <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                      Countries
                    </div>
                  </div>
                  <div>
                    <div className='text-xl font-black text-zinc-900 dark:text-white'>
                      2
                    </div>
                    <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                      Industries
                    </div>
                  </div>
                  <div>
                    <div className='text-xl font-black text-zinc-900 dark:text-white'>
                      1
                    </div>
                    <div className='text-xs text-zinc-500 dark:text-zinc-400'>
                      Mission
                    </div>
                  </div>
                </div>

                <div className='mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800'>
                  <div className='text-xs font-black tracking-wider text-zinc-500 dark:text-zinc-400'>
                    MISSION
                  </div>
                  <p className='mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed'>
                    {mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section ref={storyRef} className='mt-20 md:mt-28'>
          <SectionTitle
            eyebrow='ORIGIN STORY'
            title={
              topQuote?.quote ??
              'I didn’t come from privilege — I came from persistence.'
            }
            subtitle='A short timeline of how craftsmanship, displacement, and curiosity shaped my mindset.'
          />

          {/* Journey Cards from about_timeline */}
          <div className='grid md:grid-cols-3 gap-6'>
            {timelineCards.map((x) => (
              <div
                key={x.id}
                className='js-card group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur p-7 hover:shadow-2xl transition'
              >
                <div className='absolute inset-0 bg-linear-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500' />
                <div className='relative'>
                  <div className='text-4xl'>{x.icon ?? '🌍'}</div>
                  <h3 className='mt-3 text-xl font-black text-zinc-900 dark:text-white'>
                    {x.country}
                  </h3>

                  {x.title ? (
                    <p className='mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                      {x.title}
                      {x.period ? (
                        <span className='text-zinc-500 dark:text-zinc-400'>
                          {' '}
                          • {x.period}
                        </span>
                      ) : null}
                    </p>
                  ) : null}

                  <p className='mt-3 text-zinc-700 dark:text-zinc-300 leading-relaxed'>
                    {x.description}
                  </p>

                  {x.city ? (
                    <p className='mt-3 text-sm text-zinc-500 dark:text-zinc-400'>
                      📍 {x.city}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* paragraphs from about_sections (kind=story) */}
          <div className='mt-10 space-y-5 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed'>
            {storyParagraphs.map((p, idx) => (
              <p key={idx} className='js-fade'>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* CRAFT → CODE (highlights group_key=craf_to_code) */}
        <section ref={craftToCodeRef} className='mt-20 md:mt-28'>
          <div className='js-quote relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-800 text-white p-10 md:p-14 shadow-2xl'>
            <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl' />
            <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl' />

            <div className='relative'>
              <div className='text-xs font-black tracking-wider text-zinc-300'>
                CRAFT → SOFTWARE TRANSLATION
              </div>

              <h3 className='mt-4 text-3xl md:text-4xl font-black leading-tight'>
                {topQuote?.quote?.includes('measure') ? (
                  <>
                    {topQuote.quote.split(':')[0] ||
                      'The same mindset builds a door and a product'}
                    :
                    <span className='block bg-clip-text text-transparent bg-linear-to-r from-blue-300 via-purple-300 to-pink-300'>
                      {topQuote.quote.includes('—')
                        ? topQuote.quote.split('—').slice(1).join('—').trim()
                        : 'measure twice, ship once — and own the result.'}
                    </span>
                  </>
                ) : (
                  <>
                    The same mindset builds a door and a product:
                    <span className='block bg-clip-text text-transparent bg-linear-to-r from-blue-300 via-purple-300 to-pink-300'>
                      measure twice, ship once — and own the result.
                    </span>
                  </>
                )}
              </h3>

              <div className='mt-8 grid md:grid-cols-3 gap-4'>
                {(craftHighlights.length
                  ? craftHighlights
                  : [
                      {
                        id: 'p1',
                        title: 'Precision',
                        description: 'clean UI, typed code, fewer bugs',
                        icon: '🎯',
                      },
                      {
                        id: 'p2',
                        title: 'Discipline',
                        description: 'consistent learning, consistent shipping',
                        icon: '⚙️',
                      },
                      {
                        id: 'p3',
                        title: 'Responsibility',
                        description: 'I don’t hide behind excuses — I deliver',
                        icon: '🧱',
                      },
                    ]
                ).map(
                  (x: {
                    id: string
                    title: string
                    description: string
                    icon: string | null
                  }) => (
                    <div
                      key={x.id}
                      className='rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur'
                    >
                      <div className='text-2xl'>{x.icon ?? '🧩'}</div>
                      <div className='mt-3 font-black text-white'>
                        {x.title}
                      </div>
                      <div className='mt-2 text-sm text-zinc-300 leading-relaxed'>
                        {x.description}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* TECH STACK (from skills category=Software) */}
        <section ref={techStackRef} className='mt-20 md:mt-28'>
          <SectionTitle
            eyebrow='TOOLKIT'
            title='Modern stack, practical mindset.'
            subtitle='I build web and mobile products using proven tools — and I care about reliability more than hype.'
          />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
            {(techCards.length
              ? techCards
              : [
                  { id: 't1', name: 'React & Next.js', icon: '⚛️' },
                  { id: 't2', name: 'React Native', icon: '📱' },
                  { id: 't3', name: 'TypeScript', icon: '💎' },
                  { id: 't4', name: 'Node.js', icon: '🟢' },
                  { id: 't5', name: 'PostgreSQL', icon: '🐘' },
                  { id: 't6', name: 'MongoDB', icon: '🍃' },
                  { id: 't7', name: 'Supabase', icon: '⚡' },
                  { id: 't8', name: 'Cloud (Basics)', icon: '☁️' },
                ]
            ).map((tech) => (
              <div
                key={tech.id}
                className='js-tech group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur p-5 hover:shadow-xl transition'
              >
                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-blue-500/8 via-purple-500/8 to-pink-500/8' />
                <div className='relative flex items-center gap-3'>
                  <div className='text-3xl'>{tech.icon}</div>
                  <div className='font-black text-zinc-900 dark:text-white'>
                    {tech.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY (from highlights group_key=principles) */}
        <section ref={philosophyRef} className='mt-20 md:mt-28'>
          <div className='js-philo rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/40 backdrop-blur p-10 md:p-14 shadow-xl'>
            <SectionTitle
              eyebrow='PRINCIPLES'
              title='My philosophy is simple.'
              subtitle='I don’t chase perfection. I chase progress — with clarity, structure, and real outcomes.'
            />

            <div className='grid md:grid-cols-2 gap-6'>
              {(principleHighlights.length
                ? principleHighlights
                : [
                    {
                      id: 'a',
                      title: 'Build for real people',
                      description:
                        'If it doesn’t solve a real problem, it’s just decoration.',
                      icon: '🧠',
                    },
                    {
                      id: 'b',
                      title: 'Ship with responsibility',
                      description:
                        'I care about reliability, performance, and clean execution.',
                      icon: '✅',
                    },
                    {
                      id: 'c',
                      title: 'Learn fast, adapt faster',
                      description:
                        'New environment? New stack? I don’t panic — I learn.',
                      icon: '🚀',
                    },
                    {
                      id: 'd',
                      title: 'Respect the craft',
                      description:
                        'Whether it’s wood or code, quality is a mindset.',
                      icon: '🪵',
                    },
                  ]
              ).map(
                (x: {
                  id: string
                  title: string
                  description: string
                  icon: string | null
                }) => (
                  <div
                    key={x.id}
                    className='rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-6'
                  >
                    <div className='text-2xl'>{x.icon ?? '🧩'}</div>
                    <div className='mt-3 text-lg font-black text-zinc-900 dark:text-white'>
                      {x.title}
                    </div>
                    <div className='mt-2 text-zinc-600 dark:text-zinc-300 leading-relaxed'>
                      {x.description}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section ref={closingRef} className='mt-20 md:mt-28 text-center'>
          <div className='js-close text-3xl md:text-4xl font-black text-zinc-900 dark:text-white leading-tight'>
            I’ve worked on construction sites and in codebases —
          </div>
          <div className='js-close mt-3 text-2xl md:text-3xl font-black leading-tight'>
            and that combination makes me{' '}
            <span className='bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-pink-600'>
              disciplined, creative, and reliable.
            </span>
          </div>

          <div className='js-close mt-8 flex flex-col sm:flex-row justify-center gap-3'>
            <Link
              href='/projects'
              className='rounded-2xl px-6 py-3 font-black text-white bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-95'
            >
              See Projects
            </Link>
            <Link
              href='/contact'
              className='rounded-2xl px-6 py-3 font-black border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur text-zinc-900 dark:text-white hover:shadow'
            >
              Contact Me
            </Link>
          </div>

          <p className='js-close mt-6 text-sm text-zinc-600 dark:text-zinc-400'>
            If you want someone who can learn fast, ship clean, and bring
            discipline into products — let’s talk.
          </p>
        </section>
      </div>
    </div>
  )
}
