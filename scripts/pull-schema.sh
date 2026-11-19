#!/usr/bin/env bash
# Pull the live Supabase schema into a timestamped baseline migration.
#
# Uses the project's pinned Supabase CLI (devDependency "supabase"), not a global one.
# Needs: `npm install` done, `npx supabase login` done once, and Docker running
# (db pull runs pg_dump inside a container). The CLI asks for the database password
# when linking; it is not stored in this repo.
set -euo pipefail
cd "$(dirname "$0")/.."

SB=(npx --no-install supabase)

echo "🔄 Pulling database schema from Supabase..."

if ! VERSION="$("${SB[@]}" --version 2>/dev/null | head -n1)"; then
  echo "❌ Supabase CLI not found in node_modules. Run: npm install"
  exit 1
fi
case "$VERSION" in
  2.*|3.*) echo "ℹ️  Supabase CLI $VERSION" ;;
  *) echo "❌ Supabase CLI $VERSION is too old. Run: npm install"; exit 1 ;;
esac

if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker is not running (db pull needs it). Start Docker and retry."
  exit 1
fi

# The CLI only understands <14-digit timestamp>_name.sql files. Anything else breaks the pull.
BAD="$(find supabase/migrations -maxdepth 1 -name '*.sql' ! -regex '.*/[0-9]\{14\}_[^/]*\.sql' 2>/dev/null || true)"
if [ -n "$BAD" ]; then
  echo "❌ Non-timestamped files in supabase/migrations (move them to archived/ first):"
  echo "$BAD"
  exit 1
fi

if [ ! -f supabase/config.toml ]; then
  echo "📦 Creating supabase/config.toml..."
  "${SB[@]}" init
fi

REF="${SUPABASE_PROJECT_ID:-}"
if [ -z "$REF" ] && [ -f supabase/.temp/project-ref ]; then
  REF="$(tr -d '[:space:]' < supabase/.temp/project-ref)"
fi
if [ -z "$REF" ]; then
  echo "❌ Project ref unknown. Run: SUPABASE_PROJECT_ID=<ref> npm run db:pull"
  exit 1
fi

# Connect as `postgres` with the real DB password. Without it the CLI uses a temporary
# `cli_login_postgres` role, which the Supabase pooler can reject with
# "EAUTHQUERY unsupported or invalid secret format".
# The password is read silently and only lives in this process's environment.
if [ -z "${SUPABASE_DB_PASSWORD:-}" ]; then
  read -r -s -p "🔑 Database password (Supabase → Project Settings → Database): " SUPABASE_DB_PASSWORD
  echo
fi
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
  echo "❌ No password entered."
  exit 1
fi
export SUPABASE_DB_PASSWORD

echo "🔗 Linking to project $REF..."
"${SB[@]}" link --project-ref "$REF"

echo "📥 Pulling remote schema..."
"${SB[@]}" db pull --linked

echo "✅ Schema pulled. New file(s):"
ls -1t supabase/migrations/*.sql | head -n 3
