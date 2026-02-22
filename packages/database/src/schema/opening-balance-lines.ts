/**
 * Opening Balance Lines Table
 *
 * Individual debit/credit lines within an opening-balance batch.
 * Supports multi-currency with FX conversion to base currency.
 *
 * Constraint: a line may not have both debit and credit > 0.
 */
import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { baseAmountMinor, currencyCodeStrict, fxRate, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const openingBalanceLines = pgTable(
  'opening_balance_lines',
  {
    ...erpEntityColumns,

    /** FK to opening_balance_batches */
    batchId: uuid('batch_id').notNull(),
    /** Ordering within the batch */
    lineNo: integer('line_no').notNull(),
    /** FK to chart_of_accounts */
    accountId: uuid('account_id'),
    /** Party type for sub-ledger drill-down (nullable) */
    partyType: text('party_type'),
    /** FK to the party entity (nullable) */
    partyId: uuid('party_id'),
    /** Debit amount in transaction currency (minor units) */
    debitMinor: moneyMinor('debit_minor'),
    /** Credit amount in transaction currency (minor units) */
    creditMinor: moneyMinor('credit_minor'),
    /** Transaction currency */
    currencyCode: currencyCodeStrict('currency_code'),
    /** Exchange rate to base currency */
    exchangeRate: fxRate('exchange_rate'),
    /** Debit in base currency (minor units) */
    baseDebitMinor: baseAmountMinor('base_debit_minor'),
    /** Credit in base currency (minor units) */
    baseCreditMinor: baseAmountMinor('base_credit_minor'),
    /** Source document reference from the prior system */
    reference: text('reference'),
    /** Per-line validation status */
    validationStatus: text('validation_status').notNull().default('pending'),
  },
  (t) => [
    ...erpIndexes('opening_balance_lines', t),

    uniqueIndex('uq__opening_balance_lines__org_batch_line').on(t.orgId, t.batchId, t.lineNo),

    index('idx__opening_balance_lines__batch').on(t.orgId, t.batchId),
    index('idx__opening_balance_lines__account').on(t.orgId, t.accountId),

    // Cannot have both debit and credit on the same line
    check('opening_balance_lines_no_dual_posting', sql`NOT (debit_minor > 0 AND credit_minor > 0)`),
  ],
);

export type OpeningBalanceLine = typeof openingBalanceLines.$inferSelect;
export type NewOpeningBalanceLine = typeof openingBalanceLines.$inferInsert;
