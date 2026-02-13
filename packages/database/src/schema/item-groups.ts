import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Item groups — hierarchical product/service categorisation.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - Tree structure via parent_group_id (nullable = root)
 * - Unique name per org for UI lookup
 */
export const itemGroups = pgTable(
  'item_groups',
  {
    ...baseEntityColumns,
    name: text('name').notNull(),
    parentGroupId: uuid('parent_group_id'),
    description: text('description'),
    sortOrder: integer('sort_order').default(0),
  },
  (table) => [
    uniqueIndex('item_groups_org_name_uniq').on(table.orgId, table.name),
    index('item_groups_org_parent_idx').on(table.orgId, table.parentGroupId),
    check('item_groups_org_not_empty', sql`org_id <> ''`),
    check('item_groups_name_not_empty', sql`name <> ''`),
    tenantPolicy(table),
  ],
);

export type ItemGroup = typeof itemGroups.$inferSelect;
export type NewItemGroup = typeof itemGroups.$inferInsert;
