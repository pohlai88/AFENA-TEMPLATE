import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * POS Settings — org-level config for Point of Sale.
 * Source: pos-settings.spec.json (adopted from ERPNext POS Settings).
 */
export const posSettings = pgTable(
  'pos_settings',
  {
    ...erpEntityColumns,
    usePosInOfflineMode: boolean('use_pos_in_offline_mode').default(false),
    unconditionallyApplyPricingRule: boolean('unconditionally_apply_pricing_rule').default(false),
    allowDeleteSalesInvoice: boolean('allow_delete_sales_invoice').default(false),
    allowUserToEditRate: boolean('allow_user_to_edit_rate').default(false),
    allowPrintBeforePay: boolean('allow_print_before_pay').default(false),
  },
  (table) => [
    index('pos_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('pos_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type PosSetting = typeof posSettings.$inferSelect;
export type NewPosSetting = typeof posSettings.$inferInsert;
