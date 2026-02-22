import { describe, expect, it } from 'vitest';
import { computeEarningsPerShare } from '../calculators/earnings-per-share';

describe('computeEarningsPerShare', () => {
  it('computes basic and diluted EPS', () => {
    const r = computeEarningsPerShare({ netIncomeMinor: 1000000, preferredDividendsMinor: 50000, weightedAvgShares: 100000, dilutiveOptions: 10000, optionExercisePrice: 5, marketPrice: 10 });
    expect(r.result.basicEpsMinor).toBe(10);
    expect(r.result.dilutedEpsMinor).toBeLessThanOrEqual(r.result.basicEpsMinor);
    expect(r.result.dilutiveSharesAdded).toBeGreaterThan(0);
  });

  it('no dilution when exercise price exceeds market', () => {
    const r = computeEarningsPerShare({ netIncomeMinor: 500000, preferredDividendsMinor: 0, weightedAvgShares: 50000, dilutiveOptions: 5000, optionExercisePrice: 15, marketPrice: 10 });
    expect(r.result.dilutiveSharesAdded).toBe(0);
    expect(r.result.basicEpsMinor).toBe(r.result.dilutedEpsMinor);
  });

  it('throws on zero shares', () => {
    expect(() => computeEarningsPerShare({ netIncomeMinor: 100000, preferredDividendsMinor: 0, weightedAvgShares: 0, dilutiveOptions: 0, optionExercisePrice: 0, marketPrice: 0 })).toThrow();
  });
});
