import { sql } from 'drizzle-orm';
import { bigint, boolean, check, foreignKey, index, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Budgets — spending control and encumbrance accounting.
 *
 * RULE C-01: Budgets are LEGAL-scoped (company-specific financial planning).
 * PRD Phase E #22 + G0.18:
 * - enforcement_mode: 'advisory' (warn) or 'hard_stop' (reject)
 * - Links to fiscal period + account for period-based budget control
 * - Commitment sources: PO, PR, contract
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const budgets = pgTable(
  'budgets',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    fiscalPeriodId: uuid('fiscal_period_id').notNull(),
    accountId: uuid('account_id').notNull(),
    costCenterId: uuid('cost_center_id'),
    projectId: uuid('project_id'),
    budgetAmountMinor: bigint('budget_amount_minor', { mode: 'number' }).notNull(),
    committedAmountMinor: bigint('committed_amount_minor', { mode: 'number' }).notNull().default(0),
    actualAmountMinor: bigint('actual_amount_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    enforcementMode: text('enforcement_mode').notNull().default('advisory'),
    isActive: boolean('is_active').notNull().default(true),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'budgets_company_fk',
    }),
    index('budgets_org_id_idx').on(table.orgId, table.id),
    index('budgets_company_idx').on(table.orgId, table.companyId),
    index('budgets_period_idx').on(table.orgId, table.fiscalPeriodId),
    uniqueIndex('budgets_org_period_account_cc_proj_uniq').on(
      table.orgId,
      table.companyId,
      table.fiscalPeriodId,
      table.accountId,
      table.costCenterId,
      table.projectId,
    ),
    check('budgets_org_not_empty', sql`org_id <> ''`),
    check('budgets_enforcement_valid', sql`enforcement_mode IN ('advisory', 'hard_stop')`),
    check('budgets_amount_non_negative', sql`budget_amount_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

/**
 * Budget commitments — encumbrance entries from POs/PRs/contracts.
 * Append-only evidence.
 */
export const budgetCommitments = pgTable(
  'budget_commitments',
  {
    ...baseEntityColumns,
    budgetId: uuid('budget_id').notNull(),
    sourceType: text('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    status: text('status').notNull().default('committed'),
    memo: text('memo'),
  },
  (table) => [
    index('budget_commit_org_id_idx').on(table.orgId, table.id),
    index('budget_commit_budget_idx').on(table.orgId, table.budgetId),
    index('budget_commit_source_idx').on(table.orgId, table.sourceType, table.sourceId),
    check('budget_commit_org_not_empty', sql`org_id <> ''`),
    check('budget_commit_source_valid', sql`source_type IN ('purchase_order', 'purchase_request', 'contract')`),
    check('budget_commit_status_valid', sql`status IN ('committed', 'released', 'cancelled')`),
    tenantPolicy(table),
  ],
);

export type BudgetCommitment = typeof budgetCommitments.$inferSelect;
export type NewBudgetCommitment = typeof budgetCommitments.$inferInsert;
