import { z } from 'zod';

export const LoyaltyPointEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  loyalty_program: z.string(),
  loyalty_program_tier: z.string().optional(),
  customer: z.string(),
  invoice_type: z.string(),
  invoice: z.string().optional(),
  redeem_against: z.string().optional(),
  loyalty_points: z.number().int(),
  purchase_amount: z.number().optional(),
  expiry_date: z.string(),
  posting_date: z.string(),
  company: z.string(),
  discretionary_reason: z.string().optional(),
});

export type LoyaltyPointEntry = z.infer<typeof LoyaltyPointEntrySchema>;

export const LoyaltyPointEntryInsertSchema = LoyaltyPointEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyPointEntryInsert = z.infer<typeof LoyaltyPointEntryInsertSchema>;
