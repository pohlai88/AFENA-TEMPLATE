/**
 * Recurring Invoicing Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { Invoice, MRRMetrics } from '../types/common.js';

export async function generateRecurringInvoices(
  db: NeonHttpDatabase,
  orgId: string,
  billingDate: Date,
): Promise<Invoice[]> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export async function getMRRMetrics(
  db: NeonHttpDatabase,
  orgId: string,
  asOfDate: Date,
): Promise<MRRMetrics> {
  // TODO: Implement
  throw new Error('Not implemented');
}

export function calculateMRR(
  subscriptions: Array<{ recurringAmount: number; billingFrequency: string }>,
): number {
  return subscriptions.reduce((mrr, sub) => {
    const monthlyAmount = sub.billingFrequency === 'MONTHLY' 
      ? sub.recurringAmount
      : sub.billingFrequency === 'QUARTERLY'
      ? sub.recurringAmount / 3
      : sub.recurringAmount / 12;
    return mrr + monthlyAmount;
  }, 0);
}

export function calculateChurnRate(
  cancelledCount: number,
  totalSubscriptionsAtStart: number,
): number {
  if (totalSubscriptionsAtStart === 0) return 0;
  return (cancelledCount / totalSubscriptionsAtStart) * 100;
}

