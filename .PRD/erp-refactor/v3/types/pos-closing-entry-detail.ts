import { z } from 'zod';

export const PosClosingEntryDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  opening_amount: z.number(),
  expected_amount: z.number().optional(),
  closing_amount: z.number().default(0),
  difference: z.number().optional(),
});

export type PosClosingEntryDetail = z.infer<typeof PosClosingEntryDetailSchema>;

export const PosClosingEntryDetailInsertSchema = PosClosingEntryDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryDetailInsert = z.infer<typeof PosClosingEntryDetailInsertSchema>;
