import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const campaigns = pgTable(
  'campaigns',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    campaignCode: text('campaign_code'),
    name: text('name').notNull(),
    campaignType: text('campaign_type').notNull(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    budget: numeric('budget', { precision: 18, scale: 2 }),
    targetAudience: text('target_audience'),
    campaignData: jsonb('campaign_data').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('campaigns_org_id_idx').on(table.orgId, table.id),
    index('campaigns_org_created_idx').on(table.orgId, table.createdAt),
    check('campaigns_org_not_empty', sql`org_id <> ''`),
    check('campaigns_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
