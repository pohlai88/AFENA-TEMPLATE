# CRUD Handler Guide

This guide explains the handler architecture in the CRUD package and when to
create custom entity handlers.

## Overview

The CRUD package uses a **registry pattern with sparse handlers**. Most entities
(209 of 211) use the generic base handler, while a few require custom
implementations.

## Handler Architecture

### Base Handler (Generic CRUD)

The base handler provides:

- **Schema validation** via `afenda-canon`
- **Authorization** via policy engine
- **Lifecycle hooks** (beforeCreate, afterUpdate, etc.)
- **Audit logging** (creates audit trail for all mutations)
- **Custom field support** (validates and stores custom fields)
- **Rate limiting** (prevents abuse)
- **Job quota enforcement** (limits concurrent operations)

**Location**: `packages/crud/src/handlers/base-handler.ts`

### Custom Handlers

Custom handlers **override** specific behaviors while delegating common
operations to the base handler.

**Current Custom Handlers**:

- **companies**: Organization hierarchy validation, parent-child relationships
- **contacts**: Duplicate detection, email/phone uniqueness checks
- **stub**: Template for creating new handlers

**Location**: `packages/crud/src/handlers/`

## When to Create a Custom Handler

Create a custom handler when an entity requires:

### 1. Specialized Validation

Beyond schema validation - business rules that involve:

- Cross-entity checks (e.g., parent-child relationships)
- Temporal validations (e.g., "cannot modify closed fiscal period")
- State machine constraints (e.g., "approved → void requires approval")

**Example**: `companies` handler validates organization hierarchy depth and
ensures no circular parent references.

### 2. Domain-Specific Business Logic

Operations that involve:

- Complex calculations specific to the entity
- Multi-step workflows
- Orchestration of domain services

**Example**: `contacts` handler performs duplicate detection across multiple
fields (email, phone, name similarity).

### 3. Complex Relationships

Entities that:

- Cascade updates to related entities
- Maintain referential integrity beyond foreign keys
- Trigger side effects in other systems

**Example**: Deleting a `customer` might trigger deactivation of related
`sales-orders`, `subscriptions`, and `payment-methods`.

### 4. Custom Authorization

Beyond row-level security:

- Field-level permissions (e.g., only managers can edit salary)
- State-based access (e.g., only creator can delete draft)
- Time-based restrictions (e.g., cannot edit after 30 days)

**Example**: `invoices` might allow edits only within 24 hours of creation, then
require reversal + new invoice.

## When NOT to Create a Custom Handler

**Use the base handler if**:

- Entity only needs schema validation
- No special business rules
- Standard CRUD operations suffice
- Authorization handled by policy engine

**209 entity types use the base handler successfully.**

## Handler Lifecycle Hooks

Custom handlers can override these hooks:

### Create Lifecycle

```typescript
beforeCreate(ctx, input)  → Validate, transform, check permissions
  ↓
[Base handler creates record]
  ↓
afterCreate(ctx, result)  → Trigger workflows, send notifications
```

### Update Lifecycle

```typescript
beforeUpdate(ctx, id, input)  → Validate changes, check edit windows
  ↓
[Base handler updates record]
  ↓
afterUpdate(ctx, previous, updated)  → Audit significant changes
```

### Delete Lifecycle

```typescript
beforeDelete(ctx, id)  → Check if deletion allowed, cascade checks
  ↓
[Base handler soft-deletes or hard-deletes]
  ↓
afterDelete(ctx, deleted)  → Clean up related data
```

## Creating a Custom Handler

### Step 1: Create Handler File

```typescript
// packages/crud/src/handlers/my-entity-handler.ts

import { BaseHandler } from './base-handler.js';
import type { CreateInput, HandlerContext, UpdateInput } from '../types.js';

export class MyEntityHandler extends BaseHandler {
  constructor() {
    super('my-entities'); // Table name
  }

  /**
   * Override beforeCreate to add custom validation
   */
  async beforeCreate(ctx: HandlerContext, input: CreateInput) {
    // Custom validation
    if (input.someField === 'invalid') {
      throw new Error('someField cannot be "invalid"');
    }

    // Call parent to get standard validation
    return super.beforeCreate(ctx, input);
  }

  /**
   * Override afterCreate to trigger side effects
   */
  async afterCreate(ctx: HandlerContext, result: any) {
    // Trigger workflow
    await triggerWorkflow(ctx.db, result.id, 'my-entity-created');

    // Send notification
    await sendNotification(ctx.orgId, {
      type: 'entity-created',
      entityId: result.id,
    });

    return super.afterCreate(ctx, result);
  }
}
```

### Step 2: Register Handler

```typescript
// packages/crud/src/handlers/index.ts

import { MyEntityHandler } from './my-entity-handler.js';

export const handlers = {
  companies: new CompaniesHandler(),
  contacts: new ContactsHandler(),
  'my-entities': new MyEntityHandler(), // ← Add your handler
};
```

### Step 3: Test Handler

```typescript
// packages/crud/src/handlers/__tests__/my-entity-handler.test.ts

import { describe, expect, it } from 'vitest';
import { MyEntityHandler } from '../my-entity-handler.js';

describe('MyEntityHandler', () => {
  it('should reject invalid someField', async () => {
    const handler = new MyEntityHandler();
    const ctx = createTestContext();

    await expect(handler.beforeCreate(ctx, { someField: 'invalid' })).rejects.toThrow(
      'someField cannot be "invalid"',
    );
  });

  it('should allow valid input', async () => {
    const handler = new MyEntityHandler();
    const ctx = createTestContext();

    await expect(handler.beforeCreate(ctx, { someField: 'valid' })).resolves.not.toThrow();
  });
});
```

## Best Practices

### 1. Delegate to Base Handler

Always call `super.method()` to leverage base functionality:

```typescript
async beforeCreate(ctx, input) {
  // Custom logic BEFORE base validation
  await myCustomValidation(input);

  // Delegate to base handler
  return super.beforeCreate(ctx, input);
}
```

### 2. Keep Handlers Thin

Handlers orchestrate - they don't implement business logic:

```typescript
// ❌ BAD: Handler implements complex logic
async beforeCreate(ctx, input) {
  const taxRate = await db.query(...);
  const discount = calculateDiscount(input.price, input.quantity);
  const total = (input.price - discount) * (1 + taxRate);
  // ... more calculations
}

// ✅ GOOD: Handler delegates to domain service
async beforeCreate(ctx, input) {
  const pricingResult = await priceLineItem(ctx.db, ctx.orgId, {
    productId: input.productId,
    quantity: input.quantity,
  });

  return { ...input, total: pricingResult.totalMinor };
}
```

### 3. Use Domain Services

Import from domain packages, not from CRUD services:

```typescript
// ✅ GOOD: Import from domain package
import { checkBudget } from 'afenda-crm';
import { calculateLineTax } from 'afenda-accounting';
import { convertUom } from 'afenda-inventory';
```

### 4. Fail Fast

Validate early to avoid partial state:

```typescript
async beforeCreate(ctx, input) {
  // Validate BEFORE any database writes
  if (!input.requiredField) {
    throw new Error('requiredField is required');
  }

  // Check authorization BEFORE mutation
  if (!ctx.hasPermission('create', 'my-entity')) {
    throw new Error('Insufficient permissions');
  }

  // Then proceed with creation
  return super.beforeCreate(ctx, input);
}
```

### 5. Document Trade-offs

If bypassing base handler, document why:

```typescript
/**
 * Override create() entirely for performance.
 *
 * Rationale: Bulk import of 100k+ records bypasses
 * audit logging and policy checks for speed.
 * Only available to system administrators.
 */
async bulkCreate(ctx, inputs) {
  if (!ctx.isSystemAdmin) {
    throw new Error('Only system admins can bulk import');
  }

  return db.insert(...inputs);
}
```

## Examples

### Example 1: Companies Handler (Hierarchy Validation)

```typescript
export class CompaniesHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // Validate parent exists
    if (input.parentId) {
      const parent = await this.findById(ctx, input.parentId);
      if (!parent) {
        throw new Error(`Parent company ${input.parentId} not found`);
      }

      // Prevent excessive nesting
      const depth = await this.getHierarchyDepth(ctx, input.parentId);
      if (depth >= 5) {
        throw new Error('Maximum hierarchy depth (5 levels) exceeded');
      }
    }

    return super.beforeCreate(ctx, input);
  }

  private async getHierarchyDepth(ctx, companyId, depth = 0) {
    const company = await this.findById(ctx, companyId);
    if (!company.parentId) return depth;
    return this.getHierarchyDepth(ctx, company.parentId, depth + 1);
  }
}
```

### Example 2: Contacts Handler (Duplicate Detection)

```typescript
export class ContactsHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // Check for duplicates by email
    if (input.email) {
      const existing = await this.findByEmail(ctx, input.email);
      if (existing) {
        throw new Error(`Contact with email ${input.email} already exists`);
      }
    }

    // Fuzzy name matching
    if (input.fullName) {
      const similar = await this.findSimilarNames(ctx, input.fullName);
      if (similar.length > 0) {
        console.warn(`Possible duplicate contacts found:`, similar);
        // Could trigger manual review workflow
      }
    }

    return super.beforeCreate(ctx, input);
  }
}
```

## Testing Handlers

### Unit Tests

Test handler logic in isolation:

```typescript
describe('MyEntityHandler', () => {
  it('validates required fields', async () => {
    const handler = new MyEntityHandler();
    await expect(handler.beforeCreate(mockCtx, {})).rejects.toThrow('requiredField is required');
  });
});
```

### Integration Tests

Test with real database:

```typescript
describe('MyEntityHandler Integration', () => {
  it('creates entity with audit log', async () => {
    const handler = new MyEntityHandler();
    const result = await handler.create(dbCtx, testInput);

    expect(result.id).toBeDefined();
    const auditLog = await getAuditLog(result.id);
    expect(auditLog).toHaveLength(1);
  });
});
```

## Migration Guide

### Moving Service Logic to Domain Packages

If a handler becomes complex with domain logic:

**Before**:

```typescript
// packages/crud/src/handlers/sales-order-handler.ts
export class SalesOrderHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    // 100+ lines of pricing, tax, discount logic
  }
}
```

**After**:

```typescript
// packages/sales/src/services/order-pricing.ts
export async function priceOrder(db, orgId, input) {
  // Pricing logic moved to sales domain package
}

// packages/crud/src/handlers/sales-order-handler.ts
import { priceOrder } from 'afenda-sales';

export class SalesOrderHandler extends BaseHandler {
  async beforeCreate(ctx, input) {
    const pricedOrder = await priceOrder(ctx.db, ctx.orgId, input);
    return { ...input, ...pricedOrder };
  }
}
```

**Benefits**:

- Domain logic testable independently
- Reusable across handlers
- Handler stays thin

---

**See Also**:

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Overall architecture
- [packages/GOVERNANCE.md](../GOVERNANCE.md) - Dependency rules
- [docs/CODING_STANDARDS.md](../../docs/CODING_STANDARDS.md) - Code conventions
