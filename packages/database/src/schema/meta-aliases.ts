import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaAliasSets } from './meta-alias-sets';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

export const metaAliases = pgTable(
  'meta_aliases',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    aliasSetId: uuid('alias_set_id')
      .notNull(),
    targetType: text('target_type').notNull(),
    targetKey: text('target_key').notNull(),
    alias: text('alias').notNull(),
    aliasSlug: text('alias_slug'),
    description: text('description'),
    synonyms: text('synonyms')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    isPrimary: boolean('is_primary').notNull().default(true),
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).defaultNow().notNull(),
    effectiveTo: timestamp('effective_to', { withTimezone: true }),
    // search_text is populated by a trigger (array_to_string is not IMMUTABLE,
    // so Postgres rejects it as a GENERATED ALWAYS AS expression).
    // See migration supplement for the trigger definition.
    searchText: text('search_text'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedBy: text('deleted_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'alias_set', table.aliasSetId, metaAliasSets, 'restrict'),
    tenantFkIndex(table, 'alias_set', table.aliasSetId),
    index('meta_aliases_org_id_idx').on(table.orgId, table.id),
    check('meta_aliases_org_not_empty', sql`org_id <> ''`),
    check('meta_aliases_alias_not_empty', sql`alias <> ''`),
    check(
      'meta_aliases_slug_kebab',
      sql`alias_slug IS NULL OR alias_slug ~ '^[a-z0-9][a-z0-9-]*$'`,
    ),
    // Target key format drift guards
    check(
      'meta_aliases_target_key_asset_chk',
      sql`target_type <> 'asset' OR target_key LIKE 'db.%'`,
    ),
    check(
      'meta_aliases_target_key_custom_field_chk',
      sql`target_type <> 'custom_field' OR target_key LIKE '%.custom:%'`,
    ),
    check(
      'meta_aliases_target_key_metric_chk',
      sql`target_type <> 'metric' OR target_key LIKE 'metric:%'`,
    ),
    check(
      'meta_aliases_target_key_view_field_chk',
      sql`target_type <> 'view_field' OR target_key LIKE 'view:%'`,
    ),
    check(
      'meta_aliases_target_key_enum_value_chk',
      sql`target_type <> 'enum_value' OR target_key LIKE 'enum:%'`,
    ),
    // NOTE: Partial unique indexes + GIN search index are created in raw
    // migration SQL because Drizzle doesn't support WHERE on unique indexes
    // or GIN indexes in the schema builder.
    tenantPolicy(table),
  ],
);

export type MetaAlias = typeof metaAliases.$inferSelect;
export type NewMetaAlias = typeof metaAliases.$inferInsert;
