import { z } from 'zod';

export const OperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation: z.string().optional(),
  is_corrective_operation: z.boolean().optional().default(false),
  create_job_card_based_on_batch_size: z.boolean().optional().default(false),
  quality_inspection_template: z.string().optional(),
  batch_size: z.number().int().optional().default(1),
  sub_operations: z.array(z.unknown()).optional(),
  total_operation_time: z.number().optional(),
  description: z.string().optional(),
});

export type Operation = z.infer<typeof OperationSchema>;

export const OperationInsertSchema = OperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OperationInsert = z.infer<typeof OperationInsertSchema>;
