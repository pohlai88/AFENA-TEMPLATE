/**
 * Match Results Table
 *
 * Stores bank reconciliation matching results.
 * Links bank statement lines to ledger entries (invoices, payments, etc.).
 */
import { sql } from 'drizzle-orm';
import { bigint, check, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const matchResults = pgTable(
  'match_results',
  {
    ...erpEntityColumns,

    /** Reference to the bank statement line */
    statementLineId: uuid('statement_line_id').notNull(),
    /** Type of matched entity: 'invoice', 'payment', 'receipt', 'journal' */
    matchedEntityType: text('matched_entity_type').notNull(),
    /** ID of the matched entity */
    matchedEntityId: uuid('matched_entity_id').notNull(),
    /** Amount matched (in minor units / cents) */
    matchedAmountMinor: bigint('matched_amount_minor', { mode: 'number' }).notNull(),
    /** Match confidence: 'exact', 'high', 'medium', 'low', 'manual' */
    confidence: text('confidence').notNull(),
    /** Match score (0-100) for auto-matching */
    score: integer('score'),
    /** Match status: 'suggested', 'confirmed', 'rejected' */
    status: text('status').notNull().default('suggested'),
    /** User who confirmed/rejected the match */
    reviewedBy: uuid('reviewed_by'),
    /** When the match was reviewed */
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    /** Additional match metadata (rules applied, etc.) */
    matchMetadata: jsonb('match_metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('match_results_org_id_idx').on(table.orgId, table.id),
    index('match_results_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by statement line
    index('match_results_statement_idx').on(table.orgId, table.statementLineId),
    // Lookup by matched entity
    index('match_results_entity_idx').on(table.orgId, table.matchedEntityType, table.matchedEntityId),
    // Unique: one confirmed match per statement line
    uniqueIndex('match_results_confirmed_idx')
      .on(table.orgId, table.statementLineId)
      .where(sql`status = 'confirmed'`),
    check('match_results_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('match_results_valid_score', sql`score IS NULL OR (score >= 0 AND score <= 100)`),

    tenantPolicy(table),
  ],
);

export type MatchResult = typeof matchResults.$inferSelect;
export type NewMatchResult = typeof matchResults.$inferInsert;
