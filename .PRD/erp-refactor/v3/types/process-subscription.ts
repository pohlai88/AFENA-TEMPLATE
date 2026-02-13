import { z } from 'zod';

export const ProcessSubscriptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string(),
  subscription: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ProcessSubscription = z.infer<typeof ProcessSubscriptionSchema>;

export const ProcessSubscriptionInsertSchema = ProcessSubscriptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessSubscriptionInsert = z.infer<typeof ProcessSubscriptionInsertSchema>;
