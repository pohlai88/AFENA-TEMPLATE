# afenda-database

**Layer 1: Foundation** • **Role:** Database Schemas & Connections

Drizzle ORM schemas, database instances, and query utilities for AFENDA-NEXUS.

---

## 📐 Architecture Role

**Layer 1** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database ← YOU ARE HERE, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Exports Drizzle ORM table schemas (150+ tables)
- Provides database connection instances
- Provides query utilities and helpers

**Zero Business Logic:** This package contains ONLY database schema definitions.

---

## ✅ What This Package Does

### 1. Exports Drizzle Table Schemas

```typescript
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  totalMinor: integer('total_minor').notNull(),
  customerId: text('customer_id').notNull(),
  // ... 150+ table schemas
});
```

### 2. Exports Database Instances

```typescript
export const db: NeonHttpDatabase<typeof schema>;
export const dbRo: NeonHttpDatabase<typeof schema>; // Read-only replica
```

### 3. Exports Query Utilities

```typescript
export { eq, and, or, sql, inArray } from 'drizzle-orm';
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Implement business logic | Export schemas for domains to query |
| Import from business-domain packages | Export schemas for domains to import |
| Import from crud | Export schemas for crud to import |
| Implement calculations | Keep pure schema definitions |
| Depend on workflow/advisory | Only depend on canon for types |

---

## 📦 What This Package Exports

### Table Schemas (150+)

**Accounting:**
- `invoices`, `payments`, `taxRates`, `journalEntries`, `ledgers`

**CRM:**
- `customers`, `contacts`, `leads`, `opportunities`

**Inventory:**
- `products`, `stockLevels`, `warehouses`, `stockMovements`

**HR:**
- `employees`, `departments`, `positions`, `payrolls`

**And 140+ more tables...**

### Database Instances

```typescript
import { db, dbRo } from 'afenda-database';

// Write operations
await db.insert(invoices).values({ ... });

// Read operations (use read replica for better performance)
const data = await dbRo.select().from(invoices);
```

### Query Utilities

```typescript
import { eq, and, or, sql } from 'afenda-database';

await db.select().from(invoices).where(eq(invoices.id, '123'));
```

---

## 📖 Usage Examples

### Import Schemas and Query

```typescript
import { db, invoices, payments, eq } from 'afenda-database';

// Insert
const [invoice] = await db.insert(invoices).values({
  id: '123',
  totalMinor: 10000,
  customerId: 'cust-1',
}).returning();

// Query
const results = await db.select()
  .from(invoices)
  .where(eq(invoices.customerId, 'cust-1'));
```

### Use in Business Domain

```typescript
// business-domain/accounting/src/services/invoice-lookup.ts
import { db, invoices, eq } from 'afenda-database';
import type { Invoice } from 'afenda-canon';

export async function getInvoice(id: string): Promise<Invoice | null> {
  const [invoice] = await db.select()
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);
  
  return invoice ?? null;
}
```

---

## 🔗 Dependencies

### Workspace Dependencies

- ✅ `afenda-canon` (Layer 1) — imports types for schema definitions

### External Dependencies

- `drizzle-orm` — ORM framework
- `@neondatabase/serverless` — Neon Postgres driver

### Who Depends on This Package

- ✅ `afenda-workflow` (Layer 2) — queries database for workflow rules
- ✅ `afenda-advisory` (Layer 2) — queries database for analytics
- ✅ All 116 business-domain packages (Layer 2) — query database
- ✅ `afenda-crud` (Layer 3) — queries database for API handlers

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - afenda-canon (Layer 1, same layer, for types only)
  - External npm (drizzle-orm, @neondatabase/serverless)
  - Node.js built-ins

❌ FORBIDDEN:
  - afenda-logger (Layer 1, same layer - avoid circular deps)
  - afenda-workflow (Layer 2, upper layer)
  - business-domain/* (Layer 2, upper layer)
  - afenda-crud (Layer 3, upper layer)
```

**Rule:** Layer 1 packages can ONLY depend on Layer 0 + external npm (+ canon for types only).

---

## 🛠️ Development Workflow

### Adding a New Table Schema

1. **Define the table schema:**

```typescript
// src/schema/tax-rates.ts
import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { baseEntity } from './helpers/base-entity';

export const taxRates = pgTable('tax_rates', {
  ...baseEntity, // id, orgId, createdAt, etc.
  taxCode: text('tax_code').notNull(),
  rate: numeric('rate', { precision: 10, scale: 6 }).notNull(),
  effectiveFrom: timestamp('effective_from').notNull(),
});
```

2. **Export from index:**

```typescript
// src/index.ts
export { taxRates } from './schema/tax-rates';
```

3. **Generate migration:**

```bash
pnpm db:generate
```

4. **Apply migration:**

```bash
pnpm db:migrate
```

5. **Use in business-domain:**

```typescript
// business-domain/accounting/src/services/tax-lookup.ts
import { db, taxRates, eq } from 'afenda-database';

export async function getTaxRate(taxCode: string) {
  return await db.select().from(taxRates).where(eq(taxRates.taxCode, taxCode));
}
```

---

## 📜 Scripts

```bash
pnpm build        # Build package
pnpm dev          # Watch mode
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix

# Drizzle Kit Commands
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Apply migrations to database
pnpm db:push      # Push schema changes (dev only)
pnpm db:studio    # Open Drizzle Studio (GUI)
pnpm db:lint      # Lint schema definitions
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Implement Business Logic

**❌ WRONG:**

```typescript
// src/schema/invoices.ts
export const invoices = pgTable('invoices', { ... });

// ❌ NO LOGIC!
export async function calculateInvoiceTotal(invoiceId: string) {
  const invoice = await db.select().from(invoices).where(...);
  return invoice.totalMinor * 1.0825; // TAX CALCULATION
}
```

**Why:** Database package contains ONLY schemas. Logic belongs in business-domain packages.

**✅ CORRECT:**

```typescript
// afenda-database: src/schema/invoices.ts
export const invoices = pgTable('invoices', { ... });

// business-domain/accounting: src/services/invoice-calculation.ts
import { db, invoices, eq } from 'afenda-database';

export async function calculateInvoiceTotal(invoiceId: string) {
  const invoice = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
  return invoice[0].totalMinor * 1.0825;
}
```

---

### 🔒 Rule 2: NEVER Import from Upper Layers

**❌ WRONG:**

```typescript
// src/index.ts
import { calculateTax } from 'afenda-accounting'; // FORBIDDEN!
```

**Why:** Database is Layer 1, accounting is Layer 2. Dependencies flow bottom-up only.

---

### 🔒 Rule 3: Schemas Define Structure ONLY

**❌ WRONG:**

```typescript
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  totalMinor: integer('total_minor').notNull(),
  // ❌ NO DEFAULT CALCULATIONS!
  totalWithTax: integer('total_with_tax').default(() => this.totalMinor * 1.0825),
});
```

**Why:** Schemas define database structure. Calculations belong in business-domain.

**✅ CORRECT:**

```typescript
// Database: structure only
export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  totalMinor: integer('total_minor').notNull(),
  taxMinor: integer('tax_minor').notNull(), // Store calculated value
});

// Business domain: calculation
import { calculateTax } from 'afenda-accounting';
const taxMinor = calculateTax(totalMinor, 0.0825);
```

---

### 🔒 Rule 4: Use Correct Database Type

**❌ WRONG:**

```typescript
import type { Database } from 'afenda-database'; // ❌ Wrong type!

export async function query(db: Database) { ... }
```

**Why:** The correct type is `NeonHttpDatabase` from `drizzle-orm/neon-http`.

**✅ CORRECT:**

```typescript
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { db } from 'afenda-database';

export async function query(database: NeonHttpDatabase) { ... }

// Or just use the instance directly
await db.select().from(invoices);
```

---

### 🔒 Rule 5: Read-Only Queries Use `dbRo`

**❌ LESS OPTIMAL:**

```typescript
// Read query on primary database
const invoices = await db.select().from(invoices);
```

**✅ BETTER:**

```typescript
// Read query on read replica (better performance)
import { dbRo } from 'afenda-database';

const invoices = await dbRo.select().from(invoices);
```

**Why:** Read replicas offload primary database and improve performance.

---

### 🔒 Rule 6: Migrations Are One-Way Only

**❌ WRONG:**

```sql
-- migrations/0001_add_column.sql
ALTER TABLE invoices ADD COLUMN tax_minor INTEGER;

-- ❌ Don't add rollback logic in same migration!
-- ALTER TABLE invoices DROP COLUMN tax_minor;
```

**✅ CORRECT:**

```sql
-- migrations/0001_add_column.sql
ALTER TABLE invoices ADD COLUMN tax_minor INTEGER;

-- migrations/0002_rollback_column.sql (separate migration if needed)
ALTER TABLE invoices DROP COLUMN tax_minor;
```

**Why:** Migrations flow forward. Use `db:generate` to create new migrations.

---

### 🚨 Validation Commands

```bash
# Check for schema issues
pnpm db:lint

# Verify migrations are up to date
pnpm db:generate
# Should output: "No schema changes detected"

# Type-check
pnpm type-check

# Check for layer violations
pnpm lint:ci
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 1 (Foundation) |
| **What does it export?** | Drizzle schemas, db instances, query utilities |
| **What does it import?** | afenda-canon (types only) + drizzle-orm |
| **Who imports it?** | All packages that query database |
| **Can it import from domains?** | ❌ NO |
| **Can it import from crud?** | ❌ NO |
| **Can it have business logic?** | ❌ NO (schemas only) |
| **Can it have calculations?** | ❌ NO (schemas only) |
| **Should I use `db` or `dbRo`?** | `dbRo` for reads, `db` for writes |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [packages/canon/README.md](../canon/README.md) - Type definitions
- [business-domain/README.md](../../business-domain/README.md) - Domain package guide

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)
