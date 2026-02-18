import { z } from 'zod';

export enum ProductionStatus { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE' }
export enum BatchStatus { PENDING = 'PENDING', APPROVED = 'APPROVED' }

export const primarySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  status: z.string(),
  createdAt: z.coerce.date(),
});

export type ProductionRun = z.infer<typeof primarySchema>;
export type QualityCheck = { summary: string };
