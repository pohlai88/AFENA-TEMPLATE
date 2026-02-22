import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FA-06 — Impairment testing: recoverable amount vs carrying amount (IAS 36)
 *
 * Compares carrying amount to recoverable amount (higher of fair value
 * less costs of disposal and value in use). If carrying > recoverable,
 * an impairment loss is recognised.
 *
 * Pure function — no I/O.
 */

export type ImpairmentResult = {
  isImpaired: boolean;
  impairmentLossMinor: number;
  recoverableAmountMinor: number;
  carryingAmountMinor: number;
  cguId: string | null;
};

export function computeImpairment(
  carryingAmountMinor: number,
  fairValueLessCostsMinor: number,
  valueInUseMinor: number,
  cguId: string | null = null,
): CalculatorResult<ImpairmentResult> {
  if (!Number.isInteger(carryingAmountMinor) || carryingAmountMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'carryingAmountMinor must be a non-negative integer');
  if (!Number.isInteger(fairValueLessCostsMinor) || fairValueLessCostsMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'fairValueLessCostsMinor must be a non-negative integer');
  if (!Number.isInteger(valueInUseMinor) || valueInUseMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'valueInUseMinor must be a non-negative integer');

  const recoverableAmountMinor = Math.max(fairValueLessCostsMinor, valueInUseMinor);
  const isImpaired = carryingAmountMinor > recoverableAmountMinor;
  const impairmentLossMinor = isImpaired ? carryingAmountMinor - recoverableAmountMinor : 0;

  return {
    result: {
      isImpaired,
      impairmentLossMinor,
      recoverableAmountMinor,
      carryingAmountMinor,
      cguId,
    },
    inputs: { carryingAmountMinor, fairValueLessCostsMinor, valueInUseMinor, cguId },
    explanation: isImpaired
      ? `Impaired: carrying ${carryingAmountMinor} > recoverable ${recoverableAmountMinor}, loss=${impairmentLossMinor}`
      : `No impairment: carrying ${carryingAmountMinor} ≤ recoverable ${recoverableAmountMinor}`,
  };
}
