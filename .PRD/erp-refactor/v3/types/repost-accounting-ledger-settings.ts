import { z } from 'zod';

export const RepostAccountingLedgerSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  allowed_types: z.array(z.unknown()).optional(),
});

export type RepostAccountingLedgerSettings = z.infer<typeof RepostAccountingLedgerSettingsSchema>;

export const RepostAccountingLedgerSettingsInsertSchema = RepostAccountingLedgerSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerSettingsInsert = z.infer<typeof RepostAccountingLedgerSettingsInsertSchema>;
