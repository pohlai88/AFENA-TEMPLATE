/**
 * Subscription Billing Types
 */

import { z } from 'zod';

export enum BillingFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
  TRIAL = 'TRIAL',
}

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  planId: z.string().uuid(),
  status: z.nativeEnum(SubscriptionStatus),
  billingFrequency: z.nativeEnum(BillingFrequency),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  recurringAmount: z.number().positive(),
  createdAt: z.coerce.date(),
});

export const invoiceSchema = z.object({
  id: z.string().uuid(),
  subscriptionId: z.string().uuid(),
  invoiceNumber: z.string(),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  amount: z.number().positive(),
  isPaid: z.boolean().default(false),
  paidDate: z.coerce.date().optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;

export interface MRRMetrics {
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
}
