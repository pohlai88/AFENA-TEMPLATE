import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * South Africa VAT Settings — regional VAT configuration for South Africa.
 * Source: south-africa-vat-settings.spec.json (adopted from ERPNext South Africa VAT Settings).
 * Singleton config entity for South African VAT compliance.
 */
export const southAfricaVatSettings = pgTable(
  'south_africa_vat_settings',
  {
    ...erpEntityColumns,
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('south_africa_vat_settings_org_singleton').on(table.orgId),
    index('south_africa_vat_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('south_africa_vat_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type SouthAfricaVatSettings = typeof southAfricaVatSettings.$inferSelect;
export type NewSouthAfricaVatSettings = typeof southAfricaVatSettings.$inferInsert;
