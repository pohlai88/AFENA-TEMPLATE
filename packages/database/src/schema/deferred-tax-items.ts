import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const deferredTaxItems = pgTable(
  'deferred_tax_items',
  {
    ...erpEntityColumns,
    periodKey: text('period_key').notNull(),
    accountId: uuid('account_id'),
    assetOrLiability: text('asset_or_liability').notNull(),
    carryingMinor: moneyMinor('carrying_minor'),
    taxBaseMinor: moneyMinor('tax_base_minor'),
    temporaryDiffMinor: moneyMinor('temporary_diff_minor'),
    taxRateBps: integer('tax_rate_bps').notNull(),
    dtaMinor: moneyMinor('dta_minor'),
    dtlMinor: moneyMinor('dtl_minor'),
    currencyCode: currencyCodeStrict('currency_code'),
  },
  (t) => [
    ...erpIndexes('deferred_tax_items', t),
    index('deferred_tax_items_org_company_period_idx').on(t.orgId, t.companyId, t.periodKey),
    check('deferred_tax_items_valid_type', sql`asset_or_liability IN ('dta', 'dtl')`),
    check('deferred_tax_items_tax_rate_positive', sql`tax_rate_bps > 0`),
    check('deferred_tax_items_period_format', sql`period_key ~ '^[0-9]{4}-[0-9]{2}$'`),
  ],
);

export type DeferredTaxItemRow = typeof deferredTaxItems.$inferSelect;
export type NewDeferredTaxItemRow = typeof deferredTaxItems.$inferInsert;
