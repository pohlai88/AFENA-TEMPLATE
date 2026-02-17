import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { users } from './users';

/**
 * Project Users — team member assignments to projects.
 * Source: project-users.spec.json (adopted from ERPNext Project User).
 * Junction table linking users to projects with role information.
 */
export const projectUsers = pgTable(
  'project_users',
  {
    ...erpEntityColumns,
    userCol: uuid('user_col').notNull().references(() => users.id),
    email: text('email'),
    image: text('image'),
    fullName: text('full_name'),
    welcomeEmailSent: boolean('welcome_email_sent').notNull().default(false),
    viewAttachments: boolean('view_attachments').notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('project_users_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('project_users_org_user_idx').on(table.orgId, table.userCol),
    check('project_users_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectUser = typeof projectUsers.$inferSelect;
export type NewProjectUser = typeof projectUsers.$inferInsert;
