import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Subscription Settings — configuration for subscription management.
 * Source: subscription-settings.spec.json (adopted from ERPNext Subscription Settings).
 * Singleton config entity for subscription billing.
 */
export const subscriptionSettings = pgTable(
  'subscription_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('subscription_settings_org_singleton').on(table.orgId),
    index('subscription_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('subscription_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type SubscriptionSettings = typeof subscriptionSettings.$inferSelect;
export type NewSubscriptionSettings = typeof subscriptionSettings.$inferInsert;
