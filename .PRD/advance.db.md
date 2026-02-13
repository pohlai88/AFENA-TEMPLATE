# ERP Database Architecture Audit — 10 Critical Challenges + Global ERP Gaps (v2.1 — Ratified)

Comprehensive validation of Afena's architecture against the 10 hardest database/config challenges for a multi-industry ERP on serverless Neon Postgres, plus identification of critically missing pieces for a global ERP. **v2.1** incorporates tightened priorities, enforcement-layer analysis, deeper global ERP gaps (G0.1–G0.21), locked DB blueprint decisions, and presentation polish for CTO sign-off.

---

## Scorecard Summary

| #   | Challenge              | Verdict                               | Grade        | Enforced By                    |
| --- | ---------------------- | ------------------------------------- | ------------ | ------------------------------ |
| 1   | Tenant isolation       | **Fully engineered**                  | ✅ A         | DB + Kernel + CI               |
| 2   | Global ID strategy     | **Fully engineered**                  | ✅ A         | DB + Kernel                    |
| 3   | Document numbering     | **Schema ready, kernel not wired**    | ⚠️ B-        | DB only (no kernel)            |
| 4   | Immutability + audit   | **Infra A, financial tables pending** | ✅ A (infra) | DB + Kernel + CI               |
| 5   | Performance            | **Strong foundation**                 | ✅ A-        | DB + Kernel                    |
| 6   | Search                 | **Solid, MV refresh is P0**           | ⚠️ B+        | DB + Kernel (partial)          |
| 7   | Workflow + approvals   | **Fully engineered**                  | ✅ A         | DB + Kernel + CI               |
| 8   | Multi-company/currency | **Schema ready, no accounting**       | ⚠️ B         | DB (partial) + Kernel (future) |
| 9   | Integrations & imports | **Fully engineered**                  | ✅ A         | DB + Kernel                    |
| 10  | Serverless Neon        | **Fully engineered**                  | ✅ A         | DB + Kernel                    |

**Overall: 7/10 fully solved, 3/10 partially solved (schema ready, implementation pending)**

### Enforcement Legend

Every "✅ Fully engineered" claim is backed by at least one provable enforcement layer:

| Layer      | Mechanism                                                                          | Bypass-proof?                                 |
| ---------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| **DB**     | RLS policies, CHECK constraints, REVOKE grants, triggers, partial unique indexes   | Yes — survives admin SQL, maintenance scripts |
| **Kernel** | `mutate()` pipeline (lifecycle → policy → governor → handler), ESLint INVARIANT-01 | No — bypassed by direct SQL                   |
| **CI**     | Schema lint (`pnpm db:lint`), ESLint rules, `ci:invariants`, vitest                | No — only catches at build time               |

**Rule of thumb:** any invariant that **must never be violated** (tenant isolation, posted-record immutability, double-entry balance, period close) requires **DB-level enforcement**. Kernel + CI are defense-in-depth and developer experience, not the final gate.

---

## Challenge 1: Tenant Isolation — ✅ A (Fully Engineered)

### What you have

- **RLS on every business table** — `tenantPolicy(table)` mandatory via INVARIANT-11, enforced by schema lint (`has-tenant-policy` rule) and CI
- **`auth.org_id()` as canonical session context** — JWT-only extraction, no `app.org_id` fallback for authenticated users, `REVOKE ALL FROM PUBLIC` + explicit `GRANT TO authenticated`
- **`auth.require_org_id()`** in column DEFAULTs — writes fail if no org in session
- **`org_not_empty` CHECK** on every table — backstop even if RLS bypassed
- **3-layer write safety for dbRo** — export naming, ESLint INVARIANT-RO, recommended DB role
- **`(select ...)` wrapper** in RLS predicates — enables per-statement caching
- **86 multi-tenancy tests** across 7 test files
- **INVARIANT-12** — `auth.org_id()` NULL → zero rows + write fails

### Enforcement matrix

| Invariant                 |                   DB                   |            Kernel             |            CI            |
| ------------------------- | :------------------------------------: | :---------------------------: | :----------------------: |
| org_id on every table     |          CHECK `org_id <> ''`          | K-11 strips org_id from input |   `has-org-check` lint   |
| RLS on every table        | `ENABLE ROW LEVEL SECURITY` + `FORCE`  |               —               | `has-tenant-policy` lint |
| No cross-tenant reads     | RLS predicate `auth.org_id() = org_id` |               —               |            —             |
| No cross-tenant writes    | RLS + `auth.require_org_id()` DEFAULT  |      `mutate()` context       |            —             |
| No writes on read replica |         Recommended RO DB role         |               —               |   ESLint INVARIANT-RO    |

> **Footnote (schema type):** `org_id` is **text** — `CHECK (org_id <> '')` prevents empty-string bypass. `NOT NULL` is enforced by the column definition. Schema lint validates the presence of the `org_not_empty` CHECK and tenant policy rules.

### What's missing

- **Cross-tenant integration tests against live DB** — current tests are unit-level mocks. No test that connects as tenant A and proves tenant B's data is invisible. (P1 — add when integration test infra exists)
- **`auth.org_id_or_setting()` NOT granted to authenticated** — correct, but no automated test verifies this grant restriction survives migrations

### Verdict

Textbook correct. Defense-in-depth (RLS + CHECK + ESLint + schema lint + kernel strip) is stronger than most production ERPs. The `(select ...)` optimization is a nice touch for performance.

---

## Challenge 2: Global ID Strategy — ✅ A (Fully Engineered)

### What you have

- **UUID PKs everywhere** — `gen_random_uuid()` + pgcrypto extension for branch safety
- **Human document numbers** as separate `doc_no` column — `docNumber()` helper (generates formatted `doc_no` strings from sequence components), `number_sequences` table with per-org/company/entity/fiscal-year sequences
- **Legacy ID mapping** — full `migration_lineage` table with `(org_id, entity_type, legacy_system, legacy_id)` → `entity_id` mapping, `dedupe_key` column + partial unique index
- **`migration_row_snapshots`** — preserves original legacy data alongside transformed data

### Enforcement matrix

| Invariant                    |                           DB                           |     Kernel     | CI  |
| ---------------------------- | :----------------------------------------------------: | :------------: | :-: |
| UUID PKs                     |              `DEFAULT gen_random_uuid()`               |       —        |  —  |
| Doc numbers separate from PK |         `doc_no` column, `docNumber()` helper          |       —        |  —  |
| Legacy ID uniqueness         | Partial unique index on `migration_lineage.dedupe_key` | Pipeline dedup |  —  |

### What's missing

- Nothing material. This is the correct pattern.

---

## Challenge 3: Document Numbering Under Concurrency — ⚠️ B- (Schema Ready, Kernel Not Wired)

### What you have

- **`number_sequences` table** — `(org_id, company_id, entity_type, fiscal_year)` unique, `next_value` integer, `pad_length`, `prefix`, `suffix`
- **Architecture doc states** `UPDATE ... RETURNING` with row-level lock
- **Seeded defaults** — `seed_org_defaults()` creates sequences for entity types with sensible prefixes

### Enforcement matrix

| Invariant               |                                DB                                | Kernel | CI  |
| ----------------------- | :--------------------------------------------------------------: | :----: | :-: |
| Sequence uniqueness     | UNIQUE index on `(org_id, company_id, entity_type, fiscal_year)` |   —    |  —  |
| Atomic allocation       |                     — (**NOT IMPLEMENTED**)                      |   —    |  —  |
| No gaps / no duplicates |                                —                                 |   —    |  —  |

### What's critically missing

- **No `allocateDocNumber()` function exists in code** — the `number_sequences` table exists but there is NO kernel function that does the atomic `UPDATE number_sequences SET next_value = next_value + 1 ... RETURNING next_value`. The architecture doc describes the pattern but it's not implemented.
- **No fiscal year boundary reset logic** — `fiscal_year` column exists but no code detects year boundaries or creates new sequence rows
- **No `lock_timeout` on sequence allocation** — under high concurrency, sequence allocation could block behind long transactions

### Decision: Allocate-on-Post (Recommended Default)

This is not just a product decision — it's a **compliance + UX decision**. In many accounting regimes, holes in numbering may be acceptable if documented, but auditors and users will still complain.

| Option                                | Behavior                                                                                                                     | Pros                       | Cons                                       |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------ |
| **A: Allocate-on-post** (recommended) | `doc_no` assigned only when `doc_status` transitions to `submitted`/`active`. Drafts use `draft_ref` (UUID) for UI tracking. | No gaps. Auditor-friendly. | Drafts have no human number.               |
| B: Reserve-on-create + expire         | Allocate on create, expire unused after N days, reallocate.                                                                  | Drafts have numbers.       | Complex. Expiry logic. Gaps on expiry.     |
| C: Burn-on-draft                      | Allocate on create, accept gaps.                                                                                             | Simplest.                  | Perpetual complaint from auditors + users. |

### Remediation (P0 — blocks any doc entity like invoices)

1. Implement `allocateDocNumber(tx, orgId, companyId, entityType)` in `packages/crud/src/services/`.
2. Use single-statement atomic allocation: `UPDATE ... SET next_value = next_value + 1 ... RETURNING next_value`.
3. Before allocation: `SET LOCAL lock_timeout = '2s'`.
4. Wire allocation into handler `submit()` (allocate-on-post), not `create()`.
5. Add fiscal year rollover logic (based on `companies.fiscal_year_start`).
6. Store `draft_ref` (UUID) for UI tracking pre-posting.
7. Add partial unique index per doc table: `CREATE UNIQUE INDEX ... ON <doc_table> (org_id, company_id, doc_no) WHERE doc_no IS NOT NULL` — guarantees uniqueness only when assigned. (`entity_type` and `fiscal_year` belong in `number_sequences` allocation scope, not on every doc table.)
8. Add DB guard (trigger on `UPDATE OF doc_status`): doc cannot transition to `submitted`/`active` unless `doc_no IS NOT NULL`. Guard fires only on status changes, not on other draft edits.

---

## Challenge 4: Accounting-Grade Immutability + Auditability — ✅ A (Infra Fully Engineered)

### What you have

- **`audit_logs`** — audit capture enforced in kernel (K-03), visibility via RLS; **DB-level append-only REVOKE is a P0 hardening gap** (see enforcement matrix below)
- **`entity_versions`** — snapshot-first versioning, every mutation creates a version row (K-03)
- **`advisory_evidence`** — `REVOKE UPDATE/DELETE FROM authenticated` (INVARIANT-P02)
- **`workflow_executions`** — `REVOKE UPDATE/DELETE FROM authenticated`, append-only
- **Lifecycle state machine** — `docEntityColumns` with `doc_status` (draft → submitted → active → cancelled → amended), enforced BEFORE policy in `mutate()` pipeline
- **Optimistic locking** — `expectedVersion` required on all non-create verbs (K-04)
- **Authority snapshot** — every mutation records the exact policy evaluation result in `audit_logs.authority_snapshot` (JSONB)
- **Diff tracking** — `audit_logs.diff` stores JSON patch between before/after snapshots

### Enforcement matrix

| Invariant                      |                                                    DB                                                     |              Kernel              | CI  |
| ------------------------------ | :-------------------------------------------------------------------------------------------------------: | :------------------------------: | :-: |
| Evidence tables append-only    |                     `REVOKE UPDATE/DELETE` on advisory_evidence, workflow_executions                      |                —                 |  —  |
| Audit log append-only          | ⚠️ **Gap:** RLS-only today (privileged SQL can mutate). Requires `REVOKE UPDATE, DELETE` on `audit_logs`. | K-03 audit capture in `mutate()` |  —  |
| Every mutation audited         |                                                     —                                                     |        K-03 in `mutate()`        |  —  |
| Optimistic locking             |                                                     —                                                     |      K-04 `expectedVersion`      |  —  |
| Lifecycle transitions          |                                           CHECK on `doc_status`                                           |       `enforceLifecycle()`       |  —  |
| **Posted-record immutability** |                                             **NOT ENFORCED**                                              |    `enforceLifecycle()` only     |  —  |

### What's missing — P0 when first financial doc ships

- **P0 — `audit_logs` must be DB append-only (immediate hardening):** today it relies on RLS predicates (`crudPolicy`) but lacks `REVOKE UPDATE, DELETE`. Apply `REVOKE UPDATE, DELETE ON audit_logs FROM authenticated` so out-of-band SQL cannot mutate audit history. This is P0 **immediately** — `audit_logs` is the system evidence ledger, not just a financial table.

- **No DB-level lock on posted records** — lifecycle guard is app-layer (`enforceLifecycle()` in mutate.ts). A direct SQL `UPDATE` bypassing the kernel could modify a posted invoice. This is **P0 when the first financial document table ships** (not P1).

  Required: `BEFORE UPDATE` trigger on each financial table:

  ```sql
  CREATE TRIGGER guard_posted_record
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    WHEN (OLD.doc_status IN ('submitted', 'active'))
    EXECUTE FUNCTION public.reject_posted_mutation();
  ```

- **No accounting journal / GL entry tables yet** — the immutability pattern is proven on audit_logs/advisory_evidence, but actual double-entry accounting tables don't exist yet

### Verdict

The immutability infrastructure is production-grade for evidence/audit tables. **Posted-record DB triggers become P0 the moment any financial document table ships** — app-layer lifecycle checks don't protect against out-of-band writes.

---

## Challenge 5: High-Volume Performance — ✅ A- (Strong Foundation)

### What you have

- **Composite indexes aligned with access paths** — `(org_id, id)`, `(org_id, created_at)` on every table via `erpIndexes()`
- **BRIN indexes** on time-series tables (`audit_logs`, `workflow_executions`) — ~1000x smaller than B-tree
- **Covering indexes (INCLUDE)** on hot-path lookups — `custom_field_values`, `meta_aliases`, `meta_alias_resolution_rules`
- **Partial indexes** for soft-deleted rows (`WHERE is_deleted = false`) and active custom fields
- **Conditional typed-column indexes** on `custom_field_values` (7 typed indexes, each with WHERE clause)
- **RW/RO split** — reads on `dbRo` (read replica), writes on `db` — distributes load from day 1
- **`search_index` materialized view** — cross-entity search in single SQL statement
- **Governor timeouts** — `statement_timeout` 5s interactive / 30s background prevents runaway queries

### Enforcement matrix

| Invariant                       |          DB           |           Kernel            |           CI            |
| ------------------------------- | :-------------------: | :-------------------------: | :---------------------: |
| Standard indexes on every table | `erpIndexes()` helper |              —              | `has-org-id-index` lint |
| Statement timeouts              |           —           | `applyGovernor()` SET LOCAL |            —            |
| Read replica routing            |           —           |     `getDb()` / `dbRo`      |   ESLint INVARIANT-RO   |

### What's missing

- **Partitioning is deferred** — documented strategy (audit_logs by month, custom_field_values by entity_type) but not implemented. Correct decision — premature partitioning adds complexity. Trigger at ~10M rows. **Pre-design partition keys now** (see §DB Blueprint Decisions).
- **No pre-aggregation tables** — no `invoice_summary`, `customer_aging`, `inventory_balance` projections. Architecture documents `projections` schema convention but nothing exists yet. (P2 — build when reporting modules ship)
- **No `pg_stat_statements` monitoring** — no documented approach for identifying slow queries in production. (P1 — add to ops checklist)

---

## Challenge 6: Search as First-Class DB Problem — ⚠️ B+ (Solid, MV Refresh is P0)

### What you have

- **Postgres FTS** — `tsvector` column + GIN index per entity, `'simple'` config (multi-language friendly)
- **Cross-entity search** — `search_index` materialized view with unified FTS + ILIKE fallback
- **Per-entity adapters** — registry pattern, each entity provides `searchFn(query, limit)`
- **ILIKE fallback** — for short queries (<3 chars) and email searches
- **All search on `dbRo`** — never hits the write path
- **`meta_aliases.search_text`** — GIN index enables "search by business term"

### Enforcement matrix

| Invariant              |                  DB                   |         Kernel         |         CI          |
| ---------------------- | :-----------------------------------: | :--------------------: | :-----------------: |
| FTS per entity         | tsvector column + GIN index + trigger |           —            |          —          |
| Cross-entity search    |           `search_index` MV           |           —            |          —          |
| Search on read replica |                   —                   | `dbRo` in all adapters | ESLint INVARIANT-RO |
| MV freshness           |           **NOT ENFORCED**            |           —            |          —          |

### What's missing

**P0 — MV refresh is P0 correctness-critical (not UX-only / non-blocking)**

- `search_index` is a materialized view with **no documented refresh strategy**. Without refresh: users think search is broken, debugging becomes impossible ("why can't I find invoice X?").
- Implement: `REFRESH MATERIALIZED VIEW CONCURRENTLY search_index` on a schedule (e.g., after every N mutations via kernel hook, or 30s timer via pg_cron / app-level cron).
- **V1 default:** app-level cron every 30s + `CONCURRENTLY` refresh. Kernel hook (per-N-mutations) is the Phase B upgrade.

**P1 — Trigram indexes improve UX**

- No `pg_trgm` extension. For ERP, users frequently search by partial codes, SKUs, serial numbers, batch numbers. `pg_trgm` with `gin_trgm_ops` on code/name columns would dramatically improve fuzzy search quality.
- No search vector on companies — only contacts has a `search_vector` column + trigger. Generator should auto-wire this.

### Remediation

1. **(P0)** Implement MV refresh strategy — document + implement (kernel hook or cron)
2. **(P1)** Add `CREATE EXTENSION IF NOT EXISTS pg_trgm` to a migration
3. **(P1)** Add `GIN(name gin_trgm_ops)` indexes on key searchable columns
4. **(P1)** Wire search vector generation into entity generator

---

## Challenge 7: Workflow + Approvals + State Machines — ✅ A (Fully Engineered)

### What you have

- **5-state lifecycle machine** — draft → submitted → active → cancelled → amended, enforced in `enforceLifecycle()` BEFORE policy
- **DB CHECK constraints** on `doc_status` — prevents invalid states at DB level
- **`docEntityColumns`** — 18 columns including `submitted_at/by`, `cancelled_at/by`, `amended_from_id`
- **Workflow engine** — before-rules (can block/enrich) and after-rules (fire-and-forget), priority-ordered, DB-loadable with TTL cache
- **`workflow_executions`** — append-only execution log (REVOKE UPDATE/DELETE)
- **`workflow_rules`** — declarative JSON conditions + actions, per entity type + verb
- **Policy engine (V2)** — verb+scope+field RBAC with `role_permissions` table, 9 verbs including approve/reject
- **Authority snapshot** — every mutation records the policy evaluation for compliance

### Enforcement matrix

| Invariant                     |           DB           |               Kernel               |         CI          |
| ----------------------------- | :--------------------: | :--------------------------------: | :-----------------: |
| Valid doc_status values       |    CHECK constraint    |                 —                  |          —          |
| State transitions             |           —            |        `enforceLifecycle()`        |          —          |
| Execution log append-only     | `REVOKE UPDATE/DELETE` |                 —                  |          —          |
| Every mutation through policy |           —            | `enforcePolicyV2()` in `mutate()`  | ESLint INVARIANT-01 |
| Authority recorded            |           —            | K-03 audit_logs.authority_snapshot |          —          |

### What's missing

- **No multi-step approval chains** — current model is single-step (approve/reject). No `approval_steps` table for "requires 2 of 3 managers" or sequential approvals. (P2 — additive when needed)
- **No delegation / proxy approval** — no mechanism for "approve on behalf of" during absence. (P3)

### Verdict

Single-step approval + workflow engine + lifecycle state machine covers 90% of ERP approval needs. Multi-step chains are additive.

---

## Challenge 8: Multi-Company, Multi-Currency, Multi-Ledger — ⚠️ B (Schema Ready, No Accounting Entities)

### What you have

- **`companies` table** — legal entity with `base_currency`, `fiscal_year_start`, `registration_no`, `tax_id`
- **`sites` table** — warehouse/branch/plant with `company_id` FK, `type` CHECK
- **`erpEntityColumns`** — `company_id` (optional) + `site_id` (optional) on every ERP entity
- **`currencies` table** — org-scoped ISO 4217 with `is_base`, `fx_rate_to_base`, `minor_units`
- **`moneyDocumentColumns(prefix)`** — `{prefix}_minor`, `currency_code`, `fx_rate`, `fx_source`, `fx_as_of`, `base_{prefix}_minor`
- **FX audit invariant** — every financial document records HOW and WHEN the rate was obtained
- **Money as integer minor units** — no float rounding, ever (`no-float-money` schema lint rule)
- **Scope-based RBAC** — `company` and `site` scopes in `role_permissions` + `user_scopes`

### Enforcement matrix

| Invariant                |                  DB                  |             Kernel              |              CI              |
| ------------------------ | :----------------------------------: | :-----------------------------: | :--------------------------: |
| No float money           |                  —                   |                —                | `no-float-money` schema lint |
| FX provenance            | `fx_source` CHECK, `fx_as_of` column |                —                |              —               |
| Company/site scoping     |            FK constraints            | `checkScope()` in policy engine |              —               |
| **Period close**         |         **NOT IMPLEMENTED**          |                —                |              —               |
| **Double-entry balance** |         **NOT IMPLEMENTED**          |                —                |              —               |

### What's critically missing

**Co-P0 with GL: Fiscal Periods + Period Close**

Even with GL tables, if you don't have fiscal periods + period close rules + posting restrictions, you cannot prevent backdated changes that destroy financial truth. **G4 fiscal periods is co-equal to G1 GL, not "after".**

- **No GL / Chart of Accounts / Journal Entry tables** — zero accounting tables exist
- **No FX rate table** — `currencies.fx_rate_to_base` is a single static rate. No historical/daily/multi-source rates.
- **No fiscal period management** — no period close, no posting restrictions
- **No ledger dimension model** — no cost center, department, project dimensions
- **No intercompany transaction model** — no elimination entries
- **Legal entity vs operating unit not explicitly modeled** — `companies` serves as both

### Remediation (P0 — co-equal, not sequential)

1. **Fiscal periods + period close** — must exist BEFORE posting starts (see §DB Blueprint)
2. **FX rates table** — invoices need it immediately
3. **Chart of accounts + Journal entries/lines** — append-only, balanced
4. **Posted-record DB triggers** — on invoices + journal tables
5. **Ledger dimensions** — decide typed columns vs bridge tables (see §DB Blueprint)

---

## Challenge 9: Integrations & Imports — ✅ A (Fully Engineered)

### What you have

- **Idempotency keys** — `audit_logs.idempotency_key` with partial unique index `(org_id, action_type, idempotency_key) WHERE idempotency_key IS NOT NULL` (K-10)
- **Migration engine** — full pipeline: Extract → Transform → Plan → Load with conflict detection, quarantine, checkpoints, signed reports
- **`migration_lineage`** — `(org_id, entity_type, legacy_system, legacy_id)` → `entity_id` mapping with `dedupe_key` partial unique index
- **`migration_quarantine`** — quarantined records with retry/replay capability
- **`migration_conflicts` + `migration_conflict_resolutions`** — score-based merge routing (auto-merge / manual_review / create new)
- **Transform chain** — TrimWhitespace, NormalizeWhitespace, PhoneNormalize (E.164 via libphonenumber-js), EmailNormalize (Gmail dot/plus), TypeCoercion
- **Fuzzy matching** — `fuse.js` for name matching in conflict detection
- **Terminal state invariant (TERM-01)** — every record reaches exactly one of: loaded/quarantined/manual_review/skipped
- **Signed audit reports** — SHA-256 fingerprints for source schema, mappings, transforms, strategy
- **135 migration tests** across 20 test files

### Enforcement matrix

| Invariant            |                    DB                     |             Kernel              |      CI       |
| -------------------- | :---------------------------------------: | :-----------------------------: | :-----------: |
| Idempotency (create) | Partial unique index on `idempotency_key` |    K-10 check in `mutate()`     |       —       |
| Legacy dedup         |   Partial unique index on `dedupe_key`    |         Pipeline dedup          |       —       |
| Terminal state       |                     —                     | `withTerminalOutcome()` wrapper | TERM-01 tests |
| Signed reports       |                     —                     |      SHA-256 fingerprints       |       —       |

### What's missing

- **No webhook ingestion endpoint** — batch imports are covered, but no `POST /api/webhooks/{source}` for real-time integrations. (P1)
- **No `api_keys` usage** — table exists but no middleware validates API keys. (P1)
- **Idempotency for external writes needs extension** — migration engine is batch-perfect, but real-time integrations need per-source idempotency keys + replay-safe posting behavior (exactly-once financial effects). This intersects with doc numbering + posting. (P1)

---

## Challenge 10: Serverless Neon Realities — ✅ A (Fully Engineered)

### What you have

- **Transaction pooling aware** — `SET LOCAL` for all session state (timeouts, application_name) — never leaks between pooled connections
- **Short transactions** — governor enforces 5s statement / 20s idle (interactive), 30s/60s (background)
- **`@neondatabase/serverless`** — HTTP-based driver, no persistent connections
- **RW/RO split** — dual Neon compute endpoints, `dbRo` fallback to `DATABASE_URL` in dev
- **Deterministic migrations** — Drizzle-generated + hand-written SQL, journal tracking, applied via `drizzle-kit migrate`
- **Rate limiter** — in-memory sliding window per org (prevents pool exhaustion from single tenant)
- **Job quota** — concurrent slot limiter per org per queue
- **Application name tagging** — `afena:{channel}:org={orgId}` in every transaction (enables Neon dashboard filtering)
- **Branching** — Neon project `dark-band-87285012`, branch workflows documented

### Enforcement matrix

| Invariant              |                DB                |           Kernel            | CI  |
| ---------------------- | :------------------------------: | :-------------------------: | :-: |
| Short transactions     |                —                 | `applyGovernor()` SET LOCAL |  —  |
| No session state leaks | `SET LOCAL` (transaction-scoped) |              —              |  —  |
| Rate limiting          |                —                 |     `checkRateLimit()`      |  —  |
| App name tagging       |                —                 |      `applyGovernor()`      |  —  |

### What's missing

- **No `lock_timeout` default** — `statement_timeout` is set but `lock_timeout` is not. Under contention (e.g., concurrent number sequence allocation), a query could wait for a lock up to the full `statement_timeout`. Add `SET LOCAL lock_timeout = '3s'` to `applyGovernor()`. (**P0** — immediate fix)
- **No connection pool size monitoring** — no documented approach for tracking pool utilization. (P2)
- **No cold start mitigation** — Neon auto-suspend can cause cold starts. (P3)

---

## Deeper Global ERP Gaps (G0.1–G0.21)

These are the gaps that typically blow up later if not decided early at the DB-architecture level:

### G0.1 — Inventory Valuation + Stock Ledger (co-P0 with GL if you touch inventory)

You can't do ERP inventory without a **stock ledger** design:

- Perpetual ledger (append-only movements: receipts, issues, transfers, adjustments)
- Costing method decision (FIFO / weighted average / specific identification)
- Reconciliation & backdating rules (period close intersects here)
- `stock_movements` table: `(org_id, site_id, product_id, movement_type, qty, unit_cost, posted_at)`

**Impact:** Becomes co-P0 with GL if you plan "Products + Warehouse" modules.

> **Why it matters:** affects schema + indexes + audit outcomes; expensive to retrofit.

### G0.2 — "Posting" as a Hard Boundary (Journalization Contract)

You need an explicit DB-level contract for:

- **What events create journal entries** (invoice post, payment receipt, inventory receipt, etc.)
- **Whether journals are derived (generated) or primary** — i.e., is the invoice the source of truth, or is the journal entry?
- **Whether invoice totals are source of truth or journal is source of truth**

Without this, you'll get drift between AR/AP documents and GL. **Decision: journals are derived from source documents. Source doc is truth; journal is the accounting projection.**

> **Why it matters:** drift between sub-ledger docs and GL is the #1 cause of failed financial audits. Locking the journalization contract early prevents retroactive redesign.

### G0.3 — Dimension Strategy (Must Decide Early)

Because it affects journal line schema, indexes, reporting/aggregation, and permission scoping. Even if you start minimal, decide now:

| Approach                                           | Pros                                       | Cons                                | Recommendation                              |
| -------------------------------------------------- | ------------------------------------------ | ----------------------------------- | ------------------------------------------- |
| **Typed columns** (`cost_center_id`, `project_id`) | Fastest queries, FK safety, index-friendly | Schema change to add new dimensions | **Start here**                              |
| Bridge tables                                      | Unlimited dimensions                       | Heavier joins, complex queries      | Add when >3 dimensions needed               |
| Controlled JSONB                                   | Flexible                                   | No FK, index limitations            | Only if canon + validation exists (it does) |

**Decision: typed columns for first 2–3 dimensions (cost_center, project). Bridge tables when >3.**

### G0.4 — Idempotency Semantics for External Writes (Not Just Migration)

Migration engine is batch-perfect. Real-time integrations need:

- Idempotency keys per source system (e.g., `(org_id, source_system, external_id)`)
- Replay-safe posting behavior (exactly-once financial effects)
- This intersects directly with doc numbering (allocate-on-post) + posting (journal creation)

**Decision: extend `audit_logs.idempotency_key` pattern to external writes. Add `external_source` + `external_id` columns to doc entities.**

### G0.5 — Time and Timezone Model (P1/P2 for Multi-Country ERP)

Listed as P3 in v1, but for ERP it's P1/P2 because:

- **Fiscal cutoff dates** — "end of March 31" means different things in UTC+8 vs UTC-5
- **Period close** — must be timezone-aware
- **Tax points** — invoice date vs delivery date vs payment date
- **Audit timelines** — "when did this happen" must be unambiguous

**Decision: all DB timestamps remain `timestamptz` (UTC). Add `org_timezone` to `companies` table. Application layer converts for display, cutoff calculations, and period boundaries.**

### G0.6 — Data Retention + Partition Key Pre-Design (Decide Now, Implement Later)

Partitioning can be deferred, but **pre-design partition keys and retention policies now** so you don't regret schema later:

| Table                      | Partition Key          | Retention             | Trigger   |
| -------------------------- | ---------------------- | --------------------- | --------- |
| `audit_logs`               | `created_at` (monthly) | 7 years (regulatory)  | >10M rows |
| `workflow_executions`      | `created_at` (monthly) | 2 years               | >5M rows  |
| `journal_lines` (future)   | `posted_at` (monthly)  | 7 years (regulatory)  | >10M rows |
| `stock_movements` (future) | `posted_at` (monthly)  | 5 years               | >10M rows |
| `custom_field_values`      | `entity_type` (list)   | Same as parent entity | >20M rows |

**Decision: document partition keys now. Implement when volume thresholds are hit. Never use a column that changes after insert as a partition key.**

### G0.7 — Tax Jurisdiction + Rounding Determinism (Lock Early)

A production global ERP needs deterministic tax outcomes across time, jurisdictions, and audit windows. Even "Tax engine V1" must lock rounding semantics and rate provenance so the same input always produces the same tax.

- **`tax_rules` table:** `(org_id, tax_code, rate, rounding_method, rounding_precision, jurisdiction, effective_from, effective_to)`
- **Deterministic calculation functions:** same input → same tax forever (no implicit behavior changes).
- **Rounding decision must be locked:** per-line vs per-invoice (and rounding direction) becomes an architectural invariant.
- **Immutability invariant:** tax rules are versioned / time-bounded (`effective_from`/`effective_to`) and **never edited retroactively**; changes are new rows. This makes tax outcomes reproducible for any historical document.
- Feeds directly into **Phase B item #9** (Tax engine V1).

> **Why it matters:** tax disputes are audit disputes. Deterministic rounding and rule provenance prevent retroactive "rule drift."

### G0.8 — Payment Allocation + Matching Engine (decide before AR/AP)

- How payments are matched to invoices (auto-match, manual, partial)
- Over/under-payment handling, credit notes, write-offs
- `payment_allocations`: `(org_id, payment_id, invoice_id, allocated_amount, allocation_date)`
- Affects GL journalization (payment → journal must reference matched invoices)

> **Why it matters:** without allocation rules, AR/AP aging reports are meaningless.

### G0.9 — Multi-Entity Consolidation + Intercompany (decide before multi-company goes live)

- Intercompany transactions: how company A invoicing company B creates paired journal entries
- Elimination rules for consolidated reporting
- Transfer pricing implications on journal lines

> **Why it matters:** multi-company without intercompany is a demo, not an ERP.

### G0.10 — Reporting Periods vs Fiscal Periods (often conflated)

- Fiscal periods gate posting; reporting periods gate financial statement generation
- Comparative periods (prior year, budget vs actual) need period-aware aggregation
- Trial balance / balance sheet snapshots at period close

> **Why it matters:** period close without reporting snapshots means you can't reproduce historical financials.

### G0.11 — Credit Notes, Refunds, and Reversals as First-Class Truth

Correction is **new document** (credit note / reversal entry), never edits to posted docs. Every correction must reference a source doc (`source_entity_type/id`) + reason code.

- `credit_notes` / `doc_reversals` with `reverses_entity_type/id`, `reason_code`, `reversal_of_doc_no`
- Journalization creates reversal entries, not updates

> **Why it matters:** editing posted docs fails audit. Causality must be preserved.

### G0.12 — Bank Reconciliation + Statement Import Contract

Statement lines are append-only evidence. Matching is auditable (who matched, when, how confident).

- `bank_statements` (header) + `bank_statement_lines` (append-only)
- `reconciliation_matches`: `(org_id, statement_line_id, payment_id, match_type, match_confidence, matched_by, matched_at)`

> **Why it matters:** payments aren't real until reconciled with bank statements; without this, cash is unreliable.

### G0.13 — Landed Cost + Cost Layering for Inventory (beyond stock ledger)

G0.1 covers the stock ledger, but **valuation accuracy** needs landed cost allocation.

- Allocation basis (qty / value / weight / custom)
- Whether landed cost posts immediately or on bill receipt
- `landed_cost_docs` + `landed_cost_allocations (receipt_line_id, allocated_cost_minor, method)`

> **Why it matters:** without landed cost, COGS is wrong for imports/3PL/shipping-heavy ops.

### G0.14 — Lot/Batch/Serial Traceability + Recall Model

- Batch vs serial vs both; expiry/production dates
- Trace graph must be queryable fast (no "JSON-only")
- `lots` / `serials` + `inventory_trace_links (from_movement_id, to_movement_id, qty)` to build a trace DAG

> **Why it matters:** food, pharma, manufacturing, livestock genetics — traceability is non-negotiable.

### G0.15 — Unit of Measure Conversions + Rounding Rules

You already have integer money; UOM needs the same determinism.

- Conversion direction rounding (ceil/floor/half-up)
- Whether conversions are per-product overrides
- `uom_conversions (from_uom, to_uom, factor, rounding_method, precision, scope: global/product)`

> **Why it matters:** inventory, recipes, manufacturing all depend on consistent conversions or you'll get drift.

### G0.16 — Pricing Engine Contracts (Price Lists, Discounts, Promotions)

- Price resolution order (customer-specific → price list → campaign → default)
- Discount stacking rules
- `price_lists`, `price_list_items`, `discount_rules` with `effective_from/to`, precedence, and deterministic evaluation

> **Why it matters:** sales truth is often "pricing truth." Without a deterministic engine, invoices aren't reproducible.

### G0.17 — Procurement 3-Way Match (PO–GRN–Invoice) + Dispute States

- Tolerance thresholds (qty/price)
- Match status machine (matched / exception / disputed / approved override)
- `match_results (po_line_id, grn_line_id, inv_line_id, status, variance_minor/qty, rule_id)`

> **Why it matters:** AP correctness and fraud prevention. Without 3-way match, you can't control payables.

### G0.18 — Budgeting + Commitments (Encumbrance Accounting Lite)

- Whether budgets are advisory or hard-stop
- Commitment sources (PO, PR, contract)
- `budgets (period, department/project, amount_minor)` + `commitments (source_doc_type/id, committed_amount_minor, status)`

> **Why it matters:** real ERPs control spending before it happens.

### G0.19 — Revenue Recognition / Deferred Revenue (if SaaS, subscriptions, or prepaid)

- Schedule generation at invoice post vs contract creation
- How modifications create new schedules (never edit history)
- `rev_rec_schedules`, `rev_rec_events` (append-only)

> **Why it matters:** rev rec is audit-heavy; you can't "just GL it later."

### G0.20 — Fixed Assets (Capitalization, Depreciation, Disposal)

- Depreciation methods, period close interaction
- Asset creation triggers (AP invoice lines marked capitalizable)
- `assets`, `depreciation_schedules`, `asset_events` (acquire/adjust/dispose)

> **Why it matters:** multi-company ERP without FA is incomplete financially.

### G0.21 — Manufacturing: BOM + Routing + WIP Ledger

- Backflush vs manual consumption
- How WIP posts to GL and stock
- `boms`, `bom_lines`, `work_orders`, `wip_movements` (append-only)

> **Why it matters:** if you touch manufacturing, WIP must be a ledger, not just status fields.

---

## DB Blueprint Decisions — Locked Now

These decisions are locked to prevent drift. They affect schema design for all future financial modules.

### Doc Numbers — Allocate-on-Post

- `doc_no` assigned only when `doc_status` transitions to `submitted`/`active`
- Drafts use `draft_ref` (UUID) for UI tracking — displayed as "DRAFT-{short_uuid}"
- `allocateDocNumber()` called in handler `submit()`, not `create()`
- Atomic: `UPDATE number_sequences SET next_value = next_value + 1 WHERE ... RETURNING next_value`
- `SET LOCAL lock_timeout = '2s'` before allocation

### Fiscal Periods

- `fiscal_periods` table: `(org_id, company_id, period_name, start_date, end_date, status)`
- `status` CHECK: `'open'`, `'closing'`, `'closed'`
- **Guards (DB-enforced):**
  - **Journal line guard:** reject inserts where `posted_at` falls in a closed period.
  - **Source doc posting guard:** prevent `doc_status` transition to `submitted`/`active` when the document's **posting-effective date** (e.g., `posted_at` or `document_date`, as defined per doc type) falls in a closed period (company-timezone-aware). Journalization then inherits correctness from source doc gating.
- "Company timezone" means `companies.org_timezone`; all cutoff comparisons use `posted_at AT TIME ZONE companies.org_timezone` → `date`.
- Period close is a `mutate()` action (audited, authorized, versioned)

### FX Rates

- `fx_rates` table: `(org_id, from_code, to_code, effective_date, rate, source)`
- `UNIQUE(org_id, from_code, to_code, effective_date, source)`
- `source` CHECK: `'manual'`, `'api'`, `'import'`
- Invoice stores: transactional currency + fx used + base amounts (existing `moneyDocumentColumns` pattern)
- Rate lookup: latest rate ≤ document date for the currency pair
- `effective_date` is stored as a **`date`** (not `timestamptz`) and is interpreted in the **company timezone** for rate selection and cutoff behavior. Store API-provided timestamps separately if needed (`captured_at timestamptz`), but the **selection key is always `effective_date` (date)**.

### GL (General Ledger)

- Append-only `journal_entries` + `journal_lines`
- `journal_entries`: `docEntityColumns` + `company_id` (required) + `posted_at` + `source_entity_type` + `source_entity_id`
- `journal_lines`: `entry_id` FK + `account_id` FK + `debit_minor` + `credit_minor` + `currency_code` + `fx_rate` + `base_debit_minor` + `base_credit_minor` + `cost_center_id` + `project_id`
- DB constraint: `CHECK (debit_minor = 0 OR credit_minor = 0)` per line (a line is either debit or credit)
- **DB-enforced balance (must-never-happen):** the database must reject any posted journal entry where total debits ≠ total credits.
  - **Option 1 (recommended):** `post_journal_entry(entry_id)` stored procedure validates balance + open period, then flips status to `posted` atomically. Default to `SECURITY INVOKER`. Use `SECURITY DEFINER` **only** if posting must write across roles while preserving tenant isolation (and document the rationale).
  - **Option 2:** DEFERRABLE constraint trigger on `journal_lines` validates per-entry balance at commit time.
  - **Decision:** adopt **Option 1** for V1 (stored procedure posting boundary); Option 2 is acceptable only if an equivalent "posting boundary" is maintained in kernel.
- Indexes: `(org_id, company_id, posted_at)`, `(org_id, company_id, account_id, posted_at)`
- `REVOKE UPDATE/DELETE FROM authenticated` on `journal_lines` (append-only, corrections via reversal entries)

### Journalization Contract

- Journals are **derived from source documents** (invoice, payment, receipt, etc.)
- Source document is truth; journal is the accounting projection
- Each source document type has a `journalize()` function that creates journal entries
- Journal entries reference source via `(source_entity_type, source_entity_id)`

### Dimensions

- Start with **typed columns**: `cost_center_id` and `project_id` on `journal_lines`
- Both nullable (not all entries need dimensions)
- FK to future `cost_centers` and `projects` tables
- Bridge tables when >3 dimensions are needed

### Partition Keys (Pre-Designed)

- `audit_logs`: partition by `created_at` (monthly range)
- `journal_lines`: partition by `posted_at` (monthly range)
- `stock_movements`: partition by `posted_at` (monthly range)
- `workflow_executions`: partition by `created_at` (monthly range)
- All partition keys are insert-time-only columns (never updated)

---

## Ratification-Grade Execution Sequencing

### Phase A — Unblock "Real Docs" (Invoices/PO/SO) Safely — P0

| #   | Item                                                                                      | Effort | Depends On |
| --- | ----------------------------------------------------------------------------------------- | ------ | ---------- |
| 1   | **`lock_timeout` in governor** — add `SET LOCAL lock_timeout = '3s'` to `applyGovernor()` | Tiny   | —          |
| 2   | **`allocateDocNumber()`** — implement with allocate-on-post default                       | Small  | #1         |
| 3   | **Search MV refresh strategy** — implement kernel hook or cron                            | Small  | —          |
| 4   | **Default role seeding** in `seed_org_defaults()` — or new orgs are bricked               | Small  | —          |
| 5   | **FX rates table** — `fx_rates` + lookup service                                          | Small  | —          |

### Phase B — Make Finance "Truth-Safe" — P0 Once Finance Ships

| #   | Item                                                                          | Effort | Depends On |
| --- | ----------------------------------------------------------------------------- | ------ | ---------- |
| 6   | **Fiscal periods + period close locks** — must exist BEFORE posting starts    | Medium | —          |
| 7   | **COA + Journal entries/lines** — append-only + balanced                      | Large  | #5, #6     |
| 8   | **Posted-record DB triggers** — on invoices + journal tables                  | Small  | #7         |
| 9   | **Tax engine (V1)** — GST/VAT rate per line + tax point date + rounding rules | Medium | #7         |
| 9.5 | **Payment allocation engine + credit note model** (G0.8, G0.11)               | Medium | #7         |

### Phase C — Production Completeness — P1

| #    | Item                                                              | Effort | Depends On |
| ---- | ----------------------------------------------------------------- | ------ | ---------- |
| 10   | **`pg_trgm` + trigram indexes**                                   | Small  | —          |
| 11   | **Webhook ingestion + API key middleware**                        | Medium | —          |
| 12   | **Cross-tenant integration tests** (against live Neon branch)     | Medium | —          |
| 13   | **Admin UI for roles/permissions**                                | Medium | —          |
| 13.5 | **Intercompany transactions + bank reconciliation** (G0.9, G0.12) | Medium | #7         |

### Phase D — Enterprise Scale — P2

| #    | Item                                                                                | Effort | Depends On |
| ---- | ----------------------------------------------------------------------------------- | ------ | ---------- |
| 14   | **Ledger dimensions** (cost_center, project tables + FK)                            | Medium | #7         |
| 15   | **Stock ledger + inventory valuation**                                              | Large  | #6, #7     |
| 16   | **Multi-step approval chains**                                                      | Medium | —          |
| 17   | **Audit log partitioning**                                                          | Medium | —          |
| 18   | **Pre-aggregation projections** (aging, balances)                                   | Medium | #7         |
| 18.5 | **Reporting period snapshots + pricing engine + 3-way match** (G0.10, G0.16, G0.17) | Large  | #7         |

### Phase E — Industry Modules — P3

| #   | Item                                                             | Effort | Depends On |
| --- | ---------------------------------------------------------------- | ------ | ---------- |
| 19  | **Manufacturing: BOM + routing + WIP ledger** (G0.21)            | Large  | #15        |
| 20  | **Fixed assets: capitalization, depreciation, disposal** (G0.20) | Medium | #7         |
| 21  | **Revenue recognition / deferred revenue** (G0.19)               | Medium | #7         |
| 22  | **Budgeting + commitments (encumbrance)** (G0.18)                | Medium | #7         |
| 23  | **Lot/batch/serial traceability** (G0.14)                        | Medium | #15        |
| 24  | **Landed cost + cost layering** (G0.13)                          | Medium | #15        |
| 25  | **UOM conversion rounding rules** (G0.15)                        | Small  | —          |

---

## Conclusion

**Afena's database architecture is genuinely strong for an ERP platform.** The tenant isolation, mutation kernel, audit trail, migration engine, and serverless patterns are production-grade — and provably enforced at the DB level where it matters most.

The main gaps, by priority:

- **P0:** Finance core (GL + fiscal periods + FX rates + doc number allocation)
- **P0:** DB-level posted-record immutability (must become DB trigger for financial tables)
- **P0:** Search MV freshness (correctness-critical, not UX-only)
- **P0:** `lock_timeout` + default role seeding (ops correctness)
- **P1:** Trigram search, webhook ingestion, live RLS integration tests

**Posting is a DB boundary:** docs can't post into closed periods; journals can't post unbalanced.

The architecture is designed for these additions — `erpEntityColumns`, `docEntityColumns`, `moneyDocumentColumns`, the entity generator, and the mutation kernel all anticipate financial modules. The DB blueprint decisions above are locked to prevent drift as these modules are built.

**Key principle: anything that _must never happen_ needs DB-level enforcement. Kernel + CI are defense-in-depth, not primary controls.**
