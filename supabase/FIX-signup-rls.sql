-- ============================================
-- FIX: Allow public user signup
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the old restrictive insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON public.public_users;

-- Create new policy that allows inserts during signup
CREATE POLICY "Enable insert for service role"
  ON public.public_users FOR INSERT
  WITH CHECK (true);

-- Verify policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  cmd 
FROM pg_policies 
WHERE tablename = 'public_users';
