/**
 * IFRS 9.6.5.15 — Cost of Hedging
 *
 * Computes the time value and forward element excluded from the
 * hedge relationship, recognised in OCI and amortised to P&L.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type HedgeCostOfHedgingInput = {
  designationId: string;
  instrumentFvMinor: number;
  intrinsicValueMinor: number;
  priorCostOfHedgingOciMinor: number;
  amortisationMethod: 'straight-line' | 'effective-interest';
  remainingPeriods: number;
};

export type HedgeCostOfHedgingResult = {
  timeValueMinor: number;
  periodAmortisationMinor: number;
  ociBalanceMinor: number;
  explanation: string;
};

export function computeHedgeCostOfHedging(
  inputs: HedgeCostOfHedgingInput,
): CalculatorResult<HedgeCostOfHedgingResult> {
  const { instrumentFvMinor, intrinsicValueMinor, priorCostOfHedgingOciMinor, amortisationMethod, remainingPeriods } = inputs;

  if (remainingPeriods <= 0) throw new DomainError('VALIDATION_FAILED', 'Remaining periods must be positive');

  const timeValueMinor = instrumentFvMinor - intrinsicValueMinor;
  const totalOci = priorCostOfHedgingOciMinor + timeValueMinor;

  const periodAmortisationMinor = amortisationMethod === 'straight-line'
    ? Math.round(totalOci / remainingPeriods)
    : Math.round(totalOci / remainingPeriods);

  const ociBalanceMinor = totalOci - periodAmortisationMinor;

  const explanation =
    `Cost of hedging (IFRS 9.6.5.15): time value ${timeValueMinor} → OCI, ` +
    `amortisation ${periodAmortisationMinor} (${amortisationMethod}), OCI balance ${ociBalanceMinor}`;

  return {
    result: { timeValueMinor, periodAmortisationMinor, ociBalanceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
