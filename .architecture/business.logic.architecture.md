# Afena Business Logic Pattern — Engineering Reference

> **Status:** Current as of Feb 13, 2026
> **Package:** `packages/crud` (`afena-crud`)
> **Kernel:** Afena Interaction Kernel (AIK) — CRUD-SAP pattern
> **Canon:** `packages/canon` (`afena-canon`) — types, schemas, enums

---

## 1. Architecture Overview

All domain mutations in Afena flow through a single kernel: `mutate()` in `packages/crud`. This is not optional — ESLint rules enforce that no package outside `packages/crud` may call `db.insert()`, `db.update()`, or `db.delete()` on domain tables (INVARIANT-01).

```
Server Action / API Route / CLI / Workflow / Import
        │
        ▼
    mutate(spec, ctx)          ← single entry point
        │
        ├── Validation          (Zod + namespace + system column strip)
        ├── Lifecycle Guard     (state machine for doc entities)
        ├── Policy Gate         (RBAC v1 + v2)
        ├── Governor            (SET LOCAL timeouts)
        ├── Workflow Before     (can block/enrich)
        ├── Transaction         (handler + audit + version)
        ├── Workflow After      (fire-and-forget)
        └── Metering            (fire-and-forget)
```

---

## 2. Core Abstractions

### 2.1 MutationSpec (input)

Defined in `packages/canon`. Every mutation is described by:

```typescript
interface MutationSpec {
  actionType: ActionType; // '{entity}.{verb}' e.g. 'contacts.create'
  entityRef: {
    type: EntityType; // 'contacts'
    id?: string; // UUID — required for update/delete/restore, optional for create
  };
  input: JsonValue; // the actual change data
  expectedVersion?: number; // required for update/delete/restore (K-04)
  idempotencyKey?: string; // required for create only (K-10)
  reason?: string; // optional — prompted for sensitive actions
  batchId?: string; // present for bulk operations
}
```

### 2.2 MutationContext (caller identity)

```typescript
interface MutationContext {
  requestId: string;
  actor: ActorRef; // { userId, orgId, roles, email, name }
  ip?: string;
  userAgent?: string;
  channel?: string; // 'web_ui' | 'api' | 'cli' | 'workflow'
}
```

### 2.3 ApiResponse (output)

Every mutation returns the canonical envelope:

```typescript
interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: { code: ErrorCode; message: string };
  meta: { requestId: string; receipt?: Receipt };
}
```

### 2.4 Receipt (mutation metadata)

```typescript
interface Receipt {
  requestId: string;
  mutationId: string;
  batchId?: string;
  entityId: string | null; // null on create reject (K-12)
  entityType: string;
  versionBefore: number | null;
  versionAfter: number | null; // null on rejected/error
  status: 'ok' | 'rejected' | 'error';
  auditLogId: string | null;
  errorCode?: ErrorCode; // present on rejected/error receipts
}
```

---

## 3. Entity Handler Pattern

### 3.1 Handler Interface

Every entity registers a handler that implements the `EntityHandler` interface:

```typescript
interface EntityHandler {
  // Required — every entity must support these 4 verbs
  create(tx, input, ctx): Promise<HandlerResult>;
  update(tx, entityId, input, expectedVersion, ctx): Promise<HandlerResult>;
  delete(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
  restore(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;

  // Optional — only for doc entities with docEntityColumns
  submit?(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
  cancel?(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
  amend?(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
  approve?(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
  reject?(tx, entityId, expectedVersion, ctx): Promise<HandlerResult>;
}
```

### 3.2 HandlerResult (internal)

Never exported from `packages/crud` (K-05):

```typescript
interface HandlerResult {
  entityId: string;
  before: Record<string, unknown> | null; // snapshot before mutation (null on create)
  after: Record<string, unknown>; // snapshot after mutation
  versionBefore: number | null; // null on create
  versionAfter: number;
}
```

### 3.3 Handler Registry

```typescript
// packages/crud/src/mutate.ts
const HANDLER_REGISTRY: Record<string, EntityHandler> = {
  contacts: contactsHandler,
  // Future: invoices: invoicesHandler, etc.
};
```

The kernel resolves the handler from `spec.entityRef.type`. Unknown entity types return `VALIDATION_FAILED`.

### 3.4 Registered Handlers

| Entity      | File                    | Verbs                                                            | Column Base        |
| ----------- | ----------------------- | ---------------------------------------------------------------- | ------------------ |
| `contacts`  | `handlers/contacts.ts`  | create, update, delete, restore, submit, cancel, approve, reject | `docEntityColumns` |
| `companies` | `handlers/companies.ts` | create, update, delete, restore                                  | `erpEntityColumns` |

### 3.5 Handler Responsibilities

Each handler method MUST:

1. **Allowlist input fields** — `pick()` only the fields the entity accepts (K-11)
2. **Execute the DB operation** — insert/update within the transaction
3. **Return `HandlerResult`** — with before/after snapshots for audit + versioning

Each handler method MUST NOT:

- Write to `audit_logs` or `entity_versions` (kernel does this)
- Commit or rollback the transaction (kernel manages it)
- Call other handlers (no cross-entity mutations within a handler)
- Import or use `db` directly (receives `tx` from kernel)

---

## 4. Mutation Pipeline (mutate.ts)

The `mutate()` function orchestrates 13 steps in sequence:

### Step 1: Generate mutation ID

```typescript
const mutationId = crypto.randomUUID();
```

### Step 2: Zod validation

Validates `spec` against `MutationSpecSchema` from `packages/canon`.

### Step 3: K-15 namespace check

Ensures `actionType` namespace matches `entityRef.type`:

- `contacts.create` → entityRef.type must be `contacts`

### Step 4: K-11 system column strip

`stripSystemColumns()` removes protected fields from input:

- `id`, `orgId`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`, `isDeleted`, `deletedAt`, `deletedBy`

### Step 5: K-04 expectedVersion enforcement

Required for update/delete/restore/submit/cancel/amend/approve/reject. Not required for create.

### Step 6: K-10 idempotency check

For `*.create` only — checks `audit_logs` for existing `idempotencyKey`.

### Step 7: Resolve handler

Looks up `HANDLER_REGISTRY[entityRef.type]`. Fails fast if unknown.

### Step 8: Resolve target row

For non-create verbs, fetches the existing row from `TABLE_REGISTRY` for lifecycle + policy checks.

### Step 9: Lifecycle guard

`enforceLifecycle(spec, verb, existingRow)` — prevents illegal state transitions on doc entities.

**State machine:**

| Current Status | Allowed Verbs                  | Denied Verbs            |
| -------------- | ------------------------------ | ----------------------- |
| `draft`        | create, update, delete, submit | —                       |
| `submitted`    | approve, reject, cancel, amend | update, delete, submit  |
| `active`       | update, cancel, delete         | submit, approve, reject |
| `cancelled`    | restore                        | all others              |
| `amended`      | — (read-only)                  | all                     |

Non-doc entities (no `doc_status` column) pass through unchanged.

### Step 10: Policy evaluation

**V2 (verb+scope+field RBAC):** `enforcePolicyV2(spec, ctx, verb, existingRow)`

- Resolves actor from DB: `user_roles` → `roles` → `role_permissions` + `user_scopes`
- Evaluates verb permission for entity type
- Checks scope (org, self, company, site, team)
- Checks field rules (deny_write beats allow_write)
- Returns `AuthoritySnapshotV2` for audit trail

> **Note:** V1 role-family RBAC (`enforcePolicy` in `policy.ts`) is retained for
> test coverage and backward compatibility but is **not called in the mutation
> pipeline**. V2 subsumes V1 — verb-level permissions are strictly more granular
> than family-level allow lists.

### Step 11: Workflow before-rules

Evaluated after policy, before the transaction. Can block (return rejection) or enrich input.

### Step 12: Governor + Transaction

```typescript
const result = await db.transaction(async (tx) => {
  await applyGovernor(tx, governorConfig);             // SET LOCAL timeouts
  const handlerResult = await handler[verb](tx, ...args);
  await tx.insert(entityVersions).values({ ... });     // K-03
  await tx.insert(auditLogs).values({ ... });           // K-03
  return { handlerResult, auditRow };
});
```

### Step 13: Post-transaction

- Workflow after-rules (fire-and-forget, errors logged but don't fail)
- Usage metering (fire-and-forget)
- Return `ApiResponse` with `Receipt`

---

## 5. Policy Engine

### 5.1 V1 — Role-Family RBAC (`policy.ts`) — Legacy

Static rules mapping action families to allowed roles. **Not called in the
mutation pipeline** — retained for test coverage and as a reference model.
V2 subsumes this layer.

| Family             | Allowed Roles         |
| ------------------ | --------------------- |
| `field_mutation`   | owner, admin, member  |
| `state_transition` | owner, admin, manager |
| `ownership`        | owner, admin          |
| `lifecycle`        | owner, admin, member  |
| `annotation`       | owner, admin, member  |
| `system`           | system                |

### 5.2 V2 — Verb+Scope+Field RBAC (`policy-engine.ts`) — Active

DB-driven permissions with 3-layer evaluation:

1. **Verb check:** Does any role grant this verb on this entity type?
2. **Scope check:** Does the permission's scope match the actor's access?
   - `org` — any row in the org
   - `self` — only rows where `createdBy = actor.userId`
   - `company` — rows matching actor's company scope assignments
   - `site` — rows matching actor's site scope assignments
   - `team` — rows matching actor's team scope assignments
3. **Field check:** Are any input fields in the `deny_write` list?

**Tables used:**

- `roles` — org-scoped role definitions
- `user_roles` — user → role assignments
- `role_permissions` — verb+scope+fieldRules per entity type per role
- `user_scopes` — user → company/site/team scope assignments

### 5.3 Authority Snapshot

Both policy layers produce an authority snapshot that is stored in `audit_logs.authority_snapshot` (JSONB). This captures the exact policy state at mutation time — legally defensible.

---

## 6. Lifecycle State Machine

### 6.1 Doc Entity Lifecycle

Entities using `docEntityColumns` have a governed lifecycle:

```
                    ┌─── approve ───► active ◄── update ──┐
                    │                   │                   │
  create ──► draft ─┤── submit ──► submitted              │
                │   │                   │                   │
                │   └─── delete ──► (soft-deleted)         │
                │                       │                   │
                │                  reject ──► draft         │
                │                       │                   │
                │                  cancel ──► cancelled     │
                │                                │          │
                │                           restore ──► draft
                │
                └─── amend (from submitted) ──► new draft (amended_from_id set)
                                                  └── original marked 'amended' (read-only)
```

### 6.2 Non-Doc Entities

Entities using `baseEntityColumns` or `erpEntityColumns` (without `docEntityColumns`) have no lifecycle guard — all verbs pass through.

---

## 7. Workflow Integration

### 7.1 Before-Rules (can block/enrich)

Evaluated after policy, before the transaction. Can:

- **Block** the mutation (return rejection)
- **Enrich** the input (add/modify fields)

### 7.2 After-Rules (fire-and-forget)

Evaluated after the transaction commits. Can:

- Trigger side effects (notifications, status changes on related entities)
- Log execution to `workflow_executions` table

**Key constraint:** After-rules cannot fail the mutation. Errors are logged but swallowed.

### 7.3 Rule Storage

Rules are stored in `workflow_rules` table with:

- `timing` — `'before'` or `'after'`
- `entityTypes[]` — which entity types trigger this rule
- `verbs[]` — which verbs trigger this rule
- `conditionJson` — declarative condition tree
- `actionJson` — declarative action list
- `priority` — evaluation order
- `enabled` — toggle without deletion

---

## 8. Advisory Engine Integration

The advisory engine (`packages/advisory`) is a **read-only observer** of domain data. It:

- Runs detectors (EWMA, CUSUM, MAD) on entity metrics
- Runs forecasters (SES, Holt, Holt-Winters) for predictions
- Writes to `advisories` + `advisory_evidence` tables only (INVARIANT-P01)
- Never writes to domain tables
- Evidence is append-only (INVARIANT-P02)

---

## 9. Custom Field Services

### 9.1 Validation (`custom-field-validation.ts`)

| Export                                      | Purpose                                              |
| ------------------------------------------- | ---------------------------------------------------- |
| `loadFieldDefs(orgId, entityType)`          | Load active custom field definitions from DB         |
| `validateCustomData(fieldDefs, customData)` | Validate custom_data JSONB against field definitions |
| `getValueColumn(dataType)`                  | Map data type → typed index column name              |
| `computeSchemaHash(...)`                    | Drift detection hash for field definition changes    |

### 9.2 Sync (`custom-field-sync.ts`)

| Export                                                                      | Purpose                                           |
| --------------------------------------------------------------------------- | ------------------------------------------------- |
| `syncCustomFieldValues(orgId, entityType, entityId, customData, fieldDefs)` | Upsert typed index rows in `custom_field_values`  |
| `processSyncQueue(orgId, limit?)`                                           | Retry failed syncs from `custom_field_sync_queue` |

---

## 10. Governor System

### 10.1 Transaction Governors (`governor.ts`)

Every `db.transaction()` starts with `SET LOCAL`:

| Setting                               | Interactive                   | Background |
| ------------------------------------- | ----------------------------- | ---------- |
| `statement_timeout`                   | 5s                            | 30s        |
| `idle_in_transaction_session_timeout` | 20s                           | 60s        |
| `application_name`                    | `afena:{channel}:org={orgId}` | same       |

### 10.2 Rate Limiter (`rate-limiter.ts`)

In-memory sliding window. Per org, per route group. Exported: `checkRateLimit()`, `getRateLimitConfig()`.

### 10.3 Job Quota (`job-quota.ts`)

In-memory concurrent slot limiter. Per org, per queue. Exported: `acquireJobSlot()`, `releaseJob()`, `getJobQuotaState()`, `getJobQuotaConfig()`.

### 10.4 Usage Metering (`metering.ts`)

Fire-and-forget upserts to `org_usage_daily`. 4 meters: `meterApiRequest`, `meterJobRun`, `meterDbTimeout`, `meterStorageBytes`.

---

## 11. Entity Scaffolding (W1 — Auto-Wiring)

### 11.1 Generator (`entity-new.ts`)

```bash
npx tsx packages/database/src/scripts/entity-new.ts <name> [--company] [--site] [--doc-number] [--doc] [--skip-schema]
```

Generates **17+ files** and performs **11 auto-wiring insertions** via named markers:

**Files created:**

1. `packages/database/src/schema/<name>.ts` — Drizzle table definition (unless `--skip-schema`)
2. `packages/crud/src/handlers/<name>.ts` — EntityHandler implementation
3. `packages/crud/src/__tests__/<name>.smoke.test.ts` — Test stub
4. `packages/search/src/adapters/<name>.ts` — FTS + ILIKE search adapter
5. `apps/web/app/actions/<name>.ts` — Legacy server action file
6. 7 page files (list, detail, new, edit, versions, audit, trash)
7. 7 surface.ts files (capability annotations)
8. Support files: contract, columns, fields, query_server, policy_server, server-actions

**Auto-wiring targets (11 named markers):**

| #   | Target                    | File              | Marker                                                        |
| --- | ------------------------- | ----------------- | ------------------------------------------------------------- |
| 1   | Schema barrel export      | `schema/index.ts` | `@entity-gen:schema-barrel`                                   |
| 2   | ENTITY_TYPES              | `entity.ts`       | `@entity-gen:entity-types`                                    |
| 3   | ACTION_TYPES              | `action.ts`       | `@entity-gen:action-types`                                    |
| 4   | CAPABILITY_CATALOG        | `capability.ts`   | `@entity-gen:capability-catalog`                              |
| 5   | Handler import + registry | `mutate.ts`       | `@entity-gen:handler-import` + `@entity-gen:handler-registry` |
| 6   | Table registry (mutate)   | `mutate.ts`       | `@entity-gen:table-registry-mutate`                           |
| 7   | Read import + registry    | `read.ts`         | `@entity-gen:read-import` + `@entity-gen:table-registry-read` |
| 8   | Handler metadata          | `handler-meta.ts` | `@entity-gen:handler-meta`                                    |
| 9   | Nav items                 | `nav-config.ts`   | `@entity-gen:nav-items`                                       |

### 11.2 Remaining Manual Steps (post-generation)

1. Run migration (if schema was generated)
2. Seed `meta_assets` rows (if needed)
3. Customize generated stubs (allowlist fields, columns, form fields)

**Gate G2:** Zero manual wiring enforced by B1 generator acceptance test (15/15 tests).

### 11.3 Handler Template Shape

Every generated handler follows the same structure as `contacts.ts`:

```typescript
const ALLOWED_CREATE_FIELDS = ['name', 'email', 'phone', ...] as const;
const ALLOWED_UPDATE_FIELDS = ['name', 'email', 'phone', ...] as const;

export const myEntityHandler: EntityHandler = {
  async create(tx, input, ctx) {
    const picked = pick(input, ALLOWED_CREATE_FIELDS);
    const [row] = await tx.insert(myTable).values(picked).returning();
    return { entityId: row.id, before: null, after: row, versionBefore: null, versionAfter: 1 };
  },
  async update(tx, entityId, input, expectedVersion, ctx) {
    const [existing] = await tx.select().from(myTable).where(eq(myTable.id, entityId));
    if (!existing) throw notFound();
    if (existing.version !== expectedVersion) throw versionConflict();
    const picked = pick(input, ALLOWED_UPDATE_FIELDS);
    const [updated] = await tx.update(myTable).set({ ...picked, version: expectedVersion + 1 }).where(eq(myTable.id, entityId)).returning();
    return { entityId, before: existing, after: updated, versionBefore: expectedVersion, versionAfter: expectedVersion + 1 };
  },
  // delete, restore follow same pattern...
};
```

---

## 12. Kernel Invariants

| ID   | Rule                                                                  | Enforcement                                |
| ---- | --------------------------------------------------------------------- | ------------------------------------------ |
| K-01 | `mutate()` is the only way to write domain data                       | ESLint `no-restricted-syntax`              |
| K-02 | Single DB transaction per mutation                                    | `db.transaction()` in mutate.ts            |
| K-03 | Every mutation writes audit_logs + entity_versions                    | Kernel code in transaction                 |
| K-04 | `expectedVersion` required on update/delete/restore                   | Kernel validation                          |
| K-05 | Kernel exports only `mutate`, `readEntity`, `listEntities` + services | `packages/crud/src/index.ts`               |
| K-06 | Namespaced actions `{entity}.{verb}`                                  | Kernel parsing                             |
| K-07 | Deterministic receipt status (ok/rejected/error)                      | Kernel error mapping                       |
| K-08 | `updated_at` set by DB trigger, not app code                          | `public.set_updated_at()`                  |
| K-09 | `entityRef.id` optional on create                                     | Kernel validation                          |
| K-10 | `idempotencyKey` for create only                                      | Kernel + unique partial index              |
| K-11 | System columns stripped from input                                    | `stripSystemColumns()` + handler allowlist |
| K-13 | Diff normalizes snapshots first                                       | `generateDiff()`                           |
| K-14 | Audit logs: actor check on writes                                     | RLS policy                                 |
| K-15 | actionType namespace must match entityRef.type                        | Kernel validation                          |

---

## 13. Test Coverage

| Test File                       | Tests   | Coverage                                              |
| ------------------------------- | ------- | ----------------------------------------------------- |
| `kernel.smoke.test.ts`          | 15      | K-04, K-05, K-06, K-09, K-11, K-13, K-15, error codes |
| `phase-a.test.ts`               | 46      | Custom field validation, schema hash, field types     |
| `governance.test.ts`            | 25      | Governor presets, lifecycle transitions               |
| `metering.test.ts`              | 13      | Fire-and-forget upserts                               |
| `policy.test.ts`                | 11      | V1 role-family RBAC, V2 verb+scope+field RBAC         |
| `job-quota.test.ts`             | 10      | Concurrent slots, enqueue rate                        |
| `rate-limiter.test.ts`          | 8       | Sliding window, route groups                          |
| `companies.smoke.test.ts`       | 5       | Companies CRUD operations                             |
| `action-type-invariant.test.ts` | 4       | G0 gate: HANDLER_REGISTRY ↔ ACTION_TYPES sync         |
| **Total**                       | **137** |                                                       |

---

## 14. Package Exports (`packages/crud/src/index.ts`)

### Core (K-05)

- `mutate` — single mutation entry point
- `readEntity` — single entity read
- `listEntities` — paginated list
- `MutationContext` (type)

### Governors

- `checkRateLimit`, `getRateLimitConfig`, `_resetRateLimitStore`
- `acquireJobSlot`, `releaseJob`, `getJobQuotaState`, `getJobQuotaConfig`, `_resetJobQuotaStore`
- `meterApiRequest`, `meterJobRun`, `meterDbTimeout`, `meterStorageBytes`

### Custom Field Services

- `loadFieldDefs`, `validateCustomData`, `getValueColumn`, `computeSchemaHash`
- `syncCustomFieldValues`, `processSyncQueue`

### Types

- `RateLimitConfig`, `RateLimitResult`
- `JobQuotaConfig`, `JobQuotaResult`, `JobQuotaDenyReason`
- `CustomFieldDef`, `ValidationError`

---

## 15. Dependency Graph

```
packages/canon          ← types, schemas, enums (zero runtime deps)
    ↑
packages/crud           ← kernel + handlers + governors + services
    ↑                      depends on: canon, database, logger
    │
packages/workflow       ← rule engine (evaluateRules before/after)
    │                      depends on: canon, crud, database, logger
    │
packages/advisory       ← detectors, forecasters, writer
    │                      depends on: canon, database, logger
    │
packages/search         ← FTS adapters, registry
    │                      depends on: canon, database
    ↓
apps/web                ← server actions, API routes, UI
                           depends on: all above
```

---

## 16. Future-Proofing

| Feature                         | Status         | Notes                                                                    |
| ------------------------------- | -------------- | ------------------------------------------------------------------------ |
| Additional entity handlers      | **Done**       | `entity-new.ts` generates + auto-wires; proven with contacts + companies |
| ActionType invariant (G0)       | **Done (W2)**  | Build-time test enforces HANDLER_REGISTRY ↔ ACTION_TYPES sync            |
| Auto-wiring in entity generator | **Done (W1)**  | 10 named markers, zero manual wiring, B1 acceptance test                 |
| Generic CRUD page templates     | **Done (W3)**  | 7 pages + 10 support files per entity                                    |
| REST API + OpenAPI              | **Done (W6)**  | Generic route handler factory + auto-generated OpenAPI 3.1               |
| Cross-entity search MV          | **Done (W5)**  | `search_index` MV with FTS + ILIKE fallback                              |
| AsyncLocalStorage context       | **Done (W7)**  | `withAuth()` establishes ALS; `getRequestId()` reads it                  |
| Computed custom fields          | Schema ready   | `custom_fields` can add `is_computed` + `compute_expr`                   |
| Bulk mutation optimization      | Pattern exists | `mutation_batches` table + `batchId` in spec; per-record audit           |
| Audit log partitioning          | Deferred       | Triggered by volume (~10M rows)                                          |
| Hybrid AI suggestions           | Deferred       | pgvector + Workers AI; human confirms via mutate() (INVARIANT-04)        |
