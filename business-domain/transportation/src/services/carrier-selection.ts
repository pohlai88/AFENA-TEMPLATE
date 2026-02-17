/**
 * Carrier Selection
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const RateComparisonSchema = z.object({
  shipmentId: z.string(),
  carriers: z.array(z.object({
    carrierId: z.string(),
    name: z.string(),
    rate: z.number(),
    transitDays: z.number(),
    serviceLevel: z.string(),
    fuelSurcharge: z.number(),
    totalCost: z.number(),
  })),
  recommended: z.string(),
});

export type RateComparison = z.infer<typeof RateComparisonSchema>;

export const CarrierTenderSchema = z.object({
  tenderId: z.string(),
  shipmentId: z.string(),
  carrierId: z.string(),
  rate: z.number(),
  pickupDate: z.string(),
  deliveryDate: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected', 'expired']),
  tenderedAt: z.string(),
});

export type CarrierTender = z.infer<typeof CarrierTenderSchema>;

export async function rateShop(
  db: Database,
  orgId: string,
  params: {
    shipmentId: string;
    origin: string;
    destination: string;
    weight: number;
    carrierIds: string[];
  },
): Promise<Result<RateComparison>> {
  const validation = z.object({
    shipmentId: z.string().min(1),
    origin: z.string().min(1),
    destination: z.string().min(1),
    weight: z.number().positive(),
    carrierIds: z.array(z.string()).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  // Simulate rate shopping with carriers
  const carriers = params.carrierIds.map((carrierId, i) => {
    const baseRate = 150 + i * 25;
    const transitDays = 2 + i;
    const fuelSurcharge = baseRate * 0.15;
    const totalCost = baseRate + fuelSurcharge;

    return {
      carrierId,
      name: `Carrier ${i + 1}`,
      rate: baseRate,
      transitDays,
      serviceLevel: i === 0 ? 'express' : i === 1 ? 'standard' : 'economy',
      fuelSurcharge,
      totalCost,
    };
  });

  // Recommend lowest cost
  const sorted = [...carriers].sort((a, b) => a.totalCost - b.totalCost);
  const recommended = sorted[0]!.carrierId;

  return ok({
    shipmentId: params.shipmentId,
    carriers,
    recommended,
  });
}

export async function tenderToCarrier(
  db: Database,
  orgId: string,
  params: {
    tenderId: string;
    shipmentId: string;
    carrierId: string;
    rate: number;
    pickupDate: string;
    deliveryDate: string;
  },
): Promise<Result<CarrierTender>> {
  const validation = z.object({
    tenderId: z.string().min(1),
    shipmentId: z.string().min(1),
    carrierId: z.string().min(1),
    rate: z.number().positive(),
    pickupDate: z.string().datetime(),
    deliveryDate: z.string().datetime(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({
    ...params,
    status: 'pending',
    tenderedAt: new Date().toISOString(),
  });
}
