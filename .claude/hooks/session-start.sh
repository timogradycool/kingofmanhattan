#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

APP_DIR="$CLAUDE_PROJECT_DIR/tableturn-ai"

# ── 1. Install npm dependencies ─────────────────────────────────────────────
echo "[session-start] Installing npm dependencies..."
cd "$APP_DIR"
npm install

# ── 2. Start PostgreSQL ──────────────────────────────────────────────────────
echo "[session-start] Starting PostgreSQL..."
service postgresql start || true

# Wait for postgres to be ready (up to 15s)
for i in $(seq 1 15); do
  if pg_isready -h 127.0.0.1 -p 5432 -q 2>/dev/null; then
    echo "[session-start] PostgreSQL is ready."
    break
  fi
  sleep 1
done

# ── 3. Ensure DB + user exists ───────────────────────────────────────────────
echo "[session-start] Setting up database..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE tableturn_ai;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tableturn_ai TO postgres;" 2>/dev/null || true
sudo -u postgres psql -d tableturn_ai -c "GRANT ALL ON SCHEMA public TO postgres;" 2>/dev/null || true

# ── 4. Write correct DATABASE_URL to .env ───────────────────────────────────
DB_URL="postgresql://postgres:postgres@127.0.0.1:5432/tableturn_ai"
grep -q "johndoe" "$APP_DIR/.env" 2>/dev/null && \
  sed -i "s|postgresql://johndoe.*|$DB_URL\"|" "$APP_DIR/.env" || true

# ── 5. Run migrations ────────────────────────────────────────────────────────
echo "[session-start] Running Prisma migrations..."
cd "$APP_DIR"
DATABASE_URL="$DB_URL" npx prisma migrate deploy 2>/dev/null || \
  DATABASE_URL="$DB_URL" npx prisma db push --accept-data-loss 2>/dev/null || true

# Grant table permissions after migrate
sudo -u postgres psql -d tableturn_ai -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;" 2>/dev/null || true

# ── 6. Seed if database is empty ─────────────────────────────────────────────
CONTACT_COUNT=$(DATABASE_URL="$DB_URL" sudo -u postgres psql -d tableturn_ai -t -c "SELECT COUNT(*) FROM \"Organization\";" 2>/dev/null | tr -d ' ' || echo "0")
if [ "${CONTACT_COUNT:-0}" = "0" ]; then
  echo "[session-start] Seeding database..."
  DATABASE_URL="$DB_URL" npx tsx prisma/seed.ts 2>/dev/null || true
fi

# ── 7. Start Next.js dev server ──────────────────────────────────────────────
echo "[session-start] Starting Next.js dev server on port 3000..."
# Kill any existing Next.js process on port 3000
fuser -k 3000/tcp 2>/dev/null || true
sleep 1

DATABASE_URL="$DB_URL" nohup npm run dev > /tmp/tableturn-dev.log 2>&1 &
echo "[session-start] Dev server started (PID $!). Access at http://localhost:3000"
echo "[session-start] Login: admin@rosewood.com / admin123"
