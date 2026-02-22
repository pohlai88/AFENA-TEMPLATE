import { describe, expect, it } from 'vitest';
import { computeVariance } from '../calculators/variance-analysis';

describe('computeVariance', () => {
  it('favorable when actual < standard', () => {
    const r = computeVariance(100_000, 90_000).result;
    expect(r.varianceMinor).toBe(10_000);
    expect(r.isFavorable).toBe(true);
  });

  it('unfavorable when actual > standard', () => {
    const r = computeVariance(100_000, 110_000).result;
    expect(r.varianceMinor).toBe(-10_000);
    expect(r.isFavorable).toBe(false);
  });

  it('zero variance', () => {
    const r = computeVariance(50_000, 50_000).result;
    expect(r.varianceMinor).toBe(0);
    expect(r.isFavorable).toBe(true);
    expect(r.variancePercent).toBe(0);
  });

  it('handles zero standard', () => {
    const r = computeVariance(0, 10_000).result;
    expect(r.variancePercent).toBe(0);
  });
});
