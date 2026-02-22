# Database Reset Guide — Clean State Deployment

**Purpose:** Reset a Neon database branch and deploy 160-table ERP schema from scratch  
**Date:** 2026-02-21  
**Architecture Version:** 3.1 (Canon DB Integration)  
**Status:** Production Ready

---

## Overview

This guide deploys the full AFENDA-NEXUS ERP schema to a Neon Serverless Postgres branch using a two-phase process:

1. **Bootstrap** — Create prerequisite schemas, auth functions, roles, and grants
2. **Migrate** — Apply Drizzle migrations (160 tables + RLS + indexes)

---

## Prerequisites

### Required

- Neon account with project access (`dark-band-87285012` / nexuscanon-axis)
- Direct (non-pooled) connection string for the target branch
- `pnpm` installed, all dependencies installed (`pnpm install`)

### Environment Variables

```bash
# .env file (at monorepo root — drizzle.config.ts walks up to find it)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_MIGRATIONS=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

> **CRITICAL:** `DATABASE_URL_MIGRATIONS` must be a **direct** (non-pooled) connection. Pooled connections break transaction semantics needed for migrations.

---

## Option 1: Reset via Neon Branch (Recommended)

### Using Neon Console

1. Go to https://console.neon.tech → select project
2. Create a new branch from production (or reset existing dev branch)
3. Copy the **direct** connection string (not pooler)
4. Update `.env` with the new connection string

### Using Neon MCP / API

```bash
# Reset a dev branch from parent
neonctl branches reset dev/migration-test --project-id dark-band-87285012

# Or create a fresh branch
neonctl branches create --name v3.1-clean-deploy --project-id dark-band-87285012
```

---

## Option 2: Reset Existing Database (Destructive)

### ⚠️ WARNING: This will delete ALL data

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO neondb_owner;
```

---

## Step-by-Step Deployment

### 1. Validate Package (Offline Gates)

```bash
cd packages/database

# Validate all architectural gates
pnpm db:validate-gates

# Run offline migration gates
pnpm db:drizzle:ci
```

**Expected:** All gates pass (PREREQ-01, RLS-CAST-01, ORG-UUID-01, etc.)

### 2. Bootstrap Prerequisites

```bash
pnpm db:bootstrap
```

**What this does** (`scripts/bootstrap-neon.sql`):

- Creates `auth` and `drizzle` schemas
- Creates 8 auth functions: `org_id()`, `user_id()`, `org_id_uuid()`, `org_role()`, `org_id_or_setting()`, `require_org_id()`, `try_uuid()`, `set_context()`
- Creates 4 roles: `authenticated`, `worker` (BYPASSRLS), `schema_owner`, `migration_admin`
- Grants USAGE on `auth` and `public` schemas to `authenticated`
- Grants EXECUTE on auth functions to `authenticated`
- Self-verifies with a diagnostic block

**Expected Output:**

```
🔌 Connecting to: ep-xxx.region.aws.neon.tech
📂 Bootstrap SQL : .../scripts/bootstrap-neon.sql
✅ Bootstrap completed successfully
```

### 3. Apply Migrations

```bash
pnpm db:migrate
```

**What this does:**

- Runs `scripts/run-migrate.mjs` using `@neondatabase/serverless` WebSocket Pool
- Applies `drizzle/0000_0000_baseline.sql` (148 tables) + incremental migrations (160 total)
- Creates all composite PKs `(org_id, id)`, indexes, CHECK constraints
- Enables RLS with `tenantPolicy` on all tenant tables
- Creates `doc_status` enum type

**Expected Output:**

```
🔌 Connecting to: ep-xxx.region.aws.neon.tech
📂 Migrations folder: ./drizzle
✅ Migrations applied successfully
```

### 4. Verify Deployment

```sql
-- Table count (should be 160)
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- RLS enabled on all tenant tables
SELECT count(*) FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- Roles present
SELECT rolname FROM pg_roles
WHERE rolname IN ('authenticated', 'worker', 'schema_owner', 'migration_admin');

-- Auth functions work
SELECT auth.org_id();  -- returns NULL (no context set)

-- Test auth context
SELECT auth.set_context('550e8400-e29b-41d4-a716-446655440000', 'user123');
SELECT auth.org_id(), auth.user_id();
```

### 5. Normalize Ownership (Optional)

```bash
psql $DATABASE_URL_MIGRATIONS -f scripts/normalize-ownership.sql
```

---

## Post-Deployment Checklist

- [ ] 160 tables exist in public schema
- [ ] All tenant tables have RLS enabled
- [ ] Auth functions work (`auth.org_id()`, `auth.user_id()`, `auth.set_context()`)
- [ ] 4 roles created (`authenticated`, `worker`, `schema_owner`, `migration_admin`)
- [ ] `doc_status` enum type exists
- [ ] No migration errors in logs
- [ ] DbSession API works correctly
- [ ] All CI gates pass: `pnpm db:validate-gates`

---

## Troubleshooting

### Error: `function auth.org_id() does not exist`

Bootstrap was not run. Execute:

```bash
pnpm db:bootstrap
```

### Error: `operator does not exist: text = uuid`

RLS policy has `auth.org_id()` without `::uuid` cast. The `RLS-CAST-01` gate prevents this. Fix the schema file and regenerate the migration.

### Error: `relation "..." already exists`

Database not clean. Reset the branch:

```bash
neonctl branches reset <branch-name> --project-id dark-band-87285012
```

### Error: `role "authenticated" already exists`

Safe to ignore — bootstrap SQL is idempotent (uses `DO $$ ... IF NOT EXISTS`).

---

## Rollback

### Neon Branch Rollback (Recommended)

```bash
# Reset branch to parent state
neonctl branches reset <branch-name> --project-id dark-band-87285012

# Or delete and recreate
neonctl branches delete <branch-name> --project-id dark-band-87285012
```

---

## Related Documents

| Document                                               | Description                                 |
| ------------------------------------------------------ | ------------------------------------------- |
| [drizzle/README.md](drizzle/README.md)                 | Migration CI enforcement and gate reference |
| [db.architecture.md](db.architecture.md)               | Deep architecture reference (12 sections)   |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)               | v2.6 → v3.0 DbSession migration             |
| [EXAMPLE_CORRECT_SCHEMA.md](EXAMPLE_CORRECT_SCHEMA.md) | Canonical schema patterns                   |

---

**Status:** ✅ Ready for Clean Deployment  
**Validation:** 16 gates (8 offline + 4 online + 7 architectural)  
**Tables:** 160 · **RLS:** All tenant tables · **Roles:** 4  
**Compliance:** v3.1 Architecture (Canon DB Integration)
