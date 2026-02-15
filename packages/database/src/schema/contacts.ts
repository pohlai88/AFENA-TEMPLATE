import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Contacts — first domain entity, built alongside the kernel.
 * Exercises text search, soft-delete, audit timeline, version history.
 * Master data entity (NOT a document) - uses erpEntityColumns for base fields.
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const contacts = pgTable(
  'contacts',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    notes: text('notes'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('contacts_org_created_idx').on(table.orgId, table.createdAt),
    check('contacts_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
