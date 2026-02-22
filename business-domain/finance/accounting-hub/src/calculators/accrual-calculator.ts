/**
 * @see FC-02 — Accrual run: auto-generate accrual journals from templates
 * @see FC-03 — Allocation run: overhead → cost centers (step-down method)
 * Accrual Calculator
 *
 * Computes accrual journal lines for a given period.
 * Supports straight-line accrual for evenly spreading amounts across periods.
 */
import { DomainError } from 'afenda-canon';

export type AccrualInput = {
  expenseAccountId: string;
  liabilityAccountId: string;
  totalMinor: number;
  totalPeriods: number;
  currentPeriod: number;
};

export type AccrualLine = {
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
};

export type AccrualResult = {
  result: AccrualLine[];
  inputs: AccrualInput;
  explanation: string;
};

/**
 * Computes accrual lines for a single period using straight-line method.
 * Last period absorbs any rounding remainder.
 */
export function computeAccrualLines(input: AccrualInput): AccrualResult {
  if (input.totalPeriods <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Total periods must be > 0');
  }
  if (input.currentPeriod < 1 || input.currentPeriod > input.totalPeriods) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `Current period ${input.currentPeriod} out of range [1, ${input.totalPeriods}]`,
    );
  }
  if (input.totalMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Total amount must be non-negative');
  }
  if (input.expenseAccountId === input.liabilityAccountId) {
    throw new DomainError('VALIDATION_FAILED', 'Expense and liability accounts must differ');
  }

  const perPeriod = Math.round(input.totalMinor / input.totalPeriods);
  const isLast = input.currentPeriod === input.totalPeriods;
  const priorTotal = perPeriod * (input.currentPeriod - 1);
  const amount = isLast ? input.totalMinor - priorTotal : perPeriod;

  const lines: AccrualLine[] = [
    { accountId: input.expenseAccountId, side: 'debit', amountMinor: amount },
    { accountId: input.liabilityAccountId, side: 'credit', amountMinor: amount },
  ];

  return {
    result: lines,
    inputs: input,
    explanation: `Accrual period ${input.currentPeriod}/${input.totalPeriods}: ${amount} minor units (${perPeriod}/period, total ${input.totalMinor}).`,
  };
}
