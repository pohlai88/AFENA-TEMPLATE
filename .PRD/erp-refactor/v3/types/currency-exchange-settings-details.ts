import { z } from 'zod';

export const CurrencyExchangeSettingsDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  key: z.string(),
  value: z.string(),
});

export type CurrencyExchangeSettingsDetails = z.infer<typeof CurrencyExchangeSettingsDetailsSchema>;

export const CurrencyExchangeSettingsDetailsInsertSchema = CurrencyExchangeSettingsDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsDetailsInsert = z.infer<typeof CurrencyExchangeSettingsDetailsInsertSchema>;
