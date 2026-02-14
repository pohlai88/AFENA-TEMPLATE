import { z } from 'zod';

export const WorkOrderOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  status: z.enum(['Pending', 'Work in Progress', 'Completed']).optional().default('Pending'),
  completed_qty: z.number().optional(),
  process_loss_qty: z.number().optional(),
  bom: z.string().optional(),
  workstation_type: z.string().optional(),
  workstation: z.string().optional(),
  sequence_id: z.number().int().optional(),
  bom_no: z.string().optional(),
  finished_good: z.string().optional(),
  is_subcontracted: z.boolean().optional().default(false),
  skip_material_transfer: z.boolean().optional().default(false),
  backflush_from_wip_warehouse: z.boolean().optional().default(false),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  fg_warehouse: z.string().optional(),
  description: z.string().optional(),
  planned_start_time: z.string().optional(),
  hour_rate: z.number().optional(),
  time_in_mins: z.number(),
  planned_end_time: z.string().optional(),
  batch_size: z.number().optional(),
  planned_operating_cost: z.number().optional(),
  actual_start_time: z.string().optional(),
  actual_operation_time: z.number().optional(),
  actual_end_time: z.string().optional(),
  actual_operating_cost: z.number().optional(),
});

export type WorkOrderOperation = z.infer<typeof WorkOrderOperationSchema>;

export const WorkOrderOperationInsertSchema = WorkOrderOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkOrderOperationInsert = z.infer<typeof WorkOrderOperationInsertSchema>;
