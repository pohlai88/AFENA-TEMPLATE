import { z } from 'zod';

export const UnreconcilePaymentEntriesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  allocated_amount: z.number().optional(),
  account_currency: z.string().optional(),
  unlinked: z.boolean().optional().default(false),
});

export type UnreconcilePaymentEntries = z.infer<typeof UnreconcilePaymentEntriesSchema>;

export const UnreconcilePaymentEntriesInsertSchema = UnreconcilePaymentEntriesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UnreconcilePaymentEntriesInsert = z.infer<typeof UnreconcilePaymentEntriesInsertSchema>;
