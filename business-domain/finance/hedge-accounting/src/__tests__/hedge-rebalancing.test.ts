import { describe, expect, it } from 'vitest';
import { evaluateHedgeRebalancing } from '../calculators/hedge-rebalancing';

describe('evaluateHedgeRebalancing', () => {
  it('flags rebalancing when drift exceeds tolerance', () => {
    const r = evaluateHedgeRebalancing({ hedgeId: 'H1', designatedRatio: 1.0, currentRatio: 1.15, hedgedItemFvMinor: 100000, hedgingInstrumentFvMinor: 115000, tolerancePct: 10 });
    expect(r.result.needsRebalancing).toBe(true);
    expect(r.result.adjustmentMinor).not.toBe(0);
  });

  it('returns OK when within tolerance', () => {
    const r = evaluateHedgeRebalancing({ hedgeId: 'H2', designatedRatio: 1.0, currentRatio: 1.05, hedgedItemFvMinor: 100000, hedgingInstrumentFvMinor: 105000, tolerancePct: 10 });
    expect(r.result.needsRebalancing).toBe(false);
    expect(r.result.adjustmentMinor).toBe(0);
  });

  it('throws on non-positive designated ratio', () => {
    expect(() => evaluateHedgeRebalancing({ hedgeId: 'H3', designatedRatio: 0, currentRatio: 1.0, hedgedItemFvMinor: 100000, hedgingInstrumentFvMinor: 100000, tolerancePct: 10 })).toThrow();
  });
});
