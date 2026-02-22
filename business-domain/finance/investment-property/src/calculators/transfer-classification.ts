/**
 * IAS 40.57-65 — Transfer Classification
 *
 * Determines the accounting treatment when property is transferred
 * to or from investment property based on change of use evidence.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type TransferClassificationInput = {
  direction: 'to-investment' | 'from-investment';
  fromCategory: 'ppe' | 'inventory' | 'owner-occupied';
  toCategory: 'ppe' | 'inventory' | 'owner-occupied' | 'investment-property';
  carryingMinor: number;
  fairValueMinor: number;
  measurementModel: 'fair-value' | 'cost';
};

export type TransferClassificationResult = {
  transferValueMinor: number;
  gainLossMinor: number;
  recogniseTo: 'pnl' | 'revaluation-surplus' | 'none';
  explanation: string;
};

export function classifyTransfer(
  inputs: TransferClassificationInput,
): CalculatorResult<TransferClassificationResult> {
  const { direction, fromCategory, carryingMinor, fairValueMinor, measurementModel } = inputs;

  if (carryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Carrying amount cannot be negative');

  let transferValueMinor: number;
  let gainLossMinor: number;
  let recogniseTo: TransferClassificationResult['recogniseTo'];

  if (direction === 'to-investment' && measurementModel === 'fair-value') {
    transferValueMinor = fairValueMinor;
    gainLossMinor = fairValueMinor - carryingMinor;

    if (fromCategory === 'owner-occupied') {
      recogniseTo = gainLossMinor > 0 ? 'revaluation-surplus' : 'pnl';
    } else {
      recogniseTo = 'pnl';
    }
  } else if (direction === 'from-investment' && measurementModel === 'fair-value') {
    transferValueMinor = fairValueMinor;
    gainLossMinor = 0;
    recogniseTo = 'none';
  } else {
    transferValueMinor = carryingMinor;
    gainLossMinor = 0;
    recogniseTo = 'none';
  }

  const explanation =
    `Transfer ${direction} (IAS 40.57): ${fromCategory} → carrying ${carryingMinor}, ` +
    `transfer at ${transferValueMinor}, gain/loss ${gainLossMinor} → ${recogniseTo}`;

  return {
    result: { transferValueMinor, gainLossMinor, recogniseTo, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
