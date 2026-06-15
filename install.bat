@echo off
chcp 65001 > nul
title نصب پیش‌نیازهای پرتال یکپارچه

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║       نصب پیش‌نیازهای پرتال یکپارچه      ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ─── بررسی Python ───────────────────────────────────────────────────────────
echo [1/6] بررسی نسخه Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Python یافت نشد. لطفاً Python 3.10+ را نصب کنید:
    echo      https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo  [OK] Python موجود است
echo.

:: ─── بررسی pip ──────────────────────────────────────────────────────────────
echo [2/6] بروزرسانی pip...
python -m pip install --upgrade pip --quiet
echo  [OK] pip بروزرسانی شد
echo.

:: ─── Virtual Environment ─────────────────────────────────────────────────────
echo [3/6] ساخت محیط مجازی (venv)...
if exist venv (
    echo  [OK] venv از قبل وجود دارد
) else (
    python -m venv venv
    echo  [OK] venv ایجاد شد
)
echo.

:: ─── فعال‌سازی venv ──────────────────────────────────────────────────────────
echo [4/6] فعال‌سازی محیط مجازی...
call venv\Scripts\activate.bat
echo  [OK] محیط مجازی فعال شد
echo.

:: ─── نصب پکیج‌های Python ─────────────────────────────────────────────────────
echo [5/6] نصب پکیج‌های Python از requirements.txt...
echo      (این مرحله ممکن است چند دقیقه طول بکشد)
echo.

:: نصب بدون python-ldap و django-auth-ldap چون برای ویندوز نیاز به کامپایلر دارند
pip install django==4.2.13 --quiet
pip install mssql-django==1.4 --quiet
pip install python-decouple==3.8 --quiet
pip install django-crispy-forms==2.1 --quiet
pip install "crispy-bootstrap5==0.7" --quiet
pip install Pillow==10.3.0 --quiet
pip install pyodbc==5.1.0 --quiet

:: تلاش برای نصب ldap (اختیاری)
echo.
echo  در حال نصب پشتیبانی LDAP (اختیاری)...
pip install django-auth-ldap --quiet 2>nul
if %errorlevel% neq 0 (
    echo  [!] نصب LDAP ناموفق بود - ورود AD غیرفعال می‌ماند
    echo      برای فعال کردن: pip install python-ldap django-auth-ldap
) else (
    echo  [OK] LDAP نصب شد
)
echo.

:: ─── ساخت فایل .env ──────────────────────────────────────────────────────────
echo [6/6] بررسی فایل تنظیمات (.env)...
if not exist .env (
    copy .env.example .env > nul
    echo  [OK] فایل .env از روی .env.example کپی شد
    echo.
    echo  ╔══════════════════════════════════════════════════════════╗
    echo  ║  مهم: فایل .env را ویرایش کنید و اطلاعات دیتابیس را   ║
    echo  ║  وارد کنید قبل از اجرای برنامه                         ║
    echo  ║                                                          ║
    echo  ║  DB_HOST=آدرس SQL Server شما                            ║
    echo  ║  DB_NAME=نام دیتابیس                                    ║
    echo  ║  DB_USER=نام کاربری                                     ║
    echo  ║  DB_PASSWORD=رمز عبور                                   ║
    echo  ╚══════════════════════════════════════════════════════════╝
) else (
    echo  [OK] فایل .env از قبل موجود است
)
echo.

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║         نصب با موفقیت انجام شد!         ║
echo  ║                                          ║
echo  ║  برای اجرا: run.bat را اجرا کنید        ║
echo  ╚══════════════════════════════════════════╝
echo.
pause
