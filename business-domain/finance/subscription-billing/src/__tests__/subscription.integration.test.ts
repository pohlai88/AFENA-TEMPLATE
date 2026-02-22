import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { generateBillingCycleInvoice, getProration, getRenewalForecast } from '../services/subscription-service';

describeIntegration('Subscription Billing — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('getProration computes prorated amount', async () => {
    const result = await getProration(db, ctx, {
      planAmountMinor: 30000,
      billingCycleDays: 30,
      usedDays: 15,
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.proratedMinor).toBeDefined();
    }
  });

  it('getRenewalForecast forecasts renewals', async () => {
    const result = await getRenewalForecast(db, ctx, {
      subscriptions: [
        { id: 'SUB-1', mrrMinor: 5000, renewalDateIso: '2026-03-01', churnProbability: 0.1 },
        { id: 'SUB-2', mrrMinor: 10000, renewalDateIso: '2026-06-01', churnProbability: 0.2 },
      ],
      horizonMonths: 12,
    });
    expect(result.kind).toBe('read');
  });

  it('generateBillingCycleInvoice returns intent', async () => {
    const result = await generateBillingCycleInvoice(db, ctx, {
      subscriptionId: 'SUB-INT-001',
      billingCycleId: 'BC-001',
      amountMinor: 5000,
      periodStart: '2026-01-01',
      periodEnd: '2026-01-31',
    });
    expect(result.kind).toBe('intent');
  });
});
