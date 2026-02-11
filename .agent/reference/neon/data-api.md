# Neon Data API
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## What is the Data API

A secure, stateless HTTP interface (PostgREST-compatible) to your Neon database. Allows querying from browsers, serverless functions, and edge runtimes using standard HTTP.

- **Beta** as of Feb 2026
- **Requires RLS** on all tables accessed
- **JWT auto-injected** — `auth.user_id()` available in RLS policies

## Key Benefits

- **Browser & edge compatible** — standard Postgres drivers don't work in browsers
- **Connectionless** — no pool exhaustion, handles thousands of concurrent users
- **Secure by default** — integrates with Neon Auth, respects RLS policies

## Client Setup

```typescript
import { createClient } from '@neondatabase/neon-js';
import type { Database } from '@/types/database';

export const neon = createClient<Database>({
  auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

The `Database` generic provides full type safety — autocomplete on table names, columns, and return types.

## Query Examples

```typescript
// Select all (typed)
const { data } = await neon.from('users').select('id, name, email');
// data: { id: string; name: string; email: string }[] | null

// Single row
const { data } = await neon.from('users').select('*').eq('id', userId).single();
// data: { id: string; name: string; ... } | null

// Insert
const { data } = await neon.from('todos').insert({ task: 'Buy milk' });

// Update
const { data } = await neon.from('todos').update({ is_complete: true }).eq('id', todoId);

// Delete
const { data } = await neon.from('todos').delete().eq('id', todoId);

// Filters
const { data } = await neon.from('todos')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);
```

## TypeScript Type Generation

Types are auto-generated from your database schema:

```bash
# Generate types
pnpm --filter web db:gen-types

# Or manually
npx @neondatabase/neon-js gen-types \
  --db-url "$DATABASE_URL" \
  --output src/types/database.ts
```

### Generated Helper Types

```typescript
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

type User = Tables<'users'>;           // Row type (SELECT)
type NewUser = TablesInsert<'users'>;   // Insert type
type UserUpdate = TablesUpdate<'users'>; // Update type (partial)
```

### Workflow: After Schema Changes

```bash
# 1. Edit schema in packages/database/src/schema.ts
# 2. Generate + apply migration
pnpm --filter afena-database db:generate
pnpm --filter afena-database db:migrate
# 3. Regenerate client types
pnpm --filter web db:gen-types
```

## Two Access Patterns

| Pattern | Package | When to Use |
|---------|---------|-------------|
| **Drizzle ORM** (server) | `packages/database` | Server Components, API routes, server actions — full access, no RLS |
| **Data API** (client) | `apps/web` via `neon-js` | Browser components — RLS-gated, auth token auto-injected |

> **Never mix them up.** Server = Drizzle (trusted, full access). Client = Data API (untrusted, RLS-gated).

## Environment Variables

```
NEON_DATA_API_URL            ← REST endpoint for Data API queries
NEXT_PUBLIC_NEON_AUTH_URL    ← Auth URL (needed for JWT injection)
DATABASE_URL                 ← For type generation (direct TCP)
```
