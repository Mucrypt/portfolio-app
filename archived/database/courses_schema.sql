-- =========================================================
-- COURSES (Affiliate Marketing)
-- =========================================================

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  
  -- Basic Info
  title text not null,
  slug text not null,
  short_description text,
  description text not null,
  thumbnail_url text,
  
  -- Instructor & Platform
  instructor_name text not null,
  platform text not null, -- Udemy, Coursera, Teachable, etc.
  
  -- Affiliate Link (The most important field!)
  affiliate_link text not null,
  
  -- Pricing
  original_price decimal(10,2),
  discounted_price decimal(10,2),
  currency text default 'USD',
  
  -- Course Details
  duration_hours decimal(5,1), -- 12.5 hours
  level text default 'Beginner', -- Beginner, Intermediate, Advanced
  category text not null, -- Web Development, Mobile Development, etc.
  language text default 'English',
  
  -- Stats (from platform)
  rating decimal(3,2), -- 4.75
  students_count integer default 0,
  
  -- Structured Content
  what_you_learn text[], -- Array of learning outcomes
  requirements text[], -- Array of prerequisites
  tags text[], -- Array of tags for filtering
  
  -- Publishing
  is_featured boolean default false,
  is_published boolean default true,
  sort_order int default 0,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create unique index if not exists ux_courses_slug on courses(slug);
create index if not exists idx_courses_owner on courses(owner_user_id);
create index if not exists idx_courses_category on courses(category);
create index if not exists idx_courses_platform on courses(platform);
create index if not exists idx_courses_featured on courses(is_featured);

-- RLS
alter table courses enable row level security;

-- Public read published courses
create policy "public read published courses" on courses 
for select using (is_published = true);

-- Owner full access
create policy "owner manage courses" on courses
for all using (auth.uid() = owner_user_id) 
with check (auth.uid() = owner_user_id);

-- Updated at trigger
create trigger trg_courses_updated_at
before update on courses
for each row execute function set_updated_at();

-- =========================================================
-- SEED DATA
-- =========================================================
-- Example courses (replace with your actual affiliate links)
/*
insert into courses (
  owner_user_id, title, slug, short_description, description,
  instructor_name, platform, affiliate_link,
  original_price, discounted_price, duration_hours, level, category,
  rating, students_count, what_you_learn, requirements, tags, is_featured
) values 
(
  'YOUR_USER_ID',
  'The Complete Web Developer Bootcamp 2024',
  'complete-web-developer-bootcamp-2024',
  'Master full-stack web development with HTML, CSS, JavaScript, React, Node.js, and more',
  'Become a full-stack web developer with just ONE course. HTML, CSS, JavaScript, React, Node.js, MongoDB and more!',
  'Dr. Angela Yu',
  'Udemy',
  'https://udemy.com/course/your-affiliate-link',
  199.99,
  14.99,
  52.5,
  'Beginner',
  'Web Development',
  4.7,
  850000,
  ARRAY['Build 16 web development projects', 'Master HTML, CSS, JavaScript', 'Learn React and Node.js', 'Deploy full-stack applications'],
  ARRAY['No programming experience needed', 'A computer with internet'],
  ARRAY['JavaScript', 'React', 'Node.js', 'Full Stack'],
  true
);
*/
