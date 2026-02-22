import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const governmentGrantItems = pgTable(
  'government_grant_items',
  {
    ...erpEntityColumns,
    grantNo: text('grant_no').notNull(),
    grantType: text('grant_type').notNull(),
    periodKey: text('period_key').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    grantAmountMinor: moneyMinor('grant_amount_minor'),
    amortisedMinor: moneyMinor('amortised_minor'),
    deferredMinor: moneyMinor('deferred_minor'),
    relatedAssetId: uuid('related_asset_id'),
    conditions: text('conditions'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('government_grant_items', t),
    uniqueIndex('uq__government_grant_items__org_company_grant_no').on(
      t.orgId,
      t.companyId,
      t.grantNo,
    ),
    index('government_grant_items_org_company_type_idx').on(t.orgId, t.companyId, t.grantType),
    check('government_grant_items_valid_grant_type', sql`grant_type IN ('income', 'capital')`),
    check('government_grant_items_period_format', sql`period_key ~ '^[0-9]{4}-[0-9]{2}$'`),
  ],
);

export type GovernmentGrantItemRow = typeof governmentGrantItems.$inferSelect;
export type NewGovernmentGrantItemRow = typeof governmentGrantItems.$inferInsert;
