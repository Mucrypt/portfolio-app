-- ============================================
-- COMPLETE DIAGNOSTIC AND FIX FOR AUTH FLOW
-- Run each section in order
-- ============================================

-- STEP 1: Check what we have
-- ============================================
SELECT 'AUTH USERS' as check_type, count(*) as count FROM auth.users WHERE email NOT LIKE '%@supabase%';
SELECT 'PUBLIC USERS' as check_type, count(*) as count FROM public.public_users;

-- STEP 2: Find orphaned users
-- ============================================
SELECT 
  'ORPHANED USER' as issue,
  u.id as auth_user_id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE pu.id IS NULL
  AND u.email NOT IN (SELECT email FROM public.profiles)
  AND u.email NOT LIKE '%@supabase%';

-- STEP 3: Fix orphaned users by creating their public_users records
-- ============================================
INSERT INTO public.public_users (auth_user_id, email, full_name, email_verified)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email_confirmed_at IS NOT NULL
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE pu.id IS NULL
  AND u.email NOT IN (SELECT email FROM public.profiles)
  AND u.email NOT LIKE '%@supabase%'
ON CONFLICT (auth_user_id) DO NOTHING;

-- STEP 4: Verify all users now have records
-- ============================================
SELECT 
  u.id as auth_id,
  u.email as auth_email,
  pu.id as public_user_id,
  pu.auth_user_id as pu_auth_id,
  CASE 
    WHEN pu.id IS NOT NULL THEN '✓ Has public_users record'
    ELSE '✗ MISSING public_users record'
  END as status
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE u.email NOT LIKE '%@supabase%'
  AND u.email NOT IN (SELECT email FROM public.profiles)
ORDER BY u.created_at DESC;
