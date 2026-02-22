/**
 * IAS 12.24-28 — DTA Recognition Test
 *
 * A deferred tax asset shall be recognised only to the extent that
 * it is probable that future taxable profit will be available against
 * which the deductible temporary difference can be utilised.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type DtaRecognitionTestInput = {
  deductibleDifferencesMinor: number;
  taxRate: number;
  projectedTaxableProfitMinor: number;
  existingTaxableDifferencesMinor: number;
  taxPlanningOpportunitiesMinor: number;
  hasHistoryOfProfits: boolean;
};

export type DtaRecognitionTestResult = {
  potentialDtaMinor: number;
  recognisableDtaMinor: number;
  unrecognisedDtaMinor: number;
  isProbable: boolean;
  explanation: string;
};

export function evaluateDtaRecognition(
  inputs: DtaRecognitionTestInput,
): CalculatorResult<DtaRecognitionTestResult> {
  const {
    deductibleDifferencesMinor, taxRate, projectedTaxableProfitMinor,
    existingTaxableDifferencesMinor, taxPlanningOpportunitiesMinor, hasHistoryOfProfits,
  } = inputs;

  if (taxRate < 0 || taxRate > 1) throw new DomainError('VALIDATION_FAILED', 'Tax rate must be between 0 and 1');

  const potentialDtaMinor = Math.round(deductibleDifferencesMinor * taxRate);

  const availableProfitMinor =
    projectedTaxableProfitMinor + existingTaxableDifferencesMinor + taxPlanningOpportunitiesMinor;

  const isProbable = hasHistoryOfProfits && availableProfitMinor > 0;

  const utilisableMinor = Math.min(deductibleDifferencesMinor, availableProfitMinor);
  const recognisableDtaMinor = isProbable ? Math.round(Math.max(0, utilisableMinor) * taxRate) : 0;
  const unrecognisedDtaMinor = potentialDtaMinor - recognisableDtaMinor;

  const explanation = isProbable
    ? `DTA recognition: ${recognisableDtaMinor} of ${potentialDtaMinor} recognised (probable future profit ${availableProfitMinor}) (IAS 12.24)`
    : `DTA recognition: 0 of ${potentialDtaMinor} recognised — insufficient evidence of probable future profit (IAS 12.24)`;

  return {
    result: { potentialDtaMinor, recognisableDtaMinor, unrecognisedDtaMinor, isProbable, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
