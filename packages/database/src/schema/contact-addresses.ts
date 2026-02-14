import { sql } from 'drizzle-orm';
import { boolean, check, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Contact addresses — lightweight link between contacts and addresses.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - One primary per (contact, address_type) via partial unique index
 * - Minimal columns: no baseEntityColumns overhead, just the link + audit fields
 */
export const contactAddresses = pgTable(
  'contact_addresses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    contactId: uuid('contact_id').notNull(),
    addressId: uuid('address_id').notNull(),
    addressType: text('address_type').notNull().default('billing'),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
  },
  (table) => [
    uniqueIndex('contact_addr_org_contact_addr_uniq').on(
      table.orgId,
      table.contactId,
      table.addressId,
    ),
    uniqueIndex('contact_addr_org_contact_type_primary_uniq')
      .on(table.orgId, table.contactId, table.addressType)
      .where(sql`is_primary = true`),
    check('contact_addr_org_not_empty', sql`org_id <> ''`),
    check(
      'contact_addr_type_valid',
      sql`address_type IN ('billing', 'shipping', 'registered', 'warehouse')`,
    ),
    tenantPolicy(table),
  ],
);

export type ContactAddress = typeof contactAddresses.$inferSelect;
export type NewContactAddress = typeof contactAddresses.$inferInsert;
