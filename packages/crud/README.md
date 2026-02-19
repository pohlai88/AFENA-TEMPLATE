# afenda-crud

> **Mutation Kernel (v1.1)** — Deterministic, auditable, policy-enforced entity lifecycle management

The CRUD package is the **single entry point** for all domain data writes in the Afena system. It orchestrates mutations through a 3-phase pipeline (Plan → Commit → Deliver) with built-in authorization, audit logging, versioning, and workflow integration.

---

## 📦 Public API (K-05 Sealed)

Only **6 functions** and **5 types** are exported:

### Functions

```typescript
import { mutate, readEntity, listEntities } from 'afenda-crud';
import { buildSystemContext, buildUserContext } from 'afenda-crud';
import { setObservabilityHooks } from 'afenda-crud';
```

- **`mutate(spec, ctx)`** — Single entry point for all writes (create, update, delete, restore)
- **`readEntity(entityType, id, ctx)`** — Read single entity by ID
- **`listEntities(entityType, opts, ctx)`** — List entities with filtering/pagination
- **`buildSystemContext(orgId, userId)`** — Create system-level mutation context
- **`buildUserContext(params)`** — Create user-level mutation context with auth
- **`setObservabilityHooks(hooks)`** — Register observability callbacks

### Types

```typescript
import type { 
  MutationContext, 
  MutationSpec, 
  MutationReceipt,
  ApiResponse,
  ObservabilityHooks 
} from 'afenda-crud';
```

---

## 🚀 Quick Start

### Create Entity

```typescript
import { mutate, buildUserContext } from 'afenda-crud';

const ctx = buildUserContext({
  orgId: 'org-123',
  userId: 'user-456',
  userName: 'Alice',
  channel: 'web_ui',
});

const result = await mutate(
  {
    actionType: 'contacts.create',
    entityRef: { type: 'contacts', orgId: 'org-123' },
    input: {
      name: 'Acme Corp',
      email: 'hello@acme.com',
      phone: '+60123456789',
    },
  },
  ctx
);

if (result.ok) {
  console.log('Created:', result.data.entityId);
} else {
  console.error('Failed:', result.error.message);
}
```

### Update Entity

```typescript
const result = await mutate(
  {
    actionType: 'contacts.update',
    entityRef: { type: 'contacts', orgId: 'org-123', id: 'contact-789' },
    input: {
      expectedVersion: 3, // Optimistic concurrency control (K-04)
      email: 'new@acme.com',
    },
  },
  ctx
);
```

### Read Entity

```typescript
import { readEntity } from 'afenda-crud';

const contact = await readEntity('contacts', 'contact-789', ctx);
```

---

## 🏗️ Architecture

### 3-Phase Pipeline (v1.1)

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: PLAN (Reject-Fast)                                │
│  ├─ Validate input (Zod)                                    │
│  ├─ Enforce policy (authorization)                          │
│  ├─ Enforce lifecycle (state machine)                       │
│  ├─ Enforce field write rules (K-15)                        │
│  ├─ Run handler plan hooks                                  │
│  └─ Build outbox intents                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: COMMIT (Single Transaction)                       │
│  ├─ Apply entity (INSERT/UPDATE/soft-delete/restore)        │
│  ├─ Write audit log (K-03)                                  │
│  ├─ Write version snapshot (K-03)                           │
│  ├─ Write outbox intents (K-12 atomic)                      │
│  ├─ Write idempotency record (K-10)                         │
│  └─ Run handler commit hooks                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 3: DELIVER (Best-Effort)                             │
│  ├─ Signal workers (workflow, search)                       │
│  ├─ Invalidate cache                                        │
│  └─ Best-effort metering                                    │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── index.ts              # K-05 sealed exports (6 functions + 5 types)
├── mutate.ts             # Thin orchestrator (85 lines)
├── read.ts               # Entity read operations
├── context.ts            # Context builders
├── observability-hooks.ts # Observability integration
│
├── plan/                 # Phase 1: Plan
│   ├── build-plan.ts
│   ├── validate-spec.ts
│   ├── sanitize-input.ts
│   ├── load-current.ts
│   ├── enforce/
│   │   ├── policy.ts         # Authorization + CAPABILITY_CATALOG integration
│   │   ├── lifecycle.ts      # State machine
│   │   ├── field-write.ts    # K-15 FieldPolicyEngine
│   │   ├── edit-window.ts    # Workflow edit windows
│   │   ├── governor.ts       # Rate limiting
│   │   └── rate-limiter.ts
│   ├── validate/
│   │   └── custom-fields.ts
│   └── outbox/
│       └── build-intents.ts
│
├── commit/               # Phase 2: Commit
│   ├── commit-plan.ts
│   ├── session.ts            # DbSession wrappers
│   ├── apply-entity.ts       # Generic entity writer
│   ├── write-audit.ts        # Audit log writer
│   ├── write-version.ts      # Version snapshot writer
│   ├── write-idempotency.ts  # K-10 idempotency
│   ├── compute-diff.ts
│   ├── allocate-doc-number.ts
│   └── sync-custom-fields.ts
│
├── deliver/              # Phase 3: Deliver
│   ├── deliver-effects.ts
│   ├── signal-workers.ts
│   ├── invalidate-cache.ts
│   └── best-effort-metering.ts
│
├── handlers/             # Entity handlers
│   ├── types.ts              # EntityHandlerV11 interface
│   ├── base-handler.ts       # Generic handler (209 entities)
│   ├── companies.ts          # Custom handler
│   └── contacts.ts           # Custom handler
│
├── registries/
│   └── handler-registry.ts
│
├── services/             # Infrastructure services
│   ├── search-outbox.ts
│   └── (other services)
│
└── util/
    ├── cursor.ts
    ├── envelope.ts
    └── stable-hash.ts
```

---

## 🔒 Kernel Invariants (K-01 through K-15)

| ID | Invariant | Status |
|----|-----------|--------|
| K-01 | `mutate()` is the ONLY way to write domain data | ✅ Enforced by ESLint |
| K-02 | Single DB transaction per mutation | ✅ `withMutationTransaction()` |
| K-03 | Always writes `audit_logs` + `entity_versions` | ✅ `write-audit.ts` + `write-version.ts` |
| K-04 | `expectedVersion` required on update/delete/restore | ✅ Validated in `build-plan.ts` |
| K-05 | Exports ONLY 6 functions + 5 types | ✅ CI gate G-CRUD-01 |
| K-10 | Idempotency key for `*.create` only | ✅ `write-idempotency.ts` |
| K-11 | Allowlist input + kernel backstop strips system cols | ✅ `FieldPolicyEngine` |
| K-12 | Outbox writes are atomic with transaction | ✅ No try/catch, fails entire TX |
| K-15 | Field write policy enforcement | ✅ `enforceFieldWritePolicy()` |

---

## 📚 Integration with Other Packages

### Infrastructure Services (via `afenda-crud/internal`)

```typescript
import { 
  allocateDocNumber,
  validateCustomFields,
  loadFieldDefs,
  checkRateLimit,
  meterApiRequest 
} from 'afenda-crud/internal';
```

**Note:** Infrastructure services are exported from the `/internal` sub-path, not the main barrel.

### Domain Services (import directly from domain packages)

```typescript
// ❌ WRONG: Don't import from crud
import { calculateTax } from 'afenda-crud';

// ✅ CORRECT: Import from domain package
import { calculateTax } from 'afenda-accounting';
import { priceLineItem } from 'afenda-crm';
import { convertUom } from 'afenda-inventory';
```

**Rule:** CRUD orchestrates, it does NOT implement business logic.

---

## 🔧 Development

### Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
pnpm test        # Run tests
```

### Adding a New Entity Handler

Most entities use the **base handler** (no code needed). Only create a custom handler if you need:

- Specialized validation beyond schema
- Domain-specific business logic coordination
- Complex relationships or cascading updates

**Example:**

```typescript
// src/handlers/my-entity.ts
import type { EntityHandler } from './types';

export const myEntityHandler: EntityHandler = {
  entityType: 'my-entity',
  
  planCreate: async (ctx, input) => ({
    sanitizedInput: input,
    outboxIntents: [],
  }),
  
  commitAfterEntityWrite: async (tx, plan, written) => {
    // Optional: write subsidiary records
  },
};
```

Then register in `src/registries/handler-registry.ts`.

---

## 📖 Related Documentation

- **[INTEGRATION_PLAN.md](./INTEGRATION_PLAN.md)** — v1.0 → v1.1 migration plan (all 6 phases complete)
- **[crud.architecture.md](./crud.architecture.md)** — Detailed architecture documentation
- **[afenda-canon](../canon/README.md)** — Types, schemas, entity contracts
- **[afenda-database](../database/README.md)** — Schema, DbSession, RLS
- **[afenda-workflow](../workflow/README.md)** — Workflow engine integration

---

## ⚠️ Critical Rules

### 1. NEVER Bypass `mutate()`

```typescript
// ❌ WRONG: Direct DB write
await db.insert(invoices).values({ ... });

// ✅ CORRECT: Use mutate()
await mutate({ actionType: 'invoices.create', ... }, ctx);
```

**Why:** Bypasses authorization, audit logging, workflow rules, versioning.

### 2. NEVER Import `db` or `dbRo` Directly

```typescript
// ❌ WRONG: Direct import
import { db } from 'afenda-database';

// ✅ CORRECT: Use DbSession wrappers
import { withMutationTransaction, withReadSession } from './commit/session';
```

**Enforced by:** CI gate G-CRUD-03 (scans all `src/` files)

### 3. NEVER Implement Business Logic in CRUD

```typescript
// ❌ WRONG: Tax calculation in CRUD
const taxMinor = input.subtotalMinor * 0.0825;

// ✅ CORRECT: Import from domain package
import { calculateTax } from 'afenda-accounting';
const taxMinor = await calculateTax(db, orgId, { ... });
```

---

## 🎯 Version

**Current:** v1.1 (Phase 6 Complete)  
**Last Updated:** February 19, 2026

**Changelog:**
- ✅ Phase 1: Export seal + context builders
- ✅ Phase 2: Outbox intent model + idempotency
- ✅ Phase 2.5: Directory restructure
- ✅ Phase 3: MutationPlan + FieldPolicyEngine + handlers
- ✅ Phase 4: Thin orchestrator (85 lines)
- ✅ Phase 5: DbSession default-on + observability
- ✅ Phase 6: MutationReceipt discriminated union + CAPABILITY_CATALOG integration + handler metadata derivation

---

**License:** Private  
**Package:** `afenda-crud`  
**Type:** Application Orchestration (Layer 3)
