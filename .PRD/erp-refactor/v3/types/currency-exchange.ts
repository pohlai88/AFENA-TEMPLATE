import { z } from 'zod';

export const CurrencyExchangeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  date: z.string(),
  from_currency: z.string(),
  to_currency: z.string(),
  exchange_rate: z.number(),
  for_buying: z.boolean().optional().default(true),
  for_selling: z.boolean().optional().default(true),
});

export type CurrencyExchange = z.infer<typeof CurrencyExchangeSchema>;

export const CurrencyExchangeInsertSchema = CurrencyExchangeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeInsert = z.infer<typeof CurrencyExchangeInsertSchema>;
