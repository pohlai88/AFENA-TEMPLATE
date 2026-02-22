import { describe, expect, it } from 'vitest';

import { recogniseProvision } from '../calculators/provision-calc';

describe('PR-06 — Contingent liability disclosure (not recognized)', () => {
  it('does not recognise when outflow is not probable', () => {
    const { result: r } = recogniseProvision({
      isProbable: false,
      canEstimate: true,
      bestEstimateMinor: 50_000,
    });
    expect(r.shouldRecognise).toBe(false);
    expect(r.explanation).toContain('contingent liability');
  });

  it('does not recognise when estimate is unreliable', () => {
    const { result: r } = recogniseProvision({
      isProbable: true,
      canEstimate: false,
      bestEstimateMinor: 50_000,
    });
    expect(r.shouldRecognise).toBe(false);
    expect(r.explanation).toContain('contingent liability');
  });

  it('recognises when both probable and estimable', () => {
    const { result: r } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 100_000,
    });
    expect(r.shouldRecognise).toBe(true);
    expect(r.bestEstimateMinor).toBe(100_000);
  });

  it('computes present value when discount rate provided', () => {
    const { result: r } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 100_000,
      discountRate: 0.05,
      periodsToSettlement: 2,
    });
    expect(r.shouldRecognise).toBe(true);
    expect(r.presentValueMinor).toBeLessThan(100_000);
    expect(r.presentValueMinor).toBeGreaterThan(0);
  });

  it('returns null present value when no discount rate', () => {
    const { result: r } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 100_000,
    });
    expect(r.presentValueMinor).toBeNull();
  });
});
