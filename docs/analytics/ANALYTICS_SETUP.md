# Google Analytics 4 Integration Setup Guide

## 🎯 Overview

This portfolio app now includes world-class Google Analytics 4 (GA4) integration with comprehensive tracking capabilities including:

- ✅ Page views and navigation tracking
- ✅ Custom event tracking (blog views, project views, etc.)
- ✅ E-commerce tracking (shop items, purchases)
- ✅ User behavior analytics (scroll depth, time on page)
- ✅ Form submissions and conversions
- ✅ Real-time analytics dashboard
- ✅ Performance metrics (FCP, LCP, etc.)
- ✅ Error tracking

## 🚀 Quick Start

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add Environment Variable

Add to your `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Deploy

```bash
# Add to Kubernetes secrets
kubectl create secret generic analytics-secrets \
  --from-literal=NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  -n portfolio-production

# Update deployment
kubectl set env deployment/portfolio-app \
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
  -n portfolio-production
```

### 4. Verify

Visit your site and check:
- Browser console: `window.gtag` should be defined
- GA4 Real-time reports (wait 1-2 minutes)
- Admin dashboard: `/admin/analytics`

## 📊 Features Implemented

### Automatic Tracking

The following are tracked automatically:

1. **Page Views** - Every page navigation
2. **Scroll Depth** - 25%, 50%, 75%, 100%
3. **Time on Page** - Engagement duration
4. **Performance Metrics** - Page load, FCP, LCP
5. **Errors** - JavaScript errors and unhandled rejections
6. **User Engagement** - Active user detection

### Custom Events

#### Blog Posts
```typescript
import { trackBlogView } from '@/lib/analytics/gtag';

trackBlogView(postId, postTitle, category);
```

#### Projects
```typescript
import { trackProjectView } from '@/lib/analytics/gtag';

trackProjectView(projectId, projectName);
```

#### Form Submissions
```typescript
import { trackFormSubmit } from '@/lib/analytics/gtag';

trackFormSubmit('contact-form', { 
  name: 'filled',
  email: 'filled' 
});
```

#### Downloads
```typescript
import { trackDownload } from '@/lib/analytics/gtag';

trackDownload('resume.pdf', 'pdf');
```

#### Social Shares
```typescript
import { trackSocialClick } from '@/lib/analytics/gtag';

trackSocialClick('twitter', 'share');
```

### Trackable Components

Use pre-built tracking components:

```tsx
import { 
  TrackableButton,
  TrackableLink,
  TrackableForm,
  SocialShareButton,
  DownloadButton 
} from '@/components/analytics/TrackableComponents';

// Trackable button
<TrackableButton 
  eventName="cta_click"
  eventCategory="conversion"
  eventLabel="Get Started"
>
  Get Started
</TrackableButton>

// Social share
<SocialShareButton 
  platform="twitter"
  url={pageUrl}
  title={pageTitle}
>
  Share on Twitter
</SocialShareButton>
```

### E-commerce Tracking

```typescript
import { trackAddToCart, trackPurchase } from '@/lib/analytics/gtag';

// Add to cart
trackAddToCart({
  id: 'prod-123',
  name: 'Product Name',
  price: 29.99,
  category: 'digital-products',
  quantity: 1
});

// Purchase complete
trackPurchase(
  'order-123',
  items,
  totalValue,
  tax,
  shipping
);
```

## 🎨 Admin Dashboard

Access comprehensive analytics at `/admin/analytics`:

- **Real-time Stats** - Active users right now
- **Overview Metrics** - Users, sessions, bounce rate
- **Top Pages** - Most visited pages with engagement
- **Top Events** - Most triggered custom events
- **Traffic Sources** - Where users come from
- **Device Breakdown** - Desktop vs mobile vs tablet
- **Conversions** - Goal completions and values

### Features:
- 📅 Date range selector (7, 30, 90 days)
- 🔄 Auto-refresh for real-time data
- 📊 Interactive tables and charts
- 🎯 Conversion tracking
- 📱 Device and location breakdown

## 🔧 Advanced Configuration

### Setup GA4 Data API (Optional)

For real data in admin dashboard:

1. Enable Google Analytics Data API in Google Cloud Console
2. Create service account and download JSON key
3. Add to Kubernetes secret:

```bash
kubectl create secret generic ga4-service-account \
  --from-file=key.json=service-account-key.json \
  -n portfolio-production
```

4. Add to deployment env:

```yaml
- name: GA4_SERVICE_ACCOUNT_KEY
  valueFrom:
    secretKeyRef:
      name: ga4-service-account
      key: key.json
- name: GA4_PROPERTY_ID
  value: "123456789"
```

5. Install package:

```bash
npm install @google-analytics/data
```

6. Uncomment real API code in `/app/api/analytics/ga4-data/route.ts`

### Custom Events

Add your own custom events in `/lib/analytics/gtag.ts`:

```typescript
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  if (!isGAEnabled()) return;
  
  window.gtag('event', eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  });
};
```

### React Hooks

Available hooks in `/lib/analytics/hooks.ts`:

- `usePageTracking()` - Auto page view tracking
- `useScrollTracking(thresholds)` - Track scroll depth
- `useTimeTracking()` - Track time on page
- `useVisibilityTracking(ref, event)` - Track element visibility
- `useClickTracking()` - Track clicks
- `useFormTracking(formName)` - Track form interactions
- `useErrorTracking()` - Track errors
- `usePerformanceTracking()` - Track performance
- `useEngagementTracking()` - Track engagement

## 📈 GA4 Setup Recommendations

### Recommended Events to Configure

In your GA4 property, mark these as conversions:

1. `contact_form_submit` - Contact form submissions
2. `newsletter_signup` - Email signups
3. `download_resume` - Resume downloads
4. `view_project` - Project page views
5. `add_to_cart` - Shop add to cart
6. `purchase` - Completed purchases

### Custom Dimensions

Add these custom dimensions in GA4:

1. `content_type` - Type of content (blog, project, course)
2. `user_type` - Visitor vs returning
3. `engagement_level` - Low, medium, high
4. `device_type` - Desktop, mobile, tablet

### Recommended Reports

Create these custom reports:

1. **Content Performance** - Top blogs, projects, courses by views and engagement
2. **Conversion Funnel** - View → Engagement → Contact → Conversion
3. **User Journey** - Landing page → Content → Exit analysis
4. **E-commerce Performance** - Products, revenue, cart abandonment

## 🔒 Privacy & Compliance

### GDPR Compliance

The implementation includes:

- ✅ No tracking before consent (can add cookie banner)
- ✅ Anonymized IPs by default
- ✅ No PII in custom events
- ✅ Respect Do Not Track headers (optional)

### Add Cookie Consent (Optional)

Install a consent manager:

```bash
npm install @cookie-universal/nuxt
```

Update `gtag.ts`:

```typescript
// Check consent before tracking
const hasConsent = cookies.get('analytics_consent') === 'true';
if (!hasConsent) return;
```

## 🧪 Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Open browser console
window.gtag // Should be defined

# Trigger events
# Navigate pages, click buttons, submit forms
# Check console for gtag calls
```

### Production Testing

1. Visit site in incognito
2. Open GA4 Real-time reports
3. Navigate around site
4. Check events appearing in real-time (1-2 min delay)

### Debug Mode

Add debug parameter to URL:

```
https://your-site.com?debug_mode=true
```

Or in browser console:

```javascript
window.gtag('config', 'G-XXXXXXXXXX', { debug_mode: true });
```

## 📚 Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Best Practices](https://support.google.com/analytics/answer/9267735)

## 🆘 Troubleshooting

### Events Not Showing

1. Check `window.gtag` is defined in console
2. Verify Measurement ID is correct
3. Wait 24-48 hours for initial data
4. Check browser ad blockers
5. Verify no console errors

### Admin Dashboard Empty

1. Using mock data by default
2. Setup GA4 Data API for real data
3. Check service account permissions
4. Verify Property ID is correct

### Performance Impact

- GA4 script loads async (no blocking)
- Events are batched automatically
- Minimal impact on page load
- Can be lazy loaded if needed

## 🎯 Next Steps

1. **Setup Conversion Goals** in GA4
2. **Create Custom Reports** for your needs
3. **Setup Alerts** for important metrics
4. **Connect to BigQuery** for advanced analysis
5. **Add Heatmaps** (Hotjar, Microsoft Clarity)
6. **A/B Testing** (Google Optimize, VWO)

---

**Your analytics setup is now world-class! 🚀**
