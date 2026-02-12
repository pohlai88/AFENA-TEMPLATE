import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

export const metaAliasSets = pgTable(
  'meta_alias_sets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    setKey: text('set_key').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    locale: text('locale'),
    isDefault: boolean('is_default').notNull().default(false),
    isSystem: boolean('is_system').notNull().default(false),
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
    index('meta_alias_sets_org_id_idx').on(table.orgId, table.id),
    check('meta_alias_sets_org_not_empty', sql`org_id <> ''`),
    check(
      'meta_alias_sets_set_key_snake',
      sql`set_key ~ '^[a-z][a-z0-9_]*$'`,
    ),
    // NOTE: Partial unique indexes (CREATE UNIQUE INDEX ... WHERE ...) are
    // created in the raw migration SQL because Drizzle doesn't support
    // WHERE clauses on unique indexes in the schema builder.
    // See: 0011_phase_a_schema_governance.sql
    tenantPolicy(table),
  ],
);

export type MetaAliasSet = typeof metaAliasSets.$inferSelect;
export type NewMetaAliasSet = typeof metaAliasSets.$inferInsert;
