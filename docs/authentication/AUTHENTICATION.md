# Admin Authentication System

## Overview

This portfolio application has a comprehensive authentication system that protects admin routes while keeping the public portfolio accessible to everyone.

## Architecture

### 1. **Middleware Protection** (`/proxy.ts` + `/lib/supabase/middleware.ts`)

- Runs on every request before pages load
- Checks if user is authenticated when accessing `/admin/*` routes
- Verifies user is the portfolio owner by checking `profiles` table
- Redirects unauthorized users to `/login` or `/`

### 2. **Server-Side Protection** (`/lib/auth/checkAdmin.ts`)

- `requireAdmin()`: Server function that double-checks authentication
- Use in any admin page component to ensure only the owner can access
- Returns user and profile data for the authenticated owner

### 3. **Client-Side Components**

- Login page with Supabase authentication
- Logout button in admin header
- Redirect handling for seamless UX

## How It Works

### For Regular Visitors

1. Visit `romeomukulah.org` → See beautiful landing page
2. Click any public link (Projects, Blog, etc.) → Access freely
3. Try to access `/admin` → Redirected to `/login`
4. Even if they sign in, without a profile they can't access admin

### For You (Portfolio Owner)

1. Visit `romeomukulah.org` → See landing page
2. Click subtle admin icon (top-right) → Go to `/login`
3. Sign in with your credentials
4. System checks your `owner_user_id` in `profiles` table
5. Access granted → Full admin dashboard access

## Security Features

### ✅ Multi-Layer Protection

1. **Middleware Layer**: Blocks unauthorized requests before page loads
2. **Database Layer**: RLS (Row Level Security) ensures only `owner_user_id` can write
3. **Server Component Layer**: `requireAdmin()` double-checks on page load

### ✅ Owner Verification

```typescript
// Checks if authenticated user owns the portfolio
const { data: profile } = await supabase
  .from('profiles')
  .select('id, owner_user_id')
  .eq('owner_user_id', user.id)
  .single()

if (!profile) {
  // Not the owner → deny access
  redirect('/')
}
```

### ✅ Public Data, Private Admin

- **Public**: Anyone can read projects, blog posts, courses, etc.
- **Admin**: Only you can create, update, delete content
- RLS policies enforce this at the database level

## Setup Instructions

### Step 1: Create Your Owner Account

```bash
# 1. Visit your deployed site
https://romeomukulah.org/login

# 2. Sign up with your email
# 3. Check email for verification link
# 4. Verify your account
```

### Step 2: Create Your Profile

```sql
-- Run in Supabase SQL Editor
-- Replace 'YOUR_USER_ID' with the UUID from auth.users table

INSERT INTO profiles (
  owner_user_id,
  full_name,
  headline,
  email,
  bio
) VALUES (
  'YOUR_USER_ID',
  'Romeo Mukulah',
  'Full Stack Developer & Cloud Architect',
  'romeo@example.com',
  'Your bio here...'
);
```

### Step 3: Access Admin Dashboard

```bash
# Now you can access:
https://romeomukulah.org/admin
```

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Schema

All tables use `owner_user_id` field:

- `profiles` → Main owner profile
- `projects` → Portfolio projects
- `skills` → Technical skills
- `experiences` → Work experience
- `education` → Education history
- `languages` → Languages spoken
- `certificates` → Certifications

## Usage in Code

### Protect an Admin Page

```typescript
// app/admin/your-page/page.tsx
import { requireAdmin } from '@/lib/auth/checkAdmin';

export default async function YourAdminPage() {
  // This line protects the entire page
  const { user, profile } = await requireAdmin();

  // Your page code here
  return <div>Protected Content</div>;
}
```

### Check Auth Status (Optional)

```typescript
// If you just want to check, not redirect
import { getAuthUser } from '@/lib/auth/checkAdmin'

const user = await getAuthUser()
if (user) {
  // User is logged in
}
```

## Testing Authentication

### Test 1: Unauthenticated Access

```bash
# 1. Open incognito window
# 2. Visit https://romeomukulah.org/admin
# Expected: Redirect to /login
```

### Test 2: Non-Owner Access

```bash
# 1. Sign up with different email
# 2. Try to access /admin
# Expected: Redirect to / (home page)
```

### Test 3: Owner Access

```bash
# 1. Sign in with your owner email
# 2. Visit /admin
# Expected: Full access to admin dashboard
```

## Logout

Click "Logout" button in admin header or visit:

```typescript
// Programmatic logout
const supabase = createClient()
await supabase.auth.signOut()
router.push('/login')
```

## Troubleshooting

### Issue: Can't access admin after signing in

**Solution**: Make sure you have a profile row with your `owner_user_id`

```sql
-- Check if profile exists
SELECT * FROM profiles WHERE owner_user_id = 'YOUR_USER_ID';

-- If not, create one (see Step 2 above)
```

### Issue: Getting redirected to home after login

**Solution**: Your account is authenticated but you're not the owner. Only the account with a matching profile can access admin.

### Issue: RLS policy errors

**Solution**: Ensure RLS policies are properly set up:

```sql
-- Run in Supabase SQL Editor
-- (The SQL you provided earlier)
```

## Security Best Practices

1. ✅ Never share your admin credentials
2. ✅ Use a strong password (12+ characters)
3. ✅ Enable 2FA in Supabase dashboard (recommended)
4. ✅ Regularly check Supabase logs for suspicious activity
5. ✅ Keep `owner_user_id` consistent across all tables

## Next Steps

Want to enhance security further?

- Add 2FA (Two-Factor Authentication)
- Add IP whitelisting for admin routes
- Add session timeout (auto-logout after inactivity)
- Add email notifications for admin logins
- Add audit logs for all admin actions

Let me know if you'd like to implement any of these!
