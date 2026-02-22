/**
 * Journal Lines Table
 *
 * Individual debit/credit lines within a journal entry. Each line references
 * an account from the chart of accounts. The sum of debits must equal the sum
 * of credits within each journal entry (enforced by enforce_journal_balance trigger).
 *
 * Append-only after posting: REVOKE UPDATE, DELETE FROM authenticated.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const journalLines = pgTable(
  'journal_lines',
  {
    ...erpEntityColumns,

    /** FK to journal_entries (composite with org_id) */
    journalId: uuid('journal_id').notNull().references(() => journalEntries.id),
    /** Line number within the journal entry (1-based) */
    lineNo: integer('line_no').notNull(),
    /** FK to chart_of_accounts (composite with org_id) */
    accountId: uuid('account_id').notNull(),
    /** Debit or credit side */
    side: text('side').notNull(),
    /** Amount in minor units (always positive; side determines DR/CR) */
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    /** Currency code (ISO 4217) */
    currency: text('currency').notNull().default('MYR'),
    /** Optional memo for this line */
    memo: text('memo'),
    /** Cost center reference (optional) */
    costCenterId: uuid('cost_center_id'),
    /** Project reference (optional) */
    projectId: uuid('project_id'),
  },
  (table) => [
    tenantPk(table),
    index('jl_org_id_idx').on(table.orgId, table.id),
    index('jl_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by journal entry
    index('jl_journal_idx').on(table.orgId, table.journalId),
    // Lookup by account (for trial balance, account ledger)
    index('jl_account_idx').on(table.orgId, table.accountId),
    // Lookup by company + account (for financial statements)
    index('jl_company_account_idx').on(table.orgId, table.companyId, table.accountId),
    check('jl_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('jl_valid_side', sql`side IN ('debit', 'credit')`),
    check('jl_positive_amount', sql`amount_minor >= 0`),

    tenantPolicy(table),
  ],
);

export type JournalLine = typeof journalLines.$inferSelect;
export type NewJournalLine = typeof journalLines.$inferInsert;
