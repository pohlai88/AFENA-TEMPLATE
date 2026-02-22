/**
 * IAS 23.26 — Borrowing Cost Disclosure Computation
 *
 * Computes the disclosure amounts required by IAS 23.26:
 * total borrowing costs incurred, amount capitalised, and
 * capitalisation rate used.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BorrowingCostDisclosureInput = {
  totalBorrowingCostMinor: number;
  capitalisedAmountMinor: number;
  capitalisationRate: number;
  qualifyingAssetCount: number;
};

export type BorrowingCostDisclosureResult = {
  expensedAmountMinor: number;
  capitalisedAmountMinor: number;
  capitalisationRatePct: string;
  qualifyingAssetCount: number;
  explanation: string;
};

export function computeBorrowingCostDisclosure(
  inputs: BorrowingCostDisclosureInput,
): CalculatorResult<BorrowingCostDisclosureResult> {
  const { totalBorrowingCostMinor, capitalisedAmountMinor, capitalisationRate, qualifyingAssetCount } = inputs;

  if (totalBorrowingCostMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Total borrowing cost cannot be negative');
  if (capitalisedAmountMinor > totalBorrowingCostMinor) {
    throw new DomainError('VALIDATION_FAILED', 'Capitalised amount cannot exceed total borrowing cost');
  }

  const expensedAmountMinor = totalBorrowingCostMinor - capitalisedAmountMinor;
  const capitalisationRatePct = `${(capitalisationRate * 100).toFixed(2)}%`;

  const explanation =
    `Borrowing cost disclosure (IAS 23.26): total ${totalBorrowingCostMinor}, ` +
    `capitalised ${capitalisedAmountMinor}, expensed ${expensedAmountMinor}, ` +
    `rate ${capitalisationRatePct}, ${qualifyingAssetCount} qualifying assets`;

  return {
    result: { expensedAmountMinor, capitalisedAmountMinor, capitalisationRatePct, qualifyingAssetCount, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
