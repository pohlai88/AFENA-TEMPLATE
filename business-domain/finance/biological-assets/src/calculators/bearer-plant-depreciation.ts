/**
 * IAS 41.22 / IAS 16 — Bearer Plant Depreciation
 *
 * Bearer plants (e.g., fruit trees, vines) are measured under IAS 16
 * after maturity. This calculator computes periodic depreciation.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BearerPlantDepreciationInput = {
  costMinor: number;
  residualValueMinor: number;
  usefulLifeMonths: number;
  elapsedMonths: number;
  method: 'straight-line' | 'units-of-production';
  /** Only for units-of-production */
  totalExpectedUnits?: number;
  unitsProducedThisPeriod?: number;
};

export type BearerPlantDepreciationResult = {
  depreciationMinor: number;
  accumulatedMinor: number;
  carryingAmountMinor: number;
  explanation: string;
};

export function computeBearerPlantDepreciation(
  inputs: BearerPlantDepreciationInput,
): CalculatorResult<BearerPlantDepreciationResult> {
  const { costMinor, residualValueMinor, usefulLifeMonths, elapsedMonths, method } = inputs;

  if (costMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Cost cannot be negative');
  if (residualValueMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Residual value cannot be negative');
  if (usefulLifeMonths <= 0) throw new DomainError('VALIDATION_FAILED', 'Useful life must be positive');

  const depreciableAmount = costMinor - residualValueMinor;
  let depreciationMinor: number;

  if (method === 'straight-line') {
    depreciationMinor = Math.round(depreciableAmount / usefulLifeMonths);
  } else {
    if (!inputs.totalExpectedUnits || inputs.totalExpectedUnits <= 0) {
      throw new DomainError('VALIDATION_FAILED', 'totalExpectedUnits required for units-of-production');
    }
    const unitsProduced = inputs.unitsProducedThisPeriod ?? 0;
    depreciationMinor = Math.round((depreciableAmount * unitsProduced) / inputs.totalExpectedUnits);
  }

  const accumulatedMinor = Math.min(
    depreciableAmount,
    Math.round((depreciableAmount * Math.min(elapsedMonths, usefulLifeMonths)) / usefulLifeMonths),
  );
  const carryingAmountMinor = costMinor - accumulatedMinor;

  const explanation = `Bearer plant depreciation (${method}): ${depreciationMinor} this period, carrying ${carryingAmountMinor}`;
  return {
    result: { depreciationMinor, accumulatedMinor, carryingAmountMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
