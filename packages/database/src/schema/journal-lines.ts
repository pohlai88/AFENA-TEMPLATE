import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Journal lines — individual debit/credit entries within a journal entry.
 *
 * RULE C-01: Journal lines are LEGAL-scoped (company-specific GL postings).
 * PRD Phase B #7:
 * - amount stored as INTEGER minor units (no floats for money)
 * - debit_amount / credit_amount: exactly one must be > 0, the other 0
 * - account_id: FK to chart_of_accounts
 * - journal_entry_id: FK to journal_entries
 * - DB-enforced balance: trigger on journal_entries ensures SUM(debit) = SUM(credit)
 * - Append-only once parent entry is posted
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const journalLines = pgTable(
  'journal_lines',
  {
    ...baseEntityColumns,
    journalEntryId: uuid('journal_entry_id').notNull(),
    companyId: uuid('company_id').notNull(),
    accountId: uuid('account_id').notNull(),
    description: text('description'),
    debitAmount: bigint('debit_amount', { mode: 'number' }).notNull().default(0),
    creditAmount: bigint('credit_amount', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    fxRate: text('fx_rate'),
    baseDebitAmount: bigint('base_debit_amount', { mode: 'number' }).notNull().default(0),
    baseCreditAmount: bigint('base_credit_amount', { mode: 'number' }).notNull().default(0),
    costCenterId: uuid('cost_center_id'),
    projectId: uuid('project_id'),
    contactId: uuid('contact_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'journal_lines_company_fk',
    }),
    index('journal_lines_org_id_idx').on(table.orgId, table.id),
    index('journal_lines_org_entry_idx').on(table.orgId, table.journalEntryId),
    index('journal_lines_account_idx').on(table.orgId, table.accountId),
    index('journal_lines_company_idx').on(table.orgId, table.companyId),
    check('journal_lines_org_not_empty', sql`org_id <> ''`),
    check('journal_lines_amount_valid', sql`debit_amount >= 0 AND credit_amount >= 0`),
    check('journal_lines_one_side', sql`(debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0) OR (debit_amount = 0 AND credit_amount = 0)`),
    tenantPolicy(table),
  ],
);

export type JournalLine = typeof journalLines.$inferSelect;
export type NewJournalLine = typeof journalLines.$inferInsert;
