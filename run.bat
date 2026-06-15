@echo off
chcp 65001 > nul
title پرتال یکپارچه - در حال اجرا

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║         اجرای پرتال یکپارچه             ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ─── بررسی venv ──────────────────────────────────────────────────────────────
if not exist venv\Scripts\activate.bat (
    echo  [!] محیط مجازی یافت نشد. ابتدا install.bat را اجرا کنید.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

:: ─── بررسی .env ──────────────────────────────────────────────────────────────
if not exist .env (
    echo  [!] فایل .env یافت نشد. ابتدا install.bat را اجرا کنید.
    pause
    exit /b 1
)

:: ─── Migration ───────────────────────────────────────────────────────────────
echo [1/3] اعمال migration های دیتابیس...
python manage.py migrate --run-syncdb 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [!] خطا در اتصال به دیتابیس.
    echo      لطفاً اطلاعات .env را بررسی کنید:
    echo       - DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
    echo       - مطمئن شوید SQL Server در حال اجراست
    echo       - مطمئن شوید ODBC Driver 17 for SQL Server نصب است
    echo.
    echo  برای دانلود ODBC Driver:
    echo  https://aka.ms/downloadmsodbcsql
    echo.
    pause
    exit /b 1
)
echo  [OK] دیتابیس آماده است
echo.

:: ─── Superuser ───────────────────────────────────────────────────────────────
echo [2/3] بررسی کاربر مدیر...
python manage.py shell -c "from apps.accounts.models import User; print('EXISTS') if User.objects.filter(is_superuser=True).exists() else print('NONE')" 2>nul > __check_su.tmp
set /p SU_STATUS=<__check_su.tmp
del __check_su.tmp 2>nul

if "%SU_STATUS%"=="NONE" (
    echo.
    echo  ────────────────────────────────────────────
    echo   هیچ کاربر مدیری وجود ندارد.
    echo   لطفاً اطلاعات مدیر اول را وارد کنید:
    echo  ────────────────────────────────────────────
    python manage.py createsuperuser
    echo  [OK] کاربر مدیر ایجاد شد
) else (
    echo  [OK] کاربر مدیر از قبل موجود است
)
echo.

:: ─── جمع‌آوری فایل‌های استاتیک ───────────────────────────────────────────────
echo [3/3] جمع‌آوری فایل‌های استاتیک...
python manage.py collectstatic --noinput --clear 2>nul
echo  [OK] فایل‌های استاتیک آماده شدند
echo.

:: ─── اجرای سرور ──────────────────────────────────────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  پرتال در حال اجراست!                                   ║
echo  ║                                                          ║
echo  ║  آدرس:  http://localhost:8000                            ║
echo  ║  ادمین: http://localhost:8000/admin                      ║
echo  ║                                                          ║
echo  ║  برای توقف: Ctrl+C را فشار دهید                         ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

start "" http://localhost:8000
python manage.py runserver 0.0.0.0:8000
