import { z } from 'zod';

export const PeggedCurrenciesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pegged_currency_item: z.array(z.unknown()).optional(),
});

export type PeggedCurrencies = z.infer<typeof PeggedCurrenciesSchema>;

export const PeggedCurrenciesInsertSchema = PeggedCurrenciesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeggedCurrenciesInsert = z.infer<typeof PeggedCurrenciesInsertSchema>;
