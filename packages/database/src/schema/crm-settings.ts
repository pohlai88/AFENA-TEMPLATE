import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * CRM Settings — org-level config for CRM module.
 * Source: crm-settings.spec.json (adopted from ERPNext CRM Settings).
 */
export const crmSettings = pgTable(
  'crm_settings',
  {
    ...erpEntityColumns,
    campaignNamingSeries: text('campaign_naming_series'),
    closedOpportunityAfterDays: text('closed_opportunity_after_days'),
    autoCreationOfContact: boolean('auto_creation_of_contact').default(false),
    carrierNamingSeries: text('carrier_naming_series'),
    customerNamingSeries: text('customer_naming_series'),
  },
  (table) => [
    index('crm_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('crm_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type CrmSetting = typeof crmSettings.$inferSelect;
export type NewCrmSetting = typeof crmSettings.$inferInsert;
