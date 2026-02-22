/**
 * IAS 19.113-115 — Plan Asset Return
 *
 * Computes the expected and actual return on plan assets,
 * and the remeasurement component recognised in OCI.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type PlanAssetReturnInput = {
  openingPlanAssetsMinor: number;
  contributionsMinor: number;
  benefitsPaidMinor: number;
  discountRate: number;
  actualReturnMinor: number;
};

export type PlanAssetReturnResult = {
  expectedReturnMinor: number;
  actualReturnMinor: number;
  remeasurementMinor: number;
  closingPlanAssetsMinor: number;
  explanation: string;
};

export function computePlanAssetReturn(
  inputs: PlanAssetReturnInput,
): CalculatorResult<PlanAssetReturnResult> {
  const { openingPlanAssetsMinor, contributionsMinor, benefitsPaidMinor, discountRate, actualReturnMinor } = inputs;

  if (openingPlanAssetsMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Opening plan assets cannot be negative');
  if (discountRate < 0 || discountRate > 1) throw new DomainError('VALIDATION_FAILED', 'Discount rate must be between 0 and 1');

  const expectedReturnMinor = Math.round(openingPlanAssetsMinor * discountRate);
  const remeasurementMinor = actualReturnMinor - expectedReturnMinor;
  const closingPlanAssetsMinor = openingPlanAssetsMinor + contributionsMinor - benefitsPaidMinor + actualReturnMinor;

  const explanation =
    `Plan asset return (IAS 19.113): expected ${expectedReturnMinor}, actual ${actualReturnMinor}, ` +
    `remeasurement ${remeasurementMinor} → OCI, closing ${closingPlanAssetsMinor}`;

  return {
    result: { expectedReturnMinor, actualReturnMinor, remeasurementMinor, closingPlanAssetsMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
