import { z } from 'zod';

export const ItemLeadTimeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  shift_time_in_hours: z.number().int().optional(),
  no_of_workstations: z.number().int().optional(),
  no_of_shift: z.number().int().optional().default(1),
  total_workstation_time: z.number().int().optional(),
  manufacturing_time_in_mins: z.number().int().optional(),
  no_of_units_produced: z.number().int().optional(),
  daily_yield: z.number().optional().default(90),
  capacity_per_day: z.number().int().optional(),
  purchase_time: z.number().int().optional(),
  buffer_time: z.number().int().optional(),
  item_name: z.string().optional(),
  stock_uom: z.string().optional(),
});

export type ItemLeadTime = z.infer<typeof ItemLeadTimeSchema>;

export const ItemLeadTimeInsertSchema = ItemLeadTimeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemLeadTimeInsert = z.infer<typeof ItemLeadTimeInsertSchema>;
