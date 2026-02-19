import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const documents = pgTable(
  'documents',
  {
    ...erpEntityColumns,

    documentNumber: text('document_number').notNull(),
    title: text('title').notNull(),
    category: text('category'),
    fileUrl: text('file_url'),
    fileSize: integer('file_size'),
    mimeType: text('mime_type'),
    version: integer('version').notNull().default(1),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('documents_org_id_idx').on(table.orgId, table.id),
    index('documents_org_created_idx').on(table.orgId, table.createdAt),
    check('documents_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
