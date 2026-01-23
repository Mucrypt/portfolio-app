#!/bin/bash

################################################################################
# Vercel DNS Propagation Monitor
# Monitors DNS propagation and alerts when domain is ready
################################################################################

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_progress() { echo -e "${CYAN}⏳ $1${NC}"; }

# Configuration
DOMAIN="${1:-romeomukulah.org}"
CHECK_INTERVAL="${2:-10}"  # seconds
MAX_CHECKS="${3:-360}"     # 360 checks * 10 seconds = 1 hour
VERCEL_IP="76.76.21.21"
VERCEL_CNAME="cname.vercel-dns.com"

# DNS Servers to check (global coverage)
DNS_SERVERS=(
    "8.8.8.8:Google"
    "1.1.1.1:Cloudflare"
    "208.67.222.222:OpenDNS"
    "9.9.9.9:Quad9"
    "64.6.64.6:Verisign"
    "77.88.8.8:Yandex"
)

# Statistics
CHECKS_DONE=0
SUCCESSFUL_CHECKS=0
FAILED_CHECKS=0
START_TIME=$(date +%s)

print_header() {
    clear
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║      Vercel DNS Propagation Monitor v1.0.0           ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Domain:${NC}           $DOMAIN"
    echo -e "${CYAN}Target IP:${NC}        $VERCEL_IP"
    echo -e "${CYAN}Check Interval:${NC}   ${CHECK_INTERVAL}s"
    echo -e "${CYAN}Started:${NC}          $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

check_prerequisites() {
    local missing=0
    
    for cmd in dig curl host nslookup; do
        if ! command -v $cmd &> /dev/null; then
            log_error "$cmd is not installed"
            missing=1
        fi
    done
    
    if [ $missing -eq 1 ]; then
        echo ""
        echo "Install missing tools:"
        echo "  Ubuntu/Debian: sudo apt-get install dnsutils curl"
        echo "  CentOS/RHEL:   sudo yum install bind-utils curl"
        echo "  macOS:         brew install bind"
        exit 1
    fi
}

get_dns_info() {
    local server=$1
    local server_ip="${server%%:*}"
    local server_name="${server##*:}"
    
    # Get A record
    local result=$(dig +short @"$server_ip" "$DOMAIN" A 2>/dev/null | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -1)
    
    if [ -z "$result" ]; then
        result="NO_RESPONSE"
    fi
    
    echo "$result"
}

check_dns_propagation() {
    local all_correct=true
    local results=()
    
    log_info "Checking DNS servers globally..."
    echo ""
    
    for server in "${DNS_SERVERS[@]}"; do
        local server_ip="${server%%:*}"
        local server_name="${server##*:}"
        
        local ip=$(get_dns_info "$server")
        
        if [ "$ip" == "$VERCEL_IP" ]; then
            log_success "✓ $server_name ($server_ip): $ip"
            results+=("✓")
        elif [ "$ip" == "NO_RESPONSE" ]; then
            log_warning "? $server_name ($server_ip): No response"
            results+=("?")
            all_correct=false
        else
            log_error "✗ $server_name ($server_ip): $ip (expected $VERCEL_IP)"
            results+=("✗")
            all_correct=false
        fi
    done
    
    echo ""
    
    # Calculate success rate
    local total=${#DNS_SERVERS[@]}
    local success=$(echo "${results[@]}" | tr -cd '✓' | wc -c)
    local percentage=$((success * 100 / total))
    
    echo -e "${CYAN}Propagation Status:${NC} $success/$total servers (${percentage}%)"
    
    if [ "$all_correct" = true ]; then
        return 0
    else
        return 1
    fi
}

check_ssl_certificate() {
    log_info "Checking SSL certificate..."
    
    local ssl_info=$(echo | timeout 5 openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -issuer -dates 2>/dev/null)
    
    if [ -n "$ssl_info" ]; then
        log_success "SSL certificate is active"
        echo "$ssl_info" | grep -E "issuer|notAfter" | sed 's/^/         /'
    else
        log_warning "SSL certificate not yet active (may take 10-15 minutes)"
    fi
    
    echo ""
}

check_website_response() {
    log_info "Checking website response..."
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" --max-time 10 2>/dev/null || echo "000")
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN" --max-time 10 2>/dev/null || echo "N/A")
    
    if [ "$http_code" == "200" ]; then
        log_success "Website is live (HTTP $http_code, ${response_time}s)"
    elif [ "$http_code" == "000" ]; then
        log_warning "Website not responding yet"
    else
        log_warning "Website returned HTTP $http_code"
    fi
    
    # Check if it's served by Vercel
    local server_header=$(curl -s -I "https://$DOMAIN" --max-time 10 2>/dev/null | grep -i "^server:" | cut -d' ' -f2- | tr -d '\r\n')
    
    if [ -n "$server_header" ]; then
        if echo "$server_header" | grep -qi "vercel"; then
            log_success "Served by Vercel ✓"
        else
            log_warning "Server: $server_header (not Vercel yet)"
        fi
    fi
    
    echo ""
}

check_www_subdomain() {
    log_info "Checking www subdomain..."
    
    local www_result=$(dig +short "www.$DOMAIN" CNAME 2>/dev/null | head -1)
    
    if [ -n "$www_result" ]; then
        if echo "$www_result" | grep -q "vercel"; then
            log_success "www.$DOMAIN → $www_result"
        else
            log_warning "www.$DOMAIN → $www_result (not pointing to Vercel)"
        fi
    else
        log_warning "www.$DOMAIN not configured"
    fi
    
    echo ""
}

show_statistics() {
    local elapsed=$(($(date +%s) - START_TIME))
    local minutes=$((elapsed / 60))
    local seconds=$((elapsed % 60))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${CYAN}Statistics:${NC}"
    echo "  Checks performed:  $CHECKS_DONE"
    echo "  Successful:        $SUCCESSFUL_CHECKS"
    echo "  Failed:            $FAILED_CHECKS"
    echo "  Time elapsed:      ${minutes}m ${seconds}s"
    echo ""
}

send_alert() {
    local status=$1
    
    # Terminal bell
    echo -e "\a"
    
    # Desktop notification (if available)
    if command -v notify-send &> /dev/null; then
        if [ "$status" == "success" ]; then
            notify-send "DNS Propagation Complete" "Your domain $DOMAIN is now live on Vercel!" -u normal
        else
            notify-send "DNS Check" "$status" -u low
        fi
    fi
    
    # macOS notification (if available)
    if command -v osascript &> /dev/null; then
        osascript -e "display notification \"$status\" with title \"DNS Propagation Monitor\""
    fi
}

show_final_success() {
    clear
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          DNS Propagation Complete! 🎉                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "Your domain is now live on Vercel!"
    echo ""
    echo -e "${CYAN}Domain:${NC}           https://$DOMAIN"
    echo -e "${CYAN}Status:${NC}           ✅ Fully propagated"
    echo -e "${CYAN}Platform:${NC}         Vercel"
    echo ""
    
    show_statistics
    
    echo "Next steps:"
    echo "  1. Visit: https://$DOMAIN"
    echo "  2. Check analytics: https://vercel.com/dashboard"
    echo "  3. Monitor uptime: ./scripts/vercel-monitor.sh health"
    echo ""
    
    send_alert "success"
}

show_timeout_message() {
    echo ""
    log_warning "DNS propagation is taking longer than expected"
    echo ""
    echo "This is normal and can take up to 48 hours."
    echo ""
    echo "Current status:"
    check_dns_propagation
    echo ""
    echo "To continue monitoring, run:"
    echo "  ./scripts/vercel-dns-monitor.sh $DOMAIN $CHECK_INTERVAL"
    echo ""
    echo "Or check manually:"
    echo "  dig $DOMAIN"
    echo "  nslookup $DOMAIN"
    echo ""
}

monitor_loop() {
    while [ $CHECKS_DONE -lt $MAX_CHECKS ]; do
        CHECKS_DONE=$((CHECKS_DONE + 1))
        
        print_header
        
        echo -e "${MAGENTA}Check #$CHECKS_DONE/$MAX_CHECKS${NC}"
        echo ""
        
        if check_dns_propagation; then
            SUCCESSFUL_CHECKS=$((SUCCESSFUL_CHECKS + 1))
            
            check_www_subdomain
            check_ssl_certificate
            check_website_response
            show_statistics
            
            show_final_success
            exit 0
        else
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            
            check_www_subdomain
            
            show_statistics
            
            if [ $CHECKS_DONE -lt $MAX_CHECKS ]; then
                log_progress "DNS not fully propagated yet. Checking again in ${CHECK_INTERVAL}s..."
                echo ""
                echo "Press Ctrl+C to stop monitoring"
                sleep "$CHECK_INTERVAL"
            fi
        fi
    done
    
    show_timeout_message
}

trap 'echo ""; log_info "Monitoring stopped"; show_statistics; exit 0' INT TERM

main() {
    print_header
    check_prerequisites
    
    log_info "Starting DNS monitoring for $DOMAIN"
    echo ""
    echo "This will check DNS propagation across 6 global DNS servers"
    echo "and alert you when your domain is live on Vercel."
    echo ""
    echo "Press Ctrl+C to stop at any time"
    echo ""
    sleep 3
    
    monitor_loop
}

main "$@"
