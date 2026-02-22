/**
 * IFRS 2.30 — Cash-Settled Remeasurement
 *
 * Cash-settled share-based payments are remeasured to fair value
 * at each reporting date until settlement, with changes in P&L.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CashSettledRemeasureInput = {
  grantId: string;
  instrumentsOutstanding: number;
  prevFvPerUnitMinor: number;
  currFvPerUnitMinor: number;
  vestedRatio: number;
};

export type CashSettledRemeasureResult = {
  prevLiabilityMinor: number;
  currLiabilityMinor: number;
  remeasurementMinor: number;
  explanation: string;
};

export function computeCashSettledRemeasure(
  inputs: CashSettledRemeasureInput,
): CalculatorResult<CashSettledRemeasureResult> {
  const { instrumentsOutstanding, prevFvPerUnitMinor, currFvPerUnitMinor, vestedRatio } = inputs;

  if (instrumentsOutstanding <= 0) throw new DomainError('VALIDATION_FAILED', 'Instruments outstanding must be positive');
  if (vestedRatio < 0 || vestedRatio > 1) throw new DomainError('VALIDATION_FAILED', 'Vested ratio must be between 0 and 1');

  const prevLiabilityMinor = Math.round(instrumentsOutstanding * prevFvPerUnitMinor * vestedRatio);
  const currLiabilityMinor = Math.round(instrumentsOutstanding * currFvPerUnitMinor * vestedRatio);
  const remeasurementMinor = currLiabilityMinor - prevLiabilityMinor;

  const explanation =
    `Cash-settled remeasurement (IFRS 2.30): liability ${prevLiabilityMinor} → ${currLiabilityMinor}, ` +
    `P&L impact ${remeasurementMinor} (${instrumentsOutstanding} units × ${currFvPerUnitMinor}/unit × ${(vestedRatio * 100).toFixed(0)}% vested)`;

  return {
    result: { prevLiabilityMinor, currLiabilityMinor, remeasurementMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
