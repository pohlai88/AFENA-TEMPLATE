import { sql } from 'drizzle-orm';
import { check, index, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from '../helpers/base-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Inventory trace links — DAG for lot/batch/serial traceability.
 *
 * PRD G0.14:
 * - Links stock movements to build a trace graph
 * - from_movement_id → to_movement_id with qty transferred
 * - Queryable via standard indexes (no JSON-only)
 * - Enables forward/backward trace for recalls
 */
export const inventoryTraceLinks = pgTable(
  'inventory_trace_links',
  {
    ...baseEntityColumns,
    fromMovementId: uuid('from_movement_id').notNull(),
    toMovementId: uuid('to_movement_id').notNull(),
    qty: numeric('qty', { precision: 20, scale: 6 }).notNull(),
    uomId: uuid('uom_id'),
    lotTrackingId: uuid('lot_tracking_id'),
    traceType: text('trace_type').notNull().default('transfer'),
    memo: text('memo'),
  },
  (table) => [
    index('inv_trace_org_id_idx').on(table.orgId, table.id),
    index('inv_trace_from_idx').on(table.orgId, table.fromMovementId),
    index('inv_trace_to_idx').on(table.orgId, table.toMovementId),
    index('inv_trace_lot_idx').on(table.orgId, table.lotTrackingId),
    check('inv_trace_org_not_empty', sql`org_id <> ''`),
    check('inv_trace_qty_positive', sql`qty > 0`),
    check('inv_trace_type_valid', sql`trace_type IN ('transfer', 'consumption', 'production', 'split', 'merge')`),
    tenantPolicy(table),
  ],
);

export type InventoryTraceLink = typeof inventoryTraceLinks.$inferSelect;
export type NewInventoryTraceLink = typeof inventoryTraceLinks.$inferInsert;
