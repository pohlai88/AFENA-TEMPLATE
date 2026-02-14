import { sql } from 'drizzle-orm';
import { boolean, check, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Company addresses — lightweight link between companies and addresses.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - One primary per (company, address_type) via partial unique index
 * - Minimal columns: no baseEntityColumns overhead, just the link + audit fields
 */
export const companyAddresses = pgTable(
  'company_addresses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    companyId: uuid('company_id').notNull(),
    addressId: uuid('address_id').notNull(),
    addressType: text('address_type').notNull().default('billing'),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
  },
  (table) => [
    uniqueIndex('company_addr_org_company_addr_uniq').on(
      table.orgId,
      table.companyId,
      table.addressId,
    ),
    uniqueIndex('company_addr_org_company_type_primary_uniq')
      .on(table.orgId, table.companyId, table.addressType)
      .where(sql`is_primary = true`),
    check('company_addr_org_not_empty', sql`org_id <> ''`),
    check(
      'company_addr_type_valid',
      sql`address_type IN ('billing', 'shipping', 'registered', 'warehouse')`,
    ),
    tenantPolicy(table),
  ],
);

export type CompanyAddress = typeof companyAddresses.$inferSelect;
export type NewCompanyAddress = typeof companyAddresses.$inferInsert;
