#!/bin/bash

# NiftyTools Development Server
# Starts all services in development mode with hot reload

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ] || [ ! -d "services" ]; then
  echo "❌ Error: Please run this script from the project root directory"
  echo "   (the directory containing docker-compose.yml and services/)"
  exit 1
fi

echo "🚀 Starting NiftyTools in DEVELOPMENT mode..."

# Kill any existing processes on these ports
lsof -ti:3000,3001,5173 | xargs kill -9 2>/dev/null

# Start services in background
cd services/gateway && npm run dev &
cd ../services/text-tools-service-py && python -m uvicorn src.main:app --host 0.0.0.0 --port 3001 --reload &
cd ../../frontend && npm run dev &

echo "✅ All services started in development mode!"
echo "📋 Logs are now stored in the logs/ directory with daily rotation:"
echo "   Gateway: logs/gateway/"
echo "   Text Tools: logs/text-tools-service-py/"
echo "   Frontend: logs/frontend/"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Gateway: http://localhost:3000"
echo "   Python API: http://localhost:3001"
echo "   API Docs: http://localhost:3001/docs"
echo ""
echo "🔧 Management:"
echo "   Stop: ./stop.sh"
echo "   Status: ./status.sh"
echo "   Test: bash test-migration.sh"
