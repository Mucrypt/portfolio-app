# Quick Start: Database Management

## 🚀 Setup (One-time)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Add to .env.local

Get your project ID from Supabase URL: `https://YOUR-PROJECT-ID.supabase.co`

```bash
SUPABASE_PROJECT_ID=your-project-id
```

---

## 📝 Daily Commands

### Generate TypeScript Types (Do this regularly!)

```bash
npm run db:types
```

✅ This creates `lib/supabase/database.types.ts` with all your table types  
✅ Run this after ANY database schema change  
✅ Commit the generated file to Git

### Pull Database Schema

```bash
npm run db:pull
```

✅ Creates migration files in `supabase/migrations/`  
✅ Useful for tracking schema changes in Git

---

## 🎯 Why This Matters

**Before** (without types):

```typescript
// ❌ No autocomplete, no type safety
const { data } = await supabase.from('profiles').select('*')
// data type is 'any' 😢
```

**After** (with types):

```typescript
// ✅ Full autocomplete and type safety!
const { data } = await supabase.from('profiles').select('*')
// data type is Profile[] with all columns! 🎉
```

---

## 📚 Full Documentation

See [DATABASE-MANAGEMENT.md](./DATABASE-MANAGEMENT.md) for:

- Local development setup
- Migration workflows
- Advanced usage
- Troubleshooting

---

## ⚡ Quick Troubleshooting

**Command not found?**  
→ Install: `npm install -g supabase`

**Not logged in?**  
→ Login: `supabase login`

**Types not updating?**  
→ Delete `lib/supabase/database.types.ts` and run `npm run db:types` again

---

**That's it!** Run `npm run db:types` after schema changes and enjoy full TypeScript support! 🚀
