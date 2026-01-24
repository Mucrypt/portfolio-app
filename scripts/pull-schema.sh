#!/bin/bash

# Pull database schema from Supabase
# This creates migration files that represent your current database state

echo "🔄 Pulling database schema from Supabase..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Install it with: npm install -g supabase"
    exit 1
fi

# Initialize Supabase locally if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "📦 Initializing Supabase locally..."
    supabase init
fi

# Link to remote project
echo "🔗 Linking to remote Supabase project..."
supabase link --project-ref "$SUPABASE_PROJECT_ID"

# Pull schema
echo "📥 Pulling remote schema..."
supabase db pull

if [ $? -eq 0 ]; then
    echo "✅ Schema pulled successfully"
    echo "📁 Migration files created in supabase/migrations/"
    echo "💡 Apply migrations locally with: supabase db reset"
else
    echo "❌ Failed to pull schema"
    exit 1
fi
