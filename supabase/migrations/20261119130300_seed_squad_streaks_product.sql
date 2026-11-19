-- =====================================================================
-- Seed: Squad Streaks product (2026-11-19)
--
-- Source: ytfactory catalog (~/ytfactory/output/_catalog/squad-streaks.json).
-- Screenshots are served from /public/products/squad-streaks/ (28 curated shots;
-- dashboard/analytics shots carry demo_data=true and render a "Demo data" badge).
-- Status 'coming_soon': the page is live, buying is not (phase 2).
-- The course + lessons arrive through the ingest API (docs/ingest/CONTRACT.md).
-- Idempotent: re-running updates the row in place.
-- =====================================================================

INSERT INTO public.products (
  slug, kind, title, tagline, pitch,
  for_whom, stack, source_code_includes, platforms,
  live_url, download_url, feature_suggestion_url,
  showcase_video_ref, showcase_duration_seconds,
  screenshots, status, sort_order
) VALUES (
  'squad-streaks', 'source_code', 'Squad Streaks', 'Habits die alone. They live in a squad.',
  'Friends check in once a day, and the squad''s streak only grows when everyone shows up. Kind nudges, fire cheers, and a flame that grows from flame to gold to blue fire. A complete, real product: a phone app, an API, a website and an admin control centre, all live today.',
  ARRAY['Anyone building a habit with friends', 'Beginners who want a real project to learn from', 'Developers who want a portfolio app that stands out', 'Founders who want a head start of months']::text[],
  ARRAY['Expo', 'React Native', 'TypeScript', 'Fastify', 'PostgreSQL', 'Prisma', 'zod', 'Vitest', 'Next.js', 'Docker', 'Caddy', 'EAS Build']::text[],
  ARRAY['Android app (Expo / React Native)', 'Fastify API with 71 tests', 'Next.js website', 'Next.js admin dashboard (2FA, users, monitoring, analytics)', 'Docker Compose + Caddy deploy files', 'Setup guide (SETUP.md)']::text[],
  ARRAY['Android (APK)']::text[],
  'https://squadstreaks.com', 'https://squadstreaks.com/download', 'https://squadstreaks.com/contact?topic=question',
  NULL, 716,
  $shots$[
  {
    "src": "/products/squad-streaks/squad10-kofi-today.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-feed-cheered.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-squad-nudge-buttons.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-nudge-lead-by-example.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-kofi-progress.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-note-shared.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad10-kofi-bluefire.png",
    "label": "App: demo accounts (emulator)",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-p-today.png",
    "label": "App: real Samsung, demo account",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-p-squads.png",
    "label": "App: real Samsung, demo account",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-p-progress.png",
    "label": "App: real Samsung, demo account",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-p-activity.png",
    "label": "App: real Samsung, demo account",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-p-installed.png",
    "label": "App: real Samsung, demo account",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-site-home.png",
    "label": "Website: live squadstreaks.com",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-site-download.png",
    "label": "Website: live squadstreaks.com",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad13-site-privacy.png",
    "label": "Website: live squadstreaks.com",
    "demo_data": false
  },
  {
    "src": "/products/squad-streaks/squad15-04-overview.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-07-palette.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-11-users.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-12-user-drawer.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-15-monitoring.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-16-audit.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-17-light.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-01-login.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad15-19-phone.png",
    "label": "Admin dashboard: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad16-01-analytics-top.png",
    "label": "Analytics: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad16-03-breakdowns.png",
    "label": "Analytics: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad16-05-retention.png",
    "label": "Analytics: demo data",
    "demo_data": true
  },
  {
    "src": "/products/squad-streaks/squad16-06-app-activity.png",
    "label": "Analytics: demo data",
    "demo_data": true
  }
]$shots$::jsonb,
  'coming_soon', 0
)
ON CONFLICT (slug) DO UPDATE SET
  kind                      = EXCLUDED.kind,
  title                     = EXCLUDED.title,
  tagline                   = EXCLUDED.tagline,
  pitch                     = EXCLUDED.pitch,
  for_whom                  = EXCLUDED.for_whom,
  stack                     = EXCLUDED.stack,
  source_code_includes      = EXCLUDED.source_code_includes,
  platforms                 = EXCLUDED.platforms,
  live_url                  = EXCLUDED.live_url,
  download_url              = EXCLUDED.download_url,
  feature_suggestion_url    = EXCLUDED.feature_suggestion_url,
  showcase_duration_seconds = EXCLUDED.showcase_duration_seconds,
  screenshots               = EXCLUDED.screenshots;
  -- showcase_video_ref and status are deliberately not overwritten on re-run:
  -- ytfactory sets the video via PATCH /api/ingest/products/…, Romeo sets status.
