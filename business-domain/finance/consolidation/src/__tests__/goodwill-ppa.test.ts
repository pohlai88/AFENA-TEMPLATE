import { describe, expect, it } from 'vitest';
import { computePurchasePriceAllocation } from '../calculators/goodwill-ppa';

describe('CO-05 — Goodwill PPA', () => {
  it('computes goodwill on acquisition', () => {
    const { result } = computePurchasePriceAllocation({
      acquireeId: 'SUB-1',
      considerationTransferredMinor: 500_000,
      nciMeasurementMinor: 50_000,
      previouslyHeldEquityFvMinor: 0,
      identifiableAssets: [
        { name: 'PPE', fairValueMinor: 300_000 },
        { name: 'Intangibles', fairValueMinor: 100_000 },
      ],
      identifiableLiabilities: [
        { name: 'Debt', fairValueMinor: 50_000 },
      ],
    });
    // Net assets = 400k - 50k = 350k, total consideration = 550k, goodwill = 200k
    expect(result.goodwillMinor).toBe(200_000);
    expect(result.isBargainPurchase).toBe(false);
    expect(result.netIdentifiableAssetsMinor).toBe(350_000);
  });

  it('detects bargain purchase', () => {
    const { result } = computePurchasePriceAllocation({
      acquireeId: 'SUB-2',
      considerationTransferredMinor: 100_000,
      nciMeasurementMinor: 0,
      previouslyHeldEquityFvMinor: 0,
      identifiableAssets: [{ name: 'PPE', fairValueMinor: 200_000 }],
      identifiableLiabilities: [],
    });
    expect(result.isBargainPurchase).toBe(true);
    expect(result.goodwillMinor).toBe(0);
    expect(result.bargainPurchaseGainMinor).toBe(100_000);
  });

  it('includes previously held equity', () => {
    const { result } = computePurchasePriceAllocation({
      acquireeId: 'SUB-3',
      considerationTransferredMinor: 300_000,
      nciMeasurementMinor: 0,
      previouslyHeldEquityFvMinor: 100_000,
      identifiableAssets: [{ name: 'PPE', fairValueMinor: 350_000 }],
      identifiableLiabilities: [],
    });
    expect(result.totalConsiderationMinor).toBe(400_000);
    expect(result.goodwillMinor).toBe(50_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = computePurchasePriceAllocation({
      acquireeId: 'X', considerationTransferredMinor: 100, nciMeasurementMinor: 0,
      previouslyHeldEquityFvMinor: 0, identifiableAssets: [], identifiableLiabilities: [],
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing acquireeId', () => {
    expect(() => computePurchasePriceAllocation({
      acquireeId: '', considerationTransferredMinor: 100, nciMeasurementMinor: 0,
      previouslyHeldEquityFvMinor: 0, identifiableAssets: [], identifiableLiabilities: [],
    })).toThrow('acquireeId is required');
  });
});
