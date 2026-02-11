# Drizzle ORM with Neon
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## Setup

Drizzle ORM connects to Neon via the `@neondatabase/serverless` HTTP driver. This is stateless — each query is a single fetch request, ideal for serverless/edge.

### Package: `packages/database`

```
packages/database/
├── src/
│   ├── index.ts          ← re-exports db + schema
│   ├── db.ts             ← Neon HTTP client → Drizzle instance
│   └── schema.ts         ← Centralized schema (single source of truth)
├── drizzle/              ← SQL migration files
├── drizzle.config.ts     ← Drizzle Kit config
├── tsconfig.json         ← composite: true (library)
├── tsconfig.build.json   ← tsup escape hatch
├── tsup.config.ts
├── eslint.config.cjs
└── .env                  ← DATABASE_URL for migrations (direct TCP)
```

### Driver

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Why Neon HTTP (not WebSocket or pg)

- Stateless — no connection pool needed
- Works in serverless/edge runtimes
- Each query = single HTTP request
- Neon's recommended driver for Next.js

## Schema

Schema is defined in `packages/database/src/schema.ts`. All tables go in the `public` schema. Never touch the `neon_auth` schema (managed by Neon Auth).

### Conventions

- UUID primary keys with `defaultRandom()`
- `userId` column with `default(sql\`(auth.user_id())\`)` for RLS
- `createdAt` / `updatedAt` timestamps with `defaultNow()`
- RLS policies via `crudPolicy` from `drizzle-orm/neon`

## Migrations

```bash
# Edit schema in packages/database/src/schema.ts
# Generate migration SQL
pnpm --filter afena-database db:generate

# Review generated SQL in packages/database/drizzle/
# Apply to Neon
pnpm --filter afena-database db:migrate

# Dev shortcut: push schema directly (no migration file)
pnpm --filter afena-database db:push

# Visual schema browser
pnpm --filter afena-database db:studio
```

### Rules

- Always generate + review before applying
- Migration URL uses direct TCP (no pooler)
- Schema is the single source of truth
- Don't touch `neon_auth` schema

## CRUD Examples

```typescript
import { db, users } from 'afena-database';
import { eq } from 'drizzle-orm';

// Read
const allUsers = await db.select().from(users);

// Insert
const [newUser] = await db.insert(users)
  .values({ name: 'Jack', email: 'jack@example.com' })
  .returning();

// Update
await db.update(users)
  .set({ name: 'Updated' })
  .where(eq(users.id, newUser.id));

// Delete
await db.delete(users)
  .where(eq(users.id, newUser.id));
```

## drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```
