#!/bin/bash

# Quick Test Script for NiftyTools Backend Comparison
# This script makes it easy to test and compare both backends

set -e

echo "🚀 NiftyTools Backend Quick Test"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to check if services are running
check_services() {
    echo -e "${BLUE}🔍 Checking service status...${NC}"
    
    services=(
        "Gateway:http://localhost:3000/health"
        "Node.js Backend:http://localhost:3001/health"
        "Python Backend:http://localhost:3002/health"
        "Frontend:http://localhost:8080/"
    )
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        url=$(echo $service | cut -d: -f2-)
        
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is running${NC}"
        else
            echo -e "${RED}❌ $name is not accessible${NC}"
        fi
    done
}

# Function to start testing environment
start_test_env() {
    echo -e "${BLUE}🚀 Starting testing environment...${NC}"
    docker-compose -f docker-compose.test.yml down 2>/dev/null || true
    docker-compose -f docker-compose.test.yml up -d --build
    
    echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
    sleep 20
    
    check_services
}

# Function to test a specific backend
test_backend() {
    local backend=$1
    echo -e "${BLUE}🧪 Testing $backend backend...${NC}"
    
    # Switch gateway backend
    if [ "$backend" = "node" ]; then
        docker-compose -f docker-compose.test.yml exec gateway env TEXT_TOOLS_BACKEND=node sh -c 'echo "Switched to Node.js backend"'
        echo -e "${GREEN}✅ Switched to Node.js backend${NC}"
    elif [ "$backend" = "python" ]; then
        docker-compose -f docker-compose.test.yml exec gateway env TEXT_TOOLS_BACKEND=python sh -c 'echo "Switched to Python backend"'
        echo -e "${GREEN}✅ Switched to Python backend${NC}"
    fi
    
    # Restart gateway to apply changes
    docker-compose -f docker-compose.test.yml restart gateway
    sleep 5
    
    # Test API call
    echo -e "${BLUE}📊 Testing API performance...${NC}"
    
    local test_data='{"text":"zebra\napple\nBanana\napple","method":"alphabetical-asc","options":{"caseSensitive":false,"removeDuplicates":true}}'
    
    # Measure response time
    local start_time=$(date +%s%3N)
    local response=$(curl -s -X POST http://localhost:3000/api/text-tools/sort \
        -H "Content-Type: application/json" \
        -d "$test_data")
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))
    
    if echo "$response" | grep -q "success":true; then
        local processing_time=$(echo "$response" | grep -o '"processing_time":[0-9]*' | cut -d: -f2)
        echo -e "${GREEN}✅ $backend backend test successful${NC}"
        echo -e "   📈 Gateway Response Time: ${response_time}ms"
        echo -e "   ⚡ Processing Time: ${processing_time}ms"
    else
        echo -e "${RED}❌ $backend backend test failed${NC}"
        echo -e "   Response: $response"
    fi
}

# Function to run comparison test
run_comparison() {
    echo -e "${BLUE}🏁 Running backend comparison...${NC}"
    
    # Test Node.js
    test_backend "node"
    local node_time=$(curl -s -X POST http://localhost:3000/api/text-tools/sort \
        -H "Content-Type: application/json" \
        -d '{"text":"zebra\napple\nBanana","method":"alphabetical-asc"}' | \
        grep -o '"processing_time":[0-9]*' | cut -d: -f2)
    
    echo ""
    
    # Test Python
    test_backend "python"
    local python_time=$(curl -s -X POST http://localhost:3000/api/text-tools/sort \
        -H "Content-Type: application/json" \
        -d '{"text":"zebra\napple\nBanana","method":"alphabetical-asc"}' | \
        grep -o '"processing_time":[0-9]*' | cut -d: -f2)
    
    echo ""
    echo -e "${YELLOW}📊 Performance Comparison:${NC}"
    echo -e "   Node.js (Express): ${node_time}ms"
    echo -e "   Python (FastAPI):  ${python_time}ms"
    
    if [ -n "$node_time" ] && [ -n "$python_time" ]; then
        local improvement=$((node_time - python_time))
        local percentage=$((improvement * 100 / node_time))
        
        if [ $improvement -gt 0 ]; then
            echo -e "${GREEN}   🏆 Python is ${percentage}% faster!${NC}"
        else
            echo -e "${YELLOW}   📉 Node.js is $((-improvement * 100 / python_time))% faster${NC}"
        fi
    fi
}

# Function to show URLs
show_urls() {
    echo -e "${BLUE}🌐 Service URLs:${NC}"
    echo -e "   Frontend:        http://localhost:8080"
    echo -e "   Gateway:         http://localhost:3000"
    echo -e "   Node.js API:     http://localhost:3001/docs"
    echo -e "   Python API:      http://localhost:3002/docs"
    echo ""
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Showing logs (Ctrl+C to exit):${NC}"
    docker-compose -f docker-compose.test.yml logs -f
}

# Main menu
case "${1:-help}" in
    "start")
        check_docker
        start_test_env
        show_urls
        ;;
    "node")
        test_backend "node"
        ;;
    "python")
        test_backend "python"
        ;;
    "compare")
        check_docker
        start_test_env
        run_comparison
        ;;
    "status")
        check_services
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        echo -e "${BLUE}🛑 Stopping testing environment...${NC}"
        docker-compose -f docker-compose.test.yml down
        ;;
    "clean")
        echo -e "${BLUE}🧹 Cleaning up...${NC}"
        docker-compose -f docker-compose.test.yml down -v
        docker system prune -f
        ;;
    "help"|*)
        echo "Usage: $0 {start|node|python|compare|status|logs|stop|clean|help}"
        echo ""
        echo "Commands:"
        echo "  start    - Start testing environment with both backends"
        echo "  node     - Test Node.js backend"
        echo "  python   - Test Python backend"
        echo "  compare  - Run performance comparison"
        echo "  status   - Check service status"
        echo "  logs     - Show service logs"
        echo "  stop     - Stop testing environment"
        echo "  clean    - Clean up Docker resources"
        echo "  help     - Show this help"
        echo ""
        echo "Quick Start:"
        echo "  $0 start    # Start environment"
        echo "  $0 compare  # Run comparison test"
        echo ""
        ;;
esac
