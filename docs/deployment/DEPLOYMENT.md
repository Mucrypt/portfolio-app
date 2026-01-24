# 🚀 Quick Deployment Guide

**One-command deployment for romeomukulah.org**

## ⚡ Ultra-Quick Start

Deploy your changes to production in ONE command:

```bash
npm run deploy "feat: Your awesome feature"
```

That's it! ✨

---

## 📚 Essential Commands

### 🎯 Main Commands You'll Use Daily

```bash
# Deploy to production (pushes to GitHub + merges to main)
npm run deploy "feat: Add new feature"

# Quick push to feature branch (no merge to main)
npm run quick-push "wip: Working on feature"

# Check project status
npm run status

# Run pre-deployment checks
npm run check

# Create new feature branch
npm run new-feature my-feature-name
```

---

## 🔄 Development Workflow

### Standard Workflow

```bash
# 1. Create feature branch
npm run new-feature awesome-feature

# 2. Make changes, test locally
npm run dev

# 3. Quick push during development (stays on feature branch)
npm run quick-push "wip: Adding feature"

# 4. When ready for production
npm run deploy "feat: Complete awesome feature"
# ↑ This will ask if you want to merge to main (choose Y for production)
```

### Quick Fix Workflow

```bash
# 1. Create fix branch
npm run new-feature fix-urgent-bug

# 2. Make fix
npm run dev  # Test locally

# 3. Deploy immediately
npm run deploy "fix: Resolve urgent bug"
# Choose Y to merge to main
```

---

## 🎓 What Each Command Does

### `npm run deploy "message"`

**Use for:** Production-ready features

**Does:**

1. ✅ Lints code
2. ✅ Type checks
3. ✅ Builds project
4. ✅ Commits changes
5. ✅ Pushes to current branch
6. ✅ **Asks to merge to main**
7. ✅ Vercel auto-deploys

### `npm run quick-push "message"`

**Use for:** Development iterations

**Does:**

1. Commits changes
2. Pushes to current branch
3. **NO merge to main** (stays on feature branch)

### `npm run status`

**Use for:** Check everything

**Shows:**

- Git status
- Build info
- Deployment info
- Dependencies
- Monitoring services

---

## 📋 All Available Commands

```bash
npm run dev              # Start dev server
npm run build            # Build project
npm run lint             # Run ESLint
npm run type-check       # TypeScript check

npm run deploy           # Full deployment
npm run quick-push       # Quick commit & push
npm run sync             # Sync branch with main
npm run check            # Pre-deployment checks
npm run status           # Project status
npm run clean            # Clean build
npm run new-feature      # Create feature branch
```

---

## 🔐 Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-3BZZ8D5TED
```

---

## 🌐 Important Links

- 🏠 **Live Site:** https://romeomukulah.org
- 📊 **Admin Dashboard:** https://romeomukulah.org/admin
- 🚀 **Vercel Dashboard:** https://vercel.com/dashboard
- 💾 **GitHub:** https://github.com/Mucrypt/portfolio-app
- 🗄️ **Supabase:** https://supabase.com/dashboard
- 🔍 **Sentry:** https://sentry.io/organizations/mukulah
- 📈 **UptimeRobot:** https://dashboard.uptimerobot.com

---

## 💡 Pro Tips

1. **Always use `npm run check` before deploying**
2. **Use `quick-push` during development** - it doesn't merge to main
3. **Use `deploy` when ready for production** - it asks to merge to main
4. **Check `npm run status` regularly** for project overview
5. **Test locally with `npm run dev` first**

---

## 🆘 Need Help?

Check detailed documentation:

- **Scripts Guide:** `scripts/README.md`
- **Production Hardening:** `docs/PRODUCTION_HARDENING.md`
- **Admin Dashboard:** `docs/ADMIN_DASHBOARD.md`
- **Sentry Setup:** `docs/SENTRY_SETUP.md`

---

## 🎉 That's It!

You're ready to deploy! Start with:

```bash
npm run status          # Check project status
npm run check           # Run all checks
npm run deploy "feat: Your feature"  # Deploy!
```

Happy coding! 🚀
