import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Addresses — reusable address records linked to contacts/companies via join tables.
 *
 * Transactional Spine Migration 0031: Master Data.
 * - address_type: billing/shipping/registered/warehouse
 * - Linked to contacts via contact_addresses, to companies via company_addresses
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const addresses = pgTable(
  'addresses',
  {
    ...baseEntityColumns,
    addressType: text('address_type').notNull().default('billing'),
    line1: text('line1'),
    line2: text('line2'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    country: text('country'),
    phone: text('phone'),
    email: text('email'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('addresses_org_id_idx').on(table.orgId, table.id),
    check('addresses_org_not_empty', sql`org_id <> ''`),
    check(
      'addresses_type_valid',
      sql`address_type IN ('billing', 'shipping', 'registered', 'warehouse')`,
    ),
    tenantPolicy(table),
  ],
);

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
