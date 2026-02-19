import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { roles } from './roles';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

/**
 * User-role assignments — org-scoped.
 * Maps users to roles within their org.
 */
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    userId: text('user_id').notNull(),
    roleId: uuid('role_id')
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'role', table.roleId, roles),
    tenantFkIndex(table, 'role', table.roleId),
    uniqueIndex('user_roles_org_user_role_idx').on(table.orgId, table.userId, table.roleId),
    index('user_roles_org_user_idx').on(table.orgId, table.userId),
    check('user_roles_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
