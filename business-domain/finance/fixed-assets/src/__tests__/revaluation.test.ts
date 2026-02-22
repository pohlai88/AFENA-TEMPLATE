import { describe, expect, it } from 'vitest';
import { computeRevaluation } from '../calculators/revaluation';

describe('computeRevaluation', () => {
  it('upward revaluation', () => {
    const r = computeRevaluation(50_000, 70_000).result;
    expect(r.adjustmentMinor).toBe(20_000);
    expect(r.isUpward).toBe(true);
  });

  it('downward revaluation', () => {
    const r = computeRevaluation(70_000, 50_000).result;
    expect(r.adjustmentMinor).toBe(-20_000);
    expect(r.isUpward).toBe(false);
  });

  it('no change', () => {
    const r = computeRevaluation(50_000, 50_000).result;
    expect(r.adjustmentMinor).toBe(0);
    expect(r.isUpward).toBe(true);
  });

  it('throws on negative fair value', () => {
    expect(() => computeRevaluation(50_000, -1)).toThrow('fairValueMinor');
  });
});
