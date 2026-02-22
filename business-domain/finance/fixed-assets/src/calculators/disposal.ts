import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FA-07 — Disposal: gain/loss = proceeds − NBV
 */
export type DisposalResult = {
  gainLossMinor: number;
  isGain: boolean;
};

export function computeDisposalGainLoss(
  netBookValueMinor: number,
  proceedsMinor: number,
): CalculatorResult<DisposalResult> {
  if (!Number.isInteger(netBookValueMinor)) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `netBookValueMinor must be an integer, got ${netBookValueMinor}`,
    );
  }
  if (!Number.isInteger(proceedsMinor) || proceedsMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `proceedsMinor must be a non-negative integer, got ${proceedsMinor}`,
    );
  }

  const gainLossMinor = proceedsMinor - netBookValueMinor;
  return {
    result: { gainLossMinor, isGain: gainLossMinor >= 0 },
    inputs: { netBookValueMinor, proceedsMinor },
    explanation: `Asset disposal: ${gainLossMinor >= 0 ? 'gain' : 'loss'} of ${Math.abs(gainLossMinor)} minor units`,
  };
}
