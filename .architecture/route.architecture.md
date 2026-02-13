# Afena Route Architecture — Engineering Reference

> **Status:** Current as of Feb 13, 2026
> **App:** `apps/web` (Next.js 16 + Turbopack)
> **Auth:** Neon Auth (`@neondatabase/auth`)
> **Pattern:** BFF (Backend-for-Frontend) via Server Actions + typed API routes

---

## 1. Route Philosophy

Afena uses a **BFF pattern**: server actions are the primary interface for all domain mutations and reads. API routes exist only for cross-cutting concerns (search, metadata, storage) and future external integrations.

**Key principle:** No client-side code ever talks to the database directly. Every data path flows through one of two gates:

| Gate               | Mechanism              | Purpose                                                           |
| ------------------ | ---------------------- | ----------------------------------------------------------------- |
| **Server Actions** | Next.js `"use server"` | Domain CRUD (create, read, update, delete, lifecycle verbs)       |
| **API Routes**     | Next.js Route Handlers | Cross-cutting reads (search, custom fields, views, storage, meta) |

Both gates share the same auth resolution, envelope contract, and error handling.

---

## 2. Authentication Layer

### 2.1 Middleware (`proxy.ts`)

Every request passes through `apps/web/proxy.ts`:

```
Request → loggingMiddleware.onRequest() → extractOrgSlug() → auth.middleware() → NextResponse
```

**Public routes** (bypass auth): `/`, `/auth`, `/api/auth`

**Middleware responsibilities:**

- Generate `x-request-id` header (UUID)
- Extract org slug from path (`/org/[slug]/...`)
- Delegate to Neon Auth middleware for session validation + token refresh
- Log request via `afena-logger` (`createLoggingMiddleware`)

### 2.2 Session Resolution

Two shared helpers resolve the authenticated session into a usable context:

| Helper           | File                         | Used By        | Returns                                       |
| ---------------- | ---------------------------- | -------------- | --------------------------------------------- |
| `buildContext()` | `src/lib/actions/context.ts` | Server actions | `MutationContext` (actor, requestId, channel) |
| `withAuth()`     | `src/lib/api/with-auth.ts`   | API routes     | `AuthSession` (userId, orgId, email, name)    |

Both helpers:

1. Call `auth.getSession()` (Neon Auth)
2. Query `auth.org_id()` and optionally `auth.org_role()` from the DB session
3. Return a typed context object

**`buildContext()` shape:**

```typescript
interface MutationContext {
  requestId: string;
  actor: ActorRef; // { userId, orgId, roles, email, name, orgRole? }
  ip?: string; // defined but not populated by web BFF
  userAgent?: string; // defined but not populated by web BFF
  channel?: string; // 'web_ui' | 'api' | 'cli' | 'workflow'
}
```

> Note: `buildContext()` is a `'use server'` file (`src/lib/actions/context.ts`). The `ip` and `userAgent` fields exist on the type but are not populated by the web BFF.

**`AuthSession` shape:**

```typescript
interface AuthSession {
  userId: string;
  orgId: string;
  email: string;
  name: string;
}
```

### 2.3 Env Vars

| Var                         | Purpose                   |
| --------------------------- | ------------------------- |
| `NEON_AUTH_BASE_URL`        | Server-side auth endpoint |
| `NEON_AUTH_COOKIE_SECRET`   | Cookie encryption         |
| `NEXT_PUBLIC_NEON_AUTH_URL` | Client-side auth endpoint |

---

## 3. Server Actions (Primary BFF)

### 3.1 Factory Pattern

All entity server actions are generated via a shared factory:

```
src/lib/actions/entity-actions.ts → generateEntityActions(entityType)
```

This returns an object with **12 standard actions**:

| Action                               | Verb    | Requires `expectedVersion` | Notes                         |
| ------------------------------------ | ------- | -------------------------- | ----------------------------- |
| `create(input)`                      | create  | No                         | Auto-generates idempotencyKey |
| `update(id, expectedVersion, input)` | update  | Yes                        | Field mutation                |
| `remove(id, expectedVersion)`        | delete  | Yes                        | Soft delete                   |
| `restore(id, expectedVersion)`       | restore | Yes                        | Un-delete                     |
| `submit(id, expectedVersion)`        | submit  | Yes                        | Draft → submitted             |
| `cancel(id, expectedVersion)`        | cancel  | Yes                        | → cancelled                   |
| `approve(id, expectedVersion)`       | approve | Yes                        | Submitted → active            |
| `reject(id, expectedVersion)`        | reject  | Yes                        | Submitted → draft             |
| `read(id, forcePrimary?)`            | —       | No                         | Single entity read            |
| `list(options?)`                     | —       | No                         | Paginated list                |
| `getVersions(entityId)`              | —       | No                         | Version history               |
| `getAuditLogs(entityId)`             | —       | No                         | Audit trail                   |

**Mutations** (create through reject) all flow through `mutate()` from `packages/crud`.
**Reads** (read, list) flow through `readEntity()` / `listEntities()` from `packages/crud`.
**History** (getVersions, getAuditLogs) query `entity_versions` / `audit_logs` directly.

### 3.2 Entity Action File Pattern

Each entity has a thin `'use server'` file that delegates to the factory:

```typescript
// app/actions/contacts.ts
'use server';
import { generateEntityActions } from '@/lib/actions/entity-actions';
const actions = generateEntityActions('contacts');

export async function createContact(input: { name: string; ... }): Promise<ApiResponse> {
  return actions.create(input);
}
// ... typed wrappers for each action
```

**Why thin wrappers instead of re-exporting?** Next.js `'use server'` files can only export async functions. The wrappers add typed input parameters specific to each entity.

### 3.3 Registered Entities

| Entity      | Action File                | Actions                                          |
| ----------- | -------------------------- | ------------------------------------------------ |
| `contacts`  | `app/actions/contacts.ts`  | 12 (all standard + submit/cancel/approve/reject) |
| `companies` | `app/actions/companies.ts` | 9 (standard CRUD + read/list/versions/audit)     |

### 3.4 Mutation Pipeline (Server Action → DB)

```
Server Action (typed input)
  → buildContext() (auth + org resolution)
  → MutationSpec construction (actionType, entityRef, input, expectedVersion)
  → mutate(spec, ctx)  [packages/crud]
    → Zod validation
    → K-15 namespace check
    → K-11 system column strip
    → K-04 expectedVersion enforcement
    → K-10 idempotency check
    → Lifecycle guard (enforceLifecycle)
    → Policy V1 (enforcePolicy — role-family RBAC)
    → Policy V2 (enforcePolicyV2 — verb+scope+field RBAC)
    → Governor (SET LOCAL timeouts)
    → Workflow before-rules
    → db.transaction():
        → Handler.create/update/delete/restore/submit/cancel/amend/approve/reject
        → entity_versions.insert (K-03)
        → audit_logs.insert (K-03)
    → Workflow after-rules (fire-and-forget)
    → Metering (fire-and-forget)
    → Return ApiResponse with Receipt
```

---

## 4. API Routes

### 4.1 Auth Wrappers

#### `withAuth()` — Session Cookie Auth

Standard wrapper for API routes requiring session authentication:

```typescript
export const GET = withAuth(async (request: NextRequest, session: AuthSession) => {
  // ... handler logic
  return { ok: true, data: result };
  // or: return { ok: false, code: 'VALIDATION_FAILED', message: '...' };
});
```

**`withAuth()` provides:**

- Auth guard (401 if no session)
- Org context resolution from DB
- Standard envelope wrapping (`{ ok, data, meta: { requestId } }` or `{ ok, error, meta }`)
- Error boundary (500 on unhandled exceptions)
- Request ID generation

#### `withAuthOrApiKey()` — Dual Auth (Session + API Key)

Wrapper for REST API routes that support both session cookies and API keys:

```typescript
export const GET = withAuthOrApiKey(async (request: NextRequest, session: AuthSession) => {
  // Same handler signature as withAuth
});
```

**Dual auth flow:**

1. If `Authorization: Bearer afk_...` header present → validate API key via SHA-256 hash lookup in `api_keys` table
2. Otherwise → fall back to session cookie auth (same as `withAuth`)
3. Sets `actor_type` to `'service'` for API keys, `'user'` for sessions

**Used by:** Generic entity REST routes (`/api/entities/*`)

### 4.2 Route Inventory (16 routes)

#### Cross-Cutting Routes

| Route                             | Method   | Auth       | Purpose                                       | Package                 |
| --------------------------------- | -------- | ---------- | --------------------------------------------- | ----------------------- |
| `/api/auth/[...path]`             | ALL      | Public     | Neon Auth handler (sign-in, sign-up, etc.)    | `@neondatabase/auth`    |
| `/api/search`                     | GET      | `withAuth` | Cross-entity FTS search (search_index MV)     | `afena-search`          |
| `/api/custom-fields/[entityType]` | GET      | `withAuth` | Custom field definitions for entity type      | `afena-crud`            |
| `/api/views/[entityType]`         | GET      | `withAuth` | Entity view definitions + fields              | `afena-database` (dbRo) |
| `/api/storage/presign`            | POST     | Raw auth   | R2 presigned upload URL                       | Cloudflare R2           |
| `/api/storage/metadata`           | GET/POST | Raw auth   | R2 file metadata CRUD                         | `afena-database`        |
| `/api/meta/capabilities`          | GET      | `withAuth` | Capability ledger (feature flags)             | `afena-canon`           |
| `/api/meta/capabilities/flags`    | GET/POST | `withAuth` | Feature flag toggle                           | `afena-canon`           |
| `/api/docs`                       | GET      | Public     | OpenAPI 3.1 JSON spec (auto-generated)        | `openapi-spec.ts`       |
| `/api/docs/ui`                    | GET      | Public     | Swagger UI (CDN-loaded) — page.tsx, not route | —                       |

#### Generic Entity REST Routes (W6)

All entity CRUD is served by a single set of generic route handlers (`src/lib/api/entity-route-handlers.ts`). New entities are automatically available — zero per-entity wiring needed.

| Route                                      | Method | Auth               | Purpose                                              |
| ------------------------------------------ | ------ | ------------------ | ---------------------------------------------------- |
| `/api/entities/[entityType]`               | GET    | `withAuthOrApiKey` | List entities (paginated, optional `includeDeleted`) |
| `/api/entities/[entityType]`               | POST   | `withAuthOrApiKey` | Create entity                                        |
| `/api/entities/[entityType]/[id]`          | GET    | `withAuthOrApiKey` | Read entity by ID                                    |
| `/api/entities/[entityType]/[id]`          | PATCH  | `withAuthOrApiKey` | Update entity (`expectedVersion` + `input`)          |
| `/api/entities/[entityType]/[id]`          | DELETE | `withAuthOrApiKey` | Soft-delete entity (`expectedVersion` query param)   |
| `/api/entities/[entityType]/[id]/restore`  | POST   | `withAuthOrApiKey` | Restore soft-deleted entity                          |
| `/api/entities/[entityType]/[id]/versions` | GET    | `withAuthOrApiKey` | Entity version history                               |
| `/api/entities/[entityType]/[id]/audit`    | GET    | `withAuthOrApiKey` | Entity audit trail                                   |

**Route handler factory:** `entity-route-handlers.ts` validates `entityType` against `ENTITY_TYPES` from canon, delegates to `generateEntityActions()`, and returns the canonical `ApiResponse` envelope.

**OpenAPI spec:** Auto-generated from `ENTITY_TYPES` registry at `/api/docs`. Swagger UI at `/api/docs/ui`.

> **Note:** `/api/storage/*` routes use raw `auth.getSession()` directly (not `withAuth()`), bypassing the canonical `ApiResponse` envelope. They return ad-hoc JSON shapes for compatibility with existing integrations.

### 4.3 DB Access Patterns in API Routes

| Route                             | DB Access                                                              | Connection                |
| --------------------------------- | ---------------------------------------------------------------------- | ------------------------- |
| `/api/search`                     | `searchAll()` (search_index MV)                                        | `dbRo` (via afena-search) |
| `/api/entities/*`                 | `generateEntityActions()` → `mutate()`/`readEntity()`/`listEntities()` | `db` (via afena-crud)     |
| `/api/custom-fields/[entityType]` | `loadFieldDefs()`                                                      | `dbRo` (via afena-crud)   |
| `/api/views/[entityType]`         | `entityViews` + `entityViewFields`                                     | `dbRo` (direct)           |
| `/api/storage/metadata`           | `r2Files`                                                              | `db` (direct)             |

---

## 5. Response Envelope (INVARIANT-06)

Every response — server action or API route — uses the canonical envelope:

```typescript
interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: ErrorCode; // machine-readable: 'NOT_FOUND', 'VERSION_CONFLICT', etc.
    message: string; // human-readable
  };
  meta: {
    requestId: string; // always present — correlates with Pino logs
    receipt?: Receipt; // present on mutations only
  };
}
```

### 5.1 Error Codes (from `packages/canon`)

| Code                | HTTP | Meaning                   |
| ------------------- | ---- | ------------------------- |
| `VALIDATION_FAILED` | 400  | Input validation failed   |
| `NOT_FOUND`         | 404  | Entity not found          |
| `VERSION_CONFLICT`  | 409  | Optimistic lock failure   |
| `POLICY_DENIED`     | 403  | RBAC/ABAC denied          |
| `LIFECYCLE_DENIED`  | 422  | Illegal state transition  |
| `DUPLICATE`         | 409  | Idempotency key collision |
| `RATE_LIMITED`      | 429  | Rate limit exceeded       |
| `INTERNAL_ERROR`    | 500  | Unhandled exception       |

### 5.2 Receipt (mutations only)

```typescript
interface Receipt {
  requestId: string;
  mutationId: string;
  batchId?: string;
  entityId: string;
  entityType: string;
  versionBefore: number | null;
  versionAfter: number;
  status: 'ok' | 'rejected' | 'error';
  auditLogId: string | null;
}
```

---

## 6. Path-Based Routing

### 6.1 URL Structure

```
/                           → Marketing landing page (public)
/auth/[path]                → Auth pages (sign-in, sign-up, etc.)
/org/[slug]/                → Org dashboard
/org/[slug]/contacts        → Contacts list
/org/[slug]/contacts/new    → Create contact
/org/[slug]/contacts/[id]   → Contact detail
/org/[slug]/contacts/[id]/edit     → Edit contact
/org/[slug]/contacts/[id]/versions → Version history
/org/[slug]/contacts/[id]/audit    → Audit trail
/org/[slug]/contacts/trash  → Soft-deleted contacts
```

### 6.2 Route Groups

| Group         | Path            | Layout                                     | Auth |
| ------------- | --------------- | ------------------------------------------ | ---- |
| `(marketing)` | `/`             | Public layout                              | No   |
| `(auth)`      | `/auth/*`       | Auth layout                                | No   |
| `(app)`       | `/org/[slug]/*` | App shell (sidebar + header + breadcrumbs) | Yes  |

### 6.3 Org Context Resolution

The org slug is extracted from the URL path in middleware (`proxy.ts`):

```typescript
function extractOrgSlug(pathname: string): string | undefined {
  const match = pathname.match(/^\/org\/([^/]+)/);
  return match?.[1];
}
```

Server-side org context is resolved via `auth.org_id()` DB function (JWT claim), not from the URL slug. The slug is for routing only.

---

## 7. Capability Annotations

Every route file that performs a governed action declares its capabilities:

```typescript
export const CAPABILITIES = ['contacts.create', 'contacts.update'] as const;
```

These are scanned by `afena meta gen` (CLI) to build the capability ledger. See `.PRD/meta.engine.md` for details.

**Annotated files:**

- `app/actions/contacts.capabilities.ts` — 8 keys
- `app/actions/companies.capabilities.ts` — 8 keys
- `app/api/search/route.ts` — 2 keys
- `app/api/custom-fields/[entityType]/route.ts` — 1 key
- `app/api/views/[entityType]/route.ts` — 1 key
- `app/api/storage/presign/route.ts` — 1 key
- `app/api/storage/metadata/route.ts` — 2 keys

---

## 8. Governors & Rate Limiting

### 8.1 Transaction Governors

Every mutation transaction starts with `SET LOCAL` timeouts:

| Preset                  | `statement_timeout` | `idle_in_transaction_session_timeout` |
| ----------------------- | ------------------- | ------------------------------------- |
| `interactive` (default) | 5s                  | 20s                                   |
| `background`            | 30s                 | 60s                                   |
| `reporting`             | 5s                  | 20s                                   |

`application_name` is set to `afena:{channel}:org={orgId}` for `pg_stat_activity` observability.

### 8.2 Rate Limiter

In-memory sliding window per org per route group:

| Route Group | Max Requests | Window |
| ----------- | ------------ | ------ |
| `mutation`  | 60           | 60s    |
| `query`     | 120          | 60s    |
| `search`    | 60           | 60s    |
| `api`       | 100          | 60s    |
| Default     | 100          | 60s    |

### 8.3 Job Quota

In-memory concurrent slot limiter per org per queue:

| Queue    | Max Concurrent | Max Enqueued/min |
| -------- | -------------- | ---------------- |
| Default  | 5              | 30               |
| workflow | 3              | 20               |
| advisory | 2              | 10               |
| import   | 1              | 5                |
| sync     | 2              | 15               |

### 8.4 Usage Metering

Fire-and-forget upserts to `org_usage_daily`:

| Meter                             | When                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| `meterApiRequest(orgId)`          | After every successful mutation                            |
| `meterJobRun(orgId, durationMs)`  | After background job completes                             |
| `meterDbTimeout(orgId)`           | On statement_timeout / idle_in_transaction_session_timeout |
| `meterStorageBytes(orgId, bytes)` | After file upload                                          |

---

## 9. Logging & Observability

### 9.1 Request Logging

`proxy.ts` uses `createLoggingMiddleware(logger)` from `afena-logger`:

- Logs every request with method, URL, status, duration
- Generates `x-request-id` header
- Sets ALS context for downstream correlation

### 9.2 Structured Logging (INVARIANT-08)

All server-side logging uses Pino via `afena-logger`. `console.*` is forbidden by ESLint `no-console: error` + `no-restricted-syntax`.

### 9.3 Audit Correlation

Every `audit_logs` entry includes `request_id` which correlates with Pino structured logs and the `x-request-id` response header.

---

## 10. Invariants

| ID           | Rule                                         | Enforcement                                                |
| ------------ | -------------------------------------------- | ---------------------------------------------------------- |
| INVARIANT-01 | All domain mutations flow through `mutate()` | ESLint `no-restricted-syntax` on `db.insert/update/delete` |
| INVARIANT-06 | All responses use canonical envelope         | `withAuth()` wrapper + `ok()`/`err()` helpers in crud      |
| INVARIANT-07 | Policy evaluation before every mutation      | `enforcePolicy()` + `enforcePolicyV2()` in mutate pipeline |
| INVARIANT-08 | No `console.*` — use afena-logger            | ESLint `no-console` + `no-restricted-syntax`               |
| INVARIANT-12 | Every domain table has org_id + RLS          | `tenantPolicy()` + `auth.require_org_id()` defaults        |
| INVARIANT-13 | Null org_id → zero rows + write fails        | RLS + `CHECK (org_id <> '')`                               |

---

## 11. AsyncLocalStorage Context (W7)

ALS provides request-scoped context propagation without manual parameter threading.

**Flow:**

```
Middleware (x-request-id header)
  → withAuth() establishes ALS scope (runWithContext)
    → All downstream code reads from ALS:
        - buildContext() reuses requestId
        - entity-actions read/list/versions/audit use ALS requestId
        - afena-logger auto-binds request_id to all log lines
```

**ALS store shape** (`RequestContext` from `afena-logger`):

```typescript
interface RequestContext {
  request_id: string;
  org_id?: string;
  actor_id?: string;
  actor_type?: 'user' | 'service' | 'system';
  service: string;
}
```

**Key APIs:**

- `runWithContext(ctx, fn)` — establish ALS scope
- `getContext()` — read full context
- `getRequestId()` — convenience for `request_id`
- `bindLogger(base)` — auto-bind context to Pino child logger

**Graceful degradation:** `getRequestId() ?? crypto.randomUUID()` — always works even without ALS or in Edge Runtime.

---

## 12. Future-Proofing

| Feature                      | Status        | Notes                                                         |
| ---------------------------- | ------------- | ------------------------------------------------------------- |
| OpenAPI auto-generation      | **Done (W6)** | Auto-generated from `ENTITY_TYPES` at `/api/docs`             |
| REST API routes for entities | **Done (W6)** | Generic route handler factory at `/api/entities/[entityType]` |
| AsyncLocalStorage context    | **Done (W7)** | `withAuth()` establishes ALS; `getRequestId()` reads it       |
| Cross-entity search MV       | **Done (W5)** | `search_index` MV with FTS + ILIKE fallback                   |
| Audit log partitioning       | Deferred      | Triggered by volume (~10M rows)                               |
| WebSocket / SSE              | Not planned   | Polling or Neon logical replication for real-time             |
| GraphQL                      | Not planned   | Server actions + typed API routes cover all use cases         |
