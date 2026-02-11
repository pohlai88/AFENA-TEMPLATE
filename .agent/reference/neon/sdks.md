# Neon SDKs & Packages
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## Installed Packages

| Package | Version | Location | Purpose |
|---------|---------|----------|---------|
| `@neondatabase/neon-js` | 0.2.0-beta.1 | `apps/web` | Client auth + Data API + type generation |
| `@neondatabase/auth` | 0.2.0-beta.1 | `apps/web` | Server SDK (Next.js) — sessions, handler, middleware |
| `@neondatabase/api-client` | ^2.6.0 | `apps/web` | Neon API — project/branch management |
| `@neondatabase/serverless` | ^1.0.0 | `packages/database` | HTTP driver for Drizzle ORM |
| `drizzle-orm` | ^0.44.0 | `packages/database` | ORM — schema, queries, RLS policies |
| `drizzle-kit` | ^0.31.0 | `packages/database` (dev) | Migration generation + studio |

## SDK Responsibilities

### `@neondatabase/neon-js` (Client)

- `createClient<Database>()` — typed Data API client
- `neon.auth.*` — client-side auth (signIn, signUp, signOut, OAuth, OTP)
- `neon.from('table').*` — PostgREST-compatible query builder
- `npx @neondatabase/neon-js gen-types` — TypeScript type generation from DB schema

### `@neondatabase/auth/next/server` (Server)

- `createNeonAuth()` — server auth instance
- `auth.getSession()` — get session in RSC/API routes
- `auth.handler()` — creates GET/POST route handlers
- `auth.middleware()` — session validation for proxy
- `auth.signIn/signUp/signOut` — server-side auth methods
- `auth.admin.*` — user management (list, ban, setRole)
- `auth.organization.*` — org management (create, invite)

### `@neondatabase/api-client` (Neon API)

- Programmatic access to Neon platform
- Create/delete projects, branches, databases, roles
- Useful for CI/CD automation and preview environments

### `@neondatabase/serverless` (Driver)

- `neon(url)` — HTTP mode (stateless, single-query)
- `Pool` — WebSocket mode (transactions, multi-query)
- Used by Drizzle ORM via `drizzle-orm/neon-http`

## CLI

`neonctl` v2.20.2 installed globally. Authenticated as `jackwee@ai-bos.io`.

```bash
neonctl projects list
neonctl branches list
neonctl branches create --name preview-123
neonctl connection-string
neonctl databases list
neonctl roles list
```
