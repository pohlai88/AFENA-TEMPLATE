# afenda-database-patterns

## Description

Database schema patterns, migrations, Row-Level Security (RLS), and Drizzle ORM conventions for AFENDA-NEXUS.

## Trigger Conditions

Use this skill when:

- Creating or modifying database schemas
- Writing migrations
- Setting up RLS policies
- Defining composite primary keys
- Working with Drizzle ORM
- Multi-tenancy implementation questions

---

## Overview

AFENDA-NEXUS uses **Neon Postgres** with **Drizzle ORM** for database management. The database architecture enforces:

- **Multi-tenancy**: Row-Level Security (RLS) on all domain tables
- **Composite Primary Keys**: `(org_id, id)` for data integrity
- **Type Safety**: Drizzle schema generates TypeScript types
- **Migration-First**: Schema changes via SQL migrations (77+ migrations)

---

## Core Patterns

### 1. Composite Primary Keys (GAP-DB-001)

**All domain tables use composite PK: `(org_id, id)`**

**Why**:

- Enforces tenant isolation at database level
- Prevents cross-tenant data references
- Improves query performance with org_id prefix
- Enables partition-pruning in future

**Pattern**:

```typescript
import { primaryKey } from 'drizzle-orm/pg-core';

export const contacts = pgTable(
  'contacts',
  {
    ...erpEntityColumns, // includes orgId, id
    name: text('name').notNull(),
  },
  (table) => [primaryKey({ columns: [table.orgId, table.id] })],
);
```

**Migration Pattern**:

```sql
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_pkey;
ALTER TABLE contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (org_id, id);
```

---

### 2. Entity Column Helpers

AFENDA uses **composition helpers** for consistent column sets:

#### `baseEntityColumns`

Foundation for ALL entities:

```typescript
{
  orgId: text('org_id').notNull(),
  id: uuid('id').primaryKey().defaultRandom(),
  idempKey: uuid('idemp_key').unique(),
  docNo: text('doc_no'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}
```

#### `erpEntityColumns`

Adds `customData` JSONB for custom fields:

```typescript
{
  ...baseEntityColumns,
  customData: jsonb('custom_data').notNull().default(sql`'{}'::jsonb`),
}
```

#### `withCompanyScope()`

Explicit company ownership (RULE C-01):

```typescript
// Only add company_id if table meets one of:
// - LEGAL: Legal ownership / statutory reporting
// - OPERATIONS: Operational ownership
// - ISSUER: Document numbering / issuer identity

export const salesOrders = pgTable('sales_orders', {
  ...withCompanyScope({ scope: 'ISSUER' }),
  orderNo: text('order_no').notNull(),
});
```

#### `withSiteScope()`

For inventory/warehouse operations:

```typescript
export const stockBalances = pgTable('stock_balances', {
  ...withCompanySiteScope({ companyScope: 'OPERATIONS' }),
  itemId: uuid('item_id').notNull(),
  quantity: integer('quantity').notNull(),
});
```

---

### 3. Row-Level Security (RLS)

**EVERY domain table has RLS policies enforcing tenant isolation.**

#### `tenantPolicy()`

Standard multi-tenant RLS:

```typescript
import { tenantPolicy } from '../helpers/tenant-policy';

export const companies = pgTable(
  'companies',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    tenantPolicy(table), // RLS: auth.org_id() = org_id
  ],
);
```

**Generates SQL policies**:

```sql
CREATE POLICY contacts_tenant_policy ON contacts
  FOR ALL
  TO authenticated
  USING (auth.org_id() = org_id)
  WITH CHECK (auth.org_id() = org_id);
```

#### `ownerPolicy()`

User-scoped access within organization (opt-in):

```typescript
import { ownerPolicy } from '../helpers/tenant-policy';

export const apiKeys = pgTable(
  'api_keys',
  {
    ...erpEntityColumns,
    userId: uuid('user_id').notNull(),
    keyHash: text('key_hash').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    ownerPolicy(table), // RLS: owner or admin can read, only owner can modify
  ],
);
```

**READ**: org member + (row owner OR admin/owner role)  
**MODIFY**: org member + row owner only

---

### 4. Indexes

**Every table should have cursor pagination index**:

```typescript
import { desc, index } from 'drizzle-orm/pg-core';

export const contacts = pgTable(
  'contacts',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('contacts_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    tenantPolicy(table),
  ],
);
```

**Why this pattern**:

- Supports keyset (cursor) pagination
- Composite sort: `ORDER BY org_id, created_at DESC, id DESC`
- Covers most list queries
- Prevents sequential scans

**Additional Indexes**:

```typescript
// Unique constraint
index('contacts_email_org_idx').on(table.orgId, table.email).unique(),

// Foreign key lookup
index('sales_orders_customer_idx').on(table.companyId, table.customerId),

// Full-text search
index('contacts_search_idx').using('gin', sql`to_tsvector('english', name)`),
```

---

### 5. Foreign Key Constraints

**Pattern**: Reference composite PK `(org_id, id)`:

```typescript
import { foreignKey } from 'drizzle-orm/pg-core';

export const salesOrderLines = pgTable(
  'sales_order_lines',
  {
    ...erpEntityColumns,
    orderId: uuid('order_id').notNull(),
    itemId: uuid('item_id').notNull(),
    quantity: integer('quantity').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.orderId],
      foreignColumns: [salesOrders.orgId, salesOrders.id],
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.orgId, table.itemId],
      foreignColumns: [items.orgId, items.id],
    }),
  ],
);
```

**Rules**:

- Always include `org_id` in FK (prevents cross-tenant references)
- Use `.onDelete('cascade')` for parent-child relationships
- Use `.onDelete('restrict')` for master data (default)

---

### 6. Check Constraints

**Validation at database level**:

```typescript
import { check, sql } from 'drizzle-orm';

export const companies = pgTable(
  'companies',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    check('companies_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);
```

**Common Checks**:

```typescript
// Positive values
check('amount_positive', sql`amount > 0`),

// Enum validation
check('status_valid', sql`status IN ('draft', 'submitted', 'approved')`),

// Date ranges
check('date_range_valid', sql`start_date <= end_date`),

// Conditional NOT NULL
check('requires_email_or_phone', sql`email IS NOT NULL OR phone IS NOT NULL`),
```

---

## Migration Patterns

### Migration Lifecycle

1. **Schema Change**: Modify Drizzle schema in `packages/database/src/schema/`
2. **Register in barrel**: Export from `src/schema/index.ts`
3. **Generate Migration**: `pnpm --filter afenda-database db:generate`
4. **Review SQL**: Check generated SQL in `drizzle/*.sql`
5. **Edit if Needed**: Add data migrations, RLS policies
6. **Run CI gates**: `pnpm --filter afenda-database db:drizzle:ci`
7. **Apply**: `pnpm --filter afenda-database db:migrate`

> **Note:** `db:migrate` uses the programmatic runner (`scripts/run-migrate.mjs`),
> not `drizzle-kit migrate` CLI, which cannot resolve drivers in pnpm monorepos.

---

### Common Migration Operations

#### Add Table

```sql
-- 0078_new_feature.sql
CREATE TABLE invoices (
  org_id text NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idemp_key uuid UNIQUE,
  doc_no text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz,
  custom_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  amount numeric(15, 2) NOT NULL,
  CONSTRAINT invoices_pkey PRIMARY KEY (org_id, id),
  CONSTRAINT invoices_org_not_empty CHECK (org_id <> '')
);

CREATE INDEX invoices_org_created_id_idx ON invoices (org_id, created_at DESC, id DESC);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY invoices_tenant_policy ON invoices
  FOR ALL
  TO authenticated
  USING (auth.org_id() = org_id)
  WITH CHECK (auth.org_id() = org_id);
```

---

#### Add Column

```sql
-- Add nullable first
ALTER TABLE contacts ADD COLUMN email text;

-- Backfill (if needed)
UPDATE contacts SET email = LOWER(name || '@example.com') WHERE email IS NULL;

-- Add NOT NULL constraint
ALTER TABLE contacts ALTER COLUMN email SET NOT NULL;

-- Add index
CREATE INDEX contacts_email_idx ON contacts (org_id, email);
```

---

#### Rename Column

```sql
ALTER TABLE contacts RENAME COLUMN old_name TO new_name;
```

---

#### Change Type

```sql
-- Safe: text -> varchar
ALTER TABLE contacts ALTER COLUMN phone TYPE varchar(20);

-- Unsafe: varchar -> int (requires USING)
ALTER TABLE items ALTER COLUMN quantity TYPE integer USING quantity::integer;
```

---

#### Drop Column (Backward Compatible)

```sql
-- Step 1: Deploy code that doesn't use column
-- Step 2: Drop column in next migration
ALTER TABLE contacts DROP COLUMN IF EXISTS deprecated_field;
```

---

#### Composite PK Migration

```sql
-- Drop old single-column PK
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_pkey;

-- Add composite PK
ALTER TABLE contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (org_id, id);

-- Update FK references
ALTER TABLE contact_addresses DROP CONSTRAINT IF EXISTS contact_addresses_contact_id_fkey;
ALTER TABLE contact_addresses ADD CONSTRAINT contact_addresses_contact_id_fkey
  FOREIGN KEY (org_id, contact_id) REFERENCES contacts (org_id, id) ON DELETE CASCADE;
```

---

### RLS Policy Migration

```sql
-- Enable RLS on table
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY new_table_tenant_policy ON new_table
  FOR ALL
  TO authenticated
  USING ((SELECT auth.org_id()) = org_id)
  WITH CHECK ((SELECT auth.org_id()) = org_id);
```

**Note**: Use `(SELECT auth.org_id())` wrapper to cache RLS predicate per-statement.

---

### Data Migration Pattern

```sql
-- Add new column
ALTER TABLE users ADD COLUMN full_name text;

-- Backfill from existing data
UPDATE users
SET full_name = first_name || ' ' || last_name
WHERE full_name IS NULL;

-- Make NOT NULL
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- Drop old columns (next migration)
-- ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;
```

---

## Drizzle ORM Conventions

### Schema Definition

**File Structure**: `packages/database/src/schema/<entity>.ts`

**Template**:

```typescript
import {
  pgTable,
  text,
  uuid,
  integer,
  timestamp,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql, desc } from 'drizzle-orm';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const items = pgTable(
  'items',
  {
    ...erpEntityColumns,
    itemCode: text('item_code').notNull(),
    itemName: text('item_name').notNull(),
    description: text('description'),
    unitPrice: integer('unit_price').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('items_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('items_code_org_idx').on(table.orgId, table.itemCode).unique(),
    tenantPolicy(table),
  ],
);

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

---

### Query Patterns

#### Select with RLS

```typescript
import { db } from '@afenda/database/db';
import { items } from '@afenda/database/schema';
import { eq, and, desc } from 'drizzle-orm';

// RLS automatically filters org_id
const allItems = await db.select().from(items);

// Additional filters
const activeItems = await db
  .select()
  .from(items)
  .where(eq(items.isActive, true))
  .orderBy(desc(items.createdAt));
```

---

#### Insert

```typescript
import { v4 as uuidv4 } from 'uuid';

const newItem = await db
  .insert(items)
  .values({
    orgId: 'org_123', // From auth context
    id: uuidv4(),
    itemCode: 'ITM-001',
    itemName: 'Widget',
    unitPrice: 1000,
  })
  .returning();
```

---

#### Update

```typescript
await db
  .update(items)
  .set({ unitPrice: 1200, updatedAt: new Date() })
  .where(and(eq(items.orgId, orgId), eq(items.id, itemId)));
```

---

#### Delete (Soft)

```typescript
await db
  .update(items)
  .set({ deletedAt: new Date() })
  .where(and(eq(items.orgId, orgId), eq(items.id, itemId)));
```

---

#### Join Queries

```typescript
import { salesOrders, salesOrderLines, items } from '@afenda/database/schema';

const ordersWithLines = await db
  .select({
    order: salesOrders,
    line: salesOrderLines,
    item: items,
  })
  .from(salesOrders)
  .leftJoin(
    salesOrderLines,
    and(eq(salesOrders.orgId, salesOrderLines.orgId), eq(salesOrders.id, salesOrderLines.orderId)),
  )
  .leftJoin(
    items,
    and(eq(salesOrderLines.orgId, items.orgId), eq(salesOrderLines.itemId, items.id)),
  )
  .where(eq(salesOrders.orgId, orgId));
```

---

### Type Inference

```typescript
import { items } from '@afenda/database/schema';

// SELECT type (all columns)
type Item = typeof items.$inferSelect;

// INSERT type (optional defaults)
type NewItem = typeof items.$inferInsert;

// Partial update type
type ItemUpdate = Partial<Item>;
```

---

## Best Practices

### 1. Always Include org_id in Indexes

```typescript
// ✅ Good - org_id first
index('items_code_idx').on(table.orgId, table.itemCode),

// ❌ Bad - missing org_id
index('items_code_idx').on(table.itemCode),
```

---

### 2. Use Composite FK

```typescript
// ✅ Good - composite FK prevents cross-tenant references
foreignKey({
  columns: [table.orgId, table.itemId],
  foreignColumns: [items.orgId, items.id],
}),

// ❌ Bad - single column FK allows cross-tenant references
foreignKey({
  columns: [table.itemId],
  foreignColumns: [items.id],
}),
```

---

### 3. RLS on All Domain Tables

```typescript
//✅ Good - tenant policy enforced
export const contacts = pgTable('contacts', { ...erpEntityColumns }, (table) => [
  primaryKey({ columns: [table.orgId, table.id] }),
  tenantPolicy(table),
]);

// ❌ Bad - no RLS (security vulnerability)
export const contacts = pgTable('contacts', { ...erpEntityColumns }, (table) => [
  primaryKey({ columns: [table.orgId, table.id] }),
]);
```

---

### 4. Migration Naming

```bash
# ✅ Good - descriptive names
0078_add_invoice_tables.sql
0079_composite_pk_invoices.sql
0080_backfill_item_defaults.sql

# ❌ Bad - auto-generated names only
0078_happy_wolverine.sql
```

---

### 5. Test Migrations

```bash
# Apply migration (programmatic runner)
pnpm --filter afenda-database db:migrate

# Verify CI gates
pnpm --filter afenda-database db:drizzle:ci
```

---

## Schema Registry

All tables are registered in `packages/database/src/schema/_registry.ts`:

```typescript
export const schema = {
  companies,
  contacts,
  items,
  salesOrders,
  salesOrderLines,
  // ... 150+ tables
};
```

This registry:

- Powers Drizzle migrations
- Generates TypeScript types
- Enables schema introspection

---

## References

- [packages/database/](../../../packages/database/) - Database package
- [packages/database/src/schema/](../../../packages/database/src/schema/) - Schema definitions
- [packages/database/drizzle/](../../../packages/database/drizzle/) - Migration files (77+ migrations)
- [packages/database/src/helpers/](../../../packages/database/src/helpers/) - Schema helpers
- [ADR-001: Use Neon Postgres](../../../docs/adr/001-use-neon-postgres.md)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Postgres Docs](https://neon.tech/docs)

---

## Quick Reference

### Column Types

```typescript
text('name'); // VARCHAR(unlimited)
varchar('code', { length: 50 }); // VARCHAR(50)
integer('quantity'); // INTEGER
numeric('amount', { precision: 15, scale: 2 }); // DECIMAL(15,2)
boolean('is_active'); // BOOLEAN
timestamp('created_at', { withTimezone: true }); // TIMESTAMPTZ
uuid('id'); // UUID
jsonb('data'); // JSONB
```

### Constraints

```typescript
.notNull()                      // NOT NULL
.default(value)                 // DEFAULT value
.unique()                       // UNIQUE
primaryKey({ columns: [...] }) // PRIMARY KEY
foreignKey({ ... })            // FOREIGN KEY
check('name', sql`...`)        // CHECK constraint
```

### Indexes

```typescript
index('name').on(col1, col2); // Regular index
index('name').on(col).unique(); // Unique index
index('name').using('gin', expression); // GIN index (full-text)
index('name').using('gist', expression); // GIST index (geometry)
```
