import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docStatusEnum } from '../helpers/doc-status';
import { erpEntityColumns } from '../helpers/erp-entity';
import { moneyMinor } from '../helpers/field-types';
import { tenantPolicy } from '../helpers/tenant-policy';

export const budgets = pgTable(
  'budgets',
  {
    ...erpEntityColumns,
    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),
    budgetNumber: text('budget_number'),
    fiscalYear: integer('fiscal_year').notNull(),
    department: text('department'),
    totalAmountMinor: moneyMinor('total_amount_minor'),
    currency: text('currency').notNull().default('MYR'),
    budgetLines: jsonb('budget_lines').notNull().default(sql`'[]'::jsonb`),
  },
  (table) => [
    tenantPk(table),
    index('budgets_org_id_idx').on(table.orgId, table.id),
    index('budgets_org_created_idx').on(table.orgId, table.createdAt),
    check('budgets_org_not_empty', sql`org_id <> ''`),
    check('budgets_doc_status_valid', sql`doc_status IN ('draft', 'submitted', 'active', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
