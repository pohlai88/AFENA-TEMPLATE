import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

import { metaSemanticTerms } from './meta-semantic-terms';
import { tenantPk, tenantFk, tenantFkIndex} from '../helpers/base-entity';

export const metaTermLinks = pgTable(
  'meta_term_links',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    termId: uuid('term_id')
      .notNull(),
    targetKey: text('target_key').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    tenantFk(table, 'term', table.termId, metaSemanticTerms, 'cascade'),
    tenantFkIndex(table, 'term', table.termId),
    index('meta_term_links_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('meta_term_links_uniq').on(table.orgId, table.termId, table.targetKey),
    check('meta_term_links_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type MetaTermLink = typeof metaTermLinks.$inferSelect;
export type NewMetaTermLink = typeof metaTermLinks.$inferInsert;
