import { describe, expect, it } from 'vitest';

import { computeCapitalApproachGrant } from '../calculators/capital-approach-grant';
import { evaluateGrantRecognition } from '../calculators/grant-recognition-evaluation';
import { computeGrantRepayment } from '../calculators/grant-repayment';
import { computeIncomeApproachGrant } from '../calculators/income-approach-grant';

describe('evaluateGrantRecognition', () => {
  it('recognises when all criteria met', () => {
    const { result } = evaluateGrantRecognition({
      conditionsMet: true, grantReceived: true,
      grantApproved: true, complianceEvidenceAvailable: true,
    });
    expect(result.shouldRecognise).toBe(true);
  });

  it('defers when conditions not met', () => {
    const { result } = evaluateGrantRecognition({
      conditionsMet: false, grantReceived: true,
      grantApproved: true, complianceEvidenceAvailable: true,
    });
    expect(result.shouldRecognise).toBe(false);
    expect(result.reason).toBe('conditions_not_met');
  });

  it('defers when no compliance evidence', () => {
    const { result } = evaluateGrantRecognition({
      conditionsMet: true, grantReceived: false,
      grantApproved: false, complianceEvidenceAvailable: false,
    });
    expect(result.shouldRecognise).toBe(false);
  });
});

describe('computeCapitalApproachGrant', () => {
  it('amortises grant over asset life', () => {
    const { result } = computeCapitalApproachGrant({
      grantAmountMinor: 120_000, relatedAssetUsefulLifeMonths: 120,
      elapsedMonths: 12, priorAmortisedMinor: 0,
    });
    expect(result.periodAmortisationMinor).toBe(1_000);
    expect(result.deferredIncomeBalanceMinor).toBe(108_000);
  });

  it('throws on zero grant amount', () => {
    expect(() => computeCapitalApproachGrant({
      grantAmountMinor: 0, relatedAssetUsefulLifeMonths: 120,
      elapsedMonths: 0, priorAmortisedMinor: 0,
    })).toThrow('Grant amount must be positive');
  });
});

describe('computeIncomeApproachGrant', () => {
  it('recognises income proportional to costs', () => {
    const { result } = computeIncomeApproachGrant({
      grantAmountMinor: 100_000, relatedCostsThisPeriodMinor: 25_000,
      totalExpectedCostsMinor: 100_000, priorRecognisedMinor: 0,
    });
    expect(result.periodIncomeMinor).toBe(25_000);
    expect(result.deferredBalanceMinor).toBe(75_000);
  });

  it('throws on zero expected costs', () => {
    expect(() => computeIncomeApproachGrant({
      grantAmountMinor: 100_000, relatedCostsThisPeriodMinor: 0,
      totalExpectedCostsMinor: 0, priorRecognisedMinor: 0,
    })).toThrow('Total expected costs must be positive');
  });
});

describe('computeGrantRepayment', () => {
  it('offsets against deferred income first', () => {
    const { result } = computeGrantRepayment({
      grantAmountMinor: 100_000, cumulativeRecognisedMinor: 60_000,
      repaymentAmountMinor: 50_000, deferredIncomeBalanceMinor: 40_000,
    });
    expect(result.offsetAgainstDeferredMinor).toBe(40_000);
    expect(result.expenseToPlMinor).toBe(10_000);
  });

  it('expenses full amount when no deferred balance', () => {
    const { result } = computeGrantRepayment({
      grantAmountMinor: 100_000, cumulativeRecognisedMinor: 100_000,
      repaymentAmountMinor: 30_000, deferredIncomeBalanceMinor: 0,
    });
    expect(result.offsetAgainstDeferredMinor).toBe(0);
    expect(result.expenseToPlMinor).toBe(30_000);
  });
});
