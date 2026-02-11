import { sql } from 'drizzle-orm';
import { boolean, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Reusable base columns for all domain entity tables.
 *
 * - id: UUID PK (gen_random_uuid)
 * - org_id: tenant isolation via auth.require_org_id()
 * - created_at / updated_at: timestamps (updated_at enforced by DB trigger K-08)
 * - created_by / updated_by: actor identity via auth.user_id()
 * - version: optimistic locking counter
 * - is_deleted / deleted_at / deleted_by: soft-delete support
 *
 * Usage: spread into pgTable column definition:
 *   pgTable('my_table', { ...baseEntityColumns, myField: text('my_field') })
 */
export const baseEntityColumns = {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: text('org_id')
    .notNull()
    .default(sql`(auth.require_org_id())`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: text('created_by')
    .notNull()
    .default(sql`(auth.user_id())`),
  updatedBy: text('updated_by')
    .notNull()
    .default(sql`(auth.user_id())`),
  version: integer('version').notNull().default(1),
  isDeleted: boolean('is_deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: text('deleted_by'),
};
