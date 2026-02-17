/**
 * Material Requirements Planning (MRP)
 * 
 * Requirements explosion, lot sizing, planned orders.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const MRPResultSchema = z.object({
  runId: z.string(),
  itemId: z.string(),
  grossRequirements: z.array(z.object({
    period: z.string(),
    quantity: z.number(),
  })),
  scheduledReceipts: z.array(z.object({
    period: z.string(),
    quantity: z.number(),
  })),
  projectedOnHand: z.array(z.object({
    period: z.string(),
    quantity: z.number(),
  })),
  plannedOrders: z.array(z.object({
    period: z.string(),
    quantity: z.number(),
    orderType: z.enum(['purchase', 'production']),
  })),
});

export type MRPResult = z.infer<typeof MRPResultSchema>;

export const PlannedOrderSchema = z.object({
  orderId: z.string(),
  itemId: z.string(),
  quantity: z.number(),
  dueDate: z.string(),
  orderType: z.enum(['purchase', 'production']),
  status: z.enum(['planned', 'firmed', 'released']),
});

export type PlannedOrder = z.infer<typeof PlannedOrderSchema>;

/**
 * Run MRP for an item
 */
export async function runMRP(
  db: Database,
  orgId: string,
  params: {
    runId: string;
    itemId: string;
    grossRequirements: Array<{ period: string; quantity: number }>;
    onHandInventory: number;
    safetyStock: number;
    lotSizingRule: 'lot_for_lot' | 'fixed_order_quantity' | 'economic_order_quantity';
    fixedOrderQty?: number;
    leadTimeDays: number;
    orderType: 'purchase' | 'production';
  },
): Promise<Result<MRPResult>> {
  const validation = z.object({
    runId: z.string().min(1),
    itemId: z.string().min(1),
    grossRequirements: z.array(z.object({
      period: z.string(),
      quantity: z.number().nonnegative(),
    })),
    onHandInventory: z.number().nonnegative(),
    safetyStock: z.number().nonnegative(),
    lotSizingRule: z.enum(['lot_for_lot', 'fixed_order_quantity', 'economic_order_quantity']),
    fixedOrderQty: z.number().positive().optional(),
    leadTimeDays: z.number().int().nonnegative(),
    orderType: z.enum(['purchase', 'production']),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  if (params.lotSizingRule === 'fixed_order_quantity' && !params.fixedOrderQty) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Fixed order quantity required for fixed_order_quantity lot sizing',
    });
  }

  // Simple MRP logic: period-by-period netting
  const scheduledReceipts: Array<{ period: string; quantity: number }> = []; // Placeholder
  const projectedOnHand: Array<{ period: string; quantity: number }> = [];
  const plannedOrders: Array<{ period: string; quantity: number; orderType: 'purchase' | 'production' }> = [];

  let onHand = params.onHandInventory;

  for (const req of params.grossRequirements) {
    // Net requirements
    onHand = onHand - req.quantity;

    // Check if below safety stock
    if (onHand < params.safetyStock) {
      const netReq = params.safetyStock - onHand;
      let orderQty = netReq;

      // Apply lot sizing
      if (params.lotSizingRule === 'fixed_order_quantity' && params.fixedOrderQty) {
        orderQty = Math.ceil(netReq / params.fixedOrderQty) * params.fixedOrderQty;
      }

      // Offset for lead time (placeholder: same period for simplicity)
      plannedOrders.push({
        period: req.period,
        quantity: orderQty,
        orderType: params.orderType,
      });

      onHand += orderQty;
    }

    projectedOnHand.push({
      period: req.period,
      quantity: onHand,
    });
  }

  return ok({
    runId: params.runId,
    itemId: params.itemId,
    grossRequirements: params.grossRequirements,
    scheduledReceipts,
    projectedOnHand,
    plannedOrders,
  });
}

/**
 * Create a planned order
 */
export async function createPlannedOrder(
  db: Database,
  orgId: string,
  params: {
    orderId: string;
    itemId: string;
    quantity: number;
    dueDate: string;
    orderType: 'purchase' | 'production';
    firm?: boolean;
  },
): Promise<Result<PlannedOrder>> {
  const validation = z.object({
    orderId: z.string().min(1),
    itemId: z.string().min(1),
    quantity: z.number().positive(),
    dueDate: z.string().datetime(),
    orderType: z.enum(['purchase', 'production']),
    firm: z.boolean().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, insert into planned_orders table
  return ok({
    orderId: params.orderId,
    itemId: params.itemId,
    quantity: params.quantity,
    dueDate: params.dueDate,
    orderType: params.orderType,
    status: params.firm ? 'firmed' : 'planned',
  });
}
