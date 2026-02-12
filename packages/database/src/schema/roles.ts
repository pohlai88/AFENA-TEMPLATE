import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Roles — org-scoped role definitions.
 * Each org defines its own roles (admin, manager, clerk, etc.).
 * System roles (is_system=true) are seeded and cannot be deleted.
 */
export const roles = pgTable(
  'roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    key: text('key').notNull(),
    name: text('name').notNull(),
    isSystem: boolean('is_system').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('roles_org_key_idx').on(table.orgId, table.key),
    index('roles_org_id_idx').on(table.orgId),
    check('roles_org_not_empty', sql`org_id <> ''`),
    check('roles_key_not_empty', sql`key <> ''`),
    tenantPolicy(table),
  ],
);

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
