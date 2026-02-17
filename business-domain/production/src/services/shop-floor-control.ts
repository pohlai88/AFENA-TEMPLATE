/**
 * Shop Floor Control
 * 
 * Labor reporting and material issues.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const LaborReportSchema = z.object({
  reportId: z.string(),
  workOrderId: z.string(),
  operationId: z.string(),
  employeeId: z.string(),
  workCenterId: z.string(),
  clockIn: z.string(),
  clockOut: z.string().optional(),
  setupMinutes: z.number(),
  runMinutes: z.number(),
  quantityCompleted: z.number(),
  quantityScrap: z.number().optional(),
  scrapReasonCode: z.string().optional(),
});

export type LaborReport = z.infer<typeof LaborReportSchema>;

export const InventoryIssueSchema = z.object({
  issueId: z.string(),
  workOrderId: z.string(),
  operationId: z.string(),
  itemId: z.string(),
  quantityIssued: z.number(),
  lotNumber: z.string().optional(),
  issuedBy: z.string(),
  issuedAt: z.string(),
  backflushed: z.boolean(),
});

export type InventoryIssue = z.infer<typeof InventoryIssueSchema>;

/**
 * Report labor hours
 */
export async function reportLabor(
  db: Database,
  orgId: string,
  params: {
    reportId: string;
    workOrderId: string;
    operationId: string;
    employeeId: string;
    workCenterId: string;
    clockIn: string;
    clockOut?: string;
    quantityCompleted: number;
    quantityScrap?: number;
    scrapReasonCode?: string;
  },
): Promise<Result<LaborReport>> {
  const validation = z.object({
    reportId: z.string().min(1),
    workOrderId: z.string().min(1),
    operationId: z.string().min(1),
    employeeId: z.string().min(1),
    workCenterId: z.string().min(1),
    clockIn: z.string().datetime(),
    clockOut: z.string().datetime().optional(),
    quantityCompleted: z.number().nonnegative(),
    quantityScrap: z.number().nonnegative().optional(),
    scrapReasonCode: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  if (params.quantityScrap && params.quantityScrap > 0 && !params.scrapReasonCode) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Scrap reason code required when reporting scrap',
    });
  }

  // Calculate labor minutes
  const clockInTime = new Date(params.clockIn);
  const clockOutTime = params.clockOut ? new Date(params.clockOut) : new Date();
  const totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / 60000;

  // Simplified: allocate 20% to setup, 80% to run (in production, would use actual data)
  const setupMinutes = Math.round(totalMinutes * 0.2);
  const runMinutes = Math.round(totalMinutes * 0.8);

  // Placeholder: In production, insert into labor_reports table
  return ok({
    reportId: params.reportId,
    workOrderId: params.workOrderId,
    operationId: params.operationId,
    employeeId: params.employeeId,
    workCenterId: params.workCenterId,
    clockIn: params.clockIn,
    clockOut: params.clockOut,
    setupMinutes,
    runMinutes,
    quantityCompleted: params.quantityCompleted,
    quantityScrap: params.quantityScrap,
    scrapReasonCode: params.scrapReasonCode,
  });
}

/**
 * Issue inventory to production
 */
export async function issueInventory(
  db: Database,
  orgId: string,
  params: {
    issueId: string;
    workOrderId: string;
    operationId: string;
    itemId: string;
    quantityIssued: number;
    lotNumber?: string;
    issuedBy: string;
    backflush?: boolean;
  },
): Promise<Result<InventoryIssue>> {
  const validation = z.object({
    issueId: z.string().min(1),
    workOrderId: z.string().min(1),
    operationId: z.string().min(1),
    itemId: z.string().min(1),
    quantityIssued: z.number().positive(),
    lotNumber: z.string().optional(),
    issuedBy: z.string().min(1),
    backflush: z.boolean().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, check inventory availability, create inventory transaction
  return ok({
    issueId: params.issueId,
    workOrderId: params.workOrderId,
    operationId: params.operationId,
    itemId: params.itemId,
    quantityIssued: params.quantityIssued,
    lotNumber: params.lotNumber,
    issuedBy: params.issuedBy,
    issuedAt: new Date().toISOString(),
    backflushed: params.backflush || false,
  });
}
