import { z } from 'zod';

export const UaeVatSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  uae_vat_accounts: z.array(z.unknown()),
});

export type UaeVatSettings = z.infer<typeof UaeVatSettingsSchema>;

export const UaeVatSettingsInsertSchema = UaeVatSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UaeVatSettingsInsert = z.infer<typeof UaeVatSettingsInsertSchema>;
