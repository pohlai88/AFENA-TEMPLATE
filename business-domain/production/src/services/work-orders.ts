/**
 * Work Orders
 * 
 * Work order lifecycle management.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const WorkOrderSchema = z.object({
  workOrderId: z.string(),
  itemId: z.string(),
  quantity: z.number(),
  dueDate: z.string(),
  routingId: z.string().optional(),
  bomId: z.string().optional(),
  status: z.enum(['planned', 'released', 'in_progress', 'completed', 'closed']),
  priority: z.number().int().min(1).max(10),
});

export type WorkOrder = z.infer<typeof WorkOrderSchema>;

export const WorkOrderReleaseSchema = z.object({
  workOrderId: z.string(),
  releasedBy: z.string(),
  releasedAt: z.string(),
  materialReservations: z.array(z.object({
    itemId: z.string(),
    quantity: z.number(),
    allocated: z.boolean(),
  })),
  operations: z.array(z.object({
    operationId: z.string(),
    workCenterId: z.string(),
    status: z.enum(['pending', 'ready', 'in_progress', 'completed']),
  })),
});

export type WorkOrderRelease = z.infer<typeof WorkOrderReleaseSchema>;

/**
 * Create a work order
 */
export async function createWorkOrder(
  db: Database,
  orgId: string,
  params: {
    workOrderId: string;
    itemId: string;
    quantity: number;
    dueDate: string;
    routingId?: string;
    bomId?: string;
    priority?: number;
  },
): Promise<Result<WorkOrder>> {
  const validation = z.object({
    workOrderId: z.string().min(1),
    itemId: z.string().min(1),
    quantity: z.number().positive(),
    dueDate: z.string().datetime(),
    routingId: z.string().optional(),
    bomId: z.string().optional(),
    priority: z.number().int().min(1).max(10).optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, insert into work_orders table
  return ok({
    workOrderId: params.workOrderId,
    itemId: params.itemId,
    quantity: params.quantity,
    dueDate: params.dueDate,
    routingId: params.routingId,
    bomId: params.bomId,
    status: 'planned',
    priority: params.priority || 5,
  });
}

/**
 * Release work order to shop floor
 */
export async function releaseWorkOrder(
  db: Database,
  orgId: string,
  params: {
    workOrderId: string;
    releasedBy: string;
    materialAllocation: Array<{ itemId: string; quantity: number }>;
    operations: Array<{ operationId: string; workCenterId: string; sequence: number }>;
  },
): Promise<Result<WorkOrderRelease>> {
  const validation = z.object({
    workOrderId: z.string().min(1),
    releasedBy: z.string().min(1),
    materialAllocation: z.array(z.object({
      itemId: z.string(),
      quantity: z.number().positive(),
    })),
    operations: z.array(z.object({
      operationId: z.string(),
      workCenterId: z.string(),
      sequence: z.number().int().positive(),
    })),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, check material availability, reserve materials
  const materialReservations = params.materialAllocation.map((mat) => ({
    itemId: mat.itemId,
    quantity: mat.quantity,
    allocated: true, // Simplified: assume allocation succeeds
  }));

  // Sort operations by sequence
  const sortedOps = [...params.operations].sort((a, b) => a.sequence - b.sequence);
  const operations = sortedOps.map((op, index) => ({
    operationId: op.operationId,
    workCenterId: op.workCenterId,
    status: (index === 0 ? 'ready' : 'pending') as 'pending' | 'ready' | 'in_progress' | 'completed',
  }));

  return ok({
    workOrderId: params.workOrderId,
    releasedBy: params.releasedBy,
    releasedAt: new Date().toISOString(),
    materialReservations,
    operations,
  });
}
