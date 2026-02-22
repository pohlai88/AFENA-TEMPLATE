import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

/**
 * User scopes — org-scoped scope assignments.
 * Maps users to company/site/team scope IDs for fine-grained access.
 * Option A: explicit columns — scope only applies if entity has matching column.
 */
export const userScopes = pgTable(
  'user_scopes',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    userId: text('user_id').notNull(),
    scopeType: text('scope_type').notNull(),
    scopeId: uuid('scope_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    uniqueIndex('user_scopes_org_user_type_id_idx').on(
      table.orgId,
      table.userId,
      table.scopeType,
      table.scopeId,
    ),
    index('user_scopes_org_user_idx').on(table.orgId, table.userId),
    check('user_scopes_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'user_scopes_type_valid',
      sql`scope_type IN ('company', 'site', 'team')`,
    ),
    tenantPolicy(table),
  ],
);

export type UserScope = typeof userScopes.$inferSelect;
export type NewUserScope = typeof userScopes.$inferInsert;
