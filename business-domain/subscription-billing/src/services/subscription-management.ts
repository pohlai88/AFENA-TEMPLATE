/**
 * Subscription Management Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { Subscription } from '../types/common.js';
import { BillingFrequency, subscriptionSchema } from '../types/common.js';

export const createSubscriptionSchema = subscriptionSchema.omit({ id: true, createdAt: true });

export async function createSubscription(
  db: NeonHttpDatabase,
  orgId: string,
  input: z.infer<typeof createSubscriptionSchema>,
): Promise<Subscription> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export async function cancelSubscription(
  db: NeonHttpDatabase,
  orgId: string,
  subscriptionId: string,
  endDate: Date,
): Promise<Subscription> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export function calculateNextBillingDate(
  currentDate: Date,
  frequency: BillingFrequency,
): Date {
  const next = new Date(currentDate);
  
  switch (frequency) {
    case BillingFrequency.MONTHLY:
      next.setMonth(next.getMonth() + 1);
      break;
    case BillingFrequency.QUARTERLY:
      next.setMonth(next.getMonth() + 3);
      break;
    case BillingFrequency.ANNUAL:
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}

export function calculateProration(
  fullAmount: number,
  daysUsed: number,
  totalDays: number,
): number {
  return (fullAmount / totalDays) * daysUsed;
}

