-- =========================================================
-- SERVICES SEED DATA - Portfolio Services
-- =========================================================
-- Sample data for Web Development, Mobile Apps, Consulting, Training

-- =========================================================
-- 1. WEB DEVELOPMENT SERVICE
-- =========================================================

INSERT INTO services (
  name, slug, tagline, description, full_description,
  icon, color, featured_image_url,
  category, subcategories, service_type,
  base_price, price_currency, price_unit, pricing_tiers, is_price_negotiable,
  estimated_duration, duration_unit, min_duration, max_duration,
  is_available, availability_status,
  key_features, deliverables, included_services, excluded_services, requirements,
  technologies, tools, methodologies, languages,
  process_steps, revision_count, support_duration,
  success_metrics, typical_results,
  consultation_required, consultation_duration, communication_channels,
  faqs, meta_title, meta_description, meta_keywords,
  cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
  is_featured, is_popular, display_order, is_active, is_accepting_clients
) VALUES (
  'Web Development',
  'web-development',
  'Build Modern, Scalable Web Applications',
  'Professional full-stack web development services using cutting-edge technologies like Next.js, React, TypeScript, and Node.js. From concept to deployment.',
  'Transform your ideas into powerful web applications with our comprehensive web development services. We specialize in building fast, scalable, and maintainable web solutions using modern frameworks and best practices.

Our development process focuses on performance, security, and user experience. Whether you need a corporate website, e-commerce platform, SaaS application, or custom web solution, we deliver production-ready code that scales with your business.

We follow industry-standard practices including test-driven development, continuous integration, and agile methodologies to ensure your project is delivered on time and exceeds expectations.',
  '💻',
  '#3B82F6',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630',
  'Web Development',
  ARRAY['Frontend Development', 'Backend Development', 'Full-Stack Development', 'API Development', 'Database Design'],
  'project',
  5000.00,
  'USD',
  'per project',
  '[
    {"name": "Starter", "price": 5000, "features": ["Up to 5 pages", "Responsive design", "Basic SEO", "Contact form", "1 month support"]},
    {"name": "Professional", "price": 12000, "features": ["Up to 15 pages", "Custom design", "Advanced SEO", "CMS integration", "E-commerce ready", "3 months support"]},
    {"name": "Enterprise", "price": 25000, "features": ["Unlimited pages", "Custom features", "Full SEO suite", "Advanced integrations", "Performance optimization", "6 months support", "Priority updates"]}
  ]'::jsonb,
  true,
  '4-12 weeks',
  'weeks',
  4,
  16,
  true,
  'available',
  ARRAY[
    'Modern tech stack (Next.js, React, TypeScript)',
    'Responsive & mobile-first design',
    'SEO optimized architecture',
    'Performance optimization (90+ Lighthouse score)',
    'Secure authentication & authorization',
    'Database design & optimization',
    'API development & integration',
    'Deployment & CI/CD setup',
    'Documentation & training'
  ],
  ARRAY[
    'Fully functional web application',
    'Source code repository',
    'Deployment on your preferred platform',
    'Technical documentation',
    'Admin panel (if applicable)',
    'API documentation',
    'Performance report',
    'Security audit report',
    'Training session for your team'
  ],
  ARRAY[
    'Frontend development',
    'Backend development',
    'Database setup',
    'API integration',
    'Responsive design',
    'Cross-browser testing',
    'Security implementation',
    'Performance optimization',
    'Deployment setup'
  ],
  ARRAY[
    'Content writing',
    'Logo design',
    'Hosting fees',
    'Domain registration',
    'Third-party API costs',
    'SSL certificates',
    'Email marketing tools'
  ],
  ARRAY[
    'Clear project requirements',
    'Brand assets (logo, colors, fonts)',
    'Access to relevant APIs/services',
    'Content for initial pages',
    'Feedback availability during development'
  ],
  ARRAY['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'Prisma'],
  ARRAY['VS Code', 'Git', 'GitHub', 'Vercel', 'Figma', 'Postman', 'Docker'],
  ARRAY['Agile', 'Scrum', 'Test-Driven Development', 'Continuous Integration'],
  ARRAY['TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  '[
    {"step": 1, "title": "Discovery & Planning", "description": "Understanding requirements, defining scope, and creating project roadmap", "duration": "1 week"},
    {"step": 2, "title": "Design & Prototyping", "description": "Creating wireframes, mockups, and interactive prototypes", "duration": "1-2 weeks"},
    {"step": 3, "title": "Development", "description": "Building frontend, backend, and integrating all features", "duration": "4-8 weeks"},
    {"step": 4, "title": "Testing & QA", "description": "Comprehensive testing across devices and browsers", "duration": "1-2 weeks"},
    {"step": 5, "title": "Deployment & Launch", "description": "Deploying to production and final optimization", "duration": "1 week"},
    {"step": 6, "title": "Support & Maintenance", "description": "Post-launch support and monitoring", "duration": "Ongoing"}
  ]'::jsonb,
  3,
  '3 months',
  '{"load_time": "< 2 seconds", "lighthouse_score": "90+", "uptime": "99.9%", "user_satisfaction": "95%+"}',
  ARRAY[
    '50% reduction in page load time',
    '3x increase in mobile conversions',
    '99.9% uptime reliability',
    'Scalable to 10,000+ concurrent users',
    'SEO rankings improved by 200%'
  ],
  true,
  30,
  ARRAY['Slack', 'Email', 'Zoom', 'Discord'],
  '[
    {"question": "How long does a typical web project take?", "answer": "Most projects take 4-12 weeks depending on complexity. We provide a detailed timeline after the discovery phase."},
    {"question": "Do you provide hosting?", "answer": "We help you deploy to platforms like Vercel, Netlify, or AWS. Hosting costs are separate but we handle the entire setup."},
    {"question": "Can you work with my existing backend?", "answer": "Absolutely! We can integrate with any REST or GraphQL API."},
    {"question": "What if I need changes after launch?", "answer": "All projects include 3 months of support. After that, we offer maintenance packages or hourly support."},
    {"question": "Do you sign NDAs?", "answer": "Yes, we''re happy to sign NDAs and work under your preferred legal terms."}
  ]'::jsonb,
  'Professional Web Development Services | Next.js, React & TypeScript',
  'Build modern, scalable web applications with Next.js, React, and TypeScript. Full-stack development from concept to deployment.',
  ARRAY['web development', 'nextjs development', 'react development', 'full-stack developer', 'typescript', 'nodejs'],
  'Start Your Project',
  '/contact?service=web-development',
  'Schedule Free Consultation',
  '/book-consultation',
  true,
  true,
  1,
  true,
  true
);

-- =========================================================
-- 2. MOBILE APPS SERVICE
-- =========================================================

INSERT INTO services (
  name, slug, tagline, description, full_description,
  icon, color, featured_image_url,
  category, subcategories, service_type,
  base_price, price_currency, price_unit, pricing_tiers, is_price_negotiable,
  estimated_duration, duration_unit, min_duration, max_duration,
  is_available, availability_status,
  key_features, deliverables, included_services, excluded_services, requirements,
  technologies, tools, methodologies, languages,
  process_steps, revision_count, support_duration,
  consultation_required, consultation_duration, communication_channels,
  meta_title, meta_description, meta_keywords,
  cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
  is_featured, is_popular, display_order, is_active, is_accepting_clients
) VALUES (
  'Mobile Apps',
  'mobile-apps',
  'Native-Quality Mobile Apps with React Native',
  'Cross-platform mobile app development using React Native. Build once, deploy to iOS and Android with native performance and feel.',
  'Create stunning mobile applications that work seamlessly on both iOS and Android using React Native. Our mobile development service delivers native-quality apps with a single codebase, reducing development time and cost while maintaining excellent performance.

We specialize in building user-friendly, feature-rich mobile applications with offline support, push notifications, in-app purchases, and seamless API integrations. From consumer apps to enterprise solutions, we handle the entire mobile development lifecycle.',
  '📱',
  '#8B5CF6',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630',
  'Mobile Apps',
  ARRAY['iOS Development', 'Android Development', 'Cross-Platform', 'App Store Deployment'],
  'project',
  8000.00,
  'USD',
  'per project',
  '[
    {"name": "MVP", "price": 8000, "features": ["Core features only", "iOS + Android", "Basic UI/UX", "API integration", "2 months support"]},
    {"name": "Standard", "price": 18000, "features": ["Full features", "Custom design", "Push notifications", "Offline mode", "App Store submission", "4 months support"]},
    {"name": "Premium", "price": 35000, "features": ["Advanced features", "Premium UI/UX", "Payment integration", "Analytics", "Admin dashboard", "Continuous deployment", "6 months support"]}
  ]'::jsonb,
  true,
  '8-16 weeks',
  'weeks',
  8,
  20,
  true,
  'available',
  ARRAY[
    'Cross-platform (iOS & Android)',
    'Native performance',
    'Offline-first architecture',
    'Push notifications',
    'Biometric authentication',
    'In-app purchases',
    'Real-time features',
    'App Store & Google Play submission',
    'Performance monitoring'
  ],
  ARRAY[
    'iOS & Android applications',
    'Source code repository',
    'App Store submission',
    'Technical documentation',
    'Admin dashboard (optional)',
    'API documentation',
    'Testing on real devices',
    'App Store assets & screenshots',
    'Post-launch analytics setup'
  ],
  ARRAY[
    'React Native development',
    'iOS & Android builds',
    'App Store setup',
    'Push notification setup',
    'Analytics integration',
    'Testing & QA',
    'App submission assistance'
  ],
  ARRAY[
    'App Store fees ($99/year iOS, $25 Android)',
    'Backend development',
    'Server costs',
    'Third-party API costs',
    'App marketing',
    'App Store Optimization'
  ],
  ARRAY[
    'Clear app concept & features',
    'User flow diagrams',
    'Design assets or inspiration',
    'Apple Developer account',
    'Google Play Developer account',
    'API access (if applicable)'
  ],
  ARRAY['React Native', 'Expo', 'TypeScript', 'Redux', 'React Query', 'Firebase', 'Supabase'],
  ARRAY['Xcode', 'Android Studio', 'VS Code', 'Testflight', 'Firebase', 'Figma'],
  ARRAY['Agile', 'Mobile-First', 'Test-Driven Development'],
  ARRAY['TypeScript', 'JavaScript', 'Swift', 'Kotlin'],
  '[
    {"step": 1, "title": "App Strategy", "description": "Define features, user flows, and technical architecture", "duration": "1-2 weeks"},
    {"step": 2, "title": "UI/UX Design", "description": "Create app designs following iOS and Android guidelines", "duration": "2-3 weeks"},
    {"step": 3, "title": "Development", "description": "Build features, integrate APIs, implement native modules", "duration": "6-12 weeks"},
    {"step": 4, "title": "Testing", "description": "Test on real devices, fix bugs, optimize performance", "duration": "2 weeks"},
    {"step": 5, "title": "Deployment", "description": "Submit to App Store and Google Play", "duration": "1-2 weeks"},
    {"step": 6, "title": "Support", "description": "Monitor crashes, fix issues, push updates", "duration": "Ongoing"}
  ]'::jsonb,
  3,
  '4 months',
  true,
  45,
  ARRAY['Slack', 'Email', 'Zoom', 'Discord'],
  'Mobile App Development Services | React Native iOS & Android Apps',
  'Build cross-platform mobile apps with React Native. Native performance for iOS and Android from a single codebase.',
  ARRAY['mobile app development', 'react native', 'ios development', 'android development', 'cross-platform apps'],
  'Build Your App',
  '/contact?service=mobile-apps',
  'Schedule App Consultation',
  '/book-consultation',
  true,
  true,
  2,
  true,
  true
);

-- =========================================================
-- 3. CONSULTING SERVICE
-- =========================================================

INSERT INTO services (
  name, slug, tagline, description, full_description,
  icon, color, featured_image_url,
  category, subcategories, service_type,
  base_price, price_currency, price_unit, is_price_negotiable,
  estimated_duration, duration_unit,
  is_available, availability_status,
  key_features, deliverables, included_services,
  technologies, methodologies,
  consultation_required, consultation_duration, communication_channels,
  faqs, meta_title, meta_description, meta_keywords,
  cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
  is_featured, display_order, is_active, is_accepting_clients
) VALUES (
  'Consulting',
  'consulting',
  'Expert Technical Guidance for Your Projects',
  'Technical consulting and code reviews for startups and enterprises. Get expert advice on architecture, tech stack, best practices, and scaling strategies.',
  'Leverage our expertise to make better technical decisions. Whether you''re starting a new project, scaling an existing application, or need a second opinion on your tech stack, our consulting services provide actionable insights and strategic guidance.

We help you avoid costly mistakes, optimize performance, improve code quality, and build scalable architectures. Our consulting engagements are flexible and tailored to your specific needs.',
  '🎯',
  '#10B981',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630',
  'Consulting',
  ARRAY['Technical Strategy', 'Code Review', 'Architecture Design', 'Performance Optimization', 'Team Mentoring'],
  'hourly',
  150.00,
  'USD',
  'per hour',
  true,
  '1-6 months',
  'months',
  true,
  'available',
  ARRAY[
    'Architecture review & recommendations',
    'Code quality assessment',
    'Performance optimization strategies',
    'Technology stack evaluation',
    'Security audit',
    'Scalability planning',
    'Best practices implementation',
    'Team training & mentoring',
    'CI/CD pipeline setup'
  ],
  ARRAY[
    'Detailed analysis report',
    'Architecture diagrams',
    'Recommendations document',
    'Implementation roadmap',
    'Code review feedback',
    'Best practices guide',
    'Follow-up session'
  ],
  ARRAY[
    'Initial assessment call',
    'Detailed technical review',
    'Written recommendations',
    'Video walkthrough',
    'Follow-up Q&A sessions',
    'Email support'
  ],
  ARRAY['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
  ARRAY['Agile', 'DevOps', 'Clean Architecture', 'SOLID Principles', 'Design Patterns'],
  true,
  30,
  ARRAY['Zoom', 'Google Meet', 'Email', 'Slack'],
  '[
    {"question": "How does consulting work?", "answer": "We start with a discovery call to understand your needs. Then we conduct a thorough review and provide detailed recommendations with an implementation plan."},
    {"question": "Can you review my existing code?", "answer": "Yes! Code reviews are one of our most popular services. We analyze code quality, security, performance, and provide actionable feedback."},
    {"question": "Do you help with implementation?", "answer": "Absolutely. We can either guide your team through implementation or handle it ourselves as part of a development engagement."},
    {"question": "What if we need ongoing advice?", "answer": "We offer retainer packages for ongoing consulting support. This is perfect for startups and teams that need regular technical guidance."}
  ]'::jsonb,
  'Technical Consulting Services | Software Architecture & Code Review',
  'Expert technical consulting for architecture design, code review, and scaling strategies. Make better technical decisions.',
  ARRAY['technical consulting', 'software architecture', 'code review', 'tech advisor', 'cto services'],
  'Book Consultation',
  '/contact?service=consulting',
  'Schedule Free Call',
  '/book-consultation',
  false,
  3,
  true,
  true
);

-- =========================================================
-- 4. TRAINING SERVICE
-- =========================================================

INSERT INTO services (
  name, slug, tagline, description, full_description,
  icon, color, featured_image_url,
  category, subcategories, service_type,
  base_price, price_currency, price_unit, pricing_tiers, is_price_negotiable,
  estimated_duration, duration_unit,
  is_available, availability_status,
  key_features, deliverables, included_services,
  technologies, methodologies,
  consultation_required, consultation_duration, communication_channels,
  faqs, meta_title, meta_description, meta_keywords,
  cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url,
  is_featured, display_order, is_active, is_accepting_clients
) VALUES (
  'Training',
  'training',
  'Level Up Your Team''s Skills',
  'Corporate training and workshops on modern web development, React, TypeScript, Next.js, and software engineering best practices.',
  'Invest in your team''s growth with our comprehensive training programs. We offer customized training tailored to your team''s skill level and business needs.

Our training covers everything from frontend frameworks (React, Next.js) to backend development (Node.js, databases), testing strategies, DevOps practices, and software architecture. All sessions are hands-on with real-world examples and practical exercises.',
  '📚',
  '#F59E0B',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=630',
  'Training',
  ARRAY['Corporate Training', 'Team Workshops', 'One-on-One Mentoring', 'Online Courses', 'Bootcamps'],
  'package',
  2000.00,
  'USD',
  'per day',
  '[
    {"name": "Half-Day Workshop", "price": 1500, "features": ["4 hours training", "Up to 10 participants", "Hands-on exercises", "Q&A session", "Materials included"]},
    {"name": "Full-Day Workshop", "price": 2500, "features": ["8 hours training", "Up to 15 participants", "Practical projects", "Code review", "Certification", "1 month email support"]},
    {"name": "Multi-Day Program", "price": 8000, "features": ["5 days intensive training", "Up to 20 participants", "Real project", "Individual mentoring", "Certification", "3 months email support", "Recorded sessions"]}
  ]'::jsonb,
  true,
  '1-5 days',
  'days',
  true,
  'limited',
  ARRAY[
    'Customized curriculum',
    'Hands-on coding exercises',
    'Real-world projects',
    'Best practices & patterns',
    'Code review sessions',
    'Q&A and troubleshooting',
    'Course materials & resources',
    'Certificates of completion',
    'Post-training support'
  ],
  ARRAY[
    'Training materials',
    'Code examples & templates',
    'Video recordings',
    'Resource list',
    'Certificates',
    'Follow-up session',
    'Email support'
  ],
  ARRAY[
    'Customized content',
    'Live coding sessions',
    'Hands-on exercises',
    'Team projects',
    'Code reviews',
    'Best practices guide',
    'Q&A sessions'
  ],
  ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'Testing', 'Git', 'CI/CD', 'Docker'],
  ARRAY['Interactive Learning', 'Project-Based', 'Peer Programming', 'Incremental Complexity'],
  true,
  30,
  ARRAY['Zoom', 'Google Meet', 'Slack', 'Discord'],
  '[
    {"question": "Can training be done remotely?", "answer": "Yes! We offer both in-person and remote training via Zoom or Google Meet."},
    {"question": "Do you customize the curriculum?", "answer": "Absolutely. We tailor every training program to your team''s skill level and specific needs."},
    {"question": "What''s the maximum team size?", "answer": "For optimal learning, we recommend 10-15 participants. For larger teams, we can run multiple sessions."},
    {"question": "Do participants get certificates?", "answer": "Yes, all participants receive a certificate of completion."},
    {"question": "Can we schedule training outside business hours?", "answer": "Yes, we can accommodate different time zones and schedules."}
  ]'::jsonb,
  'Corporate Training & Workshops | React, Next.js & TypeScript',
  'Professional training programs for teams. Learn React, Next.js, TypeScript, and modern web development best practices.',
  ARRAY['corporate training', 'react training', 'nextjs workshop', 'typescript training', 'web development bootcamp'],
  'Schedule Training',
  '/contact?service=training',
  'View Training Topics',
  '/training-catalog',
  false,
  4,
  true,
  true
);

-- =========================================================
-- SUCCESS MESSAGE
-- =========================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Services seed data created successfully!';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '   - 4 services (Web Development, Mobile Apps, Consulting, Training)';
  RAISE NOTICE '   - Multiple pricing tiers';
  RAISE NOTICE '   - Comprehensive details & FAQs';
  RAISE NOTICE '   - SEO optimization';
  RAISE NOTICE '🎯 All services are active and ready to display!';
  RAISE NOTICE '📝 Next: Build the services page to showcase these offerings';
END $$;
