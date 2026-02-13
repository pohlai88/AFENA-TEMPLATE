import { z } from 'zod';

export const ShareTransferSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  transfer_type: z.enum(['Issue', 'Purchase', 'Transfer']),
  date: z.string(),
  from_shareholder: z.string().optional(),
  from_folio_no: z.string().optional(),
  to_shareholder: z.string().optional(),
  to_folio_no: z.string().optional(),
  equity_or_liability_account: z.string(),
  asset_account: z.string().optional(),
  share_type: z.string(),
  from_no: z.number().int(),
  rate: z.number(),
  no_of_shares: z.number().int(),
  to_no: z.number().int(),
  amount: z.number().optional(),
  company: z.string(),
  remarks: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ShareTransfer = z.infer<typeof ShareTransferSchema>;

export const ShareTransferInsertSchema = ShareTransferSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareTransferInsert = z.infer<typeof ShareTransferInsertSchema>;
