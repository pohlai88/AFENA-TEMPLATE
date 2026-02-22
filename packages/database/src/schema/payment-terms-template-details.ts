/**
 * Payment Terms Template Details Table
 *
 * Detail rows for a payment terms template.
 * Supports split terms (e.g. 50 % due on 30 days, 50 % due on 60 days)
 * and early-payment discounts (e.g. 2 % if paid within 10 days).
 */
import { sql } from 'drizzle-orm';
import { check, integer, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { erpIndexes } from '../helpers/standard-indexes';

export const paymentTermsTemplateDetails = pgTable(
  'payment_terms_template_details',
  {
    ...erpEntityColumns,

    /** FK to payment_terms_templates */
    templateId: uuid('template_id').notNull(),
    /** Ordering within the template */
    lineNo: integer('line_no').notNull(),
    /** Basis for computing the due date */
    dueDateBasis: text('due_date_basis').notNull(),
    /** Number of calendar days added to the basis date */
    creditDays: integer('credit_days').notNull().default(0),
    /** Early-payment discount percentage (e.g. 2.00 for 2 %) */
    discountPercent: numeric('discount_percent', { precision: 5, scale: 2 }).notNull().default('0'),
    /** Days within which the discount applies */
    discountDays: integer('discount_days'),
    /** Portion of the invoice covered by this term row (default 100 %) */
    portionPercent: numeric('portion_percent', { precision: 5, scale: 2 }).notNull().default('100'),
  },
  (t) => [
    ...erpIndexes('payment_terms_template_details', t),

    uniqueIndex('uq__payment_terms_details__org_template_line').on(t.orgId, t.templateId, t.lineNo),

    check(
      'payment_terms_details_valid_basis',
      sql`due_date_basis IN ('invoice_date', 'end_of_month', 'end_of_next_month', 'custom')`,
    ),
    check('payment_terms_details_positive_days', sql`credit_days >= 0`),
    check(
      'payment_terms_details_valid_portion',
      sql`portion_percent > 0 AND portion_percent <= 100`,
    ),
    check('payment_terms_details_valid_discount', sql`discount_percent >= 0`),
  ],
);

export type PaymentTermsTemplateDetail = typeof paymentTermsTemplateDetails.$inferSelect;
export type NewPaymentTermsTemplateDetail = typeof paymentTermsTemplateDetails.$inferInsert;
