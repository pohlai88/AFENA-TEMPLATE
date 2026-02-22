/**
 * IFRS 2.27-28 — Modification Accounting
 *
 * When the terms of an equity-settled SBP are modified, the entity
 * continues to recognise the original grant-date fair value plus any
 * incremental fair value from the modification.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ModificationAccountingInput = {
  originalFvPerUnitMinor: number;
  modifiedFvPerUnitMinor: number;
  instrumentsOutstanding: number;
  remainingVestingMonths: number;
  totalVestingMonths: number;
};

export type ModificationAccountingResult = {
  incrementalFvPerUnitMinor: number;
  totalIncrementalFvMinor: number;
  originalExpenseRemainingMinor: number;
  additionalExpensePerMonthMinor: number;
  explanation: string;
};

export function computeModificationAccounting(
  inputs: ModificationAccountingInput,
): CalculatorResult<ModificationAccountingResult> {
  const { originalFvPerUnitMinor, modifiedFvPerUnitMinor, instrumentsOutstanding, remainingVestingMonths, totalVestingMonths } = inputs;

  if (instrumentsOutstanding <= 0) throw new DomainError('VALIDATION_FAILED', 'Instruments outstanding must be positive');
  if (remainingVestingMonths <= 0) throw new DomainError('VALIDATION_FAILED', 'Remaining vesting months must be positive');

  const incrementalFvPerUnitMinor = Math.max(0, modifiedFvPerUnitMinor - originalFvPerUnitMinor);
  const totalIncrementalFvMinor = Math.round(incrementalFvPerUnitMinor * instrumentsOutstanding);

  const originalTotalFv = Math.round(originalFvPerUnitMinor * instrumentsOutstanding);
  const vestedRatio = (totalVestingMonths - remainingVestingMonths) / totalVestingMonths;
  const originalExpenseRemainingMinor = Math.round(originalTotalFv * (1 - vestedRatio));

  const additionalExpensePerMonthMinor = Math.round(totalIncrementalFvMinor / remainingVestingMonths);

  const explanation =
    `SBP modification (IFRS 2.27): incremental FV ${incrementalFvPerUnitMinor}/unit × ${instrumentsOutstanding} = ${totalIncrementalFvMinor}, ` +
    `spread over ${remainingVestingMonths}m at ${additionalExpensePerMonthMinor}/m`;

  return {
    result: { incrementalFvPerUnitMinor, totalIncrementalFvMinor, originalExpenseRemainingMinor, additionalExpensePerMonthMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
