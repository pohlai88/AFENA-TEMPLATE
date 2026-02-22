import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ReforecastMethod = 'run_rate' | 'trend' | 'manual_override';

export type ReforecastResult = {
  projectedAnnualMinor: number;
  adjustmentMinor: number;
  confidence: 'high' | 'medium' | 'low';
};

export function reforecast(
  ytdActualMinor: number,
  ytdBudgetMinor: number,
  elapsedPeriods: number,
  totalPeriods: number,
  method: ReforecastMethod,
): CalculatorResult<ReforecastResult> {
  if (!Number.isInteger(ytdActualMinor))
    throw new DomainError('VALIDATION_FAILED', 'ytdActualMinor must be integer');
  if (!Number.isInteger(ytdBudgetMinor))
    throw new DomainError('VALIDATION_FAILED', 'ytdBudgetMinor must be integer');
  if (!Number.isInteger(elapsedPeriods) || elapsedPeriods <= 0)
    throw new DomainError('VALIDATION_FAILED', 'elapsedPeriods must be positive integer');
  if (!Number.isInteger(totalPeriods) || totalPeriods <= 0)
    throw new DomainError('VALIDATION_FAILED', 'totalPeriods must be positive integer');

  const remainingPeriods = totalPeriods - elapsedPeriods;

  let projectedAnnualMinor: number;

  if (method === 'run_rate') {
    const avgPerPeriod = Math.round(ytdActualMinor / elapsedPeriods);
    projectedAnnualMinor = ytdActualMinor + avgPerPeriod * remainingPeriods;
  } else {
    projectedAnnualMinor =
      ytdActualMinor + Math.round((ytdBudgetMinor / totalPeriods) * remainingPeriods);
  }

  const adjustmentMinor = projectedAnnualMinor - ytdBudgetMinor;
  const deviationPct = ytdBudgetMinor === 0 ? 1 : Math.abs(adjustmentMinor / ytdBudgetMinor);

  let confidence: 'high' | 'medium' | 'low';
  if (deviationPct <= 0.05) confidence = 'high';
  else if (deviationPct <= 0.15) confidence = 'medium';
  else confidence = 'low';

  return {
    result: { projectedAnnualMinor, adjustmentMinor, confidence },
    inputs: { ytdActualMinor, ytdBudgetMinor, elapsedPeriods, totalPeriods, method },
    explanation: `Reforecast (${method}): projected ${projectedAnnualMinor}, adjustment ${adjustmentMinor}, confidence ${confidence}`,
  };
}
