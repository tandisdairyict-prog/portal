#!/bin/bash
set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     نصب پیش‌نیازهای پرتال یکپارچه        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ─── بررسی Python ────────────────────────────────────────────────────────────
echo "[1/6] بررسی Python..."
if ! command -v python3 &>/dev/null; then
    echo "[!] Python3 یافت نشد. نصب می‌شود..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get update -qq && sudo apt-get install -y python3 python3-pip python3-venv
    elif command -v yum &>/dev/null; then
        sudo yum install -y python3 python3-pip
    else
        echo "[!] لطفاً Python 3.10+ را به صورت دستی نصب کنید"
        exit 1
    fi
fi
python3 --version
echo "[OK] Python موجود است"
echo ""

# ─── پیش‌نیازهای سیستمی برای python-ldap ────────────────────────────────────
echo "[2/6] نصب پیش‌نیازهای سیستمی..."
if command -v apt-get &>/dev/null; then
    sudo apt-get install -y -qq \
        libldap2-dev libsasl2-dev \
        unixodbc-dev \
        python3-dev \
        build-essential 2>/dev/null || echo "[!] برخی پکیج‌های سیستمی نصب نشدند (ممکن است نیاز به sudo باشد)"
fi
echo "[OK] پیش‌نیازهای سیستمی بررسی شدند"
echo ""

# ─── Virtual Environment ──────────────────────────────────────────────────────
echo "[3/6] ساخت محیط مجازی..."
if [ -d "venv" ]; then
    echo "[OK] venv از قبل وجود دارد"
else
    python3 -m venv venv
    echo "[OK] venv ایجاد شد"
fi
source venv/bin/activate
echo "[OK] محیط مجازی فعال شد"
echo ""

# ─── pip ─────────────────────────────────────────────────────────────────────
echo "[4/6] بروزرسانی pip..."
pip install --upgrade pip --quiet
echo "[OK] pip بروزرسانی شد"
echo ""

# ─── نصب پکیج‌ها ─────────────────────────────────────────────────────────────
echo "[5/6] نصب پکیج‌های Python..."
pip install -r requirements.txt --quiet
echo "[OK] پکیج‌ها نصب شدند"
echo ""

# ─── فایل .env ───────────────────────────────────────────────────────────────
echo "[6/6] بررسی فایل .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "[OK] فایل .env ساخته شد"
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║  مهم: فایل .env را ویرایش کنید:                   ║"
    echo "║   nano .env                                         ║"
    echo "╚══════════════════════════════════════════════════════╝"
else
    echo "[OK] فایل .env از قبل موجود است"
fi
echo ""

echo "╔══════════════════════════════════════╗"
echo "║     نصب با موفقیت انجام شد!         ║"
echo "║  برای اجرا: bash run.sh             ║"
echo "╚══════════════════════════════════════╝"
