import { describe, expect, it } from 'vitest';

import { calculateAmortisation, capitaliseRnD } from '../calculators/intangible-calc';

describe('IA-09 — Revaluation model (active market required)', () => {
  it('computes straight-line amortisation for finite-life intangible', () => {
    const { result: r } = calculateAmortisation({
      acquisitionCostMinor: 120_000,
      residualValueMinor: 0,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 120,
      method: 'straight-line',
    });
    expect(r.periodAmortisationMinor).toBe(1_000);
    expect(r.newCarryingMinor).toBe(119_000);
  });

  it('computes reducing-balance amortisation', () => {
    const { result: r } = calculateAmortisation({
      acquisitionCostMinor: 120_000,
      residualValueMinor: 0,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 120,
      method: 'reducing-balance',
    });
    expect(r.periodAmortisationMinor).toBeGreaterThan(0);
    expect(r.newCarryingMinor).toBeLessThan(120_000);
  });

  it('caps amortisation at carrying minus residual', () => {
    const { result: r } = calculateAmortisation({
      acquisitionCostMinor: 100_000,
      residualValueMinor: 90_000,
      accumulatedAmortisationMinor: 9_000,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 12,
      method: 'straight-line',
    });
    expect(r.periodAmortisationMinor).toBeLessThanOrEqual(1_000);
  });

  it('capitalises development costs when criteria met', () => {
    const { result: r } = capitaliseRnD({
      phase: 'development',
      costsMinor: 50_000,
      criteriaMet: true,
    });
    expect(r.shouldCapitalise).toBe(true);
    expect(r.capitaliseAmountMinor).toBe(50_000);
  });

  it('expenses research phase costs', () => {
    const { result: r } = capitaliseRnD({
      phase: 'research',
      costsMinor: 30_000,
      criteriaMet: true,
    });
    expect(r.shouldCapitalise).toBe(false);
    expect(r.expenseAmountMinor).toBe(30_000);
  });
});
