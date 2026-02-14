import { z } from 'zod';

export const PutawayRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disable: z.boolean().optional().default(false),
  item_code: z.string(),
  item_name: z.string().optional(),
  warehouse: z.string(),
  priority: z.number().int().optional().default(1),
  company: z.string(),
  capacity: z.number().default(0),
  uom: z.string().optional(),
  conversion_factor: z.number().optional().default(1),
  stock_uom: z.string().optional(),
  stock_capacity: z.number().optional(),
});

export type PutawayRule = z.infer<typeof PutawayRuleSchema>;

export const PutawayRuleInsertSchema = PutawayRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PutawayRuleInsert = z.infer<typeof PutawayRuleInsertSchema>;
