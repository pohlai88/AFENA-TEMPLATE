import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const entityViews = pgTable(
  'entity_views',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
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
    tenantPk(table),
    index('entity_views_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('entity_views_org_entity_view_name_uniq').on(
      table.orgId,
      table.entityType,
      table.viewName,
    ),
    check('entity_views_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'entity_views_view_type_chk',
      sql`view_type IN ('table','form','kanban','detail')`,
    ),
    tenantPolicy(table),
  ],
);

export type EntityView = typeof entityViews.$inferSelect;
export type NewEntityView = typeof entityViews.$inferInsert;
