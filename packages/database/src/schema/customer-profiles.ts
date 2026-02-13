import { sql } from 'drizzle-orm';
import { bigint, check, index, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Customer profiles — customer-specific settings linked to contacts.
 *
 * Audit P1-5:
 * - Credit limits, payment terms, default price list per customer
 * - Default currency and tax settings
 * - A contact can be both customer AND supplier (separate profile rows)
 * - UNIQUE(org_id, contact_id) — one customer profile per contact
 */
export const customerProfiles = pgTable(
  'customer_profiles',
  {
    ...baseEntityColumns,
    contactId: uuid('contact_id').notNull(),
    companyId: uuid('company_id'),
    customerCode: text('customer_code'),
    creditLimitMinor: bigint('credit_limit_minor', { mode: 'number' }),
    paymentTermsId: uuid('payment_terms_id'),
    defaultPriceListId: uuid('default_price_list_id'),
    defaultCurrencyCode: text('default_currency_code').notNull().default('MYR'),
    defaultTaxCode: text('default_tax_code'),
    receivableAccountId: uuid('receivable_account_id'),
    salesPersonId: uuid('sales_person_id'),
    customerGroup: text('customer_group'),
    territory: text('territory'),
    memo: text('memo'),
  },
  (table) => [
    index('cust_prof_org_id_idx').on(table.orgId, table.id),
    index('cust_prof_org_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('cust_prof_org_contact_uniq').on(table.orgId, table.contactId),
    check('cust_prof_org_not_empty', sql`org_id <> ''`),
    check('cust_prof_credit_limit_non_negative', sql`credit_limit_minor IS NULL OR credit_limit_minor >= 0`),
    tenantPolicy(table),
  ],
);

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type NewCustomerProfile = typeof customerProfiles.$inferInsert;
