-- =========================================================
-- SERVICES TABLE - World-Class Portfolio Services System
-- =========================================================
-- Comprehensive schema for managing professional services offerings

CREATE TABLE IF NOT EXISTS services (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT, -- Short catchy phrase
  description TEXT NOT NULL,
  full_description TEXT, -- Detailed description
  
  -- Visual & Branding
  icon TEXT, -- Emoji or icon identifier (💻, 📱, 🎯, 📚)
  color TEXT DEFAULT '#3B82F6', -- Hex color for UI theming
  featured_image_url TEXT,
  gallery_images TEXT[], -- Portfolio/showcase images
  
  -- Service Details
  category TEXT NOT NULL, -- Web Development, Mobile Apps, Consulting, Training
  subcategories TEXT[], -- Frontend, Backend, Full-Stack, iOS, Android, etc.
  service_type TEXT DEFAULT 'project' CHECK (service_type IN ('project', 'hourly', 'retainer', 'package')),
  
  -- Pricing
  base_price DECIMAL(10, 2), -- Starting price
  price_currency TEXT DEFAULT 'USD',
  price_unit TEXT, -- per hour, per project, per month
  pricing_tiers JSONB, -- Multiple pricing options: [{name, price, features}]
  is_price_negotiable BOOLEAN DEFAULT true,
  
  -- Duration & Availability
  estimated_duration TEXT, -- "2-4 weeks", "1-3 months"
  duration_unit TEXT, -- weeks, months, hours
  min_duration INTEGER, -- Minimum commitment
  max_duration INTEGER, -- Maximum timeline
  is_available BOOLEAN DEFAULT true,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'limited', 'booked', 'unavailable')),
  
  -- Features & Deliverables
  key_features TEXT[] NOT NULL, -- Main selling points
  deliverables TEXT[], -- What client receives
  included_services TEXT[], -- What's included
  excluded_services TEXT[], -- What's NOT included
  requirements TEXT[], -- Client prerequisites
  
  -- Technical Details
  technologies TEXT[], -- Tech stack used
  tools TEXT[], -- Software/platforms
  methodologies TEXT[], -- Agile, Waterfall, etc.
  languages TEXT[], -- Programming languages
  
  -- Process & Workflow
  process_steps JSONB, -- [{step, description, duration}]
  timeline_breakdown JSONB, -- Detailed phase breakdown
  revision_count INTEGER DEFAULT 2, -- Number of revisions included
  support_duration TEXT, -- Post-delivery support period
  
  -- Portfolio & Case Studies
  portfolio_project_ids UUID[], -- Links to projects table
  case_study_urls TEXT[], -- External case studies
  demo_url TEXT,
  github_repo_url TEXT,
  sample_work_urls TEXT[],
  
  -- Client Success
  success_metrics JSONB, -- What success looks like
  typical_results TEXT[], -- Common outcomes
  client_testimonials JSONB, -- [{name, company, quote, rating}]
  success_stories TEXT[],
  
  -- Engagement
  consultation_required BOOLEAN DEFAULT true,
  consultation_duration INTEGER, -- Minutes for initial call
  onboarding_process TEXT,
  communication_channels TEXT[], -- Slack, Email, Zoom, etc.
  meeting_frequency TEXT, -- Weekly check-ins, daily standups
  
  -- FAQ & Support
  faqs JSONB, -- [{question, answer}]
  common_questions TEXT[],
  documentation_url TEXT,
  support_email TEXT,
  support_hours TEXT,
  
  -- Booking & Availability
  booking_url TEXT,
  calendar_url TEXT, -- Calendly, etc.
  lead_time_days INTEGER DEFAULT 7, -- Days notice needed
  max_concurrent_clients INTEGER DEFAULT 3,
  current_clients INTEGER DEFAULT 0,
  waitlist_available BOOLEAN DEFAULT false,
  
  -- Legal & Terms
  contract_template_url TEXT,
  terms_conditions TEXT,
  cancellation_policy TEXT,
  refund_policy TEXT,
  payment_terms TEXT, -- "50% upfront, 50% on delivery"
  payment_methods TEXT[], -- Credit Card, PayPal, Wire Transfer
  
  -- SEO & Marketing
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image_url TEXT,
  
  -- Call to Action
  cta_primary_text TEXT DEFAULT 'Get Started',
  cta_primary_url TEXT,
  cta_secondary_text TEXT DEFAULT 'Schedule Consultation',
  cta_secondary_url TEXT,
  
  -- Stats & Performance
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 100.00, -- Success rate
  avg_rating DECIMAL(3, 2), -- Average client rating
  total_reviews INTEGER DEFAULT 0,
  
  -- Featured & Promotion
  is_featured BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_accepting_clients BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured, display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_available ON services(is_available, availability_status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular) WHERE is_active = true;

-- Full-text search on name and description
CREATE INDEX IF NOT EXISTS idx_services_search ON services USING gin(to_tsvector('english', name || ' ' || description));

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_services_updated_at ON services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public: Read active services
DROP POLICY IF EXISTS "public_read_active_services" ON services;
CREATE POLICY "public_read_active_services" ON services
  FOR SELECT
  USING (is_active = true);

-- Authenticated users (admin): Full CRUD
DROP POLICY IF EXISTS "admin_manage_services" ON services;
CREATE POLICY "admin_manage_services" ON services
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- SERVICE INQUIRIES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS service_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  website TEXT,
  
  -- Inquiry Details
  subject TEXT,
  message TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  project_description TEXT,
  
  -- Requirements
  specific_requirements TEXT[],
  preferred_start_date DATE,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'accepted', 'declined', 'spam')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Follow-up
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  follow_up_date DATE,
  consultation_scheduled_at TIMESTAMPTZ,
  
  -- Source & Tracking
  source TEXT, -- Website form, LinkedIn, Referral
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_inquiries_service ON service_inquiries(service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON service_inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON service_inquiries(email);

ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry
DROP POLICY IF EXISTS "anyone_insert_inquiry" ON service_inquiries;
CREATE POLICY "anyone_insert_inquiry" ON service_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Only admin can view/manage inquiries
DROP POLICY IF EXISTS "admin_manage_inquiries" ON service_inquiries;
CREATE POLICY "admin_manage_inquiries" ON service_inquiries
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- SERVICE REVIEWS TABLE (Optional)
-- =========================================================

CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Reviewer Information
  reviewer_name TEXT NOT NULL,
  reviewer_company TEXT,
  reviewer_position TEXT,
  reviewer_avatar_url TEXT,
  reviewer_linkedin_url TEXT,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  
  -- Project Details
  project_type TEXT,
  project_duration TEXT,
  project_budget_range TEXT,
  completion_date DATE,
  
  -- Ratings Breakdown
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeline_rating INTEGER CHECK (timeline_rating >= 1 AND timeline_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- Highlights
  pros TEXT[],
  cons TEXT[],
  would_recommend BOOLEAN DEFAULT true,
  would_hire_again BOOLEAN DEFAULT true,
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_method TEXT, -- Email, LinkedIn, Contract
  
  -- Display
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  display_on_homepage BOOLEAN DEFAULT false,
  
  -- Response
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_service ON service_reviews(service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON service_reviews(rating DESC) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON service_reviews(is_featured) WHERE is_approved = true;

ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

-- Public: Read approved reviews
DROP POLICY IF EXISTS "public_read_approved_reviews" ON service_reviews;
CREATE POLICY "public_read_approved_reviews" ON service_reviews
  FOR SELECT
  USING (is_approved = true);

-- Admin: Manage all reviews
DROP POLICY IF EXISTS "admin_manage_reviews" ON service_reviews;
CREATE POLICY "admin_manage_reviews" ON service_reviews
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- SUCCESS MESSAGE
-- =========================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Services schema created successfully!';
  RAISE NOTICE '📋 Tables created:';
  RAISE NOTICE '   - services (main services table)';
  RAISE NOTICE '   - service_inquiries (lead capture)';
  RAISE NOTICE '   - service_reviews (testimonials)';
  RAISE NOTICE '🎯 Features included:';
  RAISE NOTICE '   - Comprehensive service details';
  RAISE NOTICE '   - Flexible pricing tiers';
  RAISE NOTICE '   - Portfolio & case studies';
  RAISE NOTICE '   - Client testimonials';
  RAISE NOTICE '   - Inquiry management';
  RAISE NOTICE '   - Review system';
  RAISE NOTICE '   - SEO optimization';
  RAISE NOTICE '   - Booking & availability';
  RAISE NOTICE '📝 Next: Create seed data with your services';
END $$;
