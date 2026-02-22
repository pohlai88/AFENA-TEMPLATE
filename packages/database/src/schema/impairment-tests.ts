import { sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const impairmentTests = pgTable(
  'impairment_tests',
  {
    ...erpEntityColumns,
    testDate: date('test_date').notNull(),
    assetId: uuid('asset_id'),
    cguId: uuid('cgu_id'),
    currencyCode: currencyCodeStrict('currency_code'),
    carryingMinor: moneyMinor('carrying_minor'),
    recoverableMinor: moneyMinor('recoverable_minor'),
    impairmentMinor: moneyMinor('impairment_minor'),
    recoveryMethod: text('recovery_method').notNull(),
    isReversed: boolean('is_reversed').notNull().default(false),
  },
  (t) => [
    ...erpIndexes('impairment_tests', t),
    index('impairment_tests_org_company_date_idx').on(t.orgId, t.companyId, t.testDate),
    index('impairment_tests_org_asset_idx').on(t.orgId, t.assetId),
    index('impairment_tests_org_cgu_idx').on(t.orgId, t.cguId),
    check('impairment_tests_valid_recovery_method', sql`recovery_method IN ('fvlcd', 'viu')`),
    check('impairment_tests_impairment_non_negative', sql`impairment_minor >= 0`),
  ],
);

export type ImpairmentTestRow = typeof impairmentTests.$inferSelect;
export type NewImpairmentTestRow = typeof impairmentTests.$inferInsert;
