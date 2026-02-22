import { describe, expect, it } from 'vitest';
import { computeHedgeDiscontinuation } from '../calculators/hedge-discontinuation';

describe('HA-06 — Hedge Discontinuation', () => {
  it('reclassifies OCI immediately when hedged item no longer exists (cash-flow)', () => {
    const { result } = computeHedgeDiscontinuation({
      hedgeId: 'H-1',
      hedgeType: 'cash-flow',
      reason: 'effectiveness-failure',
      ociReserveMinor: 50_000,
      hedgedItemStillExists: false,
      remainingAmortisationMonths: 12,
    });
    expect(result.ociReclassifiedToPnlMinor).toBe(50_000);
    expect(result.ociRetainedMinor).toBe(0);
    expect(result.amortisationSchedule).toHaveLength(0);
  });

  it('amortises OCI when hedged item still exists (cash-flow)', () => {
    const { result } = computeHedgeDiscontinuation({
      hedgeId: 'H-2',
      hedgeType: 'cash-flow',
      reason: 'voluntary',
      ociReserveMinor: 12_000,
      hedgedItemStillExists: true,
      remainingAmortisationMonths: 6,
    });
    expect(result.ociRetainedMinor).toBe(12_000);
    expect(result.monthlyAmortisationMinor).toBe(2_000);
    expect(result.amortisationSchedule).toHaveLength(6);
    expect(result.amortisationSchedule[5].remainingMinor).toBe(0);
  });

  it('handles fair-value hedge (no OCI)', () => {
    const { result } = computeHedgeDiscontinuation({
      hedgeId: 'H-3',
      hedgeType: 'fair-value',
      reason: 'hedged-item-expired',
      ociReserveMinor: 30_000,
      hedgedItemStillExists: false,
      remainingAmortisationMonths: 0,
    });
    expect(result.ociReclassifiedToPnlMinor).toBe(0);
    expect(result.ociRetainedMinor).toBe(0);
  });

  it('retains OCI for net-investment hedge', () => {
    const { result } = computeHedgeDiscontinuation({
      hedgeId: 'H-4',
      hedgeType: 'net-investment',
      reason: 'voluntary',
      ociReserveMinor: 80_000,
      hedgedItemStillExists: true,
      remainingAmortisationMonths: 0,
    });
    expect(result.ociRetainedMinor).toBe(80_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeHedgeDiscontinuation({
      hedgeId: 'X', hedgeType: 'cash-flow', reason: 'voluntary',
      ociReserveMinor: 0, hedgedItemStillExists: false, remainingAmortisationMonths: 0,
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing hedgeId', () => {
    expect(() => computeHedgeDiscontinuation({
      hedgeId: '', hedgeType: 'cash-flow', reason: 'voluntary',
      ociReserveMinor: 0, hedgedItemStillExists: false, remainingAmortisationMonths: 0,
    })).toThrow('hedgeId is required');
  });
});
