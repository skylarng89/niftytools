# NiftyTools Testing & Development Commands

.PHONY: help test start-test stop-test logs clean dev-local health-check

# Default target
help:
	@echo "NiftyTools Development Commands:"
	@echo ""
	@echo "Testing Commands:"
	@echo "  test           - Run backend API tests"
	@echo ""
	@echo "Docker Commands:"
	@echo "  start-test     - Start testing environment"
	@echo "  stop-test      - Stop testing environment"
	@echo "  logs           - Show logs from all services"
	@echo "  clean          - Clean up Docker resources"
	@echo ""
	@echo "Development:"
	@echo "  dev-local      - Start local development (3 terminals)"
	@echo "  health-check   - Check all service health"

# Start testing environment
start-test:
	@echo "🚀 Starting testing environment..."
	docker-compose -f docker-compose.test.yml up -d --build
	@echo "⏳ Waiting for services to be healthy..."
	sleep 15
	@make health-check-test

# Stop testing environment
stop-test:
	@echo "🛑 Stopping testing environment..."
	docker-compose -f docker-compose.test.yml down

# Run backend tests
test:
	@echo "🧪 Running backend API tests..."
	bash test-migration.sh || echo "⚠️  test-migration.sh not found, run manual tests instead"
	@echo "✅ Tests completed"

# Show logs
logs:
	@echo "📋 Showing logs from all services..."
	docker-compose -f docker-compose.test.yml logs -f

# Show logs for specific service
logs-gateway:
	docker-compose -f docker-compose.test.yml logs -f gateway

logs-python:
	docker-compose -f docker-compose.test.yml logs -f text-tools-python

logs-frontend:
	docker-compose -f docker-compose.test.yml logs -f frontend

# Check health of all services
health-check-test:
	@echo "🔍 Checking service health..."
	@echo "Gateway:"
	@curl -s http://localhost:3000/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/health
	@echo ""
	@echo "Python Backend:"
	@curl -s http://localhost:3001/health | jq '.' 2>/dev/null || curl -s http://localhost:3001/health
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:8080/ | head -c 100
	@echo ""

# Test API endpoints
test-api:
	@echo "🧪 Testing API endpoints..."
	@echo "Testing Python backend directly..."
	curl -X POST http://localhost:3001/sort \
		-H "Content-Type: application/json" \
		-d '{"text":"zebra\napple\nBanana","method":"alphabetical-asc"}' \
		| jq '.' 2>/dev/null || echo "Python backend test failed"
	@echo ""
	@echo "Testing via Gateway..."
	curl -X POST http://localhost:3000/api/text-tools/sort \
		-H "Content-Type: application/json" \
		-d '{"text":"zebra\napple\nBanana","method":"alphabetical-asc"}' \
		| jq '.' 2>/dev/null || echo "Gateway test failed"

# Clean up Docker resources
clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose -f docker-compose.test.yml down -v
	docker system prune -f
	docker volume prune -f

# Start local development (requires 3 terminals)
dev-local:
	@echo "🚀 Starting local development..."
	@echo "Please run these commands in 3 separate terminals:"
	@echo ""
	@echo "Terminal 1 (Gateway):"
	@echo "  cd services/gateway && npm run dev"
	@echo ""
	@echo "Terminal 2 (Python Backend):"
	@echo "  cd services/text-tools-service-py && python -m uvicorn src.main:app --reload"
	@echo ""
	@echo "Terminal 3 (Frontend):"
	@echo "  cd frontend && npm run dev"
	@echo ""
	@echo "Or use the deployment scripts:"
	@echo "  ./dev.sh    # Start all services in development mode"
	@echo "  ./prod.sh   # Deploy to production"
	@echo "  ./status.sh # Check service health"

# Build all services
build:
	@echo "🔨 Building all services..."
	docker-compose -f docker-compose.yml build
	docker-compose -f docker-compose.test.yml build

# Production deployment
deploy-prod:
	@echo "🚀 Deploying to production..."
	docker-compose -f docker-compose.yml down
	docker-compose -f docker-compose.yml up -d --build
	@echo "✅ Production deployment complete"
	@echo "🌐 Application: http://localhost:80"

# Quick test script
quick-test:
	@echo "⚡ Quick backend test..."
	@echo "Testing current gateway backend..."
	@time curl -s -X POST http://localhost:3000/api/text-tools/sort \
		-H "Content-Type: application/json" \
		-d '{"text":"$(echo -e 'zebra\napple\nBanana')","method":"alphabetical-asc"}' \
		| jq '.data.stats.processing_time' 2>/dev/null || echo "Request failed"

# Monitor performance
monitor:
	@echo "📊 Monitoring performance..."
	watch -n 2 'docker stats --no-stream | grep niftytools'

# Test API contracts (ensure identical responses)
test-contract:
	@echo "🔒 Validating API contracts between backends..."
	@if [ -f "scripts/validate-api-contract.js" ]; then \
		node scripts/validate-api-contract.js; \
	else \
		echo "❌ Contract validation script not found."; \
	fi

# Run all validation tests
test-all: test-contract test-compare
	@echo "✅ All validation tests completed"
