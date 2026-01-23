#!/bin/bash

# ============================================
# Public User System - Complete Setup
# ============================================

echo "🚀 Setting up Public User Authentication System..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from your project root directory"
    exit 1
fi

echo "📋 Step 1: Files Created"
echo "   ✅ app/signup/page.tsx"
echo "   ✅ app/login/page.tsx (updated)"
echo "   ✅ components/public/Header.tsx (updated with auth buttons)"
echo "   ✅ lib/auth/user.ts (updated)"
echo "   ✅ middleware.ts (created/updated)"
echo "   ✅ supabase/public-users-schema.sql"
echo "   ✅ supabase/user-role-functions.sql"
echo ""

echo "📊 Step 2: Database Setup Required"
echo "   👉 Go to your Supabase Dashboard"
echo "   👉 Open SQL Editor"
echo "   👉 Run: supabase/public-users-schema.sql"
echo "   👉 Run: supabase/user-role-functions.sql"
echo ""

read -p "Have you run both SQL files in Supabase? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please run the SQL files first, then run this script again"
    exit 1
fi

echo "✅ Database setup confirmed"
echo ""

echo "🧪 Step 3: Testing locally..."
echo "   Starting development server..."
echo ""

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null

# Start dev server in background
npm run dev &
DEV_PID=$!

echo "   Server starting... (PID: $DEV_PID)"
echo ""

sleep 5

echo "🔍 Test Checklist:"
echo ""
echo "   1. Visit: http://localhost:3000/signup"
echo "      → Create a test public user account"
echo ""
echo "   2. Visit: http://localhost:3000/login"
echo "      → Login with your test account"
echo ""
echo "   3. Visit: http://localhost:3000/contact"
echo "      → Should work (no redirect)"
echo ""
echo "   4. Logout, then visit /contact again"
echo "      → Should redirect to /login"
echo ""
echo "   5. Login with your ADMIN credentials"
echo "      → Should see 'Dashboard' button in header"
echo "      → Visit /admin/dashboard - should work"
echo ""

read -p "Press Enter when you've tested everything... " -n 1 -r
echo ""

echo "🛑 Stopping development server..."
kill $DEV_PID 2>/dev/null

echo ""
echo "✅ All done! Ready to deploy?"
echo ""

read -p "Deploy to production? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    npm run deploy "feat: add public user authentication system"
    echo ""
    echo "✅ Deployment complete!"
else
    echo "👍 No problem! Deploy later with:"
    echo '   npm run deploy "feat: add public user authentication system"'
fi

echo ""
echo "════════════════════════════════════════"
echo "🎉 Public User System Setup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "📚 Documentation:"
echo "   • Quick Start: QUICK-START-AUTH.md"
echo "   • Full Guide: PUBLIC-USER-SYSTEM.md"
echo "   • Setup Details: AUTH-SETUP.md"
echo ""
echo "🔐 Two User Systems:"
echo "   • Admin (you): Uses 'profiles' table"
echo "   • Public users: Uses 'public_users' table"
echo "   • No conflicts - completely separate!"
echo ""
echo "✅ What works now:"
echo "   • Public user signup/login"
echo "   • Protected routes (/contact requires login)"
echo "   • Admin vs public user detection"
echo "   • Header shows Login/Signup buttons"
echo ""
echo "🚀 Next steps:"
echo "   • Add contact form functionality"
echo "   • Add service request forms"
echo "   • Add admin pages to manage inquiries"
echo ""
echo "Need help? Check the documentation files! 🙌"
echo ""
