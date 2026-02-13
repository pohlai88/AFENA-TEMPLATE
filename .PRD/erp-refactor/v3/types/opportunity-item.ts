import { z } from 'zod';

export const OpportunityItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  qty: z.number().optional().default(1),
  brand: z.string().optional(),
  item_group: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  rate: z.number(),
  amount: z.number(),
});

export type OpportunityItem = z.infer<typeof OpportunityItemSchema>;

export const OpportunityItemInsertSchema = OpportunityItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityItemInsert = z.infer<typeof OpportunityItemInsertSchema>;
