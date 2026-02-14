import { sql } from 'drizzle-orm';
import { bigint, boolean, check, date, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { docEntityColumns } from '../helpers/doc-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Contracts — recurring billing and subscription management.
 *
 * Audit P1-10:
 * - Referenced by revenue_schedules.source_type ('contract')
 * - Supports recurring billing terms and auto-invoice generation
 * - Contract start/end/renewal dates
 * - Links to contact (customer) and price list
 * - Uses docEntity lifecycle (draft → submitted → active → cancelled)
 */
export const contracts = pgTable(
  'contracts',
  {
    ...docEntityColumns,
    contractNo: text('contract_no'),
    contactId: uuid('contact_id').notNull(),
    contractType: text('contract_type').notNull().default('service'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    renewalDate: date('renewal_date'),
    billingFrequency: text('billing_frequency').notNull().default('monthly'),
    currencyCode: text('currency_code').notNull().default('MYR'),
    totalValueMinor: bigint('total_value_minor', { mode: 'number' }),
    billedToDateMinor: bigint('billed_to_date_minor', { mode: 'number' }).notNull().default(0),
    priceListId: uuid('price_list_id'),
    paymentTermsId: uuid('payment_terms_id'),
    autoRenew: boolean('auto_renew').notNull().default(false),
    renewalTermMonths: text('renewal_term_months'),
    terminationNoticeDays: text('termination_notice_days'),
    memo: text('memo'),
  },
  (table) => [
    index('contracts_org_id_idx').on(table.orgId, table.id),
    index('contracts_org_company_idx').on(table.orgId, table.companyId),
    index('contracts_contact_idx').on(table.orgId, table.contactId),
    index('contracts_status_idx').on(table.orgId, table.docStatus),
    uniqueIndex('contracts_org_contract_no_uniq')
      .on(table.orgId, table.contractNo)
      .where(sql`contract_no IS NOT NULL`),
    check('contracts_org_not_empty', sql`org_id <> ''`),
    check('contracts_type_valid', sql`contract_type IN ('service', 'subscription', 'maintenance', 'lease', 'consulting', 'other')`),
    check('contracts_frequency_valid', sql`billing_frequency IN ('one_time', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')`),
    check('contracts_date_order', sql`end_date IS NULL OR start_date <= end_date`),
    tenantPolicy(table),
  ],
);

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
