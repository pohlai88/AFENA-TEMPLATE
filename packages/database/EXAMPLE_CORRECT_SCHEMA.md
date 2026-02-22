# Example: Correct Tenant-Isolated Schema Pattern

This document shows the correct pattern for tenant-isolated tables with composite PKs and FKs.

---

## Example 1: Simple Tenant Table (No FKs)

```typescript
import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk } from '../helpers/base-entity';

export const products = pgTable(
  'products',
  {
    ...baseEntityColumns,
    name: text('name').notNull(),
    sku: text('sku').notNull(),
    description: text('description'),
  },
  (t) => ({
    pk: tenantPk(t),
  })
);
```

**Key Points:**
- ✅ Uses `baseEntityColumns` (org_id is uuid, id has no .primaryKey())
- ✅ Composite PK defined at table level with `tenantPk(t)`
- ✅ Simple, clean pattern

---

## Example 2: Table with Composite FK (Single Parent)

```typescript
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk, tenantFkPattern } from '../helpers/base-entity';
import { products } from './products';

export const boms = pgTable(
  'boms',
  {
    ...baseEntityColumns,
    productId: uuid('product_id').notNull(),
    quantity: integer('quantity').notNull(),
  },
  (t) => ({
    pk: tenantPk(t),
    ...tenantFkPattern(t, 'product', t.productId, products),
  })
);
```

**Expands to:**
```typescript
{
  pk: primaryKey({ columns: [t.orgId, t.id] }),
  productFk: foreignKey({
    columns: [t.orgId, t.productId],
    foreignColumns: [products.orgId, products.id],
  }).onDelete('restrict'),
  productIdx: index('product_org_fk_idx').on(t.orgId, t.productId),
}
```

**Key Points:**
- ✅ FK column defined without `.references()`
- ✅ Composite FK via `tenantFkPattern()` helper
- ✅ Automatic index creation for FK lookup performance
- ✅ Prevents cross-tenant joins at database level

---

## Example 3: Table with Multiple Composite FKs

```typescript
import { pgTable, text, uuid, integer } from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk, tenantFkPattern } from '../helpers/base-entity';
import { products } from './products';
import { customers } from './customers';
import { warehouses } from './warehouses';

export const sales_orders = pgTable(
  'sales_orders',
  {
    ...baseEntityColumns,
    customerId: uuid('customer_id').notNull(),
    warehouseId: uuid('warehouse_id').notNull(),
    orderNumber: text('order_number').notNull(),
    status: text('status').notNull(),
  },
  (t) => ({
    pk: tenantPk(t),
    ...tenantFkPattern(t, 'customer', t.customerId, customers),
    ...tenantFkPattern(t, 'warehouse', t.warehouseId, warehouses),
  })
);

export const sales_order_lines = pgTable(
  'sales_order_lines',
  {
    ...baseEntityColumns,
    orderId: uuid('order_id').notNull(),
    productId: uuid('product_id').notNull(),
    quantity: integer('quantity').notNull(),
  },
  (t) => ({
    pk: tenantPk(t),
    ...tenantFkPattern(t, 'order', t.orderId, sales_orders, 'cascade'),
    ...tenantFkPattern(t, 'product', t.productId, products),
  })
);
```

**Key Points:**
- ✅ Multiple FKs handled with spread operator
- ✅ Each FK gets its own constraint + index
- ✅ Can specify onDelete behavior (default: 'restrict')
- ✅ Header-line pattern with cascade delete

---

## Example 4: Manual FK Definition (Advanced)

If you need more control, use the individual helpers:

```typescript
import { pgTable, uuid, foreignKey, index } from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk, tenantFk, tenantFkIndex } from '../helpers/base-entity';
import { products } from './products';

export const boms = pgTable(
  'boms',
  {
    ...baseEntityColumns,
    productId: uuid('product_id').notNull(),
  },
  (t) => ({
    pk: tenantPk(t),
    
    // Manual FK definition
    productFk: tenantFk(t, 'product', t.productId, products, 'cascade'),
    
    // Manual index definition
    productIdx: tenantFkIndex(t, 'product', t.productId),
    
    // Additional custom index
    customIdx: index('boms_custom_idx').on(t.orgId, t.productId, t.createdAt),
  })
);
```

---

## Example 5: Money Columns (Correct Pattern)

```typescript
import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseEntityColumns, tenantPk } from '../helpers/base-entity';
import { moneyMinor, currencyCode } from '../helpers/field-types';

export const invoices = pgTable(
  'invoices',
  {
    ...baseEntityColumns,
    invoiceNumber: text('invoice_number').notNull(),
    
    // Money columns - uses bigint
    totalMinor: moneyMinor('total_minor'),
    taxMinor: moneyMinor('tax_minor'),
    currency: currencyCode('currency'),
  },
  (t) => ({
    pk: tenantPk(t),
  })
);
```

**Key Points:**
- ✅ `moneyMinor()` now uses `bigint` (safe for large values)
- ✅ No overflow risk on high-value transactions
- ✅ Mode 'number' for JS compatibility

---

## Common Mistakes to Avoid

### ❌ WRONG: Standalone PK
```typescript
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),  // ❌ NO!
  orgId: uuid('org_id').notNull(),
});
```

### ✅ CORRECT: Composite PK
```typescript
export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().notNull(),  // No .primaryKey()
    orgId: uuid('org_id').notNull(),
  },
  (t) => ({
    pk: tenantPk(t),  // Composite PK at table level
  })
);
```

---

### ❌ WRONG: Single-column FK
```typescript
export const boms = pgTable('boms', {
  productId: uuid('product_id').references(() => products.id),  // ❌ NO!
});
```

### ✅ CORRECT: Composite FK
```typescript
export const boms = pgTable(
  'boms',
  {
    productId: uuid('product_id').notNull(),
  },
  (t) => ({
    ...tenantFkPattern(t, 'product', t.productId, products),
  })
);
```

---

### ❌ WRONG: org_id as text
```typescript
orgId: text('org_id').notNull(),  // ❌ NO! Causes implicit casts
```

### ✅ CORRECT: org_id as uuid
```typescript
orgId: uuid('org_id').notNull(),  // ✅ Matches auth.org_id() return type
```

---

### ❌ WRONG: Money as integer
```typescript
totalMinor: integer('total_minor'),  // ❌ NO! Overflow risk
```

### ✅ CORRECT: Money as bigint
```typescript
totalMinor: moneyMinor('total_minor'),  // ✅ Uses bigint
```

---

## Migration Pattern

When regenerating migrations, the SQL will look like:

```sql
-- Composite PK
CREATE TABLE products (
  org_id uuid NOT NULL DEFAULT (auth.require_org_id()),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  PRIMARY KEY (org_id, id)  -- Composite PK
);

-- Composite FK
CREATE TABLE boms (
  org_id uuid NOT NULL DEFAULT (auth.require_org_id()),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  PRIMARY KEY (org_id, id),
  FOREIGN KEY (org_id, product_id) REFERENCES products(org_id, id) ON DELETE RESTRICT
);

-- FK Index
CREATE INDEX product_org_fk_idx ON boms(org_id, product_id);
```

---

## Summary

**Every tenant table MUST:**
1. Use `baseEntityColumns` (org_id uuid, id without .primaryKey())
2. Define composite PK with `tenantPk(t)` at table level
3. Use composite FKs with `tenantFkPattern()` for all parent references
4. Have indexes on all FK columns

**This pattern ensures:**
- ✅ Database-level tenant isolation
- ✅ No cross-tenant joins possible
- ✅ Optimal query performance
- ✅ Type safety with Drizzle
- ✅ No implicit casts or index issues
