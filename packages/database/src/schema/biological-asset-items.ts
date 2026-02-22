import { sql } from 'drizzle-orm';
import { check, date, index, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const biologicalAssetItems = pgTable(
  'biological_asset_items',
  {
    ...erpEntityColumns,
    assetName: text('asset_name').notNull(),
    assetClass: text('asset_class').notNull(),
    measurementDate: date('measurement_date').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    fairValueMinor: moneyMinor('fair_value_minor'),
    costMinor: moneyMinor('cost_minor'),
    harvestYield: numeric('harvest_yield', { precision: 18, scale: 6 }),
    harvestUom: text('harvest_uom'),
  },
  (t) => [
    ...erpIndexes('biological_asset_items', t),
    index('biological_asset_items_org_company_class_idx').on(t.orgId, t.companyId, t.assetClass),
    check(
      'biological_asset_items_valid_asset_class',
      sql`asset_class IN ('bearer-plant', 'consumable', 'livestock', 'aquaculture', 'timber')`,
    ),
  ],
);

export type BiologicalAssetItemRow = typeof biologicalAssetItems.$inferSelect;
export type NewBiologicalAssetItemRow = typeof biologicalAssetItems.$inferInsert;
