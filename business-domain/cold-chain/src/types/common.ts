import { z } from 'zod';

export enum TemperatureZone { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE' }
export enum AlertLevel { PENDING = 'PENDING', APPROVED = 'APPROVED' }

export const primarySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  status: z.string(),
  createdAt: z.coerce.date(),
});

export type TemperatureLog = z.infer<typeof primarySchema>;
export type Shipment = { summary: string };
