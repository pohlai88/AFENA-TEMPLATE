import { describe, expect, it } from 'vitest';
import { computeFxExposure } from '../calculators/fx-exposure';

describe('computeFxExposure', () => {
  it('computes net open positions', () => {
    const r = computeFxExposure([
      { currency: 'EUR', receivablesMinor: 10000, payablesMinor: 3000, cashMinor: 2000, hedgedMinor: 5000 },
      { currency: 'GBP', receivablesMinor: 5000, payablesMinor: 8000, cashMinor: 1000, hedgedMinor: 0 },
    ]);
    expect(r.result.currencyCount).toBe(2);
    expect(r.result.positions[0]!.netOpenMinor).toBe(9000);
    expect(r.result.positions[0]!.unhedgedMinor).toBe(4000);
  });

  it('identifies largest exposure', () => {
    const r = computeFxExposure([
      { currency: 'EUR', receivablesMinor: 100000, payablesMinor: 0, cashMinor: 0, hedgedMinor: 0 },
      { currency: 'GBP', receivablesMinor: 1000, payablesMinor: 0, cashMinor: 0, hedgedMinor: 0 },
    ]);
    expect(r.result.largestExposureCurrency).toBe('EUR');
  });

  it('throws on empty positions', () => {
    expect(() => computeFxExposure([])).toThrow('at least one');
  });
});
