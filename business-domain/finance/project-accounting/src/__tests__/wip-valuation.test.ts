import { describe, expect, it } from 'vitest';
import { computeWipValuation } from '../calculators/wip-valuation';

describe('computeWipValuation', () => {
  it('partial completion', () => {
    const r = computeWipValuation(
      [{ type: 'labor', amountMinor: 30_000 }, { type: 'material', amountMinor: 20_000 }],
      10_000,
      100_000,
    ).result;
    expect(r.totalCostMinor).toBe(50_000);
    expect(r.wipBalanceMinor).toBe(40_000);
    expect(r.costToCompleteMinor).toBe(50_000);
    expect(r.percentComplete).toBe(0.5);
  });

  it('zero costs', () => {
    const r = computeWipValuation([], 0, 100_000).result;
    expect(r.totalCostMinor).toBe(0);
    expect(r.costToCompleteMinor).toBe(100_000);
    expect(r.percentComplete).toBe(0);
  });

  it('caps percent at 100% and costToComplete is 0 when over budget', () => {
    const r = computeWipValuation(
      [{ type: 'labor', amountMinor: 120_000 }],
      0,
      100_000,
    ).result;
    expect(r.percentComplete).toBe(1);
    expect(r.costToCompleteMinor).toBe(0);
  });

  it('throws on negative revenue', () => {
    expect(() => computeWipValuation([], -1, 100_000)).toThrow('revenueRecognizedMinor');
  });

  it('throws on zero budget', () => {
    expect(() => computeWipValuation([], 0, 0)).toThrow('budgetCostMinor');
  });
});
