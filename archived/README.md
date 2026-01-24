# Archived Content

This folder contains all archived/deprecated code, configurations, and documentation that are no longer actively used but kept for historical reference and potential future use.

---

## 📂 Structure

### [aws/](./aws/)

**Old AWS Infrastructure** (Archived: Jan 2026)

- Docker configurations
- Kubernetes (k8s) manifests
- Helm charts
- Nginx configs
- Terraform AWS modules
- Deployment scripts

**Why Archived:** Migrated from AWS to Vercel for simpler deployment and better Next.js integration.

**Contains:**

- `docker/` - Docker images and compose files
- `k8s/` - Kubernetes manifests
- `helm/` - Helm charts
- `terraform/` - AWS Terraform configs
- `nginx/` - Nginx configurations
- `scripts/` - Deployment scripts

---

### [database/](./database/)

**Old SQL Schema Files** (Archived: Jan 2026)

- Manual SQL schema definitions
- Seed data scripts
- Table creation scripts

**Why Archived:** Replaced by auto-generated TypeScript types and Supabase CLI migrations.

**New Approach:**

- `npm run db:types` - Auto-generate types
- `npm run db:pull` - Pull schema as migrations
- See [docs/database/](../docs/database/) for current workflow

**Contains:**

- `blog_schema.sql` - Blog tables
- `courses_schema.sql` - Courses tables
- `services_schema.sql` - Services tables
- `shop_schema.sql` - Shop tables
- `seed_*.sql` - Sample data scripts

---

### [supabase-sql/](./supabase-sql/)

**Old Supabase Debugging Files** (Archived: Jan 2026)

- Authentication fix scripts
- RLS policy fixes
- User system debugging
- Database diagnostics

**Why Archived:** Authentication and RLS issues resolved. Current system working properly.

**Current Status:**
✅ All auth issues fixed
✅ RLS policies working
✅ User system functioning

**Contains:**

- `COMPLETE-FIX-auth.sql`
- `FINAL-FIX-complete-auth.sql`
- `FIX-signup-rls.sql`
- `debug-user-mismatch.sql`
- `public-users-schema.sql`
- `user-role-functions.sql`

---

### [docs/](./docs/)

**Archived Documentation** (Archived: Jan 2026)

- Old AWS deployment guides
- Deprecated production hardening guides
- Outdated infrastructure docs

**Why Archived:** Documentation restructured and updated. AWS-specific docs no longer relevant.

**Current Docs:** See [docs/](../docs/) for up-to-date documentation.

**Contains:**

- `AWS_ARCHIVED.md` - Old AWS setup guide
- `PRODUCTION_HARDENING.md` - Old hardening practices
- `PRODUCTION_HARDENING_SUMMARY.md` - Summary

---

## 🎯 Usage Guidelines

### ✅ When to Reference Archived Content

- **Learning from history** - Understand past decisions
- **Migration context** - See what was changed and why
- **Code patterns** - Find useful patterns from old implementations
- **Troubleshooting** - Compare with old setups if issues arise

### ❌ What NOT to Do

- **Don't implement** - Don't use archived code in production
- **Don't copy/paste** - Archived code may be outdated or incompatible
- **Don't reference in docs** - Link to current documentation instead
- **Don't base decisions** - Use current architecture, not archived

---

## 📋 Current Alternatives

| Archived                 | Current Alternative                                           |
| ------------------------ | ------------------------------------------------------------- |
| `archived/aws/`          | Vercel deployment → [docs/deployment/](../docs/deployment/)   |
| `archived/database/`     | TypeScript types → [docs/database/](../docs/database/)        |
| `archived/supabase-sql/` | Supabase CLI migrations → [docs/database/](../docs/database/) |
| `archived/docs/`         | Updated docs → [docs/](../docs/)                              |

---

## 🗄️ Archival Policy

### What Gets Archived

✅ Old infrastructure code (AWS → Vercel)  
✅ Deprecated configuration files  
✅ Resolved debugging/fix scripts  
✅ Outdated documentation  
✅ Replaced tooling and workflows

### What Stays Active

❌ Current production code  
❌ Active documentation  
❌ Working configurations  
❌ Live infrastructure  
❌ Active migrations

---

## 📝 Version Control

This folder **IS tracked in Git** because:

- Provides migration history
- Documents architectural decisions
- May contain useful patterns for future reference
- Helps onboarding understand project evolution

---

## 🔍 Quick Reference

**Looking for current docs?** → [../docs/](../docs/)  
**Need deployment info?** → [../docs/deployment/](../docs/deployment/)  
**Database setup?** → [../docs/database/](../docs/database/)  
**AWS info?** → See `archived/aws/` and `archived/docs/AWS_ARCHIVED.md`

---

**Last Updated:** January 24, 2026

**Note:** This archived content is kept for historical reference only. Always use current documentation and code for active development.
