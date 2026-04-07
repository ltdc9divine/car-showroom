@echo off
REM Car Showroom Application Startup Script for Windows

echo.
echo 🚗 Car Showroom - Complete Setup and Run
echo ========================================

REM Check if Node.js is installed
node -v >nul 2>&1
if "%errorlevel%" neq "0" (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✓ Node.js version: %NODE_VERSION%
echo ✓ npm version: %NPM_VERSION%

REM Backend Setup
echo.
echo 📦 Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please configure .env file with your MongoDB URI
)

echo ✓ Backend ready at http://localhost:5000

REM Frontend Setup
echo.
echo 🎨 Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.example .env.local
)

echo ✓ Frontend ready at http://localhost:3000

REM Instructions
echo.
echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo 📝 Next Steps:
echo.
echo 1️⃣  Terminal 1 - Start MongoDB:
echo    mongod
echo.
echo 2️⃣  Terminal 2 - Start Backend:
echo    cd backend
echo    npm run seed  (optional - populate sample data)
echo    npm run start:dev
echo.
echo 3️⃣  Terminal 3 - Start Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4️⃣  Open http://localhost:3000 in your browser
echo.
echo 📚 Demo Credentials:
echo    Admin: admin@example.com / admin123
echo    User:  user@example.com / user123
echo.
pause
