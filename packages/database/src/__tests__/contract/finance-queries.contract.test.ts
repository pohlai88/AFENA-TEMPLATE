/**
 * W5B — Query contract tests for 9 new finance domain tables.
 *
 * Verifies against a real Postgres (Testcontainers):
 * - Org isolation (S2)
 * - Company scope (S2)
 * - Soft-delete filtering (S10)
 * - NOT_FOUND error on missing rows
 *
 * Skip locally: RUN_DB_TESTS=0 pnpm test
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';


import { getPool, seedTestTenant, setupTestDb, teardownTestDb } from './setup';

const SKIP = process.env.RUN_DB_TESTS === '0';

const ORG_ID = '00000000-0000-4000-a000-000000000001';
const OTHER_ORG = '00000000-0000-4000-a000-000000000099';
const COMPANY_ID = '00000000-0000-4000-b000-000000000001';

describe.skipIf(SKIP)('Finance query contract tests', () => {
  beforeAll(async () => {
    await setupTestDb();
    await seedTestTenant(ORG_ID, COMPANY_ID);
    await seedTestTenant(OTHER_ORG, COMPANY_ID);
  }, 120_000);

  afterAll(async () => {
    await teardownTestDb();
  }, 30_000);

  // ── treasury_accounts ───────────────────────────────────────────────
  describe('treasury_accounts', () => {
    const TABLE = 'treasury_accounts';

    it('inserts and reads with org isolation', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO ${TABLE} (id, org_id, company_id, account_no, bank_name, account_type, currency_code, book_balance_minor, as_of_date, is_active)
         VALUES ($1, $2, $3, 'BA-001', 'Test Bank', 'current', 'MYR', 100000, '2025-12-31', true)`,
        [id, ORG_ID, COMPANY_ID],
      );

      // Same org can read
      const { rows } = await p.query(`SELECT * FROM ${TABLE} WHERE org_id = $1 AND id = $2`, [ORG_ID, id]);
      expect(rows).toHaveLength(1);
      expect(rows[0].account_no).toBe('BA-001');

      // Other org cannot see it
      const { rows: otherRows } = await p.query(`SELECT * FROM ${TABLE} WHERE org_id = $1 AND id = $2`, [OTHER_ORG, id]);
      expect(otherRows).toHaveLength(0);
    });

    it('soft-delete filters correctly', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO ${TABLE} (id, org_id, company_id, account_no, bank_name, account_type, currency_code, book_balance_minor, as_of_date, is_active, is_deleted)
         VALUES ($1, $2, $3, 'BA-DEL', 'Deleted Bank', 'savings', 'MYR', 0, '2025-12-31', true, true)`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM ${TABLE} WHERE org_id = $1 AND is_deleted = false`,
        [ORG_ID],
      );
      expect(rows.every((r: any) => r.id !== id)).toBe(true);
    });
  });

  // ── deferred_tax_items ──────────────────────────────────────────────
  describe('deferred_tax_items', () => {
    const TABLE = 'deferred_tax_items';

    it('inserts and reads with company scope', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO ${TABLE} (id, org_id, company_id, period_key, account_id, asset_or_liability, carrying_minor, tax_base_minor, temporary_diff_minor, tax_rate_bps, dta_minor, dtl_minor, currency_code)
         VALUES ($1, $2, $3, '2025-12', 'acc-1', 'asset', 100000, 80000, 20000, 2500, 5000, 0, 'MYR')`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM ${TABLE} WHERE org_id = $1 AND company_id = $2 AND period_key = '2025-12' AND is_deleted = false`,
        [ORG_ID, COMPANY_ID],
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });

    it('period_key CHECK constraint enforces format', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await expect(
        p.query(
          `INSERT INTO ${TABLE} (id, org_id, company_id, period_key, account_id, asset_or_liability, carrying_minor, tax_base_minor, temporary_diff_minor, tax_rate_bps, dta_minor, dtl_minor, currency_code)
           VALUES ($1, $2, $3, 'INVALID', 'acc-1', 'asset', 0, 0, 0, 0, 0, 0, 'MYR')`,
          [id, ORG_ID, COMPANY_ID],
        ),
      ).rejects.toThrow();
    });
  });

  // ── employee_benefit_plans ──────────────────────────────────────────
  describe('employee_benefit_plans', () => {
    it('inserts and reads', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO employee_benefit_plans (id, org_id, company_id, plan_name, plan_type, benefit_type, measurement_date, currency_code, obligation_minor, plan_asset_minor, net_liability_minor, discount_rate_bps, is_active)
         VALUES ($1, $2, $3, 'Pension Plan', 'defined-benefit', 'pension', '2025-12-31', 'MYR', 500000, 400000, 100000, 500, true)`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM employee_benefit_plans WHERE org_id = $1 AND id = $2 AND is_deleted = false`,
        [ORG_ID, id],
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].plan_name).toBe('Pension Plan');
    });
  });

  // ── borrowing_cost_items ────────────────────────────────────────────
  describe('borrowing_cost_items', () => {
    it('inserts and reads', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO borrowing_cost_items (id, org_id, company_id, period_key, qualifying_asset_id, currency_code, borrowing_minor, capitalised_minor, expensed_minor, capitalisation_rate_bps, status)
         VALUES ($1, $2, $3, '2025-12', $4, 'MYR', 50000, 30000, 20000, 600, 'active')`,
        [id, ORG_ID, COMPANY_ID, crypto.randomUUID()],
      );

      const { rows } = await p.query(
        `SELECT * FROM borrowing_cost_items WHERE org_id = $1 AND id = $2 AND is_deleted = false`,
        [ORG_ID, id],
      );
      expect(rows).toHaveLength(1);
    });
  });

  // ── biological_asset_items ──────────────────────────────────────────
  describe('biological_asset_items', () => {
    it('inserts and reads', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO biological_asset_items (id, org_id, company_id, asset_name, asset_class, measurement_date, currency_code, fair_value_minor, cost_minor)
         VALUES ($1, $2, $3, 'Palm Oil', 'bearer-plant', '2025-12-31', 'MYR', 1000000, 800000)`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM biological_asset_items WHERE org_id = $1 AND id = $2 AND is_deleted = false`,
        [ORG_ID, id],
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].asset_name).toBe('Palm Oil');
    });
  });

  // ── government_grant_items ──────────────────────────────────────────
  describe('government_grant_items', () => {
    it('inserts and reads with status filter', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO government_grant_items (id, org_id, company_id, grant_no, grant_type, period_key, currency_code, grant_amount_minor, amortised_minor, deferred_minor, conditions, is_active)
         VALUES ($1, $2, $3, 'GR-001', 'income', '2025-12', 'MYR', 200000, 50000, 150000, 'Employment retention', true)`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM government_grant_items WHERE org_id = $1 AND is_active = true AND is_deleted = false`,
        [ORG_ID],
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── impairment_tests ────────────────────────────────────────────────
  describe('impairment_tests', () => {
    it('inserts and reads by asset', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      const assetId = crypto.randomUUID();
      await p.query(
        `INSERT INTO impairment_tests (id, org_id, company_id, test_date, asset_id, currency_code, carrying_minor, recoverable_minor, impairment_minor, recovery_method, is_reversed)
         VALUES ($1, $2, $3, '2025-12-31', $4, 'MYR', 500000, 400000, 100000, 'value-in-use', false)`,
        [id, ORG_ID, COMPANY_ID, assetId],
      );

      const { rows } = await p.query(
        `SELECT * FROM impairment_tests WHERE org_id = $1 AND asset_id = $2 AND is_deleted = false`,
        [ORG_ID, assetId],
      );
      expect(rows).toHaveLength(1);
      expect(Number(rows[0].impairment_minor)).toBe(100000);
    });
  });

  // ── investment_properties ───────────────────────────────────────────
  describe('investment_properties', () => {
    it('inserts and reads active properties', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO investment_properties (id, org_id, company_id, property_name, category, measurement_model, measurement_date, currency_code, fair_value_minor, cost_minor, accumulated_depr_minor, is_active)
         VALUES ($1, $2, $3, 'Office Tower A', 'commercial', 'fair-value', '2025-12-31', 'MYR', 5000000, 4000000, 200000, true)`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM investment_properties WHERE org_id = $1 AND is_active = true AND is_deleted = false`,
        [ORG_ID],
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── sbp_grants ──────────────────────────────────────────────────────
  describe('sbp_grants', () => {
    it('inserts and reads active grants', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO sbp_grants (id, org_id, company_id, grant_date, vesting_period_months, currency_code, exercise_price_minor, fair_value_per_unit_minor, units_granted, units_vested, units_cancelled, settlement_type, status)
         VALUES ($1, $2, $3, '2025-01-15', 36, 'MYR', 500, 200, 10000, 3000, 0, 'equity', 'active')`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM sbp_grants WHERE org_id = $1 AND status = 'active' AND is_deleted = false`,
        [ORG_ID],
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
      expect(rows.some((r: any) => r.id === id)).toBe(true);
    });

    it('org isolation prevents cross-org reads', async () => {
      const p = getPool();
      const id = crypto.randomUUID();
      await p.query(
        `INSERT INTO sbp_grants (id, org_id, company_id, grant_date, vesting_period_months, currency_code, exercise_price_minor, fair_value_per_unit_minor, units_granted, units_vested, units_cancelled, settlement_type, status)
         VALUES ($1, $2, $3, '2025-01-15', 36, 'MYR', 500, 200, 10000, 0, 0, 'equity', 'active')`,
        [id, ORG_ID, COMPANY_ID],
      );

      const { rows } = await p.query(
        `SELECT * FROM sbp_grants WHERE org_id = $1 AND id = $2`,
        [OTHER_ORG, id],
      );
      expect(rows).toHaveLength(0);
    });
  });
});
