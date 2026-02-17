/**
 * TMS Analytics
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const TransportCostAnalysisSchema = z.object({
  period: z.string(),
  totalCost: z.number(),
  costPerMile: z.number(),
  costPerShipment: z.number(),
  costByMode: z.array(z.object({
    mode: z.string(),
    cost: z.number(),
    percentage: z.number(),
  })),
  costByCarrier: z.array(z.object({
    carrierId: z.string(),
    cost: z.number(),
    shipments: z.number(),
  })),
});

export type TransportCostAnalysis = z.infer<typeof TransportCostAnalysisSchema>;

export const CarrierPerformanceSchema = z.object({
  carrierId: z.string(),
  period: z.string(),
  totalShipments: z.number(),
  onTimeDeliveries: z.number(),
  onTimePercent: z.number(),
  avgTransitDays: z.number(),
  damageIncidents: z.number(),
  claimCount: z.number(),
  rating: z.string(),
});

export type CarrierPerformance = z.infer<typeof CarrierPerformanceSchema>;

export async function analyzeCosts(
  db: Database,
  orgId: string,
  params: {
    period: string;
    shipments: Array<{
      shipmentId: string;
      mode: string;
      carrierId: string;
      cost: number;
      miles: number;
    }>;
  },
): Promise<Result<TransportCostAnalysis>> {
  const validation = z.object({
    period: z.string(),
    shipments: z.array(z.object({
      shipmentId: z.string(),
      mode: z.string(),
      carrierId: z.string(),
      cost: z.number().nonnegative(),
      miles: z.number().positive(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const totalCost = params.shipments.reduce((sum, s) => sum + s.cost, 0);
  const totalMiles = params.shipments.reduce((sum, s) => sum + s.miles, 0);
  const costPerMile = totalMiles > 0 ? totalCost / totalMiles : 0;
  const costPerShipment = totalCost / params.shipments.length;

  // By mode
  const byMode = new Map<string, number>();
  for (const s of params.shipments) {
    byMode.set(s.mode, (byMode.get(s.mode) || 0) + s.cost);
  }

  const costByMode = Array.from(byMode.entries()).map(([mode, cost]) => ({
    mode,
    cost,
    percentage: Math.round((cost / totalCost) * 10000) / 100,
  }));

  // By carrier
  const byCarrier = new Map<string, { cost: number; shipments: number }>();
  for (const s of params.shipments) {
    const current = byCarrier.get(s.carrierId) || { cost: 0, shipments: 0 };
    current.cost += s.cost;
    current.shipments += 1;
    byCarrier.set(s.carrierId, current);
  }

  const costByCarrier = Array.from(byCarrier.entries()).map(([carrierId, data]) => ({
    carrierId,
    cost: data.cost,
    shipments: data.shipments,
  }));

  return ok({
    period: params.period,
    totalCost,
    costPerMile: Math.round(costPerMile * 100) / 100,
    costPerShipment: Math.round(costPerShipment * 100) / 100,
    costByMode,
    costByCarrier,
  });
}

export async function measurePerformance(
  db: Database,
  orgId: string,
  params: {
    carrierId: string;
    period: string;
    shipments: Array<{
      shipmentId: string;
      onTime: boolean;
      transitDays: number;
      damaged: boolean;
      claimed: boolean;
    }>;
  },
): Promise<Result<CarrierPerformance>> {
  const validation = z.object({
    carrierId: z.string().min(1),
    period: z.string(),
    shipments: z.array(z.object({
      shipmentId: z.string(),
      onTime: z.boolean(),
      transitDays: z.number().positive(),
      damaged: z.boolean(),
      claimed: z.boolean(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const totalShipments = params.shipments.length;
  const onTimeDeliveries = params.shipments.filter((s) => s.onTime).length;
  const onTimePercent = (onTimeDeliveries / totalShipments) * 100;
  const avgTransitDays = params.shipments.reduce((sum, s) => sum + s.transitDays, 0) / totalShipments;
  const damageIncidents = params.shipments.filter((s) => s.damaged).length;
  const claimCount = params.shipments.filter((s) => s.claimed).length;

  const rating = onTimePercent >= 95 ? 'A' : onTimePercent >= 90 ? 'B' : onTimePercent >= 85 ? 'C' : 'D';

  return ok({
    carrierId: params.carrierId,
    period: params.period,
    totalShipments,
    onTimeDeliveries,
    onTimePercent: Math.round(onTimePercent * 100) / 100,
    avgTransitDays: Math.round(avgTransitDays * 100) / 100,
    damageIncidents,
    claimCount,
    rating,
  });
}
