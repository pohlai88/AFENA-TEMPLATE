import { sql } from 'drizzle-orm';
import { check, index, jsonb, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const companies = pgTable(
  'companies',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    legalName: text('legal_name'),
    registrationNo: text('registration_no'),
    taxId: text('tax_id'),
    baseCurrency: text('base_currency').notNull().default('MYR'),
    fiscalYearStart: integer('fiscal_year_start').default(1),
    address: jsonb('address'),
  },
  (table) => [
    tenantPk(table),
    index('companies_org_id_idx').on(table.orgId, table.id),
    index('companies_org_created_idx').on(table.orgId, table.createdAt),
    check('companies_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ],
);

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
