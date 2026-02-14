import { z } from 'zod';

export const MaintenanceScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  periodicity: z.enum(['Weekly', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Random']).optional(),
  no_of_visits: z.number().int(),
  sales_person: z.string().optional(),
  serial_no: z.string().optional(),
  sales_order: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
});

export type MaintenanceScheduleItem = z.infer<typeof MaintenanceScheduleItemSchema>;

export const MaintenanceScheduleItemInsertSchema = MaintenanceScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleItemInsert = z.infer<typeof MaintenanceScheduleItemInsertSchema>;
