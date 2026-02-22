import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SB-01 — Subscription plan master: price, billing cycle, trial
 * SB-08 — Churn Tracking and MRR/ARR Reporting
 * Pure function — no I/O.
 */

export type SubscriptionMetric = { subscriptionId: string; mrrMinor: number; status: 'active' | 'churned' | 'downgraded' | 'upgraded' | 'new'; previousMrrMinor: number };

export type MrrReport = {
  totalMrrMinor: number; totalArrMinor: number;
  newMrrMinor: number; expansionMrrMinor: number; contractionMrrMinor: number; churnedMrrMinor: number;
  netNewMrrMinor: number; churnRatePct: number; activeCount: number; churnedCount: number;
};

export function computeMrrReport(subscriptions: SubscriptionMetric[]): CalculatorResult<MrrReport> {
  if (subscriptions.length === 0) throw new DomainError('VALIDATION_FAILED', 'No subscriptions');
  let newMrr = 0, expansion = 0, contraction = 0, churned = 0, totalMrr = 0, activeCount = 0, churnedCount = 0;
  for (const s of subscriptions) {
    if (s.status === 'active' || s.status === 'upgraded' || s.status === 'downgraded') { totalMrr += s.mrrMinor; activeCount++; }
    if (s.status === 'new') { newMrr += s.mrrMinor; totalMrr += s.mrrMinor; activeCount++; }
    if (s.status === 'upgraded') expansion += s.mrrMinor - s.previousMrrMinor;
    if (s.status === 'downgraded') contraction += s.previousMrrMinor - s.mrrMinor;
    if (s.status === 'churned') { churned += s.previousMrrMinor; churnedCount++; }
  }
  const totalPreviousMrr = subscriptions.reduce((s, sub) => s + sub.previousMrrMinor, 0);
  const churnRatePct = totalPreviousMrr > 0 ? Math.round((churned / totalPreviousMrr) * 10000) / 100 : 0;
  return { result: { totalMrrMinor: totalMrr, totalArrMinor: totalMrr * 12, newMrrMinor: newMrr, expansionMrrMinor: expansion, contractionMrrMinor: contraction, churnedMrrMinor: churned, netNewMrrMinor: newMrr + expansion - contraction - churned, churnRatePct, activeCount, churnedCount }, inputs: { count: subscriptions.length }, explanation: `MRR report: total=${totalMrr}, net new=${newMrr + expansion - contraction - churned}, churn=${churnRatePct}%` };
}
