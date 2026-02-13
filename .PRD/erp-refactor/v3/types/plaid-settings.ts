import { z } from 'zod';

export const PlaidSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(false),
  automatic_sync: z.boolean().optional().default(false),
  plaid_client_id: z.string().optional(),
  plaid_secret: z.string().optional(),
  plaid_env: z.enum(['sandbox', 'development', 'production']).optional(),
  enable_european_access: z.boolean().optional().default(false),
});

export type PlaidSettings = z.infer<typeof PlaidSettingsSchema>;

export const PlaidSettingsInsertSchema = PlaidSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PlaidSettingsInsert = z.infer<typeof PlaidSettingsInsertSchema>;
