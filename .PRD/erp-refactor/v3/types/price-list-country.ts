import { z } from 'zod';

export const PriceListCountrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  country: z.string(),
});

export type PriceListCountry = z.infer<typeof PriceListCountrySchema>;

export const PriceListCountryInsertSchema = PriceListCountrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PriceListCountryInsert = z.infer<typeof PriceListCountryInsertSchema>;
