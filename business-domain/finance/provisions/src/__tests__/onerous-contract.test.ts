import { describe, expect, it } from 'vitest';
import { evaluateOnerousContract } from '../calculators/onerous-contract';

describe('evaluateOnerousContract', () => {
  it('identifies onerous contract when costs exceed revenue', () => {
    const r = evaluateOnerousContract({ contractId: 'C1', remainingRevenueMinor: 5000, unavoidableCostMinor: 8000, terminationPenaltyMinor: 2000 });
    expect(r.result.isOnerous).toBe(true);
    expect(r.result.recommendation).toBe('terminate');
    expect(r.result.provisionMinor).toBe(2000);
  });

  it('recommends continue when cost-to-continue is less than termination', () => {
    const r = evaluateOnerousContract({ contractId: 'C2', remainingRevenueMinor: 5000, unavoidableCostMinor: 7000, terminationPenaltyMinor: 5000 });
    expect(r.result.isOnerous).toBe(true);
    expect(r.result.recommendation).toBe('continue');
    expect(r.result.provisionMinor).toBe(2000);
  });

  it('returns not onerous when revenue covers costs', () => {
    const r = evaluateOnerousContract({ contractId: 'C3', remainingRevenueMinor: 10000, unavoidableCostMinor: 8000, terminationPenaltyMinor: 3000 });
    expect(r.result.isOnerous).toBe(false);
    expect(r.result.provisionMinor).toBe(0);
  });

  it('throws on negative costs', () => {
    expect(() => evaluateOnerousContract({ contractId: 'C4', remainingRevenueMinor: 1000, unavoidableCostMinor: -1, terminationPenaltyMinor: 500 })).toThrow();
  });
});
