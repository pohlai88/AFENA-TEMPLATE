import { describe, expect, it } from 'vitest';

import { computeFairValueModel } from '../calculators/fair-value-model';
import { computeCostModelDepreciation } from '../calculators/cost-model-depreciation';
import { classifyTransfer } from '../calculators/transfer-classification';
import { computeInvPropertyDisclosure } from '../calculators/inv-property-disclosure';

describe('computeFairValueModel', () => {
  it('computes FV change and yield', () => {
    const { result } = computeFairValueModel({
      propertyId: 'p1', prevFairValueMinor: 1_000_000, currFairValueMinor: 1_050_000,
      rentalIncomeMinor: 60_000, directOperatingExpensesMinor: 10_000,
    });
    expect(result.fvChangeMinor).toBe(50_000);
    expect(result.netRentalIncomeMinor).toBe(50_000);
    expect(result.totalReturnMinor).toBe(100_000);
    expect(result.yieldPct).toBe('5.00%');
  });

  it('throws on negative previous FV', () => {
    expect(() => computeFairValueModel({
      propertyId: 'p1', prevFairValueMinor: -1, currFairValueMinor: 100_000,
      rentalIncomeMinor: 0, directOperatingExpensesMinor: 0,
    })).toThrow('cannot be negative');
  });
});

describe('computeCostModelDepreciation', () => {
  it('computes period depreciation', () => {
    const { result } = computeCostModelDepreciation({
      costMinor: 1_200_000, residualValueMinor: 200_000, usefulLifeMonths: 240,
      elapsedMonths: 24, accumulatedDepreciationMinor: 100_000,
    });
    expect(result.periodDepreciationMinor).toBeGreaterThan(0);
    expect(result.carryingAmountMinor).toBeLessThan(1_200_000);
  });

  it('returns zero depreciation when fully depreciated', () => {
    const { result } = computeCostModelDepreciation({
      costMinor: 100_000, residualValueMinor: 0, usefulLifeMonths: 120,
      elapsedMonths: 120, accumulatedDepreciationMinor: 100_000,
    });
    expect(result.periodDepreciationMinor).toBe(0);
  });
});

describe('classifyTransfer', () => {
  it('recognises gain to revaluation surplus for owner-occupied to investment', () => {
    const { result } = classifyTransfer({
      direction: 'to-investment', fromCategory: 'owner-occupied',
      toCategory: 'investment-property', carryingMinor: 80_000,
      fairValueMinor: 100_000, measurementModel: 'fair-value',
    });
    expect(result.transferValueMinor).toBe(100_000);
    expect(result.gainLossMinor).toBe(20_000);
    expect(result.recogniseTo).toBe('revaluation-surplus');
  });

  it('no gain/loss on cost model transfer', () => {
    const { result } = classifyTransfer({
      direction: 'to-investment', fromCategory: 'ppe',
      toCategory: 'investment-property', carryingMinor: 80_000,
      fairValueMinor: 100_000, measurementModel: 'cost',
    });
    expect(result.transferValueMinor).toBe(80_000);
    expect(result.gainLossMinor).toBe(0);
  });
});

describe('computeInvPropertyDisclosure', () => {
  it('reconciles carrying amounts', () => {
    const { result } = computeInvPropertyDisclosure({
      openingCarryingMinor: 500_000, additionsMinor: 100_000,
      disposalsMinor: 50_000, fvGainLossMinor: 20_000,
      depreciationMinor: 0, transfersInMinor: 30_000,
      transfersOutMinor: 10_000, fxTranslationMinor: -5_000,
    });
    expect(result.closingCarryingMinor).toBe(585_000);
    expect(result.reconciliation.opening).toBe(500_000);
  });
});
