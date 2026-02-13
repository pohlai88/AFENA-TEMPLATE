import { z } from 'zod';

export const LoyaltyPointEntryRedemptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string().optional(),
  redemption_date: z.string().optional(),
  redeemed_points: z.number().int().optional(),
});

export type LoyaltyPointEntryRedemption = z.infer<typeof LoyaltyPointEntryRedemptionSchema>;

export const LoyaltyPointEntryRedemptionInsertSchema = LoyaltyPointEntryRedemptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyPointEntryRedemptionInsert = z.infer<typeof LoyaltyPointEntryRedemptionInsertSchema>;
