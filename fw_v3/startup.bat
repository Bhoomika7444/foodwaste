@echo off
REM FoodBridge - Windows Quick Setup Script
REM Usage: Double-click to run

echo.
echo 🌱 FoodBridge - Demo Setup
echo ==========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js found: %%i
echo.

echo This will start both backend and frontend servers.
echo You will need to keep both running during the demo.
echo.
set /p CONTINUE="Continue? (y/n): "
if /i not "%CONTINUE%"=="y" exit /b 0

echo.
echo Starting backend server...
echo ==========================
cd Backend
call npm install >nul 2>&1
start "Backend - FoodBridge" cmd /k "npm run dev"

echo ✅ Backend started
echo    URL: http://localhost:5000
echo    Test: http://localhost:5000/api/auth/ping
echo.

timeout /t 5 /nobreak
echo.

echo Starting frontend server...
echo ===========================
cd ..\Frontend\foodwaste-frontend
call npm install >nul 2>&1
start "Frontend - FoodBridge" cmd /k "npm run dev"

echo ✅ Frontend started
echo    URL: http://localhost:5173
echo.

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 📱 Open your browser:
echo    http://localhost:5173
echo.
echo 🔑 Test Credentials:
echo    Email: bhoomika7444@gmail.com
echo    Password: admin123
echo.
echo ⚙️  Server Info:
echo    Backend:  http://localhost:5000 (Express + Node.js)
echo    Frontend: http://localhost:5173 (Vite + React)
echo    Database: MongoDB Atlas (Cloud)
echo.
echo 📊 Admin Panel:
echo    URL: http://localhost:5173/admin
echo    Access: Only Bhoomika can fully manage
echo.
echo 🛑 To stop servers:
echo    Close both command windows or press Ctrl+C in each
echo.
echo 📚 For more info, read:
echo    - README.md (Overview)
echo    - DEPLOYMENT_GUIDE.md (Deployment & Full Setup)
echo    - QUICKSTART.md (Quick Reference)
echo.

pause
