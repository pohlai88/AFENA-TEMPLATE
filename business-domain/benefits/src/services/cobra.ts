import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const InitiateCOBRAParams = z.object({
  employeeId: z.string(),
  qualifyingEvent: z.enum(['termination', 'reduction_hours', 'divorce', 'death']),
  eventDate: z.date(),
  electedPlans: z.array(z.string()),
});

export interface COBRAEnrollment {
  cobraId: string;
  employeeId: string;
  qualifyingEvent: string;
  effectiveDate: Date;
  expirationDate: Date;
  status: 'active' | 'expired';
}

export async function initiateCOBRA(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof InitiateCOBRAParams>,
): Promise<Result<COBRAEnrollment>> {
  const validated = InitiateCOBRAParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const effectiveDate = validated.data.eventDate;
  const expirationDate = new Date(effectiveDate);
  expirationDate.setMonth(expirationDate.getMonth() + 18);
  
  return ok({ cobraId: 'cobra-1', employeeId: validated.data.employeeId, qualifyingEvent: validated.data.qualifyingEvent, effectiveDate, expirationDate, status: 'active' });
}

export const CalculateCOBRAPremiumParams = z.object({
  cobraId: z.string(),
  billingPeriod: z.string(),
});

export interface COBRAPremium {
  cobraId: string;
  premiumMinor: number;
  adminFeeMinor: number;
  totalMinor: number;
}

export async function calculateCOBRAPremium(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateCOBRAPremiumParams>,
): Promise<Result<COBRAPremium>> {
  const validated = CalculateCOBRAPremiumParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const premiumMinor = 45000;
  const adminFeeMinor = 900;
  
  return ok({ cobraId: validated.data.cobraId, premiumMinor, adminFeeMinor, totalMinor: premiumMinor + adminFeeMinor });
}
