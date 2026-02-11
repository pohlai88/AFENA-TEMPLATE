import { sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Contacts — first domain entity, built alongside the kernel.
 * Exercises text search, soft-delete, audit timeline, version history.
 */
export const contacts = pgTable(
  'contacts',
  {
    ...baseEntityColumns,
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    notes: text('notes'),
  },
  (table) => [
    index('contacts_org_id_idx').on(table.orgId, table.id),
    index('contacts_org_created_idx').on(table.orgId, table.createdAt),
    check('contacts_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
