import { z } from 'zod';

export const ShareBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  share_type: z.string(),
  from_no: z.number().int(),
  rate: z.number(),
  no_of_shares: z.number().int(),
  to_no: z.number().int(),
  amount: z.number(),
  is_company: z.boolean().optional().default(false),
  current_state: z.enum(['Issued', 'Purchased']).optional(),
});

export type ShareBalance = z.infer<typeof ShareBalanceSchema>;

export const ShareBalanceInsertSchema = ShareBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareBalanceInsert = z.infer<typeof ShareBalanceInsertSchema>;
