import { z } from 'zod';

export const PaymentGatewayAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_gateway: z.string(),
  payment_channel: z.enum(['Email', 'Phone', 'Other']).optional().default('Email'),
  company: z.string(),
  is_default: z.boolean().optional().default(false),
  payment_account: z.string(),
  currency: z.string().optional(),
  message: z.string().optional().default('Please click on the link below to make your payment'),
  message_examples: z.string().optional(),
});

export type PaymentGatewayAccount = z.infer<typeof PaymentGatewayAccountSchema>;

export const PaymentGatewayAccountInsertSchema = PaymentGatewayAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentGatewayAccountInsert = z.infer<typeof PaymentGatewayAccountInsertSchema>;
