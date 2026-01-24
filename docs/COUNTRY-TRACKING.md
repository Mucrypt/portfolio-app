# Country Tracking Setup Guide

## Overview

Your admin dashboard now includes country tracking for all visitors. This tracks which countries your users are visiting from using Vercel's geolocation headers.

## Features Added

### 1. CountryStatsWidget

- **Location**: `components/admin/CountryStatsWidget.tsx`
- **Shows**: Top 10 countries by visits
- **Includes**:
  - Country flags (emoji)
  - Visit counts
  - Unique user counts
  - Percentage distribution
  - Time range selector (24h, 7d, 30d)

### 2. Geolocation Utilities

- **Location**: `lib/utils/geolocation.ts`
- **Functions**:
  - `getGeoLocation()` - Gets country, city, region from Vercel headers
  - `getUserIP()` - Gets user's IP address
  - `getDeviceInfo()` - Gets device type and browser

### 3. Activity Logger

- **Location**: `lib/utils/activity-logger.ts`
- **Functions**:
  - `logUserActivity()` - Logs any activity with location data
  - `logPageView()` - Specifically logs page views

## How to Track Activities

### Option 1: Automatic Page View Tracking

Add to any page you want to track:

\`\`\`tsx
import { logPageView } from '@/lib/utils/activity-logger'

export default async function MyPage() {
// Log the page view
await logPageView('/my-page')

return <div>My Page</div>
}
\`\`\`

### Option 2: Track Specific Actions

\`\`\`tsx
import { logUserActivity } from '@/lib/utils/activity-logger'

// Track login
await logUserActivity('login', { method: 'email' })

// Track contact form submission
await logUserActivity('contact', { subject: 'Inquiry' })

// Track service request
await logUserActivity('service_request', { service: 'Web Development' })

// Track download
await logUserActivity('download', { file: 'resume.pdf' })
\`\`\`

## Data Stored

For each activity, the following location data is automatically stored in `user_activity_log.activity_data`:

```json
{
  "country": "United States",
  "country_code": "US",
  "city": "New York",
  "region": "NY",
  "latitude": "40.7128",
  "longitude": "-74.0060",
  "ip_address": "xxx.xxx.xxx.xxx",
  "device": "Desktop",
  "browser": "Chrome",
  "timestamp": "2026-01-24T10:30:00.000Z"
}
```

## Important Notes

### Vercel Geolocation Headers

These headers are only available in **production** on Vercel:

- `x-vercel-ip-country` - Country name
- `x-vercel-ip-country-code` - ISO country code
- `x-vercel-ip-city` - City name
- `x-vercel-ip-country-region` - Region/state
- `x-vercel-ip-latitude` - Latitude
- `x-vercel-ip-longitude` - Longitude

In **local development**, all location data will show as "Unknown" or "XX".

### Testing in Production

After deploying to Vercel, the country tracking will work automatically. Vercel's Edge Network provides these headers for every request.

### Privacy Considerations

- IP addresses are logged but can be anonymized if needed
- User location data is only visible to admins
- Complies with GDPR as long as you have proper privacy policy
- Consider adding a banner about analytics tracking

## Quick Start

1. **Deploy to Vercel** (headers only work in production)
2. **Visit your site** from different locations/countries
3. **Check Admin Dashboard** → Country Stats Widget will show visitor countries
4. **Add tracking** to important pages (login, contact, shop, etc.)

## Example: Track Login Page

Add this to your login page:

\`\`\`tsx
// app/login/page.tsx
import { logPageView } from '@/lib/utils/activity-logger'

export default async function LoginPage() {
await logPageView('/login')

// ... rest of your page
}
\`\`\`

## Advanced: Custom Activity Tracking

Track any custom activity:

\`\`\`tsx
await logUserActivity('other', {
action: 'video_watched',
video_id: '123',
duration: 60,
// Location data is added automatically
})
\`\`\`

## Dashboard View

The Country Stats Widget shows:

- 🏴 Country flags
- 📊 Visit counts and percentages
- 👥 Unique user counts
- 📈 Visual progress bars
- ⏱️ Time range selector

## Troubleshooting

**Problem**: All locations show as "Unknown"

- **Solution**: Make sure you're viewing in production on Vercel, not localhost

**Problem**: No data in widget

- **Solution**: Make sure activity logging is added to pages and users have visited

**Problem**: Country flags not showing

- **Solution**: Country codes might be missing, check activity_data in database

## Next Steps

1. Add `logPageView()` to all important pages
2. Track specific actions (login, contact, purchases)
3. Consider adding a world map visualization
4. Set up alerts for unusual country activity
5. Export country data for reports
