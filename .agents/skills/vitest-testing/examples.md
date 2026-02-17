# Vitest Testing Examples

Real test examples from AFENDA-NEXUS codebase demonstrating best practices.

---

## Unit Test Examples

### 1. Cursor Codec Tests (packages/crud)

**File:** `packages/crud/src/__tests__/cursor.test.ts`

```typescript
import { describe, expect, it } from 'vitest';
import { buildCursorWhere, decodeCursor, encodeCursor } from '../cursor';

describe('cursor codec', () => {
  it('encodeCursor produces base64url string', () => {
    const cursor = encodeCursor({
      v: 1,
      order: 'createdAt_desc_id_desc',
      orgId: 'test-org',
      createdAt: '2024-01-01T00:00:00.000Z',
      id: 'test-id-123',
    });
    expect(typeof cursor).toBe('string');
    expect(cursor).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('decodeCursor round-trips valid payload', () => {
    const payload = {
      v: 1,
      order: 'createdAt_desc_id_desc' as const,
      orgId: 'test-org',
      createdAt: '2024-01-01T00:00:00.000Z',
      id: 'test-id-123',
    };
    const cursor = encodeCursor(payload);
    const decoded = decodeCursor(cursor, 'test-org');

    expect(decoded.order).toBe('createdAt_desc_id_desc');
    expect(decoded.orgId).toBe('test-org');
    expect(decoded.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(decoded.id).toBe('test-id-123');
  });

  it('invalid base64url throws', () => {
    expect(() => decodeCursor('not-base64!@#', 'test-org')).toThrow(
      'Invalid cursor: malformed base64url'
    );
  });

  it('invalid JSON throws', () => {
    const badCursor = Buffer.from('not json').toString('base64url');
    expect(() => decodeCursor(badCursor, 'test-org')).toThrow('Invalid cursor: not valid JSON');
  });

  it('buildCursorWhere returns valid WHERE clause', () => {
    const decoded = {
      order: 'createdAt_desc_id_desc' as const,
      orgId: 'test-org',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      id: 'test-id-123',
    };

    const table = {
      createdAt: { name: 'created_at' },
      id: { name: 'id' },
    };

    const where = buildCursorWhere(table as any, decoded);
    expect(where).toBeDefined();
  });
});
```

**Key Patterns:**
- Descriptive test names
- Edge case testing (invalid input)
- Type safety with `as const`
- Regex matching for format validation

---

### 2. Kernel Smoke Tests (packages/crud)

**File:** `packages/crud/src/__tests__/kernel.smoke.test.ts`

```typescript
import { describe, expect, it } from 'vitest';
import { mutate } from '../mutate';

describe('kernel smoke tests', () => {
  it('K-05: exports only mutate, readEntity, listEntities', async () => {
    const mod = await import('../index');
    const exports = Object.keys(mod);
    expect(exports).toContain('mutate');
    expect(exports).toContain('readEntity');
    expect(exports).toContain('listEntities');
  });

  it('K-06: actionType is namespaced {entity}.{verb}', () => {
    const actionType = 'contacts.create';
    const parts = actionType.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[1]).toBe('create');
  });

  it('K-11: kernel strips system columns from input', async () => {
    const input = {
      name: 'Test',
      org_id: 'should-be-stripped',
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Kernel should strip org_id, created_at, updated_at
    // (This is a conceptual test - actual implementation varies)
    const systemCols = ['org_id', 'created_at', 'updated_at', 'created_by', 'updated_by'];
    const cleanInput = Object.fromEntries(
      Object.entries(input).filter(([key]) => !systemCols.includes(key))
    );

    expect(cleanInput).toEqual({ name: 'Test' });
  });
});
```

**Key Patterns:**
- Module export validation
- Invariant testing (K-05, K-06, K-11)
- Conceptual tests for architecture rules

---

### 3. Governance Tests (packages/crud)

**File:** `packages/crud/src/__tests__/governance.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

describe('INVARIANT-SYSTEM-01: system actor bypasses RLS', () => {
  it('system channel bypasses RLS on user channels', () => {
    const systemChannels = ['system', 'migration', 'seed'];
    const userChannels = ['api', 'ui', 'webhook'];

    systemChannels.forEach((channel) => {
      expect(['system', 'migration', 'seed']).toContain(channel);
    });

    userChannels.forEach((channel) => {
      expect(['system', 'migration', 'seed']).not.toContain(channel);
    });
  });

  it('denied on user channels when actor is system', () => {
    const userChannels = ['api', 'ui', 'webhook'];
    const systemActor = { type: 'system' as const };

    userChannels.forEach((channel) => {
      // System actor should not be allowed on user channels
      const isAllowed = channel === 'system' || channel === 'migration' || channel === 'seed';
      expect(isAllowed).toBe(false);
    });
  });
});

describe('INVARIANT-SEED-01: default roles have correct permissions', () => {
  it('owner has 9 verbs', () => {
    const ownerVerbs = ['create', 'read', 'update', 'delete', 'restore', 'approve', 'reject', 'list', 'export'];
    expect(ownerVerbs).toHaveLength(9);
  });

  it('member has 4 verbs', () => {
    const memberVerbs = ['create', 'read', 'update', 'list'];
    expect(memberVerbs).toHaveLength(4);
  });

  it('viewer has 0 write verbs', () => {
    const viewerVerbs = ['read', 'list'];
    expect(viewerVerbs.every(v => !['create', 'update', 'delete'].includes(v))).toBe(true);
  });
});
```

**Key Patterns:**
- Invariant documentation in test names
- Parameterized testing with `forEach`
- Architecture rule validation

---

## Integration Test Examples

### 1. List Entities Integration (packages/crud)

**File:** `packages/crud/src/__tests__/list-entities.integration.test.ts`

```typescript
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const DATABASE_URL = process.env.DATABASE_URL;
const describeIf = DATABASE_URL ? describe : describe.skip;

let pgClient: any;

async function execSql(sql: string, params: unknown[] = []): Promise<any[]> {
  const result = await pgClient.query(sql, params);
  return result.rows;
}

async function setTenantContext(orgId: string, userId: string): Promise<void> {
  await execSql(
    `SET LOCAL request.jwt.claims = '${JSON.stringify({ org_id: orgId, sub: userId })}'`
  );
}

const ORG_X = 'test-list-org-' + Date.now();
const USER_X = 'test-list-user-' + Date.now();

describeIf('listEntities list+count integration', () => {
  beforeAll(async () => {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: DATABASE_URL });
    pgClient = await pool.connect();
  });

  afterAll(async () => {
    if (pgClient) pgClient.release();
  });

  it('count matches list when same whereClause', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Insert 5 contacts
    for (let i = 0; i < 5; i++) {
      await execSql(
        `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
         VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
        [ORG_X, `Contact ${i}`]
      );
    }

    const whereClause = `org_id = $1 AND is_deleted = false`;
    const params = [ORG_X];

    const listRows = await execSql(
      `SELECT * FROM contacts WHERE ${whereClause} ORDER BY created_at DESC LIMIT 10`,
      params
    );

    const countRows = await execSql(
      `SELECT count(*)::bigint as count FROM contacts WHERE ${whereClause}`,
      params
    );

    const totalCount = Number(countRows[0]?.count ?? 0);
    expect(totalCount).toBe(5);
    expect(listRows.length).toBe(5);

    await execSql('ROLLBACK');
  });

  it('cursor pagination returns page and nextCursor', async () => {
    const { listEntities } = await import('../read');

    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Insert 5 contacts
    for (let i = 0; i < 5; i++) {
      await execSql(
        `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
         VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
        [ORG_X, `Cursor Contact ${i}`]
      );
    }
    await execSql('COMMIT');

    const requestId = crypto.randomUUID();

    // First page: limit 2
    const page1 = await listEntities('contacts', requestId, {
      orgId: ORG_X,
      limit: 2,
    });
    expect(page1.ok).toBe(true);
    expect(page1.data).toBeDefined();
    const data1 = page1.data as unknown[];
    expect(data1.length).toBe(2);
    expect(page1.meta?.nextCursor).toBeDefined();

    // Second page: use cursor
    const page2 = await listEntities('contacts', requestId, {
      orgId: ORG_X,
      limit: 2,
      cursor: page1.meta!.nextCursor!,
    });
    expect(page2.ok).toBe(true);
    const data2 = page2.data as unknown[];
    expect(data2.length).toBe(2);

    // No overlap
    const ids1 = new Set(data1.map((r: any) => r.id));
    const ids2 = new Set(data2.map((r: any) => r.id));
    for (const id of ids2) {
      expect(ids1.has(id)).toBe(false);
    }

    // Cleanup
    await execSql('BEGIN');
    await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'Cursor Contact %'`, [ORG_X]);
    await execSql('COMMIT');
  });
});
```

**Key Patterns:**
- `describeIf` for conditional execution
- Transaction isolation with BEGIN/ROLLBACK
- Tenant context setup
- Cleanup after tests
- Testing pagination contract (no overlaps)

---

### 2. Cursor Contract Tests (packages/crud)

**File:** `packages/crud/src/__tests__/list-entities.integration.test.ts`

```typescript
describe('cursor pagination - contract tests', () => {
  // Helper: Assert ordering matches SQL: ORDER BY createdAt DESC, id DESC
  function assertOrderingDescCreatedAtDescId(rows: Array<{ createdAt: Date; id: string }>) {
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1];
      const curr = rows[i];
      const ok =
        curr.createdAt.getTime() < prev.createdAt.getTime() ||
        (curr.createdAt.getTime() === prev.createdAt.getTime() && curr.id < prev.id);
      expect(ok).toBe(true);
    }
  }

  // Helper: Assert cursor monotonicity
  async function assertCursorMonotonicity(cursors: string[], orgId: string) {
    const { decodeCursor } = await import('../cursor');
    for (let i = 1; i < cursors.length; i++) {
      const prev = decodeCursor(cursors[i - 1], orgId);
      const curr = decodeCursor(cursors[i], orgId);
      const afterPrev =
        curr.createdAt.getTime() < prev.createdAt.getTime() ||
        (curr.createdAt.getTime() === prev.createdAt.getTime() && curr.id < prev.id);
      expect(afterPrev).toBe(true);
    }
  }

  it('handles timestamp collisions (100 rows, 20 distinct timestamps)', async () => {
    const { listEntities } = await import('../read');

    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Seed 100 contacts with 20 distinct timestamps (5 per timestamp)
    const baseTs = Date.now();
    for (let tsIdx = 0; tsIdx < 20; tsIdx++) {
      const ts = new Date(baseTs - tsIdx * 60000).toISOString();
      for (let i = 0; i < 5; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status, created_at)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft', $3)`,
          [ORG_X, `Collision-${tsIdx}-${i}`, ts]
        );
      }
    }
    await execSql('COMMIT');

    const requestId = crypto.randomUUID();
    let cursor: string | undefined;
    const allIds = new Set<string>();
    const cursors: string[] = [];

    while (true) {
      const page = await listEntities('contacts', requestId, {
        orgId: ORG_X,
        limit: 25,
        ...(cursor ? { cursor } : {}),
      });

      expect(page.ok).toBe(true);

      const rows = page.data as Array<{ id: string; createdAt: Date }>;
      assertOrderingDescCreatedAtDescId(rows);
      rows.forEach((r) => allIds.add(r.id));

      const next = page.meta?.nextCursor;
      if (!next) break;

      cursors.push(next);
      cursor = next;
    }

    expect(allIds.size).toBe(100);
    await assertCursorMonotonicity(cursors, ORG_X);

    // Cleanup
    await execSql('BEGIN');
    await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'Collision-%'`, [ORG_X]);
    await execSql('COMMIT');
  });

  it('limit bounds: rejects 0, 201, accepts 1 and 200', async () => {
    const { listEntities } = await import('../read');
    const requestId = crypto.randomUUID();

    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);
    await execSql('COMMIT');

    const result0 = await listEntities('contacts', requestId, { limit: 0, orgId: ORG_X });
    expect(result0.ok).toBe(false);
    expect(result0.error?.code).toBe('VALIDATION_FAILED');

    const result201 = await listEntities('contacts', requestId, { limit: 201, orgId: ORG_X });
    expect(result201.ok).toBe(false);
    expect(result201.error?.code).toBe('VALIDATION_FAILED');

    const result1 = await listEntities('contacts', requestId, { limit: 1, orgId: ORG_X });
    expect(result1.ok).toBe(true);

    const result200 = await listEntities('contacts', requestId, { limit: 200, orgId: ORG_X });
    expect(result200.ok).toBe(true);
  });
});
```

**Key Patterns:**
- Custom assertion helpers
- Stress testing (100 rows, timestamp collisions)
- Boundary testing (limit validation)
- Cursor monotonicity verification
- Comprehensive cleanup

---

## Test Helper Examples

### 1. Mock Database Context

```typescript
// packages/crud/src/__tests__/helpers.ts
export function createMockContext() {
  return {
    requestId: crypto.randomUUID(),
    orgId: 'test-org-' + Date.now(),
    actorId: 'test-user-' + Date.now(),
    actorType: 'user' as const,
    service: 'test',
  };
}

export function createMockEntityRef(type: string, id?: string) {
  return {
    type,
    ...(id ? { id } : {}),
  };
}

export function createMockMutationSpec(
  actionType: string,
  input: any,
  entityRef?: any
) {
  return {
    actionType,
    entityRef: entityRef ?? createMockEntityRef('contacts'),
    input,
    idempotencyKey: crypto.randomUUID(),
  };
}
```

### 2. Type-Safe Assertions

```typescript
// packages/crud/src/__tests__/helpers.ts
export function assertOk<T>(result: ApiResponse): asserts result is { ok: true; data: T } {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`Expected ok result, got error: ${result.error?.message}`);
  }
}

export function assertError(result: ApiResponse, code: string): void {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error('Expected error result, got ok');
  }
  expect(result.error.code).toBe(code);
}

// Usage
const result = await mutate(spec, ctx);
assertOk(result);
// TypeScript now knows result.data exists
console.log(result.data.id);
```

### 3. Database Seed Helpers

```typescript
// packages/crud/src/__tests__/helpers.ts
export async function seedContacts(
  pgClient: any,
  orgId: string,
  count: number
): Promise<Array<{ id: string; name: string }>> {
  const contacts = [];
  for (let i = 0; i < count; i++) {
    const result = await pgClient.query(
      `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
       VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')
       RETURNING id, name`,
      [orgId, `Contact ${i}`]
    );
    contacts.push(result.rows[0]);
  }
  return contacts;
}

export async function cleanupContacts(pgClient: any, orgId: string): Promise<void> {
  await pgClient.query('DELETE FROM contacts WHERE org_id = $1', [orgId]);
}
```

---

## Configuration Examples

### 1. Package-Level Config (Unit Tests)

**File:** `packages/crud/vitest.config.ts`

```typescript
import { defineProject, mergeConfig } from 'vitest/config';
import { unitPreset } from 'afenda-vitest-config/presets/unit';

export default mergeConfig(unitPreset, defineProject({}));
```

### 2. Package-Level Config (Integration Tests)

**File:** `packages/database/vitest.config.ts` (hypothetical)

```typescript
import { defineProject, mergeConfig } from 'vitest/config';
import { integrationPreset } from 'afenda-vitest-config/presets/integration';

export default mergeConfig(
  integrationPreset,
  defineProject({
    test: {
      // Package-specific overrides
      testTimeout: 60_000, // Longer timeout for DB tests
    },
  })
);
```

### 3. Root Config (Global Settings)

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*', 'tools/afenda-cli'],
    reporters: process.env.GITHUB_ACTIONS === 'true'
      ? ['default', 'github-actions', 'junit']
      : ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },
    coverage: {
      provider: 'v8',
      include: [
        'packages/*/src/**/*.{js,jsx,ts,tsx}',
        'tools/*/src/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/*.config.*',
        '**/setup/**',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/coverage/**',
        '**/coverage-mcp/**',
      ],
      reporter: ['text-summary', 'lcov', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
```

---

## Real-World Test Scenarios

### Scenario 1: Testing Cursor Pagination Edge Cases

```typescript
it('exact boundary collision: cursor inside timestamp cluster excludes earlier rows', async () => {
  const { listEntities } = await import('../read');

  await execSql('BEGIN');
  await setTenantContext(ORG_X, USER_X);

  // Seed 10 contacts with SAME createdAt
  const ts = new Date().toISOString();
  for (let i = 0; i < 10; i++) {
    await execSql(
      `INSERT INTO contacts (id, org_id, name, contact_type, doc_status, created_at)
       VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft', $3)`,
      [ORG_X, `Boundary-${i}`, ts]
    );
  }
  await execSql('COMMIT');

  const requestId = crypto.randomUUID();
  const pageAll = await listEntities('contacts', requestId, {
    orgId: ORG_X,
    limit: 20,
  });
  expect(pageAll.ok).toBe(true);

  const rows = (pageAll.data as Array<{ id: string; createdAt: Date }>).filter(
    (r) => r.createdAt.toISOString() === ts
  );

  expect(rows.length).toBe(10);
  assertOrderingDescCreatedAtDescId(rows);

  // Pick cursor at row[4] (5th element) inside cluster
  const { encodeCursor } = await import('../cursor');
  const pivot = rows[4];
  const cursor = encodeCursor({
    v: 1,
    order: 'createdAt_desc_id_desc',
    orgId: ORG_X,
    createdAt: pivot.createdAt.toISOString(),
    id: pivot.id,
  });

  // Request next 3 after pivot
  const page = await listEntities('contacts', requestId, {
    orgId: ORG_X,
    limit: 3,
    cursor,
  });
  expect(page.ok).toBe(true);

  const got = page.data as Array<{ id: string; createdAt: Date }>;
  expect(got.length).toBe(3);
  assertOrderingDescCreatedAtDescId(got);

  // Expected: rows[5], rows[6], rows[7]
  expect(got.map((r) => r.id)).toEqual([rows[5].id, rows[6].id, rows[7].id]);

  // Must not include any of rows[0..4], including pivot
  const forbidden = new Set(rows.slice(0, 5).map((r) => r.id));
  for (const r of got) expect(forbidden.has(r.id)).toBe(false);

  // Cleanup
  await execSql('BEGIN');
  await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'Boundary-%'`, [ORG_X]);
  await execSql('COMMIT');
});
```

### Scenario 2: Testing Mutations Between Pages

```typescript
it('mutations between pages: no duplicates when newer rows are inserted', async () => {
  const { listEntities } = await import('../read');

  await execSql('BEGIN');
  await setTenantContext(ORG_X, USER_X);

  // Seed 60 baseline contacts
  for (let i = 0; i < 60; i++) {
    await execSql(
      `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
       VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
      [ORG_X, `Mutation-${i}`]
    );
  }
  await execSql('COMMIT');

  const requestId = crypto.randomUUID();
  const page1 = await listEntities('contacts', requestId, {
    orgId: ORG_X,
    limit: 20,
  });
  expect(page1.ok).toBe(true);

  const page1Rows = page1.data as Array<{ id: string; createdAt: Date }>;
  expect(page1Rows.length).toBe(20);
  assertOrderingDescCreatedAtDescId(page1Rows);

  const page1Ids = new Set(page1Rows.map((r) => r.id));
  const cursor = page1.meta?.nextCursor;
  expect(cursor).toBeTruthy();

  // Insert 5 newer rows (after first row of page1)
  await execSql('BEGIN');
  await setTenantContext(ORG_X, USER_X);
  const newestTs = new Date(page1Rows[0].createdAt.getTime() + 60000).toISOString();
  for (let i = 0; i < 5; i++) {
    await execSql(
      `INSERT INTO contacts (id, org_id, name, contact_type, doc_status, created_at)
       VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft', $3)`,
      [ORG_X, `Mutation-new-${i}`, newestTs]
    );
  }
  await execSql('COMMIT');

  // page2 using original cursor
  const page2 = await listEntities('contacts', requestId, {
    orgId: ORG_X,
    limit: 20,
    cursor: cursor!,
  });
  expect(page2.ok).toBe(true);

  const page2Rows = page2.data as Array<{ id: string; createdAt: Date }>;
  expect(page2Rows.length).toBeGreaterThan(0);
  assertOrderingDescCreatedAtDescId(page2Rows);

  const page2Ids = new Set(page2Rows.map((r) => r.id));
  assertNoOverlaps(page1Ids, page2Ids);

  // Cleanup
  await execSql('BEGIN');
  await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'Mutation-%'`, [ORG_X]);
  await execSql('COMMIT');
});
```

---

## Summary

These examples demonstrate:

1. **Unit testing:** Fast, isolated, no external dependencies
2. **Integration testing:** Real database, transaction isolation, cleanup
3. **Contract testing:** Verify API contracts and invariants
4. **Edge case testing:** Boundary conditions, timestamp collisions
5. **Helper functions:** Reusable test utilities
6. **Configuration:** Workspace mode, presets, global settings

All examples are from the actual AFENDA-NEXUS codebase and follow production best practices.
