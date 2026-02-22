# CRUD Package Architecture

**Layer 3: Application Orchestration** • **The Mutation Kernel**

---

## Table of Contents

- [Overview](#overview)
- [Architecture Role](#architecture-role)
- [Core Principles](#core-principles)
- [Public API](#public-api)
- [Internal Architecture](#internal-architecture)
- [Kernel Invariants](#kernel-invariants)
- [Handler System](#handler-system)
- [Policy & Governance](#policy--governance)
- [Domain Service Integration](#domain-service-integration)
- [Infrastructure Services](#infrastructure-services)
- [Dependencies](#dependencies)
- [Anti-Patterns](#anti-patterns)

---

## Overview

**Definition:** The Application Layer orchestrator that coordinates domain services, enforces policies, and manages entity lifecycles through a single, auditable mutation path.

**Purpose:**

- Provides the **ONLY** entry point for all domain data writes (`mutate()`)
- Orchestrates domain services from Layer 2 (business logic)
- Enforces authorization, rate limiting, and governance policies
- Maintains complete audit trail (audit_logs + entity_versions)
- Manages entity lifecycle state machines
- Publishes events to workflow and search systems

**Critical Rule:** CRUD orchestrates but **NEVER** implements business logic.

---

## Architecture Role

### Layer 3 in the 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Application Orchestration                         │
│  ┌─────────┐  ┌──────────────┐                              │
│  │  crud   │  │ observability│  ← YOU ARE HERE              │
│  └─────────┘  └──────────────┘                              │
│  Orchestrates business flows, enforces policies             │
└─────────────────────────────────────────────────────────────┘
                           ↑ depends on
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Domain Services (116 packages)                    │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐         │
│  │ workflow │ │advisory │ │accounting│ │   crm   │  ...    │
│  └──────────┘ └─────────┘ └──────────┘ └─────────┘         │
└─────────────────────────────────────────────────────────────┘
                           ↑ depends on
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Foundation                                        │
│  ┌────────┐  ┌──────────┐  ┌────────┐                      │
│  │ canon  │  │ database │  │ logger │                      │
│  └────────┘  └──────────┘  └────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rules:**

- ✅ Can import from Layers 0, 1, 2
- ❌ Cannot import from other Layer 3 packages (observability)
- ❌ Cannot implement business logic (delegate to Layer 2)

---

## Core Principles

### 1. Single Write Path (K-01)

**All domain data writes MUST go through `mutate()`.**

```typescript
// ✅ CORRECT
await mutate(spec, ctx);

// ❌ WRONG - Bypasses audit, auth, versioning
await db.insert(invoices).values({ ... });
```

**Why:** Ensures every write is:

- Authorized (policy engine)
- Audited (audit_logs + entity_versions)
- Versioned (optimistic concurrency)
- Governed (rate limits, quotas)
- Traceable (complete mutation ledger)

### 2. Orchestration, Not Implementation

**CRUD coordinates domain services; it does NOT implement business logic.**

```typescript
// ❌ WRONG - Implementing tax calculation in CRUD
const taxMinor = subtotalMinor * 0.0825;

// ✅ CORRECT - Delegating to accounting domain
import { calculateLineTax } from 'afenda-accounting';
const taxMinor = await calculateLineTax(db, orgId, { ... });
```

### 3. Transactional Integrity (K-02)

**Every mutation runs in a single database transaction.**

```typescript
await db.transaction(async (tx) => {
  // 1. Write entity
  const [entity] = await tx.insert(table).values(data).returning();

  // 2. Write audit log
  await tx.insert(auditLogs).values({ ... });

  // 3. Write version snapshot
  await tx.insert(entityVersions).values({ ... });

  // All or nothing - atomic commit
});
```

### 4. Complete Audit Trail (K-03)

**Every mutation ALWAYS writes:**

- `audit_logs` — Who did what, when, why
- `entity_versions` — Full snapshot for point-in-time recovery

### 5. Sparse Handler Pattern

**209 of 211 entities use the generic base handler.**

Only create custom handlers when absolutely necessary:

- Specialized validation (hierarchy checks, duplicates)
- Complex relationships (cascading updates)
- Domain-specific orchestration

---

## Public API (v1.1 — Sealed)

### Core Exports

**CRUD exposes ONLY the Mutation Kernel surface.**

```typescript
// ✅ Mutation Kernel
export { mutate } from './mutate';

// ✅ Query helpers (optional but allowed in Layer 3)
// (Still "truth reads"; projections/search live elsewhere)
export { readEntity, listEntities } from './read';

// ✅ Context builders (needed by callers)
export { buildUserContext, buildSystemContext } from './context';
export type { MutationContext } from './context';

// ✅ Public types (needed to call mutate/read/list)
export type { MutationSpec, MutationReceipt } from './types';
export type { KernelErrorCode } from './errors';
```

### Hard Rule (API-01)

**Everything else is internal.**

No handlers, registries, services, diffing, outbox writers, policy internals, or DB helpers are exported from `packages/crud`.

### What is Explicitly NOT Exported

**NOT exported (by design):**

- Custom field utilities (`custom-field-validation`, `sync`)
- Doc numbering allocators
- Webhook dispatchers / signature verifiers
- Rate limiter / quotas / metering helpers
- Domain service re-exports (accounting, crm, inventory, etc.)
- Any `handlers/*`, `registries/*`, `services/*` modules

### Why (API-02)

**Because exporting these turns CRUD into a God module and causes dependency gravity.**

CRUD must remain "the mutation throat", not a convenience barrel.

### Optional Convenience Layer (Separate Package)

**If you really want "one import" ergonomics, it must live outside the kernel:**

`packages/crud-convenience`

- Re-exports domain services
- Exports infra helper services
- Depends on `packages/crud`
- **Apps may import it**, but core kernel stays pure

```typescript
// Apps can do this if they want convenience:
import { mutate } from 'afenda-crud';
import { calculateLineTax } from 'afenda-crud-convenience';
```

**Kernel stays sealed; convenience stays optional.**

### Migration Path for Existing Code

**Before (v1.0 - deprecated):**

```typescript
import { calculateLineTax, priceLineItem } from 'afenda-crud';
```

**After (v1.1 - correct):**

```typescript
import { calculateLineTax } from 'afenda-accounting';
import { priceLineItem } from 'afenda-crm';
import { mutate } from 'afenda-crud';
```

**Why this matters:**

- ✅ Preserves layer purity (Layer 3 doesn't become god module)
- ✅ Prevents circular dependencies when domains need CRUD helpers
- ✅ Improves domain testability (mock domains, not CRUD)
- ✅ Makes dependency graph explicit and auditable

---

## Internal Architecture (v1.1 — Sealed)

### Architecture Shape: Plan → Commit → Deliver

CRUD is the **Mutation Kernel**. Internally it is structured into three deterministic phases:

1. **Plan Phase (Reject-fast)**
   Builds a deterministic `MutationPlan` (including outbox intents) **without writing**.

2. **Commit Phase (Single Transaction)**
   Applies the plan in **one DB transaction** and writes: entity + audit + version + idempotency + outbox rows.

3. **Deliver Phase (Best-effort)**
   Signals workers, invalidates caches, records best-effort metrics. **No must-not-lose side effects**.

This separation is the main guardrail against "CRUD drift".

---

### Core Data Structures

#### `MutationPlan` (Kernel SSOT)

The plan is the **single source of truth** for what will be committed.

```typescript
type MutationPlan = {
  requestId: string;
  actionType: string;
  entityRef: { type: string; id: string | null };
  verb: 'create' | 'update' | 'delete' | 'restore';

  // Inputs after schema validation + coercion
  sanitizedInput: unknown;

  // For update/delete/restore
  current?: unknown;

  // Concurrency + idempotency
  expectedVersion?: number;
  idempotencyKey?: string;

  // Deterministic intent list (written transactionally)
  outboxIntents: OutboxIntent[];

  // Optional computed metadata for receipt
  diffMode?: 'snapshot';
};
```

#### `OutboxIntent` (Delivery-independent)

Outbox intents are **records of intent**, not delivery.

```typescript
type OutboxIntent =
  | { kind: 'workflow'; event: string; entityType: string; entityId: string; payload: unknown }
  | {
      kind: 'search';
      op: 'upsert' | 'delete';
      entityType: string;
      entityId: string;
      payload?: unknown;
    }
  | { kind: 'webhook'; event: string; urlId: string; payload: unknown }
  | { kind: 'integration'; target: string; event: string; payload: unknown };
```

---

### Mutation Flow (v1.1)

#### Step 1 — `mutate(spec, ctx)`

- Validates spec
- Builds plan (Plan Phase)
- Commits plan (Commit Phase)
- Triggers delivery (Deliver Phase)
- Returns deterministic receipt

```
┌──────────────────────────────────────────────────────────────┐
│ 1. mutate(spec, ctx)                                         │
│    ├─ Validate MutationSpec (Zod)                            │
│    ├─ Normalize + coerce input types                         │
│    ├─ Enforce API invariants (namespace match, verbs)        │
│    ├─ Rate limit check (Governor)                            │
│    └─ Resolve actor + context (requestId, traceId)           │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Resolve Handler (HANDLER_REGISTRY)                        │
│    ├─ Custom handler (rare)                                  │
│    └─ Base handler (default for most entities)               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Pre-Transaction Gate (Reject-fast Zone)                   │
│    ├─ Fetch existing entity (update/delete/restore)          │
│    ├─ Enforce policy (authorization)                         │
│    ├─ Enforce lifecycle (state machine)                      │
│    ├─ Enforce edit window (workflow rules)                   │
│    ├─ Enforce field write policy (immutable/write-once)      │
│    ├─ Compute deterministic plan (no external IO)            │
│    └─ Prepare outbox intents (workflow/search/webhooks/etc.) │
│       (intent objects only — NOT delivery)                   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Single Transaction (K-02)                                 │
│    ├─ Handler.before* (pure validation/coercion)             │
│    ├─ Apply mutation (INSERT/UPDATE/soft-DELETE/restore)     │
│    ├─ Write audit_logs (K-03)                                │
│    ├─ Write entity_versions snapshot (K-03)                  │
│    ├─ Write idempotency record (create-only, if present)     │
│    ├─ Write OUTBOX INTENTS (K-12)                            │
│    │    - workflow_outbox rows                               │
│    │    - search_outbox rows                                 │
│    │    - webhook_outbox rows                                │
│    │    - integration_outbox rows                            │
│    ├─ Handler.after* (DB-only operations allowed)            │
│    └─ COMMIT                                                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Post-Commit (Best-effort Zone)                            │
│    ├─ Signal outbox workers / enqueue poll trigger           │
│    ├─ Invalidate caches (best-effort)                        │
│    ├─ Metering (best-effort; must be retryable)              │
│    └─ Return deterministic receipt                           │
│                                                              │
│  NOTE: Failure here must NOT lose side effects, because      │
│        outbox intents are already committed in step 4.       │
└──────────────────────────────────────────────────────────────┘
```

---

### Phase Vocabulary (Plan → Commit → Deliver)

**Plan Phase** (Steps 1–3):

- Validation + policy enforcement
- Deterministic intent planning
- No external IO, no DB writes (except reads for "load current" and policy data)
- Reject-fast on policy/lifecycle violations

**Commit Phase** (Step 4):

- Single atomic transaction
- All DB writes (entity, audit, version, idempotency, outbox intents)
- No external IO (K-13)
- All-or-nothing commit

**Deliver Phase** (Step 5):

- Best-effort triggers
- Signal workers to process outbox
- Cache invalidation
- Metering (retryable)

**Critical rule:** Side effect _intents_ are committed in Commit Phase; side effect _delivery_ happens in Deliver Phase.

---

### File Structure (v1.1 — Sealed)

```
packages/crud/src/
├── index.ts                       # Public API surface (sealed)
├── mutate.ts                      # Orchestrates Plan → Commit → Deliver
├── read.ts                        # readEntity/listEntities
├── context.ts                     # buildUserContext/buildSystemContext
├── types.ts                       # MutationSpec/MutationReceipt, public types
├── errors.ts                      # KernelErrorCode + mapping helpers
│
├── plan/                          # Plan Phase (reject-fast zone)
│   ├── build-plan.ts              # buildMutationPlan(spec, ctx)
│   ├── validate-spec.ts           # Zod validation + normalization
│   ├── sanitize-input.ts          # strip system fields, allowlist enforcement
│   ├── load-current.ts            # fetch current entity (update/delete/restore)
│   ├── enforce/                   # Pre-transaction gates (pure)
│   │   ├── policy.ts              # enforcePolicy (deny -> rejected)
│   │   ├── lifecycle.ts           # state machine rules
│   │   ├── edit-window.ts         # workflow edit windows
│   │   ├── field-write.ts         # immutable/write-once/server-owned fields
│   │   ├── governor.ts            # rate limits + quotas (deny -> rejected)
│   │   └── namespace.ts           # actionType/entityRef consistency
│   └── outbox/                    # Intent planning (NO delivery)
│       ├── build-intents.ts       # compute OutboxIntent[] deterministically
│       └── intent-types.ts        # OutboxIntent type
│
├── commit/                        # Commit Phase (single transaction)
│   ├── commit-plan.ts             # runTx(tx => applyPlan(plan))
│   ├── apply-entity.ts            # INSERT/UPDATE/soft-delete/restore
│   ├── write-audit.ts             # audit_logs writer
│   ├── write-version.ts           # entity_versions snapshot writer
│   ├── write-idempotency.ts       # create-only idempotency persistence
│   ├── write-outbox.ts            # write outbox rows for intents (K-12)
│   └── compute-diff.ts            # snapshot diff (optional)
│
├── deliver/                       # Deliver Phase (best-effort zone)
│   ├── signal-workers.ts          # notify/poke outbox processors
│   ├── invalidate-cache.ts        # list cache invalidation
│   └── best-effort-metering.ts    # retryable metrics only
│
├── handlers/                      # Entity handlers (thin, orchestration only)
│   ├── base-handler.ts            # generic handler used by most entities
│   ├── companies.ts               # rare custom handler
│   ├── contacts.ts                # rare custom handler
│   └── types.ts                   # handler interfaces
│
├── registries/
│   └── handler-registry.ts        # entityType -> handler resolver
│
├── outbox/                        # Outbox schemas + table writers
│   ├── tables.ts                  # workflow_outbox/search_outbox/webhook_outbox
│   ├── serialize.ts               # stable serialization for payloads
│   └── status.ts                  # pending/sent/failed + retry policy
│
└── util/
    ├── cursor.ts                  # pagination helpers (read side)
    ├── envelope.ts                # ok()/rejected()/error() receipt builders
    └── stable-hash.ts             # deterministic hashing for idempotency
```

---

### What Moved Where (Important)

#### ✅ Services moved under Plan/Commit/Deliver

Your previous `services/` bucket becomes structured responsibilities:

- **validation/sanitization** → `plan/*`
- **audit/version/outbox** → `commit/*`
- **webhook dispatch + search enqueue** → **removed from kernel**, replaced by outbox intent + worker signaling

> Kernel writes intent; workers deliver.

#### ✅ `workflow-outbox` and `search-outbox` are no longer "services"

They are a **first-class invariant** (`commit/write-outbox.ts`) and **tables** (`outbox/tables.ts`).

---

### Sealed Rules for Code Review

#### SR-01: No External IO in `commit/*`

Anything in `commit/` must be DB-only and deterministic.

#### SR-02: No Writes in `plan/*`

Anything in `plan/` is reject-fast and must not write to DB (except reads for "load current" and policy data).

#### SR-03: `deliver/*` can fail safely

Deliver phase failures must not lose side effects because outbox intents are already committed.

---

### Where Do "Custom Fields", "Doc Numbering", and "Webhooks" Go Now?

#### Custom fields

- **Validation** belongs in `plan/enforce/field-write.ts` or `plan/sanitize-input.ts`
- **Persistence** belongs in `commit/apply-entity.ts` (truth table write) and/or separate join writes in commit

#### Doc numbering

- **Allocate number deterministically in Plan Phase** _only if safe_
  **OR** allocate in Commit Phase via DB sequence/locking (preferred for strict uniqueness)
- Result becomes part of `sanitizedInput` and thus part of the plan

#### Webhooks

- Kernel only writes `webhook_outbox` intents
- Webhook delivery is performed by a worker outside CRUD

---

### Internal Architecture Summary (v1.1)

- CRUD is a **Mutation Kernel**
- Plan builds `MutationPlan` + `OutboxIntent[]`
- Commit applies plan in one transaction + writes outbox rows
- Deliver signals workers and invalidates caches best-effort
- Kernel is sealed by structure, not only by documentation

---

## Kernel Invariants (v1.1 — Sealed)

### K-01: Single Write Path

**All domain truth writes MUST go through `mutate()`.**

```typescript
// ✅ CORRECT
await mutate({ actionType: 'invoices.create', ... }, ctx);

// ❌ FORBIDDEN
await db.insert(invoices).values({ ... });
```

**Enforcement:**

- ESLint rule `INVARIANT-01` prevents direct DB writes
- CI grep gate checks for violations

**Exception:** Migration tooling only.

### K-02: Single Atomic Transaction

**Every `mutate()` executes in exactly one DB transaction, which includes:**

1. Entity write
2. Audit write
3. Version snapshot
4. Outbox intent write (if any)

**No partial commits.**

```typescript
await db.transaction(async (tx) => {
  // All writes here are atomic
});
```

### K-03: Always Audit + Version

**Every mutation writes both:**

- `audit_logs` (who/what/why/when)
- `entity_versions` (snapshot for PIT recovery)

**No exceptions.** System context is still audited.

### K-04: Optimistic Concurrency

**`expectedVersion` is required for:**

- `*.update`
- `*.delete`
- `*.restore`

**If mismatch → reject with stable code `EXPECTED_VERSION_MISMATCH`.**

```typescript
await mutate(
  {
    actionType: 'invoices.update',
    entityRef: { type: 'invoices', id: '123' },
    input: { status: 'approved', expectedVersion: 5 },
  },
  ctx,
);
```

### K-05: Minimal Export Surface

**`packages/crud` exports ONLY:**

- `mutate`
- `readEntity`
- `listEntities`
- `context builders`
- `types + error codes`

**Everything else must be internal or moved to a separate package.**

See API-01 and API-02 rules in Public API section.

### K-06: Namespaced Action Types

**Action format:**

```
{entity}.{verb}
```

**Examples:**

- `invoices.create`
- `contacts.update`

**Verb is always the last segment after the final dot.**

### K-07: Namespace Match

**`actionType` namespace MUST match `entityRef.type`.**

```typescript
// ✅ CORRECT
{ actionType: 'invoices.create', entityRef: { type: 'invoices' } }

// ❌ FORBIDDEN
{ actionType: 'contacts.create', entityRef: { type: 'invoices' } }
```

### K-08: Deterministic Receipts

**Receipt `status` is deterministic:**

- `ok` — committed
- `rejected` — pre-transaction denial (policy/validation/governor/lifecycle)
- `error` — transaction failure or post-commit failure

**No mixed states.**

### K-09: Input Sanitization (Two-layer)

**Two-layer defense:**

1. **Handler allowlist** (entity-specific allowed fields)
2. **Kernel backstop** strips system columns:
   - `id`, `createdAt`, `updatedAt`, `deletedAt`, `version`, `orgId`

### K-10: Idempotency (Create-only, Stored & Replayable)

**`idempotencyKey` is supported for `*.create` only.**

**Storage:** table `mutation_requests` (or `idempotency_keys`) with unique key:

```sql
PRIMARY KEY (org_id, action_type, idempotency_key)
```

**Replay semantics:**

- Same payload hash → return saved receipt
- Different payload hash → `IDEMPOTENCY_KEY_REUSE_CONFLICT`

**This makes retries safe.**

### K-11: Stable Error Codes

**All non-OK outcomes must carry a stable kernel error code:**

```typescript
type KernelErrorCode =
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'JOB_QUOTA_EXCEEDED'
  | 'VALIDATION_FAILED'
  | 'LIFECYCLE_DENIED'
  | 'EDIT_WINDOW_EXPIRED'
  | 'EXPECTED_VERSION_MISMATCH'
  | 'UNIQUE_CONSTRAINT'
  | 'FK_CONSTRAINT'
  | 'IDEMPOTENCY_KEY_REUSE_CONFLICT'
  | 'OUTBOX_WRITE_FAILED'
  | 'CLOSED_FISCAL_PERIOD'
  | 'POSTED_DOCUMENT_IMMUTABLE'
  | 'INTERNAL';
```

**No raw thrown errors escape to the caller without being mapped.**

### K-12: Transactional Outbox (Sealed)

**All must-not-lose side effects MUST be represented as outbox intents written inside the same database transaction as the mutation. External delivery is performed by workers after commit.**

**Pattern:**

```typescript
// Pre-transaction: prepare intents (Plan Phase)
const intents: OutboxIntent[] = [
  { kind: 'workflow', event: 'invoice.created', entityType: 'invoices', entityId, payload: { ... } },
  { kind: 'search', op: 'upsert', entityType: 'invoices', entityId, payload: snapshot },
];

// Transaction: write intents atomically (Commit Phase)
await db.transaction(async (tx) => {
  // 1. Write entity
  const [entity] = await tx.insert(table).values(data).returning();

  // 2. Write audit + version
  await tx.insert(auditLogs).values({ ... });
  await tx.insert(entityVersions).values({ ... });

  // 3. Write outbox intents (CRITICAL - K-12)
  for (const intent of intents) {
    if (intent.kind === 'workflow') {
      await tx.insert(workflowOutbox).values({ ... });
    } else if (intent.kind === 'search') {
      await tx.insert(searchOutbox).values({ ... });
    }
    // ... other intent types
  }

  // COMMIT - all or nothing
});

// Post-commit: signal workers (Deliver Phase - best-effort)
signalOutboxWorkers();
```

**Why:** Prevents "entity saved but event lost" and "event sent but entity rolled back".

### K-13: No External IO in Transaction (Sealed)

**It is forbidden to execute external IO inside `db.transaction(...)`. Only database writes and deterministic computation are allowed.**

**Forbidden operations:**

- ❌ HTTP calls (fetch, axios, webhooks)
- ❌ Queue publishes (SQS, Kafka, RabbitMQ)
- ❌ Redis pub/sub
- ❌ Search engine writes (Elasticsearch, Algolia)
- ❌ External service calls (Stripe, SendGrid, Twilio)
- ❌ File system writes (except temp files for transaction scope)

**Allowed operations:**

- ✅ Database writes (INSERT, UPDATE, DELETE)
- ✅ Database reads (SELECT)
- ✅ Deterministic computation (math, string ops, JSON serialization)
- ✅ Outbox intent writes (transactional)

**Enforcement:** ESLint rule + CI gate (see CI Gates section).

### K-14: Handler Purity

**Handlers may:**

- ✅ Validate/coerce/normalize input
- ✅ Call **Layer 2 domain services**
- ✅ Decide which outbox intents to write

**Handlers may NOT:**

- ❌ Embed domain rules that belong in Layer 2
- ❌ Perform external IO
- ❌ Bypass kernel auditing/versioning

### K-15: Field Write Policy (ERP-grade safety)

**Updates must be checked against an entity write contract:**

- **Immutable fields** (never writable)
- **Write-once fields** (null → value only)
- **Server-owned fields** (only set by kernel/handler)

**Source of truth should be Canon entity contracts (generated rules preferred).**

```typescript
// From Canon entity contract
interface EntityContract {
  writeRules: {
    immutable: string[]; // ['docNumber', 'fiscalYear']
    writeOnce: string[]; // ['postedAt', 'approvedBy']
    serverOwned: string[]; // ['status', 'postingStatus', 'version']
  };
}
```

---

## Receipt Schema (v1.1 — Specification)

**Canonical mutation receipt type:**

```typescript
type MutationReceipt =
  | {
      status: 'ok';
      requestId: string;
      actionType: string;
      entityRef: { type: string; id: string };
      version: number;
      diff?: unknown;
    }
  | {
      status: 'rejected';
      requestId: string;
      actionType: string;
      entityRef: { type: string; id: string | null };
      version: null;
      code: KernelErrorCode;
      reason: string;
      details?: unknown;
    }
  | {
      status: 'error';
      requestId: string;
      actionType: string;
      entityRef: { type: string; id: string | null };
      version: null;
      code: KernelErrorCode;
      reason: string;
      retryable: boolean;
      details?: unknown;
    };
```

**Key properties:**

- **Discriminated union** on `status` field
- **`ok` receipts** have non-null `entityId` and `version`
- **`rejected` receipts** have null `version`, nullable `entityId` (null on create rejection)
- **`error` receipts** include `retryable` boolean for client retry logic
- **All non-ok receipts** include stable `code` from `KernelErrorCode` enum

---

## Outbox Intent Model (v1.1)

**To make transactional outbox implementable, define a shared intent shape:**

```typescript
type OutboxIntent =
  | {
      kind: 'workflow';
      event: string;
      entityType: string;
      entityId: string;
      payload: unknown;
    }
  | {
      kind: 'search';
      op: 'upsert' | 'delete';
      entityType: string;
      entityId: string;
      payload?: unknown;
    }
  | {
      kind: 'webhook';
      event: string;
      urlId: string;
      payload: unknown;
    }
  | {
      kind: 'integration';
      target: string;
      event: string;
      payload: unknown;
    };
```

**Usage pattern:**

1. **Pre-transaction (Plan Phase):** Handler prepares a list of `OutboxIntent[]` based on the mutation
2. **Transaction (Commit Phase):** Kernel writes intents to outbox tables atomically with entity mutation
3. **Post-commit (Deliver Phase):** Workers poll outbox tables and deliver side effects

**Example:**

```typescript
// In handler.beforeCreate()
const intents: OutboxIntent[] = [];

// Add workflow intent
if (input.status === 'submitted') {
  intents.push({
    kind: 'workflow',
    event: 'invoice.submitted',
    entityType: 'invoices',
    entityId: result.id,
    payload: { amount: input.totalMinor, customerId: input.customerId },
  });
}

// Add search intent
intents.push({
  kind: 'search',
  op: 'upsert',
  entityType: 'invoices',
  entityId: result.id,
  payload: { docNumber: input.docNumber, customerName: input.customerName },
});

// Return intents to kernel
return { ...input, _outboxIntents: intents };
```

**Outbox tables:**

- `workflow_outbox` — Workflow rule evaluation events
- `search_outbox` — Full-text search index updates
- `webhook_outbox` — External webhook deliveries
- `integration_outbox` — Third-party integration events

**Worker pattern:**

- Poll outbox tables for unprocessed rows
- Process and deliver side effects
- Mark rows as processed or failed
- Retry failed deliveries with exponential backoff

---

## Handler System (v1.1 — Sealed)

### Purpose

Handlers are **entity adapters** that allow CRUD to apply a consistent mutation kernel across hundreds of entities while supporting _rare_ entity-specific orchestration.

**Handlers do not define business rules.**
They may coordinate Layer 2 services, but all domain decisions live in Layer 2.

---

### Handler Classification

#### 1) Base Handler (Default)

**Used by most entities.**
Implements the standard mutation flow by delegating to:

- **Plan Phase gates** (policy/lifecycle/edit-window/field-write/governor)
- **Commit Phase writers** (entity/audit/version/idempotency/outbox)

**File:** `src/handlers/base-handler.ts`

#### 2) Custom Handlers (Rare)

Only used when an entity requires:

- Cross-aggregate orchestration
- Deep relationship validation not expressible in contracts
- Specialized planning of outbox intents

Custom handlers must remain **thin** and deterministic.

**Files:** `src/handlers/companies.ts`, `src/handlers/contacts.ts`, etc.

---

### Handler Responsibilities by Phase

The fastest way to prevent "CRUD drift" is to define what handlers may do in each phase.

#### Plan Phase Responsibilities (Reject-fast)

Handlers may participate in planning through optional hooks:

**Allowed in Plan hooks ✅**

- Validate and normalize input beyond schema
- Load additional DB data needed for deterministic decision-making
- Call Layer 2 domain services that are **pure** (no external IO)
- Compute derived fields that are deterministic (e.g., normalized names, computed totals only if delegated to domain)
- Produce outbox intents (workflow/search/webhook/integration) **as intent objects**

**Forbidden in Plan hooks ❌**

- Any DB writes
- Any external IO (HTTP, queues, search engines, Redis pub/sub)
- Embedding domain rules that belong in Layer 2

> Plan hooks build a _plan_, not reality.

#### Commit Phase Responsibilities (Single Transaction)

Handlers may participate in commit through DB-only hooks.

**Allowed in Commit hooks ✅**

- Final DB-only constraint checks (e.g., "no cycles" using DB reads)
- Write related truth rows within the same transaction (join tables, shadow tables)
- Attach additional audit metadata (tags, reason codes)
- Add additional outbox rows (by providing extra intents already computed)

**Forbidden in Commit hooks ❌**

- External IO
- Queue publishing
- Webhook sending
- Cache invalidation
- Calling Redis networked operations (unless it is DB-backed, which it isn't)

> Commit must stay **pure DB**.

#### Deliver Phase Responsibilities (Best-effort)

Handlers should _not_ implement Deliver hooks unless absolutely necessary.

**Allowed in Deliver hooks ✅**

- Best-effort cache invalidation requests
- Best-effort signals (poke workers)
- Best-effort metrics

**Forbidden in Deliver hooks ❌**

- Anything must-not-lose
- Anything that changes truth tables

> If it must not be lost, it belongs in outbox intents written in Commit.

---

### Handler Interfaces (v1.1)

Use explicit phase hooks so reviewers can instantly see which zone the code runs in.

```typescript
export interface EntityHandler {
  // Identity
  entityType: string;

  // Plan hooks (reject-fast)
  planCreate?: (ctx: MutationContext, input: unknown) => Promise<PlannedCreate>;
  planUpdate?: (ctx: MutationContext, current: unknown, input: unknown) => Promise<PlannedUpdate>;
  planDelete?: (ctx: MutationContext, current: unknown) => Promise<PlannedDelete>;
  planRestore?: (ctx: MutationContext, current: unknown) => Promise<PlannedRestore>;

  // Commit hooks (DB-only)
  commitAfterEntityWrite?: (tx: any, plan: MutationPlan, written: any) => Promise<void>;

  // Optional field allowlist override (rare)
  pickWritableFields?: (verb: string, input: unknown) => unknown;
}

export type PlannedCreate = {
  sanitizedInput: unknown;
  outboxIntents?: OutboxIntent[];
};

export type PlannedUpdate = {
  sanitizedInput: unknown;
  outboxIntents?: OutboxIntent[];
};

export type PlannedDelete = {
  outboxIntents?: OutboxIntent[];
};

export type PlannedRestore = {
  outboxIntents?: OutboxIntent[];
};
```

**Key:** Planning returns `sanitizedInput` + optional `outboxIntents`.

---

### Base Handler (v1.1)

The base handler is a thin adapter that:

- Delegates core enforcement to `plan/enforce/*`
- Delegates DB writes to `commit/*`

**Base Handler guarantees:**

- Schema validation via Canon
- Field allowlist and sanitization
- Lifecycle/edit-window/policy/governor checks
- Outbox intents are written transactionally
- Receipt is deterministic

**Base Handler does NOT do:**

- Implement business logic
- Perform external IO
- Own cross-domain rules

---

### Custom Handlers (v1.1)

#### When a Custom Handler is Allowed

A custom handler is allowed **only** if it meets at least one of these:

1. **Cross-entity constraints not expressible in FK/unique**
   - Cycle detection
   - Depth constraints
   - Temporal constraints requiring special queries

2. **Cross-aggregate orchestration**
   - Coordinating multiple Layer 2 services in a deterministic plan
   - Generating additional truth rows across related tables in one transaction

3. **Specialized outbox intent planning**
   - Entity requires non-standard workflow/search/webhook intent payload

4. **Field-level exceptions**
   - Entity requires a unique writable-field strategy beyond Canon contract defaults

If none apply, use the base handler.

#### Custom Handler Justification Checklist (Required)

Every custom handler must include, at top of file:

```typescript
/**
 * CUSTOM HANDLER JUSTIFICATION
 * - Why base handler is insufficient:
 * - What invariant or constraint requires custom logic:
 * - What Layer 2 services are called (if any):
 * - What outbox intents are produced:
 * - Why this does NOT belong in Layer 2:
 */
```

This prevents "handler creep".

---

### Handler Purity Rules (Sealed)

#### H-01: No domain rules in handlers

Handlers may call domain services, but cannot embed domain logic.

✅ `await accounting.calculateLineTax(...)`
❌ `const taxMinor = subtotalMinor * 0.0825`

#### H-02: No external IO in handlers

All external delivery goes through outbox + workers.

✅ Write `webhook_outbox` row
❌ `fetch("https://example.com/webhook")`

#### H-03: All must-not-lose side effects become outbox intents

If it must not be lost, it must be part of `outboxIntents` and written in Commit.

#### H-04: Keep handlers thin

A handler that exceeds ~200–300 lines is a smell.
Move logic to:

- Layer 2 domain service (if business logic)
- `plan/enforce/*` (if kernel gate)
- `commit/*` (if DB writer)
- Outbox worker (if delivery)

---

### Example: Good Custom Handler Pattern

```typescript
// ✅ Good: deterministic planning + domain delegation + outbox intent
import { resolvePrice } from 'afenda-crm';

export const ProductsHandler: EntityHandler = {
  entityType: 'products',

  async planCreate(ctx, input) {
    const sanitized = /* validate/coerce */;
    const price = await resolvePrice(ctx.db, ctx.orgId, sanitized);

    return {
      sanitizedInput: { ...sanitized, resolvedPrice: price },
      outboxIntents: [
        { kind: 'search', op: 'upsert', entityType: 'products', entityId: '$ENTITY_ID', payload: {} },
      ],
    };
  },
};
```

**Note:** When `entityId` is not known yet (create mutations), use `$ENTITY_ID` placeholder. Kernel replaces it after entity write when writing outbox rows.

---

### Important: Where "entityId" is Resolved for Outbox Intents

For create mutations:

- Plan phase may not know the `entityId`
- Commit phase writes entity, receives id, then writes outbox rows with the resolved id

This is why **outbox intents are best represented as templates** during planning:

```typescript
{ kind: 'search', op: 'upsert', entityType: 'products', entityId: '$ENTITY_ID', payload: ... }
```

Kernel replaces `$ENTITY_ID` after entity write.

---

## Dependencies (v1.1 — Sealed)

### Dependency Rules (Layering)

CRUD is **Layer 3: Application Orchestration (Mutation Kernel)**.

**Allowed imports ✅**

- Layer 0 / shared utilities (pure)
- Layer 1 foundation: `canon`, `database`, `logger`
- Layer 2 domain services: `accounting`, `crm`, `inventory`, `workflow`, etc.

**Forbidden imports ❌**

- Any other Layer 3 package (e.g., `observability`)
- Any app layer modules (Next.js routes, UI, etc.)

**Sealed rule (DEP-01):**
CRUD must never depend on peers in Layer 3. Peers instrument CRUD externally.

---

### Workspace Dependencies (Kernel Only)

`packages/crud/package.json` should include **only what the kernel needs**.

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*",

    "afenda-workflow": "workspace:*",

    "drizzle-orm": "catalog:",
    "fast-json-patch": "catalog:"
  }
}
```

**Notes:**

- `afenda-workflow` may be used for **edit-window checks** and **workflow outbox intent planning** (Plan Phase), and/or rule metadata reads
- Domain packages (accounting/crm/inventory/etc.) may be depended on **only if CRUD genuinely orchestrates them** for mutations. Otherwise, apps should import domains directly

**Sealed rule (DEP-02):**
If a domain re-export is desired, it must live in `packages/crud-convenience` (not in kernel).

---

### External Dependencies (Sealed)

**Allowed external deps ✅**

- `drizzle-orm` (DB operations)
- `fast-json-patch` (diffing)
- (Optional) a minimal hash lib if you don't have one (`stable-hash` internal preferred)

**Avoid / keep out of kernel ❌**

- `ioredis` inside the kernel **unless** you have a strict governor design and failure policy (fail-closed vs fail-open) already sealed
- HTTP clients, queue SDKs, search SDKs, webhook delivery libs (these belong to workers, not kernel)

**Sealed rule (DEP-03):**
Kernel must not include delivery dependencies. Delivery happens via outbox workers.

---

### Who Depends on CRUD (v1.1)

**Truth Write Path:**

```
apps/web (API routes)
  ↓
packages/crud (mutate/read/list)
  ↓
packages/database + packages/canon + packages/logger
  ↓
Layer 2 domain packages (called by handlers/plan as needed)
```

**Side Effect Delivery Path (Outbox Workers):**

```
outbox worker(s)
  ↓
read outbox tables
  ↓
deliver to workflow engine / search / webhooks / integrations
```

CRUD writes **intent**, workers deliver **effects**.

---

## Anti-Patterns (v1.1 — Sealed)

These are the "permanent no's" that will corrupt the kernel if allowed.

---

### ❌ Anti-Pattern 1: Re-export Gravity (CRUD becomes God module)

**Wrong:**

```typescript
// packages/crud/src/index.ts
export { calculateLineTax } from 'afenda-accounting';
export { resolvePrice } from 'afenda-crm';
```

**Why wrong:**

- Apps import everything from crud
- Domains become "hidden behind kernel"
- Circular dependencies appear over time
- Harder unit testing and mocking boundaries

**Correct:**

```typescript
// Apps import domains directly
import { calculateLineTax } from 'afenda-accounting';
```

If convenience is needed, isolate it:

✅ `packages/crud-convenience` re-exports domains
✅ Kernel stays sealed

---

### ❌ Anti-Pattern 2: External IO inside transaction (Commit Phase contamination)

**Wrong:**

```typescript
await db.transaction(async (tx) => {
  await tx.insert(invoices).values(...);

  // ❌ Forbidden external IO inside tx
  await fetch('https://example.com/webhook');
});
```

**Why wrong:**

- Creates non-determinism
- Causes long transactions & deadlocks
- Can deliver effects for mutations that later rollback
- Breaks K-12 transactional outbox

**Correct:**

- Write outbox intent rows in the transaction
- Deliver via worker after commit

---

### ❌ Anti-Pattern 3: Outbox written post-commit (must-not-lose in best-effort zone)

**Wrong:**

```typescript
// After commit
await enqueueWorkflowOutboxEvent(...); // ❌ must-not-lose
```

**Why wrong:**

- Commit succeeds but event can be lost (crash, timeout, deploy)
- You lose the "truth → effects" guarantee

**Correct:**

```typescript
await db.transaction(async (tx) => {
  // Entity + audit + version
  // ✅ Outbox rows written here
});
```

---

### ❌ Anti-Pattern 4: Plan Phase performs writes ("reject-fast" becomes "write-first")

**Wrong:**

```typescript
// plan/build-plan.ts
await db.insert(auditLogs).values(...); // ❌ writes in plan
```

**Why wrong:**

- You can no longer safely reject without side effects
- Causes partial truth artifacts

**Correct:**

- Plan is read-only + deterministic computation
- All writes occur in Commit

---

### ❌ Anti-Pattern 5: Business logic in CRUD (Kernel drift)

**Wrong:**

```typescript
const taxMinor = subtotalMinor * 0.0825; // ❌ domain logic
```

**Correct:**

```typescript
const taxMinor = await calculateLineTax(ctx.db, ctx.orgId, ...); // ✅ Layer 2 domain
```

CRUD orchestrates; domains decide.

---

### ❌ Anti-Pattern 6: Custom handler for simple entities (Handler creep)

**Wrong:**

```typescript
export class ProductsHandler extends BaseHandler {
  async planCreate(ctx, input) {
    return super.planCreate(ctx, input); // nothing custom
  }
}
```

**Correct:**

- Use base handler
- Only create custom handler with a justification header + checklist

---

### ❌ Anti-Pattern 7: Silent DB constraint mapping to generic "error"

**Wrong:**

```typescript
catch (e) {
  return { status: 'error', reason: String(e) };
}
```

**Why wrong:**

- Clients cannot act deterministically
- Retries become random
- Governance becomes untestable

**Correct:**
Map DB errors into stable codes:

- Unique violation → `UNIQUE_CONSTRAINT` (retryable: false)
- FK violation → `FK_CONSTRAINT` (retryable: false)
- Serialization/deadlock → `CONFLICT_RETRY` (retryable: true) _(optional code)_
- Unknown → `INTERNAL` (retryable: maybe)

---

### ❌ Anti-Pattern 8: Cache invalidation as correctness mechanism

**Wrong:**

- Requiring cache invalidation for truth correctness

**Correct:**

- Cache invalidation is best-effort
- Correctness comes from truth tables + outbox delivery

---

### CI Gates that Enforce Anti-Patterns (v1.1)

**All gates implemented in `tools/ci-gates/` and run via `pnpm --filter ci-gates test`.**

#### Gate G-CRUD-01: Export Surface Gate ✅

**File:** `tools/ci-gates/crud-exports.test.ts`

Test that `src/index.ts` exports only approved symbols (K-05 enforcement).

**Approved exports:**

- 7 value exports: `mutate`, `readEntity`, `listEntities`, `buildSystemContext`, `buildUserContext`, `KERNEL_ERROR_CODES`, `setObservabilityHooks`
- 6 type exports: `MutationContext`, `MutationSpec`, `ApiResponse`, `MutationReceipt`, `KernelErrorCode`, `ObservabilityHooks`

**Prevents:** Accidental export of internal services, domain re-exports.

#### Gate G-CRUD-02: No External IO in Commit ✅

**File:** `tools/ci-gates/commit-no-io.test.ts`

Scans `commit/*` for banned imports that violate K-13 (no external IO in transaction).

**Banned patterns:**

- HTTP clients: `fetch`, `axios`, `got`, `node-fetch`
- Queues/caches: `ioredis`, `redis`, `bullmq`, `kafkajs`
- Filesystem: `node:fs`, `fs-extra`
- Email/SMS: `nodemailer`, `twilio`, `@sendgrid/`
- Cloud SDKs: `aws-sdk`, `@aws-sdk/`, `@azure/`, `@google-cloud/`

**Prevents:** "Entity saved but event lost" bugs, transaction contention.

#### Gate G-CRUD-03: No Direct DB Imports ✅

**File:** `tools/ci-gates/no-direct-db.test.ts`

Scans all `src/` files for bare `db`/`dbRo` imports (Phase 6 expansion).

**Enforces:** All code must use `withMutationTransaction()`, `withReadSession()`, or `createDbSession()`.

**Exception:** `commit/session.ts` (the session factory itself).

**Prevents:** RLS bypass, missing retry logic, governor gaps.

#### Gate G-CRUD-04: Outbox Intent Coverage ✅

**File:** `tools/ci-gates/outbox-intent-coverage.test.ts`

Verifies handlers with side effects are registered and accessible.

**Tracked entities:** Currently empty (base handlers only). Add financial document handlers here as they're created.

**Prevents:** Silent loss of workflow/search/webhook events.

#### Gate G-CRUD-05: Stable Error Code Enforcement ✅

**File:** `tools/ci-gates/stable-error-codes.test.ts`

Scans all source files for error code strings and validates against canonical `KernelErrorCode` enum.

**Allowed codes:** `FORBIDDEN`, `RATE_LIMITED`, `JOB_QUOTA_EXCEEDED`, `VALIDATION_FAILED`, `LIFECYCLE_DENIED`, `EDIT_WINDOW_EXPIRED`, `EXPECTED_VERSION_MISMATCH`, `UNIQUE_CONSTRAINT`, `FK_CONSTRAINT`, `IDEMPOTENCY_KEY_REUSE_CONFLICT`, `OUTBOX_WRITE_FAILED`, `CLOSED_FISCAL_PERIOD`, `POSTED_DOCUMENT_IMMUTABLE`, `INTERNAL`, `CONFLICT_RETRY`, `POLICY_DENIED`, `NOT_FOUND`

**Prevents:** Unstable error codes that break client error handling, retry logic, monitoring.

---

## Policy & Governance

### Authorization (Policy Engine)

**Every mutation is authorized via `enforcePolicyV2()`.**

```typescript
const decision = await enforcePolicyV2(ctx, {
  action: verb,
  resource: entityType,
  existingEntity: current,
});

if (decision.decision === 'deny') {
  return err('FORBIDDEN', decision.reason, ctx.requestId, receipt);
}
```

**Policy sources:**

1. Role-based permissions (from `roles` table)
2. Workflow rules (from `afenda-workflow`)
3. Custom entity policies (from handlers)

### Rate Limiting (INVARIANT-RL-01)

**Per-org rate limits prevent abuse.**

```typescript
const rlResult = checkRateLimit(ctx.actor.orgId, 'mutation');
if (!rlResult.allowed) {
  throw new RateLimitError(rlResult.remaining, rlResult.resetMs);
}
```

**Limits:**

- `mutation`: 1000 req/min per org
- `api`: 5000 req/min per org
- `job`: 100 concurrent jobs per org

**Storage:** Redis (ioredis)

### Job Quotas

**Limits concurrent background jobs per org.**

```typescript
const slot = await acquireJobSlot(orgId, 'import');
if (!slot.acquired) {
  throw new Error(`Job quota exceeded: ${slot.denyReason}`);
}

try {
  await runJob();
} finally {
  await releaseJob(slot.slotId);
}
```

### Metering

**Tracks usage for billing/analytics.**

```typescript
// API requests
meterApiRequest(orgId, endpoint, statusCode);

// Job runs
meterJobRun(orgId, jobType, durationMs, outcome);

// Storage
meterStorageBytes(orgId, delta);

// DB timeouts
meterDbTimeout(orgId, queryType);
```

### Lifecycle Enforcement

**State machine validation for entities with `hasLifecycle: true`.**

```typescript
const result = enforceLifecycle(entityContract, verb, currentStatus, targetStatus);

if (!result.allowed) {
  throw new LifecycleError(result.reason);
}
```

**Example (invoices):**

```
draft → submitted → approved → active
  ↓         ↓          ↓
delete    cancel    cancel
```

### Edit Window Enforcement

**Workflow rules can restrict edits after time windows.**

```typescript
await enforceEditWindow(ctx.db, ctx.orgId, {
  entityType: 'invoices',
  entityId: '123',
  action: 'update',
});
// Throws if edit window expired
```

---

## Domain Service Integration

### Accounting Services

```typescript
import {
  lookupFxRate, // Foreign exchange rates
  calculateLineTax, // Tax calculation
  allocatePayment, // Payment allocation
  generateDepreciationSchedule, // Asset depreciation
  recognizeRevenue, // Revenue recognition
  autoMatchStatementLines, // Bank reconciliation
} from 'afenda-accounting';
```

### CRM Services

```typescript
import {
  resolvePrice, // Price resolution
  evaluateDiscounts, // Discount evaluation
  priceLineItem, // Line item pricing
  checkBudget, // Budget enforcement
  commitBudget, // Budget commitment
} from 'afenda-crm';
```

### Inventory Services

```typescript
import {
  convertUom, // Unit of measure conversion
  allocateLandedCost, // Landed cost allocation
  traceRecall, // Lot recall tracing
  explodeBom, // Bill of materials explosion
  calculateCostRollup, // Manufacturing cost rollup
} from 'afenda-inventory';
```

### Intercompany Services

```typescript
import {
  createIntercompanyTransaction, // IC transaction creation
  matchIntercompanyTransactions, // IC matching
  generateEliminationEntries, // Consolidation eliminations
} from 'afenda-intercompany';
```

### Workflow Services

```typescript
import {
  evaluateRules, // Rule evaluation
  loadAndRegisterOrgRules, // Rule loading
} from 'afenda-workflow';
```

---

## Infrastructure Services

### Custom Field Management

**Dynamic field validation and synchronization.**

```typescript
// Load field definitions
const fieldDefs = await loadFieldDefs(db, orgId, entityType);

// Validate custom data
const errors = validateCustomData(customData, fieldDefs);

// Sync custom field values
await syncCustomFieldValues(db, orgId, entityType, entityId, customData);
```

### Document Numbering

**Sequential number allocation with fiscal year prefixes.**

```typescript
const result = await allocateDocNumber(db, orgId, {
  entityType: 'invoices',
  fiscalYear: 2024,
  prefix: 'INV',
});
// Returns: "INV-2024-00001"
```

### Webhook Dispatch

**Event-driven integrations.**

```typescript
await dispatchWebhookEvent(db, orgId, {
  event: 'invoice.created',
  payload: { invoiceId: '123' },
  url: 'https://example.com/webhook',
});
```

### Search Outbox

**Full-text search index maintenance.**

```typescript
await enqueueSearchOutboxEvent(db, {
  orgId,
  entityType: 'invoices',
  entityId: '123',
  operation: 'upsert',
});
```

### Workflow Outbox

**Workflow rule evaluation queue.**

```typescript
await enqueueWorkflowOutboxEvent(db, {
  orgId,
  entityType: 'invoices',
  entityId: '123',
  event: 'invoice.approved',
});
```

---

## Database Layer Invariants

**These are DB-layer guarantees that CRUD assumes but does not own.**

### DB-01: Automatic updated_at (formerly K-08)

**`updated_at` set by database trigger, not application code.**

```sql
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

**Applied to:** All entity tables via migration scripts.

**Why DB-layer:** CRUD assumes this exists; database package owns the implementation.

### DB-02: UUID Generation

**Primary keys use `gen_random_uuid()` via `pgcrypto` extension.**

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ...
);
```

### DB-03: Row-Level Security (RLS)

**All entity tables enforce org-scoped RLS policies.**

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (org_id = auth.org_id());
```

### DB-04: Soft Delete Pattern

**Entities use `deleted_at` for soft deletes, not hard deletes.**

```sql
CREATE TABLE invoices (
  -- ...
  deleted_at TIMESTAMPTZ,
  -- ...
);

-- Queries filter WHERE deleted_at IS NULL
```

---

## Lifecycle Enforcement Hooks (ERP Safety)

**For finance documents, state machines alone aren't enough. CRUD orchestrates these domain-layer checks:**

### Closed Fiscal Period Guard

**Prevents mutations to closed accounting periods.**

```typescript
// In mutate() before transaction
if (entityType === 'invoices' || entityType === 'journal-entries') {
  await assertPeriodOpen(ctx.db, ctx.orgId, {
    date: input.postingDate || input.documentDate,
  });
  // Throws CLOSED_FISCAL_PERIOD if period is closed
}
```

**Implementation:** `afenda-accounting` package (Layer 2).

### Posted Document Immutability

**Prevents edits to posted documents; requires reversal instead.**

```typescript
// In handler.beforeUpdate()
if (current.postingStatus === 'posted') {
  throw new LifecycleError(
    'POSTED_DOCUMENT_IMMUTABLE',
    'Posted documents cannot be edited. Create a reversal instead.',
  );
}
```

**Implementation:** Custom handlers or base handler with entity contract rules.

### Reversal-Required Pattern

**For posted documents, edits must go through reversal workflow.**

```typescript
// Correct pattern for correcting posted invoice
// 1. Create reversal
await mutate(
  {
    actionType: 'invoices.reverse',
    entityRef: { type: 'invoices', id: originalId },
  },
  ctx,
);

// 2. Create new corrected invoice
await mutate(
  {
    actionType: 'invoices.create',
    entityRef: { type: 'invoices' },
    input: { ...correctedData, reversesId: originalId },
  },
  ctx,
);
```

### Edit Window Enforcement

**Workflow rules can restrict edits after time windows.**

```typescript
// In mutate() before transaction
await enforceEditWindow(ctx.db, ctx.orgId, {
  entityType: 'invoices',
  entityId: input.id,
  action: 'update',
});
// Throws EDIT_WINDOW_EXPIRED if window passed
```

**Implementation:** `afenda-workflow` package (Layer 2).

---

## Observability Integration

**CRUD cannot import observability (same layer), but needs to emit metrics.**

### Event Hook Pattern

**CRUD emits structured events to an internal hook interface:**

```typescript
// src/observability-hooks.ts
export interface ObservabilityHooks {
  onMutationStart(ctx: MutationContext, spec: MutationSpec): void;
  onMutationCommitted(ctx: MutationContext, receipt: Receipt, durationMs: number): void;
  onMutationRejected(ctx: MutationContext, code: ErrorCode, reason: string): void;
  onMutationFailed(ctx: MutationContext, error: Error): void;
}

// Default no-op implementation
let hooks: ObservabilityHooks = {
  onMutationStart: () => {},
  onMutationCommitted: () => {},
  onMutationRejected: () => {},
  onMutationFailed: () => {},
};

export function setObservabilityHooks(impl: ObservabilityHooks) {
  hooks = impl;
}

export function getObservabilityHooks() {
  return hooks;
}
```

### Usage in mutate()

```typescript
export async function mutate(spec: MutationSpec, ctx: MutationContext) {
  const hooks = getObservabilityHooks();
  const startTime = performance.now();

  hooks.onMutationStart(ctx, spec);

  try {
    // ... mutation logic ...

    const receipt = { status: 'ok', ... };
    hooks.onMutationCommitted(ctx, receipt, performance.now() - startTime);
    return ok(receipt);

  } catch (error) {
    if (error instanceof LifecycleError) {
      hooks.onMutationRejected(ctx, error.code, error.message);
    } else {
      hooks.onMutationFailed(ctx, error);
    }
    throw error;
  }
}
```

### App-Level Adapter

```typescript
// apps/web/lib/crud-observability-adapter.ts
import { setObservabilityHooks } from 'afenda-crud';
import { recordMetric, recordError } from 'afenda-observability';

setObservabilityHooks({
  onMutationStart(ctx, spec) {
    recordMetric('crud.mutation.started', 1, {
      entityType: spec.entityRef.type,
      verb: extractVerb(spec.actionType),
    });
  },

  onMutationCommitted(ctx, receipt, durationMs) {
    recordMetric('crud.mutation.committed', 1, {
      entityType: receipt.entityType,
      durationMs,
    });
  },

  onMutationRejected(ctx, code, reason) {
    recordMetric('crud.mutation.rejected', 1, { code });
  },

  onMutationFailed(ctx, error) {
    recordError('crud.mutation.failed', error);
  },
});
```

**Benefits:**

- ✅ CRUD never imports observability
- ✅ Observability can "plug in" cleanly
- ✅ Default no-op for tests
- ✅ Type-safe event contracts

---

## CI Gates (Invariant Enforcement)

**Automated checks that prevent invariant drift.**

### Gate 1: Export Surface Validation

**Ensures `src/index.ts` exports only approved kernel symbols.**

```typescript
// tools/ci-gates/crud-exports.test.ts
import * as crud from 'afenda-crud';

const APPROVED_EXPORTS = [
  'mutate',
  'readEntity',
  'listEntities',
  'buildSystemContext',
  // Types only
];

test('CRUD exports only kernel API', () => {
  const actual = Object.keys(crud);
  expect(actual.sort()).toEqual(APPROVED_EXPORTS.sort());
});
```

**Prevents:** Accidental export of internal services, domain re-exports.

### Gate 2: No External IO in Transactions

**Bans HTTP/queue calls inside `db.transaction()` scopes.**

```javascript
// .eslintrc.js
rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'CallExpression[callee.object.name="db"][callee.property.name="transaction"] CallExpression[callee.name=/fetch|axios/]',
      message: 'K-16 violation: No HTTP calls inside db.transaction(). Use outbox pattern.',
    },
    {
      selector: 'CallExpression[callee.object.name="db"][callee.property.name="transaction"] CallExpression[callee.object.name=/queue|redis/][callee.property.name=/publish|send/]',
      message: 'K-16 violation: No queue/redis writes inside db.transaction(). Use outbox pattern.',
    },
  ],
}
```

**Prevents:** "Entity saved but event lost" bugs.

### Gate 3: Outbox Intent Required

**If handler declares side effects, ensure outbox writes exist.**

```typescript
// tools/ci-gates/outbox-coverage.test.ts
const HANDLERS_WITH_SIDE_EFFECTS = ['invoices', 'payments', 'journal-entries'];

for (const entityType of HANDLERS_WITH_SIDE_EFFECTS) {
  test(`${entityType} handler writes outbox intents`, async () => {
    const handler = HANDLER_REGISTRY[entityType];
    const spy = vi.spyOn(workflowOutbox, 'insert');

    await handler.create(mockCtx, mockInput);

    expect(spy).toHaveBeenCalled();
  });
}
```

**Prevents:** Silent loss of workflow/search/webhook events.

### Gate 4: Stable Error Codes Only

**Ensures all error returns use canonical `ErrorCode` enum.**

```bash
# tools/ci-gates/check-error-codes.sh
grep -r "return err(" packages/crud/src/ | \
  grep -v "ErrorCode\." | \
  grep -v "'FORBIDDEN'\|'VALIDATION_FAILED'\|'RATE_LIMITED'" && \
  echo "ERROR: Found raw string error codes. Use ErrorCode enum." && exit 1
```

**Prevents:** Unstable error codes that break client error handling.

### Running Gates

```bash
# In CI pipeline
pnpm run ci:gates

# Runs:
# - Export surface validation
# - ESLint no-external-io rule
# - Outbox coverage tests
# - Error code stability check
```

---

## Dependencies

### Workspace Dependencies (Layer 0, 1, 2)

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*", // Layer 1: Types, schemas
    "afenda-database": "workspace:*", // Layer 1: DB schemas
    "afenda-logger": "workspace:*", // Layer 1: Logging
    "afenda-workflow": "workspace:*", // Layer 2: Rules engine
    "afenda-accounting": "workspace:*", // Layer 2: Accounting domain
    "afenda-crm": "workspace:*", // Layer 2: CRM domain
    "afenda-inventory": "workspace:*", // Layer 2: Inventory domain
    "afenda-intercompany": "workspace:*" // Layer 2: IC domain
  }
}
```

### External Dependencies

```json
{
  "dependencies": {
    "drizzle-orm": "catalog:", // Database queries
    "fast-json-patch": "catalog:", // JSON patch operations
    "ioredis": "catalog:" // Rate limiting
  }
}
```

### Who Depends on CRUD

```
apps/web (Next.js API routes)
  ↓
packages/crud
  ↓
packages/accounting, packages/crm, packages/inventory, ...
  ↓
packages/canon, packages/database, packages/logger
```

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Implementing Business Logic in CRUD

**WRONG:**

```typescript
// packages/crud/src/handlers/invoices.ts
export class InvoicesHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // ❌ Implementing tax calculation in CRUD!
    const taxMinor = input.subtotalMinor * 0.0825;
    const totalMinor = input.subtotalMinor + taxMinor;

    return { ...input, taxMinor, totalMinor };
  }
}
```

**CORRECT:**

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateLineTax } from 'afenda-accounting';

export class InvoicesHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // ✅ Delegate to accounting domain
    const taxMinor = await calculateLineTax(ctx.db, ctx.orgId, {
      baseMinor: input.subtotalMinor,
      taxRateId: input.taxRateId,
    });

    return { ...input, taxMinor };
  }
}
```

### ❌ Anti-Pattern 2: Bypassing mutate()

**WRONG:**

```typescript
// Direct database write
await db.insert(invoices).values({ ... });
```

**Why wrong:**

- Bypasses authorization
- No audit trail
- No versioning
- No workflow triggers
- No rate limiting

**CORRECT:**

```typescript
await mutate({
  actionType: 'invoices.create',
  entityRef: { type: 'invoices' },
  input: { ... },
}, ctx);
```

### ❌ Anti-Pattern 3: Importing from Observability

**WRONG:**

```typescript
import { recordMetric } from 'afenda-observability'; // FORBIDDEN!
```

**Why wrong:** CRUD and observability are both Layer 3 (same layer).

**CORRECT:**

```typescript
// Observability instruments CRUD externally
// CRUD doesn't import observability
```

### ❌ Anti-Pattern 4: Wrapping Domain Services Unnecessarily

**WRONG:**

```typescript
// Useless wrapper
export function calculateInvoiceTax(amount: number, rate: number): number {
  return calculateTax(amount, rate); // Just a wrapper!
}
```

**CORRECT:**

```typescript
// Direct re-export
export { calculateTax } from 'afenda-accounting';
```

### ❌ Anti-Pattern 5: Creating Custom Handlers for Simple Entities

**WRONG:**

```typescript
// Custom handler for simple entity
export class ProductsHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // Only schema validation needed
    return super.beforeCreate(ctx, input);
  }
}
```

**CORRECT:**

```typescript
// Use base handler (no custom handler needed)
// Products entity uses generic CRUD automatically
```

---

## Summary

### Key Responsibilities

| Responsibility        | Implementation                                            |
| --------------------- | --------------------------------------------------------- |
| **Single Write Path** | `mutate()` is the ONLY entry point (K-01)                 |
| **Orchestration**     | Coordinates domain services, never implements logic       |
| **Authorization**     | Policy engine enforces permissions                        |
| **Audit Trail**       | Every mutation writes audit_logs + entity_versions (K-03) |
| **Versioning**        | Optimistic concurrency via expectedVersion (K-04)         |
| **Governance**        | Rate limits, job quotas, metering                         |
| **Lifecycle**         | State machine enforcement for workflow entities           |
| **Events**            | Publishes to workflow and search outboxes                 |

### Critical Rules

1. **K-01:** `mutate()` is the ONLY way to write domain data
2. **K-02:** Single DB transaction per mutation
3. **K-03:** ALWAYS writes audit_logs + entity_versions
4. **K-05:** Only 3 public exports: mutate, readEntity, listEntities
5. **Never implement business logic** — delegate to Layer 2 domains
6. **Never import from Layer 3** — no observability imports
7. **Sparse handlers** — only 2 custom handlers for 211 entities

### Benefits

- ✅ Complete audit trail for compliance
- ✅ Optimistic concurrency prevents lost updates
- ✅ Rate limiting prevents abuse
- ✅ Single write path simplifies debugging
- ✅ Domain services remain reusable
- ✅ Clean separation of concerns
- ✅ Scalable to 1000+ entity types

---

---

## Read APIs (Separate Concern)

**CRUD includes read operations, but they follow different semantics than writes.**

### Read vs Write Semantics

| Aspect            | Writes (mutate)        | Reads (readEntity, listEntities)  |
| ----------------- | ---------------------- | --------------------------------- |
| **Consistency**   | Strict (truth tables)  | Best-effort (may use projections) |
| **Audit**         | Always logged          | Optional query logging            |
| **Authorization** | Policy engine          | RLS + policy engine               |
| **Caching**       | Never cached           | May use list cache                |
| **Versioning**    | Optimistic concurrency | Point-in-time snapshots           |

### Future Split (Optional)

**If read complexity grows, consider splitting:**

```
packages/crud      → Mutation kernel only
packages/query     → Read models, projections, search
```

**Benefits:**

- Separate scaling (CQRS pattern)
- Read models can denormalize
- Write path stays pure

**For now:** Keep in CRUD, document the semantic difference.

---

**Last Updated:** February 19, 2026  
**Version:** 1.1 (Ratification Grade)  
**See Also:** [ARCHITECTURE.md](../../ARCHITECTURE.md), [HANDLER_GUIDE.md](docs/HANDLER_GUIDE.md)

---

## Changelog

### v1.1 (February 19, 2026) - Ratification Grade

**Breaking Changes:**

- Removed domain service re-exports from main barrel (import directly from domains)
- Tightened public API to kernel-only exports

**New Invariants:**

- **K-16:** Transactional Outbox (exactly-once intent)
- **K-17:** Stable Error Codes (canonical taxonomy)
- **K-18:** Handler Purity (orchestrate, never implement)
- **K-19:** Field Write Policy (immutable, write-once, server-owned)

**Enhancements:**

- Expanded K-10 with idempotency storage + replay semantics
- Relocated K-08 to Database Layer Invariants section
- Added Lifecycle Enforcement Hooks (closed periods, posting locks)
- Added Observability Hook Pattern (no Layer 3 imports)
- Added CI Gates for invariant enforcement
- Renamed stub-handler → base-handler

**Documentation:**

- Added Database Layer Invariants section
- Added CI Gates section
- Added Read APIs semantic comparison
- Added migration path for v1.0 → v1.1

### v1.0 (February 19, 2026) - Initial Release

- Complete kernel architecture documentation
- 15 kernel invariants (K-01 through K-15)
- Handler system documentation
- Policy & governance documentation
- Domain service integration patterns
- Anti-patterns guide
