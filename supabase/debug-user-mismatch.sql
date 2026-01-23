-- Check if the auth_user_id matches correctly
SELECT 
  pu.id,
  pu.auth_user_id,
  pu.email,
  pu.full_name,
  u.id as actual_auth_id,
  CASE 
    WHEN pu.auth_user_id = u.id THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as status
FROM public.public_users pu
LEFT JOIN auth.users u ON u.email = pu.email
WHERE pu.email = 'romeoyongsi@gmail.com';
