-- Check if user exists in auth but not in public_users
SELECT 
  u.id,
  u.email,
  u.created_at,
  pu.id as public_user_id
FROM auth.users u
LEFT JOIN public.public_users pu ON pu.auth_user_id = u.id
WHERE pu.id IS NULL;

-- If you see your user listed above, run this to create their public_users record:
-- Replace 'USER_ID_HERE' with the actual user ID from above query
-- Replace 'USER_EMAIL_HERE' with the email
-- Replace 'USER_NAME_HERE' with the full name

/*
INSERT INTO public.public_users (auth_user_id, email, full_name)
VALUES (
  'USER_ID_HERE',
  'USER_EMAIL_HERE', 
  'USER_NAME_HERE'
);
*/
