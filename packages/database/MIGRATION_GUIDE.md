# Database Package Migration Guide

## v2.6 → v3.0 Migration (DbSession)

### Overview

Version 3.0 introduces **DbSession** as the single entrypoint for database access, replacing direct `db` and `dbRo` imports. This change enforces critical v2.6 architecture invariants:

- **INV-SESSION-01:** All app DB access goes through DbSession
- **INV-SESSION-CTX-01:** Auth context set as first statement (RLS requires it)
- **INV-READ-SESSION-01:** Session decides primary vs replica routing

### Breaking Changes

1. **Direct `db`/`dbRo` access removed** (deprecated in v2.6, removed in v3.0)
2. **Drizzle operators no longer re-exported** (import from `drizzle-orm` directly)

---

## Migration Steps

### Step 1: Update Imports

#### Before (v2.6)
```typescript
import { db, dbRo, eq, and } from 'afenda-database';
```

#### After (v3.0)
```typescript
import { createDbSession } from 'afenda-database';
import { eq, and } from 'drizzle-orm';
```

---

### Step 2: Wrap Database Access in Sessions

#### Pattern 1: Simple Read Query

**Before:**
```typescript
export async function getInvoice(id: string) {
  return db.select()
    .from(invoices)
    .where(eq(invoices.id, id));
}
```

**After:**
```typescript
export async function getInvoice(orgId: string, userId: string, id: string) {
  const session = createDbSession({ orgId, userId });
  
  return session.ro(async (tx) => {
    return tx.select()
      .from(invoices)
      .where(eq(invoices.id, id));
  });
}
```

#### Pattern 2: Write Operation

**Before:**
```typescript
export async function createInvoice(data: InvoiceInput) {
  return db.insert(invoices)
    .values(data)
    .returning();
}
```

**After:**
```typescript
export async function createInvoice(
  orgId: string,
  userId: string,
  data: InvoiceInput
) {
  const session = createDbSession({ orgId, userId });
  
  return session.rw(async (tx) => {
    return tx.insert(invoices)
      .values(data)
      .returning();
  });
}
```

#### Pattern 3: Read-After-Write

**Before:**
```typescript
export async function createAndFetchInvoice(data: InvoiceInput) {
  const [invoice] = await db.insert(invoices)
    .values(data)
    .returning();
  
  // ❌ Bug: Using replica after write (may not see new data)
  return dbRo.select()
    .from(invoices)
    .where(eq(invoices.id, invoice.id));
}
```

**After:**
```typescript
export async function createAndFetchInvoice(
  orgId: string,
  userId: string,
  data: InvoiceInput
) {
  const session = createDbSession({ orgId, userId });
  
  const [invoice] = await session.rw(async (tx) => {
    return tx.insert(invoices)
      .values(data)
      .returning();
  });
  
  // ✅ Correct: Session automatically uses primary after write
  return session.ro(async (tx) => {
    return tx.select()
      .from(invoices)
      .where(eq(invoices.id, invoice.id));
  });
}
```

#### Pattern 4: Multiple Operations in Transaction

**Before:**
```typescript
export async function createInvoiceWithLines(
  invoice: InvoiceInput,
  lines: LineInput[]
) {
  return db.transaction(async (tx) => {
    const [inv] = await tx.insert(invoices).values(invoice).returning();
    
    await tx.insert(invoiceLines).values(
      lines.map(line => ({ ...line, invoiceId: inv.id }))
    );
    
    return inv;
  });
}
```

**After:**
```typescript
export async function createInvoiceWithLines(
  orgId: string,
  userId: string,
  invoice: InvoiceInput,
  lines: LineInput[]
) {
  const session = createDbSession({ orgId, userId });
  
  return session.rw(async (tx) => {
    // Auth context automatically set as first statement
    const [inv] = await tx.insert(invoices).values(invoice).returning();
    
    await tx.insert(invoiceLines).values(
      lines.map(line => ({ ...line, invoiceId: inv.id }))
    );
    
    return inv;
  });
}
```

---

### Step 3: Update API Handlers

#### Before:
```typescript
// apps/web/app/api/invoices/route.ts
import { db } from 'afenda-database';

export async function GET(req: Request) {
  const invoices = await db.select().from(invoices);
  return Response.json(invoices);
}
```

#### After:
```typescript
// apps/web/app/api/invoices/route.ts
import { createDbSession } from 'afenda-database';
import { extractAuthFromJWT } from '@/lib/auth';

export async function GET(req: Request) {
  const { orgId, userId } = await extractAuthFromJWT(req);
  const session = createDbSession({ orgId, userId });
  
  const invoices = await session.ro(async (tx) => {
    return tx.select().from(invoices);
  });
  
  return Response.json(invoices);
}
```

---

## Advanced Patterns

### Query Shape Tagging (Observability)

```typescript
import { createDbSession, QUERY_SHAPES } from 'afenda-database';

export async function listInvoices(orgId: string, userId: string) {
  const session = createDbSession({ orgId, userId });
  
  return session.query('invoices.list', async () => {
    return session.ro(async (tx) => {
      return tx.select().from(invoices)
        .where(eq(invoices.orgId, orgId))
        .limit(100);
    });
  });
}
```

### Worker Sessions (BYPASSRLS)

Workers need cross-org access for projection rebuilding:

```typescript
import { createWorkerSession } from 'afenda-database';

export async function rebuildSearchDocuments(orgId: string) {
  const session = createWorkerSession('search-indexer');
  
  await session.rw(async (tx) => {
    // CRITICAL: Explicit org_id in WHERE (no RLS)
    const docs = await tx.select()
      .from(invoices)
      .where(eq(invoices.orgId, orgId));
    
    await tx.insert(searchDocuments).values(
      docs.map(d => ({ orgId, ...d }))
    );
  });
}
```

---

## Automated Migration

### Codemod (Coming Soon)

```bash
# Automated migration tool (Phase 6)
pnpm codemod:db-session

# Options:
# --dry-run    Show changes without applying
# --path       Target specific directory
# --verbose    Show detailed migration steps
```

---

## Testing Migration

### Update Test Mocks

**Before:**
```typescript
vi.mock('afenda-database', () => ({
  db: {
    select: vi.fn(() => ({ from: vi.fn() })),
  },
}));
```

**After:**
```typescript
vi.mock('afenda-database', () => ({
  createDbSession: vi.fn(() => ({
    ro: vi.fn(async (fn) => fn({
      select: vi.fn(() => ({ from: vi.fn() })),
    })),
    rw: vi.fn(async (fn) => fn({
      insert: vi.fn(() => ({ values: vi.fn() })),
    })),
    wrote: false,
  })),
}));
```

---

## Common Issues

### Issue 1: "Invalid orgId format"

**Error:**
```
Error: Invalid orgId format: "123". Must be a valid UUID.
```

**Solution:**
Ensure orgId is a valid UUID format:
```typescript
// ❌ Wrong
const session = createDbSession({ orgId: '123', userId: 'user' });

// ✅ Correct
const session = createDbSession({ 
  orgId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user'
});
```

### Issue 2: RLS Denial After Migration

**Error:**
```
Error: new row violates row-level security policy
```

**Cause:** Auth context not being set (likely using old `db` import)

**Solution:** Ensure all database access goes through DbSession:
```typescript
// ❌ Wrong: Direct db access bypasses auth context
import { db } from 'afenda-database';
await db.insert(invoices).values(data);

// ✅ Correct: Session sets auth context
import { createDbSession } from 'afenda-database';
const session = createDbSession({ orgId, userId });
await session.rw(tx => tx.insert(invoices).values(data));
```

### Issue 3: Read-After-Write Stale Data

**Symptom:** Created data not visible in subsequent read

**Cause:** Using replica after write (replica lag)

**Solution:** DbSession automatically handles this:
```typescript
const session = createDbSession({ orgId, userId });

// Write
await session.rw(tx => tx.insert(invoices).values(data));

// Read: Automatically uses primary because session.wrote === true
await session.ro(tx => tx.select().from(invoices));
```

---

## Rollback Plan

If you need to rollback to v2.6:

1. **Revert package.json:**
   ```json
   {
     "dependencies": {
       "afenda-database": "2.6.0"
     }
   }
   ```

2. **Restore old imports:**
   ```typescript
   import { db, dbRo } from 'afenda-database';
   ```

3. **Remove session wrappers** (revert to direct db access)

---

## Timeline

- **v2.6 (Current):** DbSession available, old API deprecated
- **v2.7-2.9:** Deprecation warnings in console
- **v3.0 (Target):** Old API removed, DbSession required

**Recommended:** Migrate during v2.6-2.9 window to avoid breaking changes.

---

## Support

- **Documentation:** `packages/database/README.md`
- **Architecture:** `packages/database/db.architecture.md`
- **Issues:** File in GitHub with `database` label
- **Questions:** #database-migration Slack channel
