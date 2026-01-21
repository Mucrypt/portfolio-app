-- =========================================================
-- SEED DATA - 12 SAMPLE SHOP PRODUCTS FOR DEVELOPMENT
-- =========================================================
-- Mix of Templates, Components, Tools, and Affiliate Products

INSERT INTO shop_products (
  owner_user_id,
  title,
  slug,
  short_description,
  description,
  product_type,
  category,
  subcategory,
  thumbnail_url,
  image_urls,
  original_price,
  discounted_price,
  currency,
  affiliate_link,
  demo_url,
  download_url,
  file_size,
  file_format,
  version,
  features,
  specifications,
  tech_stack,
  compatibility,
  requirements,
  included_items,
  tags,
  rating,
  reviews_count,
  purchases_count,
  is_featured,
  is_published,
  is_bestseller,
  is_new,
  license_type,
  usage_rights,
  sort_order
) VALUES 

-- ========== TEMPLATES ==========

-- 1. SaaS Landing Page Template (Featured, Bestseller)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Modern SaaS Landing Page - Next.js 14 Template',
  'modern-saas-landing-page-nextjs-14',
  'Beautiful, conversion-optimized SaaS landing page built with Next.js 14, TypeScript, and Tailwind CSS. Perfect for startups.',
  'Launch your SaaS product with this stunning, professionally designed landing page template. Built with the latest Next.js 14 App Router, TypeScript, and Tailwind CSS, this template includes everything you need to convert visitors into customers.

Features include:
- Hero section with animated gradients
- Pricing tables with toggle (monthly/yearly)
- Feature showcases with animations
- Testimonials carousel
- FAQ accordion
- Newsletter signup
- Contact form
- Blog section
- SEO optimized
- Fully responsive
- Dark mode ready
- 90+ PageSpeed score

Perfect for SaaS products, startups, web apps, and digital products. Save weeks of development time and launch faster!',
  'digital',
  'Template',
  'Website Template',
  'https://picsum.photos/seed/template1/1200/675',
  ARRAY['https://picsum.photos/seed/template1a/1200/675', 'https://picsum.photos/seed/template1b/1200/675', 'https://picsum.photos/seed/template1c/1200/675'],
  149.00,
  49.00,
  'USD',
  NULL,
  'https://saas-template-demo.vercel.app',
  'https://storage.example.com/downloads/saas-template-v1.zip',
  '8.5 MB',
  'ZIP',
  'v1.2.0',
  ARRAY[
    'Built with Next.js 14 App Router',
    'TypeScript for type safety',
    'Tailwind CSS v4 styling',
    'Fully responsive design',
    'Dark mode support',
    'SEO optimized with metadata',
    'Animated UI components',
    'Pricing tables with Stripe ready',
    'Newsletter integration ready',
    'Contact form with validation',
    '90+ PageSpeed score',
    'Production-ready code'
  ],
  '{"pages": 8, "components": 45, "responsive": true, "darkMode": true, "animations": "Framer Motion", "forms": "React Hook Form"}'::jsonb,
  ARRAY['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  ARRAY['Next.js 14+', 'Node.js 18+', 'React 18+'],
  ARRAY[
    'Basic knowledge of Next.js and React',
    'Node.js 18+ installed',
    'Code editor (VS Code recommended)',
    'Git for version control'
  ],
  ARRAY[
    'Complete Next.js source code',
    'All components and layouts',
    '8 pre-built pages',
    'Tailwind configuration',
    'Documentation (PDF)',
    'Free lifetime updates',
    '6 months support'
  ],
  ARRAY['SaaS', 'Landing Page', 'Next.js', 'Template', 'TypeScript', 'Tailwind CSS', 'React', 'Startup'],
  4.9,
  127,
  453,
  true,
  true,
  true,
  false,
  'Commercial',
  'Use in unlimited personal and commercial projects. Resale or redistribution not allowed.',
  1
),

-- 2. Admin Dashboard Template
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Pro Admin Dashboard - React & TypeScript',
  'pro-admin-dashboard-react-typescript',
  'Complete admin dashboard template with authentication, charts, tables, forms, and more. Built with React, TypeScript, and Ant Design.',
  'Professional admin dashboard template perfect for web applications, SaaS products, and internal tools. Built with React 18, TypeScript, and Ant Design for a polished, production-ready interface.

Includes 30+ pages, 100+ components, authentication flows, data visualization with charts, advanced tables, form builders, and much more. Save months of development time!',
  'digital',
  'Template',
  'Dashboard Template',
  'https://picsum.photos/seed/template2/1200/675',
  ARRAY['https://picsum.photos/seed/template2a/1200/675', 'https://picsum.photos/seed/template2b/1200/675'],
  199.00,
  79.00,
  'USD',
  NULL,
  'https://admin-dashboard-demo.vercel.app',
  'https://storage.example.com/downloads/admin-dashboard-v2.zip',
  '12.3 MB',
  'ZIP',
  'v2.0.1',
  ARRAY[
    '30+ pre-built pages',
    '100+ reusable components',
    'Authentication flows (login, register, forgot password)',
    'User management system',
    'Role-based access control',
    'Data visualization with charts',
    'Advanced data tables',
    'Form builders and validation',
    'File upload with preview',
    'Email templates',
    'Dark/Light theme toggle',
    'RTL support'
  ],
  '{"pages": 30, "components": 100, "charts": "Recharts", "tables": "Ant Design Table", "forms": "React Hook Form"}'::jsonb,
  ARRAY['React 18', 'TypeScript', 'Ant Design', 'Recharts', 'React Router'],
  ARRAY['React 18+', 'TypeScript 5+'],
  ARRAY[
    'Intermediate React knowledge',
    'TypeScript basics',
    'Node.js and npm installed'
  ],
  ARRAY[
    'Complete source code',
    '30+ pages',
    '100+ components',
    'Authentication system',
    'Documentation',
    'Figma design files',
    'Lifetime updates'
  ],
  ARRAY['Admin Dashboard', 'React', 'TypeScript', 'Ant Design', 'Template', 'CMS', 'Management'],
  4.8,
  89,
  312,
  true,
  true,
  false,
  false,
  'Commercial',
  'Use in unlimited projects. Cannot resell as template.',
  2
),

-- 3. E-commerce Store Template
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Full-Stack E-commerce Store - Next.js & Stripe',
  'fullstack-ecommerce-store-nextjs-stripe',
  'Complete e-commerce solution with product management, cart, checkout, Stripe payments, and admin dashboard.',
  'Launch your online store in hours, not months! This complete e-commerce template includes everything: product catalog, shopping cart, secure checkout with Stripe, order management, customer accounts, and a powerful admin dashboard.

Built with Next.js 14, Supabase, and Stripe for payments. Production-ready and fully customizable.',
  'digital',
  'Template',
  'E-commerce Template',
  'https://picsum.photos/seed/template3/1200/675',
  ARRAY['https://picsum.photos/seed/template3a/1200/675', 'https://picsum.photos/seed/template3b/1200/675', 'https://picsum.photos/seed/template3c/1200/675'],
  299.00,
  99.00,
  'USD',
  NULL,
  'https://ecommerce-demo.vercel.app',
  'https://storage.example.com/downloads/ecommerce-v1.zip',
  '15.8 MB',
  'ZIP',
  'v1.5.0',
  ARRAY[
    'Complete e-commerce functionality',
    'Product catalog with search and filters',
    'Shopping cart with persistence',
    'Secure checkout with Stripe',
    'Customer authentication',
    'Order management',
    'Admin dashboard',
    'Product inventory management',
    'Discount codes',
    'Email notifications',
    'Responsive design',
    'SEO optimized product pages'
  ],
  '{"database": "Supabase", "payments": "Stripe", "emails": "Resend", "storage": "Supabase Storage"}'::jsonb,
  ARRAY['Next.js 14', 'React 18', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS'],
  ARRAY['Next.js 14+', 'Node.js 18+'],
  ARRAY[
    'Next.js development experience',
    'Stripe account for payments',
    'Supabase account for database',
    'Basic TypeScript knowledge'
  ],
  ARRAY[
    'Full source code',
    'Database schema',
    'Stripe integration',
    'Admin dashboard',
    'Email templates',
    'Setup guide',
    'Lifetime updates',
    '1 year support'
  ],
  ARRAY['E-commerce', 'Next.js', 'Stripe', 'Shop', 'Store', 'Online Store', 'Supabase'],
  4.7,
  64,
  187,
  false,
  true,
  false,
  true,
  'Commercial',
  'Use for unlimited stores. Cannot resell template.',
  3
),

-- ========== COMPONENTS ==========

-- 4. React UI Component Library (Featured)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Premium React UI Components - 150+ Components',
  'premium-react-ui-components-library',
  '150+ production-ready React components. Beautiful, accessible, and fully customizable. Built with TypeScript and Tailwind CSS.',
  'The ultimate React component library for building modern web applications. 150+ carefully crafted components including buttons, forms, modals, dropdowns, tabs, accordions, data tables, charts, and more.

Every component is:
- Built with TypeScript for type safety
- Fully accessible (WCAG 2.1)
- Customizable with Tailwind CSS
- Documented with Storybook
- Tested with Jest and React Testing Library
- Production-ready

Copy, paste, and customize. No npm install required. You own the code!',
  'digital',
  'Component',
  'UI Component Library',
  'https://picsum.photos/seed/component1/1200/675',
  ARRAY['https://picsum.photos/seed/component1a/1200/675', 'https://picsum.photos/seed/component1b/1200/675'],
  179.00,
  59.00,
  'USD',
  NULL,
  'https://ui-components-demo.vercel.app',
  'https://storage.example.com/downloads/ui-components-v3.zip',
  '6.2 MB',
  'ZIP',
  'v3.1.0',
  ARRAY[
    '150+ production-ready components',
    'TypeScript support',
    'Tailwind CSS styling',
    'Fully accessible (WCAG 2.1)',
    'Dark mode support',
    'Responsive design',
    'Interactive Storybook',
    'Copy & paste code',
    'No dependencies',
    'Customizable themes',
    'Regular updates',
    'Figma design system included'
  ],
  '{"components": 150, "framework": "React 18", "styling": "Tailwind CSS", "accessibility": "WCAG 2.1"}'::jsonb,
  ARRAY['React 18', 'TypeScript', 'Tailwind CSS', 'Storybook'],
  ARRAY['React 16.8+', 'Tailwind CSS 3+'],
  ARRAY[
    'React project setup',
    'Tailwind CSS installed',
    'Basic React knowledge'
  ],
  ARRAY[
    '150+ component source files',
    'TypeScript definitions',
    'Storybook documentation',
    'Figma design files',
    'Usage examples',
    'Lifetime updates'
  ],
  ARRAY['React', 'Components', 'UI Library', 'TypeScript', 'Tailwind CSS', 'Accessible'],
  4.9,
  203,
  687,
  true,
  true,
  true,
  false,
  'Commercial',
  'Use in unlimited projects. Own the code. Cannot resell as component library.',
  4
),

-- 5. Form Builder Components
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Advanced Form Builder - React Components',
  'advanced-form-builder-react-components',
  'Drag-and-drop form builder components with validation, conditional logic, and multi-step forms. Save hours on complex forms.',
  'Build complex forms in minutes with this advanced form builder component package. Includes drag-and-drop form builder, 30+ field types, validation, conditional logic, multi-step forms, file uploads, and more.

Perfect for SaaS applications, admin dashboards, surveys, and any project requiring complex form functionality.',
  'digital',
  'Component',
  'Form Components',
  'https://picsum.photos/seed/component2/1200/675',
  ARRAY['https://picsum.photos/seed/component2a/1200/675'],
  129.00,
  45.00,
  'USD',
  NULL,
  'https://form-builder-demo.vercel.app',
  'https://storage.example.com/downloads/form-builder-v2.zip',
  '4.1 MB',
  'ZIP',
  'v2.3.0',
  ARRAY[
    'Drag-and-drop form builder',
    '30+ field types',
    'Validation with Zod',
    'Conditional logic',
    'Multi-step forms',
    'File upload with preview',
    'Signature pad',
    'Date/time pickers',
    'Rich text editor',
    'Auto-save functionality',
    'Export to JSON',
    'Mobile responsive'
  ],
  '{"fields": 30, "validation": "Zod", "dependencies": "minimal"}'::jsonb,
  ARRAY['React 18', 'TypeScript', 'React Hook Form', 'Zod'],
  ARRAY['React 18+'],
  ARRAY[
    'React project',
    'Basic form handling knowledge'
  ],
  ARRAY[
    'Form builder components',
    '30+ field components',
    'Validation schemas',
    'Examples',
    'Documentation'
  ],
  ARRAY['Form Builder', 'React', 'Components', 'Validation', 'Multi-step'],
  4.7,
  76,
  234,
  false,
  true,
  false,
  false,
  'Commercial',
  'Use in unlimited projects.',
  5
),

-- ========== TOOLS ==========

-- 6. Code Snippet Manager Chrome Extension (Featured, New)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'DevSnippets - Code Snippet Manager for Chrome',
  'devsnippets-code-snippet-manager-chrome',
  'Powerful Chrome extension for developers to save, organize, and quickly access code snippets. Supports 50+ languages with syntax highlighting.',
  'Stop wasting time searching for that code snippet you wrote last month! DevSnippets is a powerful Chrome extension that helps developers save, organize, and quickly access code snippets.

Features:
- Save unlimited code snippets
- Organize with tags and folders
- Syntax highlighting for 50+ languages
- Quick search with keyboard shortcuts
- Sync across devices
- Export/import snippets
- Dark mode
- One-click copy to clipboard

Perfect for developers who want to boost productivity and never lose important code snippets again!',
  'digital',
  'Tool',
  'Browser Extension',
  'https://picsum.photos/seed/tool1/1200/675',
  ARRAY['https://picsum.photos/seed/tool1a/1200/675', 'https://picsum.photos/seed/tool1b/1200/675'],
  29.00,
  19.00,
  'USD',
  NULL,
  'https://chrome.google.com/webstore/devsnippets',
  'https://storage.example.com/downloads/devsnippets-v1.zip',
  '1.8 MB',
  'ZIP (Chrome Extension)',
  'v1.4.2',
  ARRAY[
    'Save unlimited snippets',
    'Syntax highlighting (50+ languages)',
    'Tag-based organization',
    'Folder structure',
    'Quick search (Ctrl+Shift+S)',
    'Cloud sync',
    'Export/Import',
    'Dark/Light mode',
    'One-click copy',
    'Keyboard shortcuts',
    'Markdown support',
    'Privacy-focused (local storage)'
  ],
  '{"platform": "Chrome", "languages": 50, "storage": "Local + Cloud sync optional"}'::jsonb,
  ARRAY['JavaScript', 'Chrome Extension API', 'IndexedDB'],
  ARRAY['Chrome 90+', 'Chromium-based browsers (Edge, Brave)'],
  ARRAY[
    'Chrome or Chromium-based browser',
    'Google account for sync (optional)'
  ],
  ARRAY[
    'Chrome extension files',
    'Source code',
    'Installation guide',
    'User manual',
    'Future updates'
  ],
  ARRAY['Chrome Extension', 'Code Snippets', 'Developer Tool', 'Productivity', 'JavaScript'],
  4.8,
  341,
  1256,
  true,
  true,
  true,
  true,
  'Personal',
  'Personal use license. Cannot redistribute.',
  6
),

-- 7. API Testing Tool
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'API Tester Pro - Desktop Application',
  'api-tester-pro-desktop-application',
  'Beautiful Electron-based API testing tool. Test REST APIs, GraphQL, WebSockets. Better than Postman for individual developers.',
  'A lightweight, beautiful API testing tool built with Electron. Perfect for developers who want a simpler, faster alternative to Postman.

Test REST APIs, GraphQL queries, and WebSockets. Save collections, environment variables, and share with your team. All your data stays local - complete privacy!',
  'digital',
  'Tool',
  'Desktop Application',
  'https://picsum.photos/seed/tool2/1200/675',
  ARRAY['https://picsum.photos/seed/tool2a/1200/675'],
  49.00,
  29.00,
  'USD',
  NULL,
  'https://apitester.pro',
  'https://storage.example.com/downloads/api-tester-v1.zip',
  '85.4 MB',
  'DMG/EXE (Mac/Windows)',
  'v1.2.0',
  ARRAY[
    'REST API testing',
    'GraphQL support',
    'WebSocket testing',
    'Collections & folders',
    'Environment variables',
    'Request history',
    'Code generation (cURL, JS, Python)',
    'Dark/Light theme',
    'Offline-first',
    'No account required',
    'Data stays local',
    'Fast & lightweight'
  ],
  '{"platform": "Electron", "OS": "Mac, Windows, Linux", "storage": "Local"}'::jsonb,
  ARRAY['Electron', 'React', 'TypeScript'],
  ARRAY['macOS 10.15+', 'Windows 10+', 'Linux'],
  ARRAY[
    'macOS, Windows, or Linux computer'
  ],
  ARRAY[
    'Desktop application (Mac)',
    'Desktop application (Windows)',
    'Installation guide',
    'User documentation',
    'Free updates for 1 year'
  ],
  ARRAY['API Testing', 'REST', 'GraphQL', 'Developer Tool', 'Electron'],
  4.6,
  92,
  387,
  false,
  true,
  false,
  false,
  'Personal',
  'Single user license. Cannot redistribute.',
  7
),

-- ========== AFFILIATE PRODUCTS ==========

-- 8. MacBook Pro M3 - Amazon Affiliate (Featured, Bestseller)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Apple MacBook Pro 14" M3 Chip (2024)',
  'apple-macbook-pro-14-m3-chip-2024',
  'Supercharged for pros. The most advanced Mac laptop ever. M3 chip with 8-core CPU, 10-core GPU, 16GB unified memory.',
  'The MacBook Pro with M3 chip is a game-changer for developers, designers, and creators. Incredibly fast performance, stunning Liquid Retina XDR display, all-day battery life, and extensive connectivity.

Perfect for:
- Software development (runs Docker, IDEs, VMs smoothly)
- Web development (fast build times)
- Design work (Adobe Creative Suite, Figma)
- Video editing (Final Cut Pro, DaVinci Resolve)
- Music production (Logic Pro, Ableton)

Key specs:
- M3 chip (8-core CPU, 10-core GPU)
- 16GB unified memory
- 512GB SSD storage
- 14.2" Liquid Retina XDR display
- Up to 22 hours battery life
- Three Thunderbolt 4 ports
- HDMI port, SDXC card slot
- 1080p FaceTime HD camera
- Six-speaker sound system
- macOS Sonoma

This is the laptop I use daily for development. Highly recommended!',
  'affiliate',
  'Other',
  'Laptop',
  'https://picsum.photos/seed/affiliate1/1200/675',
  ARRAY['https://picsum.photos/seed/affiliate1a/1200/675', 'https://picsum.photos/seed/affiliate1b/1200/675', 'https://picsum.photos/seed/affiliate1c/1200/675'],
  1999.00,
  1899.00,
  'USD',
  'https://www.amazon.com/dp/B0CM5JV26D?tag=YOUR_AMAZON_AFFILIATE_TAG',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  ARRAY[
    'M3 chip with 8-core CPU',
    '10-core GPU for graphics',
    '16GB unified memory',
    '512GB SSD storage',
    '14.2" Liquid Retina XDR display',
    'Up to 22 hours battery life',
    'Three Thunderbolt 4 ports',
    'HDMI and SDXC card slot',
    '1080p camera with studio mics',
    'macOS Sonoma'
  ],
  '{"processor": "M3 (8-core CPU)", "memory": "16GB", "storage": "512GB SSD", "display": "14.2 inch Liquid Retina XDR", "graphics": "10-core GPU", "battery": "22 hours", "weight": "1.55 kg"}'::jsonb,
  NULL,
  NULL,
  NULL,
  ARRAY[
    'MacBook Pro 14"',
    'USB-C to MagSafe 3 cable',
    '70W USB-C Power Adapter',
    'User guide',
    '1-year Apple warranty'
  ],
  ARRAY['MacBook', 'Laptop', 'Apple', 'M3 Chip', 'Developer', 'Mac', 'Computer'],
  4.9,
  2847,
  8934,
  true,
  true,
  true,
  false,
  NULL,
  NULL,
  8
),

-- 9. LG UltraWide Monitor - Amazon Affiliate
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'LG 34" UltraWide Monitor (3440x1440) for Developers',
  'lg-34-ultrawide-monitor-3440x1440',
  '34-inch curved ultrawide monitor with QHD resolution. Perfect for developers who want more screen real estate. USB-C connectivity.',
  'Upgrade your development setup with this stunning 34" ultrawide monitor from LG. The 21:9 aspect ratio gives you the equivalent of two 27" monitors side by side - perfect for having your code editor, browser, and terminal open simultaneously.

Key features:
- 34" curved IPS display
- 3440 x 1440 QHD resolution
- 99% sRGB color gamut
- HDR10 support
- 75Hz refresh rate
- 5ms response time
- USB-C (60W power delivery)
- HDMI x2, DisplayPort
- Height adjustable stand
- AMD FreeSync
- OnScreen Control software

Perfect for:
- Software developers (more code on screen)
- Designers (wide canvas)
- Video editors (timeline view)
- Multitaskers (multiple windows)
- Gamers (immersive experience)

This is the monitor I use daily. The ultrawide format is a game-changer for productivity!',
  'affiliate',
  'Other',
  'Monitor',
  'https://picsum.photos/seed/affiliate2/1200/675',
  ARRAY['https://picsum.photos/seed/affiliate2a/1200/675', 'https://picsum.photos/seed/affiliate2b/1200/675'],
  599.99,
  449.99,
  'USD',
  'https://www.amazon.com/dp/B07YGZ7C1K?tag=YOUR_AMAZON_AFFILIATE_TAG',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  ARRAY[
    '34-inch curved ultrawide display',
    '3440 x 1440 QHD resolution',
    'IPS panel with 99% sRGB',
    'HDR10 support',
    '75Hz refresh rate',
    'USB-C with 60W power delivery',
    'HDMI x2, DisplayPort inputs',
    'Height & tilt adjustable',
    'AMD FreeSync',
    'OnScreen Control software',
    'Picture-by-Picture mode',
    'VESA mount compatible'
  ],
  '{"size": "34 inches", "resolution": "3440 x 1440", "panel": "IPS", "curve": "1900R", "refresh_rate": "75Hz", "response_time": "5ms", "brightness": "300 cd/m2", "contrast": "1000:1"}'::jsonb,
  NULL,
  ARRAY['HDMI cable included', 'USB-C cable sold separately', 'Compatible with Mac & PC'],
  NULL,
  ARRAY[
    'LG 34" UltraWide Monitor',
    'HDMI cable',
    'DisplayPort cable',
    'USB cable',
    'Power cable',
    'Stand base',
    'Quick setup guide'
  ],
  ARRAY['Monitor', 'Ultrawide', 'LG', 'Display', 'Developer Setup', 'Curved', 'USB-C'],
  4.7,
  3421,
  12678,
  false,
  true,
  false,
  false,
  NULL,
  NULL,
  9
),

-- 10. Mechanical Keyboard - Amazon Affiliate (Bestseller)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Keychron K8 Pro Mechanical Keyboard - Wireless',
  'keychron-k8-pro-mechanical-keyboard-wireless',
  'Premium wireless mechanical keyboard with hot-swappable switches, RGB backlight, and Mac/Windows compatibility. Perfect for developers.',
  'The Keychron K8 Pro is the ultimate mechanical keyboard for developers and writers. Hot-swappable switches, wireless connectivity, Mac/Windows support, and premium build quality.

Features:
- Hot-swappable mechanical switches (choose your preference)
- Wireless (Bluetooth 5.1) + Wired USB-C
- 87 keys (tenkeyless layout)
- RGB backlight (18 effects)
- Mac & Windows compatible
- Programmable keys (QMK/VIA)
- 4000mAh battery (up to 240 hours)
- Premium aluminum frame
- Double-shot PBT keycaps
- Gasket mount design
- Available switches: Red, Blue, Brown

Why developers love it:
- Tactile feedback improves typing accuracy
- Wireless means clean desk setup
- Hot-swap lets you try different switches
- Programmable keys for custom shortcuts
- Works perfectly with Mac (I use it daily!)

The typing experience is incredible. Best keyboard I''ve ever used!',
  'affiliate',
  'Other',
  'Keyboard',
  'https://picsum.photos/seed/affiliate3/1200/675',
  ARRAY['https://picsum.photos/seed/affiliate3a/1200/675', 'https://picsum.photos/seed/affiliate3b/1200/675'],
  109.00,
  89.00,
  'USD',
  'https://www.amazon.com/dp/B0BRTCJN8M?tag=YOUR_AMAZON_AFFILIATE_TAG',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  ARRAY[
    'Hot-swappable mechanical switches',
    'Wireless Bluetooth 5.1 + USB-C',
    '87 keys (TKL layout)',
    'RGB backlight (18 effects)',
    'Mac & Windows compatible',
    'QMK/VIA programmable',
    '4000mAh battery (240 hours)',
    'Aluminum frame',
    'Double-shot PBT keycaps',
    'Gasket mount design',
    'N-key rollover',
    'Switch options: Red, Blue, Brown'
  ],
  '{"layout": "TKL (87 keys)", "connectivity": "Bluetooth 5.1 + USB-C", "battery": "4000mAh", "material": "Aluminum frame", "keycaps": "PBT double-shot", "compatibility": "Mac, Windows, Linux"}'::jsonb,
  NULL,
  ARRAY['Works with Mac, Windows, Linux', 'Bluetooth 5.1 or USB-C connection'],
  NULL,
  ARRAY[
    'Keychron K8 Pro keyboard',
    'USB-C to USB-C cable',
    'USB-C to USB-A adapter',
    'Keycap puller',
    'Switch puller',
    'User manual',
    '1-year warranty'
  ],
  ARRAY['Mechanical Keyboard', 'Keychron', 'Wireless', 'Developer', 'Hot-swap', 'RGB'],
  4.8,
  1567,
  5432,
  false,
  true,
  true,
  false,
  NULL,
  NULL,
  10
),

-- 11. Figma to Code Tool (New)
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Figma to React/Vue/HTML - Code Generator Plugin',
  'figma-to-react-vue-html-code-generator',
  'Figma plugin that converts your designs to clean React, Vue, or HTML code. Save hours on implementation. Export to TypeScript.',
  'Transform your Figma designs into production-ready code in seconds! This powerful Figma plugin generates clean, semantic code for React, Vue, or HTML/CSS.

Features:
- Export to React (with TypeScript)
- Export to Vue 3 (with TypeScript)
- Export to HTML/CSS
- Tailwind CSS support
- Responsive code generation
- Component splitting
- Props generation
- Clean, readable code
- Copy or download
- Batch export

Perfect for:
- Frontend developers converting designs to code
- Design systems implementation
- Rapid prototyping
- Reducing handoff time between design and development

Stop wasting hours translating designs to code. Get pixel-perfect code in seconds!',
  'digital',
  'Tool',
  'Figma Plugin',
  'https://picsum.photos/seed/tool3/1200/675',
  ARRAY['https://picsum.photos/seed/tool3a/1200/675'],
  79.00,
  39.00,
  'USD',
  NULL,
  'https://figma-to-code-demo.com',
  'https://storage.example.com/downloads/figma-to-code-plugin.zip',
  '2.3 MB',
  'Figma Plugin',
  'v2.1.0',
  ARRAY[
    'Export to React + TypeScript',
    'Export to Vue 3 + TypeScript',
    'Export to HTML/CSS',
    'Tailwind CSS support',
    'Responsive code generation',
    'Auto component detection',
    'Props generation',
    'Clean, semantic code',
    'Batch export',
    'Copy or download',
    'Preserves naming conventions',
    'Style optimization'
  ],
  '{"exports": ["React", "Vue", "HTML"], "styling": ["CSS", "Tailwind CSS"], "typescript": true}'::jsonb,
  ARRAY['JavaScript', 'TypeScript', 'Figma Plugin API'],
  ARRAY['Figma Desktop or Web'],
  ARRAY[
    'Figma account (free or paid)',
    'Basic understanding of React/Vue/HTML'
  ],
  ARRAY[
    'Figma plugin',
    'Installation guide',
    'Video tutorials',
    'Code examples',
    '6 months updates',
    'Email support'
  ],
  ARRAY['Figma', 'Code Generator', 'React', 'Vue', 'Plugin', 'Design to Code'],
  4.6,
  134,
  456,
  false,
  true,
  false,
  true,
  'Commercial',
  'Use generated code in unlimited projects. Cannot resell plugin.',
  11
),

-- 12. Notion Templates Pack
(
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Developer Productivity Pack - 20 Notion Templates',
  'developer-productivity-pack-notion-templates',
  '20 professional Notion templates for developers: project tracker, code snippets, learning resources, resume, portfolio, and more.',
  'Boost your productivity with this comprehensive collection of 20 Notion templates designed specifically for developers.

Included templates:
1. Project Tracker & Roadmap
2. Code Snippets Library
3. Learning Resources Hub
4. Technical Documentation
5. Bug Tracker
6. Daily Standup Notes
7. Interview Preparation
8. Resume & Portfolio
9. Job Applications Tracker
10. Personal Wiki
11. Meeting Notes
12. Weekly Planner
13. Goal Setting & OKRs
14. Reading List
15. Tech Stack Evaluator
16. Side Projects Dashboard
17. Freelance Client Manager
18. Time Tracking
19. Expense Tracker
20. Knowledge Base

All templates are:
- Fully customizable
- Beautifully designed
- Mobile-friendly
- Pre-built with best practices
- Ready to duplicate

Save hours of setup time and stay organized!',
  'digital',
  'Template',
  'Notion Template',
  'https://picsum.photos/seed/template4/1200/675',
  ARRAY['https://picsum.photos/seed/template4a/1200/675', 'https://picsum.photos/seed/template4b/1200/675'],
  49.00,
  19.00,
  'USD',
  NULL,
  'https://notion.so/templates/preview',
  NULL,
  'N/A (Notion)',
  'Notion Template',
  'v1.0',
  ARRAY[
    '20 professional templates',
    'Designed for developers',
    'Fully customizable',
    'Beautiful design',
    'Mobile-friendly',
    'Duplicate to your workspace',
    'Video walkthroughs',
    'Lifetime access',
    'Free updates'
  ],
  '{"templates": 20, "platform": "Notion", "customizable": true}'::jsonb,
  NULL,
  ARRAY['Notion account (free or paid)'],
  NULL,
  ARRAY[
    '20 Notion template links',
    'Setup guide (PDF)',
    'Video tutorials',
    'Customization tips',
    'Lifetime access',
    'Future template additions'
  ],
  ARRAY['Notion', 'Templates', 'Productivity', 'Developer', 'Organization'],
  4.7,
  298,
  892,
  false,
  true,
  false,
  false,
  'Personal',
  'Personal use. Cannot resell templates.',
  12
);
