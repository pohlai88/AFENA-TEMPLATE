# Coding Standards

This document defines coding standards and best practices for the AFENDA-NEXUS monorepo. Following these standards ensures consistency, maintainability, and quality across the codebase.

## Table of Contents

- [Package Standards](#package-standards)
- [TypeScript Standards](#typescript-standards)
- [Naming Conventions](#naming-conventions)
- [Service Patterns](#service-patterns)
- [Handler Patterns](#handler-patterns)
- [Testing Standards](#testing-standards)
- [Documentation Standards](#documentation-standards)
- [Git Workflow](#git-workflow)

---

## Package Standards

### Package Creation

Before creating a new package, verify:

1. **Single Responsibility**: The package has one clear, well-defined purpose
2. **Cohesion**: Related functionality (5+ services or significant domain)
3. **Layer Placement**: Correctly assigned to Layer 0, 1, 2, or 3
4. **No Duplication**: Functionality doesn't exist elsewhere
5. **Future Use**: Package will be used by 2+ consumers or has clear roadmap

### Package Structure

All packages follow this structure:

```
packages/my-package/
├── src/
│   ├── index.ts              # Public API exports ONLY
│   ├── types.ts              # Type definitions (if substantial)
│   ├── services/             # Business logic
│   │   ├── service-a.ts
│   │   └── service-b.ts
│   ├── utils/                # Internal utilities
│   │   └── helpers.ts
│   └── __tests__/            # Co-located tests
│       ├── service-a.test.ts
│       └── service-b.test.ts
├── docs/                     # Extended documentation (optional)
│   └── IMPLEMENTATION.md
├── package.json
├── tsconfig.json
├── tsconfig.build.json       # If compiled package
├── tsup.config.ts            # If compiled package
├── vitest.config.ts          # If has tests
├── eslint.config.js
└── README.md                 # Required
```

### Public API (`src/index.ts`)

**Rules**:

1. **Export only public API** - Internal modules stay private
2. **Minimal surface** - Don't export everything "just in case"
3. **Stable** - The public API is a contract; breaking changes require major version bump
4. **Documented** - JSDoc comments for all exports

**Example**:

```typescript
// src/index.ts - Good ✅
export { mutate, readEntity, listEntities } from './crud-operations';
export { type MutateRequest, type MutateResponse } from './types';
export { policyEngine } from './policies';

// ❌ Don't export internals
// export { internalHelper } from './utils/internal';
```

### Dependencies

**Rules**:

1. **Explicit**: All dependencies in `package.json` - no implicit file system access
2. **Minimal**: Only depend on what you actually use
3. **Layer-compliant**: Follow governance rules (see `GOVERNANCE.md`)
4. **Version pinning**: Use catalog versions for consistency

**Example**:

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "zod": "catalog:"
  },
  "peerDependencies": {
    "typescript": ">=5.0.0"
  }
}
```

---

## TypeScript Standards

### Strict Mode

All packages MUST use strict TypeScript:

```json
// tsconfig.json
{
  "extends": "@afenda/typescript-config/base.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### Type Safety

**Rules**:

1. **No `any`** - Use `unknown` and type guards instead
2. **Explicit return types** - On all public functions
3. **Discriminated unions** - For polymorphic types
4. **Type guards** - Use Zod or manual type guards
5. **Avoid type assertions** - Use type guards instead

**Example**:

```typescript
// ❌ Bad
export function process(data: any) {
  return data.value;
}

// ✅ Good
export function process(data: unknown): string {
  if (!isValidData(data)) {
    throw new Error('Invalid data');
  }
  return data.value;
}

function isValidData(data: unknown): data is { value: string } {
  return (
    typeof data === 'object' && data !== null && 'value' in data && typeof data.value === 'string'
  );
}
```

### Zod Schemas

**When to use Zod**:

- ✅ API request/response validation
- ✅ External data parsing (CSV, JSON imports)
- ✅ Configuration validation
- ✅ Database row parsing (when needed)

**Pattern**:

```typescript
import { z } from 'zod';

// Define schema
export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  totalAmount: z.number().positive(),
});

// Infer type
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Use for validation
export function createOrder(input: unknown): CreateOrderInput {
  return CreateOrderSchema.parse(input);
}
```

---

## Naming Conventions

### Entities and Types

**Rules**:

- **Entity types**: `kebab-case` plural (e.g., `sales-orders`, `purchase-invoices`)
- **TypeScript types**: `PascalCase` (e.g., `SalesOrder`, `PurchaseInvoice`)
- **Zod schemas**: `PascalCase` + `Schema` suffix (e.g., `SalesOrderSchema`)

**Example**:

```typescript
// Entity type (canon)
export const entityTypes = {
  SALES_ORDER: 'sales-orders',
  PURCHASE_INVOICE: 'purchase-invoices',
} as const;

// TypeScript type
export type SalesOrder = {
  id: string;
  customerId: string;
  // ...
};

// Zod schema
export const SalesOrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  // ...
});
```

### Database

**Rules**:

- **Table names**: `snake_case` plural (e.g., `sales_orders`, `purchase_invoices`)
- **Column names**: `snake_case` (e.g., `customer_id`, `total_amount`)
- **Foreign keys**: `{related_table}_id` (e.g., `company_id`, `customer_id`)
- **Indexes**: `idx_{table}_{columns}` (e.g., `idx_sales_orders_customer_id`)
- **Constraints**: `{table}_{column}_check` (e.g., `sales_orders_total_amount_check`)

**Example**:

```typescript
export const salesOrders = pgTable(
  'sales_orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => contacts.id),
    totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    customerIdx: index('idx_sales_orders_customer_id').on(table.customerId),
    totalCheck: check('sales_orders_total_amount_check', sql`${table.totalAmount} >= 0`),
  }),
);
```

### Files and Packages

**Rules**:

- **Package names**: `afenda-{domain}` (e.g., `afenda-accounting`, `afenda-inventory`)
- **File names**: `kebab-case.ts` (e.g., `tax-engine.ts`, `pricing-engine.ts`)
- **Test files**: `{filename}.test.ts` or `{filename}.spec.ts`
- **Type files**: `types.ts`, `schemas.ts`

### Functions and Variables

**Rules**:

- **Functions**: `camelCase` verbs (e.g., `calculateTax`, `validateOrder`)
- **Variables**: `camelCase` nouns (e.g., `taxAmount`, `orderTotal`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Private/internal**: Prefix with `_` only when needed (prefer module scope)

**Example**:

```typescript
const MAX_BATCH_SIZE = 100;

export function calculateDepreciation(asset: Asset, method: DepreciationMethod): number {
  const depreciationRate = getDepreciationRate(method);
  return asset.cost * depreciationRate;
}

function getDepreciationRate(method: DepreciationMethod): number {
  // Internal helper
  // ...
}
```

---

## Service Patterns

Services implement domain logic. They should be **pure functions** when possible.

### Service Structure

```typescript
// packages/accounting/src/services/tax-engine.ts

import { type TaxCalculationInput, type TaxCalculationResult } from '../types';
import { db, taxRates } from 'afenda-database';
import { eq } from 'drizzle-orm';

/**
 * Calculate tax for a transaction
 *
 * @param input - Transaction details and tax context
 * @returns Tax calculation result with line-item breakdown
 */
export async function calculateTax(input: TaxCalculationInput): Promise<TaxCalculationResult> {
  // 1. Validate input
  if (input.amount <= 0) {
    throw new Error('Amount must be positive');
  }

  // 2. Fetch tax rates
  const rate = await db.query.taxRates.findFirst({
    where: eq(taxRates.jurisdiction, input.jurisdiction),
  });

  if (!rate) {
    throw new Error(`No tax rate found for ${input.jurisdiction}`);
  }

  // 3. Calculate
  const taxAmount = input.amount * (rate.rate / 100);

  // 4. Return result
  return {
    baseAmount: input.amount,
    taxRate: rate.rate,
    taxAmount,
    totalAmount: input.amount + taxAmount,
    breakdown: [{ type: rate.type, rate: rate.rate, amount: taxAmount }],
  };
}
```

### Service Best Practices

1. **Single Responsibility**: One service function = one business operation
2. **Pure When Possible**: Minimize side effects; prefer returning values
3. **Dependency Injection**: Accept database/logger as parameters (optional)
4. **Error Handling**: Throw typed errors with clear messages
5. **Async/Await**: Use async/await, not callbacks
6. **Type Safety**: Explicit input/output types
7. **Documentation**: JSDoc with examples

**Dependency Injection Example**:

```typescript
export type TaxEngineContext = {
  db: Database;
  logger: Logger;
};

export async function calculateTax(
  input: TaxCalculationInput,
  ctx: TaxEngineContext,
): Promise<TaxCalculationResult> {
  ctx.logger.info({ input }, 'Calculating tax');

  // ... implementation

  return result;
}
```

---

## Handler Patterns

Handlers are entity-specific customizations in the CRUD layer. Most entities use the **base handler**; only create custom handlers when needed.

### When to Create a Handler

Create a custom handler when an entity needs:

1. **Custom validation** beyond schema (e.g., duplicate detection)
2. **Complex lifecycle hooks** (e.g., org hierarchy updates)
3. **Entity-specific business rules** (e.g., approval workflows)
4. **Data enrichment** (e.g., geocoding addresses)

**Default: Use base handler** - It covers 95% of cases.

### Handler Structure

```typescript
// packages/crud/src/handlers/companies.ts

import { type Handler, type MutateContext } from '../types';
import { type Company } from 'afenda-canon';
import { companies, db } from 'afenda-database';
import { eq } from 'drizzle-orm';

export const companiesHandler: Handler<Company> = {
  // Before create hook
  async beforeCreate(input, ctx: MutateContext) {
    // Custom validation: Check for duplicate company name
    const existing = await db.query.companies.findFirst({
      where: eq(companies.name, input.name),
    });

    if (existing) {
      throw new Error(`Company "${input.name}" already exists`);
    }

    return input; // Return modified input or original
  },

  // After create hook
  async afterCreate(company, ctx: MutateContext) {
    // Side effect: Create default fiscal year
    await ctx.workflow.trigger({
      event: 'company.created',
      entityId: company.id,
    });
  },

  // Before update hook
  async beforeUpdate(id, input, ctx: MutateContext) {
    // Custom logic: Validate hierarchy
    if (input.parentCompanyId) {
      await validateCompanyHierarchy(id, input.parentCompanyId);
    }

    return input;
  },

  // After update hook
  async afterUpdate(company, ctx: MutateContext) {
    // Update related entities
    ctx.logger.info({ companyId: company.id }, 'Company updated');
  },

  // Before delete hook
  async beforeDelete(id, ctx: MutateContext) {
    // Prevent delete if has children
    const children = await db.query.companies.findMany({
      where: eq(companies.parentCompanyId, id),
    });

    if (children.length > 0) {
      throw new Error('Cannot delete company with child companies');
    }
  },
};

// Helper function (not exported)
async function validateCompanyHierarchy(id: string, parentId: string): Promise<void> {
  // Check for circular reference
  // ...
}
```

### Handler Registration

```typescript
// packages/crud/src/handlers/index.ts

import { companiesHandler } from './companies';
import { contactsHandler } from './contacts';
import { baseHandler } from './base';

export const handlerRegistry = {
  companies: companiesHandler,
  contacts: contactsHandler,
  // All other entities use base handler
  '*': baseHandler,
};

export function getHandler(entityType: string): Handler {
  return handlerRegistry[entityType] ?? handlerRegistry['*'];
}
```

### Handler Best Practices

1. **Minimal Handlers**: Only override hooks you need
2. **Delegate to Base**: Call base handler for common operations
3. **Stateless**: Handlers should not maintain state
4. **Idempotent**: Operations should be retryable
5. **Fast**: Handlers block the request cycle; keep them quick
6. **Logged**: Use `ctx.logger` for observability

---

## Testing Standards

### Coverage Goals

- **Migration**: >80% (enforced)
- **Domain Services**: >70%
- **CRUD Handlers**: >60%
- **Utilities**: >80%

### Test Structure

```typescript
// packages/accounting/src/services/__tests__/tax-engine.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { calculateTax } from '../tax-engine';

describe('calculateTax', () => {
  describe('when given valid input', () => {
    it('calculates tax correctly for US jurisdiction', async () => {
      const result = await calculateTax({
        amount: 100,
        jurisdiction: 'US-CA',
        date: new Date('2026-01-15'),
      });

      expect(result.taxAmount).toBe(8.5); // 8.5% CA rate
      expect(result.totalAmount).toBe(108.5);
    });

    it('handles multiple tax components', async () => {
      const result = await calculateTax({
        amount: 100,
        jurisdiction: 'US-NY',
        date: new Date('2026-01-15'),
      });

      expect(result.breakdown).toHaveLength(2); // State + County
    });
  });

  describe('when given invalid input', () => {
    it('throws error for negative amount', async () => {
      await expect(
        calculateTax({ amount: -10, jurisdiction: 'US-CA', date: new Date() }),
      ).rejects.toThrow('Amount must be positive');
    });

    it('throws error for unknown jurisdiction', async () => {
      await expect(
        calculateTax({ amount: 100, jurisdiction: 'UNKNOWN', date: new Date() }),
      ).rejects.toThrow('No tax rate found');
    });
  });

  describe('when tax rates change', () => {
    beforeEach(async () => {
      // Test setup: Insert test tax rate
      await db.insert(taxRates).values({
        jurisdiction: 'TEST',
        rate: 10,
        effectiveFrom: new Date('2026-01-01'),
      });
    });

    it('uses correct rate for date', async () => {
      const result = await calculateTax({
        amount: 100,
        jurisdiction: 'TEST',
        date: new Date('2026-02-01'),
      });

      expect(result.taxRate).toBe(10);
    });
  });
});
```

### Testing Best Practices

1. **Arrange-Act-Assert**: Clear test structure
2. **Descriptive Names**: Test names are sentences
3. **One Assertion**: Focus on one behavior per test (unless related)
4. **Isolated**: Tests don't depend on each other
5. **Fast**: Use mocks for external dependencies
6. **Realistic Data**: Use fixtures that match production
7. **Edge Cases**: Test boundaries, errors, empty states

### Integration Tests

For database-dependent code:

```typescript
import { beforeEach, afterEach } from 'vitest';
import { db } from 'afenda-database';

describe('Tax Engine Integration', () => {
  beforeEach(async () => {
    // Set up test data
    await db.insert(taxRates).values([
      { jurisdiction: 'US-CA', rate: 8.5, effectiveFrom: new Date('2020-01-01') },
      { jurisdiction: 'US-NY', rate: 8.875, effectiveFrom: new Date('2020-01-01') },
    ]);
  });

  afterEach(async () => {
    // Clean up
    await db.delete(taxRates);
  });

  it('calculates tax with real database', async () => {
    const result = await calculateTax({
      amount: 100,
      jurisdiction: 'US-CA',
      date: new Date(),
    });

    expect(result.taxAmount).toBe(8.5);
  });
});
```

---

## Documentation Standards

### README Structure

Every package must have a README with:

1. **Title and Purpose** - One-sentence description
2. **When to Use This Package** - Use cases
3. **Key Concepts** - Domain terminology
4. **Installation** (if applicable)
5. **Quick Start** - Minimal example
6. **API Reference** - Public exports
7. **Examples** - Real-world usage
8. **Related Packages** - Dependencies and consumers
9. **Contributing** (if applicable)

Template: See `packages/PACKAGE_TEMPLATE.md`

### JSDoc Comments

All public exports must have JSDoc:

````typescript
/**
 * Calculate depreciation for an asset using the specified method
 *
 * @param asset - The asset to depreciate
 * @param method - Depreciation method (straight-line, declining-balance, etc.)
 * @param options - Optional calculation parameters
 * @returns Depreciation amount for the period
 *
 * @example
 * ```typescript
 * const depreciation = calculateDepreciation(
 *   { cost: 10000, salvageValue: 1000, usefulLife: 5 },
 *   'straight-line'
 * );
 * // Returns 1800 per year
 * ```
 *
 * @throws {Error} If asset cost is negative
 * @throws {Error} If useful life is zero or negative
 */
export function calculateDepreciation(
  asset: Asset,
  method: DepreciationMethod,
  options?: DepreciationOptions,
): number {
  // ...
}
````

### Inline Comments

**When to comment**:

- ✅ Complex algorithms or business rules
- ✅ Performance optimizations (why this approach)
- ✅ Workarounds for bugs or limitations
- ✅ TODOs with context and owner

**When NOT to comment**:

- ❌ Obvious code (`i++; // increment i`)
- ❌ Repeating the function name
- ❌ Outdated comments

---

## Git Workflow

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code restructuring
- `docs/description` - Documentation
- `chore/description` - Maintenance tasks

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples**:

```
feat(accounting): add tax calculation engine

Implement multi-jurisdiction tax calculation with support for:
- State and local taxes
- Tax exemptions
- Historical rate lookups

Closes #123

---

fix(crud): prevent duplicate company creation

Add unique constraint check before creating companies to prevent
race condition in duplicate detection.

---

refactor(database): extract query utilities

Move common query patterns to shared utilities to reduce duplication.
```

### Pull Requests

PRs must:

1. **Pass CI** - Tests, linting, type checking
2. **Follow standards** - This document
3. **Update docs** - README, ARCHITECTURE.md if needed
4. **Run validation** - `pnpm run validate:deps`
5. **Small and focused** - One concern per PR
6. **Descriptive** - Clear title and description

---

## Code Review Checklist

Reviewers should verify:

- [ ] Follows layer architecture
- [ ] No circular dependencies
- [ ] Types are explicit (no `any`)
- [ ] Public API is minimal
- [ ] Tests cover new functionality
- [ ] Documentation is updated
- [ ] Naming follows conventions
- [ ] No hardcoded values (use constants)
- [ ] Error handling is appropriate
- [ ] Performance is acceptable

---

## Related Documentation

- [Architecture Guide](../ARCHITECTURE.md)
- [Package Governance](../packages/GOVERNANCE.md)
- [Build Strategy](BUILD_STRATEGY.md)
- [CRUD Handler Guide](../packages/crud/docs/HANDLER_GUIDE.md)

---

**Last Updated**: February 17, 2026
