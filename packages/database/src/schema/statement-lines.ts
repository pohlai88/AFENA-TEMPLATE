/**
 * Statement Lines Table
 *
 * Individual line items within a financial statement layout.
 * Each line maps to an account range (or set of ranges) and defines
 * how balances are aggregated and displayed.
 * Statutory Reporting spine table — Phase 3, step 14.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const statementLines = pgTable(
  'statement_lines',
  {
    ...erpEntityColumns,

    /** FK to statement_layouts */
    layoutId: uuid('layout_id').notNull(),
    /** Line number for ordering (e.g., 100, 200, 300) */
    lineNumber: integer('line_number').notNull(),
    /** Line label (e.g., 'Total Current Assets', 'Revenue from Contracts') */
    label: text('label').notNull(),
    /** Line type: 'header', 'detail', 'subtotal', 'total', 'blank' */
    lineType: text('line_type').notNull().default('detail'),
    /** Indentation level (0 = top level) */
    indentLevel: integer('indent_level').notNull().default(0),
    /** Parent line ID for hierarchical nesting (null = root) */
    parentLineId: uuid('parent_line_id'),
    /** Account ranges to aggregate (JSON: [{ from: '1000', to: '1999' }]) */
    accountRanges: jsonb('account_ranges')
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** Sign convention: 'normal' (debit=positive), 'reversed' (credit=positive) */
    signConvention: text('sign_convention').notNull().default('normal'),
    /** Formula for computed lines (references other line numbers) */
    formula: text('formula'),
    /** Whether this line should be bold in the output */
    isBold: boolean('is_bold').notNull().default(false),
    /** Whether to show zero-balance lines */
    showIfZero: boolean('show_if_zero').notNull().default(false),
  },
  (table) => [
    tenantPk(table),
    index('stl_org_id_idx').on(table.orgId, table.id),
    index('stl_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by layout + line order
    index('stl_layout_order_idx').on(table.orgId, table.layoutId, table.lineNumber),
    // Lookup by parent (for tree traversal)
    index('stl_parent_idx').on(table.orgId, table.layoutId, table.parentLineId),
    check('stl_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'stl_valid_line_type',
      sql`line_type IN ('header', 'detail', 'subtotal', 'total', 'blank')`,
    ),
    check('stl_valid_sign', sql`sign_convention IN ('normal', 'reversed')`),
    check('stl_positive_line_number', sql`line_number > 0`),

    tenantPolicy(table),
  ],
);

export type StatementLine = typeof statementLines.$inferSelect;
export type NewStatementLine = typeof statementLines.$inferInsert;
