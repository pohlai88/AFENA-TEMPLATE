/**
 * Payments Table
 *
 * First-class payment aggregate: receive, pay, or internal transfer.
 * Links to GL via journal_entries.sourceType = 'payment' / sourceId = payments.id.
 * Fixes orphan FK from payment_allocations.paymentId.
 *
 * Cross-currency payments store both paid and received amounts with FX rate.
 * Party polymorphism follows the entityType/entityId convention (partyType + partyId).
 */
import { sql } from 'drizzle-orm';
import { check, date, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { currencyCodeStrict, fxRate, moneyMinor } from '../helpers/field-types';
import { erpIndexes } from '../helpers/standard-indexes';

export const payments = pgTable(
  'payments',
  {
    ...docEntityColumns,

    /** Payment document number (allocated by number-sequence service) */
    paymentNo: text('payment_no'),
    /** Direction / type */
    paymentType: text('payment_type').notNull(),
    /** Party discriminator */
    partyType: text('party_type'),
    /** Party reference (customer, supplier, employee UUID) — null for internal transfers */
    partyId: uuid('party_id'),
    /** Source account (bank or GL account UUID) */
    paidFromAccountId: uuid('paid_from_account_id').notNull(),
    /** Destination account (bank or GL account UUID) */
    paidToAccountId: uuid('paid_to_account_id').notNull(),
    /** Amount debited from source in source currency minor units */
    paidAmountMinor: moneyMinor('paid_amount_minor'),
    /** Source currency ISO 4217 — no default */
    paidCurrencyCode: currencyCodeStrict('paid_currency_code'),
    /** Amount credited to destination in destination currency minor units */
    receivedAmountMinor: moneyMinor('received_amount_minor'),
    /** Destination currency ISO 4217 — no default */
    receivedCurrencyCode: currencyCodeStrict('received_currency_code'),
    /** Exchange rate (paid → received). numeric(20,10) */
    fxRate: fxRate('fx_rate'),
    /** Value date of the payment */
    paymentDate: date('payment_date').notNull(),
    /** FK to payment_methods (nullable until master data set up) */
    paymentMethodId: uuid('payment_method_id'),
    /** FK to bank_accounts for the settlement bank */
    bankAccountId: uuid('bank_account_id'),
    /** External reference (cheque number, wire ref, UTR, etc.) */
    referenceNo: text('reference_no'),
    /** Free-form memo */
    memo: text('memo'),
    /** G-14: 3-state posting lifecycle — GL entry creation gated on 'posted' */
    postingStatus: text('posting_status').notNull().default('draft'),
  },
  (t) => [
    ...erpIndexes('payments', t),

    // Unique payment number per org (when assigned)
    uniqueIndex('payments_org_payment_no_idx')
      .on(t.orgId, t.paymentNo)
      .where(sql`payment_no IS NOT NULL`),
    // Party lookup
    index('payments_org_party_idx').on(t.orgId, t.partyType, t.partyId),
    // Bank account lookup
    index('payments_org_bank_idx').on(t.orgId, t.bankAccountId),
    // Date range queries
    index('payments_org_date_idx').on(t.orgId, t.paymentDate),

    check('payments_positive_paid', sql`paid_amount_minor > 0`),
    check('payments_positive_received', sql`received_amount_minor > 0`),
    check(
      'payments_valid_payment_type',
      sql`payment_type IN ('receive', 'pay', 'internal_transfer')`,
    ),
    check(
      'payments_valid_party_type',
      sql`party_type IS NULL OR party_type IN ('customer', 'supplier', 'employee', 'other')`,
    ),
    check(
      'payments_valid_posting_status',
      sql`posting_status IN ('draft', 'approved', 'posted')`,
    ),
  ],
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
