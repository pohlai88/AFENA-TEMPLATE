import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Branches — organizational locations/branches.
 * Source: branches.spec.json (adopted from ERPNext Branch).
 * Master entity for multi-location support.
 */
export const branches = pgTable(
  'branches',
  {
    ...erpEntityColumns,
    /** Branch name or code (unique per organization) */
    branch: text('branch').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('branches_org_name_unique').on(table.orgId, table.branch),
    index('branches_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: search branches by name prefix
    index('branches_org_branch_idx').on(table.orgId, table.branch),
    check('branches_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;
