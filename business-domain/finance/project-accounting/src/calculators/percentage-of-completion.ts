import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see PA-04 — Percentage-of-completion revenue recognition
 *
 * IAS 11 / IFRS 15 §35(c): recognise revenue over time using the
 * input method (cost-to-cost). Computes cumulative recognised revenue
 * based on the ratio of costs incurred to estimated total costs.
 *
 * Pure function — no I/O.
 */

export type PercentageOfCompletionResult = {
  percentComplete: number;
  cumulativeRecognizedMinor: number;
  currentPeriodRevenueMinor: number;
  estimatedMarginMinor: number;
};

export function computePercentageOfCompletion(
  totalContractMinor: number,
  costIncurredMinor: number,
  estimatedTotalCostMinor: number,
  previouslyRecognizedMinor = 0,
): CalculatorResult<PercentageOfCompletionResult> {
  if (!Number.isInteger(totalContractMinor) || totalContractMinor <= 0)
    throw new DomainError('VALIDATION_FAILED', 'totalContractMinor must be a positive integer');
  if (!Number.isInteger(costIncurredMinor) || costIncurredMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'costIncurredMinor must be a non-negative integer');
  if (!Number.isInteger(estimatedTotalCostMinor) || estimatedTotalCostMinor <= 0)
    throw new DomainError('VALIDATION_FAILED', 'estimatedTotalCostMinor must be a positive integer');
  if (!Number.isInteger(previouslyRecognizedMinor) || previouslyRecognizedMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'previouslyRecognizedMinor must be a non-negative integer');
  if (costIncurredMinor > estimatedTotalCostMinor)
    throw new DomainError('VALIDATION_FAILED', 'costIncurredMinor cannot exceed estimatedTotalCostMinor');

  const percentComplete = Math.round((costIncurredMinor / estimatedTotalCostMinor) * 10000) / 10000;
  const cumulativeRecognizedMinor = Math.round(totalContractMinor * percentComplete);
  const currentPeriodRevenueMinor = cumulativeRecognizedMinor - previouslyRecognizedMinor;
  const estimatedMarginMinor = totalContractMinor - estimatedTotalCostMinor;

  return {
    result: {
      percentComplete,
      cumulativeRecognizedMinor,
      currentPeriodRevenueMinor,
      estimatedMarginMinor,
    },
    inputs: { totalContractMinor, costIncurredMinor, estimatedTotalCostMinor, previouslyRecognizedMinor },
    explanation: `POC ${(percentComplete * 100).toFixed(1)}%: cumulative revenue=${cumulativeRecognizedMinor}, period=${currentPeriodRevenueMinor}`,
  };
}
