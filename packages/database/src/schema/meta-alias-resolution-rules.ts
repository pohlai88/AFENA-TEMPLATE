import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaAliasSets } from './meta-alias-sets';

/**
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const metaAliasResolutionRules = pgTable(
  'meta_alias_resolution_rules',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    scopeType: text('scope_type').notNull(),
    scopeKey: text('scope_key').notNull(),
    aliasSetId: uuid('alias_set_id')
      .notNull()
      .references(() => metaAliasSets.id, { onDelete: 'restrict' }),
    priority: integer('priority').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('meta_alias_resolution_rules_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_alias_resolution_rules_scope_uniq').on(
      table.orgId,
      table.scopeType,
      table.scopeKey,
    ),
    check('meta_alias_resolution_rules_org_not_empty', sql`org_id <> ''`),
    // NOTE: The lookup index with priority DESC is created in raw migration SQL
    tenantPolicy(table),
  ],
);

export type MetaAliasResolutionRule = typeof metaAliasResolutionRules.$inferSelect;
export type NewMetaAliasResolutionRule = typeof metaAliasResolutionRules.$inferInsert;
