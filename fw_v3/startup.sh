#!/bin/bash
# FoodBridge - Quick Setup Script
# Usage: Run this to set up and start the application

echo "🌱 FoodBridge - Demo Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Question: Run both servers?
echo "This script will start both backend and frontend."
echo "You will need to keep both running during the demo."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Starting backend server..."
echo "=========================="
cd Backend
npm install --silent 2>/dev/null
npm run dev &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   URL: http://localhost:5000"
echo "   Test: http://localhost:5000/api/auth/ping"
echo ""

sleep 3

echo "Starting frontend server..."
echo "==========================="
cd ../Frontend/foodwaste-frontend
npm install --silent 2>/dev/null
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   URL: http://localhost:5173"
echo ""

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📱 Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "🔑 Test Credentials:"
echo "   Email: bhoomika7444@gmail.com"
echo "   Password: admin123"
echo ""
echo "⚙️  Server Info:"
echo "   Backend:  http://localhost:5000 (Express)"
echo "   Frontend: http://localhost:5173 (Vite)"
echo "   Database: MongoDB Atlas (Cloud)"
echo ""
echo "📊 To stop servers:"
echo "   Press Ctrl+C twice or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to interrupt
wait
