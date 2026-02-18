# afenda-crud

**Layer 3: Application Orchestration** • **Role:** Entity Lifecycle & Service Coordination

The Application Layer orchestrator that coordinates domain services, enforces policies, and manages entity lifecycles.

---

## 📐 Architecture Role

**Layer 3** in the 4-layer architecture:

```
Layer 3: Application (crud ← YOU ARE HERE, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Orchestrates domain services from Layer 2
- Enforces authorization and policies
- Manages entity lifecycle (create, update, delete, restore)
- Logs audit trails
- Publishes events

**CRITICAL:** CRUD orchestrates but does NOT implement business logic.

---

## ✅ What This Package Does

### 1. Entity Mutations

```typescript
import { mutate, buildSystemContext } from 'afenda-crud';

const ctx = buildSystemContext(db, orgId);

const receipt = await mutate(ctx, 'invoices', 'create', {
  customerId: 'cust-123',
  totalMinor: 10000,
  taxRate: 0.0825,
});
```

### 2. Domain Service Orchestration

```typescript
import { calculateTax, checkCreditLimit, priceLineItem } from 'afenda-crud';

// Coordinate multiple domain services
const taxMinor = await calculateTax(db, orgId, { baseMinor: 10000, rate: 0.0825 });
await checkCreditLimit(db, orgId, { customerId: 'cust-1', amountMinor: 10000 });
const pricing = await priceLineItem(db, orgId, { productId: 'prod-1', quantity: 10 });
```

### 3. Policy Enforcement

```typescript
// Built-in: authorization, rate limiting, quotas, metering
await mutate(ctx, 'invoices', 'create', data);
// ✅ Checks: user permissions, rate limits, organization quotas
```

### 4. Audit Logging

```typescript
// Automatic audit trail for every mutation
await mutate(ctx, 'invoices', 'update', { id: '123', status: 'approved' });
// ✅ Writes: audit_logs + entity_versions
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Implement tax calculation | Import from afenda-accounting |
| Implement pricing logic | Import from afenda-crm |
| Implement inventory checks | Import from afenda-inventory |
| Implement analytics | Call afenda-advisory |
| Duplicate domain logic | Call business-domain packages |

**Rule:** CRUD coordinates, it does NOT implement business logic.

---

## 📦 What This Package Exports

### Core API (3 Functions)

- `mutate(ctx, entityType, verb, input)` — Single entry point for all writes
- `readEntity(db, orgId, entityType, id)` — Read single entity
- `listEntities(db, orgId, entityType, opts)` — List entities with filters

### Context Builders

- `buildSystemContext(db, orgId)` — System-level context
- `buildUserContext(db, orgId, userId, roles)` — User context with permissions

### Domain Service Re-exports

**Accounting:**
- `calculateTax`, `lookupFxRate`, `calculateDepreciation`, `allocatePayment`

**CRM:**
- `priceLineItem`, `checkCreditLimit`, `calculateDiscount`

**Inventory:**
- `convertUom`, `checkStockLevel`, `calculateLandedCost`

**Intercompany:**
- `createIcTransaction`, `matchIcTransactions`, `generateEliminationEntries`

### Infrastructure Services

- `allocateDocNumber` — Sequential document numbers
- `validateCustomFields` — Custom field validation
- `dispatchWebhook` — Event dispatch

---

## 📖 Usage Examples

### Create Entity with Domain Logic

```typescript
import { mutate, buildSystemContext, calculateTax, checkCreditLimit } from 'afenda-crud';
import { db } from 'afenda-database';

const ctx = buildSystemContext(db, 'org-1');

// 1. Check credit limit (CRM domain)
await checkCreditLimit(db, 'org-1', {
  customerId: 'cust-123',
  amountMinor: 100000,
});

// 2. Calculate tax (Accounting domain)
const taxMinor = await calculateTax(db, 'org-1', {
  baseMinor: 100000,
  taxRate: 0.0825,
});

// 3. Create invoice (CRUD orchestrates)
const receipt = await mutate(ctx, 'invoices', 'create', {
  customerId: 'cust-123',
  subtotalMinor: 100000,
  taxMinor,
  totalMinor: 100000 + taxMinor,
});

console.log('Invoice created:', receipt.entityRef.id);
```

### Update Entity with Version Control

```typescript
const receipt = await mutate(ctx, 'invoices', 'update', {
  id: '123',
  expectedVersion: 5, // Optimistic concurrency control
  status: 'approved',
});
```

### Delete Entity

```typescript
const receipt = await mutate(ctx, 'invoices', 'delete', {
  id: '123',
  expectedVersion: 5,
});
```

---

## 🔗 Dependencies

### Workspace Dependencies

- ✅ `afenda-canon` (Layer 1) — types
- ✅ `afenda-database` (Layer 1) — schemas
- ✅ `afenda-logger` (Layer 1) — logging
- ✅ `afenda-workflow` (Layer 2) — rule evaluation
- ✅ `afenda-advisory` (Layer 2) — analytics
- ✅ All 116 business-domain packages (Layer 2) — business logic

### External Dependencies

- `drizzle-orm` — Database queries
- `fast-json-patch` — JSON patch operations
- `ioredis` — Rate limiting

### Who Depends on This Package

- ✅ `apps/web` — Web API routes
- ✅ Background jobs — Scheduled tasks
- ✅ CLI tools — Admin scripts

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - All Layer 0, 1, 2 packages
  - External npm

❌ FORBIDDEN:
  - afenda-observability (Layer 3, same layer)
  - Implementing business logic (call domains instead)
```

**Rule:** Layer 3 can depend on all lower layers (0, 1, 2) but not on same-layer packages.

---

## 📜 Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
pnpm test        # Run tests
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Implement Business Logic

**❌ WRONG:**

```typescript
// packages/crud/src/handlers/invoices.ts
export async function createInvoice(ctx, input) {
  // ❌ Implementing tax calculation in CRUD!
  const taxMinor = input.subtotalMinor * 0.0825;
  const totalMinor = input.subtotalMinor + taxMinor;
  
  return await db.insert(invoices).values({ ...input, taxMinor, totalMinor });
}
```

**Why:** Business logic belongs in business-domain packages, not in CRUD.

**✅ CORRECT:**

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateTax } from 'afenda-accounting'; // Import from domain

export async function createInvoice(ctx, input) {
  // ✅ Coordinate domain services
  const taxMinor = calculateTax(input.subtotalMinor, input.taxRate);
  const totalMinor = input.subtotalMinor + taxMinor;
  
  return await db.insert(invoices).values({ ...input, taxMinor, totalMinor });
}
```

---

### 🔒 Rule 2: Import from Domains, Don't Reimplement

**❌ WRONG:**

```typescript
// Duplicating pricing logic in CRUD
function calculateLinePrice(quantity: number, unitPrice: number): number {
  let price = quantity * unitPrice;
  if (quantity > 100) price *= 0.9; // Volume discount
  return price;
}
```

**Why:** Pricing logic already exists in afenda-crm.

**✅ CORRECT:**

```typescript
import { priceLineItem } from 'afenda-crm';

const pricing = await priceLineItem(db, orgId, { productId, quantity });
```

---

### 🔒 Rule 3: Mutate() Is the ONLY Write Path

**❌ WRONG:**

```typescript
// Direct database write bypassing CRUD
await db.insert(invoices).values({ ... });
```

**Why:** Bypasses authorization, audit logging, workflow rules, versioning.

**✅ CORRECT:**

```typescript
// Use mutate() for all writes
await mutate(ctx, 'invoices', 'create', { ... });
```

---

### 🔒 Rule 4: NEVER Import from Observability

**❌ WRONG:**

```typescript
import { recordMetric } from 'afenda-observability'; // FORBIDDEN!
```

**Why:** CRUD and observability are both Layer 3 (same layer).

**✅ CORRECT:**

```typescript
// Observability instruments CRUD externally
// CRUD doesn't import observability
```

---

### 🔒 Rule 5: Re-export Domain Services, Don't Wrap

**❌ WRONG:**

```typescript
// Wrapping domain service unnecessarily
export function calculateInvoiceTax(amount: number, rate: number): number {
  return calculateTax(amount, rate); // Just a wrapper!
}
```

**Why:** Adds no value, creates confusion.

**✅ CORRECT:**

```typescript
// Direct re-export
export { calculateTax, allocatePayment } from 'afenda-accounting';
export { priceLineItem, checkCreditLimit } from 'afenda-crm';
```

---

### 🚨 Validation Commands

```bash
# Check for circular dependencies
pnpm run validate:deps

# Check for layer violations
pnpm lint:ci

# Type-check
pnpm type-check

# Run tests
pnpm test
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 3 (Application Orchestration) |
| **What does it export?** | mutate(), readEntity(), listEntities(), domain service re-exports |
| **What does it import?** | All Layers 0, 1, 2 |
| **Who imports it?** | apps/web, background jobs, CLI tools |
| **Can it implement business logic?** | ❌ NO (orchestrate only) |
| **Can it import from observability?** | ❌ NO (same layer) |
| **Is mutate() the only write path?** | ✅ YES (for domain data) |
| **Should we bypass mutate()?** | ❌ NO (loses audit, auth, versioning) |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [packages/workflow/README.md](../workflow/README.md) - Rules engine
- [packages/advisory/README.md](../advisory/README.md) - Analytics
- [business-domain/README.md](../../business-domain/README.md) - Domain packages

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)

## Handler Architecture

The CRUD package uses a **registry pattern with sparse handlers**:

### Generic CRUD Path (209 of 211 entities)

Most entities use the **base handler** which provides:

- Schema validation (via `afenda-canon`)
- Authorization (via policy engine)
- Lifecycle hooks (create, update, delete)
- Audit logging
- Custom field support

### Custom Handlers (Only When Needed)

Custom handlers override specific behaviors for entities requiring:

- **Specialized validation** (e.g., company hierarchy checks)
- **Domain-specific business logic** (e.g., contact duplicate detection)
- **Complex relationships** (e.g., multi-entity cascading updates)

**Current Custom Handlers:**

- `companies`: Organization hierarchy validation
- `contacts`: Duplicate detection

**See:** [docs/HANDLER_GUIDE.md](docs/HANDLER_GUIDE.md) for detailed handler
creation guide.

## Domain Service Re-exports

CRUD re-exports domain services from specialized packages:

### Accounting Services

Tax calculation, FX lookup, depreciation, revenue recognition, payment
allocation, fiscal period management, bank reconciliation.

**Source:** `afenda-accounting`

### Inventory Services

UOM conversion, three-way matching, manufacturing BOM, lot recall, landed cost
allocation.

**Source:** `afenda-inventory`

### CRM Services

Pricing engine, discount evaluation, budget enforcement.

**Source:** `afenda-crm`

### Intercompany Services

IC transaction creation, matching, elimination entries, reconciliation.

**Source:** `afenda-intercompany`

## Infrastructure Services

CRUD maintains these infrastructure services (not moved to domain packages):

- **Custom field management**: Dynamic field validation and synchronization
- **Document numbering**: Sequential number allocation with fiscal year prefixes
- **Webhook dispatch**: Event-driven integrations
- **Search outbox**: Full-text search index maintenance
- **Workflow outbox**: Workflow rule evaluation queue

## Quick Start

### Mutate Entity

```typescript
import { buildSystemContext, mutate } from 'afenda-crud';

const ctx = buildSystemContext(db, orgId);

const result = await mutate(ctx, 'sales-orders', 'create', {
  customerId: 'cust-123',
  orderDate: '2024-01-15',
  items: [{ productId: 'prod-456', quantity: 10 }],
});
```

### Read Entity

```typescript
import { readEntity } from 'afenda-crud';

const order = await readEntity(db, orgId, 'sales-orders', orderId);
```

### Use Domain Services

```typescript
import { calculateLineTax, priceLineItem } from 'afenda-crud';

// Tax calculation (from afenda-accounting)
const tax = await calculateLineTax(db, orgId, {
  taxRateId: 'rate-123',
  baseAmountMinor: 10000,
});

// Pricing (from afenda-crm)
const pricing = await priceLineItem(db, orgId, {
  productId: 'prod-456',
  customerId: 'cust-123',
  quantity: 10,
});
```

## Testing

Run tests:

```bash
pnpm test
```

---

**See Also:**

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - System architecture
- [docs/HANDLER_GUIDE.md](docs/HANDLER_GUIDE.md) - Custom handler creation guide
- [GOVERNANCE.md](../GOVERNANCE.md) - Dependency rules

## Dependencies

| Package           | Version       |
| ----------------- | ------------- |
| `afenda-canon`    | `workspace:*` |
| `afenda-database` | `workspace:*` |
| `afenda-logger`   | `workspace:*` |
| `afenda-workflow` | `workspace:*` |
| `drizzle-orm`     | `^0.44.0`     |
| `fast-json-patch` | `catalog:`    |
| `ioredis`         | `^5.4.1`      |

## Related Packages

- `afenda-canon`
- `afenda-database`
- `afenda-eslint-config`
- `afenda-logger`
- `afenda-typescript-config`
- `afenda-workflow`

## Contributing

### Development Workflow

1. Make changes to source files
2. Run `pnpm lint:fix` to fix linting issues
3. Run `pnpm type-check` to verify types
4. Run `pnpm test` to verify tests pass
5. Run `pnpm build` to verify build succeeds

### Code Quality

- All code must pass ESLint checks
- All code must pass TypeScript type checking
- All tests must pass
- Maintain or improve test coverage

<!-- AUTOGEN:END -->

# afenda-crud

The afenda Interaction Kernel (AIK) — deterministic mutation ledger for all
domain data writes.

## Public API

Only 3 functions are exported (K-05):

- `mutate(spec, ctx)` — the single entry point for all domain writes (create,
  update, delete, restore)
- `readEntity(type, id, ctx)` — read a single entity by ID
- `listEntities(type, ctx, options)` — list entities with filtering/pagination

## Usage

```typescript
import { mutate, readEntity } from 'afenda-crud';

const receipt = await mutate(
  {
    actionType: 'contacts.create',
    entityRef: { type: 'contacts' },
    input: { name: 'Acme Corp', email: 'hello@acme.com' },
  },
  ctx,
);
```

## Kernel Invariants

- **K-01**: `mutate()` is the only way to write domain data
- **K-02**: Single DB transaction per mutation
- **K-03**: Always writes `audit_logs` + `entity_versions`
- **K-04**: `expectedVersion` required on update/delete/restore
- **K-11**: Allowlist input + kernel backstop strips system columns

## Dependencies

`afenda-canon`, `afenda-database`, `afenda-logger`, `drizzle-orm`,
`fast-json-patch`
