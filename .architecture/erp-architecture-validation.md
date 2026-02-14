# ERP Database Architecture — Validation Report

> **Purpose:** Validate Afenda's current implementation against the target full-stack ERP database architecture (Postgres-native, Neon-friendly, Drizzle-first, ERPNext drift-resistant).

---

## Executive Summary

| Category | Status | Notes |
|----------|--------|------|
| **4-Layer separation** | ✅ Mostly | Kernel, Control, Evidence clear; Projection partially mixed |
| **Tenancy & RLS** | ✅ Strong | org_id, tenantPolicy, auth.org_id(); minor PK/FK gaps |
| **Referential integrity** | ⚠️ Partial | Few FKs on domain tables; no composite (org_id, id) pattern |
| **Document lifecycle** | ✅ Strong | docEntityColumns, postingColumns, doc_postings contract |
| **Posting as single path** | ⚠️ Schema ready | doc_postings exists; posting worker path unclear |
| **Inventory event-sourcing** | ⚠️ Partial | stock_movements append-only; stock_balances writable |
| **Search** | ⚠️ Different | tsvector per-entity; no outbox + search_documents |
| **Drizzle schema org** | ❌ Flat | No 00_foundation/10_master/ module folders |
| **Governance gates** | ✅ Good | 8-rule lint, RLS tests; RLS_TABLES hand-maintained |

---

## 1. Four Layers (No Drift)

### 1.1 Kernel Tables ✅

| Target | Afenda | Status |
|--------|--------|--------|
| Invoices, orders, items, journals, stock moves | sales_invoices, purchase_orders, items, journal_entries, stock_movements | ✅ |
| Strong FKs, constraints, invariants, RLS | RLS + tenantPolicy; FKs sparse | ⚠️ FKs |

### 1.2 Control Plane Tables ✅

| Target | Afenda | Status |
|--------|--------|--------|
| Workflow defs/instances, approvals, posting batches, idempotency, outbox, locks | workflow_definitions, workflow_instances, approval_*, doc_postings, workflow_*_outbox | ✅ |

### 1.3 Projection Layer ⚠️

| Target | Afenda | Status |
|--------|--------|--------|
| Search, denormalised views, reporting | tsvector per-entity; stock_balances; reporting_snapshots | ⚠️ stock_balances writable; no search_documents |
| Never source of truth; rebuildable | stock_balances updated by "posting logic" — not read-only | ❌ |

### 1.4 Evidence Layer ✅

| Target | Afenda | Status |
|--------|--------|--------|
| Append-only audit, entity_versions, mutation_batches | audit_logs, entity_versions, mutation_batches | ✅ |

---

## 2. Tenancy, RLS, and Keys

### 2.1 Tenant Columns ✅

| Target | Afenda | Status |
|--------|--------|--------|
| org_id uuid not null default auth.require_org_id() | org_id **text** not null default auth.require_org_id() | ⚠️ text not uuid |
| id, created_at, created_by, updated_at, updated_by, version, deleted_at | baseEntityColumns: id, createdAt, updatedAt, createdBy, updatedBy, version, isDeleted, deletedAt, deletedBy | ✅ |

### 2.2 Composite PK/FK Pattern ❌

| Target | Afenda | Status |
|--------|--------|--------|
| PK (org_id, id) for truth tables | PK (id) only; index (org_id, id) | ❌ |
| Child FKs (org_id, parent_id) → (org_id, id) | FKs are single-column (id → id) where they exist | ❌ |

### 2.3 RLS Policies ✅

| Target | Afenda | Status |
|--------|--------|--------|
| USING (org_id = auth.org_id()) | tenantPolicy: read/modify sql`(select auth.org_id() = ${table.orgId})` | ✅ |
| WITH CHECK same | crudPolicy with modify | ✅ |
| CI fails if tenant table missing RLS | schema-lint: has-tenant-policy (error) | ✅ |

### 2.4 RLS_TABLES Generation ⚠️

| Target | Afenda | Status |
|--------|--------|--------|
| RLS_TABLES generated from schema | RLS_TABLES hand-maintained in cross-tenant-rls.test.ts | ⚠️ |

---

## 3. Referential Integrity

### 3.1 FK Coverage ⚠️

| Target | Afenda | Status |
|--------|--------|--------|
| FKs on all *_id columns (unless whitelisted) | FKs on migration_*, meta_*, roles, entity_view_fields, advisory_evidence | ⚠️ Sparse on domain |
| NOT VALID → validate later | Not used | ❌ |
| ON DELETE RESTRICT for masters | Used where FKs exist | ✅ |
| ON DELETE CASCADE for line tables | Not consistently applied | ⚠️ |

### 3.2 Doc Header/Lines Pattern ⚠️

| Target | Afenda | Status |
|--------|--------|--------|
| sales_invoice_lines (org_id, invoice_id, line_no) unique | sales_invoice_lines has line_no; FK pattern not composite | ⚠️ |
| FK (org_id, invoice_id) → (org_id, sales_invoices.id) | No such composite FK in Drizzle schema | ❌ |

---

## 4. Document Lifecycle

### 4.1 Document Base Columns ✅

| Target | Afenda | Status |
|--------|--------|--------|
| doc_no, doc_status, submitted_at/by, cancelled_at/by, amended_from_id | docEntityColumns | ✅ |
| posting_status, posted_at, posting_batch_id | postingColumns | ✅ |

### 4.2 Posting Contract ✅

| Target | Afenda | Status |
|--------|--------|--------|
| doc_postings with idempotency_key, status, journal_entry_id | doc_postings: idempotency_key, status, journal_entry_id, stock_batch_id | ✅ |
| Unique (org_id, doc_type, doc_id) for active | doc_postings_org_doc_active_uniq WHERE status IN (...) | ✅ |

### 4.3 Journals Only via Posting ⚠️

| Target | Afenda | Status |
|--------|--------|--------|
| journal_entries created ONLY by posting workers | journal_entries exist; REVOKE UPDATE/DELETE on journal_lines | ⚠️ Posting worker path not clearly isolated |
| No app code creates journals | Unclear — no explicit "posting worker" package found | ⚠️ |

---

## 5. Inventory & Costing

### 5.1 Stock Moves (Append-Only) ✅

| Target | Afenda | Status |
|--------|--------|--------|
| stock_movements append-only | stock_movements; doc says REVOKE UPDATE/DELETE | ⚠️ Verify REVOKE in migrations |
| source_doc_type, source_doc_id, item_id, warehouse_id, qty, movement_type | sourceType, sourceId, itemId, qty, movementType; siteId (not warehouse_id) | ✅ |
| posted_at, posting_batch_id | postedAt; no posting_batch_id on stock_movements | ⚠️ |

### 5.2 Stock Balances (Projection) ❌

| Target | Afenda | Status |
|--------|--------|--------|
| stock_balances = projection, never direct writes | stock_balances has updatedAt; no REVOKE | ❌ Writable |

---

## 6. Search

### 6.1 Target Pattern

Outbox + incremental search_documents:

- Truth tables write → trigger → outbox_events
- Worker → search_documents (tsv, GIN index)

### 6.2 Afenda Pattern ⚠️

- tsvector column + GIN index per entity
- search_vector triggers per entity
- No outbox_events for search
- No search_documents table
- refreshSearchIndex exists (full refresh)

**Gap:** Different architecture; no incremental outbox-based search.

---

## 7. Drizzle Schema Organisation

### 7.1 Target

```
00_foundation/  10_master/  20_sales/  30_purchase/
40_finance/     50_inventory/  90_control/  99_evidence/
```

### 7.2 Afenda ❌

Flat `schema/*.ts` — no module folders.

### 7.3 Relations vs FKs ⚠️

Target: "No ORM-only relations. If relation exists, FK exists."

Afenda: Relations in spine-relations.ts, relations.ts; many domain tables lack FKs in schema.

---

## 8. Governance Gates

### 8.1 Schema Lint ✅

| Rule | Afenda | Status |
|------|--------|--------|
| org_id default | baseEntityColumns | ✅ |
| RLS enabled | tenantPolicy | ✅ |
| (org_id, id) index | erpIndexes | ✅ (index, not PK) |
| *_id without FK | Not enforced | ❌ |
| POSTABLE_TABLES registered | schema-lint.config.ts | ✅ |
| Table classification | EXEMPT, ERP_ENTITY, POSTABLE, LINE in config | ✅ |

### 8.2 Invariant Tests ✅

| Target | Afenda | Status |
|--------|--------|--------|
| RLS_TABLES from schema | Hand-maintained | ⚠️ |
| Append-only immutability | REVOKE on journal_lines; cross-tenant tests | ✅ |
| doc_no rules | Migration 0038 doc_no_posting_guard | ✅ |

### 8.3 One Write Brain ✅

| Target | Afenda | Status |
|--------|--------|--------|
| mutate() kernel | mutate() in crud | ✅ |
| Posting worker | doc_postings contract; worker path TBD | ⚠️ |
| Workflow/outbox worker | workflow engine + outbox | ✅ |
| No UI scripts, random SQL | Kernel enforces | ✅ |

---

## 9. Reference Schema Map — Coverage

| Category | Target Tables | Afenda | Status |
|----------|---------------|--------|--------|
| Foundation | orgs, org_memberships, roles, feature_flags, sequences | users, roles, user_roles, number_sequences | ⚠️ Different names |
| Master | contacts, items, uom, taxes, companies, sites, warehouses, coa, fiscal_years, cost_centers | All exist | ✅ |
| Sales | quotations, sales_orders, delivery_notes, sales_invoices, payments | All exist | ✅ |
| Purchase | purchase_requests, purchase_orders, goods_receipts, purchase_invoices | All exist | ✅ |
| Finance | journal_entries, journal_lines, bank_accounts, bank_reconciliation_sessions | All exist | ✅ |
| Inventory | stock_movements, lots, serials, stock_balance_projection | stock_movements, lot_tracking, stock_balances | ✅ |
| Control | workflow_*, approvals, outbox_events, idempotency_keys, locks | workflow_*, approval_*, workflow_*_outbox, doc_postings | ✅ |
| Evidence | audit_logs, entity_versions, mutation_batches | All exist | ✅ |

---

## 10. Immediate "Next" Actions (from Target Doc)

| # | Action | Afenda Status | Priority |
|---|--------|---------------|----------|
| 1 | Composite PK/FK (org_id, id) | Not implemented | High |
| 2 | FKs as NOT VALID → validate later | Not used | Medium |
| 3 | Outbox + incremental search_documents | tsvector per-entity; no outbox | Medium |
| 4 | Autogenerate RLS_TABLES from schema | Hand-maintained | Low |
| 5 | Posting as only path to journals + stock moves | doc_postings ready; worker path to confirm | High |

---

## 11. Fulfillment Verdict

**Overall: ~70% aligned.** Strong on tenancy, RLS, document lifecycle, control plane, and evidence. Gaps:

1. **Composite PK/FK** — (org_id, id) not used; FKs sparse on domain tables.
2. **stock_balances** — Should be projection-only (REVOKE direct writes).
3. **Search** — Different pattern (tsvector per-entity vs outbox + search_documents).
4. **Schema organisation** — Flat vs module folders.
5. **Posting worker** — Contract exists; ensure journals/stock_moves only via posting.
6. **RLS_TABLES** — Derive from schema instead of hand list.

---

## References

- [db.schema.governance.md](./db.schema.governance.md)
- [database.architecture.md](./database.architecture.md)
- [drizzle.utilization.plan.md](./drizzle.utilization.plan.md)
