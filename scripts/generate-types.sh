#!/bin/bash

# Generate TypeScript types from Supabase database schema
# This script pulls your database schema and generates TypeScript types

echo "🔄 Generating TypeScript types from Supabase database..."

# Use full path to ensure we use the correct supabase CLI version
SUPABASE_CMD="/usr/local/bin/supabase"

# Check if supabase CLI is installed
if ! command -v $SUPABASE_CMD &> /dev/null
then
    echo "❌ Supabase CLI is not installed at $SUPABASE_CMD"
    echo "📦 Install it with: npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if logged in
if ! $SUPABASE_CMD projects list &> /dev/null
then
    echo "❌ Not logged in to Supabase CLI"
    echo "🔑 Login with: supabase login"
    exit 1
fi

# Generate types
echo "📝 Generating types..."

# Run the command, filter out CLI messages, save to file
$SUPABASE_CMD gen types typescript --linked 2>&1 | \
  grep -v "Initialising login role" | \
  grep -v "A new version of Supabase CLI is available" | \
  grep -v "We recommend updating" | \
  grep -v "/cli/getting-started" \
  > lib/supabase/database.types.ts

# Check if file was created and has valid TypeScript content
if [ -s lib/supabase/database.types.ts ] && grep -q "export type Database" lib/supabase/database.types.ts; then
    echo "✅ Types generated successfully at lib/supabase/database.types.ts"
    echo "💡 Import them with: import { Database } from '@/lib/supabase/database.types'"
else
    echo "❌ Failed to generate types"
    echo "📄 Check the file for errors:"
    head -20 lib/supabase/database.types.ts
    exit 1
fi
