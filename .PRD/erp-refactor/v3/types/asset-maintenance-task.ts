import { z } from 'zod';

export const AssetMaintenanceTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  maintenance_task: z.string(),
  maintenance_type: z.enum(['Preventive Maintenance', 'Calibration']).optional(),
  maintenance_status: z.enum(['Planned', 'Overdue', 'Cancelled']),
  start_date: z.string().default('Today'),
  periodicity: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-yearly', 'Yearly', '2 Yearly', '3 Yearly']),
  end_date: z.string().optional(),
  certificate_required: z.boolean().optional().default(false),
  assign_to: z.string().optional(),
  assign_to_name: z.string().optional(),
  next_due_date: z.string().optional(),
  last_completion_date: z.string().optional(),
  description: z.string().optional(),
});

export type AssetMaintenanceTask = z.infer<typeof AssetMaintenanceTaskSchema>;

export const AssetMaintenanceTaskInsertSchema = AssetMaintenanceTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceTaskInsert = z.infer<typeof AssetMaintenanceTaskInsertSchema>;
