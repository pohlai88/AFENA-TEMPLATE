import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const RecordWasteParams = z.object({
  wasteType: z.enum(['solid', 'liquid', 'hazardous', 'electronic']),
  weightKg: z.number(),
  disposal: z.enum(['landfill', 'recycle', 'compost', 'incinerate', 'reuse']),
  facilityId: z.string(),
  recordDate: z.date(),
});

export interface WasteRecord {
  wasteId: string;
  wasteType: string;
  weightKg: number;
  disposal: string;
  divertedFromLandfill: boolean;
  recordedAt: Date;
}

export async function recordWaste(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RecordWasteParams>,
): Promise<Result<WasteRecord>> {
  const validated = RecordWasteParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const divertedFromLandfill = validated.data.disposal !== 'landfill';
  return ok({ wasteId: 'waste-1', wasteType: validated.data.wasteType, weightKg: validated.data.weightKg, disposal: validated.data.disposal, divertedFromLandfill, recordedAt: validated.data.recordDate });
}

export const TrackRecyclingRateParams = z.object({
  periodStart: z.date(),
  periodEnd: z.date(),
  facilityId: z.string().optional(),
});

export interface RecyclingMetrics {
  totalWasteKg: number;
  recycledKg: number;
  compostedKg: number;
  landfillKg: number;
  recyclingRate: number;
  diversionRate: number;
}

export async function trackRecyclingRate(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackRecyclingRateParams>,
): Promise<Result<RecyclingMetrics>> {
  const validated = TrackRecyclingRateParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const recycledKg = 5000;
  const compostedKg = 1200;
  const landfillKg = 2800;
  const totalWasteKg = recycledKg + compostedKg + landfillKg;
  
  return ok({ totalWasteKg, recycledKg, compostedKg, landfillKg, recyclingRate: recycledKg / totalWasteKg, diversionRate: (recycledKg + compostedKg) / totalWasteKg });
}
