/**
 * IAS 20.32 — Grant Repayment
 *
 * When a government grant becomes repayable, the repayment is
 * accounted for as a change in accounting estimate (IAS 8).
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type GrantRepaymentInput = {
  grantAmountMinor: number;
  cumulativeRecognisedMinor: number;
  repaymentAmountMinor: number;
  deferredIncomeBalanceMinor: number;
};

export type GrantRepaymentResult = {
  offsetAgainstDeferredMinor: number;
  expenseToPlMinor: number;
  explanation: string;
};

export function computeGrantRepayment(
  inputs: GrantRepaymentInput,
): CalculatorResult<GrantRepaymentResult> {
  const { repaymentAmountMinor, deferredIncomeBalanceMinor } = inputs;

  if (repaymentAmountMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Repayment amount must be positive');

  const offsetAgainstDeferredMinor = Math.min(repaymentAmountMinor, deferredIncomeBalanceMinor);
  const expenseToPlMinor = repaymentAmountMinor - offsetAgainstDeferredMinor;

  const explanation =
    `Grant repayment (IAS 20.32): repay ${repaymentAmountMinor}, ` +
    `offset against deferred ${offsetAgainstDeferredMinor}, expense to P&L ${expenseToPlMinor}`;

  return {
    result: { offsetAgainstDeferredMinor, expenseToPlMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
