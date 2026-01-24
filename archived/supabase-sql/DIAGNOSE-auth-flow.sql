-- COMPREHENSIVE AUTHENTICATION FLOW DIAGNOSTICS
-- Run each section separately to diagnose the issue

-- ============================================
-- SECTION 1: Check all auth users
-- ============================================
SELECT 
  id as auth_user_id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- SECTION 2: Check all public_users records
-- ============================================
SELECT 
  id,
  auth_user_id,
  email,
  full_name,
  created_at
FROM public.public_users
ORDER BY created_at DESC;

-- ============================================
-- SECTION 3: Find orphaned auth users (no public_users record)
-- ============================================
SELECT 
  u.id as auth_user_id,
  u.email,
  u.created_at,
  pu.id as public_user_record_exists
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE pu.id IS NULL
  AND u.email NOT IN (
    SELECT email FROM public.profiles
  )
ORDER BY u.created_at DESC;

-- ============================================
-- SECTION 4: Check if trigger exists and is enabled
-- ============================================
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- SECTION 5: Check the trigger function
-- ============================================
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user_signup';

-- ============================================
-- SECTION 6: Check RLS policies on public_users
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'public_users';

-- ============================================
-- SECTION 7: Test RLS - Check if current user can read public_users
-- ============================================
-- Run this while logged in to see if RLS blocks reads
SELECT COUNT(*) as visible_records FROM public.public_users;
