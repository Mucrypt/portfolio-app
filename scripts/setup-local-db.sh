#!/bin/bash

# Setup local Supabase instance for development
# This runs Supabase locally using Docker

echo "🚀 Setting up local Supabase instance..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed."
    echo "📦 Install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null
then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

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

# Start Supabase locally
echo "🐳 Starting local Supabase (this may take a few minutes)..."
supabase start

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Local Supabase is running!"
    echo ""
    echo "🔗 URLs:"
    echo "   API URL: http://localhost:54321"
    echo "   Studio: http://localhost:54323"
    echo "   DB: postgresql://postgres:postgres@localhost:54322/postgres"
    echo ""
    echo "💡 Update your .env.local with:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=[shown above]"
    echo ""
    echo "⏹️  Stop with: supabase stop"
else
    echo "❌ Failed to start local Supabase"
    exit 1
fi
