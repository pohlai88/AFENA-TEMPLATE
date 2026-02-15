import { sql } from 'drizzle-orm';
import { check, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Doc links — generic document chain for fulfillment, billing, return, amendment.
 *
 * Transactional Spine Migration 0032: Posting Bridge.
 * - Tracks relationships between documents (SO→DN→SI, PI→GR, etc.)
 * - Line-level traceability via sourceLineId/targetLineId
 * - Cross-org guard enforced at application level (§3.10)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const docLinks = pgTable(
  'doc_links',
  {
    ...baseEntityColumns,
    sourceType: text('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    targetType: text('target_type').notNull(),
    targetId: uuid('target_id').notNull(),
    linkType: text('link_type').notNull(),
    sourceLineId: uuid('source_line_id'),
    targetLineId: uuid('target_line_id'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    uniqueIndex('doc_links_org_src_tgt_type_uniq').on(
      table.orgId,
      table.sourceType,
      table.sourceId,
      table.targetType,
      table.targetId,
      table.linkType,
    ),
    index('doc_links_org_target_idx').on(table.orgId, table.targetType, table.targetId),
    index('doc_links_org_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    check('doc_links_org_not_empty', sql`org_id <> ''`),
    check(
      'doc_links_type_valid',
      sql`link_type IN ('fulfillment', 'billing', 'return', 'amendment')`,
    ),
    tenantPolicy(table),
  ],
);

export type DocLink = typeof docLinks.$inferSelect;
export type NewDocLink = typeof docLinks.$inferInsert;
