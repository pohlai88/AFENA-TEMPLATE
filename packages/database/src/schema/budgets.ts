import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';

export const budgets = pgTable(
  'budgets',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    budgetNumber: text('budget_number'),
    fiscalYear: integer('fiscal_year').notNull(),
    department: text('department'),
    totalAmount: numeric('total_amount', { precision: 18, scale: 2 }),
    currency: text('currency').notNull().default('MYR'),
    budgetLines: jsonb('budget_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    index('budgets_org_id_idx').on(table.orgId, table.id),
    index('budgets_org_created_idx').on(table.orgId, table.createdAt),
    check('budgets_org_not_empty', sql`org_id <> ''`),
    check('budgets_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
