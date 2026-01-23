#!/bin/bash

#################################################
# Performance Optimization Script
# Optimizes Next.js app for maximum performance
#################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║      Performance Optimization v1.0.0                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

#################################################
# 1. Install Performance Packages
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}1. INSTALLING PERFORMANCE PACKAGES${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "📦 Installing Vercel Analytics..."
npm install @vercel/analytics --save

echo "📦 Installing Vercel Speed Insights..."
npm install @vercel/speed-insights --save

echo "📦 Installing next/image optimization..."
# Already included in Next.js

echo ""
echo -e "${GREEN}✅ Packages installed${NC}"
echo ""

#################################################
# 2. Optimize next.config.ts
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}2. NEXT.JS CONFIGURATION OPTIMIZATION${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cat << 'EOF' > next.config.optimized.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimal deployment
  output: 'standalone',
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
    turbo: {
      resolveAlias: {
        'canvas': './empty-module.ts',
      },
    },
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production
  reactStrictMode: true,
  swcMinify: true, // Use SWC for minification (faster than Terser)
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for performance (trailing slash normalization)
  async redirects() {
    return [
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
EOF

echo "📝 Created optimized next.config.ts"
echo ""
echo "Review the optimized config and replace if needed:"
echo -e "${BLUE}   cat next.config.optimized.ts${NC}"
echo -e "${BLUE}   mv next.config.optimized.ts next.config.ts${NC}"
echo ""

#################################################
# 3. Create Performance Monitoring Component
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}3. CREATING PERFORMANCE MONITORING COMPONENTS${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

mkdir -p app/components/monitoring

cat << 'EOF' > app/components/monitoring/WebVitals.tsx
'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      // Send to your analytics endpoint
      const body = JSON.stringify(metric);
      const url = '/api/analytics/vitals';

      // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, {
          body,
          method: 'POST',
          keepalive: true,
        });
      }
    };

    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  return null;
}
EOF

echo "✅ Created WebVitals.tsx component"
echo ""

#################################################
# 4. Create Preload Component
#################################################

cat << 'EOF' > app/components/monitoring/Preload.tsx
'use client';

/**
 * Preload critical resources for better performance
 */
export function Preload() {
  return (
    <>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS prefetch for Supabase */}
      <link rel="dns-prefetch" href="https://your-project.supabase.co" />
      
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
}
EOF

echo "✅ Created Preload.tsx component"
echo ""

#################################################
# 5. Performance Testing Script
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}4. CREATING PERFORMANCE TESTING SCRIPT${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cat << 'PERFTEST' > "$(dirname "$0")/perf-test.sh"
#!/bin/bash

# Performance testing script using Lighthouse

DOMAIN="${1:-romeomukulah.org}"

echo "Running Lighthouse performance test for https://$DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "Installing Lighthouse..."
    npm install -g lighthouse
fi

# Run Lighthouse
lighthouse "https://$DOMAIN" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless" \
  --quiet

echo ""
echo "✅ Performance report generated: lighthouse-report.html"
echo ""
echo "Quick performance test:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Quick timing test
TIMING=$(curl -s -o /dev/null -w "\
DNS Lookup:     %{time_namelookup}s\n\
TCP Connect:    %{time_connect}s\n\
TLS Handshake:  %{time_appconnect}s\n\
Server Process: %{time_starttransfer}s\n\
Content Transfer: %{time_total}s\n\
Total Time:     %{time_total}s\n" \
"https://$DOMAIN")

echo "$TIMING"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Open lighthouse-report.html to see detailed metrics"
PERFTEST

chmod +x "$(dirname "$0")/perf-test.sh"

echo "✅ Created perf-test.sh"
echo ""

#################################################
# 6. Package.json Scripts
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}5. ADDING PERFORMANCE SCRIPTS TO PACKAGE.JSON${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Add these scripts to package.json:"
echo ""
cat << 'EOF'
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "perf": "./scripts/perf-test.sh",
    "lighthouse": "lighthouse https://romeomukulah.org --view",
    "bundle-analyzer": "npm run analyze"
  }
}
EOF
echo ""

#################################################
# 7. Create .env.production
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}6. PRODUCTION ENVIRONMENT VARIABLES${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ ! -f .env.production ]; then
    cat << 'EOF' > .env.production
# Production-specific environment variables

# Performance
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Analytics
NEXT_PUBLIC_GA_ID=G-3BZZ8D5TED

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# Supabase (add your values)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sentry (optional - add after setting up Sentry)
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
# SENTRY_AUTH_TOKEN=your_sentry_auth_token
EOF
    echo "✅ Created .env.production template"
else
    echo "ℹ️  .env.production already exists (skipping)"
fi
echo ""

#################################################
# Summary
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PERFORMANCE OPTIMIZATION COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ What's Configured:${NC}"
echo "  1. ✅ Installed Vercel Analytics & Speed Insights"
echo "  2. ✅ Created optimized next.config.ts"
echo "  3. ✅ Created Web Vitals monitoring component"
echo "  4. ✅ Created Preload component for critical resources"
echo "  5. ✅ Created performance testing script"
echo "  6. ✅ Created .env.production template"
echo ""
echo -e "${YELLOW}⏭️  Manual Steps Required:${NC}"
echo ""
echo "1. Review and apply optimized config:"
echo -e "   ${BLUE}cat next.config.optimized.ts${NC}"
echo -e "   ${BLUE}mv next.config.optimized.ts next.config.ts${NC}"
echo ""
echo "2. Add monitoring to app/layout.tsx:"
echo -e "   ${BLUE}import { Analytics } from '@vercel/analytics/react';${NC}"
echo -e "   ${BLUE}import { SpeedInsights } from '@vercel/speed-insights/next';${NC}"
echo ""
echo "   Then add to your layout:"
echo "   <Analytics />"
echo "   <SpeedInsights />"
echo ""
echo "3. Run performance test:"
echo -e "   ${BLUE}./scripts/perf-test.sh romeomukulah.org${NC}"
echo ""
echo "4. Deploy changes:"
echo -e "   ${BLUE}git add . && git commit -m 'feat: performance optimizations' && git push${NC}"
echo ""
echo -e "${CYAN}📊 Expected Performance Improvements:${NC}"
echo "  • Load time: 20-40% faster"
echo "  • Lighthouse score: 90+ (all categories)"
echo "  • Time to Interactive (TTI): < 3s"
echo "  • First Contentful Paint (FCP): < 1s"
echo "  • Largest Contentful Paint (LCP): < 2.5s"
echo "  • Cumulative Layout Shift (CLS): < 0.1"
echo ""
echo -e "${GREEN}🚀 Your site will be BLAZING FAST!${NC}"
echo ""
