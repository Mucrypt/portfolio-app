#!/bin/bash

# Log Viewer Script
# Easy access to container logs

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📝 Portfolio Application Logs${NC}"
echo ""
echo "Select logs to view:"
echo "1) Development (all services)"
echo "2) Production (all services)"
echo "3) App container only"
echo "4) Nginx container only"
echo "5) Nginx access logs"
echo "6) Nginx error logs"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${GREEN}Showing development logs...${NC}"
        docker-compose -f docker/docker-compose.yml logs -f --tail=100
        ;;
    2)
        echo -e "${GREEN}Showing production logs...${NC}"
        docker-compose -f docker/docker-compose.prod.yml logs -f --tail=100
        ;;
    3)
        echo -e "${GREEN}Showing app container logs...${NC}"
        docker logs -f portfolio-app --tail=100
        ;;
    4)
        echo -e "${GREEN}Showing Nginx container logs...${NC}"
        docker logs -f portfolio-nginx --tail=100
        ;;
    5)
        echo -e "${GREEN}Showing Nginx access logs...${NC}"
        docker exec portfolio-nginx tail -f /var/log/nginx/portfolio_access.log
        ;;
    6)
        echo -e "${GREEN}Showing Nginx error logs...${NC}"
        docker exec portfolio-nginx tail -f /var/log/nginx/portfolio_error.log
        ;;
    *)
        echo -e "${YELLOW}Invalid choice${NC}"
        exit 1
        ;;
esac
