import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const borrowingCostItems = pgTable(
  'borrowing_cost_items',
  {
    ...erpEntityColumns,
    periodKey: text('period_key').notNull(),
    qualifyingAssetId: uuid('qualifying_asset_id').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    borrowingMinor: moneyMinor('borrowing_minor'),
    capitalisedMinor: moneyMinor('capitalised_minor'),
    expensedMinor: moneyMinor('expensed_minor'),
    capitalisationRateBps: integer('capitalisation_rate_bps'),
    status: text('status').notNull().default('active'),
  },
  (t) => [
    ...erpIndexes('borrowing_cost_items', t),
    index('borrowing_cost_items_org_company_period_idx').on(t.orgId, t.companyId, t.periodKey),
    index('borrowing_cost_items_org_asset_idx').on(t.orgId, t.qualifyingAssetId),
    check('borrowing_cost_items_valid_status', sql`status IN ('active', 'suspended', 'ceased')`),
    check('borrowing_cost_items_period_format', sql`period_key ~ '^[0-9]{4}-[0-9]{2}$'`),
  ],
);

export type BorrowingCostItemRow = typeof borrowingCostItems.$inferSelect;
export type NewBorrowingCostItemRow = typeof borrowingCostItems.$inferInsert;
