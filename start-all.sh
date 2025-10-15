#!/bin/bash

# Kill any existing processes on these ports
lsof -ti:3000,3001,5173 | xargs kill -9 2>/dev/null

# Start services in background
cd services/gateway && npm run dev > ../../gateway.log 2>&1 &
cd ../../services/text-tools-service && npm run dev > ../../text-tools.log 2>&1 &
cd ../../frontend && npm run dev > ../frontend.log 2>&1 &

echo "✅ All services started!"
echo "📋 Logs:"
echo "   Gateway: tail -f gateway.log"
echo "   Text Tools: tail -f text-tools.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🌐 Visit: http://localhost:5173"
echo ""
echo "To stop: pkill -f 'npm run dev'"
