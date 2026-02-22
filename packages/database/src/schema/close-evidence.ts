/**
 * Close Evidence Table
 *
 * Evidence attachments and sign-offs for close tasks.
 * Each piece of evidence links to a close task and provides
 * audit documentation (e.g., reconciliation screenshots,
 * approval emails, calculation reports).
 * Financial Close spine table — Phase 3, step 13.
 */
import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const closeEvidence = pgTable(
  'close_evidence',
  {
    ...erpEntityColumns,

    /** FK to close_tasks */
    closeTaskId: uuid('close_task_id').notNull(),
    /** Evidence type: 'attachment', 'sign-off', 'report', 'screenshot', 'note' */
    evidenceType: text('evidence_type').notNull(),
    /** Human-readable title */
    title: text('title').notNull(),
    /** Description or note text */
    description: text('description'),
    /** File URL (for attachments / screenshots) */
    fileUrl: text('file_url'),
    /** MIME type of the attachment */
    mimeType: text('mime_type'),
    /** File size in bytes */
    fileSizeBytes: integer('file_size_bytes'),
    /** Who provided this evidence */
    providedBy: text('provided_by').notNull(),
    /** When this evidence was provided */
    providedAt: timestamp('provided_at', { withTimezone: true }).notNull(),
  },
  (table) => [
    tenantPk(table),
    index('cev_org_id_idx').on(table.orgId, table.id),
    index('cev_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by close task
    index('cev_task_idx').on(table.orgId, table.closeTaskId),
    // Lookup by type
    index('cev_type_idx').on(table.orgId, table.evidenceType),
    check('cev_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'cev_valid_type',
      sql`evidence_type IN ('attachment', 'sign-off', 'report', 'screenshot', 'note')`,
    ),

    tenantPolicy(table),
  ],
);

export type CloseEvidence = typeof closeEvidence.$inferSelect;
export type NewCloseEvidence = typeof closeEvidence.$inferInsert;
