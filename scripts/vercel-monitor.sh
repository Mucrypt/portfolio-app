#!/bin/bash

################################################################################
# Vercel Monitoring Script
# Monitors Vercel deployments and provides analytics
################################################################################

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

################################################################################
# Functions
################################################################################

get_deployment_status() {
    log_info "Fetching deployment status..."
    vercel ls --yes || true
}

get_latest_deployment() {
    log_info "Latest deployment info..."
    vercel inspect || true
}

check_production_health() {
    local url="https://romeomukulah.org"
    log_info "Checking production health..."
    
    # Health endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}/api/health" || echo "000")
    if [ "$HTTP_CODE" -eq 200 ]; then
        log_success "Health check: OK (HTTP $HTTP_CODE)"
    else
        log_error "Health check: FAILED (HTTP $HTTP_CODE)"
    fi
    
    # Response time
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$url" || echo "N/A")
    log_info "Response time: ${RESPONSE_TIME}s"
    
    # SSL check
    SSL_EXPIRY=$(echo | openssl s_client -servername romeomukulah.org -connect romeomukulah.org:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "N/A")
    log_info "SSL expires: $SSL_EXPIRY"
}

monitor_deployment_logs() {
    log_info "Streaming deployment logs..."
    log_warning "Press Ctrl+C to stop"
    vercel logs --follow
}

get_deployment_analytics() {
    log_info "Deployment Analytics:"
    echo ""
    
    # Get deployment list in JSON format
    DEPLOYMENTS=$(vercel ls --json 2>/dev/null || echo '[]')
    
    if [ "$DEPLOYMENTS" != "[]" ]; then
        echo "Recent Deployments:"
        vercel ls | head -10
    else
        log_warning "No recent deployments found"
    fi
    
    echo ""
    log_info "For detailed analytics, visit: https://vercel.com/dashboard"
}

run_performance_test() {
    local url="https://romeomukulah.org"
    log_info "Running performance test..."
    
    echo ""
    echo "Testing endpoints:"
    
    # Test multiple endpoints
    for endpoint in "/" "/api/health" "/about" "/projects"; do
        TIME=$(curl -s -o /dev/null -w "%{time_total}" "${url}${endpoint}" 2>/dev/null || echo "N/A")
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}${endpoint}" 2>/dev/null || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "$endpoint: ${TIME}s (HTTP $HTTP_CODE)"
        else
            log_warning "$endpoint: ${TIME}s (HTTP $HTTP_CODE)"
        fi
    done
}

check_domain_dns() {
    log_info "Checking DNS configuration..."
    
    # Check A records
    echo ""
    echo "A Records:"
    dig +short romeomukulah.org A || log_warning "No A records found"
    
    # Check CNAME records
    echo ""
    echo "CNAME Records:"
    dig +short www.romeomukulah.org CNAME || log_warning "No CNAME records found"
    
    # Check if pointing to Vercel
    if dig +short romeomukulah.org | grep -q "76.76.21\|76.223."; then
        log_success "Domain correctly points to Vercel"
    else
        log_warning "Domain may not be pointing to Vercel"
    fi
}

print_dashboard() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║         Vercel Monitoring Dashboard v1.0.0           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_production_health
    echo ""
    run_performance_test
    echo ""
    get_deployment_status
    echo ""
}

print_usage() {
    echo "Usage: $0 {status|health|logs|analytics|performance|dns|dashboard}"
    echo ""
    echo "Commands:"
    echo "  status      - Show deployment status"
    echo "  health      - Check production health"
    echo "  logs        - Stream deployment logs"
    echo "  analytics   - Show deployment analytics"
    echo "  performance - Run performance tests"
    echo "  dns         - Check DNS configuration"
    echo "  dashboard   - Show full monitoring dashboard"
    echo ""
}

################################################################################
# Main
################################################################################

case "${1:-dashboard}" in
    status)
        get_deployment_status
        ;;
    health)
        check_production_health
        ;;
    logs)
        monitor_deployment_logs
        ;;
    analytics)
        get_deployment_analytics
        ;;
    performance)
        run_performance_test
        ;;
    dns)
        check_domain_dns
        ;;
    dashboard)
        print_dashboard
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
