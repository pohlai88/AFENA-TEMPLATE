/**
 * IAS 37.59/77 — Provision Reversal
 *
 * A provision shall be reversed when it is no longer probable that
 * an outflow of resources will be required to settle the obligation.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ProvisionReversalInput = {
  provisionBalanceMinor: number;
  reversalAmountMinor: number;
  reason: 'obligation_settled' | 'probability_reduced' | 'estimate_revised';
};

export type ProvisionReversalResult = {
  reversedMinor: number;
  remainingBalanceMinor: number;
  isFullReversal: boolean;
  explanation: string;
};

export function computeProvisionReversal(
  inputs: ProvisionReversalInput,
): CalculatorResult<ProvisionReversalResult> {
  const { provisionBalanceMinor, reversalAmountMinor, reason } = inputs;

  if (provisionBalanceMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Provision balance cannot be negative');
  if (reversalAmountMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Reversal amount must be positive');
  if (reversalAmountMinor > provisionBalanceMinor) {
    throw new DomainError('VALIDATION_FAILED', 'Reversal cannot exceed provision balance');
  }

  const reversedMinor = reversalAmountMinor;
  const remainingBalanceMinor = provisionBalanceMinor - reversedMinor;
  const isFullReversal = remainingBalanceMinor === 0;

  const explanation =
    `Provision reversal (IAS 37.59): reversed ${reversedMinor} (${reason}), ` +
    `${isFullReversal ? 'fully reversed' : `remaining ${remainingBalanceMinor}`}`;

  return {
    result: { reversedMinor, remainingBalanceMinor, isFullReversal, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
