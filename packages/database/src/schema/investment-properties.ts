import { sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const investmentProperties = pgTable(
  'investment_properties',
  {
    ...erpEntityColumns,
    propertyName: text('property_name').notNull(),
    category: text('category').notNull(),
    measurementModel: text('measurement_model').notNull(),
    measurementDate: date('measurement_date').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    fairValueMinor: moneyMinor('fair_value_minor'),
    costMinor: moneyMinor('cost_minor'),
    accumulatedDeprMinor: moneyMinor('accumulated_depr_minor'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('investment_properties', t),
    index('investment_properties_org_company_category_idx').on(t.orgId, t.companyId, t.category),
    index('investment_properties_org_company_model_idx').on(
      t.orgId,
      t.companyId,
      t.measurementModel,
    ),
    check('investment_properties_valid_category', sql`category IN ('land', 'building', 'mixed')`),
    check('investment_properties_valid_model', sql`measurement_model IN ('fair-value', 'cost')`),
  ],
);

export type InvestmentPropertyRow = typeof investmentProperties.$inferSelect;
export type NewInvestmentPropertyRow = typeof investmentProperties.$inferInsert;
