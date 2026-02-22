import { sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { tenantPk } from '../helpers/base-entity';

export const costCenters = pgTable(
  'cost_centers',
  {
    ...erpEntityColumns,
    code: text('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    parentId: text('parent_id'),
    isActive: text('is_active').notNull().default('true'),
  },
  (table) => [
    tenantPk(table),
    index('cost_centers_org_id_idx').on(table.orgId, table.id),
    index('cost_centers_org_code_idx').on(table.orgId, table.code),
    index('cost_centers_org_created_idx').on(table.orgId, table.createdAt),
    check('cost_centers_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    tenantPolicy(table),
  ],
);

export type CostCenter = typeof costCenters.$inferSelect;
export type NewCostCenter = typeof costCenters.$inferInsert;
