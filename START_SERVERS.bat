@echo off
echo.
echo ============================================
echo   Starting E-Commerce Application Servers
echo ============================================
echo.

echo Starting Backend Server on port 8080...
start "Backend Server" cmd /k "cd /d D:\Github_Copilot_website\ecommerce-backend\furniture && mvn spring-boot:run"

echo Waiting 15 seconds for backend to initialize...
timeout /t 15 /nobreak

echo.
echo Starting Frontend Server on port 5173...
start "Frontend Server" cmd /k "cd /d D:\Github_Copilot_website\ecommerce-frontend && npm run dev"

echo.
echo ============================================
echo   Servers Started!
echo ============================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Admin Login:
echo   Email: admin@example.com
echo   Password: Admin@123
echo.
echo User Login:
echo   Email: user@example.com
echo   Password: User@123
echo.
echo ============================================

