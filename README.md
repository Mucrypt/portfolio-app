# 🚀 Professional Portfolio & CMS Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-326CE5?style=for-the-badge&logo=kubernetes)
![AWS](https://img.shields.io/badge/AWS-EKS-FF9900?style=for-the-badge&logo=amazon-aws)

A modern, production-ready full-stack portfolio website with powerful admin CMS, CI/CD pipelines, and enterprise-grade deployment on AWS EKS. Built with Next.js 16, React 19, TypeScript, and Supabase.

[Live Demo](https://romeomukulah.org) • [Documentation](#-documentation) • [Deploy Guide](docs/CICD.md) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Features

### 🎨 **Public-Facing Portfolio**
- 🏠 **Modern Homepage** - Engaging hero section with smooth animations (GSAP)
- 📝 **Dynamic Blog** - Markdown support with syntax highlighting and rich content
- 💼 **Services Showcase** - Detailed service pages with inquiry forms
- 🚀 **Project Portfolio** - Showcase your work with case studies and demos
- 🎓 **Courses Platform** - Display and manage educational content
- 🛍️ **E-commerce Shop** - Full product catalog with detailed pages
- 📧 **Contact System** - Professional contact forms with inquiry management
- 🌓 **Dark Mode** - Seamless light/dark theme switching
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes

### 🔐 **Admin Dashboard & CMS**
- 📊 **Comprehensive Dashboard** - Overview of all content and analytics
- ✍️ **Blog Management** - Create, edit, publish posts with Markdown editor
- ⚡ **Services Admin** - Manage service offerings, pricing, and features
- 📩 **Inquiry Management** - Track and respond to service inquiries with status workflow
- 🔔 **Real-time Notifications** - Auto-refresh inquiry count (every 30s)
- 🛍️ **Shop Management** - Full product CRUD with inventory tracking
- 🚀 **Projects Admin** - Manage portfolio projects with gallery support
- 🎓 **Course Management** - Create and organize educational content
- 👤 **Profile Management** - Update personal and professional information
- 💡 **Skills Manager** - Organize technical skills and competencies
- 💼 **Experience Tracking** - Manage work history and achievements
- 🎓 **Education Records** - Academic background management
- 🖼️ **Media Library** - Centralized asset management

### 🎯 **Key Highlights**
- ⚡ **Server-Side Rendering** - Blazing-fast performance with Next.js App Router
- 🔒 **Authentication** - Secure admin access with Supabase Auth
- 🗄️ **Database Management** - PostgreSQL with comprehensive schemas
- 🎨 **Modern UI/UX** - Beautiful components with Tailwind CSS v4
- 📱 **Progressive Enhancement** - Works perfectly without JavaScript
- 🔄 **Real-time Updates** - Live data synchronization
- 🎭 **Animations** - Smooth transitions with GSAP
- 🌐 **SEO Optimized** - Meta tags, OpenGraph, structured data
- 📊 **Analytics Ready** - View counts, inquiry tracking, engagement metrics

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16.1.4 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP 3.14
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Markdown:** React Markdown with syntax highlighting

### **Backend & Database**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage (optional)
- **ORM:** Supabase Client

### **Developer Experience**
- **Package Manager:** npm
- **Linting:** ESLint with Next.js config
- **Type Safety:** TypeScript strict mode
- **Code Quality:** Prettier (via Tailwind)

---

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- Supabase account (free tier works!)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/portfolio-app.git
cd portfolio-app
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Add your custom environment variables
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to Settings > API
4. Copy your `Project URL` and `anon/public` key

### 4. Database Setup
Run the SQL schemas in your Supabase SQL Editor (in order):

```bash
# Navigate to database folder
cd database

# Execute these files in Supabase SQL Editor:
1. blog_schema.sql           # Blog posts and categories
2. services_schema.sql       # Services, inquiries, reviews
3. shop_schema.sql          # Products, categories, inventory
4. courses_schema.sql       # Courses and learning content

# Optional: Load seed data
5. seed_blog_data.sql
6. seed_services_data.sql
7. seed_service_inquiries_clean.sql
8. seed_shop_products.sql
9. seed_courses.sql
```

**💡 Tip:** You can also use Supabase CLI for migrations:
```bash
supabase db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Usage

### Access Admin Dashboard
1. Navigate to `/login`
2. Sign in with your Supabase credentials
3. Access admin at `/admin`

### Managing Content

#### **Blog Posts**
- Create new posts with Markdown support
- Add featured images and categories
- Publish/unpublish with one click
- View post analytics (views, engagement)

#### **Services**
- Add service offerings with detailed descriptions
- Set pricing tiers and packages
- Manage service inquiries with status tracking
- Receive real-time notifications for new inquiries

#### **Projects**
- Showcase portfolio work with galleries
- Add case studies and demos
- Link to live projects and GitHub repos

#### **Shop Products**
- Create product listings with variants
- Manage inventory and pricing
- Track sales and analytics

---

## 📁 Project Structure

```
portfolio-app/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public-facing pages
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── blog/               # Blog listing & posts
│   │   ├── services/           # Services showcase
│   │   ├── projects/           # Project portfolio
│   │   ├── courses/            # Courses catalog
│   │   ├── shop/               # E-commerce store
│   │   └── contact/            # Contact page
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── blog/               # Blog management
│   │   ├── services/           # Services & inquiries
│   │   ├── projects/           # Projects admin
│   │   ├── shop/               # Shop management
│   │   ├── courses/            # Course management
│   │   ├── skills/             # Skills manager
│   │   ├── experiences/        # Work experience
│   │   ├── education/          # Education records
│   │   ├── profile/            # Profile settings
│   │   └── media/              # Media library
│   ├── api/                     # API routes
│   ├── login/                   # Authentication
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── admin/                  # Admin-specific components
│   │   ├── AdminHeader.tsx
│   │   └── Sidebar.tsx
│   └── ui/                     # Reusable UI components
├── database/                    # SQL schemas & seeds
│   ├── blog_schema.sql
│   ├── services_schema.sql
│   ├── shop_schema.sql
│   ├── courses_schema.sql
│   └── seed_*.sql             # Seed data files
├── lib/                        # Utility functions
│   └── supabase/              # Supabase client setup
├── types/                      # TypeScript type definitions
├── public/                     # Static assets
├── middleware.ts               # Auth middleware
└── package.json               # Dependencies
```

---

## 🎨 Customization

### Branding
Update site metadata in `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Your Name - Portfolio",
  description: "Your professional tagline",
};
```

### Styling
- Modify Tailwind configuration in `tailwind.config.ts`
- Update global styles in `app/globals.css`
- Customize component styles with Tailwind classes

### Features
- Add new admin sections by creating folders in `app/admin/`
- Create new public pages in `app/(public)/`
- Extend database schemas in `database/` folder

---

## 🔐 Authentication

The app uses Supabase Authentication with middleware protection:

- **Public routes:** Accessible to everyone
- **Protected routes:** `/admin/*` requires authentication
- **Middleware:** `middleware.ts` handles auth checks

To configure authentication:
1. Enable Email/Password auth in Supabase Dashboard
2. Add authorized users in Supabase Auth
3. Customize redirect URLs in Supabase settings

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Other Platforms
- **Netlify:** Works out of the box
- **Railway:** Full support
- **Cloudflare Pages:** Compatible
- **Self-hosted:** Use `npm run build` + `npm start`

---

## 📊 Database Schema Overview

### Core Tables
- **`blog_posts`** - Blog content with categories and tags
- **`services`** - Service offerings with full details
- **`service_inquiries`** - Client inquiries with status tracking
- **`service_reviews`** - Client testimonials
- **`shop_products`** - E-commerce products
- **`shop_categories`** - Product organization
- **`courses`** - Educational content
- **Additional tables** for projects, skills, experiences, education

All schemas include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Soft deletes where applicable
- Foreign key relationships
- Proper indexing for performance

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Romeo Mukula**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Website](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons

---

## 📞 Support

If you have any questions or need help:

- Open an [Issue](https://github.com/Mucrypt/portfolio-app/issues)
- Email: admin@romeomukulah.org
- Website: [romeomukulah.org](https://romeomukulah.org)

---

## 🗺️ Roadmap

- [x] Docker containerization (dev + production)
- [x] Nginx reverse proxy with SSL
- [x] GitHub Actions CI/CD pipelines
- [x] Kubernetes manifests and Helm charts
- [x] AWS EKS deployment configuration
- [x] Security scanning (Snyk, Trivy, SonarCloud)
- [ ] Prometheus + Grafana monitoring
- [ ] ELK stack for log aggregation
- [ ] Newsletter subscription system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Email notification system
- [ ] Comment system for blog
- [ ] Social media integration
- [ ] Advanced search functionality
- [ ] API documentation
- [ ] Automated testing suite

---

## 📚 Documentation

- **[DOCKER.md](docs/DOCKER.md)** - Complete Docker containerization guide
- **[CICD.md](docs/CICD.md)** - CI/CD pipelines and Kubernetes deployment
- **[GITHUB_SECRETS.md](docs/GITHUB_SECRETS.md)** - GitHub Actions secrets configuration
- **[helm/portfolio/README.md](helm/portfolio/README.md)** - Helm chart documentation

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Romeo Mukula](https://romeomukulah.org)


</div>
# Trigger rebuild with correct Supabase config
