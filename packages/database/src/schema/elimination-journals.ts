/**
 * Elimination Journals Table (M-09)
 *
 * Unified elimination routing — all IC eliminations, consolidation adjustments,
 * FX translation entries, and ownership-change entries route here.
 * Single audit trail per AD-03.
 *
 * sourceType discriminator distinguishes the origin:
 *   - ic_elimination: from IC matching/netting
 *   - consolidation_adjustment: from group consolidation runs
 *   - translation: from FX translation of subsidiary financials
 *   - ownership_change: from updateGroupOwnership
 *
 * Unique constraint (org_id, period_key, source_type, source_ref_id) prevents
 * duplicate eliminations per AD-12.
 */
import { sql } from 'drizzle-orm';
import { check, date, index, jsonb, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const eliminationJournals = pgTable(
  'elimination_journals',
  {
    ...erpEntityColumns,

    /** FK to subsidiary / entity being eliminated */
    subsidiaryId: uuid('subsidiary_id').notNull(),
    /** Fiscal period key (e.g., '2025-01') */
    periodKey: text('period_key').notNull(),
    /** Source discriminator for unified routing */
    sourceType: text('source_type').notNull(),
    /** Traceability ref back to source document / run */
    sourceRefId: text('source_ref_id').notNull(),
    /** Elimination journal line entries (JSONB array) */
    eliminationEntries: jsonb('elimination_entries')
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** Effective date of the elimination */
    effectiveAt: date('effective_at').notNull(),
  },
  (table) => [
    tenantPk(table),
    index('ej_org_id_idx').on(table.orgId, table.id),
    index('ej_org_created_idx').on(table.orgId, table.createdAt),
    // Audit query index: find all eliminations by source type + period
    index('ej_audit_idx').on(table.orgId, table.sourceType, table.periodKey),
    // Lookup by subsidiary
    index('ej_subsidiary_idx').on(table.orgId, table.subsidiaryId, table.periodKey),
    // AD-12: Prevent duplicate eliminations per (org, period, source_type, source_ref_id)
    uniqueIndex('uq__elimination_journals__org_period_source_ref').on(
      table.orgId,
      table.periodKey,
      table.sourceType,
      table.sourceRefId,
    ),
    check('ej_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'ej_valid_source_type',
      sql`source_type IN ('ic_elimination', 'consolidation_adjustment', 'translation', 'ownership_change')`,
    ),

    tenantPolicy(table),
  ],
);

export type EliminationJournal = typeof eliminationJournals.$inferSelect;
export type NewEliminationJournal = typeof eliminationJournals.$inferInsert;
