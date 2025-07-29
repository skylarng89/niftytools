#!/bin/bash

# NiftyTools Docker Compose Deployment Script
# This script deploys the NiftyTools stack using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="niftytools"
COMPOSE_FILE="docker-compose-prod.yml"
ENV_FILE=".env.prod"

# Functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if Docker is running
check_docker() {
    log "Checking Docker status..."
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running. Please start Docker first."
    fi
    success "Docker is running"
}

# Create Docker volumes if they don't exist
create_volumes() {
    log "Creating Docker volumes..."
    
    volumes=("niftytools_postgres_data" "niftytools_postgres_backups" "niftytools_redis_data")
    
    for volume in "${volumes[@]}"; do
        if ! docker volume ls --format '{{.Name}}' | grep -q "^${volume}$"; then
            docker volume create "$volume"
            success "Volume '$volume' created"
        else
            warn "Volume '$volume' already exists"
        fi
    done
}

# Validate environment file
validate_env() {
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file '$ENV_FILE' not found. Copy from '.env.prod.example' and configure."
    fi
    
    log "Validating environment configuration..."
    
    # Check required variables
    required_vars=(
        "POSTGRES_PASSWORD"
        "JWT_SECRET"
        "JWT_REFRESH_SECRET"
    )
    
    source "$ENV_FILE"
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            error "Required environment variable '$var' is not set in $ENV_FILE"
        fi
    done
    
    success "Environment configuration validated"
}

# Deploy with Docker Compose
deploy_stack() {
    log "Deploying NiftyTools with Docker Compose..."
    
    # Deploy with Docker Compose
    docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d --remove-orphans
    
    success "NiftyTools deployed successfully"
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment status..."
    
    echo "Waiting for containers to start..."
    sleep 10
    
    # Check container status
    docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
    
    echo ""
    log "Checking container health..."
    
    # Wait for containers to become healthy
    max_attempts=30
    attempt=0
    
    while [[ $attempt -lt $max_attempts ]]; do
        unhealthy_containers=$(docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps --format "table {{.Name}}\t{{.Status}}" | grep -c "unhealthy\|starting" || true)
        
        if [[ $unhealthy_containers -eq 0 ]]; then
            success "All containers are running!"
            break
        fi
        
        echo "Waiting for $unhealthy_containers container(s) to start... (attempt $((attempt + 1))/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    if [[ $attempt -eq $max_attempts ]]; then
        warn "Some containers may not be fully ready. Check 'docker compose -f $COMPOSE_FILE -p $PROJECT_NAME ps' for details."
    fi
    
    echo ""
    log "Final container status:"
    docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
}

# Display access information
show_access_info() {
    source "$ENV_FILE"
    
    echo ""
    success "=== NiftyTools Deployment Complete ==="
    echo ""
    echo "Container Access (for testing):"
    echo "  • User Frontend:  http://localhost:3001"
    echo "  • Admin Frontend: http://localhost:3002"
    echo "  • Backend API:    http://localhost:3000"
    echo ""
    echo "Production Access (via CloudPanel nginx):"
    echo "  • User Frontend:  https://${USER_DOMAIN:-your-domain.com}"
    echo "  • Admin Frontend: https://${ADMIN_DOMAIN:-admin.your-domain.com}"
    echo ""
    echo "Internal Services (Docker network only):"
    echo "  • Backend API:    backend:3000"
    echo "  • PostgreSQL:     postgres:5432" 
    echo "  • Redis:          redis:6379"
    echo ""
    echo "Next Steps:"
    echo "  1. Configure CloudPanel nginx (see deploy/cloudpanel-nginx-config.md)"
    echo "  2. Set up SSL certificates in CloudPanel"
    echo "  3. Test your domains"
    echo ""
    echo "Useful Commands:"
    echo "  • View containers:  docker compose -f $COMPOSE_FILE -p $PROJECT_NAME ps"
    echo "  • View logs:        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME logs <service>"
    echo "  • Stop services:    docker compose -f $COMPOSE_FILE -p $PROJECT_NAME stop"
    echo "  • Remove stack:     docker compose -f $COMPOSE_FILE -p $PROJECT_NAME down"
    echo ""
}

# Main execution
main() {
    log "Starting NiftyTools deployment with Docker Compose..."
    
    # Preflight checks
    check_docker
    validate_env
    
    # Infrastructure setup
    create_volumes
    
    # Deploy application
    deploy_stack
    monitor_deployment
    
    # Show results
    show_access_info
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy"|"up")
        main
        ;;
    "down"|"remove")
        log "Removing NiftyTools stack..."
        docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
        success "Stack removed"
        ;;
    "logs")
        service="${2:-}"
        if [[ -n "$service" ]]; then
            docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f "$service"
        else
            echo "Available services:"
            docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" config --services
            echo ""
            echo "Usage: $0 logs <service_name>"
        fi
        ;;
    "status")
        docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
        ;;
    "help"|"-h"|"--help")
        echo "NiftyTools Docker Compose Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy, up     Deploy the NiftyTools stack (default)"
        echo "  down, remove   Remove the NiftyTools stack"
        echo "  logs <service> View logs for a specific service"
        echo "  status         Show service status"
        echo "  help           Show this help message"
        ;;
    *)
        error "Unknown command: $1. Use '$0 help' for usage information."
        ;;
esac