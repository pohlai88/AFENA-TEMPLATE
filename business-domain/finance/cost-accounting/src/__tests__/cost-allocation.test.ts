import { describe, expect, it } from 'vitest';
import { allocateCost } from '../calculators/cost-allocation';

describe('allocateCost', () => {
  it('proportional split sums to total', () => {
    const result = allocateCost(100_000, [
      { centerId: 'dept-a', weight: 3 },
      { centerId: 'dept-b', weight: 7 },
    ]).result;
    const total = result.reduce((s, r) => s + r.allocatedMinor, 0);
    expect(total).toBe(100_000);
    expect(result[0].allocatedMinor).toBe(30_000);
  });

  it('single center gets full amount', () => {
    const result = allocateCost(50_000, [{ centerId: 'only', weight: 1 }]).result;
    expect(result[0].allocatedMinor).toBe(50_000);
  });

  it('handles rounding remainder', () => {
    const result = allocateCost(100_000, [
      { centerId: 'a', weight: 1 },
      { centerId: 'b', weight: 1 },
      { centerId: 'c', weight: 1 },
    ]).result;
    const total = result.reduce((s, r) => s + r.allocatedMinor, 0);
    expect(total).toBe(100_000);
  });

  it('throws on empty bases', () => {
    expect(() => allocateCost(100_000, [])).toThrow('bases must not be empty');
  });

  it('throws on zero weight', () => {
    expect(() => allocateCost(100_000, [{ centerId: 'x', weight: 0 }])).toThrow('weight must be positive');
  });
});
