import { z } from 'zod';

export const HolidayListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  holiday_list_name: z.string(),
  from_date: z.string(),
  to_date: z.string(),
  total_holidays: z.number().int().optional(),
  weekly_off: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).optional(),
  is_half_day: z.boolean().optional().default(false),
  country: z.string().optional(),
  subdivision: z.string().optional(),
  holidays: z.array(z.unknown()).optional(),
  color: z.string().optional(),
});

export type HolidayList = z.infer<typeof HolidayListSchema>;

export const HolidayListInsertSchema = HolidayListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type HolidayListInsert = z.infer<typeof HolidayListInsertSchema>;
