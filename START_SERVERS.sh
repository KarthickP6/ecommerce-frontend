#!/bin/bash

echo "Starting Backend Server..."
cd D:\Github_Copilot_website\ecommerce-backend\furniture
mvn spring-boot:run &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 15

echo "Starting Frontend Server..."
cd D:\Github_Copilot_website\ecommerce-frontend
npm run dev &
FRONTEND_PID=$!

echo "Both servers started!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

wait

