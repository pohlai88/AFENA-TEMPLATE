import { sql } from 'drizzle-orm';
import { boolean, check, index, integer, numeric, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Payment terms — structured payment conditions for invoices.
 *
 * Audit P1-6:
 * - Net 30, Net 60, 2/10 Net 30, COD, etc.
 * - Early payment discount calculation (discount_percent + discount_days)
 * - Due date auto-calculation from net_days
 * - UNIQUE(org_id, code) — one term definition per code
 */
export const paymentTerms = pgTable(
  'payment_terms',
  {
    ...baseEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    netDays: integer('net_days').notNull().default(30),
    discountPercent: numeric('discount_percent', { precision: 5, scale: 2 }),
    discountDays: integer('discount_days'),
    isDefault: boolean('is_default').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    index('payment_terms_org_id_idx').on(table.orgId, table.id),
    uniqueIndex('payment_terms_org_code_uniq').on(table.orgId, table.code),
    check('payment_terms_org_not_empty', sql`org_id <> ''`),
    check('payment_terms_net_days_non_negative', sql`net_days >= 0`),
    check('payment_terms_discount_days_valid', sql`discount_days IS NULL OR (discount_days >= 0 AND discount_days <= net_days)`),
    check('payment_terms_discount_percent_valid', sql`discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)`),
    tenantPolicy(table),
  ],
);

export type PaymentTerm = typeof paymentTerms.$inferSelect;
export type NewPaymentTerm = typeof paymentTerms.$inferInsert;
