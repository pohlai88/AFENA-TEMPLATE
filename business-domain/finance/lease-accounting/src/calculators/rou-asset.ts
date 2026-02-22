import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type RouAssetResult = {
  initialValueMinor: number;
  depreciationPerPeriodMinor: number;
};

export function computeRouAsset(
  liabilityMinor: number,
  initialDirectCostsMinor: number,
  incentivesMinor: number,
  leasePeriods: number,
): CalculatorResult<RouAssetResult> {
  if (!Number.isInteger(liabilityMinor) || liabilityMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `liabilityMinor must be a non-negative integer, got ${liabilityMinor}`,
    );
  }
  if (!Number.isInteger(initialDirectCostsMinor) || initialDirectCostsMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `initialDirectCostsMinor must be a non-negative integer, got ${initialDirectCostsMinor}`,
    );
  }
  if (!Number.isInteger(incentivesMinor) || incentivesMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `incentivesMinor must be a non-negative integer, got ${incentivesMinor}`,
    );
  }
  if (!Number.isInteger(leasePeriods) || leasePeriods <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `leasePeriods must be a positive integer, got ${leasePeriods}`,
    );
  }

  const initialValueMinor = liabilityMinor + initialDirectCostsMinor - incentivesMinor;
  const depreciationPerPeriodMinor = Math.round(initialValueMinor / leasePeriods);

  return {
    result: { initialValueMinor, depreciationPerPeriodMinor },
    inputs: { liabilityMinor, initialDirectCostsMinor, incentivesMinor, leasePeriods },
    explanation: `ROU asset initial=${initialValueMinor}, depreciation/period=${depreciationPerPeriodMinor} over ${leasePeriods} periods`,
  };
}
