/**
 * DB Contract Tests — Finance Domain
 *
 * Proves that database-level controls (RLS, triggers, CHECKs) actually work.
 * Runs against a real Postgres via Testcontainers.
 *
 * These tests are the safety net for SK-3: "No Real DB Testing in CI".
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import type { TestDbContext } from '../testcontainers-helper';
import { queryAsTenant, setupTestDb, teardownTestDb } from '../testcontainers-helper';

const ORG_A = '11111111-1111-1111-1111-111111111111';
const ORG_B = '22222222-2222-2222-2222-222222222222';

let ctx: TestDbContext;

beforeAll(async () => {
  ctx = await setupTestDb();
}, 120_000); // Container startup can take up to 2 minutes

afterAll(async () => {
  if (ctx) await teardownTestDb(ctx);
}, 30_000);

describe('Contract 1: RLS Tenant Isolation', () => {
  it('insert with org_A, query with org_B returns 0 rows', async () => {
    // Insert a journal entry as org_A via admin (bypasses RLS)
    await ctx.adminPool.query(`
      INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, created_by, updated_by)
      VALUES (gen_random_uuid(), $1, 'manual', 'unposted', 'MYR', 0, 0, 'test', 'test')
    `, [ORG_A]);

    // Query as org_B via user pool (subject to RLS)
    const result = await queryAsTenant(
      ctx.userPool,
      ORG_B,
      'SELECT * FROM journal_entries',
    );
    expect(result.rowCount).toBe(0);

    // Query as org_A should find the row
    const resultA = await queryAsTenant(
      ctx.userPool,
      ORG_A,
      'SELECT * FROM journal_entries',
    );
    expect(resultA.rowCount).toBeGreaterThanOrEqual(1);
  });
});

describe('Contract 2: RLS Bypass Resistance', () => {
  it('cross-org read cannot be forced by raw SQL with crafted WHERE clause', async () => {
    // Ensure org_A has data
    await ctx.adminPool.query(`
      INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, created_by, updated_by)
      VALUES (gen_random_uuid(), $1, 'manual', 'unposted', 'MYR', 0, 0, 'test', 'test')
    `, [ORG_A]);

    // As org_B, try to read org_A's data with explicit WHERE org_id = org_A
    const result = await queryAsTenant(
      ctx.userPool,
      ORG_B,
      `SELECT * FROM journal_entries WHERE org_id = $1`,
      [ORG_A],
    );
    // RLS policy should still block — returns 0 rows even with explicit WHERE
    expect(result.rowCount).toBe(0);
  });
});

describe('Contract 3: je_balance CHECK — DR must equal CR', () => {
  it('rejects insert where total_debit_minor != total_credit_minor', async () => {
    await expect(
      ctx.adminPool.query(`
        INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, created_by, updated_by)
        VALUES (gen_random_uuid(), $1, 'manual', 'unposted', 'MYR', 1000, 500, 'test', 'test')
      `, [ORG_A]),
    ).rejects.toThrow(/je_balance/);
  });

  it('accepts insert where total_debit_minor = total_credit_minor', async () => {
    await expect(
      ctx.adminPool.query(`
        INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, created_by, updated_by)
        VALUES (gen_random_uuid(), $1, 'manual', 'unposted', 'MYR', 1000, 1000, 'test', 'test')
      `, [ORG_A]),
    ).resolves.toBeDefined();
  });
});

describe('Contract 4: reject_posted_mutation trigger', () => {
  it('rejects UPDATE on a posted journal entry', async () => {
    // Insert a posted entry
    const id = '33333333-3333-3333-3333-333333333333';
    await ctx.adminPool.query(`
      INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, posting_date, posted_at, posted_by, created_by, updated_by)
      VALUES ($1, $2, 'manual', 'posted', 'MYR', 500, 500, '2026-01-15', NOW(), 'admin', 'test', 'test')
    `, [id, ORG_A]);

    // Attempt to mutate the posted entry
    await expect(
      ctx.adminPool.query(`
        UPDATE journal_entries SET memo = 'tampered' WHERE id = $1
      `, [id]),
    ).rejects.toThrow(/reject_posted_mutation|posted.*immutable|cannot.*modify.*posted/i);
  });
});

describe('Contract 5: reject_closed_period_posting trigger', () => {
  it('rejects INSERT into a hard-closed period', async () => {
    // Create a hard-closed posting period
    await ctx.adminPool.query(`
      INSERT INTO posting_periods (id, org_id, period_key, fiscal_year, status, created_by, updated_by)
      VALUES (gen_random_uuid(), $1, '2025-12', 2025, 'hard-close', 'test', 'test')
      ON CONFLICT DO NOTHING
    `, [ORG_A]);

    // Attempt to insert a journal entry in the closed period
    await expect(
      ctx.adminPool.query(`
        INSERT INTO journal_entries (id, org_id, entry_type, posting_status, currency, total_debit_minor, total_credit_minor, posting_date, created_by, updated_by)
        VALUES (gen_random_uuid(), $1, 'manual', 'unposted', 'MYR', 100, 100, '2025-12-15', 'test', 'test')
      `, [ORG_A]),
    ).rejects.toThrow(/reject_closed_period|closed.*period|period.*closed/i);
  });
});

describe('Contract 6: periodKey CHECK — format validation', () => {
  it('rejects invalid period_key format', async () => {
    await expect(
      ctx.adminPool.query(`
        INSERT INTO posting_periods (id, org_id, period_key, fiscal_year, status, created_by, updated_by)
        VALUES (gen_random_uuid(), $1, 'invalid', 2025, 'open', 'test', 'test')
      `, [ORG_A]),
    ).rejects.toThrow(/period_key|check/i);
  });

  it('accepts valid period_key format YYYY-MM', async () => {
    await expect(
      ctx.adminPool.query(`
        INSERT INTO posting_periods (id, org_id, period_key, fiscal_year, status, created_by, updated_by)
        VALUES (gen_random_uuid(), $1, '2026-01', 2026, 'open', 'test', 'test')
        ON CONFLICT DO NOTHING
      `, [ORG_A]),
    ).resolves.toBeDefined();
  });
});
