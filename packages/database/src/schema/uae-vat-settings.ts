import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * UAE VAT Settings — regional VAT configuration for United Arab Emirates.
 * Source: uae-vat-settings.spec.json (adopted from ERPNext UAE VAT Settings).
 * Singleton config entity for UAE VAT compliance.
 */
export const uaeVatSettings = pgTable(
  'uae_vat_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('uae_vat_settings_org_singleton').on(table.orgId),
    index('uae_vat_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('uae_vat_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type UaeVatSettings = typeof uaeVatSettings.$inferSelect;
export type NewUaeVatSettings = typeof uaeVatSettings.$inferInsert;
