import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const customers = pgTable(
  'customers',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    legalName: text('legal_name'),
    taxId: text('tax_id'),
    email: text('email'),
    phone: text('phone'),
    currency: text('currency').notNull().default('MYR'),
    paymentTerms: text('payment_terms'),
    creditLimit: text('credit_limit'),
    billingAddress: jsonb('billing_address'),
    shippingAddress: jsonb('shipping_address'),
  },
  (table) => [
    tenantPk(table),
    index('customers_org_id_idx').on(table.orgId, table.id),
    index('customers_org_code_idx').on(table.orgId, table.code),
    index('customers_org_created_idx').on(table.orgId, table.createdAt),
    check('customers_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ],
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
