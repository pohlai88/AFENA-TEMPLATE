# AFENDA ERP Database Architecture Spec — Evaluation

> **Purpose:** Evaluate current Afenda implementation against the ratification-grade "No-Drift Contract" spec. Section-by-section assessment with concrete gap identification.

---

## 0) Non-Negotiable Principles

| Principle | Spec | Afenda | Status |
|-----------|------|--------|--------|
| **P0** Truth in Postgres | FKs + CHECKs + RLS + triggers | RLS + CHECKs + triggers ✅; FKs sparse ❌ | ⚠️ Partial |
| **P1** Tenant structural | (org_id, id) composite; FKs include org_id | (id) PK; index (org_id, id); FKs single-column | ❌ |
| **P2** One write brain | mutate(), posting worker, workflow/outbox | mutate() ✅; workflow/outbox ✅; posting worker path TBD | ⚠️ |
| **P3** Projections rebuildable | Search, balances derived only | stock_balances writable; search tsvector per-entity | ❌ |

---

## 1) Data Model Layers (4-Layer ERP)

### L1 — Kernel Truth ✅ (structure) / ⚠️ (enforcement)

| Requirement | Afenda | Status |
|-------------|--------|--------|
| sales_invoices, sales_invoice_lines, etc. | Exist | ✅ |
| FKs + constraints + RLS | RLS + CHECKs ✅; FKs sparse | ⚠️ |
| Idempotency + lifecycle rules | doc_postings idempotency; reject_posted_mutation triggers | ✅ |

### L2 — Control Plane ✅

| Requirement | Afenda | Status |
|-------------|--------|--------|
| doc_postings | Exists with idempotency_key, status | ✅ |
| workflow_definitions, workflow_instances | Exist | ✅ |
| outbox_events | workflow_events_outbox, workflow_side_effects_outbox | ✅ |
| idempotency_keys | workflow_outbox_receipts, doc_postings idempotency | ✅ |

### L3 — Projections ❌

| Requirement | Afenda | Status |
|-------------|--------|--------|
| search_documents | Not present; tsvector per-entity | ❌ |
| stock_balances rebuildable | stock_balances writable; no REVOKE | ❌ |

### L4 — Evidence ✅

| Requirement | Afenda | Status |
|-------------|--------|--------|
| audit_logs partitions | audit_logs (partitioned in 0041) | ✅ |
| entity_versions, mutation_batches | Exist | ✅ |

---

## 2) Canonical Column Sets

### 2.1 Base Tenant Entity

| Spec | Afenda | Status |
|------|--------|--------|
| org_id **uuid** | org_id **text** | ⚠️ Type mismatch |
| id uuid | id uuid | ✅ |
| created_at, created_by, updated_at, updated_by | baseEntityColumns | ✅ |
| deleted_at | deletedAt, deletedBy, isDeleted | ✅ (soft-delete pattern) |
| version | version | ✅ |
| **PRIMARY KEY (org_id, id)** | PRIMARY KEY (id) | ❌ |

### 2.2 Document Entity

| Spec | Afenda | Status |
|------|--------|--------|
| doc_no, doc_status | docEntityColumns + postingColumns | ✅ |
| submitted_at/by, cancelled_at/by, amended_from_id | docEntityColumns | ✅ |
| posting_status, posted_at, posted_by, posting_batch_id | postingColumns | ✅ |
| UNIQUE (org_id, doc_no) WHERE doc_no IS NOT NULL | UNIQUE (org_id, doc_no) — Postgres allows multiple NULLs | ✅ Equivalent |
| require_doc_no_on_submit trigger | Migration 0038 | ✅ |
| prevent_mutation_after_submit | reject_posted_mutation on postable tables | ✅ |
| amendment_rules | amendedFromId column; amendment flow in kernel | ⚠️ DB trigger not explicit |

---

## 3) Multi-Tenancy & RLS

### 3.1 RLS Policy Template ✅

| Spec | Afenda | Status |
|------|--------|--------|
| USING (org_id = auth.org_id()) | tenantPolicy: sql`(select auth.org_id() = ${table.orgId})` | ✅ |
| WITH CHECK same | crudPolicy modify | ✅ |

### 3.2 Governance Gate ❌

| Spec | Afenda | Status |
|------|--------|--------|
| RLS_TABLES **generated from schema** | Hand-maintained in cross-tenant-rls.test.ts | ❌ |
| CI fails if org_id missing | schema-lint has-base-columns | ✅ |
| CI fails if RLS missing | schema-lint has-tenant-policy | ✅ |
| CI fails if (org_id, id) PK missing for truth | Not enforced — PK is (id) | ❌ |

---

## 4) Referential Integrity

### 4.1 FK Rollout (NOT VALID) ❌

| Spec | Afenda | Status |
|------|--------|--------|
| ADD CONSTRAINT ... NOT VALID | Not used | ❌ |
| VALIDATE CONSTRAINT in controlled step | Not used | ❌ |

### 4.2 FK Action Rules ⚠️

| Spec | Afenda | Status |
|------|--------|--------|
| Master: ON DELETE RESTRICT | Used where FKs exist | ✅ |
| Header→Lines: ON DELETE CASCADE | Sparse FKs; not consistently applied | ⚠️ |

---

## 5) Posting Architecture

### 5.1 doc_postings Contract

| Spec | Afenda | Status |
|------|--------|--------|
| (org_id, id) PK | (id) PK | ❌ |
| doc_type, doc_id | docType, docId | ✅ |
| **doc_version** | **Missing** | ❌ |
| posting_key (idempotency) | idempotencyKey | ✅ (naming) |
| status | status (posting/posted/failed/reversing/reversed) | ✅ |
| error jsonb | errorMessage text | ⚠️ Type |
| UNIQUE (org_id, doc_type, doc_id, doc_version) | UNIQUE (org_id, doc_type, doc_id) WHERE status IN (...) | ⚠️ No doc_version |
| UNIQUE (org_id, posting_key) | UNIQUE (org_id, idempotency_key) | ✅ |

### 5.2 Worker Behavior

| Spec | Afenda | Status |
|------|--------|--------|
| Claim with FOR UPDATE SKIP LOCKED | Posting worker implementation TBD | ⚠️ |
| Exactly-once write to journals/stock_moves | doc_postings.journal_entry_id, stock_batch_id | Schema ready |
| App code never inserts journal lines | Kernel design; enforcement path to confirm | ⚠️ |

---

## 6) Inventory Truth Model

### 6.1 stock_moves Append-Only ✅

| Spec | Afenda | Status |
|------|--------|--------|
| Append-only | stock_movements; doc says REVOKE | ⚠️ Verify REVOKE in migrations |
| Created only by posting worker | Design intent | ⚠️ |

### 6.2 stock_balances Projection ❌

| Spec | Afenda | Status |
|------|--------|--------|
| Derived; maintained by worker | stock_balances has updatedAt | ❌ |
| Never directly mutated | No REVOKE UPDATE/DELETE | ❌ |

---

## 7) Search Architecture

### 7.1 Stop: REFRESH MATERIALIZED VIEW ✅

| Spec | Afenda | Status |
|------|--------|--------|
| Don't refresh MV on every mutation | No MV refresh on mutate | ✅ |

### 7.2 Do: Outbox + search_documents ❌

| Spec | Afenda | Status |
|------|--------|--------|
| outbox_events (entity_type, entity_id, payload, processed_at) | workflow_*_outbox for workflow; no search outbox | ❌ |
| search_documents (org_id, entity_type, entity_id, title, tsv, updated_at) | Not present | ❌ |
| Worker consumes outbox → UPSERT search_documents | N/A | ❌ |
| Current: tsvector per-entity + GIN | Per-entity search_vector | Different pattern |

---

## 8) Drizzle ORM Structure

### 8.1 Folder Module Layout ❌

| Spec | Afenda | Status |
|------|--------|--------|
| 00_foundation/, 10_master/, 20_sales/, etc. | Flat schema/*.ts | ❌ |

### 8.2 No ORM-Only Relations ⚠️

| Spec | Afenda | Status |
|------|--------|--------|
| Relation exists → FK exists | Relations in spine-relations; many tables lack FKs | ⚠️ |

### 8.3 Canon Templates / Generator ⚠️

| Spec | Afenda | Status |
|------|--------|--------|
| Generator: header+line, composite PKs, tenant FKs | entity-new.ts generates schema; no composite PK/FK | ⚠️ Partial |

---

## 9) Concrete FK List — Coverage

Spec lists ~40 FKs. Afenda has FKs on:

- migration_* (internal)
- meta_* (aliases, lineage, quality)
- roles, user_roles, role_permissions
- entity_view_fields → entity_views
- advisory_evidence → advisories
- custom_field_values → custom_fields (composite in migration)

**Missing (from spec §9):** All domain FKs for sales_invoices→contacts, sales_invoice_lines→sales_invoices, purchase_orders→contacts, journal_lines→journal_entries, stock_moves→items, etc.

---

## 10) Migration Plan — Readiness

| Phase | Spec | Afenda Readiness |
|-------|------|------------------|
| **A** Standardise keys | org_id default ✅; (org_id, id) PK ❌ | Partial |
| **B** Add FKs NOT VALID | Not used | Not started |
| **C** Orphan cleanup | N/A until FKs | Blocked |
| **D** Validate constraints | N/A | Blocked |
| **E** Replace MV refresh | No MV; need outbox+search_documents | Different path |
| **F** CI governance | RLS_TABLES, classifications hand-maintained | Partial |

---

## 11) Summary Scorecard

| Category | Score | Critical Gaps |
|----------|-------|---------------|
| **P0–P3 Principles** | 2/4 | P1 (composite PK/FK), P3 (projections) |
| **4-Layer Model** | 3/4 | L3 projections writable |
| **Canonical Columns** | 4/5 | org_id uuid, PK (org_id, id) |
| **RLS** | 4/5 | RLS_TABLES not generated |
| **Referential Integrity** | 1/4 | No NOT VALID; sparse FKs |
| **Posting** | 3/4 | doc_version; worker path |
| **Inventory** | 1/2 | stock_balances writable |
| **Search** | 0/2 | No outbox+search_documents |
| **Drizzle Structure** | 1/3 | No module folders |
| **Concrete FKs** | 0/1 | Domain FKs missing |
| **Migration Plan** | 2/6 | Phases B–D blocked |

**Overall: ~45% aligned** with the ratification-grade spec.

---

## 12) Prioritised Remediation Roadmap

### Tier 1 — Structural (enables everything else)

1. **Composite PK (org_id, id)** — Migrate truth tables to composite PK.
2. **doc_postings.doc_version** — Add column; update unique to (org_id, doc_type, doc_id, doc_version).
3. **stock_balances REVOKE** — REVOKE UPDATE, DELETE FROM authenticated; ensure worker-only writes.

### Tier 2 — Integrity

4. **Add FKs as NOT VALID** — Start with §9.2–9.4 (sales/purchase cycle).
5. **Orphan cleanup + VALIDATE** — Per relationship.

### Tier 3 — Governance & Scale

6. **Generate RLS_TABLES** — From Drizzle schema; CI gate.
7. **outbox_events + search_documents** — Replace per-entity tsvector with incremental search.
8. **Module folder layout** — Reorganise schema into 00_foundation/, 10_master/, etc.

### Tier 4 — Optional

9. **org_id uuid** — Migration from text; assess impact (auth.require_org_id() return type).
10. **Canon generator** — Extend entity-new to emit composite PKs, FKs, posting hooks.

---

## References

- [db.schema.governance.md](./db.schema.governance.md)
- [database.architecture.md](./database.architecture.md)
- [erp-architecture-validation.md](./erp-architecture-validation.md)
