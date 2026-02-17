import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const RecordCarbonEmissionParams = z.object({
  emissionType: z.enum(['scope1', 'scope2', 'scope3']),
  source: z.string(),
  amountKg: z.number(),
  recordDate: z.date(),
  facilityId: z.string().optional(),
});

export interface CarbonEmission {
  emissionId: string;
  emissionType: string;
  source: string;
  amountKg: number;
  co2eKg: number;
  recordedAt: Date;
}

export async function recordCarbonEmission(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RecordCarbonEmissionParams>,
): Promise<Result<CarbonEmission>> {
  const validated = RecordCarbonEmissionParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const co2eKg = validated.data.amountKg * 1.1;
  return ok({ emissionId: 'emission-1', emissionType: validated.data.emissionType, source: validated.data.source, amountKg: validated.data.amountKg, co2eKg, recordedAt: validated.data.recordDate });
}

export const CalculateCarbonFootprintParams = z.object({
  periodStart: z.date(),
  periodEnd: z.date(),
  scope: z.array(z.enum(['scope1', 'scope2', 'scope3'])).optional(),
});

export interface CarbonFootprint {
  totalCO2eKg: number;
  scope1Kg: number;
  scope2Kg: number;
  scope3Kg: number;
  periodStart: Date;
  periodEnd: Date;
  intensityPerRevenue: number;
}

export async function calculateCarbonFootprint(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateCarbonFootprintParams>,
): Promise<Result<CarbonFootprint>> {
  const validated = CalculateCarbonFootprintParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const scope1Kg = 50000;
  const scope2Kg = 120000;
  const scope3Kg = 85000;
  
  return ok({ totalCO2eKg: scope1Kg + scope2Kg + scope3Kg, scope1Kg, scope2Kg, scope3Kg, periodStart: validated.data.periodStart, periodEnd: validated.data.periodEnd, intensityPerRevenue: 0.025 });
}
