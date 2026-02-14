import { z } from 'zod';

export const MaintenanceScheduleDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  scheduled_date: z.string(),
  actual_date: z.string().optional(),
  sales_person: z.string().optional(),
  completion_status: z.enum(['Pending', 'Partially Completed', 'Fully Completed']).optional().default('Pending'),
  serial_no: z.string().optional(),
  item_reference: z.string().optional(),
});

export type MaintenanceScheduleDetail = z.infer<typeof MaintenanceScheduleDetailSchema>;

export const MaintenanceScheduleDetailInsertSchema = MaintenanceScheduleDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleDetailInsert = z.infer<typeof MaintenanceScheduleDetailInsertSchema>;
