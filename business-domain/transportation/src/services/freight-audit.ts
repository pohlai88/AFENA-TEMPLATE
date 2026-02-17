/**
 * Freight Audit
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const FreightAuditSchema = z.object({
  auditId: z.string(),
  billId: z.string(),
  shipmentId: z.string(),
  carrierId: z.string(),
  billedAmount: z.number(),
  expectedAmount: z.number(),
  variance: z.number(),
  variancePercent: z.number(),
  approved: z.boolean(),
  discrepancies: z.array(z.object({
    type: z.string(),
    description: z.string(),
    amount: z.number(),
  })),
});

export type FreightAudit = z.infer<typeof FreightAuditSchema>;

export const FreightClaimSchema = z.object({
  claimId: z.string(),
  shipmentId: z.string(),
  carrierId: z.string(),
  claimType: z.enum(['damage', 'loss', 'shortage', 'delay']),
  claimAmount: z.number(),
  description: z.string(),
  filedAt: z.string(),
  status: z.enum(['open', 'under_review', 'approved', 'denied', 'settled']),
});

export type FreightClaim = z.infer<typeof FreightClaimSchema>;

export async function auditFreightBill(
  db: Database,
  orgId: string,
  params: {
    auditId: string;
    billId: string;
    shipmentId: string;
    carrierId: string;
    billedAmount: number;
    expectedAmount: number;
    discrepancies?: Array<{ type: string; description: string; amount: number }>;
  },
): Promise<Result<FreightAudit>> {
  const validation = z.object({
    auditId: z.string().min(1),
    billId: z.string().min(1),
    shipmentId: z.string().min(1),
    carrierId: z.string().min(1),
    billedAmount: z.number().nonnegative(),
    expectedAmount: z.number().nonnegative(),
    discrepancies: z.array(z.object({
      type: z.string(),
      description: z.string(),
      amount: z.number(),
    })).optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const variance = params.billedAmount - params.expectedAmount;
  const variancePercent = params.expectedAmount !== 0 ? (variance / params.expectedAmount) * 100 : 0;
  const approved = Math.abs(variance) <= params.expected * 0.05; // 5% tolerance

  return ok({
    auditId: params.auditId,
    billId: params.billId,
    shipmentId: params.shipmentId,
    carrierId: params.carrierId,
    billedAmount: params.billedAmount,
    expectedAmount: params.expectedAmount,
    variance: Math.round(variance * 100) / 100,
    variancePercent: Math.round(variancePercent * 100) / 100,
    approved,
    discrepancies: params.discrepancies || [],
  });
}

export async function fileClaim(
  db: Database,
  orgId: string,
  params: {
    claimId: string;
    shipmentId: string;
    carrierId: string;
    claimType: 'damage' | 'loss' | 'shortage' | 'delay';
    claimAmount: number;
    description: string;
  },
): Promise<Result<FreightClaim>> {
  const validation = z.object({
    claimId: z.string().min(1),
    shipmentId: z.string().min(1),
    carrierId: z.string().min(1),
    claimType: z.enum(['damage', 'loss', 'shortage', 'delay']),
    claimAmount: z.number().positive(),
    description: z.string().min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({
    ...params,
    filedAt: new Date().toISOString(),
    status: 'open',
  });
}
