#!/bin/sh
set -e

DB_HOST="${DB_HOST:-}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-postgres}"
UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"

# Yerel Docker (macOS/Windows): konteyner içinden localhost host Postgres'e ulaşmaz
if [ "$DB_HOST" = "localhost" ] || [ "$DB_HOST" = "127.0.0.1" ]; then
  if getent hosts host.docker.internal >/dev/null 2>&1; then
    DB_HOST=host.docker.internal
  fi
fi

if [ -z "$DB_HOST" ]; then
  echo "DB_HOST tanımlı değil. Coolify Postgres hostname veya harici host girin."
  exit 1
fi

echo "PostgreSQL bekleniyor (${DB_HOST}:${DB_PORT}/${DB_NAME})..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL hazır."

mkdir -p "$UPLOAD_DIR"
if id nextjs >/dev/null 2>&1; then
  chown -R nextjs:nodejs "$UPLOAD_DIR" || true
fi

if [ -f scripts/migrate.js ]; then
  echo "Veritabanı migrate ediliyor..."
  if node scripts/migrate.js; then
    echo "Migrate tamam."
  else
    echo "Migrate başarısız — uygulama yine başlıyor."
  fi
elif [ -f schema.sql ]; then
  echo "Veritabanı şeması uygulanıyor..."
  export PGPASSWORD="${DB_PASSWORD}"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f schema.sql
  echo "Şema uygulandı."
fi

if [ -f scripts/seed-admin.js ]; then
  echo "Admin hesabı kontrol ediliyor..."
  if node scripts/seed-admin.js; then
    echo "Admin seed tamam."
  else
    echo "Admin seed atlandı (uygulama yine başlıyor)."
  fi
fi

echo "Next.js başlatılıyor..."
if command -v su-exec >/dev/null 2>&1 && id nextjs >/dev/null 2>&1 && [ "$(id -u)" = "0" ]; then
  exec su-exec nextjs node server.js
fi
exec node server.js
