import { describe, expect, it } from 'vitest';
import { computeStandardCost } from '../calculators/standard-cost';

describe('computeStandardCost', () => {
  it('sums all components', () => {
    expect(
      computeStandardCost([
        { type: 'material', amountMinor: 30_000 },
        { type: 'labor', amountMinor: 20_000 },
        { type: 'overhead', amountMinor: 10_000 },
      ]).result,
    ).toBe(60_000);
  });

  it('returns 0 for empty components', () => {
    expect(computeStandardCost([]).result).toBe(0);
  });

  it('throws on negative amount', () => {
    expect(() => computeStandardCost([{ type: 'material', amountMinor: -1 }])).toThrow(
      'amountMinor',
    );
  });
});
