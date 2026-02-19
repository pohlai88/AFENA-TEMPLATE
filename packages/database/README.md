# afenda-database

**Layer 1 · Foundation** — Drizzle ORM schemas, DbSession primitive, multi-tenant isolation & query observability for AFENDA-NEXUS.

**Architecture Version:** 2.6 (Ratified + DbSession)

---

## Architecture Role

```
Layer 3  Application    (crud, observability)
Layer 2  Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1  Foundation      (canon, database ← YOU ARE HERE, logger, ui)
Layer 0  Configuration   (eslint-config, typescript-config)
```

This package is the **single source of truth** for database schema definitions and access primitives.
It contains **zero business logic** — schemas only, no calculations, no orchestration.

---

## What's Inside

```
packages/database/
├── src/
│   ├── index.ts              # Public API barrel — the only import target
│   ├── db.ts                 # Neon RW/RO Drizzle instances
│   ├── db-session.ts         # DbSession primitive (single DB entrypoint)
│   ├── auth-context.ts       # RLS auth context (set_context / validate)
│   ├── schema/               # 85 table schemas + barrel + registry
│   │   ├── index.ts          # Barrel re-exports every schema + types
│   │   ├── _registry.ts      # Table taxonomy & mechanical validation
│   │   ├── relations.ts      # Drizzle relational mappings
│   │   └── *.ts              # One file per table
│   ├── helpers/              # Schema building blocks
│   │   ├── base-entity.ts    # baseEntityColumns (id, org_id, timestamps, version, soft-delete)
│   │   ├── erp-entity.ts     # erpEntityColumns (+ companyId, siteId, customData)
│   │   ├── doc-entity.ts     # docEntityColumns (+ docStatus lifecycle)
│   │   ├── doc-status.ts     # docStatusEnum pg enum
│   │   ├── field-types.ts    # moneyMinor, currencyCode, fxRate, qty, etc.
│   │   ├── tenant-pk.ts      # tenantPk, tenantFk, tenantFkPattern, tenantFkIndex
│   │   ├── tenant-policy.ts  # tenantPolicy, ownerPolicy (Neon crudPolicy RLS)
│   │   └── standard-indexes.ts  # erpIndexes, docIndexes (PK + indexes + CHECK + RLS)
│   ├── ddl/                  # Safe DDL generation for migrations
│   │   ├── ident.ts          # qIdent, qSchemaIdent, sanitizeIdent
│   │   └── rls.ts            # tenantPolicySql, evidenceRlsSetup, etc.
│   ├── observability/        # Query monitoring
│   │   ├── query-monitor.ts  # Slow-query logging, shape-tagged monitoring
│   │   └── query-shapes.ts   # QUERY_SHAPES registry, hot-path identification
│   ├── query-plan/           # PLAN-01 gate
│   │   └── analyzer.ts       # validateQueryPlan, seq-scan / tenant checks
│   ├── types/
│   │   └── session.ts        # AuthContext, DbSession, DbOrTransaction
│   ├── scripts/
│   │   └── schema-lint.ts    # 8-rule schema linter (pnpm db:lint)
│   └── __tests__/
├── scripts/                  # CI validation scripts
│   ├── validate-registry.ts
│   ├── validate-migration-safety.ts
│   ├── validate-gates.ts
│   ├── validate-query-plans.ts
│   └── generate-all-schemas.ts
├── drizzle/                  # Generated migrations
├── drizzle.config.ts         # Drizzle-kit config (schema → migration)
├── db.architecture.md        # Deep architecture reference (12 sections)
├── MIGRATION_GUIDE.md        # v2.6 → v3.0 migration guide
├── EXAMPLE_CORRECT_SCHEMA.md # Canonical patterns for new tables
└── DATABASE_RESET_GUIDE.md   # Neon clean-deploy runbook
```

---

## Quick Start

### 1. DbSession — the only way to touch the database

```typescript
import { createDbSession, contacts } from 'afenda-database';
import { eq } from 'drizzle-orm';

const session = createDbSession({
  orgId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'usr_abc123',
});

// Read (routes to replica; uses primary if session already wrote)
const rows = await session.ro((tx) =>
  tx.select().from(contacts).where(eq(contacts.orgId, orgId)).limit(50),
);

// Write (always primary; sets auth context as first statement)
const [created] = await session.rw((tx) =>
  tx.insert(contacts).values({ name: 'Acme Corp' }).returning(),
);
```

### 2. Worker sessions (BYPASSRLS)

```typescript
import { createWorkerSession } from 'afenda-database';

const ws = createWorkerSession('search-indexer');
await ws.rw((tx) => /* cross-org projection rebuild */);
```

### 3. Tagged queries for observability

```typescript
const data = await session.query('contacts.list', () =>
  session.ro((tx) => tx.select().from(contacts).limit(100)),
);
// Automatically logs slow queries (> shape threshold)
```

---

## Schema Conventions

### Table taxonomy (4-layer data model)

| Kind | Count | Primary Key | RLS | Updated triggers | Examples |
|------|------:|-------------|-----|------------------|----------|
| **truth** | 45 | composite `(org_id, id)` | yes | `set_updated_at` | contacts, products, customers |
| **control** | 24 | composite `(org_id, id)` | yes | `set_updated_at` | workflow_rules, custom_fields, meta_assets |
| **evidence** | 6 | composite `(org_id, id)` | yes | **none** (append-only) | audit_logs, entity_versions, mutation_batches |
| **link** | 4 | composite `(org_id, id)` | yes | **none** | user_roles, role_permissions |
| **system** | 6 | varies | yes | varies | users, roles, api_keys, r2_files |
| **projection** | 0* | — | yes | **none** | search_documents (created by workers) |

*\* Projection tables are created at deploy-time by workers, not in the ORM schema.*

### Column inheritance

```
baseEntityColumns          id, org_id, created_at, updated_at, created_by, updated_by, version, soft-delete
  └─ erpEntityColumns      + company_id, site_id, custom_data (JSONB)
       └─ docEntityColumns  + doc_status, submitted_at/by, cancelled_at/by, amended_from_id
```

### Creating a new table (canonical pattern)

```typescript
// src/schema/tax-rates.ts
import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { erpEntityColumns, tenantPk } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { sql } from 'drizzle-orm';
import { check, index } from 'drizzle-orm/pg-core';

export const taxRates = pgTable(
  'tax_rates',
  {
    ...erpEntityColumns,
    taxCode: text('tax_code').notNull(),
    rate: numeric('rate', { precision: 10, scale: 6 }).notNull(),
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).notNull(),
  },
  (t) => [
    tenantPk(t),
    index('tax_rates_org_id_idx').on(t.orgId, t.id),
    index('tax_rates_org_created_idx').on(t.orgId, t.createdAt),
    check('tax_rates_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(t),
  ],
);

export type TaxRate = typeof taxRates.$inferSelect;
export type NewTaxRate = typeof taxRates.$inferInsert;
```

Or use the one-call `erpIndexes` helper to reduce boilerplate:

```typescript
import { erpEntityColumns } from '../helpers/base-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const taxRates = pgTable(
  'tax_rates',
  { ...erpEntityColumns, taxCode: text('tax_code').notNull() },
  (t) => [...erpIndexes('tax_rates', t)],
);
```

After creating the file:

1. Export from `src/schema/index.ts`
2. Register in `src/schema/_registry.ts`
3. `pnpm db:generate` → creates migration
4. `pnpm db:migrate` → applies migration

---

## Helpers Reference

### Column helpers (spread into `pgTable`)

| Helper | Provides |
|--------|----------|
| `baseEntityColumns` | `id`, `orgId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`, soft-delete |
| `erpEntityColumns` | Above + `companyId`, `siteId`, `customData` |
| `docEntityColumns` | Above + `docStatus`, `submittedAt/By`, `cancelledAt/By`, `amendedFromId` |

### Field-type helpers

| Helper | DB type | Use case |
|--------|---------|----------|
| `moneyMinor(name)` | `bigint` mode `'number'` | Amounts in cents/sen |
| `currencyCode(name)` | `text` default `'MYR'` | ISO 4217 code |
| `fxRate(name)` | `numeric(20,10)` | Exchange rate |
| `baseAmountMinor(name)` | `bigint` | Base-currency amount |
| `qty(name)` | `numeric(18,6)` | Manufacturing quantity |
| `docNumber(name)` | `text` NOT NULL | Document numbers (`INV-00001`) |
| `emailColumn(name)` | `text` | Email addresses |
| `phoneColumn(name)` | `text` | Phone numbers |
| `addressJsonb(name)` | `jsonb` | Structured addresses |
| `tagsArray(name)` | `text[]` | Tag arrays |
| `statusColumn(name)` | `text` NOT NULL | Enum-style status |
| `companyRef()` | `uuid` | FK to companies |
| `siteRef()` | `uuid` | FK to sites |
| `contactRef(name)` | `uuid` | FK to contacts |

### Tenant isolation helpers

| Helper | Returns | Use |
|--------|---------|-----|
| `tenantPk(t)` | `primaryKey` | Composite PK `(org_id, id)` |
| `tenantFk(t, name, col, parent)` | `foreignKey` | Composite FK `(org_id, col) → (parent.org_id, parent.id)` |
| `tenantFkIndex(t, name, col)` | `index` | Index on `(org_id, col)` for FK lookups |
| `tenantFkPattern(t, name, col, parent)` | `{ fk, idx }` | FK + index combined |
| `tenantPolicy(t)` | `crudPolicy` | Standard tenant-isolation RLS |
| `ownerPolicy(t)` | `crudPolicy` | Tenant + owner-level RLS |
| `erpIndexes(tableName, t)` | `array` | PK + 2 indexes + CHECK + tenantPolicy |
| `docIndexes(tableName, t)` | `array` | erpIndexes + unique doc_no index |

---

## Public API (src/index.ts)

### Session & Auth

```typescript
createDbSession(ctx)        // Create session with { orgId, userId }
createWorkerSession(name)   // Worker session (BYPASSRLS)
isDbSession(value)          // Type guard
setAuthContext(tx, org, user)  // Manual auth context setting
validateAuthContext(org, user) // UUID format validation
withAuthContext(db, org, user, fn) // Transaction wrapper
```

### Observability

```typescript
QUERY_SHAPES                // Shape registry (17 hot-path shapes)
queryMonitor                // Slow-query logger
runQuery(shapeKey, n, fn)   // Wrapped query execution
getQueryShapeStats()        // Shape summary
getHotPathShapes()          // Hot-path shapes for PLAN-01 gate
```

### Table Schemas (85 tables)

All 85 tables + inferred `Select` / `Insert` types are re-exported from `src/schema/index.ts`.

### Table Registry

```typescript
TABLE_REGISTRY             // Record<tableName, TableMetadata>
TAXONOMY_RULES             // Validation rules per kind
validateRegistry()          // Full registry validation
getTablesByKind(kind)       // Filter tables by taxonomy
getTableMetadata(name)      // Single table lookup
```

### DDL Helpers

```typescript
qIdent(id)                 // Safe SQL identifier quoting
qSchemaIdent(schema, id)   // Schema-qualified quoting
columnList(cols)            // Comma-separated quoted list
tenantPolicySql(table)     // RLS policy SQL generation
standardRlsSetup(table)   // Complete RLS setup SQL
evidenceRlsSetup(table)   // Append-only RLS setup
projectionRlsSetup(table) // Worker-only-writes RLS
```

### Query Plan Analyzer

```typescript
validateQueryPlan(plan, opts)   // Validate EXPLAIN JSON output
formatValidationResult(result)  // Pretty-print validation
```

### Deprecated (removing in v3.0)

```typescript
db, dbRo, getDb            // Direct DB access → use createDbSession()
eq, and, or, sql, ...      // Drizzle operators → import from 'drizzle-orm'
```

---

## Scripts

```bash
# Build
pnpm build                        # tsup → dist/
pnpm dev                          # Watch mode

# Quality
pnpm type-check                   # tsc --noEmit
pnpm lint                         # ESLint
pnpm lint:fix                     # ESLint auto-fix

# Drizzle-kit
pnpm db:generate                  # Generate migrations from schema
pnpm db:migrate                   # Apply migrations (uses unpooled URL)
pnpm db:push                      # Push schema (dev only, no migrations)
pnpm db:studio                    # Drizzle Studio GUI

# Governance
pnpm db:lint                      # 8-rule schema linter
pnpm db:validate-registry         # Registry ↔ actual schema sync
pnpm db:validate-gates            # All CI gates
pnpm db:validate-migration        # Migration safety checks
pnpm db:validate-query-plans      # PLAN-01 hot-path validation
```

---

## Architecture Rules

### Rule 1 — No business logic

Schemas define structure. Calculations, formatting, and orchestration live in Layer 2+ packages.

### Rule 2 — No upward imports

```
✅  drizzle-orm, @neondatabase/serverless, Node built-ins
❌  afenda-workflow, business-domain/*, afenda-crud
```

### Rule 3 — Every tenant table has composite PK + RLS

No standalone `id` primary key on domain tables — always `(org_id, id)` via `tenantPk(t)`.

### Rule 4 — DbSession is the only entry point

Direct `db`/`dbRo` imports are deprecated. All new code must use `createDbSession()`.

### Rule 5 — Migrations are forward-only

Generate → review → apply. No in-migration rollback logic. Create a separate forward migration to undo.

### Rule 6 — NEVER use neon-http driver for migrations

neon-http has no transaction rollback. Use `neon-serverless`, `node-postgres`, or `postgres-js` (max: 1).

---

## Configuration

### Environment variables

```bash
# Required — pooled connection (runtime queries)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# Required — direct TCP connection (migrations & DDL)
DATABASE_URL_MIGRATIONS=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Optional — read-only replica (falls back to DATABASE_URL)
DATABASE_URL_RO=postgresql://user:pass@ep-xxx-ro-pooler.region.aws.neon.tech/neondb?sslmode=require
```

### Drizzle config

```typescript
// drizzle.config.ts
defineConfig({
  schema: ['./src/schema/*.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: DATABASE_URL_MIGRATIONS ?? DATABASE_URL },
});
```

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [db.architecture.md](db.architecture.md) | Deep-dive: Neon integration, RLS, performance, migration management, DR |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Step-by-step v2.6 → v3.0 DbSession migration |
| [EXAMPLE_CORRECT_SCHEMA.md](EXAMPLE_CORRECT_SCHEMA.md) | Canonical patterns: composite PK, composite FK, money columns |
| [DATABASE_RESET_GUIDE.md](DATABASE_RESET_GUIDE.md) | Neon clean-deploy runbook with verification checklist |
| [ARCHITECTURE.md](../../ARCHITECTURE.md) | Monorepo-wide 4-layer architecture |

---

**Last Updated:** 2026-02-19
**Architecture Version:** 2.6 (Ratified + DbSession)
**Tables:** 85 · **Helpers:** 8 files · **CI Gates:** 7
