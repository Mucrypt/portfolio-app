# AGENTS.md

Rules for any AI agent (Claude, ChatGPT/Codex, Cursor, others) working in this repository. They apply to people too.
If anything here conflicts with a tool's defaults, this file wins.

## What this is

`romeomukulah.org` is the hub and storefront for everything Romeo Mukulah builds. Each product (app, source code,
software) gets a free YouTube course and is sold here as a source-code purchase or through a membership.

Sibling systems. Each has its own repo, and none of them writes another system's database:

| System | Role | How it talks to this site |
|---|---|---|
| ytfactory | Turns builds into courses | `docs/ingest/CONTRACT.md` (HTTP ingest API) |
| mukulah-studio | Posts to social platforms | Read API (contract to be written in `docs/`) |
| Lemon Squeezy | Payments (merchant of record) | Signed webhooks into this site |
| MukuVoice, MukuPay | Future TTS and payments | Future contracts. MukuPay is a second payment `provider` |

Architecture and known issues: `docs/SYSTEM_DESIGN.md`.

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript; Tailwind CSS 4.
- Supabase (Postgres + Auth + Storage). It is the single source of truth.
- Hosted on Vercel (region `iad1`); pushes to `main` deploy to production.
- Sentry for errors; GA4 and Vercel Analytics.
- zod for every external input.

## Commands

```bash
npm run dev          # local dev server
npx tsc --noEmit     # type-check (must pass before reporting work as done)
npm run lint         # eslint (no new errors or warnings in files you touched)
npm run build        # production build
npm run db:pull      # pull live schema into a migration (owner runs this; asks for DB password)
npm run db:push      # apply pending migrations to production (dry run + confirm; owner runs this)
npm run db:types     # regenerate lib/supabase/database.types.ts after a migration
```

Romeo runs database, deploy and git commands himself, step by step. Give him the exact command; don't run it for him
unless he asks.

## Security rules (non-negotiable)

1. **Secrets live only in env** (`.env.local`, Vercel env). Never print, log, commit or paste them. When checking
   one, check that it's **present**, never its value.
2. **Nothing secret gets a `NEXT_PUBLIC_` prefix.** Only the Supabase URL, the anon key and analytics IDs are public.
3. **The service-role key is server-only.** Use it only in route handlers or server modules that `import 'server-only'`.
   Never import it into a client component, never send it to a browser, never give it to another system.
4. **RLS is on for every table.** Public catalog data is read-only for anon users and limited to published rows.
   Purchases, subscriptions and entitlements are readable only by their owner. Writes go through the owner account
   (admin) or server routes using the service role.
5. **Webhooks:** verify the signature (HMAC, constant-time compare) on the raw body before parsing. Process each
   event once, keyed on the provider's event id (store it; ignore repeats). Never trust the payload's amounts or
   user IDs without verification.
6. **Paid files** (source-code zips) live in **private** buckets and are delivered only by short-lived signed URLs,
   issued on the server after an entitlement check. Never make a public link to a paid file.
7. **Entitlements** are resolved to a site user by **verified email**, never by an email typed into a form.
8. **Server-to-server APIs** (ingest) use a bearer token from env, compared in constant time, with strict zod bodies.
9. **No invented social proof.** No fake user counts, ratings, reviews or testimonials, and no stat cards showing zeros.
   Demo screenshots must be labelled "demo data".
10. **Personal data:** never put Romeo's personal email, real IPs or tokens anywhere public (pages, docs, logs, commits).

## Database and migrations

- Schema changes go in **timestamped files only**: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`.
  Never use the SQL Editor ad hoc without saving the file.
- Pull the live schema (`npm run db:pull`) before writing a migration that touches existing tables.
- Every new table enables RLS and declares its policies in the same migration.
- Prefer `is_published = false` over deleting content. Never write SQL that deletes user content without the
  owner's explicit approval.
- After a migration is applied, run `npm run db:types` and commit the regenerated types with it.

## Payments

- All provider-specific code (Lemon Squeezy today, MukuPay later) sits behind one module (`lib/commerce/`).
  Tables (`purchases`, `subscriptions`, `entitlements`) carry a `provider` column. Adding a provider must not
  need a schema change.
- Buy and membership UI stays behind the `COMMERCE_ENABLED` env flag until checkout, webhook and entitlements are
  live and tested.

## Integration contracts

- Every integration is a versioned contract in `docs/` (e.g. `docs/ingest/CONTRACT.md`).
- Change the contract file first, with a version bump and changelog entry, then the code. Additive optional fields
  are a minor bump; anything that breaks an existing sender is a major bump, agreed with the other side first.

## Working agreements

- Before a multi-file change, say the plan in a few lines.
- Run `npx tsc --noEmit` and lint before saying something is done; report failures honestly.
- Pin new dependencies to exact versions that are at least two weeks old (`"pkg": "1.2.3"`, no `^`).
- Commit or push only when Romeo asks. Never force-push `main`.
- Don't modify sibling repos (ytfactory, mukulah-studio) from here.
