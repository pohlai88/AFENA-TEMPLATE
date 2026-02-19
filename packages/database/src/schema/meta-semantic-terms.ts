import { sql } from 'drizzle-orm';
import { boolean, check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const metaSemanticTerms = pgTable(
  'meta_semantic_terms',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    termKey: text('term_key').notNull(),
    name: text('name').notNull(),
    definition: text('definition'),
    examples: text('examples').array(),
    classification: text('classification'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    deletedBy: text('deleted_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    index('meta_semantic_terms_org_id_idx').on(table.orgId, table.id),
    check('meta_semantic_terms_org_not_empty', sql`org_id <> ''`),
    check(
      'meta_semantic_terms_term_key_snake',
      sql`term_key ~ '^[a-z][a-z0-9_]*$'`,
    ),
    // NOTE: Partial unique index created in raw migration SQL
    tenantPolicy(table),
  ],
);

export type MetaSemanticTerm = typeof metaSemanticTerms.$inferSelect;
export type NewMetaSemanticTerm = typeof metaSemanticTerms.$inferInsert;
