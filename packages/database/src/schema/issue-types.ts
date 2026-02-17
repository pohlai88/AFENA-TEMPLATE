import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Issue Types — categorization for support issues.
 * Source: issue-types.spec.json (adopted from ERPNext Issue Type).
 */
export const issueTypes = pgTable(
  'issue_types',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    description: text('description'),
  },
  (table) => [
    index('issue_types_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('issue_types_name_idx').on(table.orgId, table.name),
    check('issue_types_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type IssueType = typeof issueTypes.$inferSelect;
export type NewIssueType = typeof issueTypes.$inferInsert;
