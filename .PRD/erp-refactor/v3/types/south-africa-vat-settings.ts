import { z } from 'zod';

export const SouthAfricaVatSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  vat_accounts: z.array(z.unknown()),
});

export type SouthAfricaVatSettings = z.infer<typeof SouthAfricaVatSettingsSchema>;

export const SouthAfricaVatSettingsInsertSchema = SouthAfricaVatSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SouthAfricaVatSettingsInsert = z.infer<typeof SouthAfricaVatSettingsInsertSchema>;
