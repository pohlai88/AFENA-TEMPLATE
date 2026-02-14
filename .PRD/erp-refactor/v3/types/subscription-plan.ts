import { z } from 'zod';

export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plan_name: z.string(),
  currency: z.string(),
  item: z.string(),
  price_determination: z.enum(['Fixed Rate', 'Based On Price List', 'Monthly Rate']),
  cost: z.number().optional(),
  price_list: z.string().optional(),
  billing_interval: z.enum(['Day', 'Week', 'Month', 'Year']).default('Day'),
  billing_interval_count: z.number().int().default(1),
  product_price_id: z.string().optional(),
  payment_gateway: z.string().optional(),
  cost_center: z.string().optional(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const SubscriptionPlanInsertSchema = SubscriptionPlanSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionPlanInsert = z.infer<typeof SubscriptionPlanInsertSchema>;
