/**
 * IAS 36.114-120 — Impairment Reversal
 *
 * An impairment loss for an asset (other than goodwill) shall be
 * reversed if there has been a change in the estimates used to
 * determine the recoverable amount. Reversal is capped at the
 * carrying amount that would have been determined had no impairment
 * loss been recognised.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ImpairmentReversalInput = {
  currentCarryingMinor: number;
  newRecoverableAmountMinor: number;
  carryingWithoutImpairmentMinor: number;
  assetType: 'ppe' | 'intangible' | 'goodwill' | 'rou';
};

export type ImpairmentReversalResult = {
  reversalMinor: number;
  newCarryingMinor: number;
  isReversible: boolean;
  explanation: string;
};

export function computeImpairmentReversal(
  inputs: ImpairmentReversalInput,
): CalculatorResult<ImpairmentReversalResult> {
  const { currentCarryingMinor, newRecoverableAmountMinor, carryingWithoutImpairmentMinor, assetType } = inputs;

  if (currentCarryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Current carrying cannot be negative');

  if (assetType === 'goodwill') {
    return {
      result: {
        reversalMinor: 0,
        newCarryingMinor: currentCarryingMinor,
        isReversible: false,
        explanation: 'Goodwill impairment is never reversed (IAS 36.124)',
      },
      inputs: { ...inputs },
      explanation: 'Goodwill impairment is never reversed (IAS 36.124)',
    };
  }

  if (newRecoverableAmountMinor <= currentCarryingMinor) {
    return {
      result: {
        reversalMinor: 0,
        newCarryingMinor: currentCarryingMinor,
        isReversible: false,
        explanation: 'No reversal — recoverable amount does not exceed carrying amount',
      },
      inputs: { ...inputs },
      explanation: 'No reversal — recoverable amount does not exceed carrying amount',
    };
  }

  const maxReversal = carryingWithoutImpairmentMinor - currentCarryingMinor;
  const uncappedReversal = newRecoverableAmountMinor - currentCarryingMinor;
  const reversalMinor = Math.min(uncappedReversal, maxReversal);
  const newCarryingMinor = currentCarryingMinor + reversalMinor;

  const explanation =
    `Impairment reversal (IAS 36.114): reversal ${reversalMinor} ` +
    `(capped at ${maxReversal} = carrying without impairment ${carryingWithoutImpairmentMinor} - current ${currentCarryingMinor}), ` +
    `new carrying ${newCarryingMinor}`;

  return {
    result: { reversalMinor, newCarryingMinor, isReversible: true, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
