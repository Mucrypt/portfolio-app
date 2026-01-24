# 🔐 Public User Authentication System

Complete authentication system for public users to access protected features like contact forms, shop, and courses.

## 📋 Overview

Your portfolio now has **two user types**:

1. **Admin** - Portfolio owner (you) with full access to admin dashboard
2. **Public Users** - Visitors who sign up to access protected features

## ✅ What's Implemented

### 🔧 Core Files Created

1. **Authentication Utilities** ([lib/auth/user.ts](../../lib/auth/user.ts))
   - `signUpUser()` - Create new public user accounts
   - `signInUser()` - Sign in existing users
   - `signOut()` - Sign out current user
   - `isAuthenticated()` - Check if user is logged in
   - `isAdmin()` - Check if user is admin
   - `getUserRole()` - Get user's role (admin/user)
   - `getCurrentUserProfile()` - Get current user's profile

2. **Auth Context** ([lib/auth/AuthProvider.tsx](../../lib/auth/AuthProvider.tsx))
   - React context for authentication state
   - `useAuth()` hook for accessing auth state
   - Automatic session management

3. **Pages**
   - [app/signup/page.tsx](../../app/signup/page.tsx) - User registration
   - [app/login/page.tsx](../../app/login/page.tsx) - Admin login (updated)

4. **Middleware** ([middleware.ts](../../middleware.ts))
   - Protects admin routes
   - Redirects unauthenticated users from protected routes
   - Handles session management

5. **Header Component** ([components/public/Header.tsx](../../components/public/Header.tsx))
   - Login/Signup buttons for guests
   - User profile display when logged in
   - Sign out functionality
   - Admin dashboard link for admins

6. **Database Schema** ([database/schema-public-users.sql](../../database/schema-public-users.sql))
   - Complete SQL for all tables
   - Row Level Security (RLS) policies
   - Indexes for performance

## 🗄️ Database Setup

### Step 1: Run the SQL Schema

Copy and paste the entire contents of `database/schema-public-users.sql` into your Supabase SQL Editor.

The SQL file creates:

- ✅ public_users table
- ✅ contact_inquiries table
- ✅ user_activity_log table
- ✅ RLS policies
- ✅ Indexes
- ✅ Triggers
- ✅ Helper views

### Step 2: Verify Setup

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('public_users', 'contact_inquiries', 'user_activity_log');

-- Check RLS policies
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'public_users';
```

## 🚀 How It Works

### Protected Routes

These routes now require authentication:

- `/contact` - Contact form
- `/shop` - Shopping features

**To add more protected routes**, edit `lib/supabase/middleware.ts`:

```typescript
const protectedPublicRoutes = [
  '/contact',
  '/shop',
  '/courses', // Add new protected routes here
]
```

### User Roles

- **Admin**: Portfolio owner with full access
- **User**: Public users who sign up

## 💻 Usage in Components

### Check Authentication Status

```typescript
'use client'

import { useAuth } from '@/lib/auth/AuthProvider'

export default function MyComponent() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}!</p>
      ) : (
        <a href="/signup">Sign up</a>
      )}
    </div>
  )
}
```

### Protect a Component

```typescript
'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedComponent() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signup')
    }
  }, [isAuthenticated, loading])

  if (!isAuthenticated) return null

  return <div>Protected Content</div>
}
```

## 📊 Database Tables

### public_users

Stores public user accounts.

Key columns:

- `id` - Primary key
- `auth_user_id` - Links to Supabase auth
- `email` - User email (unique)
- `full_name` - User's name
- `avatar_url` - Profile picture
- `created_at` - Registration date

### contact_inquiries

Stores contact form submissions.

Key columns:

- `user_id` - Links to public_users
- `subject` - Inquiry subject
- `message` - Inquiry message
- `status` - pending/in_progress/resolved/closed

## 🧪 Testing

1. **Test Signup**: http://localhost:3000/signup
2. **Test Login**: http://localhost:3000/login
3. **Test Protected Route**: Try accessing `/contact` while signed out

## 📝 Next Steps

1. ✅ Run SQL schema in Supabase
2. ✅ Test user signup/login
3. 📧 Configure email templates in Supabase
4. 🎨 Customize pages with your branding
5. 📊 Build user dashboard
6. 💬 Add contact inquiry management in admin

## Deploy

```bash
npm run deploy "feat: add public user authentication"
```

---

**You're all set!** Users can now sign up and access protected features. 🎉
