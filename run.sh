#!/bin/bash
set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         اجرای پرتال یکپارچه             ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ─── بررسی venv ──────────────────────────────────────────────────────────────
if [ ! -f "venv/bin/activate" ]; then
    echo "[!] محیط مجازی یافت نشد. ابتدا install.sh را اجرا کنید."
    exit 1
fi
source venv/bin/activate

# ─── بررسی .env ──────────────────────────────────────────────────────────────
if [ ! -f ".env" ]; then
    echo "[!] فایل .env یافت نشد. ابتدا install.sh را اجرا کنید."
    exit 1
fi

# ─── Migration ───────────────────────────────────────────────────────────────
echo "[1/3] اعمال migration های دیتابیس..."
if ! python manage.py migrate --run-syncdb 2>&1; then
    echo ""
    echo "[!] خطا در اتصال به دیتابیس."
    echo "    لطفاً اطلاعات .env را بررسی کنید"
    exit 1
fi
echo "[OK] دیتابیس آماده است"
echo ""

# ─── Superuser ───────────────────────────────────────────────────────────────
echo "[2/3] بررسی کاربر مدیر..."
SU_EXISTS=$(python manage.py shell -c "from apps.accounts.models import User; print('yes' if User.objects.filter(is_superuser=True).exists() else 'no')" 2>/dev/null)
if [ "$SU_EXISTS" = "no" ]; then
    echo ""
    echo "────────────────────────────────────────"
    echo " هیچ کاربر مدیری وجود ندارد."
    echo " لطفاً اطلاعات مدیر اول را وارد کنید:"
    echo "────────────────────────────────────────"
    python manage.py createsuperuser
fi
echo "[OK] کاربر مدیر موجود است"
echo ""

# ─── Static files ────────────────────────────────────────────────────────────
echo "[3/3] فایل‌های استاتیک..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true
echo "[OK] آماده شدند"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  پرتال در حال اجراست!                                   ║"
echo "║                                                          ║"
echo "║  آدرس:  http://localhost:8000                            ║"
echo "║  ادمین: http://localhost:8000/admin                      ║"
echo "║                                                          ║"
echo "║  برای توقف: Ctrl+C                                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

python manage.py runserver 0.0.0.0:8000
