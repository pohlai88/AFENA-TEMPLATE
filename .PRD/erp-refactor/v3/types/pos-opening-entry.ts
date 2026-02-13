import { z } from 'zod';

export const PosOpeningEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  period_start_date: z.string(),
  period_end_date: z.string().optional(),
  status: z.enum(['Draft', 'Open', 'Closed', 'Cancelled']).optional().default('Draft'),
  posting_date: z.string().default('Today'),
  set_posting_date: z.boolean().optional().default(false),
  company: z.string(),
  pos_profile: z.string(),
  pos_closing_entry: z.string().optional(),
  user: z.string(),
  balance_details: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type PosOpeningEntry = z.infer<typeof PosOpeningEntrySchema>;

export const PosOpeningEntryInsertSchema = PosOpeningEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosOpeningEntryInsert = z.infer<typeof PosOpeningEntryInsertSchema>;
