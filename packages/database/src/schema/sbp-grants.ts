import { sql } from 'drizzle-orm';
import { check, date, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const sbpGrants = pgTable(
  'sbp_grants',
  {
    ...erpEntityColumns,
    grantDate: date('grant_date').notNull(),
    vestingPeriodMonths: integer('vesting_period_months').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    exercisePriceMinor: moneyMinor('exercise_price_minor'),
    fairValuePerUnitMinor: moneyMinor('fair_value_per_unit_minor'),
    unitsGranted: integer('units_granted').notNull(),
    unitsVested: integer('units_vested').notNull().default(0),
    unitsCancelled: integer('units_cancelled').notNull().default(0),
    settlementType: text('settlement_type').notNull(),
    status: text('status').notNull().default('active'),
  },
  (t) => [
    ...erpIndexes('sbp_grants', t),
    index('sbp_grants_org_company_status_idx').on(t.orgId, t.companyId, t.status),
    index('sbp_grants_org_company_grant_date_idx').on(t.orgId, t.companyId, t.grantDate),
    check('sbp_grants_valid_settlement_type', sql`settlement_type IN ('equity', 'cash', 'choice')`),
    check(
      'sbp_grants_valid_status',
      sql`status IN ('active', 'vested', 'exercised', 'forfeited', 'expired')`,
    ),
    check('sbp_grants_positive_units', sql`units_granted > 0`),
  ],
);

export type SbpGrantRow = typeof sbpGrants.$inferSelect;
export type NewSbpGrantRow = typeof sbpGrants.$inferInsert;
