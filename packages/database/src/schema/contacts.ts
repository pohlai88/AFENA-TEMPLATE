import { sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

/**
 * Contacts — first domain entity, built alongside the kernel.
 * Exercises text search, soft-delete, audit timeline, version history.
 * Uses docEntityColumns for lifecycle support (draft → submitted → active → cancelled).
 */
export const contacts = pgTable(
  'contacts',
  {
    ...docEntityColumns,
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('contacts_org_id_idx').on(table.orgId, table.id),
    index('contacts_org_created_idx').on(table.orgId, table.createdAt),
    check('contacts_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
