/**
 * Self-Service
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const POAcknowledgmentSchema = z.object({
  ackId: z.string(),
  poId: z.string(),
  supplierId: z.string(),
  acknowledgedAt: z.string(),
  status: z.enum(['accepted', 'rejected', 'accepted_with_changes']),
  promisedDeliveryDate: z.string().optional(),
  comments: z.string().optional(),
});

export type POAcknowledgment = z.infer<typeof POAcknowledgmentSchema>;

export const AdvanceShipNoticeSchema = z.object({
  asnId: z.string(),
  poId: z.string(),
  supplierId: z.string(),
  shipDate: z.string(),
  estimatedArrival: z.string(),
  carrier: z.string(),
  trackingNumber: z.string(),
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number(),
    lotNumber: z.string().optional(),
  })),
});

export type AdvanceShipNotice = z.infer<typeof AdvanceShipNoticeSchema>;

export async function acknowledgePO(
  db: Database,
  orgId: string,
  params: {
    ackId: string;
    poId: string;
    supplierId: string;
    status: 'accepted' | 'rejected' | 'accepted_with_changes';
    promisedDeliveryDate?: string;
    comments?: string;
  },
): Promise<Result<POAcknowledgment>> {
  const validation = z.object({
    ackId: z.string().min(1),
    poId: z.string().min(1),
    supplierId: z.string().min(1),
    status: z.enum(['accepted', 'rejected', 'accepted_with_changes']),
    promisedDeliveryDate: z.string().datetime().optional(),
    comments: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({
    ackId: params.ackId,
    poId: params.poId,
    supplierId: params.supplierId,
    acknowledgedAt: new Date().toISOString(),
    status: params.status,
    promisedDeliveryDate: params.promisedDeliveryDate,
    comments: params.comments,
  });
}

export async function submitASN(
  db: Database,
  orgId: string,
  params: {
    asnId: string;
    poId: string;
    supplierId: string;
    shipDate: string;
    estimatedArrival: string;
    carrier: string;
    trackingNumber: string;
    items: Array<{ itemId: string; quantity: number; lotNumber?: string }>;
  },
): Promise<Result<AdvanceShipNotice>> {
  const validation = z.object({
    asnId: z.string().min(1),
    poId: z.string().min(1),
    supplierId: z.string().min(1),
    shipDate: z.string().datetime(),
    estimatedArrival: z.string().datetime(),
    carrier: z.string().min(1),
    trackingNumber: z.string().min(1),
    items: z.array(z.object({
      itemId: z.string(),
      quantity: z.number().positive(),
      lotNumber: z.string().optional(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok(params);
}
