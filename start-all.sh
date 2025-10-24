#!/bin/bash

# Kill any existing processes on these ports
lsof -ti:3000,3001,5173 | xargs kill -9 2>/dev/null

# Start services in background
cd services/gateway && npm run dev &
cd ../../services/text-tools-service && npm run dev &
cd ../../frontend && npm run dev &

echo "✅ All services started!"
echo "📋 Logs are now stored in the logs/ directory with daily rotation:"
echo "   Gateway: logs/gateway/"
echo "   Text Tools: logs/text-tools-service/"
echo "   Frontend: logs/frontend/"
echo ""
echo "🌐 Visit: http://localhost:5173"
echo ""
echo "To stop: pkill -f 'npm run dev'"
