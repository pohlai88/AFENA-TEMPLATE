import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Projects Settings — org-level config for project management.
 * Source: projects-settings.spec.json (adopted from ERPNext Projects Settings).
 */
export const projectsSettings = pgTable(
  'projects_settings',
  {
    ...erpEntityColumns,
    ignoreUserTimeOverlap: boolean('ignore_user_time_overlap').default(false),
    ignoreEmployeeTimeOverlap: boolean('ignore_employee_time_overlap').default(false),
  },
  (table) => [
    index('projects_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('projects_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectsSetting = typeof projectsSettings.$inferSelect;
export type NewProjectsSetting = typeof projectsSettings.$inferInsert;
