import { z } from 'zod';

export enum CampaignType { NATIONAL = 'NATIONAL', REGIONAL = 'REGIONAL', LOCAL = 'LOCAL' }
export enum FundStatus { ACTIVE = 'ACTIVE', DEPLETED = 'DEPLETED' }

export const fundCollectionSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  amount: z.number(),
  periodDate: z.coerce.date(),
});

export type FundCollection = z.infer<typeof fundCollectionSchema>;
export interface MarketingMetrics {
  totalCollections: number;
  totalSpend: number;
  balance: number;
  roi: number;
}
