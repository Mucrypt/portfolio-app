-- Seed data for service_inquiries table
-- This provides realistic test data for the admin inquiries management interface
-- Note: Uses columns that match the actual schema (no is_read, no admin_notes/admin_response)

-- Sample Service Inquiry 1: New inquiry for Web Development (Urgent)
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status
) VALUES (
  (SELECT id FROM services WHERE slug = 'web-development' LIMIT 1),
  'Sarah Johnson',
  'sarah.johnson@techstartup.com',
  '+1 (555) 123-4567',
  'TechStartup Inc.',
  'https://techstartup.com',
  '$10,000 - $25,000',
  'Within 2 months',
  'We need a complete redesign of our existing web application. The current platform is built on outdated technology and we want to migrate to a modern stack with Next.js and React. The application handles user authentication, data visualization, and real-time updates.

Requirements: User authentication with OAuth, Dashboard with charts and graphs, Real-time notifications, Mobile responsive design, API integration with our existing backend, Admin panel for content management',
  'urgent',
  'new'
);

-- Sample Service Inquiry 2: Qualified for Mobile App Development
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, follow_up_date
) VALUES (
  (SELECT id FROM services WHERE slug = 'mobile-apps' LIMIT 1),
  'Michael Chen',
  'michael@fitnesshub.io',
  '+1 (555) 987-6543',
  'FitnessHub',
  'https://fitnesshub.io',
  '$15,000 - $30,000',
  'Within 3 months',
  'Looking to build a fitness tracking mobile app for both iOS and Android. Users should be able to log workouts, track calories, set goals, and connect with friends. We want to integrate with popular fitness wearables like Apple Watch and Fitbit.

Requirements: Cross-platform development (React Native preferred), Integration with HealthKit and Google Fit, Social features (friend connections, challenges), In-app purchases for premium features, Push notifications for workout reminders, Offline mode capability',
  'high',
  'qualified',
  'Client has a solid budget and clear requirements. Scheduled discovery call for Jan 25th. They seem serious and have funding in place.',
  '2026-01-25'
);

-- Sample Service Inquiry 3: Contacted - Web Development
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, responded_at
) VALUES (
  (SELECT id FROM services WHERE slug = 'web-development' LIMIT 1),
  'Emily Rodriguez',
  'emily@greenleafdesigns.com',
  '+1 (555) 234-5678',
  'GreenLeaf Designs',
  'https://greenleafdesigns.com',
  '$5,000 - $10,000',
  'Flexible (3-4 months)',
  'We are an interior design company looking to create a portfolio website to showcase our projects. We need a clean, modern design with a focus on large, beautiful images. Also need a blog section and contact form.

Requirements: Portfolio gallery with filtering by room type, Blog with categories and tags, Contact form with appointment booking, SEO optimization, Content management system for easy updates, Integration with Instagram feed',
  'medium',
  'contacted',
  'Initial call went well. They want to see portfolio examples and get a detailed proposal. Budget is on the lower end but scope is reasonable.

Response sent to client with proposal overview and scheduled follow-up for Tuesday 2 PM.',
  '2026-01-20 14:30:00'
);

-- Sample Service Inquiry 4: Accepted - Consulting Service (Won!)
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, responded_at
) VALUES (
  (SELECT id FROM services WHERE slug = 'consulting' LIMIT 1),
  'David Thompson',
  'david.thompson@megacorp.com',
  '+1 (555) 345-6789',
  'MegaCorp Solutions',
  'https://megacorp.com',
  '$5,000 - $10,000',
  'Immediate',
  'Our development team needs consulting on best practices for implementing a microservices architecture. We are currently running a monolithic application and want to gradually migrate to microservices. Need guidance on architecture, deployment strategies, and tech stack recommendations.

Requirements: Architecture review and recommendations, Microservices design patterns, CI/CD pipeline setup, Docker and Kubernetes guidance, Database strategy for microservices, Team training sessions',
  'high',
  'accepted',
  'Great client! Signed contract for 10 consulting sessions. Starting next week. Payment received. This will be a good case study.',
  '2026-01-18 10:15:00'
);

-- Sample Service Inquiry 5: New - Training Service
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status
) VALUES (
  (SELECT id FROM services WHERE slug = 'training' LIMIT 1),
  'Amanda Foster',
  'amanda@codecademy-corp.com',
  '+1 (555) 456-7890',
  'CodeAcademy Corp',
  'https://codecademycorp.com',
  '$2,500 - $5,000',
  'Within 1 month',
  'Looking for a React training workshop for our team of 12 developers. Most have JavaScript experience but are new to React. We need a comprehensive 2-day workshop covering React fundamentals, hooks, state management, and best practices.

Requirements: In-person or virtual training (prefer in-person), 2-day intensive workshop, Hands-on coding exercises, Real-world project examples, Post-training support for 1 month, Training materials and resources provided',
  'medium',
  'new'
);

-- Sample Service Inquiry 6: New - Mobile App (Low Priority)
INSERT INTO service_inquiries (
  service_id, name, email, phone, company,
  budget_range, timeline, message, urgency, status
) VALUES (
  (SELECT id FROM services WHERE slug = 'mobile-apps' LIMIT 1),
  'James Wilson',
  'james.wilson@personalproject.com',
  '+1 (555) 567-8901',
  'Personal Project',
  '$5,000 - $10,000',
  'No rush (6+ months)',
  'Personal project idea for a meal planning app. Users can save recipes, generate shopping lists, and plan meals for the week. Would like to start with MVP and add features over time.

Requirements: Recipe database with search, Shopping list generator, Meal calendar/planner, User accounts, Simple and clean UI, Mobile-first design',
  'low',
  'new'
);

-- Sample Service Inquiry 7: Declined - Too Low Budget
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, responded_at
) VALUES (
  (SELECT id FROM services WHERE slug = 'web-development' LIMIT 1),
  'Tom Bradley',
  'tom@smallbiz.com',
  '+1 (555) 678-9012',
  'Small Business Co',
  'https://smallbiz.com',
  'Under $1,000',
  'ASAP',
  'Need a full e-commerce website with payment processing, inventory management, customer accounts, and shipping integration. Budget is tight but project is urgent.',
  'urgent',
  'declined',
  'Budget way too low for scope. Politely declined and recommended alternative solutions (Shopify, WooCommerce). Sent helpful resources.',
  '2026-01-19 16:45:00'
);

-- Sample Service Inquiry 8: New - Consulting (Just submitted)
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status
) VALUES (
  (SELECT id FROM services WHERE slug = 'consulting' LIMIT 1),
  'Lisa Martinez',
  'lisa.martinez@innovatetech.io',
  '+1 (555) 789-0123',
  'InnovateTech',
  'https://innovatetech.io',
  '$2,500 - $5,000',
  'Within 2 weeks',
  'Need performance optimization consulting for our React application. The app has grown significantly and is now experiencing slow load times and laggy interactions. Looking for expert advice on optimization strategies and implementation help.

Requirements: Performance audit of existing codebase, Identification of bottlenecks, Code splitting recommendations, Lazy loading implementation, State management optimization, Bundle size reduction strategies',
  'urgent',
  'new'
);

-- Sample Service Inquiry 9: Proposal Sent - Web Development
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, follow_up_date
) VALUES (
  (SELECT id FROM services WHERE slug = 'web-development' LIMIT 1),
  'Robert Lee',
  'robert@legalfirm.com',
  '+1 (555) 890-1234',
  'Lee & Associates Law Firm',
  'https://leelaw.com',
  '$10,000 - $25,000',
  'Within 3 months',
  'Law firm website redesign. Current site is outdated and not mobile-friendly. Need modern, professional design with practice area pages, attorney bios, blog, and contact forms. GDPR compliance is important.

Requirements: Professional design matching legal industry standards, Attorney profiles with photos and bios, Practice area pages with detailed information, Blog/news section, Contact forms with encryption, Client portal for document sharing, GDPR/privacy compliance, SEO optimization for legal keywords',
  'medium',
  'proposal_sent',
  'Reviewing requirements and preparing proposal. They seem professional and have realistic budget. Good fit for our services. Proposal sent on Jan 20th.',
  '2026-01-27'
);

-- Sample Service Inquiry 10: Qualified - Training (High Priority)
INSERT INTO service_inquiries (
  service_id, name, email, phone, company, website,
  budget_range, timeline, message, urgency, status, notes, follow_up_date
) VALUES (
  (SELECT id FROM services WHERE slug = 'training' LIMIT 1),
  'Patricia Anderson',
  'patricia@edutech.org',
  '+1 (555) 901-2345',
  'EduTech Organization',
  'https://edutech.org',
  '$5,000 - $10,000',
  'Within 1 month',
  'Need comprehensive Next.js training for our development team. We are transitioning from traditional React to Next.js for our new platform. Looking for 3-day workshop covering SSR, SSG, API routes, deployment, and best practices.

Requirements: 3-day intensive workshop, Team of 8 developers, Hands-on projects, SSR and SSG deep dive, API routes and serverless functions, Deployment strategies, Performance optimization, Real-world examples from production apps',
  'high',
  'qualified',
  'Interested in comprehensive training. Need to finalize dates. Budget approved. Sent initial training outline.',
  '2026-01-24'
);

-- Update services inquiries_count based on this seed data
UPDATE services 
SET inquiries_count = (
  SELECT COUNT(*) 
  FROM service_inquiries 
  WHERE service_inquiries.service_id = services.id
);

-- Verify the data
SELECT 
  si.name,
  si.email,
  si.company,
  s.name as service_name,
  si.budget_range,
  si.status,
  si.urgency,
  si.created_at
FROM service_inquiries si
JOIN services s ON si.service_id = s.id
ORDER BY si.created_at DESC;
