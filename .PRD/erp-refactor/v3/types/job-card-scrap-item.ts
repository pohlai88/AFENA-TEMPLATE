import { z } from 'zod';

export const JobCardScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  stock_qty: z.number(),
  stock_uom: z.string().optional(),
});

export type JobCardScrapItem = z.infer<typeof JobCardScrapItemSchema>;

export const JobCardScrapItemInsertSchema = JobCardScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardScrapItemInsert = z.infer<typeof JobCardScrapItemInsertSchema>;
