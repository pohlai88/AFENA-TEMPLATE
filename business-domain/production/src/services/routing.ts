/**
 * Routing
 * 
 * Production routing and operation sequences.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const RoutingSchema = z.object({
  routingId: z.string(),
  itemId: z.string(),
  version: z.number(),
  operations: z.array(z.object({
    operationId: z.string(),
    sequence: z.number(),
    workCenterId: z.string(),
    description: z.string(),
    setupTimeMinutes: z.number(),
    runTimePerUnit: z.number(),
    moveTimeMinutes: z.number().optional(),
    queueTimeMinutes: z.number().optional(),
  })),
  active: z.boolean(),
});

export type Routing = z.infer<typeof RoutingSchema>;

export const RoutingValidationSchema = z.object({
  routingId: z.string(),
  valid: z.boolean(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  totalLeadTime: z.number(),
  bottleneckOperation: z.string().optional(),
});

export type RoutingValidation = z.infer<typeof RoutingValidationSchema>;

/**
 * Create a routing
 */
export async function createRouting(
  db: Database,
  orgId: string,
  params: {
    routingId: string;
    itemId: string;
    version: number;
    operations: Array<{
      operationId: string;
      sequence: number;
      workCenterId: string;
      description: string;
      setupTimeMinutes: number;
      runTimePerUnit: number;
      moveTimeMinutes?: number;
      queueTimeMinutes?: number;
    }>;
    active?: boolean;
  },
): Promise<Result<Routing>> {
  const validation = z.object({
    routingId: z.string().min(1),
    itemId: z.string().min(1),
    version: z.number().int().positive(),
    operations: z.array(z.object({
      operationId: z.string(),
      sequence: z.number().int().positive(),
      workCenterId: z.string(),
      description: z.string(),
      setupTimeMinutes: z.number().nonnegative(),
      runTimePerUnit: z.number().positive(),
      moveTimeMinutes: z.number().nonnegative().optional(),
      queueTimeMinutes: z.number().nonnegative().optional(),
    })).min(1),
    active: z.boolean().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Check for duplicate sequences
  const sequences = new Set(params.operations.map((op) => op.sequence));
  if (sequences.size !== params.operations.length) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Duplicate operation sequences detected',
    });
  }

  // Placeholder: In production, insert into routings table
  return ok({
    routingId: params.routingId,
    itemId: params.itemId,
    version: params.version,
    operations: [...params.operations].sort((a, b) => a.sequence - b.sequence),
    active: params.active !== false,
  });
}

/**
 * Validate routing
 */
export async function validateRouting(
  db: Database,
  orgId: string,
  params: {
    routingId: string;
    productionQuantity: number;
  },
): Promise<Result<RoutingValidation>> {
  const validation = z.object({
    routingId: z.string().min(1),
    productionQuantity: z.number().positive(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, fetch routing from database
  // For now, create sample validation
  const errors: string[] = [];
  const warnings: string[] = [];

  // Sample operations for demonstration
  const sampleOps = [
    { seq: 10, setup: 30, runPerUnit: 5, move: 10, queue: 20 },
    { seq: 20, setup: 15, runPerUnit: 3, move: 10, queue: 15 },
    { seq: 30, setup: 20, runPerUnit: 4, move: 10, queue: 10 },
  ];

  // Calculate total lead time
  let totalLeadTime = 0;
  let maxOpTime = 0;
  let bottleneckSeq = 0;

  for (const op of sampleOps) {
    const opTime = op.setup + op.runPerUnit * params.productionQuantity + (op.move || 0) + (op.queue || 0);
    totalLeadTime += opTime;

    if (opTime > maxOpTime) {
      maxOpTime = opTime;
      bottleneckSeq = op.seq;
    }
  }

  // Validation checks
  if (sampleOps.length === 0) {
    errors.push('Routing has no operations');
  }

  if (totalLeadTime > 10000) {
    warnings.push('Total lead time exceeds 10,000 minutes');
  }

  return ok({
    routingId: params.routingId,
    valid: errors.length === 0,
    errors,
    warnings,
    totalLeadTime,
    bottleneckOperation: bottleneckSeq > 0 ? `OP-${bottleneckSeq}` : undefined,
  });
}
