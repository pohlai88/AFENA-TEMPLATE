import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaSemanticTerms } from './meta-semantic-terms';

/**
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const metaTermLinks = pgTable(
  'meta_term_links',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    termId: uuid('term_id')
      .notNull()
      .references(() => metaSemanticTerms.id, { onDelete: 'cascade' }),
    targetKey: text('target_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('meta_term_links_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_term_links_uniq').on(table.orgId, table.termId, table.targetKey),
    check('meta_term_links_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MetaTermLink = typeof metaTermLinks.$inferSelect;
export type NewMetaTermLink = typeof metaTermLinks.$inferInsert;
