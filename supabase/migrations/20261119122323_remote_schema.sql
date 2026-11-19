SET local check_function_bodies = off;

CREATE TABLE "public"."about_highlights" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "group_key"     text                     NOT NULL,
  "title"         text                     NOT NULL,
  "description"   text                     NOT NULL,
  "icon"          text,
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  "is_visible"    boolean                  DEFAULT true,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "about_highlights_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."about_highlights"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."about_page" (
  "id"                  uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"       uuid                     NOT NULL,
  "hero_eyebrow"        text,
  "hero_title"          text                     NOT NULL,
  "hero_subtitle"       text,
  "intro"               text,
  "mission"             text,
  "cta_primary_label"   text                     DEFAULT 'View My Work'::text,
  "cta_primary_href"    text                     DEFAULT '/projects'::text,
  "cta_secondary_label" text                     DEFAULT 'Contact Me'::text,
  "cta_secondary_href"  text                     DEFAULT '/contact'::text,
  "is_published"        boolean                  DEFAULT true,
  "updated_at"          timestamp with time zone DEFAULT now(),
  CONSTRAINT "about_page_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."about_page"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."about_quotes" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "quote"         text                     NOT NULL,
  "caption"       text,
  "theme"         text                     DEFAULT 'dark'::text,
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  "is_visible"    boolean                  DEFAULT true,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "about_quotes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."about_quotes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."about_sections" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "title"         text,
  "subtitle"      text,
  "content"       text                     NOT NULL,
  "kind"          text                     DEFAULT 'story'::text,
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  "is_visible"    boolean                  DEFAULT true,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "about_sections_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."about_sections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."about_timeline" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "country"       text                     NOT NULL,
  "city"          text,
  "title"         text                     NOT NULL,
  "period"        text,
  "description"   text                     NOT NULL,
  "icon"          text,
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  "is_visible"    boolean                  DEFAULT true,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "about_timeline_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."about_timeline"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."blog_categories" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "description" text,
  "icon"        text,
  "color"       text,
  "post_count"  integer                  DEFAULT 0,
  "created_at"  timestamp with time zone DEFAULT now(),
  CONSTRAINT "blog_categories_name_key" UNIQUE (name),
  CONSTRAINT "blog_categories_pkey" PRIMARY KEY (id),
  CONSTRAINT "blog_categories_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."blog_categories"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."blog_comments" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "post_id"           uuid                     NOT NULL,
  "user_id"           uuid,
  "author_name"       text                     NOT NULL,
  "author_email"      text,
  "content"           text                     NOT NULL,
  "parent_comment_id" uuid,
  "is_approved"       boolean                  DEFAULT false,
  "likes_count"       integer                  DEFAULT 0,
  "created_at"        timestamp with time zone DEFAULT now(),
  "updated_at"        timestamp with time zone DEFAULT now(),
  CONSTRAINT "blog_comments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."blog_comments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."blog_post_views" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "post_id"        uuid                     NOT NULL,
  "user_id"        uuid,
  "viewer_ip"      text,
  "viewer_country" text,
  "viewer_device"  text,
  "referrer_url"   text,
  "viewed_at"      timestamp with time zone DEFAULT now(),
  CONSTRAINT "blog_post_views_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."blog_post_views"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."blog_posts" (
  "id"                   uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "author_user_id"       uuid                     NOT NULL,
  "author_name"          text,
  "author_avatar_url"    text,
  "author_bio"           text,
  "title"                text                     NOT NULL,
  "slug"                 text                     NOT NULL,
  "excerpt"              text,
  "content"              text                     NOT NULL,
  "content_format"       text                     DEFAULT 'markdown'::text,
  "featured_image_url"   text,
  "featured_video_url"   text,
  "image_urls"           text[],
  "video_urls"           text[],
  "category"             text                     NOT NULL DEFAULT 'General'::text,
  "subcategory"          text,
  "tags"                 text[],
  "reading_time_minutes" integer                  DEFAULT 5,
  "views_count"          integer                  DEFAULT 0,
  "likes_count"          integer                  DEFAULT 0,
  "comments_count"       integer                  DEFAULT 0,
  "shares_count"         integer                  DEFAULT 0,
  "meta_title"           text,
  "meta_description"     text,
  "meta_keywords"        text[],
  "og_image_url"         text,
  "canonical_url"        text,
  "is_published"         boolean                  DEFAULT false,
  "is_featured"          boolean                  DEFAULT false,
  "is_pinned"            boolean                  DEFAULT false,
  "publish_date"         timestamp with time zone,
  "last_updated"         timestamp with time zone DEFAULT now(),
  "table_of_contents"    jsonb,
  "related_post_ids"     uuid[],
  "code_language"        text,
  "github_repo_url"      text,
  "demo_url"             text,
  "series_name"          text,
  "series_order"         integer,
  "allow_comments"       boolean                  DEFAULT true,
  "allow_likes"          boolean                  DEFAULT true,
  "cta_text"             text,
  "cta_url"              text,
  "created_at"           timestamp with time zone DEFAULT now(),
  "updated_at"           timestamp with time zone DEFAULT now(),
  CONSTRAINT "blog_posts_content_format_check" CHECK ((content_format = ANY (ARRAY['markdown'::text, 'html'::text]))),
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY (id),
  CONSTRAINT "blog_posts_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."blog_posts"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."certificates" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid    NOT NULL,
  "name"          text    NOT NULL,
  "issuer"        text,
  "year"          integer,
  "url"           text,
  CONSTRAINT "certificates_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."certificates"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."contact_inquiries" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"      uuid,
  "name"         text                     NOT NULL,
  "email"        text                     NOT NULL,
  "phone"        text,
  "subject"      text                     NOT NULL,
  "message"      text                     NOT NULL,
  "inquiry_type" text                     DEFAULT 'general'::text,
  "status"       text                     DEFAULT 'new'::text,
  "admin_notes"  text,
  "created_at"   timestamp with time zone DEFAULT now(),
  "responded_at" timestamp with time zone,
  "user_agent"   text,
  "ip_address"   text,
  CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."contact_inquiries"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."courses" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"     uuid                     NOT NULL,
  "title"             text                     NOT NULL,
  "slug"              text                     NOT NULL,
  "short_description" text,
  "description"       text                     NOT NULL,
  "thumbnail_url"     text,
  "instructor_name"   text                     NOT NULL,
  "platform"          text                     NOT NULL,
  "affiliate_link"    text                     NOT NULL,
  "original_price"    numeric(10,2),
  "discounted_price"  numeric(10,2),
  "currency"          text                     DEFAULT 'USD'::text,
  "duration_hours"    numeric(5,1),
  "level"             text                     DEFAULT 'Beginner'::text,
  "category"          text                     NOT NULL,
  "language"          text                     DEFAULT 'English'::text,
  "rating"            numeric(3,2),
  "students_count"    integer                  DEFAULT 0,
  "what_you_learn"    text[],
  "requirements"      text[],
  "tags"              text[],
  "is_featured"       boolean                  DEFAULT false,
  "is_published"      boolean                  DEFAULT true,
  "sort_order"        integer                  DEFAULT 0,
  "created_at"        timestamp with time zone DEFAULT now(),
  "updated_at"        timestamp with time zone DEFAULT now(),
  "promo_video_url"   text,
  "gallery_images"    text[],
  "lesson_videos"     text[],
  CONSTRAINT "courses_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."courses"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."education" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "school"        text                     NOT NULL,
  "program"       text,
  "location"      text,
  "start_date"    date,
  "end_date"      date,
  "notes"         text,
  "created_at"    timestamp with time zone DEFAULT now(),
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  CONSTRAINT "education_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."education"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."experiences" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "company"       text                     NOT NULL,
  "title"         text                     NOT NULL,
  "location"      text,
  "start_date"    date,
  "end_date"      date,
  "is_current"    boolean                  DEFAULT false,
  "highlights"    text[]                   DEFAULT '{}'::text[],
  "created_at"    timestamp with time zone DEFAULT now(),
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  CONSTRAINT "experiences_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."experiences"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."journey_content" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"         uuid                     NOT NULL,
  "hero_title"            text                     NOT NULL DEFAULT 'My Journey'::text,
  "hero_subtitle"         text,
  "hero_background_image" text,
  "hero_background_video" text,
  "story_sections"        jsonb                    DEFAULT '[]'::jsonb,
  "milestones"            jsonb                    DEFAULT '[]'::jsonb,
  "skills_journey"        jsonb                    DEFAULT '[]'::jsonb,
  "photo_gallery"         jsonb                    DEFAULT '[]'::jsonb,
  "video_gallery"         jsonb                    DEFAULT '[]'::jsonb,
  "testimonials"          jsonb                    DEFAULT '[]'::jsonb,
  "core_values"           jsonb                    DEFAULT '[]'::jsonb,
  "philosophy_statement"  text,
  "fun_facts"             jsonb                    DEFAULT '[]'::jsonb,
  "social_impact"         jsonb                    DEFAULT '{}'::jsonb,
  "cta_title"             text,
  "cta_description"       text,
  "cta_button_text"       text,
  "cta_button_link"       text,
  "published"             boolean                  DEFAULT false,
  "show_timeline"         boolean                  DEFAULT true,
  "show_gallery"          boolean                  DEFAULT true,
  "show_testimonials"     boolean                  DEFAULT true,
  "show_stats"            boolean                  DEFAULT true,
  "meta_title"            text,
  "meta_description"      text,
  "created_at"            timestamp with time zone DEFAULT now(),
  "updated_at"            timestamp with time zone DEFAULT now(),
  CONSTRAINT "journey_content_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."journey_content"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."languages" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid    NOT NULL,
  "name"          text    NOT NULL,
  "level"         text,
  "sort_order"    integer NOT NULL DEFAULT 0,
  CONSTRAINT "languages_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."languages"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."portfolio_sections" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid    NOT NULL,
  "key"           text    NOT NULL,
  "title"         text,
  "enabled"       boolean DEFAULT true,
  "sort_order"    integer NOT NULL DEFAULT 0,
  CONSTRAINT "portfolio_sections_owner_user_id_key_key" UNIQUE (owner_user_id, key),
  CONSTRAINT "portfolio_sections_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."portfolio_sections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profile_stats" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid    NOT NULL,
  "label"         text    NOT NULL,
  "value"         text    NOT NULL,
  "sort_order"    integer NOT NULL DEFAULT 0,
  CONSTRAINT "profile_stats_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profile_stats"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"         uuid                     NOT NULL,
  "full_name"             text                     NOT NULL,
  "headline"              text,
  "location"              text,
  "email"                 text,
  "phone"                 text,
  "bio"                   text,
  "role_tags"             text[]                   DEFAULT '{}'::text[],
  "avatar_url"            text,
  "cv_url"                text,
  "socials"               jsonb                    DEFAULT '{}'::jsonb,
  "updated_at"            timestamp with time zone DEFAULT now(),
  "public_slug"           text,
  "portfolio_title"       text,
  "hero_video_url"        text,
  "hero_background_image" text,
  "story_title"           text                     DEFAULT 'My Journey'::text,
  "story_subtitle"        text,
  "featured_quote"        text,
  "featured_quote_author" text,
  "gallery_images"        text[]                   DEFAULT '{}'::text[],
  "gallery_videos"        text[]                   DEFAULT '{}'::text[],
  "achievements"          jsonb                    DEFAULT '[]'::jsonb,
  "milestones"            jsonb                    DEFAULT '[]'::jsonb,
  "fun_facts"             jsonb                    DEFAULT '[]'::jsonb,
  "testimonials"          jsonb                    DEFAULT '[]'::jsonb,
  "story_sections"        jsonb                    DEFAULT '[]'::jsonb,
  "call_to_action"        jsonb                    DEFAULT
    '{"primary": {"link": "/contact", "text": "Let''s Work Together"}, "secondary": {"link": "/projects", "text": "View Projects"}}'::jsonb,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_public_slug_key" UNIQUE (public_slug)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."project_links" (
  "id"         uuid NOT NULL DEFAULT gen_random_uuid(),
  "project_id" uuid NOT NULL,
  "label"      text NOT NULL,
  "url"        text NOT NULL,
  CONSTRAINT "project_links_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."project_links"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."project_media" (
  "id"         uuid    NOT NULL DEFAULT gen_random_uuid(),
  "project_id" uuid    NOT NULL,
  "url"        text    NOT NULL,
  "alt"        text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "kind"       text    DEFAULT 'gallery'::text,
  CONSTRAINT "project_media_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."project_media"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."projects" (
  "id"                      uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"           uuid                     NOT NULL,
  "title"                   text                     NOT NULL,
  "summary"                 text,
  "description"             text,
  "tech_stack"              text[]                   DEFAULT '{}'::text[],
  "featured"                boolean                  DEFAULT false,
  "sort_order"              integer                  NOT NULL DEFAULT 0,
  "created_at"              timestamp with time zone DEFAULT now(),
  "project_type"            text,
  "status"                  text,
  "year"                    integer,
  "thumbnail_url"           text,
  "featured_image_url"      text,
  "gallery_images"          text[],
  "demo_video_url"          text,
  "hero_video_url"          text,
  "slug"                    text,
  "tagline"                 text,
  "category"                text                     DEFAULT 'Web Development'::text,
  "subcategory"             text,
  "client_name"             text,
  "client_logo_url"         text,
  "client_website_url"      text,
  "client_industry"         text,
  "live_url"                text,
  "github_url"              text,
  "case_study_url"          text,
  "figma_url"               text,
  "behance_url"             text,
  "dribbble_url"            text,
  "duration_months"         integer,
  "start_date"              date,
  "end_date"                date,
  "team_size"               integer,
  "budget_range"            text,
  "views_count"             integer                  DEFAULT 0,
  "likes_count"             integer                  DEFAULT 0,
  "shares_count"            integer                  DEFAULT 0,
  "primary_language"        text,
  "frameworks"              text[],
  "tools"                   text[],
  "platforms"               text[],
  "apis_used"               text[],
  "key_features"            text[],
  "challenges"              text[],
  "solutions"               text[],
  "learnings"               text[],
  "highlights"              text[],
  "results_metrics"         jsonb,
  "testimonial"             text,
  "testimonial_author"      text,
  "testimonial_position"    text,
  "testimonial_avatar_url"  text,
  "awards"                  text[],
  "press_coverage"          text[],
  "featured_in"             text[],
  "meta_title"              text,
  "meta_description"        text,
  "meta_keywords"           text[],
  "og_image_url"            text,
  "tags"                    text[],
  "complexity_level"        text                     DEFAULT 'Medium'::text,
  "project_role"            text,
  "contribution_percentage" integer,
  "is_published"            boolean                  DEFAULT true,
  "is_highlighted"          boolean                  DEFAULT false,
  "is_award_winning"        boolean                  DEFAULT false,
  "is_open_source"          boolean                  DEFAULT false,
  "show_in_portfolio"       boolean                  DEFAULT true,
  "display_priority"        integer                  DEFAULT 0,
  "published_at"            timestamp with time zone,
  "updated_at"              timestamp with time zone DEFAULT now(),
  CONSTRAINT "projects_pkey" PRIMARY KEY (id),
  CONSTRAINT "projects_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."projects"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."public_users" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "auth_user_id"   uuid                     NOT NULL,
  "email"          text                     NOT NULL,
  "full_name"      text,
  "phone"          text,
  "avatar_url"     text,
  "user_role"      text                     NOT NULL DEFAULT 'customer'::text,
  "is_active"      boolean                  DEFAULT true,
  "email_verified" boolean                  DEFAULT false,
  "created_at"     timestamp with time zone DEFAULT now(),
  "updated_at"     timestamp with time zone DEFAULT now(),
  "last_login_at"  timestamp with time zone,
  "preferences"    jsonb                    DEFAULT '{"newsletter": false, "notifications": true, "marketing_emails": false}'::jsonb,
  CONSTRAINT "public_users_auth_user_id_key" UNIQUE (auth_user_id),
  CONSTRAINT "public_users_email_key" UNIQUE (email),
  CONSTRAINT "public_users_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."public_users"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."sections" (
  "id"            uuid    NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid    NOT NULL,
  "key"           text    NOT NULL,
  "title"         text,
  "subtitle"      text,
  "sort_order"    integer NOT NULL DEFAULT 0,
  "enabled"       boolean DEFAULT true,
  CONSTRAINT "sections_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."sections"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."service_inquiries" (
  "id"                        uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "service_id"                uuid                     NOT NULL,
  "name"                      text                     NOT NULL,
  "email"                     text                     NOT NULL,
  "phone"                     text,
  "company"                   text,
  "website"                   text,
  "subject"                   text,
  "message"                   text                     NOT NULL,
  "budget_range"              text,
  "timeline"                  text,
  "project_description"       text,
  "specific_requirements"     text[],
  "preferred_start_date"      date,
  "urgency"                   text,
  "status"                    text                     DEFAULT 'new'::text,
  "priority"                  text                     DEFAULT 'medium'::text,
  "assigned_to"               uuid,
  "notes"                     text,
  "follow_up_date"            date,
  "consultation_scheduled_at" timestamp with time zone,
  "source"                    text,
  "utm_source"                text,
  "utm_medium"                text,
  "utm_campaign"              text,
  "referrer_url"              text,
  "created_at"                timestamp with time zone DEFAULT now(),
  "updated_at"                timestamp with time zone DEFAULT now(),
  "responded_at"              timestamp with time zone,
  CONSTRAINT "service_inquiries_pkey" PRIMARY KEY (id),
  CONSTRAINT "service_inquiries_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))),
  CONSTRAINT "service_inquiries_status_check"
    CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'proposal_sent'::text, 'negotiating'::text, 'accepted'::text, 'declined'::text, 'spam'::text]))),
  CONSTRAINT "service_inquiries_urgency_check" CHECK ((urgency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text])))
);

ALTER TABLE "public"."service_inquiries"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."service_requests" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"        uuid                     NOT NULL,
  "service_type"   text                     NOT NULL,
  "project_title"  text                     NOT NULL,
  "description"    text                     NOT NULL,
  "budget_range"   text,
  "timeline"       text,
  "status"         text                     DEFAULT 'pending'::text,
  "admin_response" text,
  "attachments"    jsonb                    DEFAULT '[]'::jsonb,
  "created_at"     timestamp with time zone DEFAULT now(),
  "updated_at"     timestamp with time zone DEFAULT now(),
  CONSTRAINT "service_requests_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."service_requests"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."service_reviews" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "service_id"            uuid                     NOT NULL,
  "reviewer_name"         text                     NOT NULL,
  "reviewer_company"      text,
  "reviewer_position"     text,
  "reviewer_avatar_url"   text,
  "reviewer_linkedin_url" text,
  "rating"                integer                  NOT NULL,
  "title"                 text,
  "review_text"           text                     NOT NULL,
  "project_type"          text,
  "project_duration"      text,
  "project_budget_range"  text,
  "completion_date"       date,
  "communication_rating"  integer,
  "quality_rating"        integer,
  "timeline_rating"       integer,
  "value_rating"          integer,
  "pros"                  text[],
  "cons"                  text[],
  "would_recommend"       boolean                  DEFAULT true,
  "would_hire_again"      boolean                  DEFAULT true,
  "is_verified"           boolean                  DEFAULT false,
  "verification_method"   text,
  "is_featured"           boolean                  DEFAULT false,
  "is_approved"           boolean                  DEFAULT false,
  "display_on_homepage"   boolean                  DEFAULT false,
  "admin_response"        text,
  "responded_at"          timestamp with time zone,
  "created_at"            timestamp with time zone DEFAULT now(),
  "updated_at"            timestamp with time zone DEFAULT now(),
  CONSTRAINT "service_reviews_communication_rating_check" CHECK (((communication_rating >= 1) AND (communication_rating <= 5))),
  CONSTRAINT "service_reviews_pkey" PRIMARY KEY (id),
  CONSTRAINT "service_reviews_quality_rating_check" CHECK (((quality_rating >= 1) AND (quality_rating <= 5))),
  CONSTRAINT "service_reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))),
  CONSTRAINT "service_reviews_timeline_rating_check" CHECK (((timeline_rating >= 1) AND (timeline_rating <= 5))),
  CONSTRAINT "service_reviews_value_rating_check" CHECK (((value_rating >= 1) AND (value_rating <= 5)))
);

ALTER TABLE "public"."service_reviews"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."services" (
  "id"                     uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"                   text                     NOT NULL,
  "slug"                   text                     NOT NULL,
  "tagline"                text,
  "description"            text                     NOT NULL,
  "full_description"       text,
  "icon"                   text,
  "color"                  text                     DEFAULT '#3B82F6'::text,
  "featured_image_url"     text,
  "gallery_images"         text[],
  "category"               text                     NOT NULL,
  "subcategories"          text[],
  "service_type"           text                     DEFAULT 'project'::text,
  "base_price"             numeric(10,2),
  "price_currency"         text                     DEFAULT 'USD'::text,
  "price_unit"             text,
  "pricing_tiers"          jsonb,
  "is_price_negotiable"    boolean                  DEFAULT true,
  "estimated_duration"     text,
  "duration_unit"          text,
  "min_duration"           integer,
  "max_duration"           integer,
  "is_available"           boolean                  DEFAULT true,
  "availability_status"    text                     DEFAULT 'available'::text,
  "key_features"           text[]                   NOT NULL,
  "deliverables"           text[],
  "included_services"      text[],
  "excluded_services"      text[],
  "requirements"           text[],
  "technologies"           text[],
  "tools"                  text[],
  "methodologies"          text[],
  "languages"              text[],
  "process_steps"          jsonb,
  "timeline_breakdown"     jsonb,
  "revision_count"         integer                  DEFAULT 2,
  "support_duration"       text,
  "portfolio_project_ids"  uuid[],
  "case_study_urls"        text[],
  "demo_url"               text,
  "github_repo_url"        text,
  "sample_work_urls"       text[],
  "success_metrics"        jsonb,
  "typical_results"        text[],
  "client_testimonials"    jsonb,
  "success_stories"        text[],
  "consultation_required"  boolean                  DEFAULT true,
  "consultation_duration"  integer,
  "onboarding_process"     text,
  "communication_channels" text[],
  "meeting_frequency"      text,
  "faqs"                   jsonb,
  "common_questions"       text[],
  "documentation_url"      text,
  "support_email"          text,
  "support_hours"          text,
  "booking_url"            text,
  "calendar_url"           text,
  "lead_time_days"         integer                  DEFAULT 7,
  "max_concurrent_clients" integer                  DEFAULT 3,
  "current_clients"        integer                  DEFAULT 0,
  "waitlist_available"     boolean                  DEFAULT false,
  "contract_template_url"  text,
  "terms_conditions"       text,
  "cancellation_policy"    text,
  "refund_policy"          text,
  "payment_terms"          text,
  "payment_methods"        text[],
  "meta_title"             text,
  "meta_description"       text,
  "meta_keywords"          text[],
  "og_image_url"           text,
  "cta_primary_text"       text                     DEFAULT 'Get Started'::text,
  "cta_primary_url"        text,
  "cta_secondary_text"     text                     DEFAULT 'Schedule Consultation'::text,
  "cta_secondary_url"      text,
  "views_count"            integer                  DEFAULT 0,
  "inquiries_count"        integer                  DEFAULT 0,
  "bookings_count"         integer                  DEFAULT 0,
  "completion_rate"        numeric(5,2)             DEFAULT 100.00,
  "avg_rating"             numeric(3,2),
  "total_reviews"          integer                  DEFAULT 0,
  "is_featured"            boolean                  DEFAULT false,
  "is_popular"             boolean                  DEFAULT false,
  "is_new"                 boolean                  DEFAULT false,
  "display_order"          integer                  DEFAULT 0,
  "is_active"              boolean                  DEFAULT true,
  "is_accepting_clients"   boolean                  DEFAULT true,
  "created_at"             timestamp with time zone DEFAULT now(),
  "updated_at"             timestamp with time zone DEFAULT now(),
  CONSTRAINT "services_availability_status_check" CHECK ((availability_status = ANY (ARRAY['available'::text, 'limited'::text, 'booked'::text, 'unavailable'::text]))),
  CONSTRAINT "services_pkey" PRIMARY KEY (id),
  CONSTRAINT "services_service_type_check" CHECK ((service_type = ANY (ARRAY['project'::text, 'hourly'::text, 'retainer'::text, 'package'::text]))),
  CONSTRAINT "services_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."services"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."shop_products" (
  "id"                   uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id"        uuid                     NOT NULL,
  "title"                text                     NOT NULL,
  "slug"                 text                     NOT NULL,
  "short_description"    text,
  "description"          text                     NOT NULL,
  "product_type"         text                     NOT NULL,
  "category"             text                     NOT NULL,
  "subcategory"          text,
  "thumbnail_url"        text                     NOT NULL,
  "image_urls"           text[],
  "original_price"       numeric(10,2)            NOT NULL,
  "discounted_price"     numeric(10,2),
  "currency"             text                     DEFAULT 'USD'::text,
  "discount_percentage"  integer,
  "affiliate_link"       text,
  "external_product_url" text,
  "demo_url"             text,
  "download_url"         text,
  "file_size"            text,
  "file_format"          text,
  "version"              text,
  "sku"                  text,
  "stock_quantity"       integer                  DEFAULT 0,
  "is_in_stock"          boolean                  DEFAULT true,
  "shipping_required"    boolean                  DEFAULT false,
  "weight_kg"            numeric(8,2),
  "features"             text[],
  "specifications"       jsonb,
  "tech_stack"           text[],
  "compatibility"        text[],
  "requirements"         text[],
  "included_items"       text[],
  "documentation_url"    text,
  "support_url"          text,
  "meta_title"           text,
  "meta_description"     text,
  "tags"                 text[],
  "rating"               numeric(3,2)             DEFAULT 0,
  "reviews_count"        integer                  DEFAULT 0,
  "purchases_count"      integer                  DEFAULT 0,
  "views_count"          integer                  DEFAULT 0,
  "is_featured"          boolean                  DEFAULT false,
  "is_published"         boolean                  DEFAULT false,
  "is_bestseller"        boolean                  DEFAULT false,
  "is_new"               boolean                  DEFAULT false,
  "sort_order"           integer                  DEFAULT 0,
  "license_type"         text,
  "usage_rights"         text,
  "created_at"           timestamp with time zone DEFAULT now(),
  "updated_at"           timestamp with time zone DEFAULT now(),
  "published_at"         timestamp with time zone,
  CONSTRAINT "shop_products_category_check" CHECK ((category = ANY (ARRAY['Template'::text, 'Component'::text, 'Tool'::text, 'Other'::text]))),
  CONSTRAINT "shop_products_pkey" PRIMARY KEY (id),
  CONSTRAINT "shop_products_product_type_check" CHECK ((product_type = ANY (ARRAY['physical'::text, 'digital'::text, 'affiliate'::text]))),
  CONSTRAINT "shop_products_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."shop_products"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."skills" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "owner_user_id" uuid                     NOT NULL,
  "category"      text                     NOT NULL,
  "name"          text                     NOT NULL,
  "level"         integer                  NOT NULL DEFAULT 3,
  "sort_order"    integer                  NOT NULL DEFAULT 0,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "skills_level_check" CHECK (((level >= 1) AND (level <= 5))),
  CONSTRAINT "skills_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."skills"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."user_activity_log" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"       uuid,
  "activity_type" text                     NOT NULL,
  "activity_data" jsonb                    DEFAULT '{}'::jsonb,
  "page_url"      text,
  "user_agent"    text,
  "ip_address"    text,
  "created_at"    timestamp with time zone DEFAULT now(),
  CONSTRAINT "user_activity_log_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."user_activity_log"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."user_addresses" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"        uuid                     NOT NULL,
  "address_type"   text                     NOT NULL,
  "is_default"     boolean                  DEFAULT false,
  "street_address" text                     NOT NULL,
  "city"           text                     NOT NULL,
  "state"          text,
  "postal_code"    text                     NOT NULL,
  "country"        text                     NOT NULL DEFAULT 'USA'::text,
  "created_at"     timestamp with time zone DEFAULT now(),
  "updated_at"     timestamp with time zone DEFAULT now(),
  CONSTRAINT "user_addresses_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."user_addresses"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.generate_project_slug()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    
    -- Ensure uniqueness by appending timestamp if needed
    WHILE EXISTS (SELECT 1 FROM projects WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch from now())::text;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_user()
  RETURNS SETOF public.public_users
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  return query
  select * from public_users
  where auth_user_id = auth.uid();
end;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_type()
  RETURNS text
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $function$
begin
  if exists (select 1 from public.profiles where owner_user_id = auth.uid()) then
    return 'admin';
  elsif exists (select 1 from public.public_users where auth_user_id = auth.uid()) then
    return 'public_user';
  else
    return 'unknown';
  end if;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.is_admin (
  user_id uuid
)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  return exists (
    select 1 from profiles
    where owner_user_id = user_id
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
  RETURNS boolean
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $function$
begin
  return exists (
    select 1 from public.profiles
    where owner_user_id = auth.uid()
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_public_user()
  RETURNS boolean
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  AS $function$
begin
  return exists (
    select 1 from public.public_users
    where auth_user_id = auth.uid()
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_journey_content_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_services_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_last_login()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  update public.public_users
  set last_login_at = now()
  where auth_user_id = new.id;
  return new;
end;
$function$;

ALTER TABLE "public"."blog_comments"
  ADD CONSTRAINT "blog_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public.blog_comments(id) ON DELETE CASCADE;

ALTER TABLE "public"."blog_comments"
  ADD CONSTRAINT "blog_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."blog_post_views"
  ADD CONSTRAINT "blog_post_views_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."blog_posts"
  ADD CONSTRAINT "blog_posts_author_user_id_fkey" FOREIGN KEY (author_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."blog_comments"
  ADD CONSTRAINT "blog_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."blog_post_views"
  ADD CONSTRAINT "blog_post_views_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.blog_posts(id) ON DELETE CASCADE;

ALTER TABLE "public"."journey_content"
  ADD CONSTRAINT "journey_content_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_public_slug_unique" UNIQUE (public_slug);

ALTER TABLE "public"."project_links"
  ADD CONSTRAINT "project_links_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE "public"."project_media"
  ADD CONSTRAINT "project_media_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

ALTER TABLE "public"."contact_inquiries"
  ADD CONSTRAINT "contact_inquiries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE SET NULL;

ALTER TABLE "public"."service_inquiries"
  ADD CONSTRAINT "service_inquiries_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."service_requests"
  ADD CONSTRAINT "service_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE;

ALTER TABLE "public"."service_inquiries"
  ADD CONSTRAINT "service_inquiries_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE "public"."service_reviews"
  ADD CONSTRAINT "service_reviews_service_id_fkey" FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE "public"."shop_products"
  ADD CONSTRAINT "shop_products_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."user_activity_log"
  ADD CONSTRAINT "user_activity_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE SET NULL;

ALTER TABLE "public"."user_addresses"
  ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.public_users(id) ON DELETE CASCADE;

CREATE VIEW "public"."admin_pending_service_requests" WITH (security_invoker=on) AS  SELECT sr.id,
    sr.user_id,
    sr.service_type,
    sr.project_title,
    sr.description,
    sr.budget_range,
    sr.timeline,
    sr.status,
    sr.admin_response,
    sr.attachments,
    sr.created_at,
    sr.updated_at,
    pu.full_name,
    pu.email,
    pu.phone
   FROM (public.service_requests sr
     JOIN public.public_users pu ON ((sr.user_id = pu.id)))
  WHERE (sr.status = 'pending'::text)
  ORDER BY sr.created_at DESC;

CREATE VIEW "public"."admin_recent_inquiries" WITH (security_invoker=on) AS  SELECT ci.id,
    ci.user_id,
    ci.name,
    ci.email,
    ci.phone,
    ci.subject,
    ci.message,
    ci.inquiry_type,
    ci.status,
    ci.admin_notes,
    ci.created_at,
    ci.responded_at,
    ci.user_agent,
    ci.ip_address,
    pu.full_name AS user_full_name,
    pu.email AS user_email
   FROM (public.contact_inquiries ci
     LEFT JOIN public.public_users pu ON ((ci.user_id = pu.id)))
  ORDER BY ci.created_at DESC
 LIMIT 50;

CREATE VIEW "public"."admin_user_stats" WITH (security_invoker=on) AS  SELECT count(*) AS total_users,
    count(*) FILTER (WHERE (is_active = true)) AS active_users,
    count(*) FILTER (WHERE (email_verified = true)) AS verified_users,
    count(*) FILTER (WHERE (created_at > (now() - '30 days'::interval))) AS new_users_30d,
    count(*) FILTER (WHERE (last_login_at > (now() - '7 days'::interval))) AS active_users_7d
   FROM public.public_users;

CREATE INDEX idx_about_highlights_owner ON public.about_highlights USING btree (owner_user_id);

CREATE INDEX idx_about_quotes_owner ON public.about_quotes USING btree (owner_user_id);

CREATE INDEX idx_about_sections_owner ON public.about_sections USING btree (owner_user_id);

CREATE INDEX idx_about_timeline_owner ON public.about_timeline USING btree (owner_user_id);

CREATE INDEX idx_blog_comments_approved ON public.blog_comments USING btree (is_approved, created_at DESC);

CREATE INDEX idx_blog_comments_post ON public.blog_comments USING btree (post_id, created_at DESC);

CREATE INDEX idx_blog_comments_user ON public.blog_comments USING btree (user_id);

CREATE INDEX idx_blog_posts_author ON public.blog_posts USING btree (author_user_id);

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category)
  WHERE (is_published = true);

CREATE INDEX idx_blog_posts_featured ON public.blog_posts USING btree (is_featured, publish_date DESC)
  WHERE (is_published = true);

CREATE INDEX idx_blog_posts_published ON public.blog_posts USING btree (is_published, publish_date DESC);

CREATE INDEX idx_blog_posts_search ON public.blog_posts USING gin (to_tsvector('english'::regconfig, ((((title || ' '::text) || excerpt) || ' '::text) || content)));

CREATE INDEX idx_blog_posts_series ON public.blog_posts USING btree (series_name, series_order)
  WHERE (series_name IS NOT NULL);

CREATE INDEX idx_blog_views_date ON public.blog_post_views USING btree (viewed_at DESC);

CREATE INDEX idx_blog_views_post ON public.blog_post_views USING btree (post_id, viewed_at DESC);

CREATE INDEX idx_blog_views_user ON public.blog_post_views USING btree (user_id);

CREATE INDEX idx_cert_owner ON public.certificates USING btree (owner_user_id);

CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries USING btree (status);

CREATE INDEX idx_contact_inquiries_user ON public.contact_inquiries USING btree (user_id);

CREATE INDEX idx_courses_category ON public.courses USING btree (category);

CREATE INDEX idx_courses_featured ON public.courses USING btree (is_featured);

CREATE INDEX idx_courses_owner ON public.courses USING btree (owner_user_id);

CREATE INDEX idx_courses_platform ON public.courses USING btree (platform);

CREATE INDEX idx_edu_owner ON public.education USING btree (owner_user_id);

CREATE INDEX idx_exp_owner ON public.experiences USING btree (owner_user_id);

CREATE INDEX idx_inquiries_email ON public.service_inquiries USING btree (email);

CREATE INDEX idx_inquiries_service ON public.service_inquiries USING btree (service_id, created_at DESC);

CREATE INDEX idx_inquiries_status ON public.service_inquiries USING btree (status, created_at DESC);

CREATE INDEX idx_journey_content_owner ON public.journey_content USING btree (owner_user_id);

CREATE INDEX idx_journey_content_published ON public.journey_content USING btree (published);

CREATE INDEX idx_lang_owner ON public.languages USING btree (owner_user_id);

CREATE INDEX idx_profiles_owner ON public.profiles USING btree (owner_user_id);

CREATE INDEX idx_profiles_public_slug ON public.profiles USING btree (public_slug);

CREATE INDEX idx_project_links_project ON public.project_links USING btree (project_id);

CREATE INDEX idx_project_media_project ON public.project_media USING btree (project_id);

CREATE INDEX idx_projects_category ON public.projects USING btree (category);

CREATE INDEX idx_projects_display_order ON public.projects USING btree (display_priority DESC, sort_order);

CREATE INDEX idx_projects_featured_published ON public.projects USING btree (featured, is_published);

CREATE INDEX idx_projects_owner ON public.projects USING btree (owner_user_id);

CREATE INDEX idx_projects_search ON public.projects
  USING gin (to_tsvector('english'::regconfig, ((((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text)) || ' '::text) || COALESCE(tagline, ''::text))));

CREATE INDEX idx_projects_slug ON public.projects USING btree (slug);

CREATE INDEX idx_public_users_auth ON public.public_users USING btree (auth_user_id);

CREATE INDEX idx_public_users_email ON public.public_users USING btree (email);

CREATE INDEX idx_public_users_role ON public.public_users USING btree (user_role);

CREATE INDEX idx_reviews_featured ON public.service_reviews USING btree (is_featured)
  WHERE (is_approved = true);

CREATE INDEX idx_reviews_rating ON public.service_reviews USING btree (rating DESC)
  WHERE (is_approved = true);

CREATE INDEX idx_reviews_service ON public.service_reviews USING btree (service_id, created_at DESC);

CREATE INDEX idx_service_requests_status ON public.service_requests USING btree (status);

CREATE INDEX idx_service_requests_user ON public.service_requests USING btree (user_id);

CREATE INDEX idx_services_available ON public.services USING btree (is_available, availability_status)
  WHERE (is_active = true);

CREATE INDEX idx_services_category ON public.services USING btree (category)
  WHERE (is_active = true);

CREATE INDEX idx_services_featured ON public.services USING btree (is_featured, display_order)
  WHERE (is_active = true);

CREATE INDEX idx_services_popular ON public.services USING btree (is_popular)
  WHERE (is_active = true);

CREATE INDEX idx_services_search ON public.services USING gin (to_tsvector('english'::regconfig, ((name || ' '::text) || description)));

CREATE INDEX idx_shop_products_bestseller ON public.shop_products USING btree (is_bestseller)
  WHERE (is_bestseller = true);

CREATE INDEX idx_shop_products_category ON public.shop_products USING btree (category);

CREATE INDEX idx_shop_products_featured ON public.shop_products USING btree (is_featured)
  WHERE (is_featured = true);

CREATE INDEX idx_shop_products_owner ON public.shop_products USING btree (owner_user_id);

CREATE INDEX idx_shop_products_published ON public.shop_products USING btree (is_published)
  WHERE (is_published = true);

CREATE INDEX idx_shop_products_sort ON public.shop_products USING btree (sort_order);

CREATE INDEX idx_shop_products_type ON public.shop_products USING btree (product_type);

CREATE INDEX idx_skills_owner ON public.skills USING btree (owner_user_id);

CREATE INDEX idx_user_activity_user ON public.user_activity_log USING btree (user_id);

CREATE INDEX idx_user_addresses_user ON public.user_addresses USING btree (user_id);

CREATE UNIQUE INDEX ux_about_page_owner ON public.about_page USING btree (owner_user_id);

CREATE UNIQUE INDEX ux_blog_posts_slug ON public.blog_posts USING btree (slug);

CREATE UNIQUE INDEX ux_courses_slug ON public.courses USING btree (slug);

CREATE UNIQUE INDEX ux_services_slug ON public.services USING btree (slug);

CREATE UNIQUE INDEX ux_shop_products_slug ON public.shop_products USING btree (slug);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();

CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN ((old.last_sign_in_at IS DISTINCT FROM new.last_sign_in_at))
  EXECUTE FUNCTION public.update_user_last_login();

CREATE TRIGGER trg_about_page_updated_at
  BEFORE UPDATE ON public.about_page
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_posts_updated_at();

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_journey_content_updated_at
  BEFORE UPDATE ON public.journey_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_journey_content_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER projects_generate_slug
  BEFORE INSERT OR UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_project_slug();

CREATE TRIGGER projects_update_timestamp
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_projects_updated_at();

CREATE TRIGGER update_public_users_updated_at
  BEFORE UPDATE ON public.public_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_services_updated_at();

CREATE TRIGGER trg_shop_products_updated_at
  BEFORE UPDATE ON public.shop_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "owner write about_highlights" ON "public"."about_highlights"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read about_highlights" ON "public"."about_highlights"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write about_page" ON "public"."about_page"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read about_page" ON "public"."about_page"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write about_quotes" ON "public"."about_quotes"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read about_quotes" ON "public"."about_quotes"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write about_sections" ON "public"."about_sections"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read about_sections" ON "public"."about_sections"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write about_timeline" ON "public"."about_timeline"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read about_timeline" ON "public"."about_timeline"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "admin_manage_categories" ON "public"."blog_categories"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() IS NOT NULL))
  WITH CHECK ((auth.uid() IS NOT NULL));

CREATE POLICY "public_read_categories" ON "public"."blog_categories"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "author_moderate_comments" ON "public"."blog_comments"
  FOR UPDATE
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.blog_posts
  WHERE ((blog_posts.id = blog_comments.post_id) AND (blog_posts.author_user_id = auth.uid())))));

CREATE POLICY "public_read_approved_comments" ON "public"."blog_comments"
  FOR SELECT
  TO PUBLIC
  USING ((is_approved = true));

CREATE POLICY "user_manage_own_comments" ON "public"."blog_comments"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "author_read_own_analytics" ON "public"."blog_post_views"
  FOR SELECT
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.blog_posts
  WHERE ((blog_posts.id = blog_post_views.post_id) AND (blog_posts.author_user_id = auth.uid())))));

CREATE POLICY "system_insert_views" ON "public"."blog_post_views"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "author_manage_own_posts" ON "public"."blog_posts"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = author_user_id))
  WITH CHECK ((auth.uid() = author_user_id));

CREATE POLICY "public_read_published_posts" ON "public"."blog_posts"
  FOR SELECT
  TO PUBLIC
  USING (((is_published = true) AND ((publish_date IS NULL) OR (publish_date <= now()))));

CREATE POLICY "owner write certificates" ON "public"."certificates"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read certificates" ON "public"."certificates"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin can update inquiries" ON "public"."contact_inquiries"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() IN ( SELECT profiles.owner_user_id
   FROM public.profiles
 LIMIT 1)));

CREATE POLICY "Admin can view all inquiries" ON "public"."contact_inquiries"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() IN ( SELECT profiles.owner_user_id
   FROM public.profiles
 LIMIT 1)));

CREATE POLICY "Anyone can create inquiries" ON "public"."contact_inquiries"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON "public"."contact_inquiries"
  FOR SELECT
  TO PUBLIC
  USING ((user_id IN ( SELECT public_users.id
   FROM public.public_users
  WHERE (public_users.auth_user_id = auth.uid()))));

CREATE POLICY "owner manage courses" ON "public"."courses"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read published courses" ON "public"."courses"
  FOR SELECT
  TO PUBLIC
  USING ((is_published = true));

CREATE POLICY "owner write education" ON "public"."education"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read education" ON "public"."education"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write experiences" ON "public"."experiences"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read experiences" ON "public"."experiences"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Journey content is publicly readable when published" ON "public"."journey_content"
  FOR SELECT
  TO PUBLIC
  USING ((published = true));

CREATE POLICY "Users can delete their own journey content" ON "public"."journey_content"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = owner_user_id));

CREATE POLICY "Users can insert their own journey content" ON "public"."journey_content"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "Users can update their own journey content" ON "public"."journey_content"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "Users can view their own journey content" ON "public"."journey_content"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = owner_user_id));

CREATE POLICY "owner write languages" ON "public"."languages"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read languages" ON "public"."languages"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write sections" ON "public"."portfolio_sections"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read sections" ON "public"."portfolio_sections"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write profile_stats" ON "public"."profile_stats"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read profile_stats" ON "public"."profile_stats"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write profiles" ON "public"."profiles"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read profiles" ON "public"."profiles"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write project_links" ON "public"."project_links"
  FOR ALL
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.projects p
  WHERE ((p.id = project_links.project_id) AND (p.owner_user_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects p
  WHERE ((p.id = project_links.project_id) AND (p.owner_user_id = auth.uid())))));

CREATE POLICY "public read project_links" ON "public"."project_links"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write project_media" ON "public"."project_media"
  FOR ALL
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.projects p
  WHERE ((p.id = project_media.project_id) AND (p.owner_user_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.projects p
  WHERE ((p.id = project_media.project_id) AND (p.owner_user_id = auth.uid())))));

CREATE POLICY "public read project_media" ON "public"."project_media"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "owner write projects" ON "public"."projects"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read projects" ON "public"."projects"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admins can read all users" ON "public"."public_users"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE (profiles.owner_user_id = auth.uid()))));

CREATE POLICY "Admins can update all users" ON "public"."public_users"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE (profiles.owner_user_id = auth.uid()))));

CREATE POLICY "Service role full access" ON "public"."public_users"
  FOR ALL
  TO "service_role"
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert own record" ON "public"."public_users"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((auth.uid() = auth_user_id));

CREATE POLICY "Users can read own record" ON "public"."public_users"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = auth_user_id));

CREATE POLICY "Users can update own record" ON "public"."public_users"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() = auth_user_id))
  WITH CHECK ((auth.uid() = auth_user_id));

CREATE POLICY "owner write sections" ON "public"."sections"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read sections" ON "public"."sections"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "admin_manage_inquiries" ON "public"."service_inquiries"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() IS NOT NULL))
  WITH CHECK ((auth.uid() IS NOT NULL));

CREATE POLICY "anyone_insert_inquiry" ON "public"."service_inquiries"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Admin can update service requests" ON "public"."service_requests"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() IN ( SELECT profiles.owner_user_id
   FROM public.profiles
 LIMIT 1)));

CREATE POLICY "Admin can view all service requests" ON "public"."service_requests"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() IN ( SELECT profiles.owner_user_id
   FROM public.profiles
 LIMIT 1)));

CREATE POLICY "Users can manage own service requests" ON "public"."service_requests"
  FOR ALL
  TO PUBLIC
  USING ((user_id IN ( SELECT public_users.id
   FROM public.public_users
  WHERE (public_users.auth_user_id = auth.uid()))));

CREATE POLICY "admin_manage_reviews" ON "public"."service_reviews"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() IS NOT NULL))
  WITH CHECK ((auth.uid() IS NOT NULL));

CREATE POLICY "public_read_approved_reviews" ON "public"."service_reviews"
  FOR SELECT
  TO PUBLIC
  USING ((is_approved = true));

CREATE POLICY "admin_manage_services" ON "public"."services"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() IS NOT NULL))
  WITH CHECK ((auth.uid() IS NOT NULL));

CREATE POLICY "public_read_active_services" ON "public"."services"
  FOR SELECT
  TO PUBLIC
  USING ((is_active = true));

CREATE POLICY "owner manage products" ON "public"."shop_products"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read published products" ON "public"."shop_products"
  FOR SELECT
  TO PUBLIC
  USING ((is_published = true));

CREATE POLICY "owner write skills" ON "public"."skills"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = owner_user_id))
  WITH CHECK ((auth.uid() = owner_user_id));

CREATE POLICY "public read skills" ON "public"."skills"
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin can view all activity" ON "public"."user_activity_log"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() IN ( SELECT profiles.owner_user_id
   FROM public.profiles
 LIMIT 1)));

CREATE POLICY "System can insert activity" ON "public"."user_activity_log"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Users can view own activity" ON "public"."user_activity_log"
  FOR SELECT
  TO PUBLIC
  USING ((user_id IN ( SELECT public_users.id
   FROM public.public_users
  WHERE (public_users.auth_user_id = auth.uid()))));

CREATE POLICY "Users can manage own addresses" ON "public"."user_addresses"
  FOR ALL
  TO PUBLIC
  USING ((EXISTS ( SELECT 1
   FROM public.public_users
  WHERE ((public_users.id = user_addresses.user_id) AND (public_users.auth_user_id = auth.uid())))));

CREATE POLICY "Authenticated users can delete blog images" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'blog-images'::text));

CREATE POLICY "Authenticated users can delete blog videos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'blog-videos'::text));

CREATE POLICY "Authenticated users can delete course videos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'course-videos'::text));

CREATE POLICY "Authenticated users can delete courses images" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'courses-images'::text));

CREATE POLICY "Authenticated users can delete media videos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'media-videos'::text));

CREATE POLICY "Authenticated users can delete media" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'media-library'::text));

CREATE POLICY "Authenticated users can delete project videos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'project-videos'::text));

CREATE POLICY "Authenticated users can delete projects images" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'projects-images'::text));

CREATE POLICY "Authenticated users can delete service videos" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'service-videos'::text));

CREATE POLICY "Authenticated users can delete services images" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'services-images'::text));

CREATE POLICY "Authenticated users can delete shop images" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING ((bucket_id = 'shop-images'::text));

CREATE POLICY "Authenticated users can update blog images" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'blog-images'::text));

CREATE POLICY "Authenticated users can update blog videos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'blog-videos'::text))
  WITH CHECK ((bucket_id = 'blog-videos'::text));

CREATE POLICY "Authenticated users can update course videos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'course-videos'::text))
  WITH CHECK ((bucket_id = 'course-videos'::text));

CREATE POLICY "Authenticated users can update courses images" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'courses-images'::text));

CREATE POLICY "Authenticated users can update media videos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'media-videos'::text))
  WITH CHECK ((bucket_id = 'media-videos'::text));

CREATE POLICY "Authenticated users can update media" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'media-library'::text));

CREATE POLICY "Authenticated users can update project videos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'project-videos'::text))
  WITH CHECK ((bucket_id = 'project-videos'::text));

CREATE POLICY "Authenticated users can update projects images" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'projects-images'::text));

CREATE POLICY "Authenticated users can update service videos" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'service-videos'::text))
  WITH CHECK ((bucket_id = 'service-videos'::text));

CREATE POLICY "Authenticated users can update services images" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'services-images'::text));

CREATE POLICY "Authenticated users can update shop images" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING ((bucket_id = 'shop-images'::text));

CREATE POLICY "Authenticated users can upload blog images" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'blog-images'::text));

CREATE POLICY "Authenticated users can upload blog videos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'blog-videos'::text));

CREATE POLICY "Authenticated users can upload course videos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'course-videos'::text));

CREATE POLICY "Authenticated users can upload courses images" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'courses-images'::text));

CREATE POLICY "Authenticated users can upload media videos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'media-videos'::text));

CREATE POLICY "Authenticated users can upload media" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'media-library'::text));

CREATE POLICY "Authenticated users can upload project videos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'project-videos'::text));

CREATE POLICY "Authenticated users can upload projects images" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'projects-images'::text));

CREATE POLICY "Authenticated users can upload service videos" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'service-videos'::text));

CREATE POLICY "Authenticated users can upload services images" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'services-images'::text));

CREATE POLICY "Authenticated users can upload shop images" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((bucket_id = 'shop-images'::text));

CREATE POLICY "Public can view blog images" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'blog-images'::text));

CREATE POLICY "Public can view blog videos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'blog-videos'::text));

CREATE POLICY "Public can view course videos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'course-videos'::text));

CREATE POLICY "Public can view courses images" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'courses-images'::text));

CREATE POLICY "Public can view media videos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'media-videos'::text));

CREATE POLICY "Public can view media" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'media-library'::text));

CREATE POLICY "Public can view project videos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'project-videos'::text));

CREATE POLICY "Public can view projects images" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'projects-images'::text));

CREATE POLICY "Public can view service videos" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'service-videos'::text));

CREATE POLICY "Public can view services images" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'services-images'::text));

CREATE POLICY "Public can view shop images" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'shop-images'::text));

COMMENT ON COLUMN "public"."courses"."gallery_images" IS 'Array of image URLs for course gallery/screenshots';

COMMENT ON COLUMN "public"."courses"."lesson_videos" IS 'Array of video URLs for lesson previews/samples';

COMMENT ON COLUMN "public"."courses"."promo_video_url" IS 'URL of the promotional video for the course';

COMMENT ON COLUMN "public"."profiles"."achievements" IS 'Array of achievement objects: [{"title": "...", "description": "...", "icon": "...", "date": "...", "image": "..."}]';

COMMENT ON COLUMN "public"."profiles"."call_to_action" IS 'CTA buttons config: {"primary": {"text": "...", "link": "..."}, "secondary": {...}}';

COMMENT ON COLUMN "public"."profiles"."featured_quote" IS 'Inspirational quote to display prominently';

COMMENT ON COLUMN "public"."profiles"."featured_quote_author" IS 'Author of the featured quote';

COMMENT ON COLUMN "public"."profiles"."fun_facts" IS 'Array of fun facts: [{"label": "Projects Completed", "value": "150+", "icon": "..."}]';

COMMENT ON COLUMN "public"."profiles"."gallery_images" IS 'Array of image URLs for photo gallery';

COMMENT ON COLUMN "public"."profiles"."gallery_videos" IS 'Array of video URLs for media gallery';

COMMENT ON COLUMN "public"."profiles"."hero_background_image" IS 'Fallback/poster image for hero section';

COMMENT ON COLUMN "public"."profiles"."hero_video_url" IS 'Background video URL for hero section (MP4, WebM)';

COMMENT ON COLUMN "public"."profiles"."milestones" IS 'Array of milestone objects: [{"year": "2024", "title": "...", "description": "...", "icon": "...", "image": "..."}]';

COMMENT ON COLUMN "public"."profiles"."story_sections" IS 'Array of story sections: [{"title": "...", "content": "...", "image": "...", "video": "...", "order": 1}]';

COMMENT ON COLUMN "public"."profiles"."story_subtitle" IS 'Subtitle for the story section';

COMMENT ON COLUMN "public"."profiles"."story_title" IS 'Title for the story/journey section';

COMMENT ON COLUMN "public"."profiles"."testimonials" IS 'Array of testimonials: [{"name": "...", "role": "...", "company": "...", "content": "...", "avatar": "...", "rating": 5}]';

COMMENT ON COLUMN "public"."projects"."complexity_level" IS 'Project complexity: Simple, Medium, Complex, Enterprise';

COMMENT ON COLUMN "public"."projects"."display_priority" IS 'Higher number = shown first (0-100)';

COMMENT ON COLUMN "public"."projects"."featured_image_url" IS 'Large hero image for project detail page (recommended: 1920x1080px)';

COMMENT ON COLUMN "public"."projects"."gallery_images" IS 'Array of additional project screenshots and images';

COMMENT ON COLUMN "public"."projects"."results_metrics" IS 'JSON object containing quantifiable project results (e.g., {"performance": "+50%", "users": "10K+"})';

COMMENT ON COLUMN "public"."projects"."thumbnail_url" IS 'Main thumbnail image for grid/card view (recommended: 600x400px)';

COMMENT ON COLUMN "public"."shop_products"."affiliate_link" IS 'Amazon affiliate or other affiliate tracking URL - MOST IMPORTANT for revenue!';

COMMENT ON COLUMN "public"."shop_products"."category" IS 'Main category: Template, Component, Tool, Other';

COMMENT ON COLUMN "public"."shop_products"."product_type" IS 'Type: physical (dropshipping), digital (downloadable), affiliate (external link)';

COMMENT ON COLUMN "public"."shop_products"."specifications" IS 'JSONB object for flexible product specs (e.g., {browser: "Chrome", size: "Large"})';

COMMENT ON COLUMN "public"."shop_products"."tech_stack" IS 'Technologies used in the product (for templates/components/tools)';

COMMENT ON TABLE "public"."contact_inquiries" IS 'Contact form submissions from public users';

COMMENT ON TABLE "public"."projects" IS 'Professional portfolio projects with comprehensive details for showcase';

COMMENT ON TABLE "public"."public_users" IS 'Public customer/visitor accounts - separate from admin portfolio';

COMMENT ON TABLE "public"."service_requests" IS 'Service/hire requests from customers';

COMMENT ON TABLE "public"."shop_products" IS 'E-commerce products table supporting affiliate marketing, dropshipping, and digital products';

COMMENT ON TABLE "public"."user_activity_log" IS 'Track user actions for analytics';

COMMENT ON TABLE "public"."user_addresses" IS 'User shipping/billing addresses for e-commerce';

GRANT EXECUTE ON FUNCTION "public"."generate_project_slug"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."generate_project_slug"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_project_slug"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."generate_project_slug"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_public_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_public_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_public_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_public_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_user_type"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_user_type"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_user_type"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_user_type"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user_signup"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."handle_new_user_signup"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user_signup"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user_signup"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_admin"(uuid) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_admin"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"(uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_portfolio_admin"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_portfolio_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_portfolio_admin"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_portfolio_admin"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_public_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_public_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_public_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_public_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_blog_posts_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_blog_posts_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_blog_posts_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_blog_posts_updated_at"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_journey_content_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_journey_content_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_journey_content_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_journey_content_updated_at"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_projects_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_projects_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_projects_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_projects_updated_at"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_services_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_services_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_services_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_services_updated_at"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_user_last_login"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_user_last_login"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_user_last_login"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_user_last_login"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_highlights" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."about_highlights" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_highlights" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_highlights" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_page" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."about_page" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_page" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_page" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_quotes" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."about_quotes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_quotes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_quotes" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_sections" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."about_sections" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_sections" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_sections" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_timeline" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."about_timeline" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_timeline" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."about_timeline" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_categories" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."blog_categories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_categories" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_categories" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_comments" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."blog_comments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_comments" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_comments" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_post_views" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."blog_post_views" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_post_views" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_post_views" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_posts" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."blog_posts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_posts" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."blog_posts" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."certificates" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."certificates" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."certificates" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."certificates" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."contact_inquiries" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."contact_inquiries" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."contact_inquiries" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."contact_inquiries" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."courses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."education" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."education" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."education" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."education" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."experiences" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."experiences" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."experiences" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."experiences" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."journey_content" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."journey_content" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."journey_content" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."journey_content" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."languages" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."languages" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."languages" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."languages" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."portfolio_sections" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."portfolio_sections" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."portfolio_sections" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."portfolio_sections" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_stats" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profile_stats" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_stats" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_stats" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_links" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."project_links" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_links" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_links" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_media" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."project_media" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_media" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."project_media" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."projects" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."projects" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."projects" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."projects" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."public_users" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."public_users" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."public_users" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."public_users" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."sections" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."sections" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."sections" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."sections" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_inquiries" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."service_inquiries" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_inquiries" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_inquiries" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_requests" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."service_requests" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_requests" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_requests" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_reviews" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."service_reviews" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_reviews" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."service_reviews" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."services" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."services" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."services" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."services" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."shop_products" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."shop_products" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."shop_products" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."shop_products" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."skills" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."skills" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."skills" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."skills" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_activity_log" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."user_activity_log" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_activity_log" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_activity_log" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_addresses" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."user_addresses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_addresses" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."user_addresses" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_pending_service_requests" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."admin_pending_service_requests" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_pending_service_requests" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_pending_service_requests" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_recent_inquiries" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."admin_recent_inquiries" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_recent_inquiries" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_recent_inquiries" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_user_stats" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."admin_user_stats" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_user_stats" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_user_stats" TO "service_role";

