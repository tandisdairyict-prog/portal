@echo off
title OrgPortal - Running
echo.
echo ============================================
echo   Enterprise OrgPortal
echo ============================================
echo.
echo  Backend API: http://localhost:5000
echo  Frontend:    http://localhost:3000
echo  Swagger:     http://localhost:5000/swagger
echo.
echo Starting services...
echo.

:: Start backend
start "OrgPortal Backend" cmd /k "cd backend\OrgPortal.API && dotnet run --urls=http://localhost:5000"

:: Wait 3 seconds then start frontend
timeout /t 3 /nobreak >nul
start "OrgPortal Frontend" cmd /k "cd frontend && npm run dev"

:: Open browser after 5 seconds
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo Both services started. Press any key to exit this window.
pause
