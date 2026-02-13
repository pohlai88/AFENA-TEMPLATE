import { z } from 'zod';

export const SubscriptionSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  grace_period: z.number().int().optional().default(1),
  cancel_after_grace: z.boolean().optional().default(false),
  prorate: z.boolean().optional().default(true),
});

export type SubscriptionSettings = z.infer<typeof SubscriptionSettingsSchema>;

export const SubscriptionSettingsInsertSchema = SubscriptionSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionSettingsInsert = z.infer<typeof SubscriptionSettingsInsertSchema>;
