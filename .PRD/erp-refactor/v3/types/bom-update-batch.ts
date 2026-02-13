import { z } from 'zod';

export const BomUpdateBatchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  level: z.number().int().optional(),
  batch_no: z.number().int().optional(),
  boms_updated: z.string().optional(),
  status: z.enum(['Pending', 'Completed']).optional(),
});

export type BomUpdateBatch = z.infer<typeof BomUpdateBatchSchema>;

export const BomUpdateBatchInsertSchema = BomUpdateBatchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomUpdateBatchInsert = z.infer<typeof BomUpdateBatchInsertSchema>;
