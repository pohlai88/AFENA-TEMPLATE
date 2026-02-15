import { sql } from 'drizzle-orm';
import { boolean, check, customType, index, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

/**
 * Search documents — incremental search index (GAP-DB-004).
 *
 * Populated by search worker from search_outbox. Replaces full MV refresh
 * with incremental UPSERT. Same shape as search_index MV for query compatibility.
 *
 * Composite PK (org_id, entity_type, entity_id) for tenant isolation.
 */
export const searchDocuments = pgTable(
  'search_documents',
  {
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    title: text('title').notNull().default(''),
    subtitle: text('subtitle').default(''),
    searchVector: tsvector('search_vector').notNull().default(sql`''::tsvector`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    isDeleted: boolean('is_deleted').notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.entityType, table.entityId] }),
    index('search_docs_fts_gin').using('gin', table.searchVector),
    index('search_docs_org_type_idx').on(table.orgId, table.entityType),
    check('search_docs_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

export type SearchDocument = typeof searchDocuments.$inferSelect;
export type NewSearchDocument = typeof searchDocuments.$inferInsert;
