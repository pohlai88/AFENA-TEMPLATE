import { z } from 'zod';

export const WorkstationTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation_type: z.string(),
  workstation_costs: z.array(z.unknown()).optional(),
  hour_rate: z.number().optional(),
  description: z.string().optional(),
});

export type WorkstationType = z.infer<typeof WorkstationTypeSchema>;

export const WorkstationTypeInsertSchema = WorkstationTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationTypeInsert = z.infer<typeof WorkstationTypeInsertSchema>;
