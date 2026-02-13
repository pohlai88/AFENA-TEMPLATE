import { z } from 'zod';

export const HolidaySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  holiday_date: z.string(),
  weekly_off: z.boolean().optional().default(false),
  description: z.string(),
  is_half_day: z.boolean().optional().default(false),
});

export type Holiday = z.infer<typeof HolidaySchema>;

export const HolidayInsertSchema = HolidaySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type HolidayInsert = z.infer<typeof HolidayInsertSchema>;
