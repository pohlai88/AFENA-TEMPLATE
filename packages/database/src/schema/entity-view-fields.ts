import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { entityViews } from './entity-views';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

export const entityViewFields = pgTable(
  'entity_view_fields',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    viewId: uuid('view_id')
      .notNull(),
    fieldSource: text('field_source').notNull(),
    fieldKey: text('field_key').notNull(),
    displayOrder: integer('display_order').notNull().default(0),
    isVisible: boolean('is_visible').notNull().default(true),
    isSortable: boolean('is_sortable').notNull().default(true),
    isFilterable: boolean('is_filterable').notNull().default(true),
    columnWidth: integer('column_width'),
    componentOverride: text('component_override'),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'view', table.viewId, entityViews, 'cascade'),
    tenantFkIndex(table, 'view', table.viewId),
    index('entity_view_fields_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('entity_view_fields_org_view_field_key_uniq').on(
      table.orgId,
      table.viewId,
      table.fieldKey,
    ),
    check('entity_view_fields_org_not_empty', sql`org_id <> ''`),
    check(
      'entity_view_fields_source_chk',
      sql`field_source IN ('core','module','custom')`,
    ),
    tenantPolicy(table),
  ],
);

export type EntityViewField = typeof entityViewFields.$inferSelect;
export type NewEntityViewField = typeof entityViewFields.$inferInsert;
