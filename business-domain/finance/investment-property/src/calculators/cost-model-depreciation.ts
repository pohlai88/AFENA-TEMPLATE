/**
 * IAS 40.56 — Cost Model Depreciation for Investment Property
 *
 * When the cost model is elected, investment property is depreciated
 * per IAS 16 and tested for impairment per IAS 36.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CostModelDepreciationInput = {
  costMinor: number;
  residualValueMinor: number;
  usefulLifeMonths: number;
  elapsedMonths: number;
  accumulatedDepreciationMinor: number;
};

export type CostModelDepreciationResult = {
  periodDepreciationMinor: number;
  newAccumulatedMinor: number;
  carryingAmountMinor: number;
  explanation: string;
};

export function computeCostModelDepreciation(
  inputs: CostModelDepreciationInput,
): CalculatorResult<CostModelDepreciationResult> {
  const { costMinor, residualValueMinor, usefulLifeMonths, elapsedMonths, accumulatedDepreciationMinor } = inputs;

  if (costMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Cost cannot be negative');
  if (usefulLifeMonths <= 0) throw new DomainError('VALIDATION_FAILED', 'Useful life must be positive');

  const depreciableAmount = costMinor - residualValueMinor;
  const periodDepreciationMinor = elapsedMonths >= usefulLifeMonths
    ? 0
    : Math.round(depreciableAmount / usefulLifeMonths);

  const newAccumulatedMinor = Math.min(depreciableAmount, accumulatedDepreciationMinor + periodDepreciationMinor);
  const carryingAmountMinor = costMinor - newAccumulatedMinor;

  const explanation =
    `Cost model depreciation (IAS 40.56): period ${periodDepreciationMinor}, ` +
    `accumulated ${newAccumulatedMinor}, carrying ${carryingAmountMinor}`;

  return {
    result: { periodDepreciationMinor, newAccumulatedMinor, carryingAmountMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
