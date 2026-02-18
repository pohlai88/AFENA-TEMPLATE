import { z } from 'zod';

export enum RoyaltyStatus { PENDING = 'PENDING', PAID = 'PAID', DELINQUENT = 'DELINQUENT' }
export enum SalesReportStatus { SUBMITTED = 'SUBMITTED', VERIFIED = 'VERIFIED', DISPUTED = 'DISPUTED' }

export const royaltyCalculationSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  periodDate: z.coerce.date(),
  grossSales: z.number(),
  royaltyRate: z.number(),
  royaltyAmount: z.number(),
  status: z.nativeEnum(RoyaltyStatus),
});

export type RoyaltyCalculation = z.infer<typeof royaltyCalculationSchema>;
export interface RoyaltyMetrics {
  totalRoyalties: number;
  delinquencyRate: number;
  averageYield: number;
}
