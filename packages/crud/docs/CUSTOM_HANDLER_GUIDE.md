# Custom Handler Development Guide

**Last Updated:** February 19, 2026  
**CRUD Version:** v1.1-T  
**Audience:** Backend developers creating entity-specific handlers

---

## Overview

Most entities (209 of 211) use the **base handler** via `createBaseHandler()`. Custom handlers are **rare** and should only be created when the base handler's generic behavior is insufficient.

This guide explains:
1. When to create a custom handler
2. How to structure a custom handler
3. Required justification documentation
4. Testing requirements

---

## When to Create a Custom Handler

Create a custom handler **only** if you need one or more of these:

### ✅ Valid Reasons

1. **Cross-entity constraints** not expressible in FK/unique constraints
   - Example: Cycle detection in hierarchical data
   - Example: Depth limits on nested structures
   - Example: Temporal constraints requiring complex queries

2. **Cross-aggregate orchestration**
   - Example: Coordinating multiple Layer 2 domain services
   - Example: Generating related truth rows across multiple tables in one transaction
   - Example: Complex denormalization requiring multiple table writes

3. **Specialized outbox intent planning**
   - Example: Entity requires non-standard workflow/search/webhook payloads
   - Example: Custom integration events beyond standard patterns
   - Example: Complex event enrichment requiring domain service calls

4. **Field-level exceptions**
   - Example: Entity requires unique writable-field strategy beyond Canon contract defaults
   - Example: Dynamic field allowlists based on entity state
   - Example: Computed fields requiring domain service calls

### ❌ Invalid Reasons (Use Base Handler Instead)

- Simple CRUD operations (create/update/delete/restore)
- Standard lifecycle state machines (use Canon EntityContract)
- Basic field validation (use Zod schemas in Canon)
- Standard audit/versioning (handled by kernel)
- Standard outbox intents (workflow/search handled by kernel)

---

## Handler Interface (v1.1)

```typescript
import type { EntityHandlerV11 } from './types';
import type { MutationContext } from '../context';
import type { MutationPlan } from 'afenda-canon';
import type { DbTransaction } from 'afenda-database';

export interface EntityHandlerV11 {
  /** Discriminant for v1.1 handlers */
  readonly __v11: true;

  /** Entity type (matches TABLE_REGISTRY key) */
  entityType: string;

  // ── Plan Phase Hooks (read-only, no DB writes) ──────────────────

  planCreate?: (
    ctx: PlanContext,
    input: Record<string, unknown>
  ) => Promise<PlannedMutation>;

  planUpdate?: (
    ctx: PlanContext,
    current: Record<string, unknown>,
    input: Record<string, unknown>
  ) => Promise<PlannedMutation>;

  planDelete?: (
    ctx: PlanContext,
    current: Record<string, unknown>
  ) => Promise<PlannedMutation>;

  planRestore?: (
    ctx: PlanContext,
    current: Record<string, unknown>
  ) => Promise<PlannedMutation>;

  // ── Commit Phase Hook (DB-only, inside transaction) ─────────────

  commitAfterEntityWrite?: (
    tx: DbTransaction,
    plan: MutationPlan,
    written: Record<string, unknown>
  ) => Promise<void>;

  // ── Optional Field Allowlist Override ────────────────────────────

  pickWritableFields?: (
    verb: string,
    input: Record<string, unknown>
  ) => Record<string, unknown>;
}

export interface PlannedMutation {
  /** Sanitized, field-policy-enforced input */
  sanitizedInput: Record<string, unknown>;
  
  /** Additional outbox intents beyond standard workflow/search */
  outboxIntents?: OutboxIntent[];
}
```

---

## Required Justification Header

**Every custom handler MUST include this header at the top of the file:**

```typescript
/**
 * CUSTOM HANDLER JUSTIFICATION
 * 
 * Entity: [entity-type]
 * Created: [YYYY-MM-DD]
 * Author: [name]
 * 
 * Why base handler is insufficient:
 * - [Specific reason from valid reasons list above]
 * 
 * What invariant or constraint requires custom logic:
 * - [Business rule or technical constraint]
 * 
 * What Layer 2 services are called (if any):
 * - [List domain services: afenda-accounting, afenda-crm, etc.]
 * 
 * What outbox intents are produced:
 * - [List custom intents beyond standard workflow/search]
 * 
 * Why this does NOT belong in Layer 2:
 * - [Explain why this is orchestration, not domain logic]
 */
```

---

## Template: Custom Handler with Plan Hooks

```typescript
/**
 * CUSTOM HANDLER JUSTIFICATION
 * 
 * Entity: invoices
 * Created: 2026-02-19
 * Author: Backend Team
 * 
 * Why base handler is insufficient:
 * - Requires FX rate lookup for multi-currency invoices
 * - Requires line-level tax calculation via accounting domain
 * - Requires custom webhook payload for external billing system
 * 
 * What invariant or constraint requires custom logic:
 * - Multi-currency invoices must lock FX rate at document date
 * - Tax calculation must use jurisdiction-specific rules
 * - External billing system requires denormalized line items in webhook
 * 
 * What Layer 2 services are called:
 * - afenda-accounting: lookupFxRate(), calculateLineTax()
 * 
 * What outbox intents are produced:
 * - Standard: workflow, search
 * - Custom: webhook to external billing system with enriched payload
 * 
 * Why this does NOT belong in Layer 2:
 * - This is orchestration of multiple domain services
 * - Domain services are pure (no side effects)
 * - Outbox intent planning is CRUD's responsibility
 */

import type { EntityHandlerV11, PlanContext, PlannedMutation } from './types';
import { lookupFxRate, calculateLineTax } from 'afenda-accounting';
import type { OutboxIntent } from 'afenda-canon';

export const invoicesHandler: EntityHandlerV11 = {
  __v11: true as const,
  entityType: 'invoices',

  async planCreate(ctx: PlanContext, input: Record<string, unknown>): Promise<PlannedMutation> {
    const sanitized = { ...input };

    // 1. Lookup FX rate if multi-currency
    if (input.currency !== 'USD') {
      const fxRate = await lookupFxRate(ctx.ctx.db, ctx.orgId, {
        fromCurrency: input.currency as string,
        toCurrency: 'USD',
        date: input.documentDate as string,
      });
      sanitized.fxRate = fxRate.rate;
      sanitized.fxRateDate = fxRate.date;
    }

    // 2. Calculate line-level taxes
    if (Array.isArray(input.lines)) {
      sanitized.lines = await Promise.all(
        input.lines.map(async (line: any) => {
          const tax = await calculateLineTax(ctx.ctx.db, ctx.orgId, {
            baseMinor: line.amountMinor,
            taxRateId: line.taxRateId,
          });
          return { ...line, taxMinor: tax.taxMinor };
        })
      );
    }

    // 3. Build custom webhook intent
    const outboxIntents: OutboxIntent[] = [
      {
        kind: 'webhook',
        op: 'create',
        entityType: 'invoices',
        entityId: '$ENTITY_ID', // Kernel replaces after entity write
        payload: {
          invoiceNumber: input.invoiceNumber,
          customerRef: input.customerRef,
          lines: sanitized.lines,
          totalMinor: input.totalMinor,
        },
      },
    ];

    return { sanitizedInput: sanitized, outboxIntents };
  },

  async planUpdate(ctx: PlanContext, current: Record<string, unknown>, input: Record<string, unknown>): Promise<PlannedMutation> {
    // Similar logic for updates
    return { sanitizedInput: input };
  },
};
```

---

## Template: Custom Handler with Commit Hook

```typescript
/**
 * CUSTOM HANDLER JUSTIFICATION
 * 
 * Entity: sales-orders
 * Created: 2026-02-19
 * 
 * Why base handler is insufficient:
 * - Requires writing related allocation records to inventory_allocations table
 * - Allocations must be atomic with order creation
 * 
 * What invariant or constraint requires custom logic:
 * - Inventory must be reserved atomically with order creation
 * - Allocation records must reference the order ID
 * 
 * What Layer 2 services are called:
 * - afenda-inventory: calculateAvailableStock()
 * 
 * What outbox intents are produced:
 * - Standard workflow/search intents only
 * 
 * Why this does NOT belong in Layer 2:
 * - This is cross-table orchestration within a single transaction
 * - Domain service provides calculation, CRUD writes the results
 */

import type { EntityHandlerV11 } from './types';
import type { DbTransaction } from 'afenda-database';
import type { MutationPlan } from 'afenda-canon';
import { inventoryAllocations } from 'afenda-database';

export const salesOrdersHandler: EntityHandlerV11 = {
  __v11: true as const,
  entityType: 'sales-orders',

  async commitAfterEntityWrite(
    tx: DbTransaction,
    plan: MutationPlan,
    written: Record<string, unknown>
  ): Promise<void> {
    // Write related allocation records
    const lines = written.lines as Array<{ itemId: string; quantityOrdered: number }>;
    
    for (const line of lines) {
      await tx.insert(inventoryAllocations).values({
        orgId: written.orgId as string,
        orderId: written.id as string,
        itemId: line.itemId,
        quantityAllocated: line.quantityOrdered,
        allocatedAt: new Date(),
      });
    }
  },
};
```

---

## Phase-Based Rules

### Plan Phase (Read-Only)

**✅ Allowed:**
- Validate and normalize input beyond schema
- Load additional DB data for decision-making (via `withReadSession`)
- Call Layer 2 domain services that are **pure** (no external IO)
- Compute derived fields deterministically
- Produce outbox intents as **intent objects**

**❌ Forbidden:**
- Any DB writes
- Any external IO (HTTP, queues, search engines, Redis)
- Embedding domain rules (belongs in Layer 2)

### Commit Phase (DB-Only)

**✅ Allowed:**
- Final DB-only constraint checks
- Write related truth rows within same transaction
- Attach additional audit metadata
- Add additional outbox rows (from pre-computed intents)

**❌ Forbidden:**
- External IO
- Queue publishing
- Webhook sending
- Cache invalidation
- Redis operations

### Deliver Phase (Best-Effort)

**Handlers should NOT implement deliver hooks.** Use outbox intents instead.

---

## Testing Requirements

### 1. Unit Tests (Required)

```typescript
// packages/crud/src/handlers/__tests__/invoices.test.ts
import { describe, expect, test } from 'vitest';
import { invoicesHandler } from '../invoices';

describe('invoicesHandler', () => {
  test('planCreate enriches with FX rate for multi-currency', async () => {
    const result = await invoicesHandler.planCreate!(mockCtx, {
      currency: 'EUR',
      documentDate: '2026-02-19',
    });

    expect(result.sanitizedInput.fxRate).toBeDefined();
    expect(result.sanitizedInput.fxRateDate).toBe('2026-02-19');
  });

  test('planCreate calculates line-level taxes', async () => {
    const result = await invoicesHandler.planCreate!(mockCtx, {
      lines: [{ amountMinor: 10000, taxRateId: 'tax-1' }],
    });

    expect(result.sanitizedInput.lines[0].taxMinor).toBeDefined();
  });

  test('planCreate produces webhook outbox intent', async () => {
    const result = await invoicesHandler.planCreate!(mockCtx, {
      invoiceNumber: 'INV-001',
    });

    expect(result.outboxIntents).toHaveLength(1);
    expect(result.outboxIntents![0].kind).toBe('webhook');
  });
});
```

### 2. Integration Tests (Recommended)

Test the full mutation flow with your custom handler:

```typescript
test('invoice creation with FX rate lookup (integration)', async () => {
  const receipt = await mutate({
    actionType: 'invoices.create',
    entityRef: { type: 'invoices' },
    input: {
      currency: 'EUR',
      documentDate: '2026-02-19',
      totalMinor: 10000,
    },
  }, ctx);

  expect(receipt.status).toBe('ok');
  
  // Verify FX rate was stored
  const invoice = await readEntity('invoices', receipt.entityId!, ctx);
  expect(invoice.fxRate).toBeDefined();
});
```

### 3. CI Gate Coverage (Required)

Add your handler to `tools/ci-gates/outbox-intent-coverage.test.ts` if it produces custom intents:

```typescript
const HANDLERS_WITH_SIDE_EFFECTS = [
  'invoices',     // ← Add here
  'payments',
  'journal-entries',
];
```

---

## Common Patterns

### Pattern 1: $ENTITY_ID Placeholder

For create mutations, use `$ENTITY_ID` placeholder in outbox intents:

```typescript
outboxIntents: [{
  kind: 'webhook',
  entityId: '$ENTITY_ID', // Kernel replaces after entity write
  payload: { ... }
}]
```

### Pattern 2: Conditional Outbox Intents

```typescript
const outboxIntents: OutboxIntent[] = [];

if (input.notifyCustomer) {
  outboxIntents.push({
    kind: 'webhook',
    op: 'create',
    entityType: 'invoices',
    entityId: '$ENTITY_ID',
    payload: { ... },
  });
}

return { sanitizedInput, outboxIntents };
```

### Pattern 3: Domain Service Orchestration

```typescript
// ✅ Good: Call domain services, orchestrate results
const fxRate = await lookupFxRate(...);
const tax = await calculateLineTax(...);
const total = input.subtotal + tax.taxMinor;

// ❌ Bad: Implement domain logic in handler
const tax = input.subtotal * 0.0825; // Tax logic belongs in domain
```

---

## Handler Purity Rules

### H-01: No domain rules in handlers

**❌ Wrong:**
```typescript
const taxMinor = subtotalMinor * 0.0825; // Domain logic
```

**✅ Correct:**
```typescript
const taxMinor = await calculateLineTax(ctx.db, ctx.orgId, ...); // Domain service
```

### H-02: No external IO in handlers

**❌ Wrong:**
```typescript
await fetch('https://example.com/webhook'); // External IO
```

**✅ Correct:**
```typescript
outboxIntents.push({ kind: 'webhook', ... }); // Intent for worker
```

### H-03: All must-not-lose side effects become outbox intents

If it must not be lost, it must be in `outboxIntents` and written in Commit.

### H-04: Keep handlers thin

A handler exceeding ~200-300 lines is a smell. Move logic to:
- Layer 2 domain service (if business logic)
- `plan/enforce/*` (if kernel gate)
- `commit/*` (if DB writer)
- Outbox worker (if delivery)

---

## Registration

Add your handler to the registry:

```typescript
// packages/crud/src/registries/handler-registry.ts
import { invoicesHandler } from '../handlers/invoices';

export const HANDLER_REGISTRY: Record<string, EntityHandler> = {
  companies: companiesHandler,
  contacts: contactsHandler,
  invoices: invoicesHandler, // ← Add here
};
```

---

## Review Checklist

Before submitting a custom handler for review:

- [ ] Justification header is complete and accurate
- [ ] Handler uses v1.1 interface (`__v11: true`)
- [ ] Plan hooks are read-only (no DB writes)
- [ ] Commit hooks are DB-only (no external IO)
- [ ] No domain logic embedded (delegates to Layer 2)
- [ ] Outbox intents used for must-not-lose side effects
- [ ] Unit tests cover all plan/commit hooks
- [ ] Integration test verifies full mutation flow
- [ ] Handler added to CI gate coverage (if has side effects)
- [ ] Handler registered in `HANDLER_REGISTRY`
- [ ] Handler file is <300 lines

---

## Getting Help

**Questions?** Check these resources:

1. `crud.architecture.md` - Full kernel architecture
2. `INTEGRATION_PLAN.md` - Implementation history
3. `handlers/base-handler.ts` - Base handler reference
4. `handlers/types.ts` - Handler interface definitions

**Still stuck?** Ask in #backend-architecture channel.

---

**Remember:** Most entities don't need custom handlers. When in doubt, use `createBaseHandler()`.
