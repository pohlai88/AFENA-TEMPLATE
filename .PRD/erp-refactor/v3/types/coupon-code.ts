import { z } from 'zod';

export const CouponCodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  coupon_name: z.string(),
  coupon_type: z.enum(['Promotional', 'Gift Card']),
  customer: z.string().optional(),
  coupon_code: z.string().optional(),
  from_external_ecomm_platform: z.boolean().optional().default(false),
  pricing_rule: z.string().optional(),
  valid_from: z.string().optional(),
  valid_upto: z.string().optional(),
  maximum_use: z.number().int().optional(),
  used: z.number().int().optional().default(0),
  description: z.string().optional(),
  amended_from: z.string().optional(),
});

export type CouponCode = z.infer<typeof CouponCodeSchema>;

export const CouponCodeInsertSchema = CouponCodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CouponCodeInsert = z.infer<typeof CouponCodeInsertSchema>;
