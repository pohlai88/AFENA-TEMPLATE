import { z } from 'zod';

export const CurrencyExchangeSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  service_provider: z.enum(['frankfurter.dev', 'exchangerate.host', 'Custom']),
  api_endpoint: z.string(),
  use_http: z.boolean().optional().default(false),
  access_key: z.string().optional(),
  url: z.string().optional(),
  help: z.string().optional(),
  req_params: z.array(z.unknown()),
  result_key: z.array(z.unknown()),
});

export type CurrencyExchangeSettings = z.infer<typeof CurrencyExchangeSettingsSchema>;

export const CurrencyExchangeSettingsInsertSchema = CurrencyExchangeSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsInsert = z.infer<typeof CurrencyExchangeSettingsInsertSchema>;
