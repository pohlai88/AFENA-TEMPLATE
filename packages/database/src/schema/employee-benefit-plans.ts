import { sql } from 'drizzle-orm';
import { boolean, check, date, index, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { currencyCodeStrict, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const employeeBenefitPlans = pgTable(
  'employee_benefit_plans',
  {
    ...erpEntityColumns,
    planName: text('plan_name').notNull(),
    planType: text('plan_type').notNull(),
    benefitType: text('benefit_type').notNull(),
    measurementDate: date('measurement_date').notNull(),
    currencyCode: currencyCodeStrict('currency_code'),
    obligationMinor: moneyMinor('obligation_minor'),
    planAssetMinor: moneyMinor('plan_asset_minor'),
    netLiabilityMinor: moneyMinor('net_liability_minor'),
    discountRateBps: integer('discount_rate_bps'),
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('employee_benefit_plans', t),
    index('employee_benefit_plans_org_company_type_idx').on(t.orgId, t.companyId, t.planType),
    check(
      'employee_benefit_plans_valid_plan_type',
      sql`plan_type IN ('defined-benefit', 'defined-contribution', 'other-long-term', 'termination')`,
    ),
    check(
      'employee_benefit_plans_valid_benefit_type',
      sql`benefit_type IN ('pension', 'medical', 'life-insurance', 'gratuity', 'other')`,
    ),
  ],
);

export type EmployeeBenefitPlanRow = typeof employeeBenefitPlans.$inferSelect;
export type NewEmployeeBenefitPlanRow = typeof employeeBenefitPlans.$inferInsert;
