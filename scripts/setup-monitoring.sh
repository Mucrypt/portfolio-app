#!/bin/bash

#################################################
# Production Monitoring Setup Script
# Sets up comprehensive monitoring for Vercel app
#################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${1:-romeomukulah.org}"
NOTIFICATION_EMAIL="${2:-}"
SLACK_WEBHOOK="${3:-}"

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║      Production Monitoring Setup v1.0.0              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Domain:${NC} $DOMAIN"
echo ""

#################################################
# 1. UptimeRobot Setup Instructions
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}1. UPTIME MONITORING (UptimeRobot)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "UptimeRobot provides FREE uptime monitoring with:"
echo "  • Checks every 5 minutes (Free tier)"
echo "  • Email/SMS/Slack alerts"
echo "  • 50 monitors for free"
echo "  • Public status page"
echo ""
echo -e "${YELLOW}Setup Steps:${NC}"
echo "1. Go to: https://uptimerobot.com/"
echo "2. Create free account"
echo "3. Click 'Add New Monitor'"
echo "4. Configure:"
echo "   - Monitor Type: HTTPS"
echo "   - Friendly Name: Portfolio Production"
echo "   - URL: https://$DOMAIN"
echo "   - Monitoring Interval: 5 minutes"
echo "5. Add alert contacts (email/Slack)"
echo "6. Create public status page (optional)"
echo ""
echo -e "${GREEN}✓${NC} Free tier includes 50 monitors + 5-minute checks"
echo ""

#################################################
# 2. Error Tracking Setup
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}2. ERROR TRACKING (Sentry)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Sentry FREE tier includes:"
echo "  • 5,000 errors/month"
echo "  • Performance monitoring"
echo "  • Source maps support"
echo "  • Email alerts"
echo ""
echo -e "${YELLOW}Setup Steps:${NC}"
echo "1. Go to: https://sentry.io/signup/"
echo "2. Create free account"
echo "3. Create new project: Next.js"
echo "4. Install Sentry:"
echo ""
echo -e "${BLUE}   npm install @sentry/nextjs${NC}"
echo ""
echo "5. Run setup wizard:"
echo ""
echo -e "${BLUE}   npx @sentry/wizard@latest -i nextjs${NC}"
echo ""
echo "6. Add environment variables to Vercel:"
echo ""
echo -e "${BLUE}   vercel env add NEXT_PUBLIC_SENTRY_DSN${NC}"
echo -e "${BLUE}   vercel env add SENTRY_AUTH_TOKEN${NC}"
echo ""
echo -e "${GREEN}✓${NC} Free tier: 5,000 errors/month"
echo ""

#################################################
# 3. Performance Monitoring
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}3. PERFORMANCE MONITORING (Vercel Analytics)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Vercel Analytics (FREE on all plans):"
echo "  • Web Vitals monitoring"
echo "  • Real User Monitoring (RUM)"
echo "  • Performance insights"
echo "  • Audience analytics"
echo ""
echo -e "${YELLOW}Setup Steps:${NC}"
echo "1. Install Vercel Analytics:"
echo ""
echo -e "${BLUE}   npm install @vercel/analytics${NC}"
echo ""
echo "2. Add to app/layout.tsx:"
echo ""
cat << 'EOF'
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
EOF
echo ""
echo "3. Deploy and view analytics in Vercel Dashboard"
echo ""
echo -e "${GREEN}✓${NC} 100% FREE on all Vercel plans"
echo ""

#################################################
# 4. Speed Monitoring
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}4. SPEED MONITORING (Vercel Speed Insights)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Vercel Speed Insights (FREE up to 100k data points):"
echo "  • Core Web Vitals (LCP, FID, CLS)"
echo "  • Real-time performance data"
echo "  • Page-by-page breakdown"
echo ""
echo -e "${YELLOW}Setup Steps:${NC}"
echo "1. Install Speed Insights:"
echo ""
echo -e "${BLUE}   npm install @vercel/speed-insights${NC}"
echo ""
echo "2. Add to app/layout.tsx:"
echo ""
cat << 'EOF'
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
EOF
echo ""
echo -e "${GREEN}✓${NC} FREE: 100k data points/month (enough for 300k+ visitors)"
echo ""

#################################################
# 5. Log Management
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}5. LOG MANAGEMENT (BetterStack)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "BetterStack FREE tier includes:"
echo "  • 1GB logs/month"
echo "  • 1-day retention"
echo "  • Real-time search"
echo "  • Integrates with Vercel"
echo ""
echo -e "${YELLOW}Setup Steps:${NC}"
echo "1. Go to: https://betterstack.com/logs"
echo "2. Create free account"
echo "3. Add Vercel integration"
echo "4. Logs automatically stream to BetterStack"
echo ""
echo -e "${GREEN}✓${NC} Free tier: 1GB logs/month + 1-day retention"
echo ""

#################################################
# 6. Database Monitoring
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}6. DATABASE MONITORING (Supabase Dashboard)${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Supabase FREE tier includes:"
echo "  • Database performance metrics"
echo "  • Query statistics"
echo "  • Connection pooling"
echo "  • 500MB database storage"
echo ""
echo -e "${YELLOW}Monitoring Features:${NC}"
echo "1. Go to: Supabase Dashboard → Project → Reports"
echo "2. Monitor:"
echo "   - API requests/second"
echo "   - Database CPU usage"
echo "   - Storage usage"
echo "   - Active connections"
echo "3. Set up alerts for high usage"
echo ""
echo -e "${GREEN}✓${NC} Built-in monitoring on free tier"
echo ""

#################################################
# 7. Security Monitoring
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}7. SECURITY MONITORING${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}A. SSL Certificate Monitoring:${NC}"
echo ""
echo "Vercel automatically handles SSL certificates:"
echo "  • Auto-renewal (Let's Encrypt)"
echo "  • Wildcard certificates"
echo "  • No action required"
echo ""
echo -e "${YELLOW}B. Dependency Scanning:${NC}"
echo ""
echo "Use Snyk (FREE tier):"
echo "1. Go to: https://snyk.io/signup/"
echo "2. Connect GitHub repository"
echo "3. Enable automatic PR checks"
echo "4. Get weekly vulnerability reports"
echo ""
echo -e "${GREEN}✓${NC} Free: Unlimited scans for open-source projects"
echo ""
echo -e "${YELLOW}C. Security Headers Check:${NC}"
echo ""
echo "Test your security headers:"
echo -e "${BLUE}   curl -I https://$DOMAIN${NC}"
echo ""

#################################################
# 8. Create Local Monitoring Script
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}8. CREATING LOCAL MONITORING SCRIPT${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create comprehensive health check script
cat > "$(dirname "$0")/health-check.sh" << 'HEALTHCHECK'
#!/bin/bash

# Comprehensive health check for production site

DOMAIN="${1:-romeomukulah.org}"
FAILURES=0

echo "Running comprehensive health check for https://$DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. HTTP Status Check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ HTTP Status: $HTTP_STATUS (OK)"
else
    echo "❌ HTTP Status: $HTTP_STATUS (FAIL)"
    FAILURES=$((FAILURES + 1))
fi

# 2. Response Time Check
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://$DOMAIN)
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo "✅ Response Time: ${RESPONSE_TIME}s (OK)"
else
    echo "⚠️  Response Time: ${RESPONSE_TIME}s (SLOW)"
fi

# 3. SSL Certificate Check
SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$SSL_EXPIRY" ]; then
    echo "✅ SSL Certificate: Valid (Expires: $SSL_EXPIRY)"
else
    echo "❌ SSL Certificate: Invalid"
    FAILURES=$((FAILURES + 1))
fi

# 4. DNS Resolution Check
DNS_IP=$(dig +short $DOMAIN | head -1)
if [ -n "$DNS_IP" ]; then
    echo "✅ DNS Resolution: $DNS_IP"
else
    echo "❌ DNS Resolution: Failed"
    FAILURES=$((FAILURES + 1))
fi

# 5. Security Headers Check
echo ""
echo "Security Headers:"
HEADERS=$(curl -sI https://$DOMAIN)

check_header() {
    local HEADER=$1
    if echo "$HEADERS" | grep -qi "$HEADER"; then
        echo "  ✅ $HEADER: Present"
    else
        echo "  ⚠️  $HEADER: Missing"
    fi
}

check_header "strict-transport-security"
check_header "x-frame-options"
check_header "x-content-type-options"
check_header "content-security-policy"

# 6. Performance Metrics
echo ""
echo "Performance Metrics:"
PERF=$(curl -s -o /dev/null -w "DNS:%{time_namelookup}s Connect:%{time_connect}s TLS:%{time_appconnect}s TTFB:%{time_starttransfer}s Total:%{time_total}s" https://$DOMAIN)
echo "  $PERF"

# 7. API Health Check (if you have health endpoint)
echo ""
echo "API Health:"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health 2>/dev/null || echo "N/A")
if [ "$API_STATUS" == "200" ]; then
    echo "  ✅ API: Healthy"
elif [ "$API_STATUS" == "N/A" ]; then
    echo "  ℹ️  API: No health endpoint"
else
    echo "  ⚠️  API: Status $API_STATUS"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FAILURES -eq 0 ]; then
    echo "✅ All critical checks passed!"
    exit 0
else
    echo "❌ $FAILURES critical check(s) failed!"
    exit 1
fi
HEALTHCHECK

chmod +x "$(dirname "$0")/health-check.sh"

echo -e "${GREEN}✅ Created health-check.sh${NC}"
echo ""
echo "Run health checks with:"
echo -e "${BLUE}   ./scripts/health-check.sh $DOMAIN${NC}"
echo ""

#################################################
# 9. Create Automated Monitoring Cron
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}9. AUTOMATED LOCAL MONITORING${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Optional: Set up cron job for automated checks${NC}"
echo ""
echo "Add to crontab (run every 5 minutes):"
echo ""
echo -e "${BLUE}   */5 * * * * $(pwd)/scripts/health-check.sh $DOMAIN >> /var/log/portfolio-health.log 2>&1${NC}"
echo ""
echo "To add:"
echo -e "${BLUE}   crontab -e${NC}"
echo ""

#################################################
# Summary
#################################################

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}MONITORING SETUP COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}✅ What's Configured:${NC}"
echo "  1. ✅ Enhanced security headers in vercel.json"
echo "  2. ✅ Local health check script created"
echo "  3. 📋 Instructions for 7 monitoring services (all FREE)"
echo ""
echo -e "${YELLOW}⏭️  Next Steps:${NC}"
echo "  1. Set up UptimeRobot (5 minutes)"
echo "  2. Install Sentry for error tracking (10 minutes)"
echo "  3. Add Vercel Analytics (2 minutes)"
echo "  4. Deploy updated vercel.json:"
echo -e "     ${BLUE}git add vercel.json && git commit -m 'feat: enhance security headers' && git push${NC}"
echo ""
echo -e "${CYAN}📊 Monitoring Stack (All FREE):${NC}"
echo "  • Uptime: UptimeRobot (checks every 5 min)"
echo "  • Errors: Sentry (5k errors/month)"
echo "  • Performance: Vercel Analytics"
echo "  • Speed: Vercel Speed Insights"
echo "  • Logs: BetterStack (1GB/month)"
echo "  • Database: Supabase Dashboard"
echo "  • Security: Snyk + Security headers"
echo "  • Local: health-check.sh script"
echo ""
echo -e "${GREEN}💰 Total Cost: \$0/month (100% FREE)${NC}"
echo ""
echo "Run health check now:"
echo -e "${BLUE}   ./scripts/health-check.sh $DOMAIN${NC}"
echo ""
