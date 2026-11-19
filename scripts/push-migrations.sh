#!/usr/bin/env bash
# Apply pending migrations in supabase/migrations to the linked (production) project.
#
# 1. Shows what would be applied (dry run).
# 2. Asks for confirmation.
# 3. Applies them and records them in the migration history.
#
# Connects as `postgres` with the DB password (read silently, never stored), which
# avoids the pooler's "EAUTHQUERY unsupported or invalid secret format" error.
set -euo pipefail
cd "$(dirname "$0")/.."

SB=(npx --no-install supabase)

if ! "${SB[@]}" --version >/dev/null 2>&1; then
  echo "❌ Supabase CLI not found in node_modules. Run: npm install"
  exit 1
fi

if [ -z "${SUPABASE_DB_PASSWORD:-}" ]; then
  read -r -s -p "🔑 Database password (Supabase → Project Settings → Database): " SUPABASE_DB_PASSWORD
  echo
fi
[ -n "$SUPABASE_DB_PASSWORD" ] || { echo "❌ No password entered."; exit 1; }
export SUPABASE_DB_PASSWORD

echo "🔍 Pending migrations (dry run, nothing is changed yet):"
"${SB[@]}" db push --linked --dry-run

echo
read -r -p "Apply these to PRODUCTION now? Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Cancelled. Nothing was applied."
  exit 0
fi

"${SB[@]}" db push --linked
echo "✅ Migrations applied. Next: npm run db:types"
