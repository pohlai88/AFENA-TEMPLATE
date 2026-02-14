import { z } from 'zod';

export const SubscriptionPlanDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plan: z.string(),
  qty: z.number().int(),
});

export type SubscriptionPlanDetail = z.infer<typeof SubscriptionPlanDetailSchema>;

export const SubscriptionPlanDetailInsertSchema = SubscriptionPlanDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionPlanDetailInsert = z.infer<typeof SubscriptionPlanDetailInsertSchema>;
