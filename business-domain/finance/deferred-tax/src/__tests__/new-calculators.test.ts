import { describe, expect, it } from 'vitest';

import { computeDeferredTaxDisclosure } from '../calculators/deferred-tax-disclosure';
import { evaluateDtaRecognition } from '../calculators/dta-recognition-evaluation';
import { computeOffsetDtaDtl } from '../calculators/offset-dta-dtl';
import { computeTaxRateReconciliation } from '../calculators/tax-rate-reconciliation';

describe('evaluateDtaRecognition', () => {
  it('recognises DTA when probable future profit', () => {
    const { result } = evaluateDtaRecognition({
      deductibleDifferencesMinor: 100_000, taxRate: 0.25,
      projectedTaxableProfitMinor: 200_000, existingTaxableDifferencesMinor: 0,
      taxPlanningOpportunitiesMinor: 0, hasHistoryOfProfits: true,
    });
    expect(result.isProbable).toBe(true);
    expect(result.recognisableDtaMinor).toBe(25_000);
    expect(result.unrecognisedDtaMinor).toBe(0);
  });

  it('does not recognise when no history of profits', () => {
    const { result } = evaluateDtaRecognition({
      deductibleDifferencesMinor: 100_000, taxRate: 0.25,
      projectedTaxableProfitMinor: 200_000, existingTaxableDifferencesMinor: 0,
      taxPlanningOpportunitiesMinor: 0, hasHistoryOfProfits: false,
    });
    expect(result.isProbable).toBe(false);
    expect(result.recognisableDtaMinor).toBe(0);
  });

  it('throws on invalid tax rate', () => {
    expect(() => evaluateDtaRecognition({
      deductibleDifferencesMinor: 100_000, taxRate: 1.5,
      projectedTaxableProfitMinor: 0, existingTaxableDifferencesMinor: 0,
      taxPlanningOpportunitiesMinor: 0, hasHistoryOfProfits: true,
    })).toThrow('Tax rate must be between');
  });
});

describe('computeTaxRateReconciliation', () => {
  it('reconciles statutory to effective rate', () => {
    const { result } = computeTaxRateReconciliation({
      profitBeforeTaxMinor: 1_000_000, statutoryRate: 0.25,
      permanentDifferences: [{ description: 'Non-deductible', amountMinor: 50_000 }],
      rateChangeEffect: 0, foreignRateDifferentials: 0,
      otherAdjustments: 0, actualTaxExpenseMinor: 262_500,
    });
    expect(result.statutoryTaxMinor).toBe(250_000);
    expect(result.reconciliationItems.length).toBe(2);
  });

  it('throws on invalid statutory rate', () => {
    expect(() => computeTaxRateReconciliation({
      profitBeforeTaxMinor: 1_000_000, statutoryRate: -0.1,
      permanentDifferences: [], rateChangeEffect: 0,
      foreignRateDifferentials: 0, otherAdjustments: 0, actualTaxExpenseMinor: 0,
    })).toThrow('Statutory rate must be between');
  });
});

describe('computeOffsetDtaDtl', () => {
  it('offsets DTA/DTL within same jurisdiction', () => {
    const { result } = computeOffsetDtaDtl({
      jurisdictions: [{
        jurisdictionId: 'MY', taxAuthorityId: 'LHDN',
        dtaMinor: 30_000, dtlMinor: 50_000, hasLegalRightToOffset: true,
      }],
    });
    expect(result.offsetAmountMinor).toBe(30_000);
    expect(result.netDtlMinor).toBe(20_000);
  });

  it('does not offset without legal right', () => {
    const { result } = computeOffsetDtaDtl({
      jurisdictions: [{
        jurisdictionId: 'MY', taxAuthorityId: 'LHDN',
        dtaMinor: 30_000, dtlMinor: 50_000, hasLegalRightToOffset: false,
      }],
    });
    expect(result.offsetAmountMinor).toBe(0);
  });
});

describe('computeDeferredTaxDisclosure', () => {
  it('computes disclosure totals', () => {
    const { result } = computeDeferredTaxDisclosure({
      currentTaxExpenseMinor: 200_000, deferredTaxMovementMinor: -30_000,
      unrecognisedDtaMinor: 15_000,
      taxLossCarryforwards: [
        { expiryYear: 2027, amountMinor: 50_000 },
        { expiryYear: 2026, amountMinor: 30_000 },
      ],
    });
    expect(result.totalTaxExpenseMinor).toBe(170_000);
    expect(result.lossCarryforwardTotal).toBe(80_000);
    expect(result.expiryAnalysis[0].expiryYear).toBe(2026);
  });
});
