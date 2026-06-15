@echo off
title Portal - Running

echo.
echo ============================================
echo    Starting Portal
echo ============================================
echo.

:: Check venv
if not exist venv\Scripts\activate.bat (
    echo [ERROR] Virtual environment not found!
    echo Please run install.bat first.
    pause
    exit /b 1
)

:: Activate venv
call venv\Scripts\activate.bat

:: Check .env
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please run install.bat first.
    pause
    exit /b 1
)

:: Run migrations
echo [1/3] Running database migrations...
python manage.py migrate
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Database connection failed!
    echo.
    echo Please check your .env file:
    echo   DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
    echo.
    echo Also make sure:
    echo   - SQL Server is running
    echo   - ODBC Driver 17 for SQL Server is installed
    echo     Download: https://aka.ms/downloadmsodbcsql
    echo.
    pause
    exit /b 1
)
echo [OK] Database ready
echo.

:: Check superuser
echo [2/3] Checking admin user...
python manage.py shell -c "from apps.accounts.models import User; exit(0 if User.objects.filter(is_superuser=True).exists() else 1)" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo No admin user found. Create one now:
    echo ----------------------------------------
    python manage.py createsuperuser
    echo [OK] Admin user created
) else (
    echo [OK] Admin user exists
)
echo.

:: Collect static files
echo [3/3] Collecting static files...
python manage.py collectstatic --noinput --clear >nul 2>&1
echo [OK] Static files ready
echo.

echo ============================================
echo  Portal is running!
echo.
echo  URL:   http://localhost:9000
echo  Admin: http://localhost:9000/admin
echo.
echo  Press Ctrl+C to stop
echo ============================================
echo.

echo Waiting for server to start...
start /wait "" timeout /t 3 /nobreak >nul
start http://localhost:9000/accounts/login/
python manage.py runserver 0.0.0.0:9000
