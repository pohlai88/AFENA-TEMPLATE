import { z } from 'zod';

export const JournalEntryTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_title: z.string(),
  voucher_type: z.enum(['Journal Entry', 'Inter Company Journal Entry', 'Bank Entry', 'Cash Entry', 'Credit Card Entry', 'Debit Note', 'Credit Note', 'Contra Entry', 'Excise Entry', 'Write Off Entry', 'Opening Entry', 'Depreciation Entry', 'Exchange Rate Revaluation']),
  naming_series: z.string(),
  company: z.string(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  multi_currency: z.boolean().optional().default(false),
  accounts: z.array(z.unknown()).optional(),
});

export type JournalEntryTemplate = z.infer<typeof JournalEntryTemplateSchema>;

export const JournalEntryTemplateInsertSchema = JournalEntryTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryTemplateInsert = z.infer<typeof JournalEntryTemplateInsertSchema>;
