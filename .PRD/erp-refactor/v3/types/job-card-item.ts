import { z } from 'zod';

export const JobCardItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  source_warehouse: z.string().optional(),
  uom: z.string().optional(),
  item_group: z.string().optional(),
  stock_uom: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  required_qty: z.number().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
});

export type JobCardItem = z.infer<typeof JobCardItemSchema>;

export const JobCardItemInsertSchema = JobCardItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardItemInsert = z.infer<typeof JobCardItemInsertSchema>;
