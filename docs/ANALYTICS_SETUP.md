# 🚀 Google Analytics 4 Integration - World-Class Analytics

## Overview

Your portfolio app now has **enterprise-level analytics tracking** powered by Google Analytics 4, featuring:

- ✅ **Automatic Page View Tracking** - Every page visit recorded
- ✅ **Custom Event Tracking** - 20+ portfolio-specific events
- ✅ **Real-time Analytics** - Live user monitoring
- ✅ **E-commerce Tracking** - Complete shop analytics
- ✅ **Performance Metrics** - FCP, LCP, page load times
- ✅ **User Behavior** - Scroll depth, time on page, engagement
- ✅ **Error Tracking** - JavaScript errors and exceptions
- ✅ **Conversion Tracking** - Forms, downloads, social shares
- ✅ **Admin Dashboard** - Beautiful analytics visualization

## Setup Instructions

### 1. Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" (bottom left)
3. Create a new GA4 Property:
   - Property name: "Portfolio App"
   - Reporting timezone: Your timezone
   - Currency: USD
4. Create a Data Stream:
   - Platform: **Web**
   - Website URL: `https://romeomukulah.org`
   - Stream name: "Portfolio Website"
5. **Copy your Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Add Environment Variable

Add to your `.env.local` and production environment:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Deploy

```bash
./scripts/deploy.sh "feat: enable Google Analytics 4 tracking"
```

That's it! Analytics will start collecting data immediately.

## Features

### Automatic Tracking

These are tracked automatically on every page:

- **Page Views** - Every page navigation
- **Scroll Depth** - 25%, 50%, 75%, 100% milestones
- **Time on Page** - Engagement duration
- **Performance Metrics** - Load times, FCP, LCP
- **JavaScript Errors** - Automatic error reporting
- **User Engagement** - Click patterns, interactions

### Portfolio-Specific Events

#### Blog Tracking
```typescript
// Automatically tracked on blog post views
trackBlogView(postId, postTitle, category);
```

#### Project Tracking
```typescript
// Add to your project detail pages
import ContentTracker from '@/components/analytics/ContentTracker';

<ContentTracker type="project" itemId={projectId} itemName={projectName} />
```

#### Course Tracking
```typescript
<ContentTracker type="course" itemId={courseId} itemName={courseName} />
```

#### Service Tracking
```typescript
<ContentTracker type="service" itemId={serviceId} itemName={serviceName} />
```

### E-commerce Events

#### Add to Cart
```typescript
import { trackAddToCart } from '@/lib/analytics/gtag';

trackAddToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  quantity: 1,
});
```

#### Begin Checkout
```typescript
import { trackBeginCheckout } from '@/lib/analytics/gtag';

trackBeginCheckout(cartItems, totalValue);
```

#### Purchase
```typescript
import { trackPurchase } from '@/lib/analytics/gtag';

trackPurchase(transactionId, items, totalValue, tax, shipping);
```

### Form Tracking

Use the trackable form component:

```typescript
import { TrackableForm } from '@/components/analytics/TrackableComponents';

<TrackableForm formName="contact_form" onSubmit={handleSubmit}>
  {/* form fields */}
</TrackableForm>
```

### Button Tracking

```typescript
import { TrackableButton } from '@/components/analytics/TrackableComponents';

<TrackableButton 
  eventName="cta_click"
  eventCategory="conversion"
  eventLabel="hire_me"
>
  Hire Me
</TrackableButton>
```

### External Link Tracking

```typescript
import { TrackableLink } from '@/components/analytics/TrackableComponents';

<TrackableLink href="https://github.com/yourprofile">
  View on GitHub
</TrackableLink>
```

### Download Tracking

```typescript
import { DownloadButton } from '@/components/analytics/TrackableComponents';

<DownloadButton 
  fileName="resume.pdf"
  fileType="pdf"
  downloadUrl="/downloads/resume.pdf"
>
  Download Resume
</DownloadButton>
```

### Social Share Tracking

```typescript
import { SocialShareButton } from '@/components/analytics/TrackableComponents';

<SocialShareButton 
  platform="twitter"
  url={postUrl}
  title={postTitle}
>
  Share on Twitter
</SocialShareButton>
```

## Admin Dashboard

Access your analytics dashboard at: **`/admin/analytics`**

### Features:

1. **Real-time Active Users** - See who's online right now
2. **Key Metrics Overview** - Users, sessions, duration, bounce rate
3. **Top Pages** - Most visited pages with engagement stats
4. **Top Events** - Most triggered custom events
5. **Traffic Sources** - Where users come from
6. **Device Breakdown** - Desktop, mobile, tablet stats
7. **Conversions** - Track goal completions
8. **Date Range Selector** - 7, 30, or 90 days
9. **Auto-refresh** - Real-time data updates every 30s

## Advanced Features

### Custom User Properties

Set user properties for segmentation:

```typescript
import { setUserProperties } from '@/lib/analytics/gtag';

setUserProperties({
  user_type: 'premium',
  industry: 'technology',
  company_size: '50-200',
});
```

### User ID Tracking

Track authenticated users:

```typescript
import { setUserId } from '@/lib/analytics/gtag';

setUserId(user.id);
```

### Custom Timing Events

Track custom performance metrics:

```typescript
import { trackTiming } from '@/lib/analytics/gtag';

const startTime = Date.now();
// ... some operation ...
const duration = Date.now() - startTime;

trackTiming('api_call', duration, 'performance', 'supabase_query');
```

### Search Tracking

Track site searches:

```typescript
import { trackSearch } from '@/lib/analytics/gtag';

trackSearch(searchQuery, resultCount);
```

### Video Tracking

Track video plays:

```typescript
import { trackVideoPlay } from '@/lib/analytics/gtag';

trackVideoPlay(videoTitle, videoId);
```

## Data & Privacy

### GDPR Compliance

GA4 is GDPR compliant. For EU users, consider adding a cookie consent banner:

```typescript
// Example consent logic
if (userConsentedToCookies) {
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
  });
}
```

### Data Retention

Configure data retention in GA4 settings:
- **Admin → Data Settings → Data Retention**
- Recommended: 14 months

### IP Anonymization

GA4 automatically anonymizes IP addresses.

## Troubleshooting

### Analytics Not Showing

1. **Check Measurement ID**
   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **Verify GA4 Script Loading**
   - Open browser DevTools → Network tab
   - Look for requests to `googletagmanager.com`

3. **Check Real-time Reports**
   - GA4 → Reports → Realtime
   - Should see activity within seconds

### Debug Mode

Enable debug mode in development:

```bash
# .env.local
NEXT_PUBLIC_GA_DEBUG=true
```

Then check browser console for GA4 events.

## Best Practices

1. ✅ **Track Meaningful Events** - Only track what you'll analyze
2. ✅ **Use Descriptive Names** - Clear event and parameter names
3. ✅ **Set Up Conversions** - Define goals in GA4
4. ✅ **Monitor Dashboard** - Check analytics weekly
5. ✅ **A/B Test** - Use insights to improve UX
6. ✅ **Privacy First** - Respect user data
7. ✅ **Regular Reports** - Export monthly insights

## Reports to Monitor

### Daily
- Active users (real-time)
- Top pages
- Bounce rate
- Errors/exceptions

### Weekly
- User growth trends
- Traffic sources
- Device breakdown
- Top events

### Monthly
- Conversion rates
- User retention
- Geographic data
- Performance metrics

## Next Steps

1. **Set Up Conversions** in GA4:
   - Contact form submissions
   - Newsletter signups
   - Download resume
   - Service inquiries

2. **Create Audiences** for remarketing:
   - Blog readers
   - Service page visitors
   - Cart abandoners

3. **Set Up Alerts** for anomalies:
   - Traffic spikes/drops
   - Error rate increases
   - Bounce rate changes

4. **Connect Google Search Console**:
   - Admin → Property Settings → Search Console Links

5. **Enable BigQuery Export** (for advanced analysis):
   - Admin → Product Links → BigQuery Links

## Support

For GA4-specific questions:
- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Events Reference](https://support.google.com/analytics/answer/9267735)

---

**🎉 Your portfolio now has world-class analytics!**

Monitor, analyze, and optimize your user experience with data-driven insights.
