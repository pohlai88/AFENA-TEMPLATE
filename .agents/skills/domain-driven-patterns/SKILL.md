# domain-driven-patterns

## Description
Domain-Driven Design (DDD) patterns used in AFENDA-NEXUS domain packages: services, policies, ports, value objects, and domain modeling best practices.

## Trigger Conditions
Use this skill when:
- Implementing business logic in Layer 2 packages
- Questions about DDD patterns (services, entities, value objects)
- Designing domain models
- Implementing domain services
- Creating policies and validation rules
- Dependency injection patterns

---

## Overview

AFENDA-NEXUS domain packages (Layer 2) follow **Domain-Driven Design (DDD)** principles with pragmatic adaptations for TypeScript and functional programming.

**Core Patterns**:
1. **Service Pattern**: Stateless functions encapsulating business logic
2. **Policy Pattern**: Class-based business rules with ports (interfaces)
3. **Value Object Pattern**: Immutable data structures with validation
4. **Repository Pattern**: Database access abstraction
5. **Domain Event Pattern**: Event-driven communication between aggregates

---

## Pattern Catalog

### 1. Service Pattern

**What**: Stateless functions that encapsulate domain business logic.

**When to Use**:
- Pure calculations (tax, depreciation, allocations)
- Database-dependent operations (lookups, validations)
- Orchestration within a single domain

**Structure**:
```typescript
// packages/<domain>/src/services/<service-name>.ts

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { TaxRate } from 'afenda-canon';

/**
 * Result type (explicit interface)
 */
export interface TaxCalculationResult {
  taxAmount: number;
  effectiveRate: number;
  taxCode: string;
}

/**
 * Service function: database handle first, then domain params.
 * 
 * @param db - Database handle (supports transactions)
 * @param orgId - Tenant org ID
 * @param lineAmount - Amount to calculate tax on
 * @param taxRateId - Tax rate UUID
 * @returns Tax calculation result
 */
export async function calculateLineTax(
  db: NeonHttpDatabase,
  orgId: string,
  lineAmount: number,
  taxRateId: string,
): Promise<TaxCalculationResult> {
  // 1. Fetch domain data
  const taxRate = await db.query.taxRates.findFirst({
    where: (rates, { eq, and }) => and(
      eq(rates.orgId, orgId),
      eq(rates.id, taxRateId),
    ),
  });

  if (!taxRate) {
    throw new Error(`Tax rate not found: ${taxRateId}`);
  }

  // 2. Apply business logic
  const taxAmount = Math.round(lineAmount * (taxRate.rate / 100));

  // 3. Return result
  return {
    taxAmount,
    effectiveRate: taxRate.rate,
    taxCode: taxRate.taxCode,
  };
}
```

**Key Rules**:
- **Stateless**: No instance state, pure functions
- **Database-first param**: `db` parameter enables transaction support
- **Explicit returns**: Always return typed result interfaces
- **Error handling**: Throw descriptive errors, not generic strings

---

### 2. Pure Function Services (No Database)

**What**: Domain logic with no database dependency.

**When to Use**:
- Pure calculations (rounding, allocations, conversions)
- Data transformations
- Validation logic
- Deterministic algorithms

**Example**: Landed Cost Allocation
```typescript
/**
 * Allocate cost across lines by quantity (pure function).
 * 
 * PRD: Last line absorbs rounding remainder (no penny drift).
 */
export function allocateByQty(
  totalCostMinor: number,
  lines: Array<{ id: string; qty: number }>,
): Map<string, number> {
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  if (totalQty === 0) return new Map();

  const result = new Map<string, number>();
  let allocated = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isLast = i === lines.length - 1;
    
    // Last line gets remainder to prevent rounding drift
    const amount = isLast
      ? totalCostMinor - allocated
      : Math.floor((totalCostMinor * line.qty) / totalQty);

    result.set(line.id, amount);
    allocated += amount;
  }

  return result;
}
```

**Benefits**:
- Easy to test (no mocking)
- Deterministic (same input → same output)
- Composable (can be unit-tested independently)

---

### 3. Policy Pattern

**What**: Class-based business rules with dependency injection via constructor.

**When to Use**:
- Complex validation logic
- Multi-step authorization checks
- Approval workflows
- Business rules that need state or configuration

**Structure**:
```typescript
// packages/<domain>/src/policies/<policy-name>.ts

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Port (interface) — no "I" prefix.
 */
export interface FiscalPeriodChecker {
  isPeriodOpen(orgId: string, companyId: string, date: Date): Promise<boolean>;
  assertPeriodOpen(orgId: string, companyId: string, date: Date): Promise<void>;
}

/**
 * Fiscal period policy — enforces posting date rules.
 */
export class FiscalPeriodPolicy implements FiscalPeriodChecker {
  constructor(private db: NeonHttpDatabase) {}

  async isPeriodOpen(
    orgId: string,
    companyId: string,
    date: Date,
  ): Promise<boolean> {
    const period = await this.findPeriod(orgId, companyId, date);
    return period?.status === 'open';
  }

  async assertPeriodOpen(
    orgId: string,
    companyId: string,
    date: Date,
  ): Promise<void> {
    const isOpen = await this.isPeriodOpen(orgId, companyId, date);
    if (!isOpen) {
      throw new Error(`Fiscal period closed for date: ${date.toISOString()}`);
    }
  }

  private async findPeriod(
    orgId: string,
    companyId: string,
    date: Date,
  ): Promise<{ status: string } | undefined> {
    // Implementation
    return undefined;
  }
}
```

**Key Rules**:
- **Constructor injection**: Pass dependencies (db, config) via constructor
- **Interface first**: Define port interface, then implement
- **No "I" prefix**: Use `FiscalPeriodChecker`, not `IFiscalPeriodChecker`
- **Private helpers**: Internal logic is private methods

---

### 4. Port Pattern (Interfaces)

**What**: TypeScript interfaces defining contracts between layers/modules.

**When to Use**:
- Define service contracts
- Enable dependency inversion
- Support testing with fakes/mocks
- Abstract external dependencies

**Example**:
```typescript
// packages/<domain>/src/ports/tax-calculator.ts

/**
 * Tax calculation port — abstracts tax calculation logic.
 */
export interface TaxCalculator {
  calculateTax(
    orgId: string,
    taxCode: string,
    amount: number,
    date: Date,
  ): Promise<TaxResult>;

  resolveTaxRate(
    orgId: string,
    taxCode: string,
    date: Date,
  ): Promise<TaxRate | null>;
}

export interface TaxResult {
  taxAmount: number;
  rate: number;
  taxCode: string;
}

export interface TaxRate {
  id: string;
  code: string;
  rate: number;
}
```

**Usage**:
```typescript
// Implementation
export class StandardTaxCalculator implements TaxCalculator {
  constructor(private db: NeonHttpDatabase) {}

  async calculateTax(...): Promise<TaxResult> {
    // Implementation
  }

  async resolveTaxRate(...): Promise<TaxRate | null> {
    // Implementation
  }
}

// Consumer (dependency injection)
export class InvoiceService {
  constructor(private taxCalc: TaxCalculator) {}

  async createInvoice(...) {
    const tax = await this.taxCalc.calculateTax(...);
  }
}
```

---

### 5. Value Object Pattern

**What**: Immutable data structures with validation and factory method.

**When to Use**:
- Domain concepts with validation rules
- Identifiers with format requirements
- Money, date ranges, addresses
- Anything that needs validation on construction

**Structure**:
```typescript
// packages/<domain>/src/values/<value-object>.ts

/**
 * Money value object — amount + currency.
 */
export class Money {
  private constructor(
    public readonly amountMinor: number,
    public readonly currency: string,
  ) {}

  /**
   * Factory method — validates inputs.
   */
  static create(amountMinor: number, currency: string): Money {
    if (!Number.isInteger(amountMinor)) {
      throw new Error('Amount must be integer minor units');
    }
    if (amountMinor < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (currency.length !== 3) {
      throw new Error('Currency must be ISO 4217 3-letter code');
    }

    return new Money(amountMinor, currency);
  }

  /**
   * Add two money values (same currency only).
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add ${this.currency} and ${other.currency}`);
    }
    return Money.create(this.amountMinor + other.amountMinor, this.currency);
  }

  /**
   * Convert to major units (e.g., dollars).
   */
  toMajor(): number {
    return this.amountMinor / 100;
  }

  /**
   * Format as string.
   */
  toString(): string {
    return `${this.currency} ${this.toMajor().toFixed(2)}`;
  }
}
```

**Usage**:
```typescript
const price = Money.create(10000, 'USD'); // $100.00
const tax = Money.create(600, 'USD');     // $6.00
const total = price.add(tax);             // $106.00

console.log(total.toString()); // "USD 106.00"
```

**Key Rules**:
- **Immutable**: All fields `readonly`
- **Private constructor**: Force use of factory method
- **Static create()**: Validates inputs before construction
- **Methods return new instances**: Never mutate

---

### 6. Repository Pattern (Implicit)

**What**: Database access encapsulated in service functions.

**AFENDA Approach**: We don't use separate Repository classes. Instead:
- Service functions take `db` parameter
- Drizzle ORM provides query builders
- Transaction support via `db` parameter

**Example**:
```typescript
import { db, items } from 'afenda-database';
import { eq, and } from 'drizzle-orm';

/**
 * Find item by code (repository-like function).
 */
export async function findItemByCode(
  db: NeonHttpDatabase,
  orgId: string,
  itemCode: string,
): Promise<Item | null> {
  const [item] = await db
    .select()
    .from(items)
    .where(and(
      eq(items.orgId, orgId),
      eq(items.itemCode, itemCode),
    ))
    .limit(1);

  return item ?? null;
}
```

**Rationale**: Drizzle ORM is already a repository abstraction. Adding another layer creates unnecessary indirection.

---

### 7. Domain Event Pattern (Future)

**What**: Events emitted when domain state changes.

**Current Status**: Not fully implemented (planned).

**Future Pattern**:
```typescript
// Domain event type
export interface ItemCreatedEvent {
  type: 'item.created';
  orgId: string;
  itemId: string;
  timestamp: Date;
}

// Service emits event
export async function createItem(
  db: NeonHttpDatabase,
  orgId: string,
  input: ItemInput,
): Promise<{ item: Item; events: DomainEvent[] }> {
  const item = await db.insert(items).values({
    orgId,
    ...input,
  }).returning();

  const event: ItemCreatedEvent = {
    type: 'item.created',
    orgId,
    itemId: item.id,
    timestamp: new Date(),
  };

  return { item, events: [event] };
}
```

---

## Dependency Injection

### Constructor Injection (Policies)

```typescript
export class ApprovalPolicy {
  constructor(
    private db: NeonHttpDatabase,
    private config: ApprovalConfig,
  ) {}

  async evaluate(request: Request): Promise<boolean> {
    // Use this.db and this.config
  }
}

// Usage
const policy = new ApprovalPolicy(db, config);
await policy.evaluate(request);
```

---

### Function Parameters (Services)

```typescript
export async function calculateTax(
  db: NeonHttpDatabase,  // Injected
  orgId: string,
  amount: number,
): Promise<TaxResult> {
  // Use db
}

// Usage
const result = await calculateTax(db, orgId, 1000);
```

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Mutable Value Objects

```typescript
// ❌ BAD
class Money {
  constructor(public amount: number, public currency: string) {}

  add(other: Money): void {
    this.amount += other.amount; // MUTATION!
  }
}
```

**Solution**:
```typescript
// ✅ GOOD
class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  add(other: Money): Money {
    return Money.create(this.amount + other.amount, this.currency);
  }
}
```

---

### ❌ Anti-Pattern 2: Services with Instance State

```typescript
// ❌ BAD
class TaxService {
  private lastCalculation: TaxResult | null = null; // STATE!

  async calculate(...): Promise<TaxResult> {
    const result = ...;
    this.lastCalculation = result; // MUTATION!
    return result;
  }
}
```

**Solution**:
```typescript
// ✅ GOOD - Stateless service
export async function calculateTax(
  db: NeonHttpDatabase,
  ...
): Promise<TaxResult> {
  // No instance state, pure function
}
```

---

### ❌ Anti-Pattern 3: Anemic Domain Models

```typescript
// ❌ BAD - Just data, no behavior
export interface Order {
  id: string;
  total: number;
  status: string;
}

// Business logic scattered in services
export function validateOrder(order: Order): boolean {
  return order.total > 0 && order.status === 'draft';
}
```

**Solution** (if rich domain models preferred):
```typescript
// ✅ GOOD - Encapsulates behavior
export class Order {
  private constructor(
    public readonly id: string,
    public readonly total: number,
    public readonly status: string,
  ) {}

  static create(id: string, total: number): Order {
    if (total <= 0) throw new Error('Total must be positive');
    return new Order(id, total, 'draft');
  }

  isValid(): boolean {
    return this.total > 0 && this.status === 'draft';
  }

  submit(): Order {
    if (!this.isValid()) throw new Error('Invalid order');
    return new Order(this.id, this.total, 'submitted');
  }
}
```

**Note**: AFENDA currently prefers **anemic models + service functions** for simplicity.

---

### ❌ Anti-Pattern 4: "I" Interface Prefix

```typescript
// ❌ BAD - C# convention, discouraged in TypeScript
export interface ITaxCalculator {
  calculate(...): Promise<TaxResult>;
}
```

**Solution**:
```typescript
// ✅ GOOD - No "I" prefix
export interface TaxCalculator {
  calculate(...): Promise<TaxResult>;
}

export class StandardTaxCalculator implements TaxCalculator {
  // Implementation
}
```

---

## Testing Patterns

### Testing Services (Stateless Functions)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { calculateLineTax } from '../services/tax-calc';

describe('calculateLineTax', () => {
  it('should calculate tax correctly', async () => {
    // Mock database
    const mockDb = {
      query: {
        taxRates: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'rate-1',
            rate: 6,
            taxCode: 'VAT-6',
          }),
        },
      },
    };

    const result = await calculateLineTax(
      mockDb as any,
      'org-1',
      10000, // $100.00
      'rate-1',
    );

    expect(result.taxAmount).toBe(600); // $6.00
    expect(result.effectiveRate).toBe(6);
  });
});
```

---

### Testing Policies (Classes)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { FiscalPeriodPolicy } from '../policies/fiscal-period';

describe('FiscalPeriodPolicy', () => {
  it('should allow posting to open period', async () => {
    const mockDb = {
      query: {
        fiscalPeriods: {
          findFirst: vi.fn().mockResolvedValue({
            status: 'open',
          }),
        },
      },
    };

    const policy = new FiscalPeriodPolicy(mockDb as any);
    const isOpen = await policy.isPeriodOpen('org-1', 'co-1', new Date());

    expect(isOpen).toBe(true);
  });

  it('should reject posting to closed period', async () => {
    const mockDb = {
      query: {
        fiscalPeriods: {
          findFirst: vi.fn().mockResolvedValue({
            status: 'closed',
          }),
        },
      },
    };

    const policy = new FiscalPeriodPolicy(mockDb as any);

    await expect(
      policy.assertPeriodOpen('org-1', 'co-1', new Date())
    ).rejects.toThrow('closed');
  });
});
```

---

### Testing Value Objects

```typescript
import { describe, it, expect } from 'vitest';
import { Money } from '../values/money';

describe('Money', () => {
  it('should create valid money', () => {
    const money = Money.create(10000, 'USD');
    expect(money.amountMinor).toBe(10000);
    expect(money.currency).toBe('USD');
  });

  it('should reject negative amounts', () => {
    expect(() => Money.create(-100, 'USD')).toThrow('negative');
  });

  it('should add money values', () => {
    const a = Money.create(10000, 'USD');
    const b = Money.create(5000, 'USD');
    const sum = a.add(b);

    expect(sum.amountMinor).toBe(15000);
  });

  it('should reject adding different currencies', () => {
    const usd = Money.create(10000, 'USD');
    const eur = Money.create(5000, 'EUR');

    expect(() => usd.add(eur)).toThrow('Cannot add');
  });
});
```

---

## Package Structure

```
packages/<domain>/
├── src/
│   ├── index.ts              # Public API
│   ├── services/             # Service functions
│   │   ├── tax-calc.ts
│   │   ├── fiscal-period.ts
│   │   └── depreciation.ts
│   ├── policies/             # Policy classes
│   │   ├── approval-policy.ts
│   │   └── validation-policy.ts
│   ├── ports/                # Interfaces
│   │   ├── tax-calculator.ts
│   │   └── period-checker.ts
│   ├── values/               # Value objects
│   │   ├── money.ts
│   │   └── date-range.ts
│   └── __tests__/            # Unit tests
│       ├── tax-calc.test.ts
│       └── money.test.ts
```

---

## References

- [packages/accounting/src/services/](../../../packages/accounting/src/services/) - Service examples
- [packages/workflow/src/](../../../packages/workflow/src/) - Policy examples
- [packages/inventory/src/services/](../../../packages/inventory/src/services/) - Pure function examples
- [afenda-architecture skill](../afenda-architecture/SKILL.md) - Layer architecture
- [package-development skill](../package-development/SKILL.md) - Package structure

---

## Quick Reference

### Service Function Template
```typescript
export async function serviceName(
  db: NeonHttpDatabase,
  orgId: string,
  ...params
): Promise<ResultType> {
  // 1. Fetch data
  // 2. Apply business logic
  // 3. Return typed result
}
```

### Policy Class Template
```typescript
export interface PolicyPort {
  check(...): Promise<boolean>;
  assert(...): Promise<void>;
}

export class PolicyImpl implements PolicyPort {
  constructor(private db: NeonHttpDatabase) {}

  async check(...): Promise<boolean> {
    // Implementation
  }

  async assert(...): Promise<void> {
    // Throw if check fails
  }
}
```

### Value Object Template
```typescript
export class ValueObject {
  private constructor(public readonly field: Type) {}

  static create(field: Type): ValueObject {
    // Validation
    return new ValueObject(field);
  }

  method(): ValueObject {
    // Return new instance
    return ValueObject.create(newValue);
  }
}
```
