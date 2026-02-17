import { desc, sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { projects } from './projects';

/**
 * Project Updates — status updates and notes for projects.
 * Source: project-updates.spec.json (adopted from ERPNext Project Update).
 * Document entity for tracking project progress and communications.
 */
export const projectUpdates = pgTable(
  'project_updates',
  {
    ...erpEntityColumns,
    namingSeries: text('naming_series'),
    project: uuid('project').notNull().references(() => projects.id),
    sent: boolean('sent').notNull().default(false),
    date: date('date'),
    timeCol: text('time_col'),
    progress: text('progress'),
    progressPercent: text('progress_percent'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('project_updates_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    index('project_updates_org_project_idx').on(table.orgId, table.project),
    index('project_updates_org_date_idx').on(table.orgId, table.date),
    check('project_updates_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type NewProjectUpdate = typeof projectUpdates.$inferInsert;
