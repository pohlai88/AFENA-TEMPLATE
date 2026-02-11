# CAN-ARCH-CRUD-SAP v1.0 — Afena Interaction Kernel

Canon architecture specification for Afena's Interaction Kernel (AIK): the deterministic mutation ledger that governs every data interaction across UI, API, CLI, Workflow, and AI — built on the CRUD-SAP pattern.

---

## 0. Document Identity

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Canon ID**      | `CAN-ARCH-CRUD-SAP`                            |
| **Version**       | `1.0`                                          |
| **Status**        | Ratified                                       |
| **Internal Name** | Afena Interaction Kernel (AIK)                 |
| **Public Name**   | CRUD-SAP                                       |
| **Scope**         | All domain mutations across all Afena surfaces |

---

## 1. Executive Summary

Traditional ERP systems are built on CRUD (Create, Read, Update, Delete). Afena extends this to **CRUD-SAP** by adding three pillars that transform a data-entry system into a **Deterministic Mutation Ledger with Human-Governed Intelligence**:

| Pillar | Role | Analogy |
|--------|------|---------||
| **C**reate | Birth of data | Writing a new record |
| **R**ead | Consumption of data | Viewing, listing, detail pages |
| **U**pdate | Mutation of data | Edit, undo, redo, approve, reject, transfer — all are updates |
| **D**elete | Soft removal of data | Never physical; always recoverable |
| **S**earch | Discovery of data | Global search + command palette (⌘K) |
| **A**udit | Accountability of data | Every mutation answers 9W1H+Quant |
| **P**redict | Intelligence over data | Workflow rules, conditional logic, hybrid AI suggestions |

**Key insight:** Update is the most overloaded operation. Every "action" in an ERP (approve, reject, reassign, archive, restore, undo, redo) is semantically an Update with a different `action_type`. This collapses hundreds of API endpoints into a single, auditable mutation pipeline.

### CRUD-SAP Is Not an API Pattern — It Is the Interaction Kernel

Every path into Afena passes through CRUD-SAP. No exceptions:

```
UI         → CRUD-SAP
API        → CRUD-SAP
CLI        → CRUD-SAP
Workflow   → CRUD-SAP
AI         → CRUD-SAP
Import     → CRUD-SAP
```

This gives Afena six systems from one kernel:

1. **ERP** — entity management
2. **Compliance Engine** — immutable audit trail
3. **Workflow Engine** — rule-based automation
4. **AI Suggestion Engine** — human-governed intelligence
5. **Legal Ledger** — 9W1H+Quant accountability
6. **Undo/Redo Time Machine** — version history
7. **Command-Driven UI** — keyboard-first search + actions

---

## 2. System Invariants

These rules are **non-negotiable**. Violation of any invariant is a system bug.

```
INVARIANT-01  No domain mutation may occur outside CRUD-SAP.
              Direct db.update/insert/delete is FORBIDDEN outside packages/crud.
              Enforced by: ESLint rule + code review.

INVARIANT-02  Every mutation produces an audit log entry.
              No opt-out. No skip. withAudit() is mandatory.

INVARIANT-03  No physical deletes in application code.
              Only soft delete (is_deleted = true). Purge is a scheduled system job.

INVARIANT-04  AI may suggest but NEVER mutate.
              Only CRUD-SAP Update with human confirmation may mutate state.
              (Predict Rule-01)

INVARIANT-05  Search index must be derivable from canonical entity state only.
              No UI-only or computed-only fields in search_vector.
              (Search Determinism Rule)

INVARIANT-06  All responses use the canonical envelope contract.
              { ok, data?, error?, meta: { request_id, receipt? } }

INVARIANT-07  Every mutation must pass Policy Evaluation (RBAC/ABAC) BEFORE mutation.
              Policy decision is captured in authority_snapshot.
              No "frontend-only permissions" — UI may hide, but backend MUST enforce.

INVARIANT-08  All server-side logging must use packages/logger (Pino).
              No console.* in application code.
              Enforced by: ESLint no-console: error + no-restricted-syntax + CI ripgrep gate.

INVARIANT-09  All request-scoped logs MUST include request_id, service, component.
              Guaranteed by AsyncLocalStorage context + bound logger.

INVARIANT-10  Audit logs MUST use channel:"audit" and a stable schema:
              org_id, entity_type, entity_id, action_type, actor_id, actor_type, request_id.
              No free-form strings as primary data.

INVARIANT-11  Client bundles MUST NOT import packages/logger or server logger wrappers.
              Client logging is disabled OR routed only through apps/web/src/lib/client-logger.ts (dev-only).

INVARIANT-12  Every domain table MUST have an org_id column (TEXT NOT NULL DEFAULT auth.require_org_id() CHECK (org_id <> '')).
              RLS MUST be ENABLED and FORCED. tenantPolicy() MUST be applied.
              No application code may bypass org_id filtering.
              Enforced by: RLS tenantPolicy() + Drizzle helper + CI schema gate (AST-based).

INVARIANT-13  Any request that reaches domain DB access MUST have an effective org_id.
              If auth.org_id() is NULL, domain queries MUST return zero rows (RLS) and writes MUST fail
              with 'Missing activeOrganizationId in JWT' exception.
              Enforced by: org_id NOT NULL DEFAULT auth.require_org_id() + RLS WITH CHECK + CHECK (org_id <> '').
```

---

## 3. Current State (What Exists)

```
afena-monorepo/
├── apps/web/                    # Next.js 16 + Turbopack
│   ├── app/api/auth/            # Neon Auth (catch-all)
│   ├── app/api/storage/         # R2 presign + metadata
│   ├── src/lib/auth/            # Server + client auth
│   ├── src/lib/neon.ts          # Typed Data API client
│   ├── src/lib/r2.ts            # Cloudflare R2 S3 client
│   └── proxy.ts                 # Request logging + auth middleware
├── packages/database/           # Drizzle ORM + Neon (2 tables: users, r2_files)
├── packages/ui/                 # shadcn/ui + Tailwind Engine (10 components)
├── packages/logger/             # Pino structured logging
├── packages/eslint-config/      # Shared ESLint
├── packages/typescript-config/  # Shared tsconfig
└── tools/afena-cli/             # Monorepo CLI tooling
```

**Stack:** Next.js 16 · Neon Postgres (RLS) · Drizzle ORM · Neon Auth · Cloudflare R2 · Pino · shadcn/ui · Tailwind v4 · Turborepo · pnpm

**What's missing:** No ERP domain tables, no CRUD-SAP kernel, no audit trail, no search infrastructure, no workflow engine, no canon types package.

---

## 4. CRUD-SAP — The Seven Operations

### 4.1 Create (C)

**What:** Insert a new record into any entity table.

**Architecture:**

- Every `create` goes through `packages/crud` → server action (Next.js `"use server"`) or API route
- Server action validates input with **Zod schemas** from `packages/canon`
- Drizzle `db.insert()` with RLS — user can only create records they own
- After insert, `withAudit()` automatically writes a 9W1H+Quant audit log entry (see §4.6)
- Returns canonical envelope: `{ ok: true, data: record, meta: { request_id, entity_version, audit_id } }`

**Schema pattern for every entity:**

```
id            UUID PK (defaultRandom)
user_id       TEXT NOT NULL (auth.user_id()) — RLS owner
...domain fields...
status        TEXT DEFAULT 'draft'
is_deleted    BOOLEAN DEFAULT false
deleted_at    TIMESTAMPTZ NULL
deleted_by    TEXT NULL
created_at    TIMESTAMPTZ DEFAULT now()
updated_at    TIMESTAMPTZ DEFAULT now()
created_by    TEXT NOT NULL — user who created
updated_by    TEXT NOT NULL — user who last mutated
version       INTEGER DEFAULT 1 — optimistic concurrency
search_vector TSVECTOR — auto-populated via trigger
```

**Key decisions:**

- `version` column enables optimistic locking — prevents lost updates in concurrent edits
- `created_by` / `updated_by` are denormalized for fast reads (no join to audit log)
- All entity tables get `crudPolicy` with RLS via `authUid`

---

### 4.2 Read (R)

**What:** Fetch data for display — lists, detail views, dashboards, reports.

**Architecture:**

- **Server Components** (RSC) for initial page loads — zero client JS for data fetching
- **React Query** (`@tanstack/react-query`) for client-side cache, refetch, pagination
- **Drizzle queries** with RLS — user only sees their own data by default
- **Neon Data API** for lightweight client-side reads (typed, no ORM overhead)

**Read patterns:**
| Pattern | Implementation | Use Case |
|---------|---------------|----------|
| **List** | `db.select().from(entity).where(eq(isDeleted, false)).limit(n).offset(o)` | Table views |
| **Detail** | `db.select().from(entity).where(eq(id, params.id))` | Detail/edit pages |
| **Aggregate** | `db.select({ count: count() }).from(entity)` | Dashboard cards |
| **Relational** | Drizzle `with` (relations) | Nested data (order → items) |
| **Real-time** | Neon logical replication or polling | Live dashboards (future) |

**Key decisions:**

- Soft-deleted records are **excluded by default** (`is_deleted = false` in all queries)
- Admin views can opt-in to see deleted records with `includeDeleted: true` flag
- Pagination uses cursor-based for infinite scroll, offset-based for tables

---

### 4.3 Update (U) — The Universal Mutation

**What:** Every state change that isn't a Create or Delete. This is the core breakthrough of CRUD-SAP.

#### Action Families

Actions are grouped into **families** to enable RBAC by family, prevent enum explosion, and simplify audit analytics:

| Family               | Actions                                         | RBAC Scope                   |
| -------------------- | ----------------------------------------------- | ---------------------------- |
| **Field Mutation**   | `edit`, `undo`, `redo`                          | Record owner + editors       |
| **State Transition** | `approve`, `reject`, `submit`, `lock`, `unlock` | Role-based (manager, admin)  |
| **Ownership**        | `reassign`, `transfer`                          | Admin only                   |
| **Lifecycle**        | `archive`, `restore`, `duplicate`, `merge`      | Record owner + admin         |
| **Annotation**       | `comment`, `attach`                             | Record owner + collaborators |
| **System**           | `workflow`, `import`, `auto_fix`                | System/service account only  |

#### Full Action Taxonomy

| Action Type | Family | Description | Example |
|-------------|--------|-------------|---------||
| `edit` | Field Mutation | Field-level change | Change invoice amount |
| `undo` | Field Mutation | Revert to previous version | Undo last edit |
| `redo` | Field Mutation | Re-apply reverted change | Redo after undo |
| `approve` | State Transition | Status transition | Manager approves PO |
| `reject` | State Transition | Status transition | Manager rejects PO |
| `submit` | State Transition | Status transition | User submits for review |
| `lock` | State Transition | Prevent further edits | Lock finalized invoice |
| `unlock` | State Transition | Allow edits again | Unlock for correction |
| `reassign` | Ownership | Ownership transfer | Reassign task to user B |
| `transfer` | Ownership | Bulk ownership move | Transfer all records to new owner |
| `archive` | Lifecycle | Move to archive (see §4.4 Delete vs Archive) | Move to archive |
| `restore` | Lifecycle | Un-archive or un-delete | Restore from archive or trash |
| `duplicate` | Lifecycle | Clone record | Duplicate a template |
| `merge` | Lifecycle | Combine records | Merge duplicate contacts |
| `comment` | Annotation | Add note/annotation | Internal note on record |
| `attach` | Annotation | Link file/document | Attach receipt to expense |
| `workflow` | System | Automated rule action | Workflow sets status |
| `import` | System | Bulk data import | CSV import creates records |

#### Mutation Shape

```typescript
// packages/canon/src/types/update.ts
interface UpdateInput {
  entity_type: EntityType; // "invoice", "purchase_order", "contact"
  entity_id: string; // UUID
  action_type: ActionType; // from taxonomy above
  action_family: ActionFamily; // derived from action_type
  payload: JsonValue; // the actual change data
  expected_version: number; // optimistic locking
  reason?: string; // required for sensitive actions
}
```

- **Single mutation endpoint** per entity: `updateEntity(input: UpdateInput)`
- Server action validates `action_type` + `payload` with discriminated Zod union from `packages/canon`
- **Optimistic locking:** `WHERE version = expected_version` — fails if stale
- **Version history:** Every update increments `version` and writes a snapshot to `entity_versions` table
- **Undo/Redo:** Implemented via version history — undo = restore version N-1, redo = restore version N+1

#### Version History with Fork Awareness

```sql
entity_versions (
  id              UUID PK
  entity_type     TEXT NOT NULL
  entity_id       UUID NOT NULL
  version         INTEGER NOT NULL
  parent_version  INTEGER NULL          -- fork awareness: which version this branched from
  is_fork         BOOLEAN DEFAULT false -- true if this version forked after an undo
  fork_reason     TEXT NULL             -- why the fork occurred
  snapshot        JSONB NOT NULL        -- full record state at this version
  diff            JSONB NULL            -- RFC 6902 JSON Patch (what changed)
  action_type     TEXT NOT NULL
  action_family   TEXT NOT NULL
  actor_id        TEXT NOT NULL
  created_at      TIMESTAMPTZ DEFAULT now()
)
-- Index: (entity_type, entity_id, version) UNIQUE
-- Index: (entity_id, created_at) for timeline queries
```

**Fork rules:**

- Client maintains a **version cursor** per entity — current position in the version chain
- Undo = decrement cursor, apply snapshot[cursor]
- Redo = increment cursor, apply snapshot[cursor]
- New edit after undo = **fork**: `is_fork = true`, `parent_version = cursor`, future versions discarded from cursor
- Fork preserves full history — no silent rewrites. Critical for financial/legal entities.
- Enables "timeline visualization" in UI later.

---

### 4.4 Delete (D) — Soft Delete Only

**What:** Mark a record as deleted. Never physically remove data. (INVARIANT-03)

**Architecture:**

- `is_deleted = true` + `deleted_at = now()` + `deleted_by = user_id`
- All Read queries filter `is_deleted = false` by default
- **Retention policy:** Soft-deleted records are physically purged after configurable period (e.g., 90 days) via scheduled job
- **Cascade behavior:** Soft-deleting a parent does NOT cascade — children remain visible but show "parent deleted" indicator
- **Restore:** Update `is_deleted = false` — this is just an Update with `action_type: 'restore'`, `action_family: 'lifecycle'`

**Schema additions to every entity:**

```
is_deleted    BOOLEAN DEFAULT false
deleted_at    TIMESTAMPTZ NULL
deleted_by    TEXT NULL
```

#### Delete vs Archive — Canonical Semantics

These are **distinct operations** with different lifecycle rules. Do not conflate them:

- **Delete** (`action_type: 'delete'`) = Removed from normal operations. Goes to **Trash**. Subject to **retention/purge policy** (e.g., 90-day auto-purge). Semantically: "this should not exist."
- **Archive** (`action_type: 'archive'`, `action_family: 'lifecycle'`) = Still part of record history. Excluded from **active views** only. **No purge rule ever applies.** Semantically: "this is done, keep it for reference."
- **Restore** (`action_type: 'restore'`) = Reverses either Delete or Archive. Context determines which: restoring from Trash un-deletes; restoring from Archive un-archives.

**Key decisions:**

- No `DELETE` SQL statements in application code — ever (INVARIANT-03)
- Drizzle helper in `packages/crud`: `softDelete(table, id)` → `db.update(table).set({ isDeleted: true, deletedAt: now(), deletedBy: userId })`
- Admin "trash" view shows soft-deleted records with restore/purge options
- Archive view shows archived records — **no purge button**, only restore

---

### 4.5 Search (S) — Search + Command Palette

**What:** Two search surfaces: (1) global full-text search across all entities, (2) command palette (⌘K) for actions + navigation.

**Search Determinism Rule (INVARIANT-05):**

> Search index must be derivable from canonical entity state only. No UI-only or computed-only fields in `search_vector`. This prevents mismatch between search results and actual records.

#### 4.5.1 Full-Text Search

- **Postgres `tsvector`** columns on searchable entities — no external search service needed
- Drizzle migration adds `search_vector tsvector` column + GIN index per entity
- Trigger auto-updates `search_vector` on INSERT/UPDATE from **canonical columns only**
- Search query: `db.select().from(entity).where(sql\`search_vector @@ plainto_tsquery(${query})\`)`
- **Cross-entity search:** A `search_index` materialized view unions searchable fields from all entities with `entity_type` + `entity_id` + `display_text` + `search_vector`

#### 4.5.2 Command Palette (⌘K)

- **cmdk** library (shadcn has a built-in command component)
- Three result categories:
  1. **Actions** — "Create Invoice", "Approve PO #1234" (maps to CRUD-SAP operations)
  2. **Navigation** — "Go to Contacts", "Open Settings" (client-side routing)
  3. **Records** — "Invoice #INV-001", "John Smith" (search results → detail page)
- **Keyboard-first:** Every action has a shortcut registered in the command palette
- **Recent items:** Last 10 accessed records stored in `localStorage` for instant access

**Key decisions:**

- Start with Postgres full-text search (free, no infra) — migrate to Neon's pg_search or external service only if needed
- Command palette is a **UI component** in `packages/ui`, not app-specific
- Search results respect RLS — user only sees records they have access to

---

### 4.6 Audit (A) — 9W1H+Quant Method

**What:** Every mutation (Create, Update, Delete) automatically generates an audit log entry answering all **9W1H+Quant** questions. (INVARIANT-02)

> **Naming:** 9 W-questions + 1 quantitative How = **9W1H+Quant**. Not 10W, not 9W2H. This is the canonical name.

**The 9W1H+Quant Framework Applied:**

| # | Question | Field | Example |
|---|----------|-------|---------||
| 1 | **What?** | `action_type` + `entity_type` | "edit" on "invoice" |
| 2 | **Why?** | `reason` | "Correcting line item price" (optional, prompted for sensitive actions) |
| 3 | **Who?** | `actor_id` + `actor_name` | User who performed the action |
| 4 | **Whose?** | `owner_id` + `entity_id` | Which record, owned by whom |
| 5 | **Which?** | `diff` (JSON Patch) | Which fields changed, from what to what |
| 6 | **Where?** | `ip_address` + `user_agent` + `geo` | Request origin (from proxy headers) |
| 7 | **When?** | `created_at` (server time, authoritative) | Timestamp with timezone — single source of temporal truth |
| 8 | **How?** | `channel` + `method` | "web_ui" / "api" / "bulk_import" / "workflow" |
| 9 | **With What Authority?** | `authority_snapshot` | Role, permissions, delegations, policy version at time of action |
| +Quant | **How many/much?** | `affected_count` + `value_delta` | Number of records affected, monetary delta if applicable |

**Schema:**

```sql
audit_logs (
  id                    UUID PK
  -- What
  action_type           TEXT NOT NULL
  action_family         TEXT NOT NULL
  entity_type           TEXT NOT NULL
  entity_id             UUID NOT NULL
  -- Why
  reason                TEXT NULL
  -- Who
  actor_id              TEXT NOT NULL
  actor_name            TEXT NOT NULL
  -- Whose
  owner_id              TEXT NOT NULL
  -- Which
  diff                  JSONB NULL            -- RFC 6902 JSON Patch
  snapshot_before       JSONB NULL
  snapshot_after        JSONB NULL
  -- Where
  ip_address            INET NULL
  user_agent            TEXT NULL
  geo_country           TEXT NULL
  -- When
  created_at            TIMESTAMPTZ DEFAULT now()
  -- How
  channel               TEXT DEFAULT 'web_ui'
  request_id            TEXT NULL             -- correlates with Pino logger
  -- With What Authority (9th W)
  authority_snapshot    JSONB NULL            -- { role, permissions[], delegations[], policy_version }
  -- How many/much (+Quant)
  affected_count        INTEGER DEFAULT 1
  value_delta           JSONB NULL            -- { currency: 'MYR', amount: 1500.00 }
  -- Batch (for bulk operations)
  batch_id              UUID NULL             -- FK to mutation_batches, groups bulk ops
)
-- PARTITIONED BY RANGE (created_at) — monthly partitions
```

**Architecture:**

- **Automatic:** Audit logging is NOT opt-in. Every mutation through the CRUD-SAP pipeline writes an audit entry. (INVARIANT-02)
- **Middleware pattern:** `withAudit()` wrapper around server actions: evaluates policy (INVARIANT-07), captures before/after state + authority snapshot, returns `MutationReceipt`
- **Immutable:** Audit logs have NO update/delete operations. Insert-only. RLS: read-only for authenticated users.
- **Correlation:** `request_id` links audit entries to Pino structured logs (already in proxy.ts)
- **Partitioned:** Monthly partitions from day one. Index on `(entity_type, entity_id, created_at)`.
- **Cold storage:** Partitions older than 12 months exported to R2 as Parquet, partition dropped from hot DB.

**Implementation pattern:**

```typescript
// packages/crud/src/audit.ts
async function withAudit<T>(
  ctx: AuditContext,
  entityType: string,
  entityId: string,
  actionType: ActionType,
  mutation: () => Promise<T>,
  options?: { reason?: string; batchId?: string },
): Promise<{ result: T; receipt: MutationReceipt }> {
  // INVARIANT-07: Policy Evaluation BEFORE mutation
  const authority = await captureAuthoritySnapshot(ctx.userId);
  await enforcePolicy(authority, entityType, actionType); // throws if denied

  const before = await getSnapshot(entityType, entityId);
  const result = await mutation();
  const after = await getSnapshot(entityType, entityId);
  const diff = generateJsonPatch(before, after);
  const actionFamily = getActionFamily(actionType);

  const [audit] = await db
    .insert(auditLogs)
    .values({
      ...ctx,
      entityType,
      entityId,
      actionType,
      actionFamily,
      diff,
      snapshotBefore: before,
      snapshotAfter: after,
      authoritySnapshot: authority,
      batchId: options?.batchId ?? null,
    })
    .returning({ id: auditLogs.id });

  return {
    result,
    receipt: {
      request_id: ctx.requestId,
      audit_id: audit.id,
      entity_version: after.version,
      action_type: actionType,
      action_family: actionFamily,
      batch_id: options?.batchId,
    },
  };
}
```

---

### 4.7 Predict (P) — Workflow Engine

**What:** Conditional logic that automates decisions, routes approvals, and suggests next actions.

**Predict Guardrail (INVARIANT-04):**

> AI may suggest but NEVER mutate. Only CRUD-SAP Update with human confirmation may mutate state.

**Two modes:**

#### 4.7.1 Rule-Based ("if" workflows)

- **Declarative rules** stored in DB as JSON:

```json
{
  "trigger": {
    "entity": "purchase_order",
    "action": "create",
    "condition": "amount > 10000"
  },
  "actions": [
    { "type": "set_status", "value": "pending_approval" },
    { "type": "assign_to", "role": "finance_manager" },
    { "type": "notify", "channel": "email", "template": "po_approval_required" }
  ]
}
```

- **Workflow engine** evaluates rules after every mutation (via CRUD-SAP pipeline, `action_family: 'system'`)
- Rules are versioned (same version pattern as entity data)
- **Built-in conditions:** field comparisons, role checks, amount thresholds, date ranges
- **Built-in actions:** set_status, assign_to, notify, create_task, schedule_reminder

#### 4.7.2 Hybrid (AI-assisted, future phase)

- **Suggestion engine:** Based on historical patterns, suggest next action
  - "This PO is similar to 15 others that were approved — auto-approve?"
  - "This contact hasn't been contacted in 90 days — create follow-up task?"
- **Anomaly detection:** Flag unusual patterns
  - "This invoice amount is 3x the average for this vendor"
- **Implementation:** Neon + pgvector for embeddings, Workers AI for inference
- **Key constraint:** AI suggestions are always **suggestions** — human confirms via CRUD-SAP Update. Never auto-execute. (INVARIANT-04)

**Architecture:**

```
packages/workflow/          # New package
├── src/
│   ├── engine.ts           # Rule evaluator
│   ├── conditions.ts       # Condition matchers
│   ├── actions.ts          # Action executors (all route through packages/crud)
│   ├── types.ts            # WorkflowRule, Condition, Action types
│   └── index.ts            # Barrel
```

---

## 5. Package Architecture (New + Modified)

### New Packages

| Package | Purpose |
|---------|---------||
| **`packages/canon`** | **Single source of truth for types:** Zod schemas, action enums, action families, entity type registry, version schemas, audit schema, API envelope types. Prevents type drift between crud/workflow/search. |
| `packages/crud` | Core CRUD-SAP kernel: `createEntity`, `readEntity`, `updateEntity`, `softDelete`, `withAudit`. All domain mutations route through here. (INVARIANT-01) |
| `packages/workflow` | Rule engine: trigger evaluation, condition matching, action execution. All actions route back through `packages/crud`. |
| `packages/search` | Postgres FTS helpers, search index builder, cross-entity search. Index derivation from canonical state only. (INVARIANT-05) |

### Modified Packages

| Package | Changes |
|---------|---------||
| `packages/database` | Add `audit_logs` (partitioned), `entity_versions` (fork-aware), `workflow_rules`, `workflow_executions` tables. Base entity schema template with soft-delete + search_vector columns. |
| `packages/ui` | Add command palette (cmdk), data-table, form components, toast patterns |
| `packages/logger` | Add audit correlation (link `request_id` → `audit_log.id`) |

### Dependency Graph

```
packages/canon          ← shared types, zero runtime deps
    ↑
packages/crud           ← depends on canon + database + logger
    ↑
packages/workflow       ← depends on canon + crud (routes mutations back through kernel)
packages/search         ← depends on canon + database
    ↑
apps/web                ← depends on all above
```

---

## 6. Database Schema Plan

### New Tables

```
audit_logs              — 9W1H+Quant immutable audit trail, monthly partitioned (see §4.6)
entity_versions         — Fork-aware version history for undo/redo (see §4.3)
workflow_rules          — Declarative workflow rules, versioned (see §4.7)
workflow_executions     — Log of rule executions + outcomes
mutation_batches        — Groups bulk operations for audit readability (see §6.3)
search_index            — Materialized view for cross-entity search
```

### Partition Strategy (audit_logs)

```sql
CREATE TABLE audit_logs (...) PARTITION BY RANGE (created_at);

-- Auto-create monthly partitions
-- Index: (entity_type, entity_id, created_at)
-- Index: (actor_id, created_at)
-- Index: (request_id)

-- Cold storage: partitions > 12 months → export to R2 as Parquet → DROP PARTITION
```

### 6.3 Bulk Operations Canon

ERP always needs bulk: approve 50 POs, assign 200 items, import 5k contacts. Bulk is still CRUD-SAP — it does not bypass the kernel.

**Rules:**

- Bulk Update is still **Update**, executed N times through `packages/crud`
- Each individual mutation gets its own `audit_logs` entry (INVARIANT-02 is per-record)
- All entries in a bulk operation share a `batch_id` for grouping
- `MutationReceipt.batch_id` links the response to the batch

```sql
mutation_batches (
  id              UUID PK
  request_id      TEXT NOT NULL          -- correlates with Pino logger
  actor_id        TEXT NOT NULL
  action_type     TEXT NOT NULL          -- the bulk action (e.g., 'approve')
  entity_type     TEXT NOT NULL
  total_count     INTEGER NOT NULL       -- how many records in batch
  success_count   INTEGER DEFAULT 0
  failure_count   INTEGER DEFAULT 0
  summary         JSONB NULL             -- { failed_ids: [...], errors: [...] }
  created_at      TIMESTAMPTZ DEFAULT now()
)
-- Index: (actor_id, created_at)
-- Index: (request_id)
```

### Entity Table Template

Every ERP domain table follows this template:

```
[entity] (
  id              UUID PK defaultRandom
  user_id         TEXT NOT NULL (auth.user_id()) — RLS
  ...domain-specific columns...
  status          TEXT DEFAULT 'draft'
  is_deleted      BOOLEAN DEFAULT false
  deleted_at      TIMESTAMPTZ NULL
  deleted_by      TEXT NULL
  created_at      TIMESTAMPTZ DEFAULT now()
  updated_at      TIMESTAMPTZ DEFAULT now()
  created_by      TEXT NOT NULL
  updated_by      TEXT NOT NULL
  version         INTEGER DEFAULT 1
  search_vector   TSVECTOR — auto-populated via trigger from canonical columns only
  -- Indexes: user_id, status, is_deleted, search_vector (GIN), created_at
  -- RLS: crudPolicy(authenticatedRole, authUid(user_id))
)
```

---

## 7. API Design

### Canonical Envelope Contract (INVARIANT-06)

Every response — server action or API route — uses this shape:

```typescript
// packages/canon/src/types/envelope.ts

/** Returned by every mutation — tracks the primary + any secondary effects */
interface MutationReceipt {
  request_id: string;
  audit_id: string;
  entity_version: number;
  action_type: string;
  action_family: string;
  batch_id?: string; // present for bulk operations
  effects?: Array<{
    // secondary mutations triggered by workflows
    entity_type: string;
    entity_id: string;
    audit_id: string;
  }>;
}

/** Canonical response shape for ALL server actions and API routes */
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string; // machine-readable: 'ENTITY_NOT_FOUND', 'VERSION_CONFLICT', etc.
    message: string; // human-readable
  };
  meta: {
    request_id: string; // always present — correlates with Pino logs
    receipt?: MutationReceipt; // present on mutations (C/U/D), absent on reads (R/S)
  };
}
```

This gives: traceability, debugging, frontend determinism, legal audit links, and **workflow effect chains** (when a mutation triggers secondary mutations via Predict).

### Server Actions (Primary)

Every entity exposes the same 7 operations:

```typescript
// app/actions/[entity].ts
'use server'

export async function create[Entity](input): Promise<ApiResponse<Entity>>     // C
export async function get[Entity](id): Promise<ApiResponse<Entity>>           // R
export async function list[Entity]s(filters): Promise<ApiResponse<Entity[]>>  // R
export async function update[Entity](input): Promise<ApiResponse<Entity>>     // U (all action types)
export async function delete[Entity](id, reason?): Promise<ApiResponse<void>> // D (soft)
export async function search[Entity]s(query): Promise<ApiResponse<Entity[]>>  // S
// Audit: automatic via withAudit() — no explicit endpoint
// Predict: workflow engine runs post-mutation — no explicit endpoint
```

### REST API Routes (External Access)

```
POST   /api/entities/[type]              → Create
GET    /api/entities/[type]              → List
GET    /api/entities/[type]/[id]         → Read
PATCH  /api/entities/[type]/[id]         → Update (action_type in body)
DELETE /api/entities/[type]/[id]         → Soft Delete
GET    /api/search?q=...&type=...        → Search
GET    /api/audit/[entity_type]/[id]     → Audit trail for record
```

All REST routes return the same `ApiResponse<T>` envelope.

---

## 8. Implementation Phases

### Phase 1 — Foundation (Current Sprint)

- [ ] Create `packages/canon` with Zod schemas, action enums, action families, `MutationReceipt`, `ApiResponse<T>` envelope types
- [ ] Create `packages/crud` with base abstractions + `withAudit()` (includes INVARIANT-07 policy evaluation)
- [ ] Add `audit_logs` (partitioned, with `batch_id`) + `entity_versions` (fork-aware) + `mutation_batches` tables to `packages/database`
- [ ] Add soft-delete helpers + base entity schema template
- [ ] Add ESLint rule to enforce INVARIANT-01 (no direct db mutations outside packages/crud)
- [ ] Add `command` component to `packages/ui` (shadcn cmdk)

### Phase 2 — First Entity

- [ ] Build one complete entity end-to-end (e.g., `contacts` or `products`)
- [ ] Create, Read (list + detail), Update (edit + undo/redo), Delete (soft)
- [ ] Full audit trail with 9W1H+Quant including authority snapshot
- [ ] Search with Postgres FTS
- [ ] Data table UI with sorting, filtering, pagination
- [ ] Canonical envelope on all responses

### Phase 3 — Search + Command Palette

- [ ] Cross-entity search index (materialized view)
- [ ] ⌘K command palette with actions, navigation, records
- [ ] Recent items + keyboard shortcuts

### Phase 4 — Workflow Engine

- [ ] `packages/workflow` rule engine
- [ ] Workflow rules CRUD UI
- [ ] Status transitions + approval chains
- [ ] Email/notification actions
- [ ] All workflow mutations route through `packages/crud` (INVARIANT-01)

### Phase 5 — Predict (Hybrid AI)

- [ ] pgvector for entity embeddings
- [ ] Suggestion engine (similar records, next action)
- [ ] Anomaly detection (outlier amounts, unusual patterns)
- [ ] All AI outputs are suggestions only — human confirms (INVARIANT-04)

---

## 9. Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------||
| **Interaction Kernel** | All paths route through CRUD-SAP | Single audit surface, no bypass (INVARIANT-01) |
| **Soft delete only** | `is_deleted` flag | Data recovery, audit compliance, referential integrity (INVARIANT-03) |
| **Optimistic locking** | `version` column | Prevents lost updates without pessimistic locks |
| **Fork-aware versioning** | `parent_version` + `is_fork` | Legal chain integrity, no silent rewrites |
| **Audit is automatic** | `withAudit()` wrapper | Cannot be bypassed — compliance by design (INVARIANT-02) |
| **9W1H+Quant (not 8W1H)** | 9 W-questions + quantitative How | Captures authority, context, and magnitude at mutation time — legally defensible |
| **Update is universal** | `action_type` + `action_family` | One pipeline for all mutations — simpler audit, RBAC by family |
| **Canonical envelope** | `{ ok, data, error, meta }` | Traceability, debugging, frontend determinism (INVARIANT-06) |
| **Postgres FTS first** | `tsvector` + GIN | Zero infra cost, deterministic from canonical state (INVARIANT-05) |
| **Server Actions over API routes** | Next.js `"use server"` | Type-safe, no fetch boilerplate, automatic CSRF |
| **JSON Patch for diffs** | RFC 6902 | Standard format, reversible, compact |
| **Workflow rules in DB** | JSON rules in `workflow_rules` table | No code deploy to change business rules |
| **Canon types package** | `packages/canon` | Single source of truth — prevents type drift across packages |
| **Audit partitioning** | Monthly range partitions from day one | Prevents year-2 performance crisis |
| **AI is advisory only** | Suggestions require human confirmation | Avoids AI governance risk (INVARIANT-04) |
| **Policy before mutation** | RBAC/ABAC evaluated server-side before every mutation | No frontend-only permissions (INVARIANT-07) |
| **Bulk is still CRUD-SAP** | `mutation_batches` + per-record audit | Kernel is never bypassed, even at scale |
| **Structured logging** | Pino everywhere, `no-console: error` + CI gate | Correlation, redaction, audit trail bridge (INVARIANT-08) |
| **Request correlation** | AsyncLocalStorage context binding | Guaranteed request_id/service on every log line (INVARIANT-09) |
| **Audit log channel** | `channel:'audit'` child logger, stable schema | Future SIEM routing, no free-form strings (INVARIANT-10) |

---

## 10. Canon Naming

| Term                               | Scope             | Usage                                                  |
| ---------------------------------- | ----------------- | ------------------------------------------------------ |
| **CRUD-SAP**                       | Public / external | Documentation, onboarding, API docs                    |
| **AIK (Afena Interaction Kernel)** | Internal / canon  | Code comments, package names, architecture discussions |
| **9W1H+Quant**                     | Audit framework   | 9 W-questions + quantitative How. Canonical audit name |
| **Action Family**                  | Update taxonomy   | Groups actions for RBAC + analytics                    |
| **Canonical Envelope**             | API contract      | Standard response shape across all surfaces            |
| **MutationReceipt**                | Mutation response | Tracks audit_id, version, batch, and workflow effects  |

Aligns with existing canon language: MACHINA, AXIS, Canon, Truth Engine.

> **CRUD-SAP is not features; it is truth.**
> It defines the only legal ways reality may change inside Afena.
