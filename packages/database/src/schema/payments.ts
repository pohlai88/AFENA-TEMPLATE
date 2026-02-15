import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  date,
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { postingColumns } from '../helpers/posting-columns';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Payments — receive/pay/internal transfers.
 *
 * RULE C-01: Payments are ISSUER-scoped (company makes/receives payments).
 * Transactional Spine Migration 0034.
 * - 6-state posting_status (P-08)
 * - Allocation lock strategy (§3.13): allocatePayment() must
 *   lock payment FOR UPDATE, sort invoice IDs ascending, lock targets
 * - company_id NOT NULL (§3.12)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const payments = pgTable(
  'payments',
  {
    ...docEntityColumns,
    ...postingColumns,
    docNo: text('doc_no'),
    paymentType: text('payment_type').notNull(),
    partyType: text('party_type').notNull(),
    partyId: uuid('party_id').notNull(),
    currencyCode: text('currency_code').notNull().default('MYR'),
    amountMinor: bigint('amount_minor', { mode: 'number' }).notNull(),
    bankAccountId: uuid('bank_account_id'),
    referenceNo: text('reference_no'),
    referenceDate: date('reference_date'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'payments_company_fk',
    }),
    uniqueIndex('pay_org_doc_no_uniq').on(table.orgId, table.docNo),
    index('pay_org_party_posting_idx').on(
      table.orgId,
      table.partyType,
      table.partyId,
      table.postingDate,
    ),
    index('pay_org_posting_date_idx').on(table.orgId, table.postingDate),
    index('pay_org_posting_status_idx').on(table.orgId, table.postingStatus, table.postingDate),
    check('pay_org_not_empty', sql`org_id <> ''`),
    check('pay_company_required', sql`company_id IS NOT NULL`),
    check('pay_amount_positive', sql`amount_minor > 0`),
    check(
      'pay_payment_type_valid',
      sql`payment_type IN ('receive', 'pay', 'internal')`,
    ),
    check(
      'pay_party_type_valid',
      sql`party_type IN ('customer', 'supplier')`,
    ),
    check(
      'pay_posting_status_valid',
      sql`posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed')`,
    ),
    tenantPolicy(table),
  ],
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
