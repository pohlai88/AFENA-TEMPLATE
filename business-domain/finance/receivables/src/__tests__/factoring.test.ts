import { describe, expect, it } from 'vitest';
import { evaluateFactoring } from '../calculators/factoring';

describe('evaluateFactoring', () => {
  it('qualifies for full derecognition when retained risk < 10%', () => {
    const { result } = evaluateFactoring({
      receivableId: 'rec-1', grossAmountMinor: 1000000, factoringAdvanceRate: 0.9,
      factoringFeeRate: 0.02, recoursePercentage: 0, latePaymentRiskPct: 5, creditRiskRetainedPct: 5,
    });
    expect(result.qualifiesForDerecognition).toBe(true);
    expect(result.derecognitionBasis).toBe('full');
    expect(result.continuingInvolvementMinor).toBe(0);
  });

  it('does not derecognise when retained risk > 90%', () => {
    const { result } = evaluateFactoring({
      receivableId: 'rec-2', grossAmountMinor: 500000, factoringAdvanceRate: 0.8,
      factoringFeeRate: 0.03, recoursePercentage: 100, latePaymentRiskPct: 90, creditRiskRetainedPct: 90,
    });
    expect(result.qualifiesForDerecognition).toBe(false);
    expect(result.derecognitionBasis).toBe('none');
  });

  it('uses continuing involvement when 10-90% retained', () => {
    const { result } = evaluateFactoring({
      receivableId: 'rec-3', grossAmountMinor: 1000000, factoringAdvanceRate: 0.85,
      factoringFeeRate: 0.02, recoursePercentage: 50, latePaymentRiskPct: 30, creditRiskRetainedPct: 20,
    });
    expect(result.derecognitionBasis).toBe('continuing-involvement');
    expect(result.continuingInvolvementMinor).toBeGreaterThan(0);
  });

  it('computes advance and fee correctly', () => {
    const { result } = evaluateFactoring({
      receivableId: 'rec-4', grossAmountMinor: 1000000, factoringAdvanceRate: 0.9,
      factoringFeeRate: 0.02, recoursePercentage: 0, latePaymentRiskPct: 0, creditRiskRetainedPct: 0,
    });
    expect(result.advanceMinor).toBe(900000);
    expect(result.feeMinor).toBe(20000);
    expect(result.netProceedsMinor).toBe(880000);
  });

  it('throws for zero gross amount', () => {
    expect(() => evaluateFactoring({
      receivableId: 'x', grossAmountMinor: 0, factoringAdvanceRate: 0.9,
      factoringFeeRate: 0.02, recoursePercentage: 0, latePaymentRiskPct: 0, creditRiskRetainedPct: 0,
    })).toThrow('positive');
  });

  it('throws for invalid advance rate', () => {
    expect(() => evaluateFactoring({
      receivableId: 'x', grossAmountMinor: 100, factoringAdvanceRate: 1.5,
      factoringFeeRate: 0.02, recoursePercentage: 0, latePaymentRiskPct: 0, creditRiskRetainedPct: 0,
    })).toThrow('between 0 and 1');
  });
});
