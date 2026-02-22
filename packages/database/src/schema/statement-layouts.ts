/**
 * Statement Layouts Table
 *
 * Financial statement structure definitions for BS, IS, CF, and SCE.
 * Each layout defines the hierarchical structure of a financial statement
 * with line groupings capable of nesting.
 * Statutory Reporting spine table — Phase 3, step 14.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const statementLayouts = pgTable(
  'statement_layouts',
  {
    ...erpEntityColumns,

    /** Layout code (e.g., 'BS-IFRS-2025', 'IS-STATUTORY-MY') */
    layoutCode: text('layout_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Statement type: 'balance-sheet', 'income-statement', 'cash-flow', 'equity-changes' */
    statementType: text('statement_type').notNull(),
    /** Accounting standard: 'ifrs', 'local-gaap', 'tax', 'management' */
    standard: text('standard').notNull().default('ifrs'),
    /** Version of this layout */
    layoutVersion: integer('layout_version').notNull().default(1),
    /** Whether this is the active/current layout for the statement type */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('sl_org_id_idx').on(table.orgId, table.id),
    index('sl_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by statement type
    index('sl_type_idx').on(table.orgId, table.statementType, table.standard),
    // Unique layout code per company
    uniqueIndex('sl_unique_code_idx').on(table.orgId, table.companyId, table.layoutCode),
    check('sl_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'sl_valid_type',
      sql`statement_type IN ('balance-sheet', 'income-statement', 'cash-flow', 'equity-changes')`,
    ),
    check('sl_valid_standard', sql`standard IN ('ifrs', 'local-gaap', 'tax', 'management')`),

    tenantPolicy(table),
  ],
);

export type StatementLayout = typeof statementLayouts.$inferSelect;
export type NewStatementLayout = typeof statementLayouts.$inferInsert;
