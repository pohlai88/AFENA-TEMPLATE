import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { tenantFk, tenantFkIndex, tenantPk } from '../helpers/base-entity';
import { metaAliasSets } from './meta-alias-sets';

export const metaValueAliases = pgTable(
  'meta_value_aliases',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    aliasSetId: uuid('alias_set_id')
      .notNull(),
    targetKey: text('target_key').notNull(),
    alias: text('alias').notNull(),
    synonyms: text('synonyms')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).defaultNow().notNull(),
    effectiveTo: timestamp('effective_to', { withTimezone: true }),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedBy: text('deleted_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'alias_set', table.aliasSetId, metaAliasSets, 'restrict'),
    tenantFkIndex(table, 'alias_set', table.aliasSetId),
    index('meta_value_aliases_org_id_idx').on(table.orgId, table.id),
    check('meta_value_aliases_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'meta_value_aliases_target_enum_chk',
      sql`target_key LIKE 'enum:%'`,
    ),
    check('meta_value_aliases_alias_not_empty', sql`alias <> ''`),
    // NOTE: Partial unique index created in raw migration SQL
    tenantPolicy(table),
  ],
);

export type MetaValueAlias = typeof metaValueAliases.$inferSelect;
export type NewMetaValueAlias = typeof metaValueAliases.$inferInsert;
