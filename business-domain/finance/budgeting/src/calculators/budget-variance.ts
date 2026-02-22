import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see BU-05 — Budget vs actual variance report
 */
export type BudgetVarianceResult = {
  varianceMinor: number;
  variancePercent: number;
  status: 'under' | 'on_target' | 'over';
};

export function computeBudgetVariance(
  budgetMinor: number,
  actualMinor: number,
  onTargetThreshold = 0.05,
): CalculatorResult<BudgetVarianceResult> {
  if (!Number.isInteger(budgetMinor))
    throw new DomainError('VALIDATION_FAILED', `budgetMinor must be integer, got ${budgetMinor}`);
  if (!Number.isInteger(actualMinor))
    throw new DomainError('VALIDATION_FAILED', `actualMinor must be integer, got ${actualMinor}`);

  const varianceMinor = budgetMinor - actualMinor;
  const variancePercent =
    budgetMinor === 0 ? 0 : Math.round((varianceMinor / budgetMinor) * 10000) / 10000;

  let status: 'under' | 'on_target' | 'over';
  if (Math.abs(variancePercent) <= onTargetThreshold) {
    status = 'on_target';
  } else if (varianceMinor > 0) {
    status = 'under';
  } else {
    status = 'over';
  }

  return {
    result: { varianceMinor, variancePercent, status },
    inputs: { budgetMinor, actualMinor, onTargetThreshold },
    explanation: `Budget variance: ${status} (${(variancePercent * 100).toFixed(2)}%, ${varianceMinor} minor units)`,
  };
}
