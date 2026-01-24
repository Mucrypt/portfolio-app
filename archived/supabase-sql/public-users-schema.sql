-- ============================================
-- PUBLIC USERS SCHEMA
-- Separate from admin portfolio schema
-- For customers/visitors who sign up
-- ============================================

-- 1) PUBLIC USERS TABLE
-- This is completely separate from your admin 'profiles' table
create table if not exists public_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique, -- Links to auth.users
  email text not null unique,
  full_name text,
  phone text,
  avatar_url text,
  
  -- User type and status
  user_role text not null default 'customer', -- 'customer', 'client', 'subscriber'
  is_active boolean default true,
  email_verified boolean default false,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  last_login_at timestamptz,
  
  -- Preferences
  preferences jsonb default '{
    "notifications": true,
    "marketing_emails": false,
    "newsletter": false
  }'::jsonb
);

-- 2) USER ADDRESSES
-- For shipping/billing if they buy products
create table if not exists user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public_users(id) on delete cascade,
  
  address_type text not null, -- 'billing', 'shipping'
  is_default boolean default false,
  
  street_address text not null,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'USA',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) CONTACT INQUIRIES
-- Store contact form submissions
create table if not exists contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public_users(id) on delete set null,
  
  -- Contact details (some users may not be registered)
  name text not null,
  email text not null,
  phone text,
  
  -- Inquiry details
  subject text not null,
  message text not null,
  inquiry_type text default 'general', -- 'general', 'hire', 'support', 'quote'
  
  -- Status
  status text default 'new', -- 'new', 'read', 'replied', 'closed'
  admin_notes text,
  
  -- Tracking
  created_at timestamptz default now(),
  responded_at timestamptz,
  
  -- Metadata
  user_agent text,
  ip_address text
);

-- 4) SERVICE REQUESTS
-- For hire/service inquiries
create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public_users(id) on delete cascade,
  
  service_type text not null, -- 'web_dev', 'consulting', 'custom'
  project_title text not null,
  description text not null,
  budget_range text, -- 'under_1k', '1k_5k', '5k_10k', '10k_plus'
  timeline text, -- 'urgent', '1_month', '3_months', 'flexible'
  
  -- Status
  status text default 'pending', -- 'pending', 'reviewing', 'accepted', 'declined', 'completed'
  admin_response text,
  
  -- Attachments
  attachments jsonb default '[]'::jsonb,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5) USER ACTIVITY LOG
-- Track user actions for analytics
create table if not exists user_activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public_users(id) on delete set null,
  
  activity_type text not null, -- 'login', 'contact', 'service_request', 'page_view', 'download'
  activity_data jsonb default '{}'::jsonb,
  
  -- Tracking
  page_url text,
  user_agent text,
  ip_address text,
  
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_public_users_auth on public_users(auth_user_id);
create index if not exists idx_public_users_email on public_users(email);
create index if not exists idx_public_users_role on public_users(user_role);
create index if not exists idx_user_addresses_user on user_addresses(user_id);
create index if not exists idx_contact_inquiries_user on contact_inquiries(user_id);
create index if not exists idx_contact_inquiries_status on contact_inquiries(status);
create index if not exists idx_service_requests_user on service_requests(user_id);
create index if not exists idx_service_requests_status on service_requests(status);
create index if not exists idx_user_activity_user on user_activity_log(user_id);

-- ============================================
-- TRIGGERS
-- ============================================
-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_public_users_updated_at
  before update on public_users
  for each row
  execute function update_updated_at_column();

create trigger update_user_addresses_updated_at
  before update on user_addresses
  for each row
  execute function update_updated_at_column();

create trigger update_service_requests_updated_at
  before update on service_requests
  for each row
  execute function update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public_users enable row level security;
alter table user_addresses enable row level security;
alter table contact_inquiries enable row level security;
alter table service_requests enable row level security;
alter table user_activity_log enable row level security;

-- PUBLIC USERS POLICIES
-- Allow inserts during signup (trigger runs as service role)
create policy "Enable insert for service role"
  on public_users for insert
  with check (true);

-- Users can read their own data
create policy "Users can view own profile"
  on public_users for select
  using (auth.uid() = auth_user_id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public_users for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

-- Admin can view all public users
create policy "Admin can view all public users"
  on public_users for select
  using (
    exists (
      select 1 from profiles where owner_user_id = auth.uid()
    )
  );

-- USER ADDRESSES POLICIES
create policy "Users can manage own addresses"
  on user_addresses for all
  using (
    exists (
      select 1 from public_users
      where public_users.id = user_addresses.user_id
      and public_users.auth_user_id = auth.uid()
    )
  );

-- CONTACT INQUIRIES POLICIES
-- Anyone can create inquiries (even non-logged-in users)
create policy "Anyone can create inquiries"
  on contact_inquiries for insert
  with check (true);

-- Users can view their own inquiries
create policy "Users can view own inquiries"
  on contact_inquiries for select
  using (
    user_id in (
      select id from public_users where auth_user_id = auth.uid()
    )
  );

-- Admin can view all inquiries
create policy "Admin can view all inquiries"
  on contact_inquiries for select
  using (
    auth.uid() in (
      select owner_user_id from profiles limit 1
    )
  );

-- Admin can update inquiries
create policy "Admin can update inquiries"
  on contact_inquiries for update
  using (
    auth.uid() in (
      select owner_user_id from profiles limit 1
    )
  );

-- SERVICE REQUESTS POLICIES
create policy "Users can manage own service requests"
  on service_requests for all
  using (
    user_id in (
      select id from public_users where auth_user_id = auth.uid()
    )
  );

-- Admin can view all service requests
create policy "Admin can view all service requests"
  on service_requests for select
  using (
    auth.uid() in (
      select owner_user_id from profiles limit 1
    )
  );

-- Admin can update service requests
create policy "Admin can update service requests"
  on service_requests for update
  using (
    auth.uid() in (
      select owner_user_id from profiles limit 1
    )
  );

-- USER ACTIVITY LOG POLICIES
create policy "System can insert activity"
  on user_activity_log for insert
  with check (true);

create policy "Users can view own activity"
  on user_activity_log for select
  using (
    user_id in (
      select id from public_users where auth_user_id = auth.uid()
    )
  );

-- Admin can view all activity
create policy "Admin can view all activity"
  on user_activity_log for select
  using (
    auth.uid() in (
      select owner_user_id from profiles limit 1
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create public_user after auth signup
create or replace function public.handle_new_user_signup()
returns trigger as $$
begin
  insert into public.public_users (
    auth_user_id,
    email,
    full_name,
    email_verified
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email_confirmed_at is not null
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create public_user on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_signup();

-- Function to update last_login_at
create or replace function public.update_user_last_login()
returns trigger as $$
begin
  update public.public_users
  set last_login_at = now()
  where auth_user_id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update last login
drop trigger if exists on_auth_user_login on auth.users;
create trigger on_auth_user_login
  after update on auth.users
  for each row
  when (old.last_sign_in_at is distinct from new.last_sign_in_at)
  execute function public.update_user_last_login();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where owner_user_id = user_id
  );
end;
$$ language plpgsql security definer;

-- Get public user by auth id
create or replace function public.get_public_user()
returns setof public_users as $$
begin
  return query
  select * from public_users
  where auth_user_id = auth.uid();
end;
$$ language plpgsql security definer;

-- ============================================
-- VIEWS
-- ============================================

-- View for admin to see all user stats
create or replace view admin_user_stats as
select
  count(*) as total_users,
  count(*) filter (where is_active = true) as active_users,
  count(*) filter (where email_verified = true) as verified_users,
  count(*) filter (where created_at > now() - interval '30 days') as new_users_30d,
  count(*) filter (where last_login_at > now() - interval '7 days') as active_users_7d
from public_users;

-- View for recent inquiries
create or replace view admin_recent_inquiries as
select
  ci.*,
  pu.full_name as user_full_name,
  pu.email as user_email
from contact_inquiries ci
left join public_users pu on ci.user_id = pu.id
order by ci.created_at desc
limit 50;

-- View for pending service requests
create or replace view admin_pending_service_requests as
select
  sr.*,
  pu.full_name,
  pu.email,
  pu.phone
from service_requests sr
join public_users pu on sr.user_id = pu.id
where sr.status = 'pending'
order by sr.created_at desc;

-- ============================================
-- COMMENTS
-- ============================================
comment on table public_users is 'Public customer/visitor accounts - separate from admin portfolio';
comment on table user_addresses is 'User shipping/billing addresses for e-commerce';
comment on table contact_inquiries is 'Contact form submissions from public users';
comment on table service_requests is 'Service/hire requests from customers';
comment on table user_activity_log is 'Track user actions for analytics';
