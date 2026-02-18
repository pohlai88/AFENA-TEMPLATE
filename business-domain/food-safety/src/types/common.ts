import { z } from 'zod';

export enum HazardType { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE' }
export enum ControlPoint { PENDING = 'PENDING', APPROVED = 'APPROVED' }

export const primarySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  status: z.string(),
  createdAt: z.coerce.date(),
});

export type HACCPPlan = z.infer<typeof primarySchema>;
export type Monitoring = { summary: string };
