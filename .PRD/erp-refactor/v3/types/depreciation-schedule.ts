import { z } from 'zod';

export const DepreciationScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  schedule_date: z.string(),
  depreciation_amount: z.number(),
  accumulated_depreciation_amount: z.number().optional(),
  journal_entry: z.string().optional(),
  shift: z.string().optional(),
});

export type DepreciationSchedule = z.infer<typeof DepreciationScheduleSchema>;

export const DepreciationScheduleInsertSchema = DepreciationScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DepreciationScheduleInsert = z.infer<typeof DepreciationScheduleInsertSchema>;
