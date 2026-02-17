import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Item Variant Settings — product variant configuration.
 * Source: item-variant-settings.spec.json (adopted from ERPNext Item Variant Settings).
 * Singleton config entity for variant attribute management.
 */
export const itemVariantSettings = pgTable(
  'item_variant_settings',
  {
    ...erpEntityColumns,
    doNotUpdateVariants: boolean('do_not_update_variants').default(false),
    allowRenameAttributeValue: boolean('allow_rename_attribute_value').default(false),
    allowDifferentUom: boolean('allow_different_uom').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('item_variant_settings_org_singleton').on(table.orgId),
    index('item_variant_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('item_variant_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ItemVariantSettings = typeof itemVariantSettings.$inferSelect;
export type NewItemVariantSettings = typeof itemVariantSettings.$inferInsert;
