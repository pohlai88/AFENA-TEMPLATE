# Row-Level Security (RLS) with Neon + Drizzle
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## Why RLS

- Data API **requires** RLS on all tables it accesses
- RLS policies are enforced at the **database level** regardless of query method
- Drizzle declares policies in TypeScript → migrations create them in Postgres

## Neon Auth Functions

| Function | Purpose |
|----------|---------|
| `auth.user_id()` | Extracts current user ID from JWT claims |

## Drizzle Helpers (`drizzle-orm/neon`)

| Helper | Purpose |
|--------|---------|
| `crudPolicy()` | Generates RLS policies for all CRUD ops |
| `authUid(column)` | Generates `(select auth.user_id() = column)` |
| `authenticatedRole` | Built-in Postgres role for logged-in users |
| `anonymousRole` | Built-in Postgres role for public access |

## crudPolicy Parameters

```typescript
crudPolicy({
  role: authenticatedRole,  // or anonymousRole, or custom pgRole
  read: authUid(table.userId),  // true | false | sql`...` | null
  modify: authUid(table.userId), // true | false | sql`...` | null
})
```

- `true` = allow all
- `false` = deny all
- `authUid(column)` = owner-only
- `null` = skip generating policy for that operation

## Common Patterns

### 1. User-Owned Data (todos, profiles, settings)

```typescript
import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable(
  'todos',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull().default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);
```

### 2. Public Read, Owner Write (blog posts)

```typescript
import { anonymousRole } from 'drizzle-orm/neon';

(table) => [
  crudPolicy({ role: anonymousRole, read: true, modify: false }),
  crudPolicy({ role: authenticatedRole, read: true, modify: authUid(table.userId) }),
]
```

### 3. Custom Roles (editor, admin)

```typescript
import { pgRole } from 'drizzle-orm/pg-core';

export const editorRole = pgRole('editor');

(table) => [
  crudPolicy({ role: editorRole, read: true, modify: true }),
  crudPolicy({ role: authenticatedRole, read: true, modify: authUid(table.userId) }),
]
```

> **Important:** You must also `GRANT` table privileges to custom roles in Postgres. Drizzle doesn't manage privileges.

## Advanced: pgPolicy (per-operation control)

Use `pgPolicy` when you need different logic for INSERT vs UPDATE vs DELETE, or different USING vs WITH CHECK clauses.

### Time-Limited Updates (edit only within 24h)

```typescript
import { pgPolicy } from 'drizzle-orm/pg-core';

(table) => {
  const owns = sql`(select auth.user_id() = ${table.userId})`;
  const canUpdate = sql`(${owns} and ${table.createdAt} > now() - interval '24 hours')`;
  return [
    pgPolicy('view',   { for: 'select', to: authenticatedRole, using: owns }),
    pgPolicy('create', { for: 'insert', to: authenticatedRole, withCheck: owns }),
    pgPolicy('delete', { for: 'delete', to: authenticatedRole, using: owns }),
    pgPolicy('update', { for: 'update', to: authenticatedRole, using: owns, withCheck: canUpdate }),
  ];
}
```

## Complex Relationships (shared data)

Access child rows based on parent ownership:

```typescript
// paragraphs — access based on note ownership
crudPolicy({
  role: authenticatedRole,
  read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
  modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
}),
pgPolicy('shared_policy', {
  for: 'select', to: authenticatedRole,
  using: sql`(select notes.shared from notes where notes.id = ${table.noteId})`,
}),
```

## Server-Side Drizzle with RLS

For backend API routes that need RLS enforcement via Drizzle (not Data API):

```typescript
const result = await db.transaction(async (tx) => {
  await tx.execute(sql`SELECT set_config('request.jwt.claims', ${claims}, true)`);
  return await tx.select().from(todos);
});
```

> **Critical:** Don't use `neondb_owner` role for RLS queries — it has `BYPASSRLS`.

## Key Rules

- All tables exposed via Data API must have RLS enabled
- `userId` columns should default to `sql\`(auth.user_id())\``
- `crudPolicy` for simple owner-based patterns
- `pgPolicy` when you need per-operation or time-based logic
- Server Drizzle queries bypass RLS by default (owner role)
- Use transactions with `set_config` if you need RLS on server
