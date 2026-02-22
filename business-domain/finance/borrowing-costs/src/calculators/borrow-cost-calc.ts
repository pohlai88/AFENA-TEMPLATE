/**
 * IAS 23 Borrowing Cost Calculators
 *
 * Pure deterministic functions — no I/O.
 */

import type { CalculatorResult } from 'afenda-canon';

export type CapitalisationResult = {
  /** Amount eligible for capitalisation in this period */
  capitalisableMinor: number;
  /** Cap: cannot exceed actual borrowing costs incurred */
  actualCostMinor: number;
  /** The capitalisation rate applied */
  effectiveRate: number;
  explanation: string;
};

export type CessationTestResult = {
  shouldCease: boolean;
  reason: string;
};

/**
 * IAS 23.12–14 — Compute borrowing costs eligible for capitalisation.
 *
 * For specific borrowings: actual cost less any investment income.
 * For general borrowings: capitalisation rate × expenditure.
 * Cap: cannot exceed actual borrowing costs incurred in the period.
 */
export function computeCapitalisableAmount(inputs: {
  borrowingCostMinor: number;
  capitalisationRate: number;
  eligibleExpenditureMinor: number;
}): CalculatorResult<CapitalisationResult> {
  const { borrowingCostMinor, capitalisationRate, eligibleExpenditureMinor } = inputs;
  const computed = Math.round(eligibleExpenditureMinor * capitalisationRate);
  const capitalisableMinor = Math.min(computed, borrowingCostMinor);

  const explanation = `Expenditure ${eligibleExpenditureMinor} × rate ${(capitalisationRate * 100).toFixed(2)}% = ${computed}; capped at actual ${borrowingCostMinor} → capitalise ${capitalisableMinor} (IAS 23.14)`;
  return {
    result: {
      capitalisableMinor,
      actualCostMinor: borrowingCostMinor,
      effectiveRate: capitalisationRate,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}

/**
 * IAS 23.22–25 — Test whether capitalisation should cease.
 *
 * Cease when:
 * - Asset is substantially complete, OR
 * - Active development suspended for extended period.
 */
export function testCessation(inputs: {
  isSubstantiallyComplete: boolean;
  isDevelopmentSuspended: boolean;
}): CalculatorResult<CessationTestResult> {
  if (inputs.isSubstantiallyComplete) {
    const explanation = 'Asset substantially complete (IAS 23.22)';
    return {
      result: { shouldCease: true, reason: explanation },
      inputs: { ...inputs },
      explanation,
    };
  }
  if (inputs.isDevelopmentSuspended) {
    const explanation = 'Active development suspended for extended period (IAS 23.20)';
    return {
      result: { shouldCease: true, reason: explanation },
      inputs: { ...inputs },
      explanation,
    };
  }
  const explanation = 'Capitalisation continues — qualifying conditions met';
  return {
    result: { shouldCease: false, reason: explanation },
    inputs: { ...inputs },
    explanation,
  };
}
