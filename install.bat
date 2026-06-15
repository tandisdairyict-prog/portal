@echo off
title Portal - Install

echo.
echo ============================================
echo    Portal Installation
echo ============================================
echo.

:: Check Python
echo [1/6] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo Please install Python 3.10+ from:
    echo https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo [OK] Python found
echo.

:: Upgrade pip
echo [2/6] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo [OK] pip upgraded
echo.

:: Create virtual environment
echo [3/6] Creating virtual environment...
if exist venv (
    echo [OK] venv already exists
) else (
    python -m venv venv
    echo [OK] venv created
)
echo.

:: Activate venv
echo [4/6] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] venv activated
echo.

:: Install packages
echo [5/6] Installing Python packages...
echo This may take a few minutes...
echo.

pip install "Django==4.2.13" --quiet
if %errorlevel% neq 0 goto install_error

pip install "mssql-django==1.4" --quiet
if %errorlevel% neq 0 goto install_error

pip install "python-decouple==3.8" --quiet
pip install "django-crispy-forms==2.1" --quiet
pip install "crispy-bootstrap5==0.7" --quiet
pip install "Pillow==10.3.0" --quiet
pip install "pyodbc==5.1.0" --quiet

echo.
echo Installing LDAP support (optional)...
pip install "django-auth-ldap" --quiet 2>nul
if %errorlevel% neq 0 (
    echo [WARN] LDAP install failed - AD login will be disabled
) else (
    echo [OK] LDAP installed
)
echo.

:: Setup .env file
echo [6/6] Setting up .env file...
if not exist .env (
    copy .env.example .env >nul
    echo [OK] .env file created from .env.example
    echo.
    echo ============================================
    echo  IMPORTANT: Edit .env file before running!
    echo  Set your SQL Server connection details:
    echo    DB_HOST=your-sql-server-address
    echo    DB_NAME=PortalDB
    echo    DB_USER=sa
    echo    DB_PASSWORD=your-password
    echo ============================================
) else (
    echo [OK] .env file already exists
)
echo.

echo ============================================
echo  Installation completed successfully!
echo  Run: run.bat
echo ============================================
echo.
pause
exit /b 0

:install_error
echo.
echo [ERROR] Package installation failed!
echo Please check your internet connection.
pause
exit /b 1
