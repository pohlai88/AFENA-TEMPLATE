import { sql } from 'drizzle-orm';
import { bigint, boolean, check, index, integer, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Entity attachments — junction table linking files to any entity.
 * Supports multiple files per entity and reuse of one file across entities.
 * RLS org-scoped via tenantPolicy.
 *
 * Audit P0-2 enhancements:
 * - Denormalized file metadata (fileName, contentType, sizeBytes) for list queries
 * - category for classification (receipt, contract, photo, signature, etc.)
 * - sort_order for display ordering
 * - is_primary for designating featured attachment
 * - Spec §5 Gap 4: entity_attachments
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const entityAttachments = pgTable(
  'entity_attachments',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: text('org_id')
      .notNull()
      .default(sql`(auth.require_org_id())`),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    fileId: uuid('file_id').notNull(),
    label: text('label'),
    category: text('category').notNull().default('general'),
    fileName: text('file_name'),
    contentType: text('content_type'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    isPrimary: boolean('is_primary').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('entity_attach_org_entity_idx').on(table.orgId, table.entityType, table.entityId),
    index('entity_attach_org_file_idx').on(table.orgId, table.fileId),
    index('entity_attach_org_category_idx').on(table.orgId, table.entityType, table.category),
    check('entity_attach_org_not_empty', sql`org_id <> ''`),
    check('entity_attach_entity_type_not_empty', sql`entity_type <> ''`),
    check('entity_attach_category_valid', sql`category IN ('general', 'receipt', 'contract', 'photo', 'signature', 'report', 'correspondence', 'legal', 'other')`),
    tenantPolicy(table),
  ],
);

export type EntityAttachment = typeof entityAttachments.$inferSelect;
export type NewEntityAttachment = typeof entityAttachments.$inferInsert;
