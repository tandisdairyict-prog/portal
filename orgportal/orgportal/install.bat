@echo off
title OrgPortal - Install

echo ============================================
echo   Enterprise OrgPortal - Installation
echo ============================================
echo.

:: ── Frontend (Node.js) ───────────────────────────────────
echo [1/2] Installing Frontend dependencies...
cd frontend
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Download: https://nodejs.org
    pause
    exit /b 1
)
npm install
if %errorlevel% neq 0 ( echo [ERROR] npm install failed! && pause && exit /b 1 )
echo [OK] Frontend dependencies installed
cd ..
echo.

:: ── Backend ──────────────────────────────────────────────
echo [2/2] Backend (.NET 8) check...
where dotnet >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] .NET 8 SDK not found!
    echo Download: https://dotnet.microsoft.com/download/dotnet/8.0
) else (
    cd backend
    dotnet restore OrgPortal.sln
    echo [OK] Backend packages restored
    cd ..
)
echo.

echo ============================================
echo  Installation complete!
echo  Run: run.bat
echo ============================================
pause
