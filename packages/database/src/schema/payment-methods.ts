/**
 * Payment Methods Table
 *
 * Reference master for modes of payment (cash, bank-transfer, check, etc.).
 * Each method can map to a different GL account per company via payment_method_accounts.
 * Replaces free-text payment_method columns with FK integrity.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const paymentMethods = pgTable(
  'payment_methods',
  {
    ...erpEntityColumns,

    /** Unique code (e.g. 'cash', 'bank-transfer', 'check') */
    code: text('code').notNull(),
    /** Display name */
    name: text('name').notNull(),
    /** Classification: cash | bank | general | phone */
    methodType: text('method_type').notNull(),
    /** Soft active flag */
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('payment_methods', t),

    uniqueIndex('uq__payment_methods__org_code').on(t.orgId, t.code),

    check(
      'payment_methods_valid_method_type',
      sql`method_type IN ('cash', 'bank', 'general', 'phone')`,
    ),
  ],
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
