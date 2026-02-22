import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type VarianceResult = {
  varianceMinor: number;
  variancePercent: number;
  isFavorable: boolean;
};

export function computeVariance(
  standardMinor: number,
  actualMinor: number,
): CalculatorResult<VarianceResult> {
  if (!Number.isInteger(standardMinor))
    throw new DomainError(
      'VALIDATION_FAILED',
      `standardMinor must be integer, got ${standardMinor}`,
    );
  if (!Number.isInteger(actualMinor))
    throw new DomainError('VALIDATION_FAILED', `actualMinor must be integer, got ${actualMinor}`);

  const varianceMinor = standardMinor - actualMinor;
  const variancePercent =
    standardMinor === 0 ? 0 : Math.round((varianceMinor / standardMinor) * 10000) / 10000;
  return {
    result: { varianceMinor, variancePercent, isFavorable: varianceMinor >= 0 },
    inputs: { standardMinor, actualMinor },
    explanation: `Cost variance: ${varianceMinor >= 0 ? 'favorable' : 'unfavorable'} ${varianceMinor} (${(variancePercent * 100).toFixed(2)}%)`,
  };
}
