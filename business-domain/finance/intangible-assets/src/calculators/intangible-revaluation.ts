/**
 * IAS 38.75-87 — Intangible Asset Revaluation
 *
 * If an intangible asset is revalued, the carrying amount is adjusted
 * to fair value. Increases go to OCI (revaluation surplus) unless
 * reversing a prior decrease; decreases go to P&L unless reversing
 * a prior increase in OCI.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IntangibleRevaluationInput = {
  assetId: string;
  carryingAmountMinor: number;
  fairValueMinor: number;
  priorRevaluationSurplusMinor: number;
};

export type IntangibleRevaluationResult = {
  revaluationMinor: number;
  toOciMinor: number;
  toPnlMinor: number;
  newCarryingMinor: number;
  newSurplusMinor: number;
  explanation: string;
};

export function computeIntangibleRevaluation(
  inputs: IntangibleRevaluationInput,
): CalculatorResult<IntangibleRevaluationResult> {
  const { carryingAmountMinor, fairValueMinor, priorRevaluationSurplusMinor } = inputs;

  if (carryingAmountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Carrying amount cannot be negative');
  if (fairValueMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Fair value cannot be negative');

  const revaluationMinor = fairValueMinor - carryingAmountMinor;
  let toOciMinor = 0;
  let toPnlMinor = 0;

  if (revaluationMinor > 0) {
    const reversePriorDecrease = Math.min(revaluationMinor, Math.max(0, -priorRevaluationSurplusMinor));
    toPnlMinor = reversePriorDecrease;
    toOciMinor = revaluationMinor - reversePriorDecrease;
  } else if (revaluationMinor < 0) {
    const absDecrease = Math.abs(revaluationMinor);
    const offsetFromSurplus = Math.min(absDecrease, priorRevaluationSurplusMinor);
    toOciMinor = -offsetFromSurplus || 0;
    toPnlMinor = -(absDecrease - offsetFromSurplus);
  }

  const newSurplusMinor = priorRevaluationSurplusMinor + toOciMinor;

  const explanation =
    `Intangible revaluation (IAS 38.75): carrying ${carryingAmountMinor} → FV ${fairValueMinor}, ` +
    `change ${revaluationMinor}, OCI ${toOciMinor}, P&L ${toPnlMinor}, surplus ${newSurplusMinor}`;

  return {
    result: { revaluationMinor, toOciMinor, toPnlMinor, newCarryingMinor: fairValueMinor, newSurplusMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
