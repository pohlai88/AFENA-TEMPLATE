import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { roles } from './roles';

/**
 * Role permissions — org-scoped verb+scope grants per entity type.
 * field_rules_json: { deny_write?: string[], mask_read?: {...}[], allow_write?: string[] }
 * deny_write beats allow_write.
 */
export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    entityType: text('entity_type').notNull(),
    verb: text('verb').notNull(),
    scope: text('scope').notNull().default('org'),
    fieldRulesJson: jsonb('field_rules_json')
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('role_perms_org_role_entity_verb_scope_idx').on(
      table.orgId,
      table.roleId,
      table.entityType,
      table.verb,
      table.scope,
    ),
    index('role_perms_org_entity_idx').on(table.orgId, table.entityType),
    check('role_perms_org_not_empty', sql`org_id <> ''`),
    check(
      'role_perms_verb_valid',
      sql`verb IN ('create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore', '*')`,
    ),
    check(
      'role_perms_scope_valid',
      sql`scope IN ('org', 'self', 'company', 'site', 'team')`,
    ),
    tenantPolicy(table),
  ],
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
