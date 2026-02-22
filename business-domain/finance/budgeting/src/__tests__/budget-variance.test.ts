import { describe, expect, it } from 'vitest';
import { computeBudgetVariance } from '../calculators/budget-variance';

describe('computeBudgetVariance', () => {
  it('under budget', () => {
    const r = computeBudgetVariance(100_000, 80_000).result;
    expect(r.varianceMinor).toBe(20_000);
    expect(r.status).toBe('under');
  });

  it('over budget', () => {
    const r = computeBudgetVariance(100_000, 120_000).result;
    expect(r.varianceMinor).toBe(-20_000);
    expect(r.status).toBe('over');
  });

  it('on target within threshold', () => {
    const r = computeBudgetVariance(100_000, 97_000).result;
    expect(r.status).toBe('on_target');
  });

  it('zero budget', () => {
    const r = computeBudgetVariance(0, 0).result;
    expect(r.varianceMinor).toBe(0);
    expect(r.variancePercent).toBe(0);
    expect(r.status).toBe('on_target');
  });

  it('custom threshold', () => {
    const r = computeBudgetVariance(100_000, 92_000, 0.10).result;
    expect(r.status).toBe('on_target');
  });
});
