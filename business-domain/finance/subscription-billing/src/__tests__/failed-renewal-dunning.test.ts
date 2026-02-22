import { describe, expect, it } from 'vitest';
import { planRenewalDunning } from '../calculators/failed-renewal-dunning';

describe('planRenewalDunning', () => {
  it('retries on first failure', () => {
    const r = planRenewalDunning([{ subscriptionId: 'S1', customerId: 'C1', mrrMinor: 5000, failureCount: 1, lastAttemptIso: '2026-01-01', paymentMethod: 'card' }]);
    expect(r.result.actions[0]!.action).toBe('retry');
    expect(r.result.retryCount).toBe(1);
    expect(r.result.cancelCount).toBe(0);
  });

  it('sends reminder then retries on subsequent failures', () => {
    const r = planRenewalDunning([{ subscriptionId: 'S2', customerId: 'C2', mrrMinor: 10000, failureCount: 2, lastAttemptIso: '2026-01-05', paymentMethod: 'card' }]);
    expect(r.result.actions).toHaveLength(2);
    expect(r.result.actions[0]!.action).toBe('email_reminder');
    expect(r.result.actions[1]!.action).toBe('retry');
  });

  it('cancels after max retries exceeded', () => {
    const r = planRenewalDunning([{ subscriptionId: 'S3', customerId: 'C3', mrrMinor: 3000, failureCount: 5, lastAttemptIso: '2026-01-10', paymentMethod: 'card' }]);
    expect(r.result.cancelCount).toBe(1);
    expect(r.result.totalAtRiskMrrMinor).toBe(3000);
  });

  it('throws on empty failures', () => {
    expect(() => planRenewalDunning([])).toThrow('at least one');
  });
});
