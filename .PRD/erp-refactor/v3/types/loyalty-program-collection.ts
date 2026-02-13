import { z } from 'zod';

export const LoyaltyProgramCollectionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tier_name: z.string(),
  min_spent: z.number().optional(),
  collection_factor: z.number(),
});

export type LoyaltyProgramCollection = z.infer<typeof LoyaltyProgramCollectionSchema>;

export const LoyaltyProgramCollectionInsertSchema = LoyaltyProgramCollectionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyProgramCollectionInsert = z.infer<typeof LoyaltyProgramCollectionInsertSchema>;
