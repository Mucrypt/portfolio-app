#!/bin/bash

# Generate TypeScript types from Supabase database schema
# This script pulls your database schema and generates TypeScript types

echo "🔄 Generating TypeScript types from Supabase database..."

# Use the project's pinned CLI (devDependency "supabase"), same as db:pull
SUPABASE_CMD="npx --no-install supabase"

# Check if supabase CLI is installed
if ! $SUPABASE_CMD --version &> /dev/null
then
    echo "❌ Supabase CLI not found in node_modules. Run: npm install"
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

# Types come from stdout only; CLI notices go to stderr and are not written into the file.
# Generate into a temp file first so a failure never wipes the existing types.
TMP_TYPES="$(mktemp)"
if ! $SUPABASE_CMD gen types typescript --linked > "$TMP_TYPES"; then
    rm -f "$TMP_TYPES"
    echo "❌ Failed to generate types (existing file left unchanged)"
    exit 1
fi
mv "$TMP_TYPES" lib/supabase/database.types.ts

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
