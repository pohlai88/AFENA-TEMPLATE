import { z } from 'zod';

export const AssetMaintenanceLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset_maintenance: z.string().optional(),
  naming_series: z.enum(['ACC-AML-.YYYY.-']),
  asset_name: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  task: z.string().optional(),
  task_name: z.string().optional(),
  maintenance_type: z.string().optional(),
  periodicity: z.string().optional(),
  has_certificate: z.boolean().optional().default(false),
  certificate_attachement: z.string().optional(),
  maintenance_status: z.enum(['Planned', 'Completed', 'Cancelled', 'Overdue']),
  assign_to_name: z.string().optional(),
  task_assignee_email: z.string().optional(),
  due_date: z.string().optional(),
  completion_date: z.string().optional(),
  description: z.string().optional(),
  actions_performed: z.string().optional(),
  amended_from: z.string().optional(),
});

export type AssetMaintenanceLog = z.infer<typeof AssetMaintenanceLogSchema>;

export const AssetMaintenanceLogInsertSchema = AssetMaintenanceLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceLogInsert = z.infer<typeof AssetMaintenanceLogInsertSchema>;
