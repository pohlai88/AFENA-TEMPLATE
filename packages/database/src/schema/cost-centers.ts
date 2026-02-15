import { sql } from 'drizzle-orm';
import { boolean, check, foreignKey, index, integer, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * Cost centers — ledger dimension for expense allocation.
 *
 * RULE C-01: Cost centers are LEGAL-scoped (company-specific expense allocation).
 * PRD Phase D #14 + G0.3:
 * - Typed column approach (cost_center_id on journal_lines)
 * - Hierarchical: parent_id for department → sub-department
 * - UNIQUE(org_id, company_id, code)
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const costCenters = pgTable(
  'cost_centers',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    code: text('code').notNull(),
    name: text('name').notNull(),
    parentId: uuid('parent_id'),
    level: integer('level').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    description: text('description'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'cost_centers_company_fk',
    }),
    index('cost_centers_org_id_idx').on(table.orgId, table.id),
    index('cost_centers_org_company_idx').on(table.orgId, table.companyId),
    uniqueIndex('cost_centers_org_company_code_uniq').on(
      table.orgId,
      table.companyId,
      table.code,
    ),
    check('cost_centers_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type CostCenter = typeof costCenters.$inferSelect;
export type NewCostCenter = typeof costCenters.$inferInsert;
