#!/bin/bash
echo "Starting OrgPortal..."

# Start backend
cd backend
dotnet run --project OrgPortal.API --urls=http://localhost:5000 &
BACKEND_PID=$!
cd ..

# Start frontend
sleep 2
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:3000"
echo "  Swagger:  http://localhost:5000/swagger"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT
wait
