import { z } from 'zod';

export const JournalEntryTemplateAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
});

export type JournalEntryTemplateAccount = z.infer<typeof JournalEntryTemplateAccountSchema>;

export const JournalEntryTemplateAccountInsertSchema = JournalEntryTemplateAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryTemplateAccountInsert = z.infer<typeof JournalEntryTemplateAccountInsertSchema>;
