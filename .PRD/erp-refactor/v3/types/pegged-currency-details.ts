import { z } from 'zod';

export const PeggedCurrencyDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  source_currency: z.string().optional(),
  pegged_against: z.string().optional(),
  pegged_exchange_rate: z.string().optional(),
});

export type PeggedCurrencyDetails = z.infer<typeof PeggedCurrencyDetailsSchema>;

export const PeggedCurrencyDetailsInsertSchema = PeggedCurrencyDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeggedCurrencyDetailsInsert = z.infer<typeof PeggedCurrencyDetailsInsertSchema>;
