/**
 * WHT Certificates Table
 *
 * Withholding tax certificates issued to payees.
 * Documents WHT withheld on payments and issued
 * for payee's tax credit claims.
 * Withholding Tax spine table — Phase 3, step 15.
 */
import { sql } from 'drizzle-orm';
import { bigint, check, date, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const whtCertificates = pgTable(
  'wht_certificates',
  {
    ...docEntityColumns,

    /** Certificate number (allocated by doc-number service) */
    certificateNo: text('certificate_no'),
    /** FK to wht_codes */
    whtCodeId: uuid('wht_code_id').notNull(),
    /** FK to the payment that triggered the WHT */
    paymentId: uuid('payment_id'),
    /** Payee (supplier) ID */
    payeeId: uuid('payee_id').notNull(),
    /** Gross amount in minor units */
    grossAmountMinor: bigint('gross_amount_minor', { mode: 'number' }).notNull(),
    /** WHT amount in minor units */
    whtAmountMinor: bigint('wht_amount_minor', { mode: 'number' }).notNull(),
    /** Net amount paid in minor units */
    netAmountMinor: bigint('net_amount_minor', { mode: 'number' }).notNull(),
    /** Currency code */
    currencyCode: text('currency_code').notNull().default('MYR'),
    /** WHT rate applied (snapshot at time of withholding) */
    appliedRate: text('applied_rate').notNull(),
    /** Income type description */
    incomeType: text('income_type').notNull(),
    /** Date of payment */
    paymentDate: date('payment_date').notNull(),
    /** Date certificate was issued */
    issuedDate: date('issued_date'),
    /** Remittance status: 'pending', 'remitted', 'overdue' */
    remittanceStatus: text('remittance_status').notNull().default('pending'),
    /** Date WHT was remitted to tax authority */
    remittedDate: date('remitted_date'),
  },
  (table) => [
    tenantPk(table),
    index('wcer_org_id_idx').on(table.orgId, table.id),
    index('wcer_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by payee
    index('wcer_payee_idx').on(table.orgId, table.payeeId),
    // Lookup by payment
    index('wcer_payment_idx').on(table.orgId, table.paymentId),
    // Lookup by remittance status
    index('wcer_remittance_idx').on(table.orgId, table.remittanceStatus),
    // Unique certificate number
    uniqueIndex('wcer_unique_cert_idx')
      .on(table.orgId, table.certificateNo)
      .where(sql`certificate_no IS NOT NULL`),
    check('wcer_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('wcer_valid_remittance', sql`remittance_status IN ('pending', 'remitted', 'overdue')`),
    check(
      'wcer_positive_amounts',
      sql`gross_amount_minor >= 0 AND wht_amount_minor >= 0 AND net_amount_minor >= 0`,
    ),

    tenantPolicy(table),
  ],
);

export type WhtCertificate = typeof whtCertificates.$inferSelect;
export type NewWhtCertificate = typeof whtCertificates.$inferInsert;
