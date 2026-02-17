import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Account Categories — categorization for chart of accounts.
 * Source: account-categories.spec.json (adopted from ERPNext Account Category).
 */
export const accountCategories = pgTable(
  'account_categories',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    accountType: text('account_type'),
  },
  (table) => [
    index('account_categories_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('account_categories_name_idx').on(table.orgId, table.name),
    check('account_categories_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type AccountCategory = typeof accountCategories.$inferSelect;
export type NewAccountCategory = typeof accountCategories.$inferInsert;
