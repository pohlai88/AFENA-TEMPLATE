import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

/**
 * Entity attachments — junction table linking files to any entity.
 * Supports multiple files per entity and reuse of one file across entities.
 * RLS org-scoped via tenantPolicy.
 *
 * Spec §5 Gap 4: entity_attachments.
 */
export const entityAttachments = pgTable(
  'entity_attachments',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id')
      .notNull()
      .default(sql`(auth.org_id()::uuid)`),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id').notNull(),
    fileId: uuid('file_id').notNull(),
    label: text('label'),
    createdBy: text('created_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    tenantPk(table),
    index('entity_attach_org_entity_idx').on(table.orgId, table.entityType, table.entityId),
    index('entity_attach_org_file_idx').on(table.orgId, table.fileId),
    check('entity_attach_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('entity_attach_entity_type_not_empty', sql`entity_type <> ''`),
    tenantPolicy(table),
  ],
);

export type EntityAttachment = typeof entityAttachments.$inferSelect;
export type NewEntityAttachment = typeof entityAttachments.$inferInsert;
