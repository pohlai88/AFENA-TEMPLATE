import { z } from 'zod';

export const BomUpdateLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  update_type: z.enum(['Replace BOM', 'Update Cost']).optional(),
  status: z.enum(['Queued', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional(),
  current_bom: z.string().optional(),
  new_bom: z.string().optional(),
  error_log: z.string().optional(),
  current_level: z.number().int().optional(),
  processed_boms: z.string().optional(),
  bom_batches: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type BomUpdateLog = z.infer<typeof BomUpdateLogSchema>;

export const BomUpdateLogInsertSchema = BomUpdateLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomUpdateLogInsert = z.infer<typeof BomUpdateLogInsertSchema>;
