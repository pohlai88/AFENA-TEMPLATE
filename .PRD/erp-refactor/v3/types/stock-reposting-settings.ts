import { z } from 'zod';

export const StockRepostingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  limit_reposting_timeslot: z.boolean().optional().default(false),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  limits_dont_apply_on: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  item_based_reposting: z.boolean().optional().default(true),
  enable_parallel_reposting: z.boolean().optional().default(false),
  no_of_parallel_reposting: z.number().int().optional().default(4),
  notify_reposting_error_to_role: z.string().optional(),
});

export type StockRepostingSettings = z.infer<typeof StockRepostingSettingsSchema>;

export const StockRepostingSettingsInsertSchema = StockRepostingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockRepostingSettingsInsert = z.infer<typeof StockRepostingSettingsInsertSchema>;
