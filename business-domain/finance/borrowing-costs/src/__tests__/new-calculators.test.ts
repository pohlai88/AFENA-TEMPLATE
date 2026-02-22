import { describe, expect, it } from 'vitest';

import { computeBorrowingCostDisclosure } from '../calculators/borrowing-cost-disclosure';
import { evaluateQualifyingAsset } from '../calculators/qualifying-asset-evaluation';
import { evaluateSuspensionPeriod } from '../calculators/suspension-period';
import { computeWeightedAvgBorrowingRate } from '../calculators/weighted-avg-borrowing-rate';

describe('computeWeightedAvgBorrowingRate', () => {
  it('computes weighted average across facilities', () => {
    const { result } = computeWeightedAvgBorrowingRate({
      facilities: [
        { facilityId: 'f1', principalOutstandingMinor: 1_000_000, interestCostMinor: 50_000 },
        { facilityId: 'f2', principalOutstandingMinor: 2_000_000, interestCostMinor: 80_000 },
      ],
    });
    expect(result.totalPrincipalMinor).toBe(3_000_000);
    expect(result.totalInterestMinor).toBe(130_000);
    expect(result.weightedAvgRate).toBeCloseTo(0.0433, 3);
  });

  it('throws on empty facilities', () => {
    expect(() => computeWeightedAvgBorrowingRate({ facilities: [] })).toThrow('At least one');
  });
});

describe('evaluateSuspensionPeriod', () => {
  it('identifies extended suspension', () => {
    const { result } = evaluateSuspensionPeriod({
      suspensionStartDate: '2025-01-01', suspensionDays: 100,
      extendedSuspensionThresholdDays: 90, borrowingCostDuringSuspensionMinor: 5_000,
    });
    expect(result.isSuspended).toBe(true);
    expect(result.isExtendedSuspension).toBe(true);
    expect(result.expensedCostMinor).toBe(5_000);
  });

  it('returns no suspension for zero days', () => {
    const { result } = evaluateSuspensionPeriod({
      suspensionStartDate: '2025-01-01', suspensionDays: 0,
      extendedSuspensionThresholdDays: 90, borrowingCostDuringSuspensionMinor: 0,
    });
    expect(result.isSuspended).toBe(false);
  });
});

describe('evaluateQualifyingAsset', () => {
  it('qualifies asset with substantial construction period', () => {
    const { result } = evaluateQualifyingAsset({
      assetType: 'ppe', estimatedConstructionMonths: 18,
      substantialPeriodThresholdMonths: 12, isReadyForUseOrSale: false,
    });
    expect(result.qualifies).toBe(true);
  });

  it('rejects already-complete asset', () => {
    const { result } = evaluateQualifyingAsset({
      assetType: 'ppe', estimatedConstructionMonths: 24,
      substantialPeriodThresholdMonths: 12, isReadyForUseOrSale: true,
    });
    expect(result.qualifies).toBe(false);
    expect(result.reason).toBe('already_complete');
  });

  it('rejects below-threshold asset', () => {
    const { result } = evaluateQualifyingAsset({
      assetType: 'inventory', estimatedConstructionMonths: 3,
      substantialPeriodThresholdMonths: 12, isReadyForUseOrSale: false,
    });
    expect(result.qualifies).toBe(false);
  });
});

describe('computeBorrowingCostDisclosure', () => {
  it('computes disclosure amounts', () => {
    const { result } = computeBorrowingCostDisclosure({
      totalBorrowingCostMinor: 100_000, capitalisedAmountMinor: 40_000,
      capitalisationRate: 0.05, qualifyingAssetCount: 3,
    });
    expect(result.expensedAmountMinor).toBe(60_000);
    expect(result.capitalisationRatePct).toBe('5.00%');
  });

  it('throws when capitalised exceeds total', () => {
    expect(() => computeBorrowingCostDisclosure({
      totalBorrowingCostMinor: 50_000, capitalisedAmountMinor: 60_000,
      capitalisationRate: 0.05, qualifyingAssetCount: 1,
    })).toThrow('cannot exceed');
  });
});
