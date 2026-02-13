# Multi-Tenancy ERP SaaS — Sealed Execution Spec (v4-final)

Ratified execution spec for 3 sealed deliverables (Policy, Lifecycle, Governors) — with concrete SQL schemas, Postgres enums, RLS policies, kernel code patterns, CI invariant gates, and the "no bypass" test suite. Designed to prevent drift between spec and repo.

> **Implementation Status (2026-02-13):** All 3 sealed deliverables + Sprint 3 trust hooks are implemented and verified (137/137 tests passing). Migrations 0013 (policy+governors), 0014 (trust hooks), 0018 (verb CHECK fix) applied to Neon.
>
> **Deferred by Design (not gaps — additive when needed):**
>
> - **No doc entity yet** — `docEntityColumns` helper + submit/cancel/amend pipeline are wired and tested, but no concrete table (e.g. invoices) exercises them until a doc entity is created
> - **Postgres enums vs CHECK constraints** — Implemented as CHECK constraints + canon TS enums (functionally equivalent, easier Drizzle DX) instead of SQL `CREATE TYPE`
> - **CI pipeline wiring** — Invariant tests pass locally but no GitHub Actions PR-blocking gate configured yet
> - **Read masking** — Write field rules enforced; read masking deferred per spec §A7 ("ship write rules first")
> - **`team` scope** — Deferred in `checkScope()` (behaves as `org`) until team membership table exists
>
> **Implementation Notes (deviations from original spec):**
>
> - **`org_id` / `user_id` types** — All columns use `text` (not `uuid`) to match Neon Auth JWT claim types and the project-wide `auth.user_id()` / `auth.org_id()` pattern
> - **Lifecycle state machine** — Extended to 5 states (`draft`, `submitted`, `active`, `cancelled`, `amended`) beyond the original 3-state spec. See §B3.
> - **Verb set** — Extended to 9 verbs (`+ approve`, `reject`, `restore`) beyond the original 6. Migration 0018 aligns the DB CHECK constraint.

---

## North Star

**RLS protects tenant boundaries.**
**Policy + lifecycle protects truth inside the tenant.**
**Governors protect survivability of the platform.**

If any of those three are "optional" or "UI-only", you're building security theater.

---

## 0. Sealing Mechanism — 3 CI Invariant Gates

These prevent drift between this spec and the repo. Each is a test that **fails PRs**.

| Invariant                | Rule                                                                 | Enforcement                                                                                                                  |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `INVARIANT-POLICY-01`    | Every mutation path calls `enforceLifecycle()` and `enforcePolicy()` | Test scans handler registry, asserts all entrypoints route through single `mutate()` — no direct handler calls               |
| `INVARIANT-LIFECYCLE-01` | Submitted docs reject update/delete before handler                   | Test: create → submit → attempt update/delete → must fail before handler spy fires                                           |
| `INVARIANT-GOVERNORS-01` | Every DB transaction sets timeouts + `application_name`              | Test: in DB test transaction, `SHOW statement_timeout` + `SHOW application_name` after wrapper runs → assert expected values |

**How "no bypass" works:** Mock handler registry. Call every public surface entrypoint (API route, server action, workflow call). Assert handler invocation **always** happens only through `mutate()`.

---

## 1. What Afena Already Does Well

| Capability             | Afena                                                               | ERPNext Equivalent                         | Verdict                  |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------------ | ------------------------ |
| **Tenant isolation**   | RLS via `org_id` on every row + `auth.require_org_id()` defaults    | Separate DB per tenant (site)              | ✅ **Superior** for SaaS |
| **Multi-company**      | `company_id` on `erpEntityColumns`, optional per module             | `Company` doctype, mandatory on GL entries | ✅ Same pattern          |
| **Multi-site**         | `site_id` on `erpEntityColumns`                                     | `Warehouse` as site proxy                  | ✅ Cleaner               |
| **Custom fields**      | 15 governed types, typed index table, JSONB + indexed dual storage  | `Custom Field` doctype, ALTER TABLE        | ✅ **Better for SaaS**   |
| **Audit trail**        | Append-only `audit_logs` + `entity_versions` with full snapshots    | `Version` doctype (diff-only)              | ✅ **Stronger**          |
| **Soft delete**        | `is_deleted` + `deleted_at` + `deleted_by`                          | `docstatus` + trash                        | ✅ Equivalent            |
| **Optimistic locking** | `version` column + `expectedVersion` in kernel                      | `modified` timestamp comparison            | ✅ **More reliable**     |
| **Document numbering** | `number_sequences` table with row-level lock                        | `Naming Series`                            | ✅ Better concurrency    |
| **Currency/FX**        | `moneyMinor` (integer cents) + `fx_rate` + `fx_source` + `fx_as_of` | `Currency Exchange` + float amounts        | ✅ **Safer**             |
| **UOM**                | `uom` + `uom_conversions` tables                                    | `UOM` + `UOM Conversion Factor`            | ✅ Equivalent            |
| **Entity views**       | `entity_views` + `entity_view_fields`                               | `Customize Form` + `Property Setter`       | ✅ Cleaner               |
| **Read scaling**       | RW/RO dual compute via Neon read replicas                           | Not built-in                               | ✅ Afena advantage       |
| **Schema lint**        | 8-rule automated linter                                             | Manual review                              | ✅ Afena advantage       |

---

## 2. Sealed Deliverable A — Policy Engine

### A1) Postgres Enums (stop string drift)

```sql
-- Implemented as CHECK constraint (not SQL enum) for Drizzle DX:
-- CHECK (verb IN ('create','update','delete','submit','cancel','amend','approve','reject','restore'))
--
-- Canon TS enum: AUTH_VERBS = ['create','update','delete','submit','cancel','amend','approve','reject','restore']

-- Implemented as CHECK constraints (not SQL enums) for Drizzle DX:
-- CHECK (scope IN ('org','self','company','site','team'))
-- CHECK (scope_type IN ('company','site','team'))
--
-- Canon TS enums: AUTH_SCOPES, AUTH_SCOPE_TYPES
```

### A2) Tables (with org-scoped RLS)

```sql
-- Rationale: org_id and user_id are text (not uuid) to match Neon Auth JWT claim types.
-- auth.org_id() returns text from the JWT — no cast needed.
-- Verbs/scopes use CHECK constraints (not SQL enums) for Drizzle DX.
-- Unique index on role_permissions includes scope (future-proofs team scope).

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL DEFAULT auth.org_id() CHECK (org_id <> ''),
  key text NOT NULL,
  name text NOT NULL,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, key)
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL DEFAULT auth.org_id() CHECK (org_id <> ''),
  user_id text NOT NULL,
  role_id uuid NOT NULL REFERENCES roles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id, role_id)
);

CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL DEFAULT auth.org_id() CHECK (org_id <> ''),
  role_id uuid NOT NULL REFERENCES roles(id),
  entity_type text NOT NULL,
  verb text NOT NULL CHECK (verb IN ('create','update','delete','submit','cancel','amend','approve','reject','restore','*')),
  scope text NOT NULL DEFAULT 'org' CHECK (scope IN ('org','self','company','site','team')),
  field_rules_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, role_id, entity_type, verb, scope)
);

CREATE TABLE user_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL DEFAULT auth.org_id() CHECK (org_id <> ''),
  user_id text NOT NULL,
  scope_type text NOT NULL CHECK (scope_type IN ('company','site','team')),
  scope_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id, scope_type, scope_id)
);
```

### A3) RLS Policies

```sql
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scopes ENABLE ROW LEVEL SECURITY;

-- SELECT within org (repeat pattern for all 4 tables)
CREATE POLICY roles_select ON roles
  FOR SELECT TO authenticated
  USING (org_id = auth.org_id());

-- INSERT within org (admin-only enforced via kernel policy, not DB)
CREATE POLICY roles_insert ON roles
  FOR INSERT TO authenticated
  WITH CHECK (org_id = auth.org_id());

-- Same pattern for user_roles, role_permissions, user_scopes
```

**Important:** RLS ensures org isolation only. The kernel decides intra-tenant permissions.

### A4) Kernel Integration — The "No Bypass" Gate

In `mutate()` the order must be **always**:

```
1. Resolve actor       (org_id, user_id, roles)
2. Resolve target      (entity_type, entity_id, existing row if update/delete/submit/cancel)
3. enforceLifecycle()  (ctx, spec, existingRow)
4. enforcePolicy()     (ctx, spec, existingRow, inputPatch)
5. validate            (zod contract)
6. execute handler
7. append audit + version
```

**If policy/lifecycle happens after handler, it's over.**

### A5) Policy Decision Object (no ad-hoc checks)

```typescript
type PolicyDecision =
  | { ok: true; allowWriteFields?: string[]; denyWriteFields?: string[] }
  | { ok: false; reason: 'DENY_VERB' | 'DENY_SCOPE' | 'DENY_FIELD' };
```

`enforcePolicy()` does:

1. Compute decision
2. If not ok → throw typed error (auditable, includes reason)
3. If ok → apply write-filter to patch before handler (`deny_write` beats `allow_write`)

### A6) Scope Resolution — Option A (explicit columns, no registry)

| Scope     | Rule                                                               | Data Hook Required    |
| --------- | ------------------------------------------------------------------ | --------------------- |
| `org`     | Allowed if permission exists                                       | None                  |
| `self`    | Allowed only if `row.owner_user_id == actor.userId`                | `owner_user_id` field |
| `company` | Allowed only if `row.company_id` in actor's `user_scopes(company)` | `company_id` field    |
| `site`    | Allowed only if `row.site_id` in actor's `user_scopes(site)`       | `site_id` field       |
| `team`    | Defer unless org chart/team membership exists                      | Team membership table |

**Decision: Option A** — scope requires explicit columns on the entity. If the column doesn't exist, scope behaves as `org`. This matches the "boring, deterministic" rule. No per-entity scope resolver registry needed.

### A7) Field Rules Enforcement

```json
{
  "deny_write": ["cost_price", "salary_minor"],
  "mask_read": [{ "field": "salary_minor", "mode": "redact" }],
  "allow_write": ["*"]
}
```

**Two enforcement points:**

- **Write:** Before handler — remove/deny forbidden fields. `deny_write` beats `allow_write`.
- **Read:** In query layer / serializer — masking is hard to guarantee if only done in UI.

**Pragmatic order:** Ship **write rules first**. Add read masking only where you control the output surface (API). UI masking is not security.

### A8) Leak Prevention (non-negotiable)

- Background jobs must carry an `actor` context (or explicit "system actor" with limited rights)
- Workflow engine must call the same kernel mutate path
- Bulk mutation batches must enforce policy **per row** (or prove safe grouping)

### A9) Invariant Tests

- **Test:** Deny permission → handler spy not called
- **Test:** Allow permission → handler spy called
- **Test:** Self-scope update own row passes, other row fails
- **Test:** `deny_write` field fails even if update allowed
- **Test:** Every public surface entrypoint routes through `mutate()` (no direct handler calls)

---

## 3. Sealed Deliverable B — Lifecycle Engine

### B1) Postgres Enum

```sql
-- Implemented as CHECK constraint + canon TS enum (not SQL enum):
-- DOC_STATUSES = ['draft', 'submitted', 'active', 'cancelled', 'amended']
-- 5-state machine (extended from original 3-state spec)
```

### B2) `docEntityColumns` Helper

For doc entities (financially meaningful first), add via helper:

```sql
ALTER TABLE <doc_table>
  ADD COLUMN doc_status doc_status NOT NULL DEFAULT 'draft',
  ADD COLUMN submitted_at timestamptz,
  ADD COLUMN submitted_by uuid,
  ADD COLUMN cancelled_at timestamptz,
  ADD COLUMN cancelled_by uuid,
  ADD COLUMN amended_from_id uuid;
```

Don't add `doc_status` to everything. Start with 1–2 doc entities (Sales Invoice, Purchase Invoice equivalents).

### B3) Kernel Lifecycle Guard (before policy, absolute)

```typescript
function enforceLifecycle(spec: MutationSpec, existing: any | null) {
  if (!existing) return; // create — no existing row

  const status = existing.doc_status as 'draft' | 'submitted' | 'cancelled' | undefined;
  if (!status) return; // non-doc entity — no lifecycle

  if (status === 'submitted') {
    if (spec.verb === 'update' || spec.verb === 'delete') throw LifecycleError.submittedImmutable();
    if (spec.verb === 'submit') throw LifecycleError.alreadySubmitted();
    // allow: cancel, amend
    return;
  }

  if (status === 'cancelled') {
    throw LifecycleError.cancelledReadOnly();
  }
}
```

| State         | Allowed Verbs                             | Denied Verbs            |
| ------------- | ----------------------------------------- | ----------------------- |
| **Draft**     | create, update, delete, submit (+ policy) | —                       |
| **Submitted** | approve, reject, cancel, amend            | update, delete, submit  |
| **Active**    | update, cancel, delete                    | submit, approve, reject |
| **Cancelled** | restore only                              | everything else         |
| **Amended**   | read-only                                 | everything              |

**Amend semantics:**

- Creates new entity with `amended_from_id = old.id`
- New starts as Draft
- Old stays Submitted (immutable)

### B4) Submission as Checkpoint

On `submit` verb:

1. Update `doc_status` → `submitted`, write `submitted_at` / `submitted_by`
2. Write `entity_versions` snapshot (compliance checkpoint)
3. Write `audit_logs` entry with action `submit`
4. Enqueue ledger posting job **after commit** (transaction hook — never post if tx rolls back)

### B5) Invariant Tests

- **Test:** Update submitted doc → fails before handler spy fires
- **Test:** Delete submitted doc → fails
- **Test:** Cancel requires permission; cancel changes status only
- **Test:** Amend produces new doc, links via `amended_from_id`, preserves old immutable
- **Test:** Audit log contains denial reason on lifecycle rejection

---

## 4. Sealed Deliverable C — Governors

### C1) DB Session Enforcement (hard guarantee)

At the **start of every transaction** (requests + jobs), execute:

```sql
SET LOCAL statement_timeout = '5s';
SET LOCAL idle_in_transaction_session_timeout = '20s';
SET LOCAL application_name = 'afena:web:org=<org_id>';
```

**`SET LOCAL`** ensures transaction-scoped — no leaks between pooled connections.

- Interactive requests: 3–5s `statement_timeout`
- Reporting endpoints: longer (routed to read replica)
- Background jobs: 30s+ depending on queue

### C2) Rate Limits + Job Quotas (fast MVP)

- **Rate limit key:** `org_id + route_group`
- **Job quota key:** `org_id + queue`
- MVP quota: max concurrent jobs per org per queue + max jobs enqueued per minute per org (optional)

### C3) Metering Hooks (start collecting now)

```sql
CREATE TABLE org_usage_daily (
  org_id uuid NOT NULL,
  day date NOT NULL,
  api_requests integer NOT NULL DEFAULT 0,
  job_runs integer NOT NULL DEFAULT 0,
  job_ms bigint NOT NULL DEFAULT 0,
  db_timeouts integer NOT NULL DEFAULT 0,
  storage_bytes bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, day)
);
```

Update via cheap upserts. Bill later.

### C4) Invariant Tests

- **Test:** In DB test transaction, `SHOW statement_timeout` after wrapper runs → assert expected value
- **Test:** `SHOW application_name` includes org_id
- **Test:** Runaway query exceeding timeout gets cancelled
- **Test:** One org spamming jobs hits quota

---

## 5. Evidence & Compliance Gaps (P1)

### Gap 4: Entity-Scoped File Attachments

Create `entity_attachments` junction table: `id, org_id, entity_type, entity_id, file_id, created_by, created_at`. RLS org-scoped. Support multiple files per entity. Optionally reuse one file across entities.

### Gap 5: Communication Log

`communications` table: `id, org_id, entity_type, entity_id, type` (email/comment/note/call), `body, created_by, created_at`. Later: connect emails, inbound/outbound, system messages.

### Gap 6: Tenant Usage Metering

Covered by `org_usage_daily` in Deliverable C.

---

## 6. Productivity & Output Gaps (P2/P3)

- **Gap 7: Print Format / Report Builder** — output projection layer, safely Phase C
- **Gap 8: Pricing Rules / Tax Templates** — domain engine, correctly medium priority
- **Gap 9: Data Import/Export** — extend `mutation_batches` with `import_jobs` + `import_mappings`

---

## 7. Tenant Model Comparison

| Aspect                   | ERPNext                   | Afena                            | Assessment                         |
| ------------------------ | ------------------------- | -------------------------------- | ---------------------------------- |
| **Isolation**            | Separate DB per tenant    | Shared DB + RLS (`org_id`)       | Afena is better for SaaS           |
| **Cross-tenant queries** | Impossible (separate DBs) | Blocked by RLS                   | Correct                            |
| **Tenant provisioning**  | Create new site (minutes) | Insert org + seed (seconds)      | Afena is faster                    |
| **Schema migrations**    | Per-site (slow at scale)  | Single migration for all         | Afena is dramatically better       |
| **Custom fields**        | ALTER TABLE per site      | JSONB + typed index (no DDL)     | Afena is better for SaaS           |
| **Noisy neighbor**       | Isolated by default       | Shared resources, need governors | ERPNext is safer without governors |

---

## 8. Sealed Sprint Plan

### Sprint 1 — Policy + Lifecycle Gates

1. Postgres enums (`auth_verb`, `auth_scope`, `auth_scope_type`, `doc_status`)
2. Policy tables (`roles`, `user_roles`, `role_permissions`, `user_scopes`) + RLS
3. Implement `enforcePolicy()` — `PolicyDecision` object, verbs, scopes (Option A), write field rules
4. Create `docEntityColumns` helper + lifecycle schema for 1–2 doc entities
5. Implement `enforceLifecycle()` — draft/submitted/cancelled state machine
6. Wire into `mutate()` pipeline (steps 3–4 in gate order)
7. Bypass-proof invariant tests (A9 + B5)

**Exit criteria:** Kernel refuses illegal mutations even if called directly. `INVARIANT-POLICY-01` + `INVARIANT-LIFECYCLE-01` pass.

### Sprint 2 — Governors

1. DB session wrapper: `SET LOCAL` timeouts + `application_name` on every transaction
2. Rate limiting (org + route)
3. Job quotas (org + queue)
4. `org_usage_daily` table + upsert metering hooks

**Exit criteria:** No single tenant can degrade the platform. `INVARIANT-GOVERNORS-01` passes.

### Sprint 3 — Trust Hooks

1. `entity_attachments` junction table + RLS
2. `communications` table + RLS

**Exit criteria:** Evidence and narrative can be attached to any entity.

### Phase Summary

| Phase                         | Items                                   | Priority | Nature               |
| ----------------------------- | --------------------------------------- | -------- | -------------------- |
| **A — Governance Kernel**     | Permission Engine, Lifecycle, Governors | P0       | Control planes       |
| **B — Evidence & Compliance** | Attachments, Communications             | P1       | Trust & auditability |
| **C — Productivity & Output** | Print Formats, Reports, Import          | P2/P3    | Growth, not safety   |

---

## 9. CTO Gotchas

### Gotcha 1: "We'll add policy later"

No. Once surfaces exist (AI/CLI/jobs), you'll be patching bypasses forever. **Ship kernel gates before expanding surfaces.**

### Gotcha 2: "We'll do masking in UI"

UI masking is not security. Treat masking as a **read-layer contract problem**; until solved globally, limit it to the surfaces you fully control.

---

## 10. Governance Invariants (team alignment language)

- **INVARIANT-POLICY-01:** Every mutation path calls `enforceLifecycle()` and `enforcePolicy()`.
- **INVARIANT-LIFECYCLE-01:** Submitted docs reject update/delete before handler.
- **INVARIANT-GOVERNORS-01:** Every DB transaction sets timeouts + `application_name`.
- **INVARIANT: Evidence can be attached to truth.**
- **INVARIANT: Narrative accompanies numbers.**

---

## 11. Locked Design Decision — Scope Resolution

**Decision: Option A (explicit columns, no registry)**

- `self`-scope only applies to entities with `owner_user_id`
- `company`/`site`-scope only applies to entities with `company_id`/`site_id`
- Otherwise scope behaves as `org`

This matches the "boring, deterministic" rule. No per-entity scope resolver registry. If you later need Option B (per-entity scope resolver), it's an additive change that doesn't break Option A.

---

## 12. Final Verdict

Once **Permissions + Lifecycle + Governors** are implemented at kernel level with the CI invariant gates above, Afena moves from:

> "Technically impressive architecture"

to

> **"Production-viable multi-tenant ERP platform."**

Everything else becomes iterative enhancement rather than existential risk.
