import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const sites = pgTable(
  'sites',
  {
    ...erpEntityColumns,
    name: text('name').notNull(),
    code: text('code').notNull(),
    type: text('type').notNull(),
    address: jsonb('address'),
  },
  (table) => [
    tenantPk(table),
    index('sites_org_id_idx').on(table.orgId, table.id),
    index('sites_org_created_idx').on(table.orgId, table.createdAt),
    check('sites_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check('sites_type_chk', sql`type IN ('warehouse','branch','plant','office')`),
    uniqueIndex('sites_org_code_uniq').on(table.orgId, table.code),
    tenantPolicy(table),
  ],
);

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
