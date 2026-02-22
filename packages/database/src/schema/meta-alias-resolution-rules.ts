import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { tenantFk, tenantFkIndex, tenantPk } from '../helpers/base-entity';
import { metaAliasSets } from './meta-alias-sets';

export const metaAliasResolutionRules = pgTable(
  'meta_alias_resolution_rules',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    scopeType: text('scope_type').notNull(),
    scopeKey: text('scope_key').notNull(),
    aliasSetId: uuid('alias_set_id')
      .notNull(),
    priority: integer('priority').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'alias_set', table.aliasSetId, metaAliasSets, 'restrict'),
    tenantFkIndex(table, 'alias_set', table.aliasSetId),
    index('meta_alias_resolution_rules_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_alias_resolution_rules_scope_uniq').on(
      table.orgId,
      table.scopeType,
      table.scopeKey,
    ),
    check('meta_alias_resolution_rules_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    // NOTE: The lookup index with priority DESC is created in raw migration SQL
    tenantPolicy(table),
  ],
);

export type MetaAliasResolutionRule = typeof metaAliasResolutionRules.$inferSelect;
export type NewMetaAliasResolutionRule = typeof metaAliasResolutionRules.$inferInsert;
