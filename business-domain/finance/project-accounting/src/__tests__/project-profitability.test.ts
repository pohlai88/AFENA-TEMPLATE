import { describe, expect, it } from 'vitest';
import { computeProjectProfitability } from '../calculators/project-profitability';

describe('computeProjectProfitability', () => {
  it('profitable project', () => {
    const r = computeProjectProfitability(100_000, 70_000, 100_000, 80_000).result;
    expect(r.marginMinor).toBe(30_000);
    expect(r.marginPercent).toBe(0.3);
    expect(r.isFavorable).toBe(true);
  });

  it('loss-making project', () => {
    const r = computeProjectProfitability(80_000, 100_000, 100_000, 80_000).result;
    expect(r.marginMinor).toBe(-20_000);
    expect(r.isFavorable).toBe(false);
  });

  it('at budget', () => {
    const r = computeProjectProfitability(100_000, 80_000, 100_000, 80_000).result;
    expect(r.budgetVarianceMinor).toBe(0);
    expect(r.isFavorable).toBe(true);
  });

  it('zero revenue', () => {
    const r = computeProjectProfitability(0, 10_000, 100_000, 80_000).result;
    expect(r.marginPercent).toBe(0);
  });
});
