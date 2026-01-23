# 🔐 Public User Authentication System

## Overview

Your app now has **two separate user systems**:

### 1. **Admin Users** (You - Portfolio Owner)

- Uses `profiles` table
- Full access to admin dashboard
- Manages portfolio content (projects, skills, experiences, etc.)
- Login at: `/login`

### 2. **Public Users** (Customers/Visitors)

- Uses `public_users` table
- Can contact you, request services, shop (future)
- Sign up at: `/signup`
- Login at: `/login`

---

## 📊 Database Schema

### Public Users Tables

```sql
✅ public_users           - Customer accounts (separate from admin profiles)
✅ user_addresses         - Shipping/billing addresses
✅ contact_inquiries      - Contact form submissions
✅ service_requests       - Hire/service requests
✅ user_activity_log      - Analytics & tracking
```

### Admin Tables (Unchanged)

```sql
✅ profiles               - Your admin portfolio profile
✅ skills                 - Your skills
✅ experiences            - Your work experience
✅ education              - Your education
✅ projects               - Your projects
✅ languages              - Languages you speak
✅ certificates           - Your certifications
```

---

## 🚀 Setup Instructions

### Step 1: Run SQL Scripts in Supabase

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run these files in order:

```bash
# 1. Create public users schema
📁 supabase/public-users-schema.sql

# 2. Create role detection functions
📁 supabase/user-role-functions.sql
```

### Step 2: Test the System

```bash
# Start dev server
npm run dev

# Visit these pages:
http://localhost:3000/signup     # Public user signup
http://localhost:3000/login      # Login page
http://localhost:3000/contact    # Protected page (requires login)
```

---

## 🎯 How It Works

### User Flow

```
┌─────────────────────────────────────┐
│  Visitor comes to your site         │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Wants to contact/hire/shop?         │
└──────┬───────────────────────────────┘
       │
       ├─── Not logged in ───► Redirected to /signup or /login
       │
       └─── Logged in ─────► Access protected features
```

### Authentication Architecture

```typescript
// Check user type
const role = await getUserRole()

if (role === 'admin') {
  // Portfolio owner - full admin access
  // Uses profiles table
  redirect('/admin/dashboard')
} else if (role === 'user') {
  // Public customer
  // Uses public_users table
  // Can contact, request services, shop
} else {
  // Not logged in
  redirect('/login')
}
```

---

## 🔧 Protected Routes

### Current Protected Routes

- `/contact` - Contact form (requires login)
- `/services/[slug]` - Hire service (requires login for "Hire Me" button)
- Future: `/shop`, `/checkout`, etc.

### How to Protect More Routes

In `middleware.ts`:

```typescript
// Add route to protected public routes
const protectedPublicRoutes = [
  '/contact',
  '/services',
  '/shop', // Add this
  '/checkout', // Add this
]
```

---

## 📝 Usage Examples

### Create Contact Inquiry

```typescript
import { createClient } from '@/lib/supabase/client'

async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const supabase = createClient()

  // Get current user (if logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get public_user record
  const { data: publicUser } = await supabase
    .from('public_users')
    .select('id')
    .eq('auth_user_id', user?.id)
    .single()

  // Create inquiry
  const { error } = await supabase.from('contact_inquiries').insert({
    user_id: publicUser?.id,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    inquiry_type: 'general',
    status: 'new',
  })

  if (error) throw error
}
```

### Create Service Request

```typescript
async function createServiceRequest(data: {
  serviceType: string
  projectTitle: string
  description: string
  budgetRange: string
  timeline: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in')

  // Get public_user record
  const { data: publicUser } = await supabase
    .from('public_users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!publicUser) throw new Error('User profile not found')

  const { error } = await supabase.from('service_requests').insert({
    user_id: publicUser.id,
    service_type: data.serviceType,
    project_title: data.projectTitle,
    description: data.description,
    budget_range: data.budgetRange,
    timeline: data.timeline,
    status: 'pending',
  })

  if (error) throw error
}
```

---

## 🎨 UI Components

### Header (Already Updated)

```tsx
// components/public/Header.tsx
- Shows "Login" and "Sign Up" for non-authenticated users
- Shows "Dashboard" for admin users
- Shows user avatar/menu for public users
```

### Protected Page Example

```tsx
// app/contact/page.tsx
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/user'

export default async function ContactPage() {
  const role = await getUserRole()

  if (!role) {
    redirect('/login?redirect=/contact')
  }

  return <ContactForm />
}
```

---

## 🔒 Security Features

### Row Level Security (RLS)

✅ Public users can only see/edit their own data
✅ Admin can see all public user data
✅ Contact inquiries are properly isolated
✅ Service requests are user-specific

### Auto-created Records

When a public user signs up:

1. ✅ Auth user created in `auth.users`
2. ✅ Profile automatically created in `public_users` via trigger
3. ✅ Email verification sent (if enabled)

---

## 📊 Admin Features

### View Public Users

```sql
-- See all public users
SELECT * FROM public_users ORDER BY created_at DESC;

-- See recent inquiries
SELECT * FROM admin_recent_inquiries;

-- See pending service requests
SELECT * FROM admin_pending_service_requests;

-- User stats
SELECT * FROM admin_user_stats;
```

### Admin Dashboard Pages (Future)

You can add these admin pages:

- `/admin/users` - Manage public users
- `/admin/inquiries` - View contact forms
- `/admin/service-requests` - Manage hire requests
- `/admin/analytics` - User activity analytics

---

## 🧪 Testing Checklist

### Public User Flow

- [ ] Visit `/signup` - Create new account
- [ ] Verify email (if enabled)
- [ ] Login at `/login`
- [ ] Visit `/contact` - No redirect (logged in)
- [ ] Submit contact form
- [ ] Check Supabase - See inquiry in `contact_inquiries`
- [ ] Logout
- [ ] Visit `/contact` - Redirected to `/login`

### Admin Flow

- [ ] Login with admin credentials
- [ ] Visit `/admin/dashboard` - See admin panel
- [ ] Check you still have full portfolio access
- [ ] Query `public_users` table - See customer data

---

## 🛠️ Troubleshooting

### Issue: User not created in public_users

**Solution**: Check if trigger is enabled:

```sql
-- Re-create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
```

### Issue: Admin can't access admin routes

**Check**: Make sure you have a record in `profiles` table with your `owner_user_id`

```sql
SELECT * FROM profiles WHERE owner_user_id = 'your-auth-user-id';
```

### Issue: RLS policies blocking access

**Debug**:

```sql
-- Check user type
SELECT public.get_user_type();

-- Should return 'admin' for you, 'public_user' for customers
```

---

## 📚 Next Steps

### Immediate

1. ✅ Run SQL scripts in Supabase
2. ✅ Test signup/login flow
3. ✅ Test contact form

### Future Features

- [ ] Add user profile page (`/account`)
- [ ] Add service request form (`/services/[slug]`)
- [ ] Add admin pages to manage inquiries
- [ ] Add email notifications (Resend/SendGrid)
- [ ] Add payment integration (Stripe)
- [ ] Add order history for shop features

---

## 📖 File Structure

```
portfolio-app/
├── app/
│   ├── login/page.tsx              # Login for all users
│   ├── signup/page.tsx             # Public user registration
│   ├── contact/page.tsx            # Protected contact page
│   └── admin/                      # Admin-only pages
├── components/
│   └── public/Header.tsx           # With login/signup buttons
├── lib/
│   └── auth/
│       └── user.ts                 # Auth utilities
├── middleware.ts                   # Route protection
└── supabase/
    ├── public-users-schema.sql     # Customer database
    └── user-role-functions.sql     # Role detection
```

---

## 🎯 Key Points

1. **Two Separate Systems**: Admin uses `profiles`, customers use `public_users`
2. **No Conflicts**: Your admin schema is completely untouched
3. **Automatic**: Users are created in `public_users` via database trigger
4. **Secure**: RLS policies ensure data isolation
5. **Scalable**: Ready for e-commerce, bookings, subscriptions, etc.

---

Need help? Check the code comments or ask! 🚀
