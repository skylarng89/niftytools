#!/bin/bash

# NiftyTools Service Status Checker
# Shows the status of all development processes and production containers

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ] || [ ! -d "services" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  echo "   (the directory containing docker-compose.yml and services/)"
  exit 1
fi

echo "📊 NiftyTools Service Status"
echo "============================"

# Check development processes
echo "🔧 Development Processes:"
if pgrep -f 'npm run dev' > /dev/null; then
  echo "  ✅ Gateway/Frontend: Running"
else
  echo "  ❌ Gateway/Frontend: Stopped"
fi

if pgrep -f 'uvicorn' > /dev/null; then
  echo "  ✅ Python API: Running"
else
  echo "  ❌ Python API: Stopped"
fi

echo ""
echo "🏭 Production Containers:"
docker compose ps

echo ""
echo "🌐 URL Health Checks:"
echo -n "  Frontend (dev): "
dev_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "N/A")
if [ "$dev_status" = "200" ]; then
  echo "✅ $dev_status"
else
  echo "❌ $dev_status"
fi

echo -n "  Frontend (prod): "
prod_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "N/A")
if [ "$prod_status" = "200" ]; then
  echo "✅ $prod_status"
else
  echo "❌ $prod_status"
fi

echo -n "  Gateway: "
gateway_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health 2>/dev/null || echo "N/A")
if [ "$gateway_status" = "200" ]; then
  echo "✅ $gateway_status"
else
  echo "❌ $gateway_status"
fi

echo -n "  Python API: "
api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null || echo "N/A")
if [ "$api_status" = "200" ]; then
  echo "✅ $api_status"
else
  echo "❌ $api_status"
fi

echo ""
echo "🔧 Quick Actions:"
echo "   Start dev: ./dev.sh"
echo "   Start prod: ./prod.sh"
echo "   Stop all: ./stop.sh"
echo "   Test endpoints: bash test-migration.sh"
