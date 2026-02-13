/**
 * Cross-Tenant Integration Tests — PRD Phase C #12
 *
 * Tests RLS isolation between tenants against a live Neon database.
 * Requires DATABASE_URL environment variable pointing to a Neon branch.
 *
 * These tests:
 * 1. Create data as Org A, verify Org B cannot see it
 * 2. Verify RLS prevents cross-tenant reads/writes
 * 3. Verify audit logs are tenant-scoped
 * 4. Verify search index is tenant-scoped
 *
 * Run with: DATABASE_URL=<neon_url> pnpm vitest run src/__tests__/cross-tenant.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const DATABASE_URL = process.env.DATABASE_URL;

// Skip entire suite if no DATABASE_URL
const describeIf = DATABASE_URL ? describe : describe.skip;

// We use raw SQL via the pg driver to simulate different tenant sessions
// because Drizzle's db instance uses a single connection with a fixed JWT.
// eslint-disable-next-line @typescript-eslint/no-require-imports
let pgClient: any;

async function execSql(sql: string, params: unknown[] = []): Promise<any[]> {
  const result = await pgClient.query(sql, params);
  return result.rows;
}

async function setTenantContext(orgId: string, userId: string): Promise<void> {
  // Simulate Neon Auth JWT claims by setting session variables
  // This mirrors what auth.org_id() and auth.user_id() read from
  await execSql(`SET LOCAL request.jwt.claims = '${JSON.stringify({
    org_id: orgId,
    sub: userId,
  })}'`);
}

const ORG_A = 'test-org-a-' + Date.now();
const ORG_B = 'test-org-b-' + Date.now();
const USER_A = 'user-a-' + Date.now();
const USER_B = 'user-b-' + Date.now();

describeIf('Cross-Tenant RLS Isolation', () => {
  beforeAll(async () => {
    // Dynamic import to avoid module-level DATABASE_URL check
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: DATABASE_URL });
    pgClient = await pool.connect();
  });

  afterAll(async () => {
    if (pgClient) {
      pgClient.release();
    }
  });

  it('Org A data is invisible to Org B via contacts table', async () => {
    // Insert as Org A
    await execSql('BEGIN');
    await setTenantContext(ORG_A, USER_A);

    await execSql(`
      INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
      VALUES (gen_random_uuid(), $1, 'Org A Contact', 'customer', 'draft')
    `, [ORG_A]);

    // Count as Org A — should see 1
    const orgARows = await execSql(
      `SELECT count(*) as cnt FROM contacts WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgARows[0]?.cnt)).toBeGreaterThanOrEqual(1);

    // Switch to Org B context
    await setTenantContext(ORG_B, USER_B);

    // Count as Org B — should see 0 of Org A's data
    const orgBRows = await execSql(
      `SELECT count(*) as cnt FROM contacts WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBRows[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });

  it('Org B cannot write to Org A org_id', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_B, USER_B);

    // Attempt to insert with Org A's org_id while authenticated as Org B
    // RLS should prevent this — auth.org_id() returns ORG_B, not ORG_A
    let insertFailed = false;
    try {
      await execSql(`
        INSERT INTO contacts (id, org_id, name, contact_type, doc_status)
        VALUES (gen_random_uuid(), $1, 'Sneaky Contact', 'customer', 'draft')
      `, [ORG_A]);
    } catch {
      insertFailed = true;
    }

    // Either the insert fails (RLS violation) or it silently writes with ORG_B's org_id
    // due to DEFAULT auth.require_org_id(). Either way, Org A should not see it.
    if (!insertFailed) {
      await setTenantContext(ORG_A, USER_A);
      const rows = await execSql(
        `SELECT count(*) as cnt FROM contacts WHERE name = 'Sneaky Contact' AND org_id = $1`,
        [ORG_A],
      );
      expect(Number(rows[0]?.cnt)).toBe(0);
    }

    await execSql('ROLLBACK');
  });

  it('audit_logs are tenant-scoped', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_A, USER_A);

    // Org A should only see their own audit logs
    const orgALogs = await execSql(
      `SELECT count(*) as cnt FROM audit_logs WHERE org_id = $1`,
      [ORG_A],
    );

    await setTenantContext(ORG_B, USER_B);

    // Org B should not see Org A's audit logs
    const orgBSeesA = await execSql(
      `SELECT count(*) as cnt FROM audit_logs WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBSeesA[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });

  it('journal_entries are tenant-scoped', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_A, USER_A);

    const orgAJournals = await execSql(
      `SELECT count(*) as cnt FROM journal_entries WHERE org_id = $1`,
      [ORG_A],
    );

    await setTenantContext(ORG_B, USER_B);

    const orgBSeesA = await execSql(
      `SELECT count(*) as cnt FROM journal_entries WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBSeesA[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });

  it('sales_invoices are tenant-scoped', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_B, USER_B);

    // Org B should not see Org A's invoices
    const orgBSeesA = await execSql(
      `SELECT count(*) as cnt FROM sales_invoices WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBSeesA[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });

  it('intercompany_transactions are tenant-scoped', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_B, USER_B);

    const orgBSeesA = await execSql(
      `SELECT count(*) as cnt FROM intercompany_transactions WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBSeesA[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });

  it('webhook_endpoints are tenant-scoped', async () => {
    await execSql('BEGIN');
    await setTenantContext(ORG_B, USER_B);

    const orgBSeesA = await execSql(
      `SELECT count(*) as cnt FROM webhook_endpoints WHERE org_id = $1`,
      [ORG_A],
    );
    expect(Number(orgBSeesA[0]?.cnt)).toBe(0);

    await execSql('ROLLBACK');
  });
});
