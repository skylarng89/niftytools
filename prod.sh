#!/bin/bash

# NiftyTools Production Deployment
# Builds and starts all services in production Docker containers

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ] || [ ! -d "services" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  echo "   (the directory containing docker-compose.yml and services/)"
  exit 1
fi

echo "🏭 Starting NiftyTools in PRODUCTION mode..."

# Stop any existing containers
docker compose down -v 2>/dev/null || true

# Build and start production containers
echo "Building and starting containers..."
docker compose up -d --build

echo "✅ Production containers started!"
echo "📋 Waiting for containers to become healthy..."

# Wait for containers to be healthy (max 60 seconds)
timeout=60
while [ $timeout -gt 0 ]; do
  healthy_count=$(docker compose ps --format "{{.Service}}\t{{.Status}}" | grep -c "healthy")
  if [ "$healthy_count" -eq 3 ]; then
    echo "✅ All containers are healthy!"
    break
  fi
  echo -n "."
  sleep 2
  timeout=$((timeout - 2))
done

if [ $timeout -le 0 ]; then
  echo ""
  echo "⚠️  Warning: Some containers may not be healthy within 60 seconds"
  echo "Check status with: ./status.sh"
fi

echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "🌐 Production URLs:"
echo "   Frontend: http://localhost:80"
echo "   Gateway: http://localhost:3000"
echo "   Python API: http://localhost:3001"
echo "   API Docs: http://localhost:3000/api/text-tools/docs"
echo ""
echo "🔧 Management:"
echo "   Stop: ./stop.sh"
echo "   Status: ./status.sh"
echo "   Logs: docker compose logs -f"
echo "   Test: bash test-migration.sh"
