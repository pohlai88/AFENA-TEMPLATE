/**
 * NCR Management
 * 
 * Non-conformance reports and disposition.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const NCRSchema = z.object({
  ncrId: z.string(),
  itemId: z.string(),
  lotNumber: z.string(),
  quantity: z.number(),
  defectCode: z.string(),
  defectDescription: z.string(),
  severity: z.enum(['critical', 'major', 'minor']),
  source: z.enum(['supplier', 'internal', 'customer']),
  reportedBy: z.string(),
  reportedAt: z.string(),
  status: z.enum(['open', 'under_review', 'resolved', 'closed']),
  assignedTo: z.string().optional(),
});

export type NCR = z.infer<typeof NCRSchema>;

export const NCRDispositionSchema = z.object({
  ncrId: z.string(),
  disposition: z.enum(['return_to_supplier', 'rework', 'scrap', 'use_as_is', 'sort_and_segregate']),
  rootCause: z.string(),
  correctiveAction: z.string(),
  preventiveAction: z.string().optional(),
  approvedBy: z.string(),
  approvedAt: z.string(),
  estimatedCost: z.number(),
});

export type NCRDisposition = z.infer<typeof NCRDispositionSchema>;

/**
 * Create non-conformance report
 */
export async function createNCR(
  db: Database,
  orgId: string,
  params: {
    ncrId: string;
    itemId: string;
    lotNumber: string;
    quantity: number;
    defectCode: string;
    defectDescription: string;
    severity: 'critical' | 'major' | 'minor';
    source: 'supplier' | 'internal' | 'customer';
    reportedBy: string;
    assignedTo?: string;
  },
): Promise<Result<NCR>> {
  const validation = z.object({
    ncrId: z.string().min(1),
    itemId: z.string().min(1),
    lotNumber: z.string().min(1),
    quantity: z.number().positive(),
    defectCode: z.string().min(1),
    defectDescription: z.string().min(1),
    severity: z.enum(['critical', 'major', 'minor']),
    source: z.enum(['supplier', 'internal', 'customer']),
    reportedBy: z.string().min(1),
    assignedTo: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, insert into ncr table, trigger notifications
  return ok({
    ncrId: params.ncrId,
    itemId: params.itemId,
    lotNumber: params.lotNumber,
    quantity: params.quantity,
    defectCode: params.defectCode,
    defectDescription: params.defectDescription,
    severity: params.severity,
    source: params.source,
    reportedBy: params.reportedBy,
    reportedAt: new Date().toISOString(),
    status: 'open',
    assignedTo: params.assignedTo,
  });
}

/**
 * Dispose NCR with root cause and corrective action
 */
export async function disposeNCR(
  db: Database,
  orgId: string,
  params: {
    ncrId: string;
    disposition: 'return_to_supplier' | 'rework' | 'scrap' | 'use_as_is' | 'sort_and_segregate';
    rootCause: string;
    correctiveAction: string;
    preventiveAction?: string;
    approvedBy: string;
    estimatedCost: number;
  },
): Promise<Result<NCRDisposition>> {
  const validation = z.object({
    ncrId: z.string().min(1),
    disposition: z.enum(['return_to_supplier', 'rework', 'scrap', 'use_as_is', 'sort_and_segregate']),
    rootCause: z.string().min(1),
    correctiveAction: z.string().min(1),
    preventiveAction: z.string().optional(),
    approvedBy: z.string().min(1),
    estimatedCost: z.number().nonnegative(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, update NCR status, create follow-up CAPA if needed
  return ok({
    ncrId: params.ncrId,
    disposition: params.disposition,
    rootCause: params.rootCause,
    correctiveAction: params.correctiveAction,
    preventiveAction: params.preventiveAction,
    approvedBy: params.approvedBy,
    approvedAt: new Date().toISOString(),
    estimatedCost: params.estimatedCost,
  });
}
