import { describe, expect, it } from 'vitest';

import { allocateGoodwillToCgus } from '../calculators/cgu-allocation';
import { computeGoodwillImpairment } from '../calculators/goodwill-impairment';
import { computeImpairmentReversal } from '../calculators/impairment-reversal';
import { computeImpairmentDisclosure } from '../calculators/impairment-disclosure';

describe('allocateGoodwillToCgus', () => {
  it('allocates goodwill proportionally', () => {
    const { result } = allocateGoodwillToCgus({
      goodwillMinor: 100_000, corporateAssetsMinor: 50_000,
      cgus: [
        { cguId: 'cgu-1', carryingAmountMinor: 500_000, allocationBasis: 60 },
        { cguId: 'cgu-2', carryingAmountMinor: 300_000, allocationBasis: 40 },
      ],
    });
    expect(result.allocations).toHaveLength(2);
    expect(result.allocations[0].goodwillAllocatedMinor).toBe(60_000);
    expect(result.allocations[1].goodwillAllocatedMinor).toBe(40_000);
  });

  it('throws on empty CGUs', () => {
    expect(() => allocateGoodwillToCgus({
      goodwillMinor: 100_000, corporateAssetsMinor: 0, cgus: [],
    })).toThrow('At least one CGU');
  });
});

describe('computeGoodwillImpairment', () => {
  it('allocates impairment to goodwill first', () => {
    const { result } = computeGoodwillImpairment({
      cguCarryingMinor: 500_000, goodwillCarryingMinor: 80_000,
      recoverableAmountMinor: 400_000,
      otherAssets: [
        { assetId: 'a1', carryingMinor: 200_000 },
        { assetId: 'a2', carryingMinor: 220_000 },
      ],
    });
    expect(result.totalImpairmentMinor).toBe(100_000);
    expect(result.goodwillImpairmentMinor).toBe(80_000);
    expect(result.isImpaired).toBe(true);
  });

  it('returns no impairment when recoverable exceeds carrying', () => {
    const { result } = computeGoodwillImpairment({
      cguCarryingMinor: 400_000, goodwillCarryingMinor: 50_000,
      recoverableAmountMinor: 500_000, otherAssets: [],
    });
    expect(result.isImpaired).toBe(false);
    expect(result.totalImpairmentMinor).toBe(0);
  });
});

describe('computeImpairmentReversal', () => {
  it('reverses impairment capped at original carrying', () => {
    const { result } = computeImpairmentReversal({
      currentCarryingMinor: 80_000, newRecoverableAmountMinor: 120_000,
      carryingWithoutImpairmentMinor: 100_000, assetType: 'ppe',
    });
    expect(result.reversalMinor).toBe(20_000);
    expect(result.newCarryingMinor).toBe(100_000);
    expect(result.isReversible).toBe(true);
  });

  it('never reverses goodwill impairment', () => {
    const { result } = computeImpairmentReversal({
      currentCarryingMinor: 50_000, newRecoverableAmountMinor: 100_000,
      carryingWithoutImpairmentMinor: 80_000, assetType: 'goodwill',
    });
    expect(result.reversalMinor).toBe(0);
    expect(result.isReversible).toBe(false);
  });

  it('returns no reversal when recoverable below carrying', () => {
    const { result } = computeImpairmentReversal({
      currentCarryingMinor: 80_000, newRecoverableAmountMinor: 70_000,
      carryingWithoutImpairmentMinor: 100_000, assetType: 'intangible',
    });
    expect(result.reversalMinor).toBe(0);
  });
});

describe('computeImpairmentDisclosure', () => {
  it('aggregates by asset class', () => {
    const { result } = computeImpairmentDisclosure({
      events: [
        { assetId: 'a1', assetClass: 'ppe', lossMinor: 50_000, reversalMinor: 0 },
        { assetId: 'a2', assetClass: 'ppe', lossMinor: 30_000, reversalMinor: 10_000 },
        { assetId: 'a3', assetClass: 'goodwill', lossMinor: 20_000, reversalMinor: 0 },
      ],
    });
    expect(result.totalLossesMinor).toBe(100_000);
    expect(result.totalReversalsMinor).toBe(10_000);
    expect(result.netImpairmentMinor).toBe(90_000);
    expect(result.byClass).toHaveLength(2);
  });
});
