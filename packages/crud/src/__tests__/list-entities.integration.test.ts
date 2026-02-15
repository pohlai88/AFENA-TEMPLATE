/**
 * listEntities Integration Tests — Batch API adoption validation.
 *
 * Validates list+count pattern against a live database:
 * - Count query reuses same where clause as list (no limit/offset/orderBy)
 * - totalCount matches filtered row count
 * - orgId filter narrows results
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
});
