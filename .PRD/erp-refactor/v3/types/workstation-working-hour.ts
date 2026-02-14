import { z } from 'zod';

export const WorkstationWorkingHourSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  start_time: z.string(),
  hours: z.number().optional(),
  end_time: z.string(),
  enabled: z.boolean().optional().default(true),
});

export type WorkstationWorkingHour = z.infer<typeof WorkstationWorkingHourSchema>;

export const WorkstationWorkingHourInsertSchema = WorkstationWorkingHourSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationWorkingHourInsert = z.infer<typeof WorkstationWorkingHourInsertSchema>;
