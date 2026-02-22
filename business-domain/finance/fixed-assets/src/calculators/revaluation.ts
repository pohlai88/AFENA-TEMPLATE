import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FA-05 — Revaluation model: fair value uplift → OCI reserve
 */
export type RevaluationResult = {
  adjustmentMinor: number;
  isUpward: boolean;
};

export function computeRevaluation(
  currentNbvMinor: number,
  fairValueMinor: number,
): CalculatorResult<RevaluationResult> {
  if (!Number.isInteger(currentNbvMinor)) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `currentNbvMinor must be an integer, got ${currentNbvMinor}`,
    );
  }
  if (!Number.isInteger(fairValueMinor) || fairValueMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `fairValueMinor must be a non-negative integer, got ${fairValueMinor}`,
    );
  }

  const adjustmentMinor = fairValueMinor - currentNbvMinor;
  return {
    result: { adjustmentMinor, isUpward: adjustmentMinor >= 0 },
    inputs: { currentNbvMinor, fairValueMinor },
    explanation: `Asset revaluation: ${adjustmentMinor >= 0 ? 'upward' : 'downward'} adjustment of ${Math.abs(adjustmentMinor)}`,
  };
}
