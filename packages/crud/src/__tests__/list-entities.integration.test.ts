/**
 * listEntities Integration Tests — Batch API adoption validation.
 *
 * Validates list+count pattern against a live database:
 * - Count query reuses same where clause as list (no limit/offset/orderBy)
 * - totalCount matches filtered row count
 * - orgId filter narrows results
 * - Cursor pagination returns correct page and nextCursor when more data exists (Phase 2B)
 *
 * Requires DATABASE_URL. Uses raw pg with SET LOCAL for tenant context
 * (same pattern as cross-tenant.integration.test.ts).
 *
 * Run with: DATABASE_URL=<neon_url> pnpm vitest run src/__tests__/list-entities.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const DATABASE_URL = process.env.DATABASE_URL;
const describeIf = DATABASE_URL ? describe : describe.skip;

// eslint-disable-next-line @typescript-eslint/no-require-imports
let pgClient: any;

async function execSql(sql: string, params: unknown[] = []): Promise<any[]> {
  const result = await pgClient.query(sql, params);
  return result.rows;
}

async function setTenantContext(orgId: string, userId: string): Promise<void> {
  await execSql(
    `SET LOCAL request.jwt.claims = '${JSON.stringify({ org_id: orgId, sub: userId })}'`,
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

  it('count matches list when same whereClause (no limit/offset on count)', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Insert 5 contacts
    for (let i = 0; i < 5; i++) {
      await execSql(
        `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
         VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
        [ORG_X, `Contact ${i}`],
      );
    }

    // Same where clause as listEntities: is_deleted = false, optional org_id
    const whereClause = `org_id = $1 AND is_deleted = false`;
    const params = [ORG_X];

    // List query (with limit/offset)
    const listRows = await execSql(
      `SELECT * FROM contacts WHERE ${whereClause} ORDER BY created_at DESC LIMIT 10 OFFSET 0`,
      params,
    );

    // Count query (NO limit/offset/orderBy — must match listEntities pattern)
    const countRows = await execSql(
      `SELECT count(*)::bigint as count FROM contacts WHERE ${whereClause}`,
      params,
    );

    const totalCount = Number(countRows[0]?.count ?? 0);
    expect(totalCount).toBe(5);
    expect(listRows.length).toBe(5);

    await execSql('ROLLBACK');
  });

  it('orgId filter narrows results (optimizer hint)', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Count with orgId filter
    const countWithOrg = await execSql(
      `SELECT count(*)::bigint as count FROM contacts WHERE org_id = $1 AND is_deleted = false`,
      [ORG_X],
    );
    const countA = Number(countWithOrg[0]?.count ?? 0);

    // Count without orgId (RLS still applies via auth.org_id())
    const countAll = await execSql(
      `SELECT count(*)::bigint as count FROM contacts WHERE is_deleted = false`,
    );
    const countB = Number(countAll[0]?.count ?? 0);

    // With same tenant context, both should match (orgId is optimizer hint)
    expect(countA).toBe(countB);

    await execSql('ROLLBACK');
  });

  it('cursor pagination returns page and nextCursor when more data exists (Phase 2B)', async () => {
    const { listEntities } = await import('../read');

    await execSql('BEGIN');
    await setTenantContext(ORG_X, USER_X);

    // Insert 5 contacts
    for (let i = 0; i < 5; i++) {
      await execSql(
        `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
         VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
        [ORG_X, `Cursor Contact ${i}`],
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
    expect(page2.data).toBeDefined();
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

  describe('cursor pagination - contract tests (Phase 2B)', () => {
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

    // Helper: Assert no overlaps between page ID sets
    function assertNoOverlaps(a: Set<string>, b: Set<string>) {
      for (const id of b) expect(a.has(id)).toBe(false);
    }

    // Helper: Assert cursor points to last row of page
    async function assertCursorBoundary(
      cursor: string,
      lastRow: { createdAt: Date; id: string },
      orgId: string,
    ) {
      const { decodeCursor } = await import('../cursor');
      const decoded = decodeCursor(cursor, orgId);
      expect(decoded.createdAt.getTime()).toBe(lastRow.createdAt.getTime());
      expect(decoded.id).toBe(lastRow.id);
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
            [ORG_X, `Collision-${tsIdx}-${i}`, ts],
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

        await assertCursorBoundary(next, rows[rows.length - 1], ORG_X);

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

    it('works with limit=1 (single-item pages)', async () => {
      const { listEntities } = await import('../read');

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);

      // Seed 3 contacts
      for (let i = 0; i < 3; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
          [ORG_X, `Limit1-${i}`],
        );
      }
      await execSql('COMMIT');

      const requestId = crypto.randomUUID();
      const cursors: string[] = [];
      const allIds = new Set<string>();
      const pageIds: Set<string>[] = [];

      for (let pageNum = 0; pageNum < 3; pageNum++) {
        const cursor = cursors.length ? cursors[cursors.length - 1] : undefined;
        const page = await listEntities('contacts', requestId, {
          limit: 1,
          orgId: ORG_X,
          ...(cursor ? { cursor } : {}),
        });
        expect(page.ok).toBe(true);
        const rows = page.data as Array<{ id: string; createdAt: Date }>;
        assertOrderingDescCreatedAtDescId(rows);

        const thisPageIds = new Set(rows.map((r) => r.id));
        pageIds.forEach((prevPageIds) => assertNoOverlaps(prevPageIds, thisPageIds));
        pageIds.push(thisPageIds);
        rows.forEach((r) => allIds.add(r.id));

        if (page.meta?.nextCursor) {
          cursors.push(page.meta.nextCursor);
          await assertCursorBoundary(page.meta.nextCursor, rows[0], ORG_X);
        }
      }

      expect(allIds.size).toBe(3);
      await assertCursorMonotonicity(cursors, ORG_X);

      // Cleanup
      await execSql('BEGIN');
      await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'Limit1-%'`, [ORG_X]);
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

    it('cursor + offset: cursor wins (not offset path)', async () => {
      const { listEntities } = await import('../read');

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);

      // Seed 20 contacts
      for (let i = 0; i < 20; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
          [ORG_X, `CursorOffset-${i}`],
        );
      }
      await execSql('COMMIT');

      const requestId = crypto.randomUUID();
      const page1 = await listEntities('contacts', requestId, {
        orgId: ORG_X,
        limit: 5,
      });
      expect(page1.ok).toBe(true);
      const cursor = page1.meta!.nextCursor!;
      expect(cursor).toBeTruthy();
      const page1Ids = new Set((page1.data as any[]).map((r) => r.id));

      const page2 = await listEntities('contacts', requestId, {
        orgId: ORG_X,
        limit: 5,
        cursor,
        offset: 9999,
      });
      expect(page2.ok).toBe(true);
      const page2Ids = new Set((page2.data as any[]).map((r) => r.id));

      assertNoOverlaps(page1Ids, page2Ids);
      expect((page2.data as any[]).length).toBeGreaterThan(0);
      assertOrderingDescCreatedAtDescId(page2.data as any);

      // Cleanup
      await execSql('BEGIN');
      await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'CursorOffset-%'`, [ORG_X]);
      await execSql('COMMIT');
    });

    it('cursor + includeCount: totalCount ignores cursor', async () => {
      const { listEntities } = await import('../read');

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);

      // Seed 50 contacts
      for (let i = 0; i < 50; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
          [ORG_X, `IncludeCount-${i}`],
        );
      }
      await execSql('COMMIT');

      const requestId = crypto.randomUUID();
      const page1 = await listEntities('contacts', requestId, {
        limit: 20,
        includeCount: true,
        orgId: ORG_X,
      });
      expect(page1.ok).toBe(true);
      expect(page1.meta?.totalCount).toBe(50);
      assertOrderingDescCreatedAtDescId(page1.data as any);

      const page2 = await listEntities('contacts', requestId, {
        limit: 20,
        cursor: page1.meta!.nextCursor!,
        includeCount: true,
        orgId: ORG_X,
      });
      expect(page2.ok).toBe(true);
      expect(page2.meta?.totalCount).toBe(50);
      expect(page2.meta?.totalCount).toBe(page1.meta?.totalCount);
      assertOrderingDescCreatedAtDescId(page2.data as any);

      // Cleanup
      await execSql('BEGIN');
      await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'IncludeCount-%'`, [ORG_X]);
      await execSql('COMMIT');
    });

    it('empty results: no cursor', async () => {
      const { listEntities } = await import('../read');
      const requestId = crypto.randomUUID();

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);
      await execSql('COMMIT');

      const page = await listEntities('contacts', requestId, {
        orgId: 'empty-org-' + Date.now(),
      });
      expect(page.ok).toBe(true);
      expect(page.data).toEqual([]);
      expect(page.meta?.nextCursor).toBeUndefined();
    });

    it('cursor without orgId: VALIDATION_FAILED', async () => {
      const { listEntities } = await import('../read');

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);

      // Seed 5 contacts
      for (let i = 0; i < 5; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
          [ORG_X, `NoOrgId-${i}`],
        );
      }
      await execSql('COMMIT');

      const requestId = crypto.randomUUID();
      const page1 = await listEntities('contacts', requestId, {
        orgId: ORG_X,
        limit: 5,
      });
      expect(page1.ok).toBe(true);
      const cursor = page1.meta!.nextCursor!;

      const result = await listEntities('contacts', requestId, {
        cursor,
        limit: 5,
      });
      expect(result.ok).toBe(false);
      expect(result.error?.code).toBe('VALIDATION_FAILED');
      expect(result.error?.message).toContain('cursor requires orgId');

      // Cleanup
      await execSql('BEGIN');
      await execSql(`DELETE FROM contacts WHERE org_id = $1 AND name LIKE 'NoOrgId-%'`, [ORG_X]);
      await execSql('COMMIT');
    });

    it('mutations between pages: no duplicates when newer rows are inserted', async () => {
      const { listEntities } = await import('../read');

      await execSql('BEGIN');
      await setTenantContext(ORG_X, USER_X);

      // Seed 60 baseline contacts
      for (let i = 0; i < 60; i++) {
        await execSql(
          `INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
           VALUES (gen_random_uuid(), $1, $2, 'customer', 'draft')`,
          [ORG_X, `Mutation-${i}`],
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
          [ORG_X, `Mutation-new-${i}`, newestTs],
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
          [ORG_X, `Boundary-${i}`, ts],
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
        (r) => r.createdAt.toISOString() === ts,
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
  });
});
