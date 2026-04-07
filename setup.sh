#!/bin/bash

# Car Showroom Application Startup Script

echo "🚗 Car Showroom - Complete Setup and Run"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"

# Backend Setup
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure .env file with your MongoDB URI"
fi

echo "✓ Backend ready at http://localhost:5000"

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
fi

echo "✓ Frontend ready at http://localhost:3000"

# Instructions
echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Terminal 1 - Start MongoDB:"
echo "   mongod"
echo ""
echo "2️⃣  Terminal 2 - Start Backend:"
echo "   cd backend"
echo "   npm run seed  (optional - populate sample data)"
echo "   npm run start:dev"
echo ""
echo "3️⃣  Terminal 3 - Start Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4️⃣  Open http://localhost:3000 in your browser"
echo ""
echo "📚 Demo Credentials:"
echo "   Admin: admin@example.com / admin123"
echo "   User:  user@example.com / user123"
echo ""
