#!/bin/bash

# NiftyTools Service Stopper
# Stops all development processes and production containers

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ] || [ ! -d "services" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  echo "   (the directory containing docker-compose.yml and services/)"
  exit 1
fi

echo "🛑 Stopping NiftyTools services..."

# Kill development processes
echo "Stopping development processes..."
pkill -f 'npm run dev' 2>/dev/null || true
pkill -f 'uvicorn' 2>/dev/null || true

# Stop production containers
echo "Stopping production containers..."
docker compose down -v 2>/dev/null || true
docker compose -f docker-compose.test.yml down -v 2>/dev/null || true

# Clean up any remaining processes on ports
echo "Cleaning up port processes..."
lsof -ti:3000,3001,5173,80 | xargs kill -9 2>/dev/null || true

echo "✅ All services stopped!"
