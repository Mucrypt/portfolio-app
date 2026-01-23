# 🏗️ Public User System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR PORTFOLIO APP                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
          ┌───────────────────────────────────────┐
          │      AUTHENTICATION LAYER              │
          │   (Supabase Auth - Single Source)     │
          └───────────────────────────────────────┘
                              │
                              ▼
                  ┌───────────┴───────────┐
                  │                       │
                  ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐
       │   ADMIN USERS    │    │  PUBLIC USERS    │
       │   (Portfolio)    │    │  (Customers)     │
       └──────────────────┘    └──────────────────┘
                  │                       │
                  ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐
       │  profiles table  │    │ public_users     │
       │  skills          │    │ contact_inquiries│
       │  experiences     │    │ service_requests │
       │  education       │    │ user_addresses   │
       │  projects        │    │ user_activity_log│
       │  certificates    │    │                  │
       │  languages       │    │                  │
       └──────────────────┘    └──────────────────┘
                  │                       │
                  ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐
       │ /admin/*         │    │ /contact         │
       │ Full Dashboard   │    │ /services        │
       │ Content Mgmt     │    │ /shop (future)   │
       └──────────────────┘    └──────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│   VISITOR   │
└──────┬──────┘
       │
       ▼
   Wants to access protected page (/contact)
       │
       ▼
┌──────────────────────┐
│  Is authenticated?   │
└──────┬───────────────┘
       │
       ├─── NO ──────► Redirect to /login
       │               ↓
       │           Show login/signup options
       │               ↓
       │           User creates account
       │               ↓
       │           Record in public_users
       │               ↓
       │           Access /contact ✅
       │
       └─── YES ─────► Check user type
                       │
                       ├─── ADMIN ──────► profiles table
                       │                  ↓
                       │              /admin/* access ✅
                       │
                       └─── PUBLIC ─────► public_users table
                                          ↓
                                      /contact access ✅
```

## Database Schema Relationship

```
┌────────────────────────────────────────────────────────────┐
│                     auth.users (Supabase)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ id (UUID) | email | created_at | last_sign_in_at     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              │
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   profiles (Admin)      │     │  public_users (Public)  │
│  ┌───────────────────┐  │     │  ┌───────────────────┐  │
│  │ id                │  │     │  │ id                │  │
│  │ owner_user_id ────┼──┘     │  │ auth_user_id ─────┼──┘
│  │ full_name         │        │  │ email             │
│  │ headline          │        │  │ full_name         │
│  │ bio               │        │  │ user_role         │
│  │ skills            │        │  │ is_active         │
│  │ avatar_url        │        │  │ preferences       │
│  └───────────────────┘        │  └───────────────────┘
│                               │
│  Related Tables:              │  Related Tables:
│  • skills                     │  • user_addresses
│  • experiences                │  • contact_inquiries
│  • education                  │  • service_requests
│  • projects                   │  • user_activity_log
│  • certificates               │
│  • languages                  │
└───────────────────────────────┘  └─────────────────────────┘
```

## Route Protection

```
┌──────────────────────────────────────────────────────────┐
│                     MIDDLEWARE                           │
│              (middleware.ts)                             │
└──────────────────────────────────────────────────────────┘
                       │
                       ▼
              Check request path
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│   PUBLIC   │  │  PROTECTED │  │   ADMIN    │
│   ROUTES   │  │  PUBLIC    │  │   ROUTES   │
└────────────┘  │  ROUTES    │  └────────────┘
       │        └────────────┘         │
       │               │               │
       ▼               ▼               ▼
  Allow Access   Require Login   Require Admin
       │               │               │
       │               │               │
  • /                 │          • /admin/*
  • /about            │          • /api/admin/*
  • /blog             │               │
  • /projects         │               │
  • /shop             │               ▼
       │              │          Check profiles table
       │              │               │
       │              ▼               │
       │         • /contact           │
       │         • /services/*/hire   │
       │         • /checkout          │
       │              │               │
       │              ▼               ▼
       │         Check auth      Has profile?
       │              │               │
       │              │          ┌────┴────┐
       │              │          │         │
       │              │         YES       NO
       │              │          │         │
       │              │        Allow   Redirect
       │              │        Access  to /login
       └──────────────┴──────────┴─────────┘
```

## User Journey

### Public User Journey

```
1. Visit site ───► 2. Click "Contact" ───► 3. Not logged in
                                                   │
                                                   ▼
                                           Redirect to /login
                                                   │
                                                   ▼
                                           Click "Sign Up"
                                                   │
                                                   ▼
                                           Fill signup form:
                                           • Email
                                           • Password
                                           • Full Name
                                                   │
                                                   ▼
                                           Account created ✅
                                                   │
                                                   ▼
                                           Auto-login
                                                   │
                                                   ▼
                                           Access /contact ✅
```

### Admin Journey

```
1. Visit site ───► 2. Click "Login" ───► 3. Enter admin credentials
                                                   │
                                                   ▼
                                           System checks:
                                           • auth.users (valid?)
                                           • profiles (has record?)
                                                   │
                                                   ▼
                                           Recognized as ADMIN ✅
                                                   │
                                                   ▼
                                           Access /admin/dashboard ✅
```

## Data Flow: Contact Form Submission

```
┌─────────────┐
│    USER     │
│ Fills Form  │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  Submit to API       │
│  /api/contact        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Get current user     │
│ from auth.users      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Look up user in      │
│ public_users table   │
│ WHERE auth_user_id   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Insert into          │
│ contact_inquiries:   │
│ • user_id            │
│ • name, email        │
│ • subject, message   │
│ • status: 'new'      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Return success ✅     │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│ Admin can view in    │
│ Supabase or future   │
│ /admin/inquiries     │
└──────────────────────┘
```

## Security Model

```
┌────────────────────────────────────────────────────────┐
│         ROW LEVEL SECURITY (RLS) POLICIES              │
└────────────────────────────────────────────────────────┘

PUBLIC_USERS TABLE:
┌─────────────────────────────────────────────────────┐
│ • Users can view/edit OWN profile                   │
│ • Admin can view ALL public_users                   │
│ • No one can delete (except admin via SQL)          │
└─────────────────────────────────────────────────────┘

CONTACT_INQUIRIES TABLE:
┌─────────────────────────────────────────────────────┐
│ • Anyone can INSERT (even non-logged-in)            │
│ • Users can view OWN inquiries                      │
│ • Admin can view ALL inquiries                      │
│ • Admin can UPDATE (mark as read/replied)           │
└─────────────────────────────────────────────────────┘

SERVICE_REQUESTS TABLE:
┌─────────────────────────────────────────────────────┐
│ • Users can create/view/edit OWN requests           │
│ • Admin can view ALL requests                       │
│ • Admin can UPDATE (accept/decline)                 │
└─────────────────────────────────────────────────────┘

PROFILES TABLE (Admin - Unchanged):
┌─────────────────────────────────────────────────────┐
│ • Public can READ (portfolio is public)             │
│ • Owner can WRITE (only your user_id)               │
│ • All other users BLOCKED                           │
└─────────────────────────────────────────────────────┘
```

## Key Separation Points

| Aspect           | Admin System                      | Public User System               |
| ---------------- | --------------------------------- | -------------------------------- |
| **Table**        | `profiles`                        | `public_users`                   |
| **Purpose**      | Portfolio management              | Customer accounts                |
| **Foreign Key**  | `owner_user_id` → `auth.users.id` | `auth_user_id` → `auth.users.id` |
| **Routes**       | `/admin/*`                        | `/contact`, `/services`, etc.    |
| **Access Level** | Full CRUD on portfolio            | Limited to contact/hire/shop     |
| **Dashboard**    | `/admin/dashboard`                | Future: `/account`               |
| **Can See**      | Everything (admin)                | Only own data                    |

## Summary

✅ **Single Auth Source**: Both systems use Supabase Auth (`auth.users`)

✅ **Separate Data**: Admin uses `profiles`, public uses `public_users`

✅ **No Conflicts**: Completely independent table structures

✅ **Role Detection**: Functions check which table user exists in

✅ **Secure**: RLS policies ensure proper data isolation

✅ **Scalable**: Easy to add features (shop, bookings, subscriptions)

---

**Your admin system remains completely untouched!** 🎉
