import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

export const forecasts = pgTable(
  'forecasts',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    forecastNumber: text('forecast_number'),
    period: text('period').notNull(),
    forecastType: text('forecast_type').notNull(),
    totalAmountMinor: moneyMinor('total_amount_minor'),
    currency: text('currency').notNull().default('MYR'),
    forecastLines: jsonb('forecast_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('forecasts_org_id_idx').on(table.orgId, table.id),
    index('forecasts_org_created_idx').on(table.orgId, table.createdAt),
    check('forecasts_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('forecasts_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Forecast = typeof forecasts.$inferSelect;
export type NewForecast = typeof forecasts.$inferInsert;
