# afenda Database Layer — Advanced Enterprise Architecture

> **Package:** `afenda-database` (`packages/database`)
> **Layer:** 1 (Foundation)
> **Role:** Neon Serverless Postgres + Drizzle ORM — Schema definitions, dual RW/RO compute, migration management, and schema governance
> **Architecture Version:** 2.6 (Ratified)
> **Last Updated:** 2026-02-19
> **Changelog:** v2.6 ratification adds DbSession as single entrypoint, query plan stability (PLAN-01), online DDL gates (MIG-ONLINE-01), role separation enforcement, RLS policy catalog, boot-time role validation, prepared statements opt-in, table taxonomy enforcement, natural key immutability, worker hygiene gates

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Neon Serverless Postgres Integration](#2-neon-serverless-postgres-integration)
3. [Drizzle ORM Patterns](#3-drizzle-orm-patterns)
4. [Schema Design Principles](#4-schema-design-principles)
5. [Multi-Tenant Isolation (RLS)](#5-multi-tenant-isolation-rls)
6. [Performance Optimization](#6-performance-optimization)
7. [Migration Management](#7-migration-management)
8. [Data Lifecycle & Archival](#8-data-lifecycle--archival)
9. [Observability & Monitoring](#9-observability--monitoring)
10. [Disaster Recovery](#10-disaster-recovery)
11. [Schema Governance Automation](#11-schema-governance-automation)
12. [Security Hardening](#12-security-hardening)

---

## 1. Architecture Overview

### 1.1 Four-Layer Data Model

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Evidence (Immutable)                               │
│ - audit_logs, entity_versions, workflow_executions          │
│ - Append-only, REVOKE UPDATE/DELETE                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Projection (Rebuildable)                           │
│ - search_documents, search_index MV, stock_balances         │
│ - Worker-only writes, REVOKE from authenticated             │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Control Plane                                      │
│ - doc_postings, workflow_rules, search_outbox               │
│ - Orchestration, state machines, outbox pattern             │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Kernel Truth (Domain Entities)                     │
│ - invoices, contacts, products, companies                   │
│ - Single write path via mutate(), composite PK (org_id, id) │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Core Principles

| ID | Principle | Enforcement |
|----|-----------|-------------|
| **P0** | Truth in Postgres | All domain state persists in Postgres; no external state stores |
| **P1** | Tenant Structural | Every domain table has `org_id uuid` + RLS + `tenantPolicy` |
| **P2** | One Write Brain | All domain mutations via `mutate()` — ESLint INVARIANT-01 enforces |
| **P3** | Projections Rebuildable | search_documents, stock_balances can be dropped and rebuilt from truth |

### 1.3 Technology Stack

- **Database:** Neon Serverless Postgres 16+ (PgBouncer transaction pooling)
- **ORM:** Drizzle ORM v0.44+ with neon-http driver
- **Schema:** 87+ tables (truth: 45, control: 12, projection: 8, evidence: 15, link: 7)
- **Migrations:** drizzle-kit generate + migrate (42+ migrations applied)
- **Branching:** Neon branches for dev/preview/prod isolation

---

## 2. Neon Serverless Postgres Integration

### 2.1 Connection Architecture

**Platform-specific connection patterns:**

> **⚠️ CRITICAL: Migration Driver Selection**
>
> **NEVER use `neon-http` driver for migrations.** The `neon-http` driver has **no transaction rollback support** — if a migration step fails mid-execution, you must handle rollback manually. This can leave your schema in an inconsistent state.
>
> ```typescript
> // ❌ FORBIDDEN: neon-http for migrations
> import { migrate } from 'drizzle-orm/neon-http/migrator';
> 
> // ✅ CORRECT: Use transaction-capable drivers
> import { migrate } from 'drizzle-orm/neon-serverless/migrator';
> // OR
> import { migrate } from 'drizzle-orm/node-postgres/migrator';
> // OR (postgres-js MUST use max: 1 for migrations)
> const migrationsClient = postgres(DATABASE_URL_MIGRATIONS, { max: 1 });
> import { migrate } from 'drizzle-orm/postgres-js/migrator';
> ```
>
> **Why this matters:** Migrations often contain multiple DDL statements. If statement 3 of 5 fails, transaction-capable drivers automatically roll back statements 1-2. With `neon-http`, statements 1-2 remain applied, requiring manual schema repair.

#### Option 1: Vercel Fluid Compute (RECOMMENDED for Vercel)

```typescript
// packages/database/src/db.ts
import { attachDatabasePool } from '@vercel/functions';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

function validateDatabaseUrl(url: string | undefined, name: string): string {
  if (!url) throw new Error(`${name} environment variable is required`);
  try {
    const parsed = new URL(url);
    if (!['postgresql:', 'postgres:'].includes(parsed.protocol)) {
      throw new Error(`${name} must use postgresql:// or postgres:// protocol`);
    }
    return url;
  } catch (error) {
    throw new Error(`${name} is not a valid database URL: ${error}`);
  }
}

const DATABASE_URL = validateDatabaseUrl(process.env.DATABASE_URL, 'DATABASE_URL');
const DATABASE_URL_RO = process.env.DATABASE_URL_RO 
  ? validateDatabaseUrl(process.env.DATABASE_URL_RO, 'DATABASE_URL_RO')
  : DATABASE_URL;

// Primary (RW) connection with Vercel pooling
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10, // Vercel manages pool lifecycle
});

// CRITICAL: Ensures graceful connection cleanup before function suspension
attachDatabasePool(pool);

export const db = drizzle({ client: pool, schema });

// Read replica (RO) connection
const poolRo = new Pool({
  connectionString: DATABASE_URL_RO,
  max: 10,
});
attachDatabasePool(poolRo);

export const dbRo = drizzle({ client: poolRo, schema });
```

**Why Vercel Fluid:**
- First request: ~8 roundtrips to establish TCP connection
- Subsequent requests: **Instant** (connection reuse)
- Prevents connection leaks in serverless
- 3-5x faster than HTTP for repeated queries

**Pool tuning for Vercel Fluid Compute:**

```typescript
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10, // Tune based on concurrent invocations (start conservative)
  idleTimeoutMillis: 5000, // ≤5s for Fluid Compute (prevents stale connections)
  connectionTimeoutMillis: 10000, // 10s connection establishment timeout
});
```

**Best practices (validated against Neon + Vercel research):**
- Define pool globally (module-level) for connection reuse across invocations
- Set `idleTimeoutMillis` ≤ 5000ms for Fluid Compute (Neon recommendation)
- Tune `max` based on concurrent function invocations (start at 10, benchmark-driven)
- Monitor connection pool exhaustion in production (Neon Console + Vercel logs)
- Use `attachDatabasePool()` to prevent connection leaks on function suspension

**PgBouncer transaction mode implications (Neon default):**
- ✅ Parameterized queries work correctly
- ✅ Transaction-scoped `SET` variables (our auth context pattern)
- ❌ Prepared statements ineffective (use opt-in `DB_PREPARED=1` only with session pooling)
- ❌ `SET` outside transactions (race condition across requests)
- ❌ `LISTEN`/`NOTIFY`, advisory locks (use direct connection)

**When to use direct connection (bypass pooler):**
```typescript
// For migrations, LISTEN/NOTIFY, or session-scoped prepared statements
const directUrl = DATABASE_URL.replace('-pooler.', '.'); // Remove pooler from endpoint
const directPool = new Pool({ connectionString: directUrl, max: 1 });
```

**Invariant INV-P1 (Connection Pooling):** Connection pooling MUST be used for all database connections.  
**Invariant INV-P2 (One Write Brain):** All domain mutations (truth/control tables) MUST go through `mutate()` (enforced via ESLint + REVOKE).

**Allowed exceptions to mutate():**
1. **Migrations:** `packages/database/drizzle/*.sql` (schema changes)
2. **Worker projection rebuilders:** `packages/workers/*/rebuild-*.ts` (projection tables only)
3. **Evidence appenders:** Via `mutate()` kernel with special evidence handler
4. **Scripts:** `packages/database/scripts/*` (admin/maintenance only)

**Prohibited:**
- Direct `tx.insert(truthTable)` in app handlers (`apps/*/`, `packages/*/api/`)
- Direct `db.update()` on truth tables outside mutate kernel
- Projection writes from web/API contexts

**Enforcement:**
- ESLint `no-restricted-syntax` blocks `db.insert()`, `db.update()`, `db.delete()` globally
- `packages/crud/eslint.config.js` overrides to allow kernel writes
- `packages/workers/*/eslint.config.js` overrides for projection rebuilders only

**Invariant INV-WRITE-02:** Projection tables can ONLY be mutated by worker role (enforced via REVOKE + code-level denylist).  
**Invariant INV-WRITE-03:** DDL operations ONLY from `packages/database/src/ddl/*` helpers (Gate DDL-01 enforces).

**Transaction-scoped auth context pattern:**

```typescript
// packages/database/src/auth-context.ts
import { sql } from 'drizzle-orm';
import { db } from './db';

export async function withAuthContext<T>(
  ctx: { orgId: string; userId: string },
  fn: (tx: typeof db) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    // CRITICAL: MUST be first statement in transaction
    await tx.execute(sql`SELECT auth.set_context(${ctx.orgId}::uuid, ${ctx.userId}::text)`);
    return fn(tx);
  });
}

// Usage in API handler
export async function handleRequest(req: Request) {
  const { orgId, userId } = await extractAuthFromJWT(req);
  
  return withAuthContext({ orgId, userId }, async (tx) => {
    // All queries in this scope have correct auth context
    const invoices = await tx.select().from(invoices).where(eq(invoices.orgId, orgId));
    return invoices;
  });
}
```

**Why transaction-scoped:** With PgBouncer transaction pooling + serverless reuse, setting context outside a transaction causes "wrong org" bugs under concurrency.

#### Option 2: Neon HTTP (for non-Vercel serverless)

```typescript
// packages/database/src/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: 'no-store' },
});

export const db = drizzle(sql, { schema });

const sqlRo = neon(process.env.DATABASE_URL_RO || process.env.DATABASE_URL!, {
  fetchOptions: { cache: 'no-store' },
});

export const dbRo = drizzle(sqlRo, { schema });
```

**Use for:** Cloudflare Workers, Netlify Edge, Deno Deploy (no TCP support)

#### Option 3: WebSocket (for edge with transactions)

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws; // Required for Node.js < v22

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

**Use for:** Edge environments that need interactive transactions

### 2.2 Driver Decision Matrix

**Capability comparison:**

| Driver | Runtime | Batch API | Prepared Statements | Interactive Transactions | Pooling | Migration Safe |
|--------|---------|-----------|---------------------|--------------------------|---------|----------------|
| `neon-http` | Edge (no TCP) | ✅ | ❌ | ❌ | N/A | ❌ **NEVER** |
| `neon-serverless` | Edge + Node | ✅ | ✅ | ✅ | ✅ | ✅ |
| `node-postgres` | Node/Vercel | ❌ | ✅ | ✅ | ✅ | ✅ |
| `postgres-js` | Node | ❌ | ✅ | ✅ | ✅ | ✅ (max: 1) |

**Migration driver requirements:**
- **MUST** support transactions (for atomic multi-statement migrations)
- **MUST** support rollback on failure
- **RECOMMENDED:** Use same driver for migrations as runtime (consistency)
**Critical notes:**
- **Batch API:** Only Neon drivers (`neon-http`, `neon-serverless`), D1, LibSQL support native `db.batch()`. Use CTE/transaction fallback for other drivers.
- **Prepared statements:** Only effective with session pooling or direct connections. NOT with PgBouncer transaction pooling.
- **The factory is the SSOT:** All capability decisions must reference `capabilities` object, not driver-specific checks.

### 2.3 Connection Factory Pattern

**Capability-gated database client:**

```typescript
// packages/database/src/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import * as schema from './schema';

export type Runtime = 'vercel' | 'edge' | 'node';
export type DbMode = 'rw' | 'ro';

export interface DbCapabilities {
  batch: boolean;           // Native db.batch() support
  prepared: boolean;        // Server-side prepared statements
  interactiveTx: boolean;   // Interactive transactions
  pooling: boolean;         // Connection pooling
}

export interface DbClient<TDb = any> {
  db: TDb; // Drizzle instance (type-safe per driver)
  capabilities: DbCapabilities;
  runtime: Runtime;
}

// Factory function
export function createDb(config: {
  runtime: Runtime;
  mode: DbMode;
}): DbClient {
  const { runtime, mode } = config;
  const url = mode === 'rw' ? DATABASE_URL : DATABASE_URL_RO;
  
  switch (runtime) {
    case 'vercel': {
      // Vercel Fluid Compute (node-postgres)
      const pool = new Pool({
        connectionString: url,
        max: 10,
        idleTimeoutMillis: 5000,
      });
      attachDatabasePool(pool);
      
      return {
        db: drizzle({ client: pool, schema }),
        capabilities: {
          batch: false,          // node-postgres doesn't support db.batch()
          prepared: shouldEnablePrepared(url, 'vercel'),  // Auto-disabled on pooler
          interactiveTx: true,
          pooling: true,
        },
        runtime: 'vercel',
      };
    }
    
    case 'edge': {
      // Neon HTTP (for Cloudflare Workers, Netlify Edge)
      const sql = neon(url, { fetchOptions: { cache: 'no-store' } });
      
      return {
        db: drizzle(sql, { schema }),
        capabilities: {
          batch: true,           // Neon driver supports db.batch()
          prepared: false,       // HTTP is stateless
          interactiveTx: false,  // No session state
          pooling: false,
        },
        runtime: 'edge',
      };
    }
    
    case 'node': {
      // Long-running Node.js server (postgres-js)
      const queryClient = postgres(url);
      
      return {
        db: drizzle(queryClient, { schema }),
        capabilities: {
          batch: false,          // postgres-js doesn't support db.batch()
          prepared: shouldEnablePrepared(url, 'node'),  // Auto-disabled on pooler
          interactiveTx: true,
          pooling: true,
        },
        runtime: 'node',
      };
    }
  }
}

// Auto-detect runtime
function detectRuntime(): Runtime {
  if (process.env.VERCEL) return 'vercel';
  if (typeof EdgeRuntime !== 'undefined') return 'edge';
  return 'node';
}

// Export singleton instances
const runtime = detectRuntime();
export const { db, capabilities } = createDb({ runtime, mode: 'rw' });
export const { db: dbRo } = createDb({ runtime, mode: 'ro' });

// Capability-gated helper
export function getDb(options: { forcePrimary?: boolean } = {}) {
  return options.forcePrimary ? db : dbRo;
}

// Primary-only helper (for read-after-write)
export function dbPrimary() {
  return db;
}

// Type-safe batch assertion for compile-time narrowing
type DbBase = { db: any; capabilities: DbCapabilities; runtime: Runtime };
type DbWithBatch = DbBase & { capabilities: DbCapabilities & { batch: true } };

export function assertBatch(client: DbBase): asserts client is DbWithBatch {
  if (!client.capabilities.batch) {
    throw new Error('Batch API not supported by current driver');
  }
}

// Pooler detection for prepared statement capability
function detectPoolerMode(url: string): boolean {
  return url.includes('-pooler.');
}

// Boot-time role validation - fail fast if runtime uses privileged roles
const FORBIDDEN_RUNTIME_ROLES = ['schema_owner', 'migration_admin', 'postgres'];
function validateRuntimeRole(url: string): void {
  const parsed = new URL(url);
  const username = parsed.username || 'postgres';
  
  if (FORBIDDEN_RUNTIME_ROLES.includes(username)) {
    throw new Error(
      `SECURITY: Runtime cannot use privileged role "${username}". ` +
      `Use "authenticated" role for app runtime. ` +
      `Privileged roles are for migrations only.`
    );
  }
}

// CRITICAL: Validate on module load (fail fast)
validateDatabaseUrl(DATABASE_URL, 'DATABASE_URL');
validateRuntimeRole(DATABASE_URL);
if (DATABASE_URL_RO) {
  validateDatabaseUrl(DATABASE_URL_RO, 'DATABASE_URL_RO');
  validateRuntimeRole(DATABASE_URL_RO);
}

// Prepared statements: OPT-IN only (default false for safety)
function shouldEnablePrepared(url: string, runtime: Runtime): boolean {
  // Explicit opt-in required
  const DB_PREPARED = process.env.DB_PREPARED === '1';
  if (!DB_PREPARED) return false;
  
  if (detectPoolerMode(url)) {
    // PgBouncer transaction pooling - prepared statements ineffective
    return false;
  }
  // Only enable for TCP-based drivers with session pooling
  return runtime === 'vercel' || runtime === 'node';
}

// Invariant PREP-01: If DATABASE_URL points to -pooler endpoint in transaction mode,
// capabilities.prepared must be false (prepared statements ineffective with transaction pooling)
// Invariant PREP-02: Prepared statements cannot be enabled when using PgBouncer transaction pooling

**Prepared statements truth table:**

| Endpoint | Pooling Mode | DB_PREPARED=1 | Prepared Statements |
|----------|--------------|---------------|---------------------|
| `ep-xxx.neon.tech` (direct compute) | session-like | ✅ | ✅ effective |
| `ep-xxx.neon.tech` (direct compute) | session-like | ❌ | ❌ disabled (opt-in required) |
| `ep-xxx-pooler.neon.tech` | transaction pooling | ✅ | ❌ ineffective (auto-disabled) |
| `ep-xxx-pooler.neon.tech` | session pooling | ✅ | ✅ effective |

**Rule:** Default to **safe false** (opt-in only). Set `DB_PREPARED=1` only after verifying session pooling.

**Gate PREP-03:** CI fails if `DB_PREPARED=1` is set in production without documented pooling mode verification.

### 2.4 DbSession Primitive (Single Entrypoint)

**The DbSession primitive is the ONLY way to access the database in application code.**

```typescript
// packages/database/src/db-session.ts
import { db, dbRo } from './db';
import { sql } from 'drizzle-orm';
import { QUERY_SHAPES, type QueryShapeKey } from './query-shapes';

export interface AuthContext {
  orgId: string;
  userId: string;
  role?: 'authenticated' | 'worker' | 'support_admin';
}

export interface DbSession {
  // Read-write transaction (sets auth context, uses primary)
  rw<T>(fn: (tx: typeof db) => Promise<T>): Promise<T>;
  
  // Read-only transaction (sets auth context, uses replica or primary if wrote)
  ro<T>(fn: (tx: typeof dbRo) => Promise<T>): Promise<T>;
  
  // Read query (convenience, routes to ro() internally)
  read<T>(fn: (tx: typeof dbRo) => Promise<T>): Promise<T>;
  
  // Tagged query with shape ID (for observability)
  query<T>(shapeKey: QueryShapeKey, fn: () => Promise<T>): Promise<T>;
  
  // Track if session has performed any writes
  readonly wrote: boolean;
}

export function createDbSession(ctx: AuthContext): DbSession {
  let wrote = false;
  
  return {
    async rw<T>(fn: (tx: typeof db) => Promise<T>): Promise<T> {
      wrote = true;
      
      return db.transaction(async (tx) => {
        // CRITICAL: Set auth context as first statement
        await tx.execute(
          sql`SELECT auth.set_context(${ctx.orgId}::uuid, ${ctx.userId}::text)`
        );
        
        return fn(tx);
      });
    },
    
    async ro<T>(fn: (tx: typeof dbRo) => Promise<T>): Promise<T> {
      // CRITICAL: RLS predicates use auth.org_id(), so context MUST be set
      // Use read-only transaction to prevent accidental writes
      const client = wrote ? db : dbRo; // Route to primary if wrote
      
      return client.transaction(async (tx) => {
        // Set auth context even for reads (RLS requires it)
        await tx.execute(
          sql`SELECT auth.set_context(${ctx.orgId}::uuid, ${ctx.userId}::text)`
        );
        
        return fn(tx);
      }, { 
        accessMode: 'read only',
        isolationLevel: 'read committed',
      });
    },
    
    async read<T>(fn: (tx: typeof dbRo) => Promise<T>): Promise<T> {
      // Convenience method - routes to ro() internally
      return this.ro(fn);
    },
    
    async query<T>(shapeKey: QueryShapeKey, fn: () => Promise<T>): Promise<T> {
      const shape = QUERY_SHAPES[shapeKey];
      const start = Date.now();
      
      try {
        const result = await fn();
        const duration = Date.now() - start;
        
        if (duration > (shape.warnMs || 1000)) {
          logger.warn('Slow query detected', {
            shapeId: shape.id,
            duration,
            threshold: shape.warnMs || 1000,
          });
        }
        
        return result;
      } catch (error) {
        logger.error('Query failed', {
          shapeId: shape.id,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
    
    get wrote() {
      return wrote;
    },
  };
}

// Usage in API handlers
export async function handleInvoiceCreate(req: Request) {
  const { orgId, userId } = await extractAuthFromJWT(req);
  const session = createDbSession({ orgId, userId });
  
  // All database access goes through session
  const invoice = await session.rw(async (tx) => {
    return tx.insert(invoices).values(data).returning();
  });
  
  // Read-after-write: session automatically routes to primary
  return session.ro(async (tx) => {
    // ro() internally uses primary because session.wrote is true
    return tx.select().from(invoices).where(eq(invoices.id, invoice.id));
  });
}

// Read-only handler
export async function handleInvoiceList(req: Request) {
  const { orgId, userId } = await extractAuthFromJWT(req);
  const session = createDbSession({ orgId, userId });
  
  // Read-only: uses replica (no writes in this session)
  return session.ro(async (tx) => {
    return tx.select().from(invoices)
      .where(eq(invoices.orgId, orgId))
      .limit(100);
  });
}
```

**Why DbSession:**
1. **Single entrypoint:** All DB access is auditable and observable
2. **Auth context enforcement:** Both `rw()` and `ro()` set context (RLS requires it)
3. **Read routing:** `ro()` uses replica unless `wrote` is true, then uses primary
4. **Query shape tagging:** `query()` enforces observability
5. **Write tracking:** `wrote` flag enables read-after-write detection
6. **Read-only safety:** `ro()` uses `accessMode: 'read only'` to prevent accidental writes

**Invariant INV-SESSION-01:** All application database access MUST go through `DbSession`.
**Invariant INV-SESSION-02:** Direct `db` or `dbRo` imports are ONLY allowed in:
  - `packages/database/src/db-session.ts` (session implementation)
  - `packages/database/src/ddl/*` (DDL helpers)
  - `packages/database/scripts/*` (admin scripts)
  - `packages/workers/*` (projection rebuilders with BYPASSRLS)
**Invariant INV-SESSION-CTX-01:** Any query that relies on `auth.*` functions MUST execute inside a transaction that sets context as first statement.
**Invariant INV-READ-SESSION-01:** Within a request, the session decides primary vs replica; callers never choose directly.

**Gate SESSION-01:** ESLint rule blocks `import { db, dbRo } from '@/database'` outside allowed paths.
**Gate SESSION-02:** CI fails if `db.transaction()` is called outside `DbSession.rw()`.
**Gate SESSION-03:** CI detects `dbRo` usage in same call chain after `session.rw()` (must use `session.ro()` instead).

### 2.5 Read Routing (Deprecated - Use DbSession)

> **⚠️ DEPRECATED:** Direct read routing is replaced by `DbSession` (§2.4).
> The session automatically handles primary vs replica routing based on `wrote` flag.
> This section remains for reference only.

**Replica lag tolerance examples (still relevant for DbSession.ro()):**

✅ **Safe for read replicas:**
- List pages (invoices, customers, items)
- Dashboards and analytics
- Search results
- Reports and exports
- Background data for UI dropdowns

❌ **MUST use primary (DbSession handles automatically after writes):**
- Post-create redirect to detail page (read-after-write)
- Idempotency checks before mutation
- Uniqueness validation (doc_no, sku)
- Workflow state reads after state transition
- Balance checks before payment
- Any read that affects correctness of subsequent write

**Invariant INV-READ-02:** RO reads MUST tolerate replica lag (no correctness-critical reads).

### 2.6 Environment Variables

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `DATABASE_URL` | Primary RW compute | ✅ | `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/main?sslmode=require` |
| `DATABASE_URL_RO` | Read replica | ⚠️ Recommended | `postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/main` |
| `DATABASE_URL_MIGRATIONS` | Migration runner | ❌ Optional | Falls back to `DATABASE_URL` |
| `SEARCH_WORKER_DATABASE_URL` | Search maintenance (BYPASSRLS) | ⚠️ Required for workers | Uses role with `BYPASSRLS` for cross-org maintenance |

### 2.7 Connection String Optimization

**Driver-aware optimization** in `db.ts`:

```typescript
// IMPORTANT: Connection string parameters are driver-specific
// neon-http (HTTP/fetch) may ignore libpq parameters like sslnegotiation
// Only apply optimizations that the driver actually supports

function optimizeConnectionString(url: string, driver: 'http' | 'websocket'): string {
  const parsed = new URL(url);
  
  // SSL mode (supported by both drivers)
  if (!parsed.searchParams.has('sslmode')) {
    parsed.searchParams.set('sslmode', 'require');
  }
  
  // WebSocket-specific optimizations (postgres-js, @neondatabase/serverless Pool)
  if (driver === 'websocket') {
    // PG17 fast SSL negotiation (libpq parameter)
    if (!parsed.searchParams.has('sslnegotiation')) {
      parsed.searchParams.set('sslnegotiation', 'direct');
    }
    
    // Channel binding (libpq parameter)
    if (!parsed.searchParams.has('channel_binding')) {
      parsed.searchParams.set('channel_binding', 'require');
    }
  }
  
  return parsed.toString();
}

// Current setup uses HTTP driver
const optimizedUrl = optimizeConnectionString(process.env.DATABASE_URL!, 'http');

### 2.8 Neon Branching Strategy

| Environment | Branch Type | Lifecycle | Purpose |
|-------------|-------------|-----------|---------|
| **Production** | Main branch | Permanent | Production data, PITR enabled |
| **Staging** | Long-lived branch | Permanent | Pre-prod testing, mirrors prod schema |
| **Preview** | Ephemeral branch | Auto-delete after PR merge | Vercel preview deployments |
| **Development** | Feature branches | Manual cleanup | Local dev, schema experiments |
| **CI/CD** | Test branches | Auto-delete after tests | Integration tests, isolated runs |

// Branch creation:
```bash
# Create feature branch from main
neon branches create --name feat/new-schema --parent main

# Vercel auto-creates preview branches
# DATABASE_URL automatically set per preview deployment
```

### 2.9 Autoscaling Configuration

// Compute units:
- **Min:** 0.25 CU (scale-to-zero for cost optimization)
- **Max:** 4 CU for production (burst capacity)
- **Default:** 1 CU for steady-state workloads

**Connection pooling:**
- **Mode:** Transaction pooling via PgBouncer
- **Pool size:** Auto-scaled by Neon based on compute units
- **Timeout:** 30s statement timeout, 60s idle timeout

### 2.10 Geographic Distribution

| Region | Role | Latency Target |
|--------|------|----------------|
| `us-east-1` | Primary | < 10ms (same region as Vercel) |
| `eu-west-1` | Read replica | < 50ms for EU users |
| `ap-southeast-1` | Read replica | < 80ms for APAC users |

**Replica lag monitoring:**
```sql
-- Track replication lag (run on primary)
SELECT 
  client_addr,
  state,
  replay_lag,
  write_lag,
  flush_lag
FROM pg_stat_replication;

-- Alert if replay_lag > 100ms
```

---

## 3. Drizzle ORM Patterns

### 3.1 Schema as Single Source of Truth

**Directory structure:**
```
packages/database/src/
├── schema/
│   ├── index.ts              ← Barrel export (auto-generated)
│   ├── _registry.ts          ← Table registry (auto-generated)
│   ├── contacts.ts           ← Domain tables
│   ├── invoices.ts
│   ├── audit-logs.ts         ← Evidence tables
│   └── ... (87 total)
├── helpers/
│   ├── base-entity.ts        ← Column helpers
│   ├── tenant-policy.ts      ← RLS helpers
│   └── field-types.ts        ← Custom types
├── db.ts                     ← Connection instances
└── index.ts                  ← Public API
```

### 3.2 Column Helpers Pattern

**Base entity columns** (all domain tables):
```typescript
// packages/database/src/helpers/base-entity.ts
import { uuid, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const baseEntityColumns = {
  // Note: NOT primaryKey() — composite PK (org_id, id) defined at table level
  id: uuid('id').notNull(),
  orgId: uuid('org_id').notNull().default(sql`auth.require_org_id()`),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by').notNull().default(sql`auth.user_id()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  // Note: defaultNow() sets insert-time value; DB trigger (set_updated_at) handles updates
  // Truth tables MUST have trigger enabled (hasUpdatedAtTrigger: true)
  // App code MUST NOT set updated_at on truth tables (except explicit exceptions)
  updatedBy: text('updated_by').notNull().default(sql`auth.user_id()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: text('deleted_by'),
} as const;
```

**ERP entity columns** (adds company/site axis):
```typescript
// packages/database/src/helpers/erp-entity.ts
// CRITICAL: Do NOT use .references() for composite FK - define in table config
export const erpEntityColumns = {
  ...baseEntityColumns,
  companyId: uuid('company_id'), // FK defined at table level
  siteId: uuid('site_id'),       // FK defined at table level
} as const;
```

**Document entity columns** (adds lifecycle):
```typescript
// packages/database/src/helpers/doc-entity.ts
export const docEntityColumns = {
  ...erpEntityColumns,
  docNo: text('doc_no'),
  docDate: timestamp('doc_date', { withTimezone: true }).notNull(),
  docStatus: text('doc_status').notNull().default('draft'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  submittedBy: text('submitted_by'),
} as const;
```

### 3.3 Driver Capabilities

**Capability matrix by driver:**

| Feature | neon-http | neon-serverless (Pool) | node-postgres (pg) | postgres-js |
|---------|-----------|------------------------|--------------------|--------------|
| **Batch API** | ✅ Native `db.batch()` | ✅ Native `db.batch()` | ❌ Use CTE/tx | ❌ Use CTE/tx |
| **Prepared statements** | ❌ Stateless | ✅ WebSocket state | ⚠️ Session pooling only | ✅ Supported |
| **Interactive transactions** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Connection pooling** | ❌ Stateless | ✅ Pool | ✅ Pool | ✅ Pool |
| **Ideal for** | Edge (no TCP) | Edge (with tx) | Vercel Fluid | Long-running |

**Critical constraints:**

1. **Batch API:** Only available with Neon drivers (`neon-http`, `neon-serverless`), D1, and LibSQL. NOT available with `node-postgres` or `postgres-js`.

2. **Prepared statements:** 
   - ❌ Don't use with HTTP drivers (stateless)
   - ❌ Don't use with **transaction pooling** (PgBouncer in transaction mode) - session state doesn't persist
   - ✅ Only use with **session pooling** or direct connections

3. **PgBouncer transaction pooling:** Server-side prepared statements are ineffective because session state doesn't persist between transactions. Use query shape optimization instead.

### 3.4 Advanced Query Patterns

**Query shape registry** (always use):
```typescript
// packages/database/src/queries/invoices.ts
// Query shapes for consistent parameterization (works with all drivers)
export const invoiceQueries = {
  byId: (id: string) => 
    db.select().from(invoices).where(eq(invoices.id, id)),
  
  listByOrg: (orgId: string, limit: number) => 
    db.select()
      .from(invoices)
      .where(eq(invoices.orgId, orgId))
      .orderBy(desc(invoices.createdAt))
      .limit(limit),
  
  withLines: (id: string) => 
    db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: {
        lines: {
          orderBy: (lines, { asc }) => [asc(lines.lineNumber)],
        },
      },
    }),
} as const;

// Prepared statements (use only when beneficial)
// Decision matrix:
// - neon-http (HTTP): ❌ Don't use (stateless, won't persist)
// - neon-serverless (Pool): ✅ Use for hot paths (WebSocket maintains state)
// - node-postgres: ⚠️ Only with SESSION pooling (NOT transaction pooling)
// - postgres.js: ✅ Use for hot paths (TCP maintains state)
// - PgBouncer transaction mode: ❌ Don't use (session state doesn't persist)

export const preparedInvoiceQueries = {
  // Only create if using TCP-based driver or WebSocket Pool
  byId: db
    .select()
    .from(invoices)
    .where(eq(invoices.id, placeholder('id')))
    .prepare('invoice_by_id'),
  
  byOrgPaginated: db
    .select()
    .from(invoices)
    .where(eq(invoices.orgId, placeholder('orgId')))
    .limit(placeholder('limit'))
    .prepare('invoices_by_org'),
} as const;

// Usage (only if prepared statements are beneficial for your driver)
const invoice = await preparedInvoiceQueries.byId.execute({ id: '...' });
```

**Batch queries (list + count):**

**Option A: Drizzle native batch API** (Neon/D1/LibSQL drivers only):

```typescript
// packages/database/src/queries/list-with-count.ts
import { db } from '../db';
import { eq, desc, sql } from 'drizzle-orm';

// ONLY works with neon-http, neon-serverless, D1, LibSQL drivers
// Does NOT work with node-postgres or postgres-js
export async function listInvoicesWithCount(orgId: string, limit: number) {
  // CRITICAL: Use capabilities.batch, not db.batch existence check
  if (!capabilities.batch) {
    throw new Error('Batch API not supported by current driver');
  }
  
  const [items, [{ count }]] = await db.batch([
    db.select()
      .from(invoices)
      .where(eq(invoices.orgId, orgId))
      .orderBy(desc(invoices.createdAt))
      .limit(limit),
    
    db.select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(eq(invoices.orgId, orgId)),
  ]);
  
  return { items, total: count };
}
```

**Option B: CTE pattern** (works with all drivers):

```typescript
// For node-postgres, postgres-js, or any driver without batch support
export async function listInvoicesWithCountCTE(orgId: string, limit: number) {
  const result = await db.execute(sql`
    WITH filtered AS (
      SELECT *
      FROM invoices
      WHERE org_id = ${orgId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    )
    SELECT
      (SELECT json_agg(filtered.*) FROM filtered) AS items,
      (SELECT count(*) FROM invoices WHERE org_id = ${orgId}) AS total_count
  `);
  
  const { items, total_count } = result[0];
  return { items: items || [], total: total_count };
}
```

**Option C: Transaction with 2 queries** (works with all drivers):

```typescript
// Fallback for drivers without batch API
export async function listInvoicesWithCountTx(orgId: string, limit: number) {
  return db.transaction(async (tx) => {
    const items = await tx.select()
      .from(invoices)
      .where(eq(invoices.orgId, orgId))
      .orderBy(desc(invoices.createdAt))
      .limit(limit);
    
    const [{ count }] = await tx.select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(eq(invoices.orgId, orgId));
    
    return { items, total: count };
  });
}
```

**Decision matrix:**
- **Neon drivers** (neon-http, neon-serverless): Use Option A (native batch)
- **Vercel Fluid** (node-postgres): Use Option B (CTE) or Option C (transaction)
- **Long-running servers** (postgres-js): Use Option B (CTE) or Option C (transaction)

**Relational queries** (for complex joins):
```typescript
// packages/database/src/queries/invoices-relational.ts

// ✅ Relational API (single SQL query, type-safe nested results)
export async function getInvoiceWithDetails(id: string) {
  return db.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: {
      lines: {
        orderBy: (lines, { asc }) => [asc(lines.lineNumber)],
        columns: { id: true, lineNumber: true, amountMinor: true },
      },
      customer: {
        columns: { id: true, name: true, email: true },
      },
      company: true,
    },
  });
}

// ❌ Builder API (N+1 queries, manual joining)
export async function getInvoiceWithDetailsManual(id: string) {
  const invoice = await db.select().from(invoices).where(eq(invoices.id, id));
  const lines = await db.select().from(invoiceLines).where(eq(invoiceLines.invoiceId, id));
  const customer = await db.select().from(customers).where(eq(customers.id, invoice[0].customerId));
  // ... manual joining required
}
```

**Recommendation:** Use relational API for queries with 2+ joins
```

**Relational query optimization:**
```typescript
// ❌ N+1 query anti-pattern
const invoices = await db.select().from(invoices);
for (const invoice of invoices) {
  const lines = await db.select().from(invoiceLines).where(eq(invoiceLines.invoiceId, invoice.id));
}

// ✅ Single query with join
const invoicesWithLines = await db.query.invoices.findMany({
  where: eq(invoices.orgId, orgId),
  with: {
    lines: {
      columns: { id: true, lineNumber: true, amountMinor: true }, // Partial selection
      orderBy: (lines, { asc }) => [asc(lines.lineNumber)],
    },
  },
  limit: 50,
});
```

### 3.5 Transaction Patterns

**Transaction isolation levels:**

```typescript
// packages/crud/src/mutate.ts

// For critical financial mutations (prevents phantom reads)
await db.transaction(async (tx) => {
  // ... mutation logic
}, {
  isolationLevel: 'serializable',
  accessMode: 'read write',
});

// For read-heavy operations
await db.transaction(async (tx) => {
  // ... read logic
}, {
  isolationLevel: 'repeatable read',
  accessMode: 'read only', // Optimization hint
});

// Default isolation (most common)
await db.transaction(async (tx) => {
  // ... standard operations
}, {
  isolationLevel: 'read committed', // Postgres default
});
```

**Supported isolation levels:**
- `'read uncommitted'` (treated as read committed in Postgres)
- `'read committed'` (default)
- `'repeatable read'`
- `'serializable'` (strictest, prevents phantom reads)

**Invariant TX-01:** Financial mutations (invoices, payments, stock) MUST use `serializable` isolation.  
**Invariant TX-02:** Read-only transactions SHOULD specify `accessMode: 'read only'`.

**Transaction retry logic** (for serialization failures):

```typescript
// packages/database/src/retry.ts (enhance existing)

export async function withTransactionRetry<T>(
  operation: (tx: Transaction) => Promise<T>,
  options: {
    maxRetries?: number;
    isolationLevel?: 'serializable' | 'repeatable read';
  } = {}
): Promise<T> {
  const { maxRetries = 3, isolationLevel = 'serializable' } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await db.transaction(operation, { isolationLevel });
    } catch (error: any) {
      // Retry on serialization failure (SQLSTATE 40001)
      if (error.code === '40001' && attempt < maxRetries) {
        const delay = Math.min(100 * Math.pow(2, attempt), 1000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Transaction retry limit exceeded');
}

// Usage in mutate()
await withTransactionRetry(async (tx) => {
  // Critical financial mutation with automatic retry
}, { isolationLevel: 'serializable' });
```

**Invariant TX-03:** Financial mutations MUST use `withTransactionRetry`.  
**Invariant TX-04:** Operations inside `withTransactionRetry()` MUST be idempotent. Anything that can be observed externally (emails, webhooks, file writes, API calls) MUST be written to an outbox table inside the transaction. Workers deliver side effects asynchronously.  
**Gate TX-01:** CI validates financial handlers use retry wrapper.

**Single mutation transaction:**
```typescript
// packages/crud/src/mutate.ts
await db.transaction(async (tx) => {
  // 1. Entity write
  const [entity] = await tx.insert(table).values(input).returning();
  
  // 2. Audit log (same tx)
  await tx.insert(auditLogs).values({
    entityType: spec.entityType,
    entityId: entity.id,
    action: spec.action,
    snapshot: entity,
  });
  
  // 3. Version record (same tx)
  await tx.insert(entityVersions).values({
    entityType: spec.entityType,
    entityId: entity.id,
    version: entity.version,
    snapshot: entity,
  });
  
  // 4. Outbox for async work (same tx)
  await tx.insert(searchOutbox).values({
    entityType: spec.entityType,
    entityId: entity.id,
    operation: 'upsert',
  });
});
```

**Nested transactions (savepoints):**

```typescript
// Drizzle automatically uses savepoints for nested transactions
await db.transaction(async (tx) => {
  // Main transaction
  const invoice = await tx.insert(invoices).values(data).returning();
  
  // Nested transaction (creates SAVEPOINT)
  await tx.transaction(async (tx2) => {
    // If this fails, only this savepoint rolls back
    await tx2.insert(invoiceLines).values(lines);
  });
  
  // Main transaction continues
  await tx.insert(auditLogs).values({ ... });
});
```

**Pattern:** Use nested transactions for optional/recoverable operations (e.g., invoice creation required + email notification optional)
```

**Read-after-write correctness:**
```typescript
// Force primary read after mutation
import { db, dbRo, dbPrimary } from 'afenda-database';

await mutate(spec, ctx); // Writes to primary

// CRITICAL: Read from primary to avoid replica lag
const entity = await dbPrimary()
  .select()
  .from(table)
  .where(eq(table.id, entityId));

// Helper for read-after-write
export function dbPrimary() {
  return db; // Always returns primary connection
}

// Use dbRo for reads that don't follow writes
const list = await dbRo.select().from(table).where(eq(table.orgId, orgId));
```

**Transaction with rollback:**
```typescript
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, accountId));
  
  if (account.balance < requiredAmount) {
    tx.rollback(); // Explicit rollback for validation failure
  }
  
  await tx.update(accounts)
    .set({ balance: sql`${accounts.balance} - ${requiredAmount}` })
    .where(eq(accounts.id, accountId));
});
```

**Invariant TX-05:** `tx.rollback()` only allowed for explicit validation failures after all checks. Never use as generic early-exit. Prefer throwing typed domain error and letting transaction abort naturally.

**Invariant TX-06:** Any handler that performs a mutation and then reads the mutated entity in the same request MUST read from primary (use `dbPrimary()`).
```

**Transaction return values:**
```typescript
const newBalance = await db.transaction(async (tx) => {
  await tx.update(accounts)
    .set({ balance: sql`${accounts.balance} - 100` })
    .where(eq(accounts.id, accountId));
  
  const [account] = await tx.select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(accounts.id, accountId));
  
  return account.balance; // Return value from transaction
});
```

---

## 4. Schema Design Principles

### 4.1 Table Taxonomy

Every table must be registered with a `table_kind`:

| Kind | Layer | Characteristics | Examples |
|------|-------|-----------------|----------|
| `truth` | Kernel | Domain entities, composite PK `(org_id, id)`, versioned | `invoices`, `contacts`, `products` |
| `control` | Control | Orchestration, state machines, outbox | `doc_postings`, `workflow_rules`, `search_outbox` |
| `projection` | Projection | Rebuildable, worker-only writes | `search_documents`, `stock_balances` |
| `evidence` | Evidence | Immutable, append-only, REVOKE UPDATE/DELETE | `audit_logs`, `entity_versions` |
| `link` | Link | Junction tables, may lack version | `contact_addresses`, `user_roles` |
| `system` | System | Auth, users, API keys | `users`, `roles`, `api_keys` |

**Registry enforcement (mechanical validation):**
```typescript
// packages/database/src/schema/_registry.ts (auto-generated)
export const TABLE_REGISTRY = {
  invoices: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasUpdatedAtTrigger: true,
    hasCompositePk: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
  },
  audit_logs: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasUpdatedAtTrigger: false, // Append-only, no updates
    hasBlockUpdateDeleteTrigger: true,
  },
  search_documents: {
    kind: 'projection',
    hasRls: false,
    hasTenant: false,
    hasUpdatedAtTrigger: false, // Rebuildable
    workerOnlyWrites: true,
  },
  some_custom_table: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasUpdatedAtTrigger: false,
    updatedAtManagedInApp: true, // Explicit exception
  },
  // ... 87 tables
} as const;

// Table taxonomy validation rules (CI-enforced)
const TAXONOMY_RULES = {
  truth: {
    mustHave: ['hasRls', 'hasTenant', 'hasCompositePk', 'hasUpdatedAtTrigger_XOR_updatedAtManagedInApp'],
    mustNotHave: ['workerOnlyWrites'],
  },
  evidence: {
    mustHave: ['hasBlockUpdateDeleteTrigger', 'hasTenant'],
    mustNotHave: ['hasUpdatedAtTrigger'], // Append-only, no updates
  },
  projection: {
    mustHave: ['workerOnlyWrites'],
    mustNotHave: ['hasUpdatedAtTrigger'], // Rebuildable
  },
  control: {
    mustHave: ['hasTenant'],
  },
  link: {
    // Flexible - may or may not have versioning
  },
  system: {
    mustNotHave: ['hasTenant'], // System tables are global
  },
} as const;

// Invariant SCH-05a: Exactly one of hasUpdatedAtTrigger OR updatedAtManagedInApp must be true
// Invariant SCH-05b: Truth tables MUST NOT set updated_at in app code if trigger is enabled
// Invariant SCH-TAX-01: Every table MUST have a 'kind' in TABLE_REGISTRY
// Invariant SCH-TAX-02: Table attributes MUST match taxonomy rules for its kind
// Gate SCH-05a: CI fails if neither or both are true for truth tables
// Gate SCH-TAX-01: CI validates TABLE_REGISTRY against actual schema (detects drift)
// Gate SCH-TAX-02: CI validates table attributes match TAXONOMY_RULES for declared kind
```

### 4.2 Identity Rule (Composite Primary Keys)

**Tenant-scoped foreign key helper:**

```typescript
// packages/database/src/helpers/tenant-fk.ts
import { foreignKey, type AnyPgColumn } from 'drizzle-orm/pg-core';

export function tenantFk(
  name: string,
  from: { orgId: AnyPgColumn; id: AnyPgColumn },
  to: { orgId: AnyPgColumn; id: AnyPgColumn }
) {
  return foreignKey({
    columns: [from.orgId, from.id],
    foreignColumns: [to.orgId, to.id],
    name,
  });
}

// Usage
export const invoices = pgTable('invoices', {
  orgId: uuid('org_id').notNull(),
  id: uuid('id').notNull(),
  customerId: uuid('customer_id').notNull(),
  companyId: uuid('company_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  
  // ✅ Use helper for composite FKs
  customerFk: tenantFk('invoices_customer_fk',
    { orgId: table.orgId, id: table.customerId },
    { orgId: customers.orgId, id: customers.id }
  ),
  
  companyFk: tenantFk('invoices_company_fk',
    { orgId: table.orgId, id: table.companyId },
    { orgId: companies.orgId, id: companies.id }
  ),
}));
```

**Gate FK-02a:** If a table contains `*_id` and the target is a truth table, it MUST use `tenantFk()` helper (or match its pattern).

**Truth tables MUST use composite PK + composite FKs:**
```typescript
// ✅ Correct: Composite PK + composite FKs for truth tables
export const invoices = pgTable('invoices', {
  ...docEntityColumns, // includes companyId, siteId
  customerId: uuid('customer_id'),
  // ... other columns
}, (table) => ({
  // Composite PK is the ONLY primary key
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  
  // CRITICAL: Composite FKs for tenant safety
  // Prevents cross-org linking even if IDs collide
  companyFk: foreignKey({
    columns: [table.orgId, table.companyId],
    foreignColumns: [companies.orgId, companies.id],
    name: 'invoices_company_fk',
  }),
  
  siteFk: foreignKey({
    columns: [table.orgId, table.siteId],
    foreignColumns: [sites.orgId, sites.id],
    name: 'invoices_site_fk',
  }),
  
  customerFk: foreignKey({
    columns: [table.orgId, table.customerId],
    foreignColumns: [customers.orgId, customers.id],
    name: 'invoices_customer_fk',
  }),
  
  // Indexes
  orgCreatedIdx: index('invoices_org_created_idx').on(table.orgId, desc(table.createdAt)),
}));
```

**Why composite PK + composite FK:**
- **Composite PK:** Enforces tenant isolation at PK level, enables partition-by-org, prevents cross-tenant ID collisions
- **Composite FK:** DB-level enforcement that referenced entities belong to same org (cannot link to another org's company even if ID collides)
- **RLS simplification:** With composite FKs, RLS predicates can be simple `org_id = auth.org_id()` without subqueries

**Critical:** `baseEntityColumns.id` must NOT have `.primaryKey()` — composite PK is defined at table level. A table cannot have two primary keys.

**Invariant FK-02 (Composite FK enforcement):** If a truth table has `company_id`, `site_id`, `warehouse_id`, `customer_id`, `supplier_id`, or any other tenant-scoped entity reference, it MUST use composite FK `(org_id, *_id) -> target(org_id, id)`. Single-column FKs to composite PK tables are forbidden (tenant safety violation).

**Updated_at trigger requirement:**

Every truth table MUST have `set_updated_at` trigger applied. Define canonical function once:

```sql
-- Canonical function (create once in migration 0001)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
```

Per-table trigger with table-specific naming:

```sql
-- Per table (idempotent)
DROP TRIGGER IF EXISTS trg_invoices_set_updated_at ON invoices;
CREATE TRIGGER trg_invoices_set_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

**Gate SCH-05:** Validates `public.set_updated_at()` function exists AND every truth table has its trigger (or is explicitly marked "manual updated_at in mutate()").

### 4.5 Numeric Types for Financial Data

**Money amounts (always use bigint for minor units):**

```typescript
// ✅ Correct: Store as minor units (cents, pence, etc.)
export const invoices = pgTable('invoices', {
  totalMinor: bigint('total_minor', { mode: 'bigint' }).notNull(),
  taxMinor: bigint('tax_minor', { mode: 'bigint' }).notNull(),
  discountMinor: bigint('discount_minor', { mode: 'bigint' }).notNull(),
  // CHECK constraint for money integrity
}, (table) => ({
  totalCheck: check('invoices_total_check',
    sql`${table.totalMinor} = ${table.subtotalMinor} - ${table.discountMinor} + ${table.taxMinor}`
  ),
}));

// ❌ Wrong: Never use numeric/decimal for money
// totalAmount: numeric('total_amount', { precision: 18, scale: 2 })
// Reason: Floating point arithmetic errors, no atomic operations
```

**Rates and percentages (use numeric with high precision):**

```typescript
// For rates, percentages, exchange rates - use numeric
export const rateColumn = (name: string) => 
  numeric(name, { precision: 18, scale: 8 }).notNull();

export const taxRates = pgTable('tax_rates', {
  orgId: uuid('org_id').notNull(),
  id: uuid('id').notNull(),
  code: text('code').notNull(),
  rate: rateColumn('rate'), // e.g., 0.15000000 for 15%
  // ...
});

export const currencyRates = pgTable('currency_rates', {
  orgId: uuid('org_id').notNull(),
  id: uuid('id').notNull(),
  fromCurrency: text('from_currency').notNull(),
  toCurrency: text('to_currency').notNull(),
  rate: rateColumn('rate'), // e.g., 1.35420000 for USD->EUR
  effectiveDate: date('effective_date').notNull(),
  // ...
});
```

**Why numeric for rates:**
1. **Precision:** 8 decimal places prevents rounding errors in rate calculations
2. **Deterministic:** Same calculation always produces same result
3. **Regulatory:** Tax and exchange rate calculations must be exact
4. **Auditability:** Can reproduce historical calculations exactly

**Quantities (use numeric for fractional, bigint for whole units):**

```typescript
// Fractional quantities (e.g., 2.5 kg, 1.75 hours)
export const quantityColumn = (name: string) =>
  numeric(name, { precision: 18, scale: 6 }).notNull();

// Whole unit quantities (e.g., 100 items)
export const unitCountColumn = (name: string) =>
  bigint(name, { mode: 'bigint' }).notNull();

export const invoiceLines = pgTable('invoice_lines', {
  // ...
  quantity: quantityColumn('quantity'), // 2.500000 (fractional)
  unitCount: unitCountColumn('unit_count'), // 100 (whole units)
  // ...
});
```

**Invariant NUM-01:** Money amounts MUST use `bigint` in minor units (never `numeric` or `decimal`).
**Invariant NUM-02:** Rates and percentages MUST use `numeric(18, 8)` for precision.
**Invariant NUM-03:** Fractional quantities MUST use `numeric(18, 6)`; whole units MUST use `bigint`.
**Gate NUM-01:** CI scans schema for columns named `*_amount`, `*_total`, `*_price` and validates they use `bigint`.
**Gate NUM-02:** CI scans schema for columns named `*_rate`, `*_percent` and validates they use `numeric(18, 8)`.

### 4.6 Type Safety & Schema Generation

**Drizzle-Zod integration** (single source of truth):

```typescript
// packages/database/src/schema/invoices.ts
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const invoices = pgTable('invoices', {
  // ... column definitions
});

// Auto-generate Zod schemas from Drizzle schema
export const insertInvoiceSchema = createInsertSchema(invoices, {
  // Add refinements
  totalMinor: z.bigint().positive(),
  docNo: z.string().regex(/^INV-\d{6}$/),
  docDate: z.date(),
});

export const selectInvoiceSchema = createSelectSchema(invoices);

// Export types
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceInsert = z.infer<typeof insertInvoiceSchema>;
```

**Benefits:**
- Single source of truth (Drizzle schema)
- Auto-sync between DB and validation
- Runtime validation + compile-time types
- No duplicate schema definitions

**Type-safe enums:**

```typescript
// packages/database/src/schema/invoices.ts
import { pgEnum } from 'drizzle-orm/pg-core';

// Define enum at DB level
export const docStatusEnum = pgEnum('doc_status', [
  'draft',
  'submitted',
  'approved',
  'posted',
  'cancelled',
]);

export const invoices = pgTable('invoices', {
  // ... other columns
  docStatus: docStatusEnum('doc_status').notNull().default('draft'),
});

// Type inference works automatically
type DocStatus = typeof invoices.$inferSelect.docStatus;
// => 'draft' | 'submitted' | 'approved' | 'posted' | 'cancelled'
```

**Benefits:**
- Type-safe enum values with auto-complete
- DB-level constraint (can't insert invalid values)
- No need for CHECK constraints on text columns

### 4.4 Natural Keys & Series Constraints

**ERP systems require natural unique constraints per org:**

```typescript
// packages/database/src/schema/invoices.ts
export const invoices = pgTable('invoices', {
  ...docEntityColumns,
  docNo: text('doc_no'), // Natural key
  customerCode: text('customer_code'),
  // ... other columns
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  
  // Natural key: doc_no unique per org
  docNoUnique: uniqueIndex('invoices_org_docno_uq')
    .on(table.orgId, table.docNo),
  
  // For doc series: unique per org + company
  // docNoSeriesUnique: uniqueIndex('invoices_org_company_docno_uq')
  //   .on(table.orgId, table.companyId, table.docNo),
}));

export const items = pgTable('items', {
  ...baseEntityColumns,
  sku: text('sku').notNull(),
  // ... other columns
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  
  // SKU unique per org
  skuUnique: uniqueIndex('items_org_sku_uq')
    .on(table.orgId, table.sku),
}));
```

**Common natural key patterns:**

| Entity | Natural Key | Scope | Index | Immutable After |
|--------|-------------|-------|-------|----------------|
| Invoice | `doc_no` | org | `(org_id, doc_no)` | submit |
| Invoice (series) | `doc_no` | org + company | `(org_id, company_id, doc_no)` | submit |
| Item | `sku` | org | `(org_id, sku)` | create |
| Customer | `customer_code` | org | `(org_id, customer_code)` | create |
| GL Account | `account_code` | org + company | `(org_id, company_id, account_code)` | create |

**Natural key immutability:**

```typescript
// Invariant INV-NATKEY-IMM-01: Natural keys MUST NOT change after lifecycle milestone
// - doc_no: Immutable after submit (status != 'draft')
// - sku, customer_code, account_code: Immutable after create (always)

// Enforcement: mutate() kernel checks before update
export async function mutate<T>(spec: MutateSpec<T>, ctx: MutateContext) {
  if (spec.action === 'update') {
    const table = spec.table;
    const registry = TABLE_REGISTRY[table.name];
    
    if (registry.hasNaturalKey && registry.naturalKeyImmutable) {
      // Check if natural key is being changed
      const naturalKeyFields = getNaturalKeyFields(table);
      const isChangingNaturalKey = naturalKeyFields.some(
        field => spec.data[field] !== undefined
      );
      
      if (isChangingNaturalKey) {
        // Check lifecycle milestone
        const current = await tx.select().from(table)
          .where(eq(table.id, spec.id));
        
        if (isImmutable(current, registry)) {
          throw new Error(
            `Cannot change natural key after ${registry.immutableAfter}. ` +
            `Natural keys are immutable for data integrity.`
          );
        }
      }
    }
  }
}

// Optional: DB-level trigger for extra safety
CREATE OR REPLACE FUNCTION prevent_natural_key_change()
RETURNS trigger AS $$
BEGIN
  -- For invoices: prevent doc_no change after submit
  IF TG_TABLE_NAME = 'invoices' AND OLD.doc_status != 'draft' THEN
    IF NEW.doc_no IS DISTINCT FROM OLD.doc_no THEN
      RAISE EXCEPTION 'Cannot change doc_no after submit';
    END IF;
  END IF;
  
  -- For items: prevent sku change (always)
  IF TG_TABLE_NAME = 'items' THEN
    IF NEW.sku IS DISTINCT FROM OLD.sku THEN
      RAISE EXCEPTION 'Cannot change sku after creation';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with natural keys
CREATE TRIGGER trg_invoices_prevent_natural_key_change
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION prevent_natural_key_change();
```

**Gate NATKEY-01:** CI validates that tables with `hasNaturalKey: true` have immutability enforcement in mutate() kernel.
**Gate NATKEY-02:** CI validates that natural key fields are not in UPDATE statements outside mutate() kernel.

**Partial unique indexes for nullable natural keys:**

```typescript
// If natural key is nullable, use partial unique index
export const invoices = pgTable('invoices', {
  ...docEntityColumns,
  docNo: text('doc_no'), // Nullable until submitted
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  
  // CRITICAL: Partial index to allow multiple NULLs
  docNoUnique: uniqueIndex('invoices_org_docno_uq')
    .on(table.orgId, table.docNo)
    .where(sql`doc_no IS NOT NULL`), // Prevents duplicate NULLs from violating uniqueness
}));
```

**Why partial indexes:** Postgres `UNIQUE` already allows multiple `NULL` values (NULLs are not considered equal). We use a partial unique index to:
1. **Reduce index bloat** by excluding draft rows where key isn't assigned yet
2. **Make lifecycle intent explicit** ("unique only after submit/assign")
3. **Improve planner selectivity** (index only contains meaningful rows)

```typescript
docNoUnique: uniqueIndex('invoices_org_docno_uq')
  .on(table.orgId, table.docNo)
  .where(sql`doc_no IS NOT NULL`)
// Rationale: reduce index bloat + enforce uniqueness only once assigned
```

**Gate UQ-01:** If a table has `docNo`, `sku`, `customerCode`, or other natural keys, it MUST have a unique index scoped to org (and optionally company/series).  
**Gate UQ-01a:** If natural key is nullable, uniqueness MUST be partial with `WHERE key IS NOT NULL` to exclude unassigned rows.

### 4.5 Money Handling

**Always use minor units (bigint):**
```typescript
// packages/database/src/helpers/field-types.ts
// CRITICAL: mode 'bigint' prevents overflow (JS number max: 9,007,199,254,740,991)
// ERP totals can exceed this with multi-year data in minor units
export const moneyMinor = (name: string) => 
  bigint(name, { mode: 'bigint' }).notNull();

// Usage in schema
export const invoices = pgTable('invoices', {
  totalMinor: moneyMinor('total_minor'),
  taxMinor: moneyMinor('tax_minor'),
  discountMinor: moneyMinor('discount_minor'),
  currencyCode: text('currency_code').notNull().default('MYR'),
});

// CHECK constraint for money integrity
export const invoiceChecks = {
  totalValid: check('total_valid', 
    sql`total_minor = (subtotal_minor - discount_minor + tax_minor)`
  ),
};
```

### 4.4 Custom Fields Architecture

**Three-table pattern:**

1. **Field definitions** (`custom_fields`):
```typescript
export const customFields = pgTable('custom_fields', {
  id: uuid('id').notNull().defaultRandom(),
  orgId: uuid('org_id').notNull(),
  entityType: text('entity_type').notNull(),
  fieldKey: text('field_key').notNull(),
  dataType: text('data_type').notNull(), // short_text, long_text, integer, decimal, etc.
  isRequired: boolean('is_required').notNull().default(false),
  validationRules: jsonb('validation_rules'),
}, (table) => ({
  pk: primaryKey({ columns: [table.orgId, table.id] }),
  // CRITICAL: Prevent duplicate field definitions
  uniqueFieldKey: uniqueIndex('custom_fields_unique_key')
    .on(table.orgId, table.entityType, table.fieldKey),
}));
```

2. **JSONB storage** (`custom_data` column on entity tables):
```typescript
export const invoices = pgTable('invoices', {
  // ... standard columns
  customData: jsonb('custom_data').default({}),
}, (table) => ({
  // Ensure custom_fields has uniqueness constraint
  // Added in custom_fields table definition
}));
```

3. **Typed index** (`custom_field_values`):
```typescript
export const customFieldValues = pgTable('custom_field_values', {
  orgId: uuid('org_id').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  fieldKey: text('field_key').notNull(),
  valueText: text('value_text'),
  valueInteger: integer('value_integer'),
  valueDecimal: numeric('value_decimal'),
  valueBoolean: boolean('value_boolean'),
  valueDate: timestamp('value_date'),
}, (table) => ({
  // CRITICAL: Prevent duplicate values for same entity+field
  uniqueValue: uniqueIndex('cfv_unique_value')
    .on(table.orgId, table.entityType, table.entityId, table.fieldKey),
  // Covering index for custom field queries
  coveringIdx: index('cfv_covering_idx')
    .on(table.orgId, table.entityType, table.fieldKey)
    .include(table.valueText, table.valueInteger),
}));
```

---

## 5. Multi-Tenant Isolation (RLS)

### 5.1 Tenant Policy Pattern

**Every domain table:**
```typescript
// packages/database/src/helpers/tenant-policy.ts
import { sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

// CRITICAL: DDL requires identifier-safe rendering with validation
// packages/database/src/ddl/ident.ts
const IDENT_REGEX = /^[a-z_][a-z0-9_]*$/i;

export function qIdent(name: string): string {
  if (!IDENT_REGEX.test(name)) {
    throw new Error(`Invalid identifier: ${name}`);
  }
  // Escape double quotes by doubling them
  return `"${name.replace(/"/g, '""')}"`;
}

// packages/database/src/ddl/rls.ts
import { qIdent } from './ident';

export function tenantPolicySql(tableName: string): string {
  const t = qIdent(tableName); // Safe-by-construction
  return `
    -- Idempotent: drop if exists before creating
    DROP POLICY IF EXISTS tenant_isolation ON ${t};
    CREATE POLICY tenant_isolation ON ${t}
      USING (org_id = auth.org_id())
      WITH CHECK (org_id = auth.org_id());
  `;
}

// Invariant DDL-01: DDL helpers MUST use registry-whitelisted identifiers, never user input
// Gate DDL-01: CI fails if sql.raw() is used outside packages/database/src/ddl/*

// Usage in migration
await db.execute(sql`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY`);
await db.execute(sql`ALTER TABLE invoices FORCE ROW LEVEL SECURITY`);
await db.execute(sql.raw(tenantPolicySql('invoices')));
```

### 5.2 Auth Helper Functions

**Postgres functions** (created in migration 0001):
```sql
-- Get org_id from JWT claims
CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'activeOrganizationId',
    ''
  )::uuid;
$$;

-- Set auth context (MUST be called at start of every request/transaction)
CREATE OR REPLACE FUNCTION auth.set_context(
  p_org_id uuid,
  p_user_id text
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object(
      'activeOrganizationId', p_org_id,
      'sub', p_user_id
    )::text,
    true  -- is_local = true (transaction-scoped)
  );
END;
$$;

-- Require org_id (throws explicit exception if NULL)
CREATE OR REPLACE FUNCTION auth.require_org_id()
RETURNS uuid
LANGUAGE plpgsql STABLE
AS $$
DECLARE v uuid;
BEGIN
  v := auth.org_id();
  IF v IS NULL THEN
    RAISE EXCEPTION 'auth.org_id() is required - no active organization in JWT claims'
      USING ERRCODE = '28000'; -- invalid_authorization_specification
  END IF;
  RETURN v;
END;
$$;

-- Get user_id from JWT
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'sub';
$$;

-- Grant to authenticated role
GRANT EXECUTE ON FUNCTION auth.org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.require_org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_id() TO authenticated;
```

### 5.3 Advanced RLS Patterns

**Multi-level isolation** (org + company + site):

⚠️ **Performance Warning:** Subqueries in RLS predicates can be expensive and complicate query planning.

```sql
-- ❌ AVOID: Unbounded subqueries (slow, not index-friendly)
CREATE POLICY company_site_isolation_slow ON invoices
  USING (
    org_id = auth.org_id() AND
    company_id IN (
      SELECT id FROM companies 
      WHERE org_id = auth.org_id()
    )
  );

-- ✅ PREFER: Direct predicates with composite FK constraints
-- Ensure FK includes org_id: FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id)
CREATE POLICY company_site_isolation_fast ON invoices
  USING (org_id = auth.org_id());
  -- Composite FK constraint enforces company belongs to org
```

**Invariant INV-RLS-02:** RLS predicates must be index-friendly (no unbounded subqueries without benchmark evidence and explicit justification).

**Invariant RLS-03 (FORCE RLS):** Truth and evidence tables MUST have `FORCE ROW LEVEL SECURITY` enabled to prevent privileged role bypass. Only admin-only maintenance tables may be exempted with explicit justification.

**Invariant RLS-CTX-01:** All web/API entrypoints MUST call `withAuthContext()` (or equivalent) before database access.  
**Invariant RLS-CTX-02:** Worker roles that bypass RLS MUST NOT depend on `auth.org_id()` defaults; workers set `org_id` explicitly on writes.  
**Gate RLS-CTX-03:** No `set_config('request.jwt.claims', ..., false)` anywhere in codebase (transaction-scoped only).

**Critical footnote:** Table owners (or roles with `BYPASSRLS`) can still bypass FORCE RLS unless ownership and operational roles are carefully managed. Ensure migrations don't accidentally run as super-privileged app role.

**Migration pattern for RLS:**
```sql
-- Enable + force RLS (idempotent)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

-- Drop + create policy (idempotent)
DROP POLICY IF EXISTS tenant_isolation ON invoices;
CREATE POLICY tenant_isolation ON invoices
  USING (org_id = auth.org_id())
  WITH CHECK (org_id = auth.org_id());
```

**Owner-based access** (user can see their own records):
```sql
CREATE POLICY owner_access ON documents
  USING (
    org_id = auth.org_id() AND
    (created_by = auth.user_id() OR auth.org_role() = 'admin')
  );
```

**Performance-optimized RLS:**
```sql
-- Partial index for high-volume tenants
CREATE INDEX invoices_org_specific_idx ON invoices (created_at DESC)
  WHERE org_id = 'specific-high-volume-org-uuid';

-- Composite index for RLS + time-range queries
CREATE INDEX invoices_org_created_idx ON invoices (org_id, created_at DESC);
```

### 5.4 Cross-Tenant Analytics (Controlled)

**Admin-only aggregation view:**
```sql
-- Security barrier prevents RLS bypass
CREATE VIEW org_metrics_admin WITH (security_barrier) AS
SELECT 
  org_id,
  COUNT(*) as invoice_count,
  SUM(total_minor) as total_revenue_minor,
  AVG(total_minor) as avg_invoice_minor
FROM invoices
GROUP BY org_id;

-- Grant only to admin role
GRANT SELECT ON org_metrics_admin TO admin_role;
```

**Worker role with BYPASSRLS:**
```sql
-- For search indexing, stock balance calculation
CREATE ROLE search_worker WITH BYPASSRLS;
GRANT SELECT, INSERT, UPDATE, DELETE ON search_documents TO search_worker;

-- Use via SEARCH_WORKER_DATABASE_URL
```

---

## 6. Performance Optimization

### 6.1 Index Strategy

**Standard indexes** (every truth table):
```typescript
export const standardIndexes = (table: PgTable) => ({
  orgCreated: index(`${table.name}_org_created_idx`)
    .on(table.orgId, desc(table.createdAt)),
  
  orgStatus: index(`${table.name}_org_status_idx`)
    .on(table.orgId, table.status),
  
  orgDeleted: index(`${table.name}_org_deleted_idx`)
    .on(table.orgId, table.deletedAt)
    .where(sql`deleted_at IS NOT NULL`), // Partial index
});
```

**Covering indexes** (reduce heap lookups):
```sql
-- Include frequently accessed columns
CREATE INDEX invoices_org_list_idx ON invoices (org_id, created_at DESC)
  INCLUDE (doc_no, total_minor, currency_code, doc_status);
```

**Partial indexes** (reduce index size):
```sql
-- Only index active/pending documents
CREATE INDEX invoices_active_idx ON invoices (org_id, doc_date DESC)
  WHERE doc_status IN ('draft', 'submitted', 'approved');

-- Only index documents with outstanding balance
CREATE INDEX invoices_aging_idx ON invoices (org_id, doc_date DESC)
  WHERE outstanding_minor > 0;
```

**GIN indexes** (JSONB, arrays, full-text):
```sql
-- Custom fields search
CREATE INDEX custom_data_gin_idx ON invoices USING GIN (custom_data);

-- Full-text search
CREATE INDEX contacts_search_idx ON contacts USING GIN (search_vector);
```

### 6.2 Query Optimization Checklist

- [ ] **Filter by org_id first** — leverage RLS + composite indexes
- [ ] **Use prepared statements** — for hot paths (list, detail, search)
- [ ] **Batch reads** — combine list + count in single round-trip
- [ ] **Partial selection** — only select needed columns
- [ ] **Limit depth** — max 3 levels of nested relations
- [ ] **Use covering indexes** — avoid heap lookups
- [ ] **Avoid SELECT \*** — specify columns explicitly

### 6.3 Connection Pooling

**Neon PgBouncer configuration:**
- **Pool mode:** Transaction (recommended for serverless)
- **Pool size:** Auto-scaled by Neon based on compute units
- **Max client connections:** 100 per compute unit
- **Statement timeout:** 30s (configurable via `statement_timeout`)

**Connection string:**
```
postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/main
                              ^^^^^^^ 
                              Use -pooler endpoint for serverless
```

### 6.4 Caching Strategy

**Redis integration:**
```typescript
// packages/database/src/cache/list-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function cachedList<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300 // 5 minutes
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Usage
const invoices = await cachedList(
  `invoices:org:${orgId}:list`,
  () => db.select().from(invoices).where(eq(invoices.orgId, orgId)),
  300
);
```

**Cache invalidation:**
```typescript
// After mutation
await mutate(spec, ctx);
await redis.del(`invoices:org:${orgId}:list`);
```

---

## 7. Migration Management

> **⚠️ DDL Identifier Safety Warning**
>
> **CRITICAL:** DDL statements (CREATE/DROP/ALTER) require identifier-safe rendering, not parameter binding.
>
> ```typescript
> // ❌ WRONG: Parameter binding for identifiers
> await db.execute(sql`DROP POLICY tenant_isolation ON ${table}`);
>
> // ✅ CORRECT: Use sql.raw() with quoted identifiers
> await db.execute(sql.raw(`DROP POLICY tenant_isolation ON "${tableName}"`));
> ```
>
> **Rule:** Identifiers (table/policy/trigger/column names) must be rendered as identifiers with proper quoting.
> Use `sql.raw()` or string DDL helpers for all DDL operations.

### 7.1 Migration Workflow

```bash
# 1. Generate migration from schema changes
pnpm --filter afenda-database db:generate

# 2. Review generated SQL
cat packages/database/drizzle/0043_new_migration.sql

# 3. Apply to Neon
pnpm --filter afenda-database db:migrate

# 4. Verify schema
pnpm --filter afenda-database db:drift-check
```

### 7.2 Migration Safety Patterns

**Add column (safe):**
```sql
-- Nullable or with default = zero downtime
ALTER TABLE invoices ADD COLUMN notes TEXT;
ALTER TABLE invoices ADD COLUMN priority INTEGER NOT NULL DEFAULT 1;
```

**Add NOT NULL (two-phase):**
```sql
-- Phase 1: Add CHECK constraint (not validated)
ALTER TABLE invoices ADD CONSTRAINT notes_not_null 
  CHECK (notes IS NOT NULL) NOT VALID;

-- Phase 2: Backfill data
UPDATE invoices SET notes = '' WHERE notes IS NULL;

-- Phase 3: Validate constraint (can take time, but allows reads/writes)
ALTER TABLE invoices VALIDATE CONSTRAINT notes_not_null;

-- Phase 4: Convert to NOT NULL
ALTER TABLE invoices ALTER COLUMN notes SET NOT NULL;
ALTER TABLE invoices DROP CONSTRAINT notes_not_null;
```

**Add foreign key (two-phase):**
```sql
-- Phase 1: Add FK without validating existing data
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fk
  FOREIGN KEY (customer_id) REFERENCES customers(id) NOT VALID;

-- Phase 2: Validate existing data (SHARE UPDATE EXCLUSIVE lock)
ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_id_fk;
```

**Create index (concurrent):**
```sql
-- Use CONCURRENTLY to avoid blocking writes
CREATE INDEX CONCURRENTLY invoices_customer_idx 
  ON invoices (customer_id);
```

**Drop column (three-phase):**
```sql
-- Phase 1: Stop writing to column (deploy code)
-- Phase 2: Drop column (fast, just metadata)
ALTER TABLE invoices DROP COLUMN old_field;
-- Phase 3: VACUUM FULL (optional, reclaim space)
```

### 7.3 Migration Testing

**Test on Neon branch:**
```bash
# Create test branch
neon branches create --name test-migration-043

# Get branch connection string
export DATABASE_URL=$(neon connection-string test-migration-043)

# Apply migration
pnpm --filter afenda-database db:migrate

# Run integration tests
pnpm test:integration

# Delete branch if successful
neon branches delete test-migration-043
```

### 7.4 Query Plan Stability

**Hot path queries must have stable, predictable execution plans.**

```typescript
// packages/database/src/query-shapes.ts
export const QUERY_SHAPES = {
  'invoices.list': {
    id: 'Q.invoices.list.v1',
    hot: true, // Mark as hot path (requires plan stability check)
    expectedIndex: 'invoices_org_created_idx',
    expectedPlan: 'Index Scan',
    maxRows: 1000,
    warnMs: 200,
  },
  'invoices.getById': {
    id: 'Q.invoices.getById.v1',
    hot: true,
    expectedIndex: 'invoices_pkey',
    expectedPlan: 'Index Scan',
    maxRows: 1,
    warnMs: 50,
  },
  'search.fullText': {
    id: 'Q.search.fullText.v1',
    hot: false, // Not hot path, plan stability not critical
    warnMs: 1000,
  },
} as const;

// Gate PLAN-01: CI validates hot path query plans
export async function validateQueryPlan(
  shapeKey: QueryShapeKey,
  query: string,
  params: unknown[] = []
): Promise<void> {
  const shape = QUERY_SHAPES[shapeKey];
  if (!shape.hot) return; // Only validate hot paths
  
  // CRITICAL: Use parameterized query shape, not literal with inlined constants
  const plan = await db.execute(
    sql`EXPLAIN (FORMAT JSON, VERBOSE) ${sql.raw(query)}`,
    params
  );
  const planJson = plan[0]['QUERY PLAN'][0];
  
  // Recursive function to check all nodes in plan tree
  function checkPlanNode(node: any, violations: string[]) {
    // 1. Check for sequential scan on large tables (negative condition)
    if (node['Node Type'] === 'Seq Scan') {
      const tableName = node['Relation Name'];
      const isLargeTable = ['invoices', 'audit_logs', 'entity_versions', 'contacts'].includes(tableName);
      
      if (isLargeTable) {
        violations.push(
          `Sequential scan on large table "${tableName}". ` +
          `Must use index. Consider adding composite index on (org_id, ...).`
        );
      }
    }
    
    // 2. Check that Index Cond includes org_id (tenant isolation)
    if (node['Node Type'] === 'Index Scan' || node['Node Type'] === 'Index Only Scan') {
      const indexCond = node['Index Cond'];
      if (indexCond && !indexCond.includes('org_id')) {
        violations.push(
          `Index scan on "${node['Relation Name']}" does not filter by org_id. ` +
          `Tenant isolation requires org_id in index condition.`
        );
      }
    }
    
    // 3. Check estimated rows are within bounds
    const estimatedRows = node['Plan Rows'];
    if (shape.maxRows && estimatedRows > shape.maxRows * 2) {
      violations.push(
        `Estimated rows ${estimatedRows} exceeds expected ${shape.maxRows} by >2x. ` +
        `Query may be missing filters or index is not selective enough.`
      );
    }
    
    // Recurse into child nodes
    if (node['Plans']) {
      for (const childNode of node['Plans']) {
        checkPlanNode(childNode, violations);
      }
    }
  }
  
  const violations: string[] = [];
  checkPlanNode(planJson.Plan, violations);
  
  if (violations.length > 0) {
    throw new Error(
      `PLAN-01 violations for ${shapeKey}:\n` +
      violations.map((v, i) => `  ${i + 1}. ${v}`).join('\n')
    );
  }
}
```

**Gate PLAN-01:** CI runs EXPLAIN on all hot path queries and validates:
1. **Negative condition:** No sequential scans on large tables (> 100K rows)
2. **Tenant isolation:** Index conditions include `org_id` filter
3. **Row count bounds:** Estimated rows within 2x of expected maximum
4. **Parameterized queries:** Always EXPLAIN the parameterized query shape, not literal strings

**Why negative conditions matter:**
- Exact index name matching is fragile (index names may change, multiple valid indexes)
- "Must NOT Seq Scan" is more robust than "must use index X"
- Allows optimizer flexibility while preventing performance regressions

**CI implementation:**
```typescript
// .github/workflows/query-plan-stability.yml
import { QUERY_SHAPES } from '@/database/query-shapes';
import { validateQueryPlan } from '@/database/plan-validator';

for (const [shapeKey, shape] of Object.entries(QUERY_SHAPES)) {
  if (!shape.hot) continue;
  
  const query = getQueryForShape(shapeKey); // Load actual query
  await validateQueryPlan(shapeKey, query);
}
```

### 7.5 Online DDL Rules (Zero-Downtime Migrations)

**DDL operations are classified by their locking behavior and production safety.**

```sql
-- CRITICAL: All migrations MUST set lock timeouts
SET lock_timeout = '2s';        -- Fail fast if lock unavailable
SET statement_timeout = '30s';  -- Prevent runaway DDL
```

**DDL Classification:**

#### Class 1: Online-Safe (No Blocking)
```sql
-- ✅ Safe for production during business hours
ALTER TABLE invoices ADD COLUMN notes TEXT;                    -- Nullable column
ALTER TABLE invoices ADD COLUMN priority INT DEFAULT 1;        -- With default

-- CRITICAL: CONCURRENTLY cannot run in transaction
-- Must be in separate non-transactional migration
CREATE INDEX CONCURRENTLY invoices_notes_idx ON invoices(notes);
DROP INDEX CONCURRENTLY old_index;

CREATE TABLE new_table (...);                                  -- New table creation
```

#### Class 2: Online-Conditional (May Block Briefly)
```sql
-- ⚠️ Safe if table is small (< 1M rows) or during maintenance window
ALTER TABLE invoices ALTER COLUMN notes SET NOT NULL;          -- After backfill
ALTER TABLE invoices ADD CONSTRAINT check_total CHECK (total > 0); -- Validation
ALTER TABLE invoices VALIDATE CONSTRAINT fk_customer;          -- FK validation
CREATE INDEX invoices_customer_idx ON invoices(customer_id);   -- Non-concurrent (small table)
```

#### Class 3: Offline-Required (Rewrites Table)
```sql
-- ❌ Requires maintenance window or blue-green deployment
ALTER TABLE invoices ALTER COLUMN total TYPE NUMERIC(18,2);    -- Type change (rewrite)
ALTER TABLE invoices DROP COLUMN old_field;                    -- On massive tables (> 10M rows)
ALTER TABLE invoices ADD COLUMN id SERIAL PRIMARY KEY;         -- Rewrite with new PK
VACUUM FULL invoices;                                          -- Full table lock
```

**Gate MIG-ONLINE-01:** CI scans migration SQL for forbidden patterns:

```typescript
// tools/scripts/validate-migration-safety.ts
const FORBIDDEN_ONLINE_PATTERNS = [
  /ALTER TABLE .+ ALTER COLUMN .+ TYPE/i,           // Type changes (rewrite)
  /VACUUM FULL/i,                                   // Full vacuum
  /CREATE INDEX (?!CONCURRENTLY)/i,                 // Non-concurrent index (MUST use CONCURRENTLY)
  /ADD CONSTRAINT .+ FOREIGN KEY(?!.*NOT VALID)/i,  // FK without NOT VALID
  /ADD CONSTRAINT .+ CHECK(?!.*NOT VALID)/i,        // CHECK without NOT VALID on large tables
];

const LARGE_TABLE_THRESHOLD = 100_000; // 100K rows

const REQUIRES_JUSTIFICATION = [
  /DROP COLUMN/i,                                   // Must justify on large tables
  /ALTER TABLE .+ ALTER COLUMN .+ SET NOT NULL/i,   // Must backfill first
];

export function validateMigrationSafety(sql: string, tableSizes: Record<string, number>) {
  const lines = sql.split('\n');
  
  for (const line of lines) {
    // Check forbidden patterns
    for (const pattern of FORBIDDEN_ONLINE_PATTERNS) {
      if (pattern.test(line)) {
        throw new Error(
          `MIG-ONLINE-01 violation: Forbidden online DDL pattern detected: ${line}\n` +
          `This operation requires a maintenance window or blue-green deployment.`
        );
      }
    }
    
    // Check patterns requiring justification
    for (const pattern of REQUIRES_JUSTIFICATION) {
      if (pattern.test(line)) {
        const tableName = extractTableName(line);
        const tableSize = tableSizes[tableName] || 0;
        
        if (tableSize > 1_000_000) {
          // Check for justification comment
          const hasJustification = sql.includes(`-- JUSTIFIED: ${tableName}`);
          if (!hasJustification) {
            throw new Error(
              `MIG-ONLINE-01 warning: Operation on large table (${tableSize} rows) requires justification: ${line}\n` +
              `Add comment: -- JUSTIFIED: ${tableName} - <reason>`
            );
          }
        }
      }
    }
  }
}
```

**Migration header template:**
```sql
-- Migration: 0043_add_invoice_notes
-- Author: @username
-- Date: 2026-02-19
-- DDL Class: Online-Safe
-- Estimated duration: < 1s
-- Lock impact: None (nullable column)
-- Table size: ~50K rows

SET lock_timeout = '2s';
SET statement_timeout = '30s';

ALTER TABLE invoices ADD COLUMN notes TEXT;
```

**NOT VALID constraint pattern (ERP-critical for large tables):**

```sql
-- Phase 1: Add constraint WITHOUT validating existing data (fast, no table scan)
ALTER TABLE invoices 
  ADD CONSTRAINT invoices_total_positive 
  CHECK (total_minor > 0) NOT VALID;
-- Lock: ACCESS EXCLUSIVE (brief, metadata only)
-- Duration: < 100ms

-- Phase 2: Backfill/fix data if needed (outside migration)
UPDATE invoices SET total_minor = 0 WHERE total_minor < 0;

-- Phase 3: Validate constraint (scans table, but allows concurrent reads/writes)
ALTER TABLE invoices 
  VALIDATE CONSTRAINT invoices_total_positive;
-- Lock: SHARE UPDATE EXCLUSIVE (allows SELECT/INSERT/UPDATE/DELETE)
-- Duration: Depends on table size (1M rows ~5-10s)

-- Same pattern for foreign keys
ALTER TABLE orders 
  ADD CONSTRAINT orders_customer_fk 
  FOREIGN KEY (org_id, customer_id) 
  REFERENCES customers(org_id, id) NOT VALID;

-- Validate separately (allows concurrent DML)
ALTER TABLE orders 
  VALIDATE CONSTRAINT orders_customer_fk;
```

**Why NOT VALID matters for ERP:**
- **Without NOT VALID:** `ADD CONSTRAINT` scans entire table with ACCESS EXCLUSIVE lock (blocks all reads/writes)
- **With NOT VALID:** Constraint added instantly (metadata only), validation deferred
- **VALIDATE CONSTRAINT:** Uses SHARE UPDATE EXCLUSIVE lock (allows SELECT/INSERT/UPDATE/DELETE)
- **Result:** Zero-downtime constraint addition on multi-million row tables

**Gate MIG-ONLINE-01 enforcement:**
1. CI parses migration SQL
2. Classifies each DDL statement (Class 1/2/3)
3. Fails if Class 3 operations lack maintenance window approval
4. Fails if `CREATE INDEX` without `CONCURRENTLY` on tables > 100K rows
5. Fails if `ADD CONSTRAINT` (FK/CHECK) without `NOT VALID` on tables > 100K rows
6. Warns if Class 2 operations target large tables without justification
7. Validates lock_timeout and statement_timeout are set
8. Validates `VALIDATE CONSTRAINT` is in separate statement (not same transaction as ADD)

**Gate MIG-TX-01:** CI validates CONCURRENTLY migrations are non-transactional:
```typescript
// tools/scripts/validate-migration-safety.ts
function validateConcurrentlyNoTransaction(sql: string, metadata: MigrationMetadata) {
  if (/CONCURRENTLY/i.test(sql)) {
    // Check migration metadata indicates no transaction
    if (metadata.useTransaction !== false) {
      throw new Error(
        'MIG-TX-01 violation: Migrations with CONCURRENTLY must set useTransaction: false.\n' +
        'Reason: CREATE INDEX CONCURRENTLY cannot run inside a transaction block.\n' +
        'Split into separate migration or mark as non-transactional.'
      );
    }
  }
}
```

**Migration metadata example:**
```typescript
// drizzle/0044_add_invoice_notes_idx.ts
export default {
  sql: `
    SET lock_timeout = '2s';
    CREATE INDEX CONCURRENTLY invoices_notes_idx ON invoices(notes);
  `,
  useTransaction: false, // REQUIRED for CONCURRENTLY
};
```

**Invariant MIG-ONLINE-02:** All indexes on tables > 100K rows MUST use `CREATE INDEX CONCURRENTLY`.
**Invariant MIG-ONLINE-03:** All constraints (FK/CHECK) on tables > 100K rows MUST use `NOT VALID` + separate `VALIDATE CONSTRAINT`.
**Invariant MIG-ONLINE-04:** All migrations MUST set `lock_timeout` and `statement_timeout` before DDL statements.
**Invariant MIG-TX-01:** Any migration containing `CONCURRENTLY` MUST be marked "no transaction" (or split into dedicated non-transaction step).

---

## 8. Data Lifecycle & Archival

### 8.1 Partitioning Strategy

**Time-based partitioning** (audit logs):
```sql
-- Parent table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  -- ... other columns
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE audit_logs_2026_02 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE audit_logs_2026_03 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Partition creation function (called by external scheduler)
CREATE OR REPLACE FUNCTION create_next_partition(
  parent_table_name text,
  partition_interval text
) RETURNS void AS $$
DECLARE
  next_partition_name text;
  next_partition_start_date date;
  next_partition_end_date date;
BEGIN
  -- Determine next partition name and dates
  next_partition_name := format('%s_%s_%s', parent_table_name, partition_interval, to_char(CURRENT_DATE + INTERVAL '1 month', 'YYYY_MM'));
  next_partition_start_date := date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
  next_partition_end_date := next_partition_start_date + INTERVAL '1 month';

  -- Create next partition
  EXECUTE format('
    CREATE TABLE %I PARTITION OF %I
      FOR VALUES FROM (%L) TO (%L)
  ', next_partition_name, parent_table_name, next_partition_start_date, next_partition_end_date);
END;
$$ LANGUAGE plpgsql;
```

### 8.2 Retention Policies

| Table | Hot Retention | Warm Archive | Cold Archive | Purge |
|-------|---------------|--------------|--------------|-------|
| `audit_logs` | 90 days | 1 year (partitioned) | 7 years (S3/R2) | Never |
| `entity_versions` | 6 months | 3 years | 5 years | After 5 years |
| `workflow_executions` | 30 days | 90 days | 1 year | After 1 year |
| `search_documents` | Rebuild | N/A | N/A | On rebuild |

**Invariant EVI-RET-01:** Evidence tables MUST be partitioned when expected volume > 10M rows/year.
**Invariant EVI-REP-01:** Evidence tables participate in logical replication and PITR (point-in-time recovery).
| `stock_balances` | Rebuild | N/A | N/A | On rebuild |

### 8.3 Archival Implementation

**Archive to R2/S3:**
```typescript
// packages/database/src/archival/archive-audit-logs.ts
import { R2 } from '@cloudflare/workers-types';

export async function archiveOldAuditLogs(
  beforeDate: Date,
  r2Bucket: R2Bucket
) {
  // 1. Export to JSONL
  const rows = await db
    .select()
    .from(auditLogs)
    .where(lt(auditLogs.createdAt, beforeDate));
  
  const jsonl = rows.map(r => JSON.stringify(r)).join('\n');
  
  // 2. Upload to R2
  const key = `audit-archive/${beforeDate.toISOString().slice(0, 7)}.jsonl.gz`;
  await r2Bucket.put(key, gzip(jsonl), {
    customMetadata: {
      rowCount: rows.length.toString(),
      archivedAt: new Date().toISOString(),
    },
  });
  
  // 3. Verify archive integrity
  const archivedCount = rows.length;
  logger.info('Archive verified', { key, archivedCount });
  
  // 4. Delete via partition drop (preferred for large deletions)
  // For partitioned tables: DROP TABLE audit_logs_YYYY_MM;
  // For non-partitioned: DELETE in chunks to avoid long locks
  await db.delete(auditLogs).where(lt(auditLogs.createdAt, beforeDate));
  
  // 5. VACUUM via maintenance job (NOT from app code)
  // Run via admin connection or scheduled maintenance window
  // await db.execute(sql`VACUUM ANALYZE audit_logs`); // ❌ Requires elevated privileges
}
```

**Restore from archive:**
```typescript
export async function restoreArchivedAuditLogs(
  month: string, // '2025-12'
  r2Bucket: R2Bucket
) {
  const key = `audit-archive/${month}.jsonl.gz`;
  const object = await r2Bucket.get(key);
  const jsonl = gunzip(await object.arrayBuffer());
  
  const rows = jsonl.split('\n').map(line => JSON.parse(line));
  
  // Batch insert
  await db.insert(auditLogs).values(rows);
}
```

---

## 9. Observability & Monitoring

### 9.1 Query Performance Monitoring

**Query shape monitoring (shapeId-first SSOT):**
```typescript
// packages/database/src/observability/query-monitor.ts
import { logger } from 'afenda-logger';

// Query shape registry (SSOT for actionable logging)
export const QUERY_SHAPES = {
  'invoices.list': 'Q.invoices.list.v1',
  'invoices.get': 'Q.invoices.get.v1',
  'invoices.create': 'Q.invoices.create.v1',
  'customers.list': 'Q.customers.list.v1',
  'items.search': 'Q.items.search.v1',
} as const;

export type QueryShapeKey = keyof typeof QUERY_SHAPES;
export type ShapeId = (typeof QUERY_SHAPES)[QueryShapeKey];

// CRITICAL: Never log raw SQL params in production (PII/secret leakage risk)
// Single, type-safe query monitor (shapeId-first)
export const queryMonitor = {
  logSlowQueries: (threshold = 1000) => ({
    logQuery(shapeKey: QueryShapeKey, paramCount: number) {
      const start = Date.now();
      return () => {
        const duration = Date.now() - start;
        if (duration > threshold) {
          logger.warn('Slow query detected', {
            shapeId: QUERY_SHAPES[shapeKey],
            duration,
            threshold,
            paramCount,
            // NO raw SQL in production
          });
        }
      };
    },
  }),
};

// Mandatory query wrapper with shape IDs
export async function runQuery<T>(
  shapeKey: QueryShapeKey,
  paramCount: number,
  fn: () => Promise<T>
): Promise<T> {
  const end = queryMonitor.logSlowQueries().logQuery(shapeKey, paramCount);
  try {
    return await fn();
  } finally {
    end();
  }
}

// Invariant INV-OBS-01: No PII/secret leakage in logs (query params redacted in production)
// Invariant INV-OBS-02: In production, do not log raw SQL text - only shapeIds
// Invariant INV-OBS-03: All production DB calls MUST be tagged with shapeId (not raw SQL, not params)
// Gate OBS-03: Lint rule bans db.* usage in route handlers; forces calling queries/* modules only

// Usage example (ONLY in packages/database/src/queries/*)
export async function listInvoices(orgId: string, limit: number) {
  return runQuery('invoices.list', 2, () =>
    db.select().from(invoices)
      .where(eq(invoices.orgId, orgId))
      .limit(limit)
  );
}

// Enforcement:
// - ESLint rule: ban 'db.select', 'db.insert', 'db.update', 'db.delete', 'db.execute' in apps/*/
// - Only allowed in: packages/database/src/queries/*, migrations/*, scripts/*
// - Route handlers MUST import from queries/* modules only
```

### 9.2 Metrics to Track

| Metric | Threshold | Alert Channel | Action |
|--------|-----------|---------------|--------|
| Query latency p95 | < 200ms | Slack | Investigate slow queries |
| Query latency p99 | < 500ms | PagerDuty | Scale compute units |
| Connection pool usage | < 80% | Email | Increase pool size |
| Replica lag | < 100ms | Slack | Check network/load |
| Failed transactions | < 0.1% | Slack | Review error logs |
| Table bloat | < 20% | Weekly report | Schedule VACUUM |
| Autoscale events | N/A | Dashboard | Optimize compute config |

### 9.3 Neon-Specific Monitoring

**Compute autoscaling events:**
```sql
-- Query Neon metrics (via Neon API)
SELECT 
  timestamp,
  compute_units,
  active_connections,
  cpu_usage_percent
FROM neon_metrics
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
```

**Cold start tracking:**
```typescript
// Measure first-query-after-idle latency
const coldStartMonitor = {
  async trackColdStart() {
    const start = Date.now();
    await db.execute(sql`SELECT 1`);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      logger.warn('Cold start detected', { duration });
    }
  },
};
```

**Branch lifecycle monitoring:**
```bash
# Alert on stale preview branches (> 7 days)
neon branches list --json | jq '.[] | select(.created_at < (now - 7*24*3600))'
```

---

## 10. Disaster Recovery

### 10.1 Backup Strategy

| Backup Type | Frequency | Retention | Purpose |
|-------------|-----------|-----------|---------|
| **Neon automatic** | Continuous WAL | 7 days PITR | Point-in-time recovery |
| **Manual snapshots** | Before major migrations | 30 days | Rollback safety |
| **Cross-region replicas** | Real-time | Permanent | Regional failover |
| **Archive exports** | Monthly | 7 years | Compliance, long-term storage |

### 10.2 Recovery Procedures

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| **Data corruption** | 1 hour | 5 minutes | PITR to last good state via Neon Console |
| **Region failure** | 15 minutes | 0 | Promote read replica in alternate region |
| **Schema migration failure** | 30 minutes | 0 | Rollback migration + restore from snapshot |
| **Complete data loss** | 4 hours | 1 hour | Restore from backup + replay WAL |
| **Accidental DELETE** | 2 hours | 5 minutes | PITR to before deletion + selective restore |

### 10.3 Point-in-Time Recovery (PITR)

**Via Neon Console:**
1. Navigate to project → Branches
2. Click "Restore" on main branch
3. Select timestamp (within 7-day window)
4. Create new branch from restore point
5. Verify data integrity
6. Promote to main if valid

**Via Neon API:**
```bash
# Create branch from specific timestamp
neon branches create \
  --name recovery-$(date +%Y%m%d-%H%M%S) \
  --parent main \
  --timestamp "2026-02-19T10:30:00Z"

# Verify data
export DATABASE_URL=$(neon connection-string recovery-20260219-103000)
psql $DATABASE_URL -c "SELECT COUNT(*) FROM invoices WHERE deleted_at IS NULL"

# Promote if valid
neon branches set-primary recovery-20260219-103000
```

### 10.4 Testing Schedule

| Test Type | Frequency | Scope | Success Criteria |
|-----------|-----------|-------|------------------|
| **Restore to test branch** | Monthly | Full database | Data integrity checks pass |
| **DR drill** | Quarterly | Failover simulation | RTO < 30 min, RPO < 5 min |
| **Cross-region failover** | Annually | Geographic failover | Application functional in alternate region |
| **Archive restore** | Quarterly | Sample month | Archived data matches original |

---

## 11. Schema Governance Automation

### 11.1 Pre-Commit Validation

**Git hooks** (`.husky/pre-commit`):
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Regenerate barrel and registry
pnpm --filter afenda-database db:barrel

# Lint schema
pnpm --filter afenda-database db:lint

# Check for drift
pnpm --filter afenda-database db:drift-check

# Stage generated files
git add packages/database/src/schema/index.ts
git add packages/database/src/schema/_registry.ts
```

### 11.2 CI Pipeline

**GitHub Actions** (`.github/workflows/database-ci.yml`):
```yaml
name: Database CI

on:
  pull_request:
    paths:
      - 'packages/database/**'

jobs:
  schema-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Generate barrel
        run: pnpm --filter afenda-database db:barrel
      
      - name: Lint schema
        run: pnpm --filter afenda-database db:lint
      
      - name: Check drift
        run: pnpm --filter afenda-database db:drift-check
      
      - name: Verify no manual edits to generated files
        run: |
          git diff --exit-code packages/database/src/schema/index.ts
          git diff --exit-code packages/database/src/schema/_registry.ts
      
      - name: Run migrations on test branch
        env:
          DATABASE_URL: ${{ secrets.NEON_TEST_BRANCH_URL }}
        run: pnpm --filter afenda-database db:migrate
      
      - name: Run integration tests
        run: pnpm test:integration
```

### 11.3 Schema Lint Gates

**Gate suite** (`packages/database/src/scripts/schema-lint.ts`):

| Gate | Check | Enforcement |
|------|-------|-------------|
| **Gate 0** | Architecture doc completeness | CI fails if missing sections |
| **Gate 1** | Tenant enforcement (org_id + RLS) | CI fails if truth table lacks RLS |
| **Gate 2** | Identity rules (composite PK) | CI fails if truth table has single PK |
| **Gate 3** | FK coverage | CI fails if `*_id` lacks FK (unless whitelisted) |
| **Gate 4** | Postable docs registered | CI fails if doc table not in registry |
| **Gate 5** | REVOKE policy correctness | CI fails if append-only lacks REVOKE |
| **Gate 6** | Projection write protection | CI fails if projection allows app writes |
| **Gate 7** | Registry drift | CI fails if `_registry.ts` not generated |
| **Gate SCH-05** | Updated_at trigger presence | CI fails if truth table lacks set_updated_at trigger |
| **Gate FK-02** | Composite FK enforcement | CI fails if tenant-scoped FK is not composite (org_id, *_id) |
| **Gate RLS-03** | FORCE RLS enabled | CI fails if truth/evidence table lacks FORCE ROW LEVEL SECURITY |
| **Gate CONN-01** | Vercel pooling | Vercel deployments MUST use attachDatabasePool pattern |
| **Gate TX-01** | Financial retry wrapper | CI validates financial handlers use withTransactionRetry |
| **Gate SEC-02** | BYPASSRLS isolation | Static scan ensures BYPASSRLS URLs only in worker packages |
| **Gate SEC-03** | Default privileges set | CI fails if ALTER DEFAULT PRIVILEGES missing for roles |
| **Gate SEC-04** | Schema owner separation | Schema owner role is distinct from app roles; app roles never table owners |
| **Gate SEC-05** | Worker BYPASSRLS URLs only in `packages/workers/*` (denylist: `apps/web`, API routes) |
| **Gate UQ-01** | Natural key constraints | CI fails if docNo/sku/customerCode lacks org-scoped unique index |
| **Gate UQ-01a** | Partial unique for nullable keys | CI fails if nullable natural key lacks WHERE clause in unique index |
| **Gate DDL-01** | Safe DDL identifiers | CI fails if sql.raw() used outside packages/database/src/ddl/* |
| **Gate FK-02a** | tenantFk helper usage | CI fails if composite FK doesn't use tenantFk() helper pattern |
| **Gate SCH-05a** | Updated_at exclusive-or | CI fails if neither or both hasUpdatedAtTrigger/updatedAtManagedInApp are true |
| **Gate RLS-CTX-03** | Transaction-scoped auth only | CI fails if set_config(..., false) found in codebase |
| **Gate READ-01** | Read-after-write routing | CI detects mutate() followed by dbRo usage in same call chain |
| **Gate SEC-OWN-02** | Owner verification | CI fails if any public schema object not owned by schema_owner |
| **Gate SEC-06** | Worker URL isolation | Build fails if SEARCH_WORKER_DATABASE_URL used outside packages/workers/** |
| **Gate EVI-01** | Append-only triggers | CI fails if evidence table lacks block_update_delete trigger |
| **Gate MIG-02** | Backfill separation | Data backfills must be separate migrations and chunked |
| **Gate MIG-03** | Online index creation | Large table indexes must use CONCURRENTLY or be justified |
| **Gate CONN-01** | Connection validation | Runtime fails if DATABASE_URL is invalid or unreachable |
| **Gate CONN-02** | Vercel pool tuning | CI warns if pool.max > 20 for Vercel Fluid Compute |
| **Gate TX-01** | Retry wrapper | CI validates financial handlers use retry wrapper |
| **Gate PREP-03** | Prepared statements opt-in | CI fails if DB_PREPARED=1 in production without pooling mode verification |
| **Gate SESSION-01** | DbSession enforcement | ESLint blocks direct db/dbRo imports outside allowed paths |
| **Gate SESSION-02** | Transaction enforcement | CI fails if db.transaction() called outside DbSession.rw() |
| **Gate PLAN-01** | Query plan stability | CI runs EXPLAIN on hot queries: no seq scans, expected indexes used |
| **Gate MIG-ONLINE-01** | Online DDL safety | CI scans migrations for forbidden patterns (type changes, VACUUM FULL) |
| **Gate WORKER-01** | No auth.* in workers | CI scans workers/** for auth.org_id/user_id/set_context and fails |
| **Gate WORKER-02** | Worker URL containment | CI fails if SEARCH_WORKER_DATABASE_URL in apps/web or packages/*/api |
| **Gate WORKER-03** | Explicit org_id in workers | CI validates worker queries include explicit org_id filters (AST) |
| **Gate NATKEY-01** | Natural key immutability | CI validates tables with hasNaturalKey have enforcement in mutate() |
| **Gate NATKEY-02** | Natural key UPDATE prevention | CI validates natural key fields not in UPDATE outside mutate() |
| **Gate NUM-01** | Money type enforcement | CI scans for *_amount/*_total/*_price and validates bigint usage |
| **Gate NUM-02** | Rate type enforcement | CI scans for *_rate/*_percent and validates numeric(18,8) usage |
| **Gate RLS-CATALOG-01** | RLS policy patterns | CI validates all RLS policies match catalog patterns |
| **Gate RLS-CATALOG-02** | Soft-delete in queries | CI fails if soft-delete logic found in RLS policies |
| **Gate SEC-OWN-03** | Runtime role ownership | CI runs ownership audit: no authenticated/worker may own objects |
| **Gate SEC-BYPASS-01** | BYPASSRLS restriction | CI validates only worker role has BYPASSRLS |

---

## 12. Security Hardening

### 12.1 Role Separation & Privilege Model

**Three-role architecture:**

```sql
-- Migration role (DDL only, no runtime access)
CREATE ROLE migration_admin WITH LOGIN PASSWORD 'xxx';
GRANT CREATE ON DATABASE main TO migration_admin;
GRANT USAGE ON SCHEMA public TO migration_admin;
-- Can create/alter/drop tables, but CANNOT read/write data

-- Schema owner (owns all objects, no runtime access)
CREATE ROLE schema_owner WITH NOLOGIN;
ALTER DATABASE main OWNER TO schema_owner;
-- All tables/views/functions owned by schema_owner
-- Migration admin can ALTER objects owned by schema_owner

-- Application runtime role (DML only, RLS enforced)
CREATE ROLE authenticated WITH LOGIN PASSWORD 'yyy';
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
-- CRITICAL: No DDL privileges, no BYPASSRLS

-- Worker role (projection rebuilders, BYPASSRLS for cross-org maintenance)
CREATE ROLE worker WITH LOGIN PASSWORD 'zzz' BYPASSRLS;
GRANT USAGE ON SCHEMA public TO worker;

-- CRITICAL: Worker has narrow privileges
-- Read-only access to truth/control/evidence tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO worker;

-- Write access ONLY to projection tables (allowlist)
GRANT INSERT, UPDATE, DELETE ON search_documents TO worker;
GRANT INSERT, UPDATE, DELETE ON stock_balances TO worker;
GRANT INSERT, UPDATE, DELETE ON search_index TO worker;
-- Add other projection tables as needed

-- Revoke write access from authenticated on projection tables
REVOKE INSERT, UPDATE, DELETE ON search_documents FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON stock_balances FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON search_index FROM authenticated;

-- BYPASSRLS allows cross-org writes for projections
-- MUST NOT have auth.* function access
-- MUST set org_id explicitly in queries
```

**Invariant SEC-OWN-03:** No application runtime role (`authenticated`, `worker`) may own any table, view, or function.
**Invariant SEC-BYPASS-01:** Only `worker` role may have `BYPASSRLS`; `migration_admin` and `authenticated` MUST NOT.
**Invariant SEC-PRIV-01:** Row access is controlled by RLS policies; table-level privileges are intentionally coarse (SELECT/INSERT/UPDATE/DELETE).
**Invariant SEC-PRIV-02:** DDL privileges (CREATE, ALTER, DROP) are ONLY granted to `migration_admin` and `schema_owner`.
**Invariant SEC-WORKER-PRIV-01:** Worker role has write privileges ONLY on allowlisted projection tables; read-only on truth/control/evidence.
**Invariant INV-OWN-01:** No runtime role (authenticated/worker/support_admin) may own any object; only `schema_owner` owns.
**Invariant INV-OWN-02:** Migrations must end with ownership normalization ("chown sweep") and privilege sweep ("grant/revoke sweep").

**Gate SEC-OWN-03:** CI runs ownership audit after migrations:
```sql
SELECT n.nspname, c.relname, pg_get_userbyid(c.relowner) AS owner
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r','p','v','m')
  AND pg_get_userbyid(c.relowner) NOT IN ('schema_owner', 'migration_admin');
-- MUST return 0 rows
```

**Gate SEC-BYPASS-01:** CI validates role attributes:
```sql
SELECT rolname, rolbypassrls FROM pg_roles
WHERE rolname IN ('authenticated', 'migration_admin')
  AND rolbypassrls = true;
-- MUST return 0 rows (only worker should have BYPASSRLS)
```

**Gate SEC-WORKER-PRIV-01:** CI validates worker has write perms only on allowlisted projection tables:
```sql
-- Get tables where worker has INSERT/UPDATE/DELETE
SELECT n.nspname, c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_roles r ON r.oid = c.relowner
WHERE n.nspname = 'public' 
  AND c.relkind = 'r'
  AND has_table_privilege('worker', c.oid, 'INSERT')
  AND c.relname NOT IN ('search_documents', 'stock_balances', 'search_index');
-- MUST return 0 rows (worker can only write to allowlisted projections)
```

### 12.2 Worker Hygiene Gates

**Workers are projection rebuilders that run with BYPASSRLS. They MUST follow strict hygiene rules:**

```typescript
// packages/workers/search-indexer/rebuild-search-documents.ts
import { db } from '@/database'; // Uses SEARCH_WORKER_DATABASE_URL with BYPASSRLS

export async function rebuildSearchDocuments(orgId: string) {
  // ✅ CORRECT: Explicit org_id in WHERE clause
  await db.delete(searchDocuments)
    .where(eq(searchDocuments.orgId, orgId));
  
  // ✅ CORRECT: Explicit org_id in INSERT
  await db.insert(searchDocuments)
    .values(docs.map(d => ({ ...d, orgId })));
  
  // ❌ FORBIDDEN: No auth.* function calls in worker code
  // const currentOrg = await db.execute(sql`SELECT auth.org_id()`);
  // Reason: Workers bypass RLS, auth context is meaningless
}
```

**Invariant WORKER-01:** Worker packages (`packages/workers/**`) MUST NOT call `auth.org_id()`, `auth.user_id()`, or `auth.set_context()`.
**Invariant WORKER-02:** Worker database URLs with BYPASSRLS MUST ONLY be imported in `packages/workers/**`.
**Invariant WORKER-03:** Workers MUST set `org_id` explicitly in all queries; MUST NOT rely on RLS or auth context.

**Gate WORKER-01:** CI scans `packages/workers/**/*.ts` for `auth.org_id()`, `auth.user_id()`, `auth.set_context()` and fails if found.
**Gate WORKER-02:** CI fails if `SEARCH_WORKER_DATABASE_URL` appears in `apps/web/**` or `packages/*/api/**`.
**Gate WORKER-03:** CI validates that worker queries include explicit `org_id` filters (AST analysis).

### 12.3 RLS Policy Catalog

**Standard policy patterns (reference implementations):**

#### Pattern 1: Basic Tenant Isolation
```sql
-- For truth/control tables
CREATE POLICY tenant_isolation ON invoices
  USING (org_id = auth.org_id())
  WITH CHECK (org_id = auth.org_id());
```

#### Pattern 2: Soft-Delete Visibility (Query Helpers, Not RLS)
```typescript
// ✅ CORRECT: Soft-delete via query helpers, NOT RLS
export function activeOnly<T extends { deletedAt: Date | null }>(table: T) {
  return isNull(table.deletedAt);
}

// Usage
const invoices = await db.select().from(invoicesTable)
  .where(and(
    eq(invoicesTable.orgId, orgId),
    activeOnly(invoicesTable) // Explicit filter
  ));

// ❌ WRONG: Soft-delete in RLS policy
// CREATE POLICY tenant_isolation ON invoices
//   USING (org_id = auth.org_id() AND deleted_at IS NULL);
// Reason: Prevents admin tools from seeing deleted records
```

**Why query helpers over RLS for soft-delete:**
1. **Flexibility:** Admin tools can see deleted records when needed
2. **Explicitness:** Deletion visibility is a query concern, not a security boundary
3. **Performance:** RLS policies with multiple conditions are harder to optimize

#### Pattern 3: Support Admin Cross-Tenant Access
```sql
-- For support admin role (audited, read-only)
CREATE ROLE support_admin WITH LOGIN PASSWORD 'xxx';
GRANT USAGE ON SCHEMA public TO support_admin;

-- Security barrier view (prevents RLS bypass)
CREATE VIEW support_invoices_view
  WITH (security_barrier = true)
AS
SELECT 
  org_id,
  id,
  doc_no,
  total_minor,
  created_at,
  -- Exclude sensitive fields
  current_user AS accessed_by,
  NOW() AS accessed_at
FROM invoices;

GRANT SELECT ON support_invoices_view TO support_admin;

-- Audit log trigger
CREATE TRIGGER trg_support_access_audit
  AFTER SELECT ON support_invoices_view
  FOR EACH STATEMENT
  EXECUTE FUNCTION log_support_access();
```

**Invariant SEC-SUPPORT-01:** Support admin access MUST use security barrier views, never direct table access.
**Invariant SEC-SUPPORT-02:** All support admin queries MUST be logged to `support_access_logs` table.

#### Pattern 4: Worker Bypass Rules
```typescript
// Workers use BYPASSRLS, but MUST follow explicit org_id rules
export async function rebuildProjection(orgId: string) {
  // CRITICAL: Explicit org_id in all queries
  await workerDb.transaction(async (tx) => {
    // Delete old projection data for this org
    await tx.delete(searchDocuments)
      .where(eq(searchDocuments.orgId, orgId));
    
    // Rebuild from truth tables (also filtered by org_id)
    const truthData = await tx.select().from(invoices)
      .where(eq(invoices.orgId, orgId));
    
    // Insert new projection data
    await tx.insert(searchDocuments)
      .values(truthData.map(d => ({
        orgId, // Explicit org_id
        // ... projection fields
      })));
  });
}
```

**Gate RLS-CATALOG-01:** CI validates that all RLS policies match one of the catalog patterns.
**Gate RLS-CATALOG-02:** CI fails if soft-delete logic is found in RLS policies (must use query helpers).

### 12.4 Ownership Normalization

**Migration ownership sweep (enforces INV-OWN-01 and INV-OWN-02):**

```sql
-- Run at end of every migration to normalize ownership
-- packages/database/scripts/normalize-ownership.sql

-- 1. Chown sweep: All objects owned by schema_owner
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r','p','v','m','S')
      AND pg_get_userbyid(c.relowner) != 'schema_owner'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I OWNER TO schema_owner', r.nspname, r.relname);
  END LOOP;
END $$;

-- 2. Privilege sweep: Ensure correct grants
-- Revoke all, then grant narrowly
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- Grant to authenticated (app runtime)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant to worker (read all, write projections only)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO worker;
GRANT INSERT, UPDATE, DELETE ON search_documents, stock_balances, search_index TO worker;

-- Revoke projection writes from authenticated
REVOKE INSERT, UPDATE, DELETE ON search_documents, stock_balances, search_index FROM authenticated;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES FOR ROLE schema_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE schema_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO worker;
```

**Migration template with ownership normalization:**
```sql
-- Migration: 0045_add_new_table
-- Author: @username
-- Date: 2026-02-19

SET lock_timeout = '2s';
SET statement_timeout = '30s';

-- Create as migration_admin, but will be owned by schema_owner after sweep
CREATE TABLE new_table (
  org_id UUID NOT NULL,
  id UUID NOT NULL,
  -- ...
  PRIMARY KEY (org_id, id)
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_table FORCE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY tenant_isolation ON new_table
  USING (org_id = auth.org_id())
  WITH CHECK (org_id = auth.org_id());

-- Ownership normalization (run at end of every migration)
\i scripts/normalize-ownership.sql
```

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO migration_admin;
```

### 12.2 Append-Only Enforcement

**Evidence tables require BOTH REVOKE + trigger:**

REVOKE alone is insufficient (privileged roles can still mutate). Use trigger to block ALL updates/deletes:

```sql
-- Canonical append-only blocker (create once)
CREATE OR REPLACE FUNCTION public.block_update_delete()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'table % is append-only', TG_TABLE_NAME
    USING ERRCODE = '42501'; -- insufficient_privilege
END;
$$;

-- Per evidence table (idempotent)
DROP TRIGGER IF EXISTS trg_audit_logs_append_only ON audit_logs;
CREATE TRIGGER trg_audit_logs_append_only
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.block_update_delete();

-- Still REVOKE for defense-in-depth
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON entity_versions FROM authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON workflow_executions FROM authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON advisory_evidence FROM authenticated;

-- Also revoke from app_user role
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM app_user;
REVOKE UPDATE, DELETE, TRUNCATE ON entity_versions FROM app_user;
REVOKE UPDATE, DELETE, TRUNCATE ON workflow_executions FROM app_user;
REVOKE UPDATE, DELETE, TRUNCATE ON advisory_evidence FROM app_user;

-- Only INSERT allowed
GRANT INSERT ON audit_logs TO authenticated;
GRANT INSERT ON entity_versions TO authenticated;
```

### 12.3 Projection Write Protection

**Worker-only writes:**
```sql
-- Revoke all writes from authenticated users
REVOKE INSERT, UPDATE, DELETE ON search_documents FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON stock_balances FROM authenticated;

-- Grant to worker role only
GRANT INSERT, UPDATE, DELETE ON search_documents TO projection_worker;
GRANT INSERT, UPDATE, DELETE ON stock_balances TO projection_worker;
```

### 12.4 SQL Injection Prevention

**Drizzle parameterization:**
```typescript
// ✅ Safe: Parameterized query
const invoice = await db
  .select()
  .from(invoices)
  .where(eq(invoices.id, userInput)); // Automatically parameterized

// ❌ Unsafe: String interpolation
const invoice = await db.execute(
  sql`SELECT * FROM invoices WHERE id = '${userInput}'` // SQL injection risk!
);

// ✅ Safe: Use sql.placeholder
const invoice = await db.execute(
  sql`SELECT * FROM invoices WHERE id = ${sql.placeholder('id')}`,
  { id: userInput }
);
```

---

## Cross-References

- [`.architecture/database.architecture.md`](../../.architecture/database.architecture.md) — Contract document
- [`packages/canon/canon.architecture.md`](../canon/canon.architecture.md) — Type authority
- [`packages/crud/crud.architecture.md`](../crud/crud.architecture.md) — Mutation kernel
- [`.architecture/schema-lint-gates.md`](../../.architecture/schema-lint-gates.md) — Gate implementations (must exist for Gate 0)
- [`.architecture/rls-policy-catalog.md`](../../.architecture/rls-policy-catalog.md) — RLS policy reference (must exist for Gate 0)
- [`.architecture/migration-runbook.md`](../../.architecture/migration-runbook.md) — Migration procedures (must exist for Gate 0)
- [`.architecture/dr-runbook.md`](../../.architecture/dr-runbook.md) — Disaster recovery procedures (must exist for Gate 0)

---

**Last Updated:** 2026-02-19  
**Architecture Version:** 2.6 (Ratified)  
**Maintainer:** Database Team
