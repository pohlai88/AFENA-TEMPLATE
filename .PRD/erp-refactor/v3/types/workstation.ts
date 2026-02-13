import { z } from 'zod';

export const WorkstationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation_dashboard: z.string().optional(),
  workstation_name: z.string(),
  workstation_type: z.string().optional(),
  plant_floor: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  production_capacity: z.number().int().default(1),
  warehouse: z.string().optional(),
  status: z.enum(['Production', 'Off', 'Idle', 'Problem', 'Maintenance', 'Setup']).optional(),
  on_status_image: z.string().optional(),
  off_status_image: z.string().optional(),
  workstation_costs: z.array(z.unknown()).optional(),
  hour_rate: z.number().optional(),
  description: z.string().optional(),
  holiday_list: z.string().optional(),
  working_hours: z.array(z.unknown()).optional(),
  total_working_hours: z.number().optional(),
});

export type Workstation = z.infer<typeof WorkstationSchema>;

export const WorkstationInsertSchema = WorkstationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationInsert = z.infer<typeof WorkstationInsertSchema>;
