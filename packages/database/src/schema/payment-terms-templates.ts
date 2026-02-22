/**
 * Payment Terms Templates Table
 *
 * Reusable payment terms (e.g. "Net 30", "2/10 Net 30").
 * Each template has one or more detail rows defining due-date logic,
 * early-payment discounts, and portion splits.
 */
import { boolean, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const paymentTermsTemplates = pgTable(
  'payment_terms_templates',
  {
    ...erpEntityColumns,

    /** Unique code (e.g. 'NET30', '2-10-NET30') */
    code: text('code').notNull(),
    /** Display name (e.g. "Net 30 Days") */
    name: text('name').notNull(),
    /** Soft active flag */
    isActive: boolean('is_active').notNull().default(true),
  },
  (t) => [
    ...erpIndexes('payment_terms_templates', t),

    uniqueIndex('uq__payment_terms_templates__org_code').on(t.orgId, t.code),
  ],
);

export type PaymentTermsTemplate = typeof paymentTermsTemplates.$inferSelect;
export type NewPaymentTermsTemplate = typeof paymentTermsTemplates.$inferInsert;
