# Archived Database Files

**Archived on:** January 24, 2026

## Why Archived?

These old SQL schema and seed files have been replaced by a better workflow:

### Old Way (Archived) ❌

- Manual SQL files in `database/` folder
- No type safety
- Hard to keep in sync
- Manual schema management

### New Way (Current) ✅

- Auto-generated TypeScript types from live database
- Full type safety and autocomplete
- `npm run db:types` - generates types automatically
- `npm run db:pull` - creates proper migrations
- Version controlled through Supabase CLI

## Archived Files

- `blog_schema.sql` - Blog table schemas
- `courses_schema.sql` - Courses table schemas
- `seed_blog_data.sql` - Sample blog data
- `seed_courses.sql` - Sample course data
- `seed_service_inquiries_clean.sql` - Service inquiry data
- `seed_services_data.sql` - Service data
- `seed_shop_products.sql` - Shop product data
- `services_schema.sql` - Services table schemas
- `shop_schema.sql` - Shop table schemas

## Current Workflow

See [docs/DATABASE-MANAGEMENT.md](../docs/DATABASE-MANAGEMENT.md) for the modern approach.

---

**These files are kept for reference only. Do not use them directly.**
