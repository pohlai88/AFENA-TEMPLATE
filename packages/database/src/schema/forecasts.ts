import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const forecasts = pgTable(
  'forecasts',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    forecastNumber: text('forecast_number'),
    period: text('period').notNull(),
    forecastType: text('forecast_type').notNull(),
    totalAmount: numeric('total_amount', { precision: 18, scale: 2 }),
    currency: text('currency').notNull().default('MYR'),
    forecastLines: jsonb('forecast_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('forecasts_org_id_idx').on(table.orgId, table.id),
    index('forecasts_org_created_idx').on(table.orgId, table.createdAt),
    check('forecasts_org_not_empty', sql`org_id <> ''`),
    check('forecasts_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Forecast = typeof forecasts.$inferSelect;
export type NewForecast = typeof forecasts.$inferInsert;
