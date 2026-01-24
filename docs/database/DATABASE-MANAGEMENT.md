# Supabase Local Development Setup

This guide explains how to manage your Supabase database schema locally and generate TypeScript types.

## 🎯 Why This Approach?

### Benefits

✅ **Type Safety** - Auto-generated TypeScript types from your database  
✅ **Version Control** - Track schema changes in Git  
✅ **Local Development** - Develop without hitting production  
✅ **Better DX** - Autocomplete for all tables/columns  
✅ **Migration Management** - Track and rollback changes easily  
✅ **Team Collaboration** - Share schema changes through Git

### Industry Standard

This is considered **best practice** for modern app development. Companies like Vercel, Netlify, and Airbnb use similar approaches.

---

## 📦 Prerequisites

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

Or using Homebrew (macOS):

```bash
brew install supabase/tap/supabase
```

### 2. Install Docker (for local development)

Download from: https://docs.docker.com/get-docker/

### 3. Login to Supabase CLI

```bash
supabase login
```

This will open a browser to authenticate.

---

## 🚀 Quick Start

### Step 1: Set Environment Variables

Create `.env.local` with your Supabase credentials:

```bash
# From your Supabase dashboard (Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# From Supabase dashboard (Settings > Database)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# From URL (the "your-project" part)
SUPABASE_PROJECT_ID=your-project-id

# Your database password
SUPABASE_DB_PASSWORD=your-db-password
```

### Step 2: Generate TypeScript Types

```bash
npm run db:types
```

This creates `lib/supabase/database.types.ts` with all your table types.

### Step 3: Pull Schema (Optional)

```bash
npm run db:pull
```

This creates migration files in `supabase/migrations/` representing your current database state.

---

## 📝 Usage

### Generated Types

After running `npm run db:types`, use the types in your code:

```typescript
import { Database } from '@/lib/supabase/database.types'

// Table types
type Profile = Database['public']['Tables']['profiles']['Row']
type NewProfile = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Typed Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Now you get full autocomplete!
const { data, error } = await supabase
  .from('profiles') // ✅ Autocomplete for table names
  .select('*') // ✅ Autocomplete for columns
```

### Update Your Supabase Client

Update `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
```

---

## 🏠 Local Development (Optional)

### Start Local Supabase

```bash
npm run db:local
```

This starts:

- PostgreSQL database (port 54322)
- Supabase Studio (http://localhost:54323)
- API Gateway (http://localhost:54321)
- Authentication server
- Storage server

### Use Local Instance

Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key from startup output]
```

### Stop Local Supabase

```bash
npm run db:local-stop
```

---

## 🔄 Workflow

### Daily Development

1. **Pull latest schema** (if team changed database):

   ```bash
   npm run db:pull
   ```

2. **Generate types**:

   ```bash
   npm run db:types
   ```

3. **Develop locally** (optional):
   ```bash
   npm run db:local
   npm run dev
   ```

### Making Schema Changes

#### Option A: In Supabase Studio (Recommended for Quick Changes)

1. Make changes in Supabase dashboard
2. Pull schema: `npm run db:pull`
3. Generate types: `npm run db:types`
4. Commit migration files to Git

#### Option B: Local-First (Recommended for Complex Changes)

1. Start local Supabase: `npm run db:local`
2. Make changes in local Studio (http://localhost:54323)
3. Create migration: `supabase db diff -f migration_name`
4. Push to remote: `supabase db push`
5. Generate types: `npm run db:types`

---

## 📋 Available Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run db:types`      | Generate TypeScript types from remote database |
| `npm run db:pull`       | Pull schema from remote database               |
| `npm run db:local`      | Start local Supabase instance                  |
| `npm run db:local-stop` | Stop local Supabase instance                   |

---

## 🎓 Best Practices

### 1. Always Generate Types After Schema Changes

```bash
# After any database change
npm run db:types
```

### 2. Commit Generated Types to Git

```bash
git add lib/supabase/database.types.ts
git commit -m "Update database types"
```

### 3. Use Typed Clients Everywhere

```typescript
// ❌ Without types
const { data } = await supabase.from('users').select('*')
// data is 'any' - no autocomplete, no type safety

// ✅ With types
const supabase = createClient<Database>(...)
const { data } = await supabase.from('users').select('*')
// data is User[] - full autocomplete and type safety!
```

### 4. Type Your Server Actions

```typescript
import { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return data
}
```

### 5. Regular Type Regeneration

Add to your CI/CD pipeline or run weekly:

```bash
npm run db:types
```

---

## 🔍 Troubleshooting

### "Supabase CLI not found"

Install globally:

```bash
npm install -g supabase
```

### "Not logged in"

Login to Supabase:

```bash
supabase login
```

### "Failed to generate types"

Check environment variables:

```bash
echo $SUPABASE_PROJECT_ID
```

Make sure `.env.local` has `SUPABASE_PROJECT_ID` set.

### "Docker not running"

Start Docker Desktop before running `npm run db:local`.

### Types not updating

1. Delete the types file: `rm lib/supabase/database.types.ts`
2. Regenerate: `npm run db:types`
3. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TypeScript Server"

---

## 🌟 Advanced: Migration Workflow

### Create New Migration

```bash
# Make changes in Supabase Studio or SQL editor
supabase db diff -f add_user_preferences

# Review the migration file
cat supabase/migrations/[timestamp]_add_user_preferences.sql

# Apply to local
supabase db reset

# Push to remote
supabase db push
```

### Rollback Migration

```bash
# Remove the migration file
rm supabase/migrations/[timestamp]_bad_migration.sql

# Reset local database
supabase db reset

# Push to remote
supabase db push
```

---

## 📚 Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Migrations Guide](https://supabase.com/docs/guides/cli/managing-migrations)

---

## 🎯 Next Steps

1. **Setup**: Install CLI and login
2. **Generate**: Run `npm run db:types`
3. **Update**: Add types to your Supabase clients
4. **Enjoy**: Full TypeScript autocomplete across your app!

---

**Questions?** Check the troubleshooting section or Supabase docs.
