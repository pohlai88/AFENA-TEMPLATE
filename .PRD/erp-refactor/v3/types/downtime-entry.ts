import { z } from 'zod';

export const DowntimeEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['DT-']),
  workstation: z.string(),
  operator: z.string(),
  from_time: z.string(),
  to_time: z.string(),
  downtime: z.number().optional(),
  stop_reason: z.enum(['Excessive machine set up time', 'Unplanned machine maintenance', 'On-machine press checks', 'Machine operator errors', 'Machine malfunction', 'Electricity down', 'Other']),
  remarks: z.string().optional(),
});

export type DowntimeEntry = z.infer<typeof DowntimeEntrySchema>;

export const DowntimeEntryInsertSchema = DowntimeEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DowntimeEntryInsert = z.infer<typeof DowntimeEntryInsertSchema>;
