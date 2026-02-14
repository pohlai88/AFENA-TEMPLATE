import { z } from 'zod';

export const MaintenanceScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MSH-.YYYY.-']),
  customer: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']).default('Draft'),
  transaction_date: z.string(),
  items: z.array(z.unknown()),
  schedules: z.array(z.unknown()).optional(),
  customer_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_display: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
  company: z.string(),
  amended_from: z.string().optional(),
});

export type MaintenanceSchedule = z.infer<typeof MaintenanceScheduleSchema>;

export const MaintenanceScheduleInsertSchema = MaintenanceScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleInsert = z.infer<typeof MaintenanceScheduleInsertSchema>;
