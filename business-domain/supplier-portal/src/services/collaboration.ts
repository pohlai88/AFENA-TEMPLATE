/**
 * Collaboration
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const RFQResponseSchema = z.object({
  responseId: z.string(),
  rfqId: z.string(),
  supplierId: z.string(),
  items: z.array(z.object({
    itemId: z.string(),
    unitPrice: z.number(),
    leadTimeDays: z.number(),
    moq: z.number(),
  })),
  validUntil: z.string(),
  submittedAt: z.string(),
});

export type RFQResponse = z.infer<typeof RFQResponseSchema>;

export const EngineeringChangeRequestSchema = z.object({
  ecrId: z.string(),
  supplierId: z.string(),
  itemId: z.string(),
  changeType: z.enum(['design', 'material', 'process', 'documentation']),
  description: z.string(),
  justification: z.string(),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected']),
  submittedAt: z.string(),
});

export type EngineeringChangeRequest = z.infer<typeof EngineeringChangeRequestSchema>;

export async function respondToRFQ(
  db: Database,
  orgId: string,
  params: {
    responseId: string;
    rfqId: string;
    supplierId: string;
    items: Array<{ itemId: string; unitPrice: number; leadTimeDays: number; moq: number }>;
    validUntil: string;
  },
): Promise<Result<RFQResponse>> {
  const validation = z.object({
    responseId: z.string().min(1),
    rfqId: z.string().min(1),
    supplierId: z.string().min(1),
    items: z.array(z.object({
      itemId: z.string(),
      unitPrice: z.number().positive(),
      leadTimeDays: z.number().int().positive(),
      moq: z.number().positive(),
    })).min(1),
    validUntil: z.string().datetime(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({ ...params, submittedAt: new Date().toISOString() });
}

export async function submitECR(
  db: Database,
  orgId: string,
  params: {
    ecrId: string;
    supplierId: string;
    itemId: string;
    changeType: 'design' | 'material' | 'process' | 'documentation';
    description: string;
    justification: string;
  },
): Promise<Result<EngineeringChangeRequest>> {
  const validation = z.object({
    ecrId: z.string().min(1),
    supplierId: z.string().min(1),
    itemId: z.string().min(1),
    changeType: z.enum(['design', 'material', 'process', 'documentation']),
    description: z.string().min(1),
    justification: z.string().min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({ ...params, status: 'submitted', submittedAt: new Date().toISOString() });
}
