-- ============================================
-- COMPLETE AUTHENTICATION FIX
-- This fixes ALL issues with public user authentication
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- STEP 1: Drop all existing RLS policies on public_users
-- ============================================
DROP POLICY IF EXISTS "Enable insert for service role" ON public_users;
DROP POLICY IF EXISTS "Allow service role insert" ON public_users;
DROP POLICY IF EXISTS "Allow authenticated insert during signup" ON public_users;
DROP POLICY IF EXISTS "Users can view own profile" ON public_users;
DROP POLICY IF EXISTS "Users can read own profile" ON public_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public_users;
DROP POLICY IF EXISTS "Admin can view all public users" ON public_users;

-- STEP 2: Recreate the trigger function with SECURITY DEFINER
-- ============================================
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
SECURITY DEFINER -- This is CRITICAL - allows function to bypass RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into public_users with the correct auth_user_id
  INSERT INTO public.public_users (
    auth_user_id,
    email,
    full_name,
    email_verified
  )
  VALUES (
    NEW.id,  -- This is the auth.users.id
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email_confirmed_at IS NOT NULL
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, that's fine
    RETURN NEW;
  WHEN others THEN
    -- Log error but don't fail auth
    RAISE WARNING 'Failed to create public_users record for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- STEP 3: Recreate the trigger
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

-- STEP 4: Create PROPER RLS policies
-- ============================================

-- Policy 1: Allow service role to do anything (for triggers)
CREATE POLICY "Service role full access"
  ON public_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to insert their own record
CREATE POLICY "Users can insert own record"
  ON public_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy 3: Allow ANY authenticated user to SELECT their own record
-- THIS IS THE KEY FIX - was too restrictive before
CREATE POLICY "Users can read own record"
  ON public_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Policy 4: Allow users to update their own record
CREATE POLICY "Users can update own record"
  ON public_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Policy 5: Allow admins to read all public users
CREATE POLICY "Admins can read all users"
  ON public_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.owner_user_id = auth.uid()
    )
  );

-- Policy 6: Allow admins to update all public users
CREATE POLICY "Admins can update all users"
  ON public_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.owner_user_id = auth.uid()
    )
  );

-- STEP 5: Grant necessary permissions
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.public_users TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.public_users TO authenticated;

-- STEP 6: Fix any orphaned users
-- ============================================
-- Find auth users without public_users records and create them
INSERT INTO public.public_users (auth_user_id, email, full_name, email_verified)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email_confirmed_at IS NOT NULL
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
LEFT JOIN public.profiles p ON p.owner_user_id = u.id
WHERE pu.id IS NULL  -- No public_users record
  AND p.id IS NULL   -- Not an admin
  AND u.email NOT LIKE '%@supabase%'  -- Not a system user
ON CONFLICT (auth_user_id) DO UPDATE 
SET 
  email = EXCLUDED.email,
  email_verified = EXCLUDED.email_verified;

-- STEP 7: Verification queries
-- ============================================
DO $$
DECLARE
  auth_count INTEGER;
  public_user_count INTEGER;
  orphaned_count INTEGER;
BEGIN
  -- Count auth users (excluding admins and system users)
  SELECT COUNT(*) INTO auth_count
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.owner_user_id = u.id
  WHERE p.id IS NULL AND u.email NOT LIKE '%@supabase%';
  
  -- Count public_users
  SELECT COUNT(*) INTO public_user_count
  FROM public.public_users;
  
  -- Count orphaned users
  SELECT COUNT(*) INTO orphaned_count
  FROM auth.users u
  LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
  LEFT JOIN public.profiles p ON p.owner_user_id = u.id
  WHERE pu.id IS NULL AND p.id IS NULL AND u.email NOT LIKE '%@supabase%';
  
  RAISE NOTICE '✓ Setup complete!';
  RAISE NOTICE '  Auth users (non-admin): %', auth_count;
  RAISE NOTICE '  Public users: %', public_user_count;
  RAISE NOTICE '  Orphaned users: % (should be 0)', orphaned_count;
  
  IF orphaned_count > 0 THEN
    RAISE WARNING '  ⚠ There are still % orphaned users!', orphaned_count;
  END IF;
END $$;

-- STEP 8: Show final status
-- ============================================
SELECT 
  'Final Status' as info,
  u.email,
  u.id as auth_user_id,
  pu.id as public_user_id,
  pu.auth_user_id as pu_auth_user_id,
  CASE 
    WHEN pu.id IS NOT NULL THEN '✓ OK'
    ELSE '✗ MISSING'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON p.owner_user_id = u.id
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE p.id IS NULL  -- Exclude admins
  AND u.email NOT LIKE '%@supabase%'  -- Exclude system users
ORDER BY u.created_at DESC;
