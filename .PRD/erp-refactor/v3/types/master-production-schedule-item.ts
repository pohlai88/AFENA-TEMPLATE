import { z } from 'zod';

export const MasterProductionScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  delivery_date: z.string().optional(),
  cumulative_lead_time: z.number().int().optional(),
  order_release_date: z.string().optional(),
  planned_qty: z.number().optional(),
  warehouse: z.string().optional(),
  item_name: z.string().optional(),
  bom_no: z.string().optional(),
  uom: z.string().optional(),
});

export type MasterProductionScheduleItem = z.infer<typeof MasterProductionScheduleItemSchema>;

export const MasterProductionScheduleItemInsertSchema = MasterProductionScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MasterProductionScheduleItemInsert = z.infer<typeof MasterProductionScheduleItemInsertSchema>;
