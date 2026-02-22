/**
 * Payment Runs Table
 *
 * Batch payment processing for AP sub-ledger.
 * Groups supplier invoices into payment runs for
 * bank file generation (ISO 20022 pain.001).
 * Missing sub-ledger table — Phase 3, step 17.
 */
import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const paymentRuns = pgTable(
  'payment_runs',
  {
    ...docEntityColumns,

    /** Payment run reference number */
    runNo: text('run_no'),
    /** Payment date */
    paymentDate: date('payment_date').notNull(),
    /** Bank account ID for this payment run */
    bankAccountId: uuid('bank_account_id').notNull(),
    /** Payment method: 'bank-transfer', 'check', 'wire', 'ach', 'rtgs' */
    paymentMethod: text('payment_method').notNull().default('bank-transfer'),
    /** Total amount in minor units */
    totalAmountMinor: bigint('total_amount_minor', { mode: 'number' }).notNull().default(0),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** Number of invoices in this run */
    invoiceCount: integer('invoice_count').notNull().default(0),
    /** Run status: 'draft', 'approved', 'processing', 'completed', 'failed', 'cancelled' */
    runStatus: text('run_status').notNull().default('draft'),
    /** Invoice IDs included (JSON array of UUIDs) */
    invoiceIds: jsonb('invoice_ids')
      .notNull()
      .default(sql`'[]'::jsonb`),
    /** Bank file reference (generated payment file path/ID) */
    bankFileRef: text('bank_file_ref'),
    /** Who approved the run */
    approvedBy: text('approved_by'),
    /** Notes */
    notes: text('notes'),
  },
  (table) => [
    tenantPk(table),
    index('pr_org_id_idx').on(table.orgId, table.id),
    index('pr_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by bank account
    index('pr_bank_idx').on(table.orgId, table.bankAccountId),
    // Lookup by status
    index('pr_status_idx').on(table.orgId, table.runStatus),
    // Lookup by payment date
    index('pr_date_idx').on(table.orgId, table.paymentDate),
    check('pr_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'pr_valid_method',
      sql`payment_method IN ('bank-transfer', 'check', 'wire', 'ach', 'rtgs')`,
    ),
    check(
      'pr_valid_status',
      sql`run_status IN ('draft', 'approved', 'processing', 'completed', 'failed', 'cancelled')`,
    ),

    tenantPolicy(table),
  ],
);

export type PaymentRun = typeof paymentRuns.$inferSelect;
export type NewPaymentRun = typeof paymentRuns.$inferInsert;
