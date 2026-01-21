-- =========================================================
-- BLOG SEED DATA - Sample Posts, Categories, and Comments
-- =========================================================
-- This file populates the blog system with realistic sample data
-- Run this AFTER blog_schema.sql has been executed

-- =========================================================
-- 1. BLOG CATEGORIES
-- =========================================================

INSERT INTO blog_categories (name, slug, description, icon, color, post_count) VALUES
('Web Development', 'web-development', 'Modern web technologies, frameworks, and best practices', '💻', '#3B82F6', 3),
('Mobile Apps', 'mobile-apps', 'iOS, Android, and cross-platform mobile development', '📱', '#8B5CF6', 1),
('DevOps', 'devops', 'CI/CD, infrastructure, deployment, and automation', '🚀', '#10B981', 2),
('Tutorials', 'tutorials', 'Step-by-step guides and learning resources', '📚', '#F59E0B', 4),
('Case Studies', 'case-studies', 'Real-world project experiences and lessons learned', '💼', '#EF4444', 1),
('News', 'news', 'Latest tech news and industry updates', '📰', '#EC4899', 1);

-- =========================================================
-- 2. BLOG POSTS
-- =========================================================

-- Post 1: TypeScript Tutorial (Featured)
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url, author_bio,
  title, slug, excerpt, content, content_format,
  featured_image_url, image_urls,
  category, subcategory, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  meta_title, meta_description, meta_keywords,
  is_published, is_featured, publish_date,
  code_language, allow_comments, allow_likes
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Full-stack developer passionate about TypeScript and modern web technologies',
  'Mastering TypeScript: From Basics to Advanced Types',
  'mastering-typescript-basics-to-advanced',
  'A comprehensive guide to TypeScript covering basic types, generics, utility types, and advanced patterns that will level up your TypeScript game.',
  '# Mastering TypeScript: From Basics to Advanced Types

TypeScript has become the de facto standard for building scalable JavaScript applications. In this comprehensive guide, we''ll explore TypeScript from the ground up.

## Why TypeScript?

TypeScript provides static typing, better tooling, and catches errors at compile time rather than runtime. Here''s a simple example:

```typescript
// Without TypeScript - runtime error
function greet(name) {
  return `Hello, ${name.toUpperCase()}`;
}
greet(123); // Runtime error!

// With TypeScript - compile-time error
function greet(name: string): string {
  return `Hello, ${name.toUpperCase()}`;
}
greet(123); // Error: Argument of type ''number'' is not assignable to parameter of type ''string''
```

## Basic Types

TypeScript offers several built-in types:

```typescript
let isDone: boolean = false;
let count: number = 42;
let username: string = "Romeo";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
```

## Interfaces and Type Aliases

Define object shapes using interfaces:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional property
}

const user: User = {
  id: "123",
  name: "Romeo Mukula",
  email: "romeo@example.com"
};
```

## Generics

Generics allow you to write reusable code:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>("Hello");
const output2 = identity<number>(42);
```

## Advanced: Utility Types

TypeScript provides powerful utility types:

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// Make all properties optional
type PartialTodo = Partial<Todo>;

// Make all properties readonly
type ReadonlyTodo = Readonly<Todo>;

// Pick specific properties
type TodoPreview = Pick<Todo, "title" | "completed">;

// Omit specific properties
type TodoInfo = Omit<Todo, "completed">;
```

## Conclusion

TypeScript is a powerful tool that enhances JavaScript development. Start with basic types, gradually adopt interfaces and generics, and eventually leverage advanced patterns.

Happy coding! 🚀',
  'markdown',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630',
  ARRAY[
    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
  ],
  'Tutorials', 'Programming Languages', 
  ARRAY['typescript', 'javascript', 'web-development', 'programming', 'tutorial'],
  12, 1247, 89, 15,
  'Mastering TypeScript: Complete Guide from Basics to Advanced',
  'Learn TypeScript from scratch with practical examples. Master basic types, generics, utility types, and advanced patterns in this comprehensive tutorial.',
  ARRAY['typescript', 'typescript tutorial', 'typescript generics', 'typescript types', 'learn typescript'],
  true, true, now() - INTERVAL '7 days',
  'typescript', true, true
);

-- Post 2: Next.js Tutorial
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, is_featured, publish_date,
  code_language, github_repo_url, demo_url,
  series_name, series_order
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Building a Full-Stack App with Next.js 14 App Router',
  'building-fullstack-app-nextjs-14-app-router',
  'Learn how to build a modern full-stack application using Next.js 14''s App Router, Server Components, and Server Actions.',
  '# Building a Full-Stack App with Next.js 14 App Router

Next.js 14 introduces powerful features like Server Components and Server Actions that revolutionize how we build full-stack applications.

## Project Setup

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## App Router Structure

```
app/
  layout.tsx       # Root layout
  page.tsx         # Home page
  about/
    page.tsx       # About page
  blog/
    page.tsx       # Blog listing
    [slug]/
      page.tsx     # Dynamic blog post
```

## Server Components (Default)

Server Components render on the server, reducing client-side JavaScript:

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

## Server Actions

Handle form submissions and mutations with Server Actions:

```typescript
// app/actions.ts
"use server"

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");
  
  // Save to database
  await db.insert({ title, content });
  
  revalidatePath("/posts");
}
```

## Conclusion

Next.js 14''s App Router provides a modern, efficient way to build full-stack applications with excellent developer experience.',
  'markdown',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&h=630',
  'Web Development', 
  ARRAY['nextjs', 'react', 'app-router', 'server-components', 'full-stack'],
  10, 892, 67, 12,
  true, true, now() - INTERVAL '5 days',
  'typescript',
  'https://github.com/romeo/nextjs-demo',
  'https://demo.example.com',
  'Next.js Mastery', 1
);

-- Post 3: React Hooks Deep Dive
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, publish_date,
  code_language,
  series_name, series_order
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'React Hooks Deep Dive: useState and useEffect',
  'react-hooks-deep-dive-usestate-useeffect',
  'Master the two most important React Hooks with practical examples and common patterns.',
  '# React Hooks Deep Dive: useState and useEffect

Hooks revolutionized React development. Let''s master the fundamentals.

## useState: Managing State

```typescript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## useEffect: Side Effects

```typescript
import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Re-run when userId changes
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}
```

## Common Patterns

**Cleanup Functions:**

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);
  
  // Cleanup
  return () => clearInterval(timer);
}, []);
```

Stay tuned for Part 2 covering useContext and useReducer!',
  'markdown',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630',
  'Tutorials', 
  ARRAY['react', 'hooks', 'usestate', 'useeffect', 'javascript'],
  8, 654, 45, 8,
  true, now() - INTERVAL '3 days',
  'typescript',
  'React Hooks Series', 1
);

-- Post 4: DevOps CI/CD Pipeline
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, is_pinned, publish_date,
  code_language, github_repo_url
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Setting Up a Modern CI/CD Pipeline with GitHub Actions',
  'modern-cicd-pipeline-github-actions',
  'Learn how to automate your deployment workflow with GitHub Actions, including testing, building, and deploying to production.',
  '# Setting Up a Modern CI/CD Pipeline with GitHub Actions

Automate everything! Let''s build a production-ready CI/CD pipeline.

## Why CI/CD?

- Automated testing on every commit
- Consistent builds
- Fast, reliable deployments
- Reduced human error

## Basic Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm run build
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == ''refs/heads/main''
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to prod..."
```

## Best Practices

1. **Test First**: Always run tests before deployment
2. **Environment Variables**: Use GitHub Secrets
3. **Conditional Deploys**: Only deploy from main branch
4. **Rollback Strategy**: Keep previous versions

## Conclusion

GitHub Actions makes CI/CD accessible to everyone. Start simple and iterate!',
  'markdown',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=630',
  'DevOps', 
  ARRAY['cicd', 'github-actions', 'devops', 'automation', 'deployment'],
  7, 445, 38, 6,
  true, true, now() - INTERVAL '2 days',
  'yaml',
  'https://github.com/romeo/cicd-demo'
);

-- Post 5: Mobile App Case Study
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, publish_date,
  cta_text, cta_url
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Building a React Native App: Lessons from 10,000 Users',
  'building-react-native-app-lessons-10000-users',
  'Real-world insights from scaling a React Native app to 10,000+ users, including performance optimization, state management, and deployment challenges.',
  '# Building a React Native App: Lessons from 10,000 Users

Last year, I built and launched a React Native app that grew to 10,000+ users. Here''s what I learned.

## The Stack

- **React Native** 0.72
- **Expo** for faster development
- **React Query** for server state
- **Zustand** for client state
- **Supabase** for backend

## Key Lessons

### 1. Performance Matters

Users expect native performance. We optimized:
- List rendering with `FlashList`
- Image loading with `react-native-fast-image`
- Navigation with native stack

### 2. Offline-First Approach

Implemented offline support early:
```typescript
const { data } = useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### 3. Testing is Critical

- Unit tests with Jest
- Component tests with Testing Library
- E2E tests with Detox
- Manual testing on real devices

## Metrics

- **10,000+** active users
- **4.8** star rating
- **<2s** average load time
- **<0.1%** crash rate

## Conclusion

Building for mobile requires discipline, but the React Native ecosystem makes it achievable.',
  'markdown',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630',
  'Case Studies', 
  ARRAY['react-native', 'mobile', 'case-study', 'expo', 'performance'],
  15, 1123, 94, 18,
  true, now() - INTERVAL '1 day',
  'View App on App Store', 'https://apps.apple.com/example'
);

-- Post 6: Docker Basics
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count,
  is_published, publish_date,
  code_language
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Docker for Beginners: Containerize Your Applications',
  'docker-beginners-containerize-applications',
  'A beginner-friendly introduction to Docker, covering containers, images, Dockerfiles, and docker-compose.',
  '# Docker for Beginners: Containerize Your Applications

Docker simplifies development and deployment. Let''s learn the basics.

## What is Docker?

Docker packages your application with all its dependencies into a container that runs consistently anywhere.

## Basic Concepts

- **Image**: Blueprint for containers
- **Container**: Running instance of an image
- **Dockerfile**: Instructions to build an image
- **Docker Compose**: Multi-container orchestration

## Your First Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## Build and Run

```bash
# Build image
docker build -t my-app .

# Run container
docker run -p 3000:3000 my-app
```

## Docker Compose

```yaml
version: ''3.8''
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
```

Start everything: `docker-compose up`

## Conclusion

Docker is essential for modern development. Start containerizing today!',
  'markdown',
  'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=630',
  'DevOps', 
  ARRAY['docker', 'containers', 'devops', 'tutorial', 'beginner'],
  6, 523, 42,
  true, now() - INTERVAL '12 hours',
  'dockerfile'
);

-- Post 7: AI News (Recent)
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, is_featured, publish_date
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'The Rise of AI-Powered Development Tools in 2026',
  'rise-of-ai-powered-development-tools-2026',
  'How AI is transforming software development with code generation, debugging assistance, and automated testing.',
  '# The Rise of AI-Powered Development Tools in 2026

AI is revolutionizing how we write code. Here''s what''s happening.

## Current State

AI tools are now mainstream:
- **GitHub Copilot**: Code completion
- **ChatGPT**: Problem solving
- **Cursor**: AI-first IDE
- **v0**: UI generation

## Impact on Developers

### Productivity Boost
Developers report 30-50% faster coding with AI assistance.

### New Skills Required
- Prompt engineering
- AI output validation
- Architecture thinking

### Changing Workflows
```
Old: Research → Code → Test → Debug
New: Describe → Review AI output → Refine → Test
```

## Concerns

- Code quality varies
- Over-reliance risks
- Security implications
- Job market impact

## The Future

AI won''t replace developers—it''ll augment them. Focus on:
- Problem-solving skills
- System design
- Code review abilities
- Domain expertise

## Conclusion

Embrace AI tools, but don''t lose fundamental skills. The best developers will leverage AI while maintaining deep technical knowledge.',
  'markdown',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630',
  'News', 
  ARRAY['ai', 'artificial-intelligence', 'developer-tools', 'github-copilot', '2026'],
  5, 2341, 156, 32,
  true, true, now() - INTERVAL '6 hours'
);

-- Post 8: Supabase Tutorial
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes, views_count, likes_count, comments_count,
  is_published, publish_date,
  code_language, github_repo_url, demo_url
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Building Real-Time Apps with Supabase and Next.js',
  'building-realtime-apps-supabase-nextjs',
  'Learn how to build real-time applications using Supabase''s PostgreSQL database with real-time subscriptions and Next.js.',
  '# Building Real-Time Apps with Supabase and Next.js

Supabase makes real-time features surprisingly simple. Let''s build a live chat.

## Setup Supabase

```bash
npm install @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## Database Schema

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Real-Time Subscription

```typescript
"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

## Sending Messages

```typescript
async function sendMessage(content: string) {
  const { error } = await supabase
    .from("messages")
    .insert({ content });
  
  if (error) console.error(error);
}
```

## Conclusion

Supabase + Next.js = Real-time magic with minimal code!',
  'markdown',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630',
  'Tutorials', 
  ARRAY['supabase', 'nextjs', 'real-time', 'postgresql', 'websockets'],
  9, 876, 71, 14,
  true, now() - INTERVAL '4 hours',
  'typescript',
  'https://github.com/romeo/supabase-realtime-demo',
  'https://realtime-demo.vercel.app'
);

-- Post 9: Draft Post (Not Published)
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  category, tags,
  reading_time_minutes,
  is_published, publish_date
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Advanced TypeScript Patterns (Coming Soon)',
  'advanced-typescript-patterns-coming-soon',
  'Deep dive into advanced TypeScript patterns including conditional types, mapped types, and template literal types.',
  '# Advanced TypeScript Patterns (Draft)

This post is currently being written. Check back soon!

Topics covered:
- Conditional Types
- Mapped Types
- Template Literal Types
- Recursive Types
- Brand Types

Coming soon...',
  'markdown',
  'Tutorials', 
  ARRAY['typescript', 'advanced', 'patterns'],
  15,
  false, now() + INTERVAL '7 days'
);

-- Post 10: Scheduled Post (Future Publish Date)
INSERT INTO blog_posts (
  author_user_id, author_name, author_avatar_url,
  title, slug, excerpt, content, content_format,
  featured_image_url,
  category, tags,
  reading_time_minutes,
  is_published, publish_date
) VALUES (
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Romeo',
  'Web Performance Optimization Guide',
  'web-performance-optimization-guide',
  'Essential techniques for optimizing web application performance including code splitting, lazy loading, and caching strategies.',
  '# Web Performance Optimization Guide

Performance is a feature. Let''s make your app blazing fast.

## Measuring Performance

Use Lighthouse and Core Web Vitals:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

## Optimization Techniques

### 1. Code Splitting
```typescript
// Dynamic imports
const Dashboard = dynamic(() => import("./Dashboard"), {
  loading: () => <Spinner />
});
```

### 2. Image Optimization
```tsx
<Image
  src="/hero.jpg"
  width={1200}
  height={630}
  alt="Hero"
  priority
/>
```

### 3. Caching
```typescript
export const revalidate = 3600; // Revalidate every hour
```

More details coming in the full post!',
  'markdown',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630',
  'Web Development', 
  ARRAY['performance', 'optimization', 'web-vitals', 'nextjs'],
  11,
  true, now() + INTERVAL '2 days'
);

-- =========================================================
-- 3. BLOG COMMENTS
-- =========================================================

-- Comments on Post 1 (TypeScript Tutorial)
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'mastering-typescript-basics-to-advanced'),
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'romeo@example.com',
  'Thanks for reading! Let me know if you have any questions about TypeScript.',
  true,
  12,
  now() - INTERVAL '6 days'
);

INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'mastering-typescript-basics-to-advanced'),
  NULL,
  'Sarah Johnson',
  'sarah@example.com',
  'Excellent tutorial! The section on utility types was especially helpful. Can you do a follow-up on decorators?',
  true,
  8,
  now() - INTERVAL '6 days 2 hours'
);

-- Nested reply to Sarah's comment
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, parent_comment_id, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'mastering-typescript-basics-to-advanced'),
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'romeo@example.com',
  'Great idea! I''ll add decorators to my content roadmap. Stay tuned!',
  (SELECT id FROM blog_comments WHERE author_name = 'Sarah Johnson' AND content LIKE 'Excellent tutorial%'),
  true,
  3,
  now() - INTERVAL '6 days 1 hour'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'mastering-typescript-basics-to-advanced'),
  'Mike Chen',
  'mike@example.com',
  'The generic examples really cleared things up for me. Bookmarked for future reference!',
  true,
  5,
  now() - INTERVAL '5 days'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'mastering-typescript-basics-to-advanced'),
  'Emily Davis',
  'emily@example.com',
  'Could you add more examples of conditional types? That''s where I struggle most.',
  false,
  now() - INTERVAL '4 days'
);

-- Comments on Post 2 (Next.js Tutorial)
INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-fullstack-app-nextjs-14-app-router'),
  'Alex Rodriguez',
  'alex@example.com',
  'Server Actions are game-changing! No more API routes for simple mutations.',
  true,
  15,
  now() - INTERVAL '4 days'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-fullstack-app-nextjs-14-app-router'),
  'Priya Sharma',
  'priya@example.com',
  'How do you handle error boundaries with Server Components? Great post btw!',
  true,
  6,
  now() - INTERVAL '4 days 6 hours'
);

-- Reply to Priya
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, parent_comment_id, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-fullstack-app-nextjs-14-app-router'),
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'romeo@example.com',
  'Great question! I''ll create a dedicated post on error handling in the App Router. Use error.tsx files for now.',
  (SELECT id FROM blog_comments WHERE author_name = 'Priya Sharma'),
  true,
  2,
  now() - INTERVAL '4 days 3 hours'
);

-- Comments on Post 5 (React Native Case Study)
INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-react-native-app-lessons-10000-users'),
  'Tom Wilson',
  'tom@example.com',
  'Inspiring story! How did you handle push notifications at scale?',
  true,
  11,
  now() - INTERVAL '20 hours'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-react-native-app-lessons-10000-users'),
  'Lisa Anderson',
  'lisa@example.com',
  'The offline-first approach is brilliant. Did you use Watermelon DB or something else?',
  true,
  7,
  now() - INTERVAL '18 hours'
);

-- Reply to Lisa
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, parent_comment_id, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-react-native-app-lessons-10000-users'),
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'romeo@example.com',
  'We used React Query with AsyncStorage. Watermelon DB is great for complex apps though!',
  (SELECT id FROM blog_comments WHERE author_name = 'Lisa Anderson'),
  true,
  4,
  now() - INTERVAL '16 hours'
);

-- Comments on Post 7 (AI News)
INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'rise-of-ai-powered-development-tools-2026'),
  'David Kim',
  'david@example.com',
  'AI has definitely made me more productive, but I''m careful to review all generated code.',
  true,
  23,
  now() - INTERVAL '5 hours'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'rise-of-ai-powered-development-tools-2026'),
  'Nina Patel',
  'nina@example.com',
  'Junior developers need to be careful not to use AI as a crutch. Learn the fundamentals first!',
  true,
  18,
  now() - INTERVAL '4 hours'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'rise-of-ai-powered-development-tools-2026'),
  'Carlos Martinez',
  'carlos@example.com',
  'Which AI tool do you recommend for beginners?',
  true,
  9,
  now() - INTERVAL '3 hours'
);

-- Reply to Carlos
INSERT INTO blog_comments (post_id, user_id, author_name, author_email, content, parent_comment_id, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'rise-of-ai-powered-development-tools-2026'),
  '7a03d529-f20f-4430-be7e-d1a7a8720f29',
  'Romeo Mukula',
  'romeo@example.com',
  'Start with GitHub Copilot''s free tier. It''s well-integrated into VS Code and has great documentation.',
  (SELECT id FROM blog_comments WHERE author_name = 'Carlos Martinez'),
  true,
  5,
  now() - INTERVAL '2 hours'
);

-- Pending moderation comment (not approved)
INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'rise-of-ai-powered-development-tools-2026'),
  'Spam User',
  'spam@example.com',
  'Check out my amazing AI course at spamlink dot com!!!',
  false,
  now() - INTERVAL '1 hour'
);

-- Comments on Post 8 (Supabase Tutorial)
INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-realtime-apps-supabase-nextjs'),
  'Jessica Lee',
  'jessica@example.com',
  'This is exactly what I needed! Building a collaborative app and Supabase is perfect.',
  true,
  10,
  now() - INTERVAL '3 hours'
);

INSERT INTO blog_comments (post_id, author_name, author_email, content, is_approved, likes_count, created_at) VALUES
(
  (SELECT id FROM blog_posts WHERE slug = 'building-realtime-apps-supabase-nextjs'),
  'Ryan Taylor',
  'ryan@example.com',
  'How does Supabase real-time compare to Socket.io in terms of performance?',
  true,
  4,
  now() - INTERVAL '2 hours'
);

-- =========================================================
-- SUCCESS MESSAGE
-- =========================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Blog seed data created successfully!';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '   - 6 categories (Web Dev, Mobile, DevOps, Tutorials, Case Studies, News)';
  RAISE NOTICE '   - 10 blog posts (8 published, 1 draft, 1 scheduled)';
  RAISE NOTICE '   - 20 comments (18 approved, 2 pending moderation)';
  RAISE NOTICE '   - Nested comment threads included';
  RAISE NOTICE '🎯 Features demonstrated:';
  RAISE NOTICE '   - Rich content with code examples';
  RAISE NOTICE '   - Multiple categories and tags';
  RAISE NOTICE '   - Featured and pinned posts';
  RAISE NOTICE '   - Scheduled publishing';
  RAISE NOTICE '   - Comment moderation workflow';
  RAISE NOTICE '   - Nested replies';
  RAISE NOTICE '   - Series support';
  RAISE NOTICE '   - GitHub repos and demo links';
  RAISE NOTICE '📝 Next: Run this in Supabase SQL Editor after blog_schema.sql';
END $$;
