## 🚀 Vercel Deployment Guide

### Quick Start
```bash
# 1. Login to Vercel
vercel login

# 2. Deploy to production
vercel --prod
```

### Environment Variables
Add these in your Vercel dashboard (Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`: https://mrhqdnpypcdfovhztxrh.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (copy from .env.local)
- `NEXT_PUBLIC_SITE_URL`: https://romeomukulah.org
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: G-3BZZ8D5TED

### Domain Setup
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add custom domain: `romeomukulah.org`
3. Update DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

### Cost Comparison
- **AWS EKS**: $548.88/month ❌
- **Vercel Free**: $0/month ✅
  - 100GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - Global CDN

### Features on Vercel
✅ Next.js 16 with Turbopack
✅ Supabase database
✅ Google Analytics 4
✅ Admin dashboard
✅ Automatic deployments from GitHub
✅ Zero maintenance
