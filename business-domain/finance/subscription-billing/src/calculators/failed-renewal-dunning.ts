import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SB-04 — Dunning for failed renewals (retry + escalation)
 */
export type FailedRenewal = {
  subscriptionId: string;
  customerId: string;
  mrrMinor: number;
  failureCount: number;
  lastAttemptIso: string;
  paymentMethod: string;
};

export type DunningAction = {
  subscriptionId: string;
  action: 'retry' | 'email_reminder' | 'downgrade' | 'cancel';
  delayDays: number;
  reason: string;
};

export type FailedRenewalDunningResult = {
  actions: DunningAction[];
  totalAtRiskMrrMinor: number;
  retryCount: number;
  cancelCount: number;
};

export function planRenewalDunning(
  failures: FailedRenewal[],
  maxRetries: number = 3,
): CalculatorResult<FailedRenewalDunningResult> {
  if (failures.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one failed renewal');
  }

  const actions: DunningAction[] = [];

  for (const f of failures) {
    if (f.failureCount <= 1) {
      actions.push({ subscriptionId: f.subscriptionId, action: 'retry', delayDays: 1, reason: 'First failure — immediate retry' });
    } else if (f.failureCount <= maxRetries) {
      actions.push({ subscriptionId: f.subscriptionId, action: 'email_reminder', delayDays: 3, reason: `Attempt ${f.failureCount} — notify customer` });
      actions.push({ subscriptionId: f.subscriptionId, action: 'retry', delayDays: 5, reason: `Retry after reminder (attempt ${f.failureCount})` });
    } else {
      actions.push({ subscriptionId: f.subscriptionId, action: 'cancel', delayDays: 0, reason: `Exceeded ${maxRetries} retries — cancel subscription` });
    }
  }

  const totalAtRisk = failures.reduce((s, f) => s + f.mrrMinor, 0);
  const retryCount = actions.filter((a) => a.action === 'retry').length;
  const cancelCount = actions.filter((a) => a.action === 'cancel').length;

  return {
    result: { actions, totalAtRiskMrrMinor: totalAtRisk, retryCount, cancelCount },
    inputs: { failureCount: failures.length, maxRetries },
    explanation: `Dunning plan for ${failures.length} failed renewals: ${retryCount} retries, ${cancelCount} cancellations. MRR at risk: ${totalAtRisk}.`,
  };
}
