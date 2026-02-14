import { sql } from 'drizzle-orm';
import { bigint, check, index, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Match results — 3-way match for PO–GRN–Invoice reconciliation.
 *
 * PRD Phase D #18.5 + G0.17:
 * - Tolerance thresholds (qty/price variance)
 * - Match status machine: matched → exception → disputed → approved_override
 * - Links PO line, GRN line, and invoice line
 * - Variance tracked in both qty and minor units
 */
export const matchResults = pgTable(
  'match_results',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    poLineId: uuid('po_line_id'),
    grnLineId: uuid('grn_line_id'),
    invoiceLineId: uuid('invoice_line_id'),
    matchType: text('match_type').notNull().default('three_way'),
    status: text('status').notNull().default('pending'),
    qtyVariance: numeric('qty_variance', { precision: 20, scale: 6 }),
    priceVarianceMinor: bigint('price_variance_minor', { mode: 'number' }),
    totalVarianceMinor: bigint('total_variance_minor', { mode: 'number' }),
    toleranceRuleId: uuid('tolerance_rule_id'),
    resolvedBy: text('resolved_by'),
    resolutionNote: text('resolution_note'),
    memo: text('memo'),
  },
  (table) => [
    index('match_results_org_id_idx').on(table.orgId, table.id),
    index('match_results_company_idx').on(table.orgId, table.companyId),
    index('match_results_po_idx').on(table.orgId, table.poLineId),
    index('match_results_grn_idx').on(table.orgId, table.grnLineId),
    index('match_results_invoice_idx').on(table.orgId, table.invoiceLineId),
    index('match_results_status_idx').on(table.orgId, table.status),
    check('match_results_org_not_empty', sql`org_id <> ''`),
    check('match_results_type_valid', sql`match_type IN ('two_way', 'three_way')`),
    check('match_results_status_valid', sql`status IN ('pending', 'matched', 'exception', 'disputed', 'approved_override', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type MatchResult = typeof matchResults.$inferSelect;
export type NewMatchResult = typeof matchResults.$inferInsert;
