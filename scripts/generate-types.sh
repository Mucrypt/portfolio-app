#!/bin/bash

# Generate TypeScript types from Supabase database schema
# This script pulls your database schema and generates TypeScript types

echo "🔄 Generating TypeScript types from Supabase database..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Install it with: npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null
then
    echo "❌ Not logged in to Supabase CLI"
    echo "🔑 Login with: supabase login"
    exit 1
fi

# Generate types
echo "📝 Generating types..."
supabase gen types typescript --linked > lib/supabase/database.types.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully at lib/supabase/database.types.ts"
    echo "💡 Import them with: import { Database } from '@/lib/supabase/database.types'"
else
    echo "❌ Failed to generate types"
    exit 1
fi
