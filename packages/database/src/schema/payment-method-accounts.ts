/**
 * Payment Method Accounts Table
 *
 * Maps a payment method to a GL account per company.
 * Enables automatic GL routing: when a payment uses "cash",
 * the debit/credit goes to the company's designated cash account.
 *
 * ERPNext equivalent: "Mode of Payment Account".
 */
import { pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const paymentMethodAccounts = pgTable(
  'payment_method_accounts',
  {
    ...erpEntityColumns,

    /** FK to payment_methods */
    paymentMethodId: uuid('payment_method_id').notNull(),
    /** FK to chart_of_accounts — the GL account for this method+company */
    glAccountId: uuid('gl_account_id').notNull(),
  },
  (t) => [
    ...erpIndexes('payment_method_accounts', t),

    // One GL mapping per method per company per org
    uniqueIndex('uq__payment_method_accounts__org_company_method').on(
      t.orgId,
      t.companyId,
      t.paymentMethodId,
    ),
  ],
);

export type PaymentMethodAccount = typeof paymentMethodAccounts.$inferSelect;
export type NewPaymentMethodAccount = typeof paymentMethodAccounts.$inferInsert;
