import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Delivery Settings — org-level config for delivery/shipping.
 * Source: delivery-settings.spec.json (adopted from ERPNext Delivery Settings).
 */
export const deliverySettings = pgTable(
  'delivery_settings',
  {
    ...erpEntityColumns,
    stopDeliveryAfterDays: text('stop_delivery_after_days'),
    dispatchAddressTemplate: text('dispatch_address_template'),
  },
  (table) => [
    index('delivery_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('delivery_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type DeliverySetting = typeof deliverySettings.$inferSelect;
export type NewDeliverySetting = typeof deliverySettings.$inferInsert;
