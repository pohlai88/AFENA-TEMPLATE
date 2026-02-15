# DB–Drizzle Schema Drift Analysis

**Project:** nexuscanon-axis (Neon `dark-band-87285012`)  
**Branch:** production  
**Analysis Date:** 2026-02-15  
**Status:** ✅ REPAIRED (2026-02-15) — Migrations 0048–0051 applied. GAP-DB-001 (composite PK), GAP-DB-003, GAP-DB-008 enforced. `db:drift-check` script added. stock_balances composite PK applied. All gaps validated per document.

---

## Executive Summary

The Neon database and Drizzle schema are out of sync. The DB is missing **11 tables** and has **column naming drift** (`product_id` vs `item_id`). Migration history shows **2 migrations never applied** (0040, 0041) and **migration records that don’t match actual schema** (0043 recorded but its tables are missing).

---

## 1. Drift Inventory

### 1.1 Tables in Drizzle Schema but Missing in DB

| Table | Migration | Drizzle File | Impact |
|-------|-----------|--------------|--------|
| `audit_logs` | 0005 | audit-logs.ts | Audit trail; CRUD/mutate depends on it |
| `audit_logs_partitioned` | 0041 | (partitioned view) | Partitioned audit; 0041 not applied |
| `bank_accounts` | 0043 | bank-accounts.ts | Bank reconciliation; `bank_statement_lines.bank_account_id` FK |
| `bank_reconciliation_sessions` | 0043 | bank-reconciliation-sessions.ts | Reconciliation workflow |
| `contracts` | 0043 | contracts.ts | Contract management |
| `customer_profiles` | 0043 | customer-profiles.ts | Customer defaults |
| `debit_notes` | 0043 | debit-notes.ts | Debit note documents |
| `payment_terms` | 0043 | payment-terms.ts | Payment terms master |
| `purchase_requests` | 0043 | purchase-requests.ts | PR workflow |
| `stock_balances` | 0043 | stock-balances.ts | Projection table (GAP-DB-003) |
| `supplier_profiles` | 0043 | supplier-profiles.ts | Supplier defaults |

### 1.2 Column Drift (DB Has Old Names)

| Table | DB Column | Drizzle Expects | Migration |
|-------|-----------|-----------------|-----------|
| `stock_movements` | `product_id` | `item_id` | 0043 |
| `lot_tracking` | `product_id` | `item_id` | 0043 |

### 1.3 Migration History Anomaly

`drizzle.__drizzle_migrations` shows:

- **Applied:** id 1–39, 42–45 (45 rows)
- **Missing:** id 40 (0040_workflow_v2), id 41 (0041_audit_log_partition_cutover)

0043 is recorded as applied, but its tables are absent. Possible causes:

1. DB restored from backup after migrations ran
2. Migrations run on a different branch
3. Partial failure with migration still recorded

---

## 2. Root Causes

1. **Migrations 40 and 41 never applied** – Workflow v2 and audit partitioning cutover skipped.
2. **0043 tables missing despite recorded** – Schema does not match migration history.
3. **No CI check for schema vs DB** – Drift not detected before deploy.
4. **Manual DB changes or restores** – Migration table and schema diverged.

---

## 3. Impact

- **Runtime:** Queries against missing tables will fail (e.g. `audit_logs`, `bank_accounts`).
- **FKs:** `bank_statement_lines.bank_account_id` references `bank_accounts`; table missing.
- **Drizzle:** `db.query.*` and relations assume all tables exist.
- **CRUD/mutate:** Audit logging and entity handlers may break.

---

## 4. Rigid Solution

### Phase 1: Repair Migration (Idempotent)

Create a single repair migration that:

1. Creates all missing tables with `CREATE TABLE IF NOT EXISTS`
2. Renames `product_id` → `item_id` where applicable
3. Adds missing columns (e.g. `bank_statement_lines.reconciliation_session_id`)
4. Fixes type mismatches (e.g. `webhook_endpoints.failure_count` text → integer)

### Phase 2: Apply Migrations 40 and 41

- Run 0040_workflow_v2.sql
- Run 0041_audit_log_partition_cutover.sql (requires `audit_logs` to exist; Phase 1 must create it if missing)

### Phase 3: CI Gate

- Add `pnpm db:drift-check` that compares DB schema (via `drizzle-kit introspect` or Neon MCP) to Drizzle schema and fails on drift.

---

## 5. Execution Order

**Important:** Migrations use `auth.require_org_id()` / `auth.user_id()` in DEFAULTs. When run via `pnpm db:migrate`, the connection may lack JWT context, causing "Missing activeOrganizationId in JWT" errors. Use one of:

### Option A: Run via Neon MCP (recommended for repair)

Use `mcp_Neon_run_sql` or `mcp_Neon_run_sql_transaction` to execute `0048_drift_repair.sql` in chunks. The Neon MCP connection runs as DB owner and bypasses RLS during DDL.

### Option B: Run with migration role that bypasses RLS

Create a `DATABASE_URL_MIGRATIONS` that uses a role with `BYPASSRLS` or run migrations during a maintenance window with session vars set for auth.

### Option C: Apply 0048 manually

1. Connect to the DB as owner/superuser
2. Execute the SQL from `packages/database/drizzle/0048_drift_repair.sql` (remove `--> statement-breakpoint` lines)
3. Insert a row into `drizzle.__drizzle_migrations` for 0048

### Verification

```
pnpm db:generate → "No schema changes"
```

---

## 6. Verification Queries

```sql
-- After repair: all should return true
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_logs');
SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='bank_accounts');
SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='stock_movements' AND column_name='item_id');
```
