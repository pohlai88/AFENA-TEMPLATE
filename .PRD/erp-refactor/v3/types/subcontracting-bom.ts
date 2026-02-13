import { z } from 'zod';

export const SubcontractingBomSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  finished_good: z.string(),
  finished_good_qty: z.number().default(1),
  finished_good_uom: z.string().optional(),
  finished_good_bom: z.string(),
  service_item: z.string(),
  service_item_qty: z.number().default(1),
  service_item_uom: z.string(),
  conversion_factor: z.number().optional(),
});

export type SubcontractingBom = z.infer<typeof SubcontractingBomSchema>;

export const SubcontractingBomInsertSchema = SubcontractingBomSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingBomInsert = z.infer<typeof SubcontractingBomInsertSchema>;
