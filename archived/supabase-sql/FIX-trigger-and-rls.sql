-- ============================================
-- FIX TRIGGER AND RLS FOR SIGNUP
-- This ensures users can be created and read properly
-- ============================================

-- Step 1: Drop and recreate the trigger function with proper security
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER 
SECURITY DEFINER  -- Run with the permissions of the function owner (bypasses RLS)
SET search_path = public
AS $$
BEGIN
  -- Insert into public_users table
  INSERT INTO public.public_users (
    auth_user_id,
    email,
    full_name,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email_confirmed_at IS NOT NULL
  );
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth signup
    RAISE WARNING 'Failed to create public_users record: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_signup();

-- Step 3: Update RLS policies for public_users
-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for service role" ON public_users;
DROP POLICY IF EXISTS "Users can view own profile" ON public_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public_users;
DROP POLICY IF EXISTS "Admin can view all public users" ON public_users;

-- Allow service role to insert (for trigger)
CREATE POLICY "Allow service role insert"
  ON public_users FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to insert (backup for direct signups)
CREATE POLICY "Allow authenticated insert during signup"
  ON public_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public_users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Admin can view all public users
CREATE POLICY "Admin can view all public users"
  ON public_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE owner_user_id = auth.uid()
    )
  );

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.public_users TO authenticated;
GRANT ALL ON public.public_users TO service_role;

-- ============================================
-- VERIFICATION QUERIES
-- Run these after applying the fix
-- ============================================

-- Check trigger exists
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check function exists
-- SELECT proname, prosecdef FROM pg_proc WHERE proname = 'handle_new_user_signup';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'public_users';
