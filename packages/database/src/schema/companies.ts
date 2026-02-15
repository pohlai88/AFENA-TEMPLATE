import { sql } from 'drizzle-orm';
import { check, index, jsonb, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Companies — legal entities within an organization.
 * 
 * RULE C-01: Companies do NOT have company_id (they ARE the company).
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
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
    orgTimezone: text('org_timezone').notNull().default('Asia/Kuala_Lumpur'),
    address: jsonb('address'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('companies_org_created_idx').on(table.orgId, table.createdAt),
    check('companies_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
