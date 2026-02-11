# Dev Handoff Summary — 2026-02-11

> Session scope: Neon + Drizzle ORM + Auth + Data API + File Storage (R2) integration.

---

## What Was Done

### 1. `packages/database` — New Package

Centralized Drizzle ORM package for all database access.

| Item | Detail |
|------|--------|
| **Driver** | `@neondatabase/serverless` (HTTP mode) via `drizzle-orm/neon-http` |
| **Schema** | `src/schema.ts` — `users` + `r2_files` tables with RLS |
| **Migrations** | 2 applied: `0001` (users + RLS), `0002` (r2_files + RLS) |
| **Exports** | `db`, all schema tables/types, common drizzle-orm operators (`eq`, `and`, `or`, etc.) |
| **Config** | `composite: true`, `tsconfig.build.json` for tsup, added to root `tsconfig.json` references |

**Important:** Always import `eq`, `and`, `or`, etc. from `afena-database`, NOT from `drizzle-orm` directly. This avoids duplicate instance type mismatches in the monorepo.

### 2. Neon Auth — Server + Client

| File | Purpose |
|------|---------|
| `apps/web/src/lib/auth/server.ts` | `createNeonAuth()` — server SDK, cookie domain `.nexuscanon.com` in prod |
| `apps/web/src/lib/auth/client.ts` | Re-exports neon client for auth |
| `apps/web/src/lib/neon.ts` | `createClient<Database>()` — typed Data API + auth client |
| `apps/web/app/api/auth/[...path]/route.ts` | Auth API handler (catch-all) |
| `apps/web/proxy.ts` | Session validation + logging (Next.js 16 proxy convention) |

**Session access pattern:**
```typescript
const { data: session } = await auth.getSession();
if (!session?.user) { /* unauthorized */ }
session.user.id  // user ID
```

### 3. Neon Data API — Type-Safe Client Queries

| Item | Detail |
|------|--------|
| **Types** | Auto-generated at `apps/web/src/types/database.ts` |
| **Script** | `pnpm --filter web db:gen-types` |
| **Client** | `createClient<Database>()` in `src/lib/neon.ts` |
| **ESLint** | `src/types/**` excluded (auto-generated) |

**After schema changes:**
```bash
pnpm --filter afena-database db:generate
pnpm --filter afena-database db:migrate
pnpm --filter web db:gen-types
```

### 4. File Storage — Neon + Cloudflare R2

| File | Purpose |
|------|---------|
| `apps/web/src/lib/r2.ts` | S3Client configured for R2 |
| `apps/web/app/api/storage/presign/route.ts` | POST — generate presigned upload URL |
| `apps/web/app/api/storage/metadata/route.ts` | POST — save metadata / GET — list user files |

**Upload flow:** Browser → presigned URL → R2 (direct). Server only generates URLs and saves metadata.

### 5. Middleware → Proxy Migration

Renamed `middleware.ts` → `proxy.ts` and `export function middleware` → `export function proxy` per Next.js 16 convention. Updated ESLint config file patterns.

### 6. ESLint Fix

Removed invalid `react: { version: 'detect' }` from `import/resolver` settings in `packages/eslint-config/react.js`. Was causing "react with invalid interface loaded as resolver" errors.

### 7. Neon CLI

`neonctl` v2.20.2 installed globally. Authenticated as `jackwee@ai-bos.io`. Project context set to `dark-band-87285012`.

### 8. Agent Reference Docs

Created `.agent/reference/neon/` with 6 docs:
- `overview.md` — project details, CLI, key concepts
- `drizzle-orm.md` — schema, migrations, CRUD
- `row-level-security.md` — crudPolicy, pgPolicy, patterns
- `auth.md` — server/client SDK, file layout, env vars
- `data-api.md` — type-safe queries, type generation
- `connection.md` — pooled vs direct, SSL, driver modes
- `file-storage.md` — R2 integration, presigned URLs
- `sdks.md` — all installed packages and responsibilities

---

## Verification Status

| Check | Result |
|-------|--------|
| `pnpm type-check` | 0 errors (all 7 packages) |
| `pnpm lint` | 0 errors, 11 warnings (expected: `no-unsafe-assignment` from `request.json()`, `no-console` in API routes) |
| `pnpm build` | 0 warnings (middleware deprecation resolved) |
| Migrations | 2 applied to Neon |
| Data API types | Regenerated |

---

## Pending / TODO

| Item | Type | Detail |
|------|------|--------|
| **R2 CORS** | Cloudflare Dashboard | Add `https://www.nexuscanon.com` + `http://localhost:3000` to R2 bucket CORS |
| **File upload UI** | Code | API routes ready, UI components pending UI kit |
| **Auth UI components** | Code | Neon Auth UI components pending UI kit |
| **Production secrets** | Ops | Change `NEON_AUTH_COOKIE_SECRET`, `SESSION_SECRET`, `NEXTAUTH_SECRET` for prod |
| **Production domain** | Neon Console | Add `www.nexuscanon.com` to Neon Auth → Settings → Domains |

---

## Key Patterns for New Devs

### Server-side DB query
```typescript
import { db, users, eq } from 'afena-database';
const user = await db.select().from(users).where(eq(users.id, id));
```

### Client-side Data API query
```typescript
import neon from '@/lib/neon';
const { data } = await neon.from('users').select('id, name, email');
```

### Auth check in API route
```typescript
import { auth } from '@/lib/auth/server';
const { data: session } = await auth.getSession();
if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

### New table checklist
1. Add table to `packages/database/src/schema.ts` with RLS (`crudPolicy`)
2. `pnpm --filter afena-database db:generate` → review SQL
3. `pnpm --filter afena-database db:migrate`
4. `pnpm --filter web db:gen-types` (if exposed via Data API)
5. `pnpm type-check && pnpm lint`

---

## Environment Variables Reference

See `apps/web/.env` for all values. Key groups:

| Group | Vars |
|-------|------|
| **Neon DB** | `DATABASE_URL`, `DATABASE_URL_MIGRATIONS`, `NEON_PROJECT_ID`, `NEON_API_KEY` |
| **Neon Auth** | `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEXT_PUBLIC_NEON_AUTH_URL`, `NEON_JWT_SECRET`, `JWKS_URL` |
| **Neon Data API** | `NEON_DATA_API_URL` |
| **Cloudflare R2** | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT` |
| **OAuth** | `GITHUB_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET` |
