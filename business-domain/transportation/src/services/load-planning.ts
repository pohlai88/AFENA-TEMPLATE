/**
 * Load Planning
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const LoadPlanSchema = z.object({
  loadId: z.string(),
  mode: z.enum(['ltl', 'ftl', 'parcel', 'intermodal']),
  shipments: z.array(z.string()),
  totalWeight: z.number(),
  totalVolume: z.number(),
  utilizationPercent: z.number(),
  estimatedCost: z.number(),
});

export type LoadPlan = z.infer<typeof LoadPlanSchema>;

export const ShipmentConsolidationSchema = z.object({
  consolidationId: z.string(),
  shipments: z.array(z.object({
    shipmentId: z.string(),
    weight: z.number(),
    volume: z.number(),
    destination: z.string(),
  })),
  consolidatedLoads: z.array(z.object({
    loadId: z.string(),
    shipmentIds: z.array(z.string()),
    savings: z.number(),
  })),
  totalSavings: z.number(),
});

export type ShipmentConsolidation = z.infer<typeof ShipmentConsolidationSchema>;

export async function planLoad(
  db: Database,
  orgId: string,
  params: {
    loadId: string;
    shipmentIds: string[];
    mode: 'ltl' | 'ftl' | 'parcel' | 'intermodal';
    maxWeight: number;
    maxVolume: number;
  },
): Promise<Result<LoadPlan>> {
  const validation = z.object({
    loadId: z.string().min(1),
    shipmentIds: z.array(z.string()).min(1),
    mode: z.enum(['ltl', 'ftl', 'parcel', 'intermodal']),
    maxWeight: z.number().positive(),
    maxVolume: z.number().positive(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  // Placeholder calculation
  const totalWeight = params.shipmentIds.length * 500;
  const totalVolume = params.shipmentIds.length * 10;
  const utilizationPercent = (totalWeight / params.maxWeight) * 100;
  const estimatedCost = totalWeight * 0.5;

  return ok({
    loadId: params.loadId,
    mode: params.mode,
    shipments: params.shipmentIds,
    totalWeight,
    totalVolume,
    utilizationPercent: Math.round(utilizationPercent * 100) / 100,
    estimatedCost,
  });
}

export async function consolidateShipments(
  db: Database,
  orgId: string,
  params: {
    consolidationId: string;
    shipments: Array<{ shipmentId: string; weight: number; volume: number; destination: string }>;
    consolidationRule: 'by_destination' | 'by_route' | 'by_carrier';
  },
): Promise<Result<ShipmentConsolidation>> {
  const validation = z.object({
    consolidationId: z.string().min(1),
    shipments: z.array(z.object({
      shipmentId: z.string(),
      weight: z.number().positive(),
      volume: z.number().positive(),
      destination: z.string(),
    })).min(2),
    consolidationRule: z.enum(['by_destination', 'by_route', 'by_carrier']),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  // Simple consolidation by destination
  const byDestination = new Map<string, string[]>();
  for (const shipment of params.shipments) {
    const dest = shipment.destination;
    if (!byDestination.has(dest)) {
      byDestination.set(dest, []);
    }
    byDestination.get(dest)!.push(shipment.shipmentId);
  }

  const consolidatedLoads = Array.from(byDestination.entries()).map(([dest, shipmentIds], i) => ({
    loadId: `LOAD-${params.consolidationId}-${i + 1}`,
    shipmentIds,
    savings: shipmentIds.length * 50, // $50 savings per shipment consolidated
  }));

  const totalSavings = consolidatedLoads.reduce((sum, load) => sum + load.savings, 0);

  return ok({
    consolidationId: params.consolidationId,
    shipments: params.shipments,
    consolidatedLoads,
    totalSavings,
  });
}
