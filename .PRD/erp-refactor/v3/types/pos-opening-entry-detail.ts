import { z } from 'zod';

export const PosOpeningEntryDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  opening_amount: z.number().default(0),
});

export type PosOpeningEntryDetail = z.infer<typeof PosOpeningEntryDetailSchema>;

export const PosOpeningEntryDetailInsertSchema = PosOpeningEntryDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosOpeningEntryDetailInsert = z.infer<typeof PosOpeningEntryDetailInsertSchema>;
