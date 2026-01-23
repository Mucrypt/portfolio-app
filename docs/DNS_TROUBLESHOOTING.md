# DNS Troubleshooting Guide

## Current Issue: "Invalid Configuration" Error

Your domain `romeomukulah.org` is showing "Invalid Configuration" in Vercel because the DNS records haven't propagated yet.

## What You Need to Do in Hostinger

### Step 1: Get the Correct CNAME Value from Vercel

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Click on `romeomukulah.org` or `www.romeomukulah.org`
3. Look at the **DNS Records** tab
4. Copy the exact CNAME value shown (should look like: `xxx.vercel-dns.com` or similar)

### Step 2: Add DNS Records in Hostinger

Log in to Hostinger → Domain → DNS / Nameservers → Manage:

#### Delete Old Records (Already Done ✅)

You've already deleted the AWS records - great!

#### Add New Vercel Records

**Record 1: Root Domain (A Record)**

```
Type: A
Name: @ (or leave blank for root domain)
Content: 76.76.21.21
TTL: 3600 (or 1 hour)
Priority: (leave blank)
```

**Record 2: WWW Subdomain (CNAME)**

```
Type: CNAME
Name: www
Content: [EXACT VALUE FROM VERCEL - should be xxx.vercel-dns.com]
TTL: 3600 (or 1 hour)
Priority: (leave blank)
```

⚠️ **IMPORTANT**: Make sure the CNAME value is EXACTLY as shown in Vercel (copy/paste it)

### Step 3: Verify DNS Records

After adding the records in Hostinger, wait 2-5 minutes, then run:

```bash
# Check root domain
dig romeomukulah.org +short
# Should show: 76.76.21.21

# Check www subdomain
dig www.romeomukulah.org +short
# Should show: cname.vercel-dns.com (or similar)
# Then: 76.76.21.21

# Or check all at once
./scripts/vercel-dns-monitor.sh romeomukulah.org
```

### Step 4: Verify in Vercel

1. Go back to Vercel Dashboard → Settings → Domains
2. Click **Refresh** button next to your domain
3. Wait 5-10 minutes for verification
4. Status should change from "Invalid Configuration" to "Valid Configuration"

## Common Issues

### Issue 1: "Invalid Configuration" Won't Go Away

**Solution:**

- Double-check the CNAME value is EXACTLY as shown in Vercel
- Make sure there are no extra spaces or typos
- Check TTL is set to 3600 seconds (1 hour)
- Wait up to 30 minutes for DNS propagation

### Issue 2: CNAME Shows Wrong Value

**Solution:**

```bash
# Check what CNAME is currently set
dig www.romeomukulah.org CNAME +short

# If it's wrong, delete the CNAME record in Hostinger and re-add it
```

### Issue 3: Both A and CNAME Records Not Working

**Solution:**

- Make sure Hostinger nameservers are still pointing to Hostinger (not Vercel)
- Nameservers should be: `ns1.dns-parking.com` and `ns2.dns-parking.com` (or similar)
- If you changed nameservers, change them back to Hostinger's

### Issue 4: DNS Propagation Taking Too Long

**Solution:**

- Lower TTL to 300 seconds (5 minutes) in Hostinger
- Wait 30 minutes to 2 hours
- Check DNS propagation globally: https://www.whatsmydns.net/#A/romeomukulah.org
- Check CNAME: https://www.whatsmydns.net/#CNAME/www.romeomukulah.org

## Quick Commands

```bash
# Check current DNS status
dig romeomukulah.org
dig www.romeomukulah.org

# Monitor DNS propagation with our script
cd /home/mukulah/portfolio-app
./scripts/vercel-dns-monitor.sh romeomukulah.org

# Check Vercel deployment
curl -I https://portfolio-app-mauve-five.vercel.app
# Should show: server: Vercel

# Verify Vercel domains
vercel domains ls

# Check if site is accessible
curl -I https://romeomukulah.org
# (Will fail until DNS propagates)
```

## Expected Timeline

1. **Add DNS records in Hostinger**: 2 minutes
2. **DNS propagation starts**: Immediately
3. **First servers updated**: 5-10 minutes
4. **Most servers updated**: 15-30 minutes
5. **All servers updated**: 1-2 hours (max 48 hours)
6. **Vercel verification**: After DNS propagates (click Refresh in Vercel)

## Need Help?

1. **Share the exact CNAME value from Vercel** - I can verify if it's correct
2. **Run diagnostic commands**:
   ```bash
   dig romeomukulah.org
   dig www.romeomukulah.org
   host romeomukulah.org
   nslookup romeomukulah.org
   ```
3. **Check Vercel status**: Settings → Domains → Click "Learn more" next to "Invalid Configuration"

## What Should Happen

✅ **Correct Setup:**

- Root domain (`romeomukulah.org`) → A record → 76.76.21.21
- WWW subdomain (`www.romeomukulah.org`) → CNAME → xxx.vercel-dns.com → 76.76.21.21
- Both domains point to Vercel
- Vercel shows "Valid Configuration"
- Site accessible at both URLs with automatic HTTPS

❌ **Current Setup (Broken):**

- Vercel waiting for DNS records
- Hostinger has no records (you deleted AWS records)
- Need to add Vercel records in Hostinger
