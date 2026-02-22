import { describe, expect, it } from 'vitest';

import { computeHedgeCostOfHedging } from '../calculators/hedge-cost-of-hedging';
import { computeNetInvestmentHedge } from '../calculators/net-investment-hedge';

describe('computeHedgeCostOfHedging', () => {
  it('computes time value and amortisation', () => {
    const { result } = computeHedgeCostOfHedging({
      designationId: 'd1', instrumentFvMinor: 50_000, intrinsicValueMinor: 30_000,
      priorCostOfHedgingOciMinor: 10_000, amortisationMethod: 'straight-line',
      remainingPeriods: 6,
    });
    expect(result.timeValueMinor).toBe(20_000);
    expect(result.periodAmortisationMinor).toBe(5_000);
    expect(result.ociBalanceMinor).toBe(25_000);
  });

  it('throws on zero remaining periods', () => {
    expect(() => computeHedgeCostOfHedging({
      designationId: 'd1', instrumentFvMinor: 50_000, intrinsicValueMinor: 30_000,
      priorCostOfHedgingOciMinor: 0, amortisationMethod: 'straight-line',
      remainingPeriods: 0,
    })).toThrow('Remaining periods must be positive');
  });
});

describe('computeNetInvestmentHedge', () => {
  it('splits effective and ineffective portions', () => {
    const { result } = computeNetInvestmentHedge({
      designationId: 'd1', hedgingInstrumentFvChangeMinor: -50_000,
      netInvestmentFvChangeMinor: 40_000, hedgeRatio: 1.0,
    });
    expect(result.effectivePortionMinor).toBe(40_000);
    expect(result.ineffectivePortionMinor).toBe(10_000);
    expect(result.recogniseToOci).toBe(-40_000);
  });

  it('adjusts for hedge ratio', () => {
    const { result } = computeNetInvestmentHedge({
      designationId: 'd1', hedgingInstrumentFvChangeMinor: -30_000,
      netInvestmentFvChangeMinor: 50_000, hedgeRatio: 0.8,
    });
    expect(result.effectivePortionMinor).toBe(30_000);
    expect(result.ineffectivePortionMinor).toBe(0);
  });

  it('throws on invalid hedge ratio', () => {
    expect(() => computeNetInvestmentHedge({
      designationId: 'd1', hedgingInstrumentFvChangeMinor: -10_000,
      netInvestmentFvChangeMinor: 10_000, hedgeRatio: 0,
    })).toThrow('Hedge ratio must be between');
  });
});
