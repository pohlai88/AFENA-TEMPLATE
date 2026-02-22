import { describe, expect, it } from 'vitest';

import { computeBlackScholesValuation } from '../calculators/black-scholes-valuation';
import { computeModificationAccounting } from '../calculators/modification-accounting';
import { computeCashSettledRemeasure } from '../calculators/cash-settled-remeasure';
import { computeSbpDisclosure } from '../calculators/sbp-disclosure';

describe('computeBlackScholesValuation', () => {
  it('computes option value with positive intrinsic', () => {
    const { result } = computeBlackScholesValuation({
      spotPriceMinor: 120_000, strikePriceMinor: 100_000,
      timeToExpiryYears: 3, riskFreeRate: 0.03,
      volatility: 0.3, dividendYield: 0.01,
    });
    expect(result.optionValueMinor).toBeGreaterThan(0);
    expect(result.intrinsicValueMinor).toBe(20_000);
    expect(result.timeValueMinor).toBeGreaterThan(0);
  });

  it('computes value for out-of-money option', () => {
    const { result } = computeBlackScholesValuation({
      spotPriceMinor: 80_000, strikePriceMinor: 100_000,
      timeToExpiryYears: 2, riskFreeRate: 0.03,
      volatility: 0.25, dividendYield: 0,
    });
    expect(result.optionValueMinor).toBeGreaterThan(0);
    expect(result.intrinsicValueMinor).toBe(0);
  });

  it('throws on non-positive spot price', () => {
    expect(() => computeBlackScholesValuation({
      spotPriceMinor: 0, strikePriceMinor: 100_000,
      timeToExpiryYears: 1, riskFreeRate: 0.03,
      volatility: 0.3, dividendYield: 0,
    })).toThrow('Spot price must be positive');
  });
});

describe('computeModificationAccounting', () => {
  it('computes incremental FV and additional expense', () => {
    const { result } = computeModificationAccounting({
      originalFvPerUnitMinor: 500, modifiedFvPerUnitMinor: 700,
      instrumentsOutstanding: 1000, remainingVestingMonths: 24,
      totalVestingMonths: 36,
    });
    expect(result.incrementalFvPerUnitMinor).toBe(200);
    expect(result.totalIncrementalFvMinor).toBe(200_000);
    expect(result.additionalExpensePerMonthMinor).toBe(8_333);
  });

  it('caps incremental at zero when FV decreases', () => {
    const { result } = computeModificationAccounting({
      originalFvPerUnitMinor: 700, modifiedFvPerUnitMinor: 500,
      instrumentsOutstanding: 1000, remainingVestingMonths: 24,
      totalVestingMonths: 36,
    });
    expect(result.incrementalFvPerUnitMinor).toBe(0);
    expect(result.totalIncrementalFvMinor).toBe(0);
  });
});

describe('computeCashSettledRemeasure', () => {
  it('computes remeasurement to P&L', () => {
    const { result } = computeCashSettledRemeasure({
      grantId: 'g1', instrumentsOutstanding: 500,
      prevFvPerUnitMinor: 400, currFvPerUnitMinor: 500,
      vestedRatio: 0.5,
    });
    expect(result.prevLiabilityMinor).toBe(100_000);
    expect(result.currLiabilityMinor).toBe(125_000);
    expect(result.remeasurementMinor).toBe(25_000);
  });

  it('throws on invalid vested ratio', () => {
    expect(() => computeCashSettledRemeasure({
      grantId: 'g1', instrumentsOutstanding: 100,
      prevFvPerUnitMinor: 100, currFvPerUnitMinor: 200,
      vestedRatio: 1.5,
    })).toThrow('Vested ratio must be between');
  });
});

describe('computeSbpDisclosure', () => {
  it('aggregates disclosure amounts', () => {
    const { result } = computeSbpDisclosure({
      grants: [
        { grantId: 'g1', settlementType: 'equity', instrumentsOutstanding: 1000, weightedAvgExercisePriceMinor: 500, expenseThisPeriodMinor: 50_000 },
        { grantId: 'g2', settlementType: 'cash', instrumentsOutstanding: 500, weightedAvgExercisePriceMinor: 300, expenseThisPeriodMinor: 20_000 },
      ],
    });
    expect(result.totalExpenseMinor).toBe(70_000);
    expect(result.equitySettledExpenseMinor).toBe(50_000);
    expect(result.cashSettledExpenseMinor).toBe(20_000);
    expect(result.totalInstrumentsOutstanding).toBe(1500);
  });

  it('throws on empty grants', () => {
    expect(() => computeSbpDisclosure({ grants: [] })).toThrow('At least one grant');
  });
});
