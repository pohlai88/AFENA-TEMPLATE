import { z } from 'zod';

export const MaintenanceVisitSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MVS-.YYYY.-']),
  customer: z.string(),
  customer_name: z.string().optional(),
  address_display: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  maintenance_schedule: z.string().optional(),
  maintenance_schedule_detail: z.string().optional(),
  mntc_date: z.string().default('Today'),
  mntc_time: z.string().optional(),
  completion_status: z.enum(['Partially Completed', 'Fully Completed']),
  maintenance_type: z.enum(['Scheduled', 'Unscheduled', 'Breakdown']).default('Unscheduled'),
  purposes: z.array(z.unknown()).optional(),
  customer_feedback: z.string().optional(),
  status: z.enum(['Draft', 'Cancelled', 'Submitted']).default('Draft'),
  amended_from: z.string().optional(),
  company: z.string(),
  customer_address: z.string().optional(),
  contact_person: z.string().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
});

export type MaintenanceVisit = z.infer<typeof MaintenanceVisitSchema>;

export const MaintenanceVisitInsertSchema = MaintenanceVisitSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceVisitInsert = z.infer<typeof MaintenanceVisitInsertSchema>;
