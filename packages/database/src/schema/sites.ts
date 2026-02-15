import { desc, sql } from 'drizzle-orm';
import { check, foreignKey, index, jsonb, pgTable, primaryKey, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { withCompanyScope } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Sites — physical locations (warehouses, branches, plants, offices).
 * 
 * RULE C-01: Sites are OPERATIONS-scoped (company owns/operates locations).
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const sites = pgTable(
  'sites',
  {
    ...withCompanyScope({ scope: 'OPERATIONS' }),
    name: text('name').notNull(),
    code: text('code').notNull(),
    type: text('type').notNull(),
    address: jsonb('address'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'sites_company_fk',
    }),
    index('sites_org_id_idx').on(table.orgId, table.id),
    index('sites_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('sites_org_not_empty', sql`org_id <> ''`),
    check('sites_type_chk', sql`type IN ('warehouse','branch','plant','office')`),
    uniqueIndex('sites_org_code_uniq').on(table.orgId, table.code),
    tenantPolicy(table),
  ],
);

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
