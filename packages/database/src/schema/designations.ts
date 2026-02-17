import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Designations — employee job titles/positions.
 * Source: designations.spec.json (adopted from ERPNext Designation).
 * Master entity for HR job titles.
 */
export const designations = pgTable(
  'designations',
  {
    ...erpEntityColumns,
    /** Designation/job title name (unique per organization) */
    designationName: text('designation_name').notNull(),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('designations_org_name_unique').on(table.orgId, table.designationName),
    index('designations_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: search designations by name prefix
    index('designations_org_name_idx').on(table.orgId, table.designationName),
    check('designations_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Designation = typeof designations.$inferSelect;
export type NewDesignation = typeof designations.$inferInsert;
