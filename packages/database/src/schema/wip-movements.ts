import { sql } from 'drizzle-orm';
import { bigint, check, foreignKey, index, numeric, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { companies } from './companies';

/**
 * WIP movements — append-only ledger for work-in-progress accounting.
 *
 * RULE C-01: WIP movements are OPERATIONS-scoped (company tracks manufacturing WIP).
 * PRD Phase E #19 + G0.21:
 * - Tracks material consumption, labor, overhead into WIP
 * - Append-only: REVOKE UPDATE/DELETE
 * - Links to work_order and optionally to stock_movements
 * 
 * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.
 */
export const wipMovements = pgTable(
  'wip_movements',
  {
    ...baseEntityColumns,
    companyId: uuid('company_id').notNull(),
    workOrderId: uuid('work_order_id').notNull(),
    movementType: text('movement_type').notNull(),
    productId: uuid('product_id'),
    qty: numeric('qty', { precision: 20, scale: 6 }),
    uomId: uuid('uom_id'),
    costMinor: bigint('cost_minor', { mode: 'number' }).notNull().default(0),
    currencyCode: text('currency_code').notNull().default('MYR'),
    postedAt: timestamp('posted_at', { withTimezone: true }).notNull().defaultNow(),
    stockMovementId: uuid('stock_movement_id'),
    journalEntryId: uuid('journal_entry_id'),
    memo: text('memo'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    foreignKey({
      columns: [table.orgId, table.companyId],
      foreignColumns: [companies.orgId, companies.id],
      name: 'wip_movements_company_fk',
    }),
    index('wip_mv_org_id_idx').on(table.orgId, table.id),
    index('wip_mv_work_order_idx').on(table.orgId, table.workOrderId),
    index('wip_mv_posted_idx').on(table.orgId, table.companyId, table.postedAt),
    check('wip_mv_org_not_empty', sql`org_id <> ''`),
    check('wip_mv_type_valid', sql`movement_type IN ('material_issue', 'material_return', 'labor', 'overhead', 'completion', 'scrap')`),
    tenantPolicy(table),
  ],
);

export type WipMovement = typeof wipMovements.$inferSelect;
export type NewWipMovement = typeof wipMovements.$inferInsert;
