# Vercel Domain Setup Guide - Production Ready for Millions of Users

Complete guide to configure your domain on Vercel with optimal performance, security, and scalability.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Setup (5 minutes)](#quick-setup)
4. [Advanced Configuration](#advanced-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### What You'll Achieve

✅ **Performance:**

- Global CDN with 300+ edge locations
- Sub-100ms response times worldwide
- Automatic edge caching
- Smart compression (Brotli/Gzip)

✅ **Scalability:**

- Handle millions of concurrent users
- Automatic scaling (no configuration needed)
- DDoS protection built-in
- Zero downtime deployments

✅ **Security:**

- Automatic SSL/TLS certificates
- HTTPS enforcement
- Security headers
- WAF (Web Application Firewall) on Pro plan

✅ **Reliability:**

- 99.99% uptime SLA
- Multi-region failover
- Automatic health checks
- Edge network redundancy

---

## Prerequisites

### Required

- ✅ Domain purchased (romeomukulah.org)
- ✅ Access to domain registrar (Hostinger)
- ✅ Vercel account (free or pro)
- ✅ Application deployed on Vercel

### Recommended for Millions of Users

- 💎 **Vercel Pro Plan** ($20/month)
  - Unlimited bandwidth
  - Advanced analytics
  - Commercial use
  - Priority support
  - DDoS mitigation

### Current Status

- Domain: `romeomukulah.org`
- Registrar: Hostinger
- Current deployment: Vercel (portfolio-app-mauve-five.vercel.app)
- Target: Point custom domain to Vercel

---

## Quick Setup

### Step 1: Add Domain in Vercel (2 minutes)

#### Method A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project: **portfolio-app**
3. Click **Settings** tab
4. Click **Domains** in sidebar
5. Click **Add** button
6. Enter your domain:
   ```
   romeomukulah.org
   ```
7. Click **Add**
8. Vercel will show DNS configuration needed

#### Method B: Via CLI

```bash
cd /home/mukulah/portfolio-app

# Add domain
vercel domains add romeomukulah.org

# Add www subdomain
vercel domains add www.romeomukulah.org
```

### Step 2: Configure DNS in Hostinger (3 minutes)

#### A. Delete Old AWS Records

Go to Hostinger → Domains → romeomukulah.org → DNS / Nameservers

**Delete these records:**

| Type  | Name | Content                       | Action    |
| ----- | ---- | ----------------------------- | --------- |
| CNAME | www  | k8s-ingressn-...amazonaws.com | ❌ DELETE |
| A     | @    | 50.16.156.186                 | ❌ DELETE |
| A     | @    | 44.208.62.126                 | ❌ DELETE |
| A     | @    | 18.213.126.167                | ❌ DELETE |

**Keep these records:**

- ✅ CAA records (SSL certificate validation)

#### B. Add Vercel DNS Records

**For apex domain (romeomukulah.org):**

Click **Add Record:**

```
Type: A
Name: @ (or leave blank for root domain)
Content: 76.76.21.21
TTL: 3600 (1 hour)
```

**For www subdomain:**

Click **Add Record:**

```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
TTL: 3600 (1 hour)
```

**Visual Guide:**

```
┌─────────────────────────────────────────────────┐
│ Add DNS Record                                  │
├─────────────────────────────────────────────────┤
│ Type: [A ▼]                                     │
│ Name: [@          ]  (root domain)              │
│ Content: [76.76.21.21                        ]  │
│ TTL: [3600 ▼]                                   │
│                                                 │
│              [Cancel]  [Add Record]             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Add DNS Record                                  │
├─────────────────────────────────────────────────┤
│ Type: [CNAME ▼]                                 │
│ Name: [www        ]                             │
│ Content: [cname.vercel-dns.com               ]  │
│ TTL: [3600 ▼]                                   │
│                                                 │
│              [Cancel]  [Add Record]             │
└─────────────────────────────────────────────────┘
```

#### C. Final DNS Configuration

Your DNS should look like this:

| Type  | Name | Content                | TTL   | Purpose                |
| ----- | ---- | ---------------------- | ----- | ---------------------- |
| A     | @    | 76.76.21.21            | 3600  | Root domain → Vercel   |
| CNAME | www  | cname.vercel-dns.com   | 3600  | www subdomain → Vercel |
| CAA   | @    | 0 issue "comodoca.com" | 14400 | SSL validation         |
| CAA   | @    | 0 issue "digicert.com" | 14400 | SSL validation         |
| CAA   | @    | 0 issue "sectigo.com"  | 14400 | SSL validation         |

---

## Advanced Configuration

### Option 1: Use Vercel Nameservers (Recommended for High Traffic)

**Benefits:**

- Faster DNS resolution (Vercel's global DNS)
- Automatic DNS optimization
- Better for millions of users
- No need to manually update records

**Steps:**

1. In Vercel Dashboard → Domains → romeomukulah.org
2. Look for **"Intended Nameservers"** section
3. Vercel will show nameservers (typically):

   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

4. In Hostinger:
   - Go to Domains → romeomukulah.org → Nameservers
   - Select **"Use custom nameservers"**
   - Enter:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Save changes

5. **Wait 24-48 hours for full propagation**

### Option 2: Add Multiple Domains

```bash
# Add multiple variants
vercel domains add romeomukulah.org
vercel domains add www.romeomukulah.org
vercel domains add api.romeomukulah.org  # If you have API
```

### Option 3: Domain Redirect

Set up automatic redirects (www → non-www or vice versa):

1. In Vercel Dashboard → Settings → Domains
2. Click on domain
3. Select **"Redirect to"** option
4. Choose primary domain

**Recommended:** Redirect `www.romeomukulah.org` → `romeomukulah.org`

---

## Performance Optimization

### 1. Enable Vercel Edge Network

**Automatic features (no configuration needed):**

✅ **Smart CDN Caching:**

- Static assets cached at 300+ edge locations
- Automatic cache invalidation on deployments
- Intelligent cache warming

✅ **Image Optimization:**

- Automatic WebP/AVIF conversion
- Responsive images
- Lazy loading
- Format negotiation

✅ **Compression:**

- Brotli compression (better than Gzip)
- Automatic text compression
- Asset minification

### 2. Configure Caching Headers

In your `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Cache static assets aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          // Don't cache API responses (or customize per endpoint)
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}
```

### 3. Enable Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx:
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 4. Monitor Web Vitals

Vercel automatically tracks:

- **LCP** (Largest Contentful Paint) - < 2.5s
- **FID** (First Input Delay) - < 100ms
- **CLS** (Cumulative Layout Shift) - < 0.1
- **TTFB** (Time to First Byte) - < 800ms

View in: Dashboard → Analytics → Web Vitals

---

## Security Hardening

### 1. Enforce HTTPS

In `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "http://(.*)",
      "destination": "https://$1",
      "permanent": true
    }
  ]
}
```

### 2. Security Headers

Already configured in your `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
}
```

### 3. Enable WAF (Pro Plan Only)

1. Go to Vercel Dashboard → Project Settings → Security
2. Enable **"Web Application Firewall"**
3. Configure rules:
   - Block suspicious IPs
   - Rate limiting
   - SQL injection protection
   - XSS protection

### 4. Environment Variables Security

Never expose secrets:

```bash
# In Vercel Dashboard → Settings → Environment Variables
# Mark as "Secret" for sensitive values

NEXT_PUBLIC_SUPABASE_URL=https://...  # ✅ Public (safe)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # ✅ Public (safe - anon key)
SUPABASE_SERVICE_KEY=eyJ...           # ❌ Secret (server-only)
```

---

## Monitoring & Alerts

### 1. DNS Propagation Monitoring

Use the included script:

```bash
# Start DNS monitoring
./scripts/vercel-dns-monitor.sh romeomukulah.org

# Or with custom check interval
./scripts/vercel-dns-monitor.sh romeomukulah.org 30  # Check every 30 seconds
```

### 2. Uptime Monitoring

**Free Tools:**

- [UptimeRobot](https://uptimerobot.com/) - Free, checks every 5 minutes
- [StatusCake](https://www.statuscake.com/) - Free tier available
- [Pingdom](https://www.pingdom.com/) - 14-day trial

**Setup:**

```
URL to monitor: https://romeomukulah.org
Check interval: 1 minute
Timeout: 30 seconds
Locations: Multiple regions (US, EU, Asia)
```

### 3. Vercel Analytics (Built-in)

1. Go to Dashboard → Analytics
2. Monitor:
   - Page views
   - Top pages
   - Traffic sources
   - Geographic distribution
   - Device breakdown
   - Web Vitals

### 4. Set Up Alerts

**Vercel Notifications:**

1. Dashboard → Project Settings → Integrations
2. Add Slack/Discord/Email notifications
3. Get alerts for:
   - Failed deployments
   - Performance degradation
   - Build errors

---

## Handling Millions of Users

### Vercel's Automatic Scaling

**How it works:**

```
1 user       →  1 serverless function instance
100 users    →  Auto-scales to 100 instances
1,000 users  →  Auto-scales to 1,000 instances
1M users     →  Auto-scales to handle load (no limit)
```

**No configuration needed!** Vercel automatically:

- ✅ Scales serverless functions
- ✅ Distributes traffic globally
- ✅ Caches at edge locations
- ✅ Handles DDoS attacks
- ✅ Maintains sub-100ms latency

### Estimated Capacity

**Vercel Free Tier:**

- 100GB bandwidth/month
- ~1-2 million page views/month
- Unlimited deployments
- Good for: Small to medium sites

**Vercel Pro ($20/month):**

- **Unlimited bandwidth**
- **Unlimited serverless function executions**
- **10M+ page views/month easily**
- Good for: High traffic production sites

**Vercel Enterprise (Custom pricing):**

- Custom limits
- Dedicated support
- SLA guarantees
- Good for: 100M+ page views/month

### Real-World Performance

**Example Traffic Handling:**

| Users | Page Views/month | Bandwidth | Recommended Plan |
| ----- | ---------------- | --------- | ---------------- |
| 10K   | 100K             | 10GB      | Free ✅          |
| 100K  | 1M               | 50GB      | Free ✅          |
| 500K  | 5M               | 200GB     | Pro 💎           |
| 1M    | 10M              | 500GB     | Pro 💎           |
| 10M   | 100M             | 5TB       | Enterprise 🏢    |

---

## Verification Steps

### 1. Check DNS Propagation

```bash
# Run monitoring script
./scripts/vercel-dns-monitor.sh romeomukulah.org

# Or manually check
dig romeomukulah.org
nslookup romeomukulah.org

# Should show: 76.76.21.21
```

### 2. Verify SSL Certificate

```bash
# Check SSL
curl -vI https://romeomukulah.org 2>&1 | grep -i "SSL\|TLS"

# Should show: TLS 1.3, valid certificate
```

### 3. Test Global Performance

```bash
# Test from different locations
curl -w "@curl-format.txt" -o /dev/null -s https://romeomukulah.org

# Create curl-format.txt:
echo "time_namelookup:  %{time_namelookup}\ntime_connect:  %{time_connect}\ntime_appconnect:  %{time_appconnect}\ntime_pretransfer:  %{time_pretransfer}\ntime_redirect:  %{time_redirect}\ntime_starttransfer:  %{time_starttransfer}\ntime_total:  %{time_total}\n" > curl-format.txt
```

**Expected results:**

- DNS lookup: < 50ms
- Connection: < 100ms
- Total time: < 500ms

### 4. Verify in Vercel Dashboard

1. Go to Dashboard → Domains
2. Check status: **"Valid Configuration"** ✅
3. Check SSL: **"Active"** ✅
4. Check redirect: **"Configured"** ✅

---

## Troubleshooting

### Issue 1: DNS Not Propagating

**Symptoms:**

- Domain doesn't resolve
- Old IP still showing
- "Site not found" error

**Solutions:**

```bash
# 1. Flush local DNS cache
sudo systemd-resolve --flush-caches  # Linux
# dscacheutil -flushcache  # macOS

# 2. Check DNS from different servers
dig @8.8.8.8 romeomukulah.org        # Google DNS
dig @1.1.1.1 romeomukulah.org        # Cloudflare DNS

# 3. Use online tools
# https://www.whatsmydns.net/#A/romeomukulah.org
```

**Wait time:** 5 minutes to 48 hours (usually < 1 hour)

### Issue 2: SSL Certificate Not Active

**Symptoms:**

- "Not Secure" warning
- Certificate error
- HTTPS not working

**Solutions:**

1. **Wait 10-15 minutes** after DNS propagation
2. Check Vercel Dashboard → Domains → SSL status
3. If "Failed", click **"Retry"**
4. Ensure CAA records allow Let's Encrypt:
   ```
   CAA @ 0 issue "letsencrypt.org"
   ```

### Issue 3: Old Content Still Showing

**Symptoms:**

- Old AWS site still loads
- Changes not visible
- Cached content

**Solutions:**

```bash
# 1. Clear browser cache (hard refresh)
# Ctrl+Shift+R (Linux/Windows)
# Cmd+Shift+R (macOS)

# 2. Test in incognito mode

# 3. Check actual DNS
curl -I https://romeomukulah.org | grep -i "server"
# Should show: server: Vercel

# 4. Force DNS refresh
sudo systemd-resolve --flush-caches
```

### Issue 4: "Domain Already in Use"

**Symptoms:**

- Can't add domain in Vercel
- "Domain is already assigned" error

**Solutions:**

1. Check if domain is assigned to another Vercel project
2. Go to Dashboard → All Projects → Search for domain
3. Remove from old project
4. Add to new project

### Issue 5: Slow Response Times

**Symptoms:**

- Site loading slowly
- TTFB > 1 second

**Solutions:**

1. **Enable edge caching:**

   ```typescript
   // In next.config.ts
   export const dynamic = 'force-static'
   ```

2. **Optimize images:**

   ```typescript
   import Image from 'next/image'
   // Use Next.js Image component
   ```

3. **Check Web Vitals:**
   - Dashboard → Analytics → Web Vitals
   - Fix LCP, FID, CLS issues

4. **Upgrade to Pro:**
   - Priority routing
   - Better edge locations
   - Faster deployments

---

## Post-Setup Checklist

### Immediate (0-1 hour)

- [ ] DNS records updated in Hostinger
- [ ] Domain added in Vercel
- [ ] DNS monitoring script running
- [ ] SSL certificate active
- [ ] Site accessible at https://romeomukulah.org

### Short-term (1-24 hours)

- [ ] DNS fully propagated globally
- [ ] www redirect working
- [ ] Analytics tracking
- [ ] All pages loading correctly
- [ ] Google Analytics connected

### Long-term (1+ weeks)

- [ ] Uptime monitoring configured
- [ ] Performance optimized (Web Vitals green)
- [ ] SEO updated with new URLs
- [ ] Old AWS infrastructure deleted
- [ ] Monitoring alerts working

---

## Performance Benchmarks

### Expected Performance Metrics

| Metric          | Target  | Excellent |
| --------------- | ------- | --------- |
| **TTFB**        | < 800ms | < 200ms   |
| **LCP**         | < 2.5s  | < 1.5s    |
| **FID**         | < 100ms | < 50ms    |
| **CLS**         | < 0.1   | < 0.05    |
| **Speed Index** | < 3s    | < 1.5s    |

### Global Latency (Expected)

| Region            | Latency  |
| ----------------- | -------- |
| **North America** | 10-50ms  |
| **Europe**        | 20-60ms  |
| **Asia**          | 30-80ms  |
| **South America** | 40-100ms |
| **Australia**     | 50-120ms |
| **Africa**        | 60-150ms |

### Capacity Testing

**Test your site under load:**

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test with 1000 requests, 100 concurrent
ab -n 1000 -c 100 https://romeomukulah.org/

# Or use hey
go install github.com/rakyll/hey@latest
hey -n 10000 -c 100 https://romeomukulah.org/
```

**Expected results:**

- 99% success rate
- Response time: < 500ms average
- No failed requests
- Handles 1000+ req/sec

---

## Support & Resources

### Vercel Support

- **Documentation:** https://vercel.com/docs
- **Community:** https://github.com/vercel/vercel/discussions
- **Status Page:** https://vercel-status.com
- **Support:** support@vercel.com (Pro plan)

### Additional Tools

- **DNS Checker:** https://www.whatsmydns.net/
- **SSL Checker:** https://www.ssllabs.com/ssltest/
- **Speed Test:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/

### Emergency Contacts

**If site goes down:**

1. Check Vercel status: https://vercel-status.com
2. Check deployment logs: Dashboard → Deployments
3. Rollback if needed: Dashboard → Deployments → Previous → Promote
4. Contact support (Pro plan)

---

## Cost Optimization

### Free Tier Limits

✅ **Included FREE forever:**

- 100GB bandwidth/month
- Unlimited projects
- Unlimited deployments
- Automatic SSL
- Global CDN
- Analytics (basic)

### When to Upgrade to Pro ($20/month)

Upgrade when you hit:

- ❌ > 100GB bandwidth/month
- ❌ Need commercial features
- ❌ Want advanced analytics
- ❌ Need priority support
- ❌ > 1M page views/month

### Cost for High Traffic

| Monthly Views | Bandwidth | Cost                      |
| ------------- | --------- | ------------------------- |
| 100K          | 10GB      | **$0** (Free)             |
| 1M            | 50GB      | **$0** (Free)             |
| 2M            | 100GB     | **$0** (Free)             |
| 5M            | 250GB     | **$20** (Pro)             |
| 10M           | 500GB     | **$20** (Pro - unlimited) |
| 100M          | 5TB       | **$20** (Pro - unlimited) |

**Vercel Pro = Unlimited bandwidth!** 🎉

---

## Conclusion

Your domain setup is now **production-ready** to handle:

✅ **Millions of concurrent users**
✅ **Sub-100ms global response times**
✅ **Automatic scaling and DDoS protection**
✅ **99.99% uptime SLA**
✅ **Zero infrastructure management**

**Next Steps:**

1. Run DNS monitoring script: `./scripts/vercel-dns-monitor.sh romeomukulah.org`
2. Wait for DNS propagation (5-30 minutes)
3. Verify site at: https://romeomukulah.org
4. Monitor analytics in Vercel Dashboard
5. Celebrate! 🎉

**Questions?** Check troubleshooting section or run:

```bash
./scripts/vercel-monitor.sh health
```

---

**Last Updated:** January 23, 2026  
**Domain:** romeomukulah.org  
**Platform:** Vercel  
**Estimated Capacity:** 10M+ monthly page views
