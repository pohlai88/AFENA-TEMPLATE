import { describe, expect, it } from 'vitest';

import { estimateVariableConsideration } from '../calculators/variable-consideration';

describe('RR-06 — Variable consideration constraint assessment', () => {
  it('constrains high-reversal-risk component', () => {
    const r = estimateVariableConsideration([
      { componentId: 'VC-1', description: 'Performance bonus', method: 'expected_value', scenarios: [{ amountMinor: 100_000, probabilityPct: 60 }, { amountMinor: 0, probabilityPct: 40 }], reversalRiskPct: 80 },
    ]);
    expect(r.result.estimates[0]!.isConstrained).toBe(true);
    expect(r.result.totalExcludedMinor).toBeGreaterThan(0);
  });

  it('does not constrain low-reversal-risk component', () => {
    const r = estimateVariableConsideration([
      { componentId: 'VC-2', description: 'Volume rebate', method: 'most_likely', scenarios: [{ amountMinor: 50_000, probabilityPct: 90 }, { amountMinor: 0, probabilityPct: 10 }], reversalRiskPct: 20 },
    ]);
    expect(r.result.estimates[0]!.isConstrained).toBe(false);
  });

  it('computes totals across multiple components', () => {
    const r = estimateVariableConsideration([
      { componentId: 'VC-1', description: 'Bonus', method: 'expected_value', scenarios: [{ amountMinor: 100_000, probabilityPct: 50 }, { amountMinor: 0, probabilityPct: 50 }], reversalRiskPct: 80 },
      { componentId: 'VC-2', description: 'Rebate', method: 'most_likely', scenarios: [{ amountMinor: 30_000, probabilityPct: 90 }, { amountMinor: 0, probabilityPct: 10 }], reversalRiskPct: 10 },
    ]);
    expect(r.result.estimates).toHaveLength(2);
    expect(r.result.totalConstrainedMinor).toBeLessThanOrEqual(r.result.totalUnconstrainedMinor);
  });

  it('uses expected value method correctly', () => {
    const r = estimateVariableConsideration([
      { componentId: 'VC-1', description: 'Test', method: 'expected_value', scenarios: [{ amountMinor: 100_000, probabilityPct: 70 }, { amountMinor: 50_000, probabilityPct: 30 }], reversalRiskPct: 10 },
    ]);
    expect(r.result.estimates[0]!.unconstrained).toBe(85_000);
  });

  it('throws on empty components', () => {
    expect(() => estimateVariableConsideration([])).toThrow();
  });
});
