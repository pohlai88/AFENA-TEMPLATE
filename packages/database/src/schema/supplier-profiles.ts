import { sql } from 'drizzle-orm';
import { check, foreignKey, index, integer, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Supplier profiles — supplier-specific settings linked to contacts.
 *
 * RULE C-01: Supplier profiles are LEGAL-scoped (company-specific supplier settings).
 * Audit P1-5:
 * - Lead times, preferred currency, default warehouse per supplier
 * - A contact can be both customer AND supplier (separate profile rows)
 * - UNIQUE(org_id, contact_id) — one supplier profile per contact
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const supplierProfiles = pgTable(
  'supplier_profiles',
  {
    ...baseEntityColumns,
    contactId: uuid('contact_id').notNull(),
    companyId: uuid('company_id'),
    supplierCode: text('supplier_code'),
    defaultCurrencyCode: text('default_currency_code').notNull().default('MYR'),
    defaultTaxCode: text('default_tax_code'),
    paymentTermsId: uuid('payment_terms_id'),
    defaultWarehouseId: uuid('default_warehouse_id'),
    payableAccountId: uuid('payable_account_id'),
    leadTimeDays: integer('lead_time_days'),
    supplierGroup: text('supplier_group'),
    supplierRating: text('supplier_rating'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'supplier_profiles_company_fk',
    }).onDelete('set null'),
    index('supp_prof_org_id_idx').on(table.orgId, table.id),
    index('supp_prof_org_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('supp_prof_org_contact_uniq').on(table.orgId, table.contactId),
    check('supp_prof_org_not_empty', sql`org_id <> ''`),
    check('supp_prof_lead_time_non_negative', sql`lead_time_days IS NULL OR lead_time_days >= 0`),
    tenantPolicy(table),
  ],
);

export type SupplierProfile = typeof supplierProfiles.$inferSelect;
export type NewSupplierProfile = typeof supplierProfiles.$inferInsert;
