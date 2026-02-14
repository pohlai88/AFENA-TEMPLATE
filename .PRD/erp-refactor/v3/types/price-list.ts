import { z } from 'zod';

export const PriceListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  price_list_name: z.string(),
  currency: z.string(),
  buying: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(false),
  price_not_uom_dependent: z.boolean().optional().default(false),
  countries: z.array(z.unknown()).optional(),
});

export type PriceList = z.infer<typeof PriceListSchema>;

export const PriceListInsertSchema = PriceListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PriceListInsert = z.infer<typeof PriceListInsertSchema>;
