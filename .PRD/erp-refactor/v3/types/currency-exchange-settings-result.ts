import { z } from 'zod';

export const CurrencyExchangeSettingsResultSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  key: z.string(),
});

export type CurrencyExchangeSettingsResult = z.infer<typeof CurrencyExchangeSettingsResultSchema>;

export const CurrencyExchangeSettingsResultInsertSchema = CurrencyExchangeSettingsResultSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsResultInsert = z.infer<typeof CurrencyExchangeSettingsResultInsertSchema>;
