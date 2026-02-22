import { describe, expect, it } from 'vitest';

import { computePercentageOfCompletion } from '../calculators/percentage-of-completion';

describe('PA-04 — Percentage-of-completion revenue recognition', () => {
  it('computes 50% completion correctly', () => {
    const r = computePercentageOfCompletion(1_000_000, 250_000, 500_000);
    expect(r.result.percentComplete).toBe(0.5);
    expect(r.result.cumulativeRecognizedMinor).toBe(500_000);
    expect(r.result.currentPeriodRevenueMinor).toBe(500_000);
  });

  it('computes current period revenue with prior recognition', () => {
    const r = computePercentageOfCompletion(1_000_000, 400_000, 500_000, 500_000);
    expect(r.result.percentComplete).toBe(0.8);
    expect(r.result.cumulativeRecognizedMinor).toBe(800_000);
    expect(r.result.currentPeriodRevenueMinor).toBe(300_000);
  });

  it('returns zero period revenue at 0% completion', () => {
    const r = computePercentageOfCompletion(1_000_000, 0, 500_000);
    expect(r.result.percentComplete).toBe(0);
    expect(r.result.cumulativeRecognizedMinor).toBe(0);
    expect(r.result.currentPeriodRevenueMinor).toBe(0);
  });

  it('returns full revenue at 100% completion', () => {
    const r = computePercentageOfCompletion(1_000_000, 500_000, 500_000);
    expect(r.result.percentComplete).toBe(1);
    expect(r.result.cumulativeRecognizedMinor).toBe(1_000_000);
  });

  it('computes estimated margin', () => {
    const r = computePercentageOfCompletion(1_000_000, 250_000, 800_000);
    expect(r.result.estimatedMarginMinor).toBe(200_000);
  });

  it('throws on non-integer totalContractMinor', () => {
    expect(() => computePercentageOfCompletion(100.5, 50, 100)).toThrow('totalContractMinor');
  });

  it('throws when costIncurred exceeds estimatedTotalCost', () => {
    expect(() => computePercentageOfCompletion(1_000_000, 600_000, 500_000)).toThrow('cannot exceed');
  });

  it('includes explanation string', () => {
    const r = computePercentageOfCompletion(1_000_000, 250_000, 500_000);
    expect(r.explanation).toContain('POC');
    expect(r.explanation).toContain('50.0%');
  });
});
