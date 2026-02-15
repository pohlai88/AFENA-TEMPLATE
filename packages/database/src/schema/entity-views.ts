import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const entityViews = pgTable(
  'entity_views',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    viewName: text('view_name').notNull(),
    viewType: text('view_type').notNull().default('table'),
    isDefault: boolean('is_default').notNull().default(false),
    isSystem: boolean('is_system').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('entity_views_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('entity_views_org_entity_view_name_uniq').on(
      table.orgId,
      table.entityType,
      table.viewName,
    ),
    check('entity_views_org_not_empty', sql`org_id <> ''`),
    check(
      'entity_views_view_type_chk',
      sql`view_type IN ('table','form','kanban','detail')`,
    ),
    tenantPolicy(table),
  ],
);

export type EntityView = typeof entityViews.$inferSelect;
export type NewEntityView = typeof entityViews.$inferInsert;
