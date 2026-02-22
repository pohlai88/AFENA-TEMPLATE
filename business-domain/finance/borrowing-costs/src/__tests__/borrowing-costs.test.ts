import { describe, expect, it, vi } from 'vitest';

import { computeCapitalisableAmount, testCessation } from '../calculators/borrow-cost-calc';
import {
  buildBorrowCostCapitaliseIntent,
  buildBorrowCostCeaseIntent,
} from '../commands/borrow-cost-intent';
import { capitaliseBorrowingCost, ceaseBorrowingCost } from '../services/borrow-cost-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('computeCapitalisableAmount', () => {
  it('capitalises rate × expenditure when below actual cost', () => {
    const { result: r } = computeCapitalisableAmount({
      borrowingCostMinor: 100_000,
      capitalisationRate: 0.08,
      eligibleExpenditureMinor: 500_000,
    });
    expect(r.capitalisableMinor).toBe(40_000);
    expect(r.effectiveRate).toBe(0.08);
  });

  it('caps at actual borrowing cost', () => {
    const { result: r } = computeCapitalisableAmount({
      borrowingCostMinor: 20_000,
      capitalisationRate: 0.1,
      eligibleExpenditureMinor: 500_000,
    });
    expect(r.capitalisableMinor).toBe(20_000);
  });

  it('handles zero expenditure', () => {
    const { result: r } = computeCapitalisableAmount({
      borrowingCostMinor: 100_000,
      capitalisationRate: 0.08,
      eligibleExpenditureMinor: 0,
    });
    expect(r.capitalisableMinor).toBe(0);
  });
});

describe('testCessation', () => {
  it('ceases when substantially complete', () => {
    const { result: r } = testCessation({
      isSubstantiallyComplete: true,
      isDevelopmentSuspended: false,
    });
    expect(r.shouldCease).toBe(true);
  });

  it('ceases when development suspended', () => {
    const { result: r } = testCessation({
      isSubstantiallyComplete: false,
      isDevelopmentSuspended: true,
    });
    expect(r.shouldCease).toBe(true);
  });

  it('continues when conditions met', () => {
    const { result: r } = testCessation({
      isSubstantiallyComplete: false,
      isDevelopmentSuspended: false,
    });
    expect(r.shouldCease).toBe(false);
  });
});

describe('buildBorrowCostCapitaliseIntent', () => {
  it('builds borrow-cost.capitalise intent', () => {
    const intent = buildBorrowCostCapitaliseIntent({
      qualifyingAssetId: 'qa-1',
      periodKey: '2025-P06',
      borrowingCostMinor: 100_000,
      capitalisationRate: 0.08,
      eligibleExpenditureMinor: 500_000,
    });
    expect(intent.type).toBe('borrow-cost.capitalise');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildBorrowCostCeaseIntent', () => {
  it('builds borrow-cost.cease intent', () => {
    const intent = buildBorrowCostCeaseIntent({
      qualifyingAssetId: 'qa-1',
      cessationDate: '2025-06-15',
      reason: 'substantially complete',
      totalCapitalisedMinor: 500_000,
    });
    expect(intent.type).toBe('borrow-cost.cease');
  });
});

describe('capitaliseBorrowingCost (service)', () => {
  it('returns borrow-cost.capitalise intent', async () => {
    const r = await capitaliseBorrowingCost({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      qualifyingAssetId: 'qa-1',
      periodKey: '2025-P06',
      borrowingCostMinor: 100_000,
      capitalisationRate: 0.08,
      eligibleExpenditureMinor: 500_000,
    });
    expect(r.kind).toBe('intent');
  });
});

describe('ceaseBorrowingCost (service)', () => {
  it('returns borrow-cost.cease intent', async () => {
    const r = await ceaseBorrowingCost({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      qualifyingAssetId: 'qa-1',
      cessationDate: '2025-06-15',
      reason: 'substantially complete',
      totalCapitalisedMinor: 500_000,
    });
    expect(r.kind).toBe('intent');
  });
});
