import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Plaid Settings — integration configuration for Plaid banking API.
 * Source: plaid-settings.spec.json (adopted from ERPNext Plaid Settings).
 * Singleton config entity for Plaid integration.
 */
export const plaidSettings = pgTable(
  'plaid_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('plaid_settings_org_singleton').on(table.orgId),
    index('plaid_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('plaid_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type PlaidSettings = typeof plaidSettings.$inferSelect;
export type NewPlaidSettings = typeof plaidSettings.$inferInsert;
