import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * R2 files — org-scoped file metadata for cloud storage.
 *
 * RULE C-01: R2 files are LEGAL-scoped (company owns files, nullable for org-wide).
 * Audit P0-1 rebuild:
 * - org_id + tenantPolicy for multi-tenant isolation
 * - company_id for legal entity scoping
 * - Soft-delete via baseEntityColumns (is_deleted/deleted_at/deleted_by)
 * - scan_status for malware gating before download
 * - folder_path for directory structure
 * - uploaded_by for ownership tracking (separate from created_by)
 * - version for optimistic locking via baseEntityColumns
 * - replaced_by for file versioning chain
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const r2Files = pgTable(
  'r2_files',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id'),
    uploadedBy: text('uploaded_by')
      .notNull()
      .default(sql`(auth.user_id())`),
    objectKey: text('object_key').notNull(),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name').notNull(),
    contentType: text('content_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    checksum: text('checksum'),
    folderPath: text('folder_path').notNull().default('/'),
    scanStatus: text('scan_status').notNull().default('pending'),
    scanMessage: text('scan_message'),
    scannedAt: timestamp('scanned_at', { withTimezone: true }),
    replacedById: uuid('replaced_by_id'),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'r2_files_company_fk',
    }).onDelete('set null'),
    index('r2_files_org_id_idx').on(table.orgId, table.id),
    index('r2_files_org_company_idx').on(table.orgId, table.companyId),
    index('r2_files_org_folder_idx').on(table.orgId, table.folderPath),
    index('r2_files_uploaded_by_idx').on(table.orgId, table.uploadedBy),
    check('r2_files_org_not_empty', sql`org_id <> ''`),
    check('r2_files_scan_status_valid', sql`scan_status IN ('pending', 'clean', 'infected', 'error', 'skipped')`),
    tenantPolicy(table),
  ],
);

export type R2File = typeof r2Files.$inferSelect;
export type NewR2File = typeof r2Files.$inferInsert;
