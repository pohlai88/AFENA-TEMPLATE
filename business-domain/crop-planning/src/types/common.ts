import { z } from 'zod';

export enum Status { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
export enum Priority { HIGH = 'HIGH', MEDIUM = 'MEDIUM', LOW = 'LOW' }

export const recordSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  status: z.nativeEnum(Status),
  createdAt: z.coerce.date(),
});

export type Record = z.infer<typeof recordSchema>;
export interface Summary { total: number; active: number; }
