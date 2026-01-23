-- ============================================
-- USER ROLE DETECTION UTILITIES
-- ============================================

-- Function to check if a user is an admin (has portfolio profile)
create or replace function public.is_portfolio_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where owner_user_id = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if a user is a public customer
create or replace function public.is_public_user()
returns boolean as $$
begin
  return exists (
    select 1 from public.public_users
    where auth_user_id = auth.uid()
  );
end;
$$ language plpgsql security definer stable;

-- Function to get user type
create or replace function public.get_user_type()
returns text as $$
begin
  if exists (select 1 from public.profiles where owner_user_id = auth.uid()) then
    return 'admin';
  elsif exists (select 1 from public.public_users where auth_user_id = auth.uid()) then
    return 'public_user';
  else
    return 'unknown';
  end if;
end;
$$ language plpgsql security definer stable;

-- ============================================
-- USAGE EXAMPLES
-- ============================================
-- In your RLS policies, you can now use:
-- is_portfolio_admin() - returns true if user is admin
-- is_public_user() - returns true if user is public customer
-- get_user_type() - returns 'admin', 'public_user', or 'unknown'
