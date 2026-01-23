// app/(public)/about/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import AboutClient from './AboutClient'

// minimal types (so you don't have to regenerate db types now)
type AboutPageRow = {
  id: string
  owner_user_id: string
  hero_eyebrow: string | null
  hero_title: string
  hero_subtitle: string | null
  intro: string | null
  mission: string | null
  cta_primary_label: string | null
  cta_primary_href: string | null
  cta_secondary_label: string | null
  cta_secondary_href: string | null
  is_published: boolean | null
  updated_at: string | null
}

type AboutSectionRow = {
  id: string
  owner_user_id: string
  title: string | null
  subtitle: string | null
  content: string
  kind: string | null
  sort_order: number | null
  is_visible: boolean | null
}

type AboutTimelineRow = {
  id: string
  owner_user_id: string
  country: string
  city: string | null
  title: string
  period: string | null
  description: string
  icon: string | null
  sort_order: number | null
  is_visible: boolean | null
}

type AboutHighlightRow = {
  id: string
  owner_user_id: string
  group_key: string
  title: string
  description: string
  icon: string | null
  sort_order: number | null
  is_visible: boolean | null
}

type AboutQuoteRow = {
  id: string
  owner_user_id: string
  quote: string
  caption: string | null
  theme: string | null
  sort_order: number | null
  is_visible: boolean | null
}

type SkillRow = {
  id: string
  owner_user_id: string
  category: string
  name: string
  level: number
  sort_order: number
}

export default async function AboutPage() {
  const supabase = await createClient()

  // 1) pick the published about page (works for your single-user portfolio)
  const { data: aboutPage } = await supabase
    .from('about_page')
    .select('*')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle<AboutPageRow>()

  // if nothing seeded yet, still render with fallback
  const ownerId = aboutPage?.owner_user_id ?? null

  const [
    { data: timeline },
    { data: sections },
    { data: highlights },
    { data: quotes },
    { data: softwareSkills },
  ] = await Promise.all([
    ownerId
      ? supabase
          .from('about_timeline')
          .select('*')
          .eq('owner_user_id', ownerId)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .returns<AboutTimelineRow[]>()
      : Promise.resolve({ data: [] as AboutTimelineRow[], error: null }),

    ownerId
      ? supabase
          .from('about_sections')
          .select('*')
          .eq('owner_user_id', ownerId)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .returns<AboutSectionRow[]>()
      : Promise.resolve({ data: [] as AboutSectionRow[], error: null }),

    ownerId
      ? supabase
          .from('about_highlights')
          .select('*')
          .eq('owner_user_id', ownerId)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .returns<AboutHighlightRow[]>()
      : Promise.resolve({ data: [] as AboutHighlightRow[], error: null }),

    ownerId
      ? supabase
          .from('about_quotes')
          .select('*')
          .eq('owner_user_id', ownerId)
          .eq('is_visible', true)
          .order('sort_order', { ascending: true })
          .returns<AboutQuoteRow[]>()
      : Promise.resolve({ data: [] as AboutQuoteRow[], error: null }),

    ownerId
      ? supabase
          .from('skills')
          .select('*')
          .eq('owner_user_id', ownerId)
          .eq('category', 'Software')
          .order('sort_order', { ascending: true })
          .limit(12)
          .returns<SkillRow[]>()
      : Promise.resolve({ data: [] as SkillRow[], error: null }),
  ])

  return (
    <Suspense>
      <AboutClient
        aboutPage={aboutPage ?? null}
        timeline={(timeline ?? []) as AboutTimelineRow[]}
        sections={(sections ?? []) as AboutSectionRow[]}
        highlights={(highlights ?? []) as AboutHighlightRow[]}
        quotes={(quotes ?? []) as AboutQuoteRow[]}
        softwareSkills={(softwareSkills ?? []) as SkillRow[]}
      />
    </Suspense>
  )
}
