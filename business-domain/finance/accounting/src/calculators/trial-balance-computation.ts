/**
 * IAS 1.10 — Trial Balance Computation
 *
 * Aggregates journal line balances by account to produce a trial balance,
 * validating that total debits equal total credits.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type JournalLineBalance = {
  accountId: string;
  accountName: string;
  debitMinor: number;
  creditMinor: number;
};

export type TrialBalanceInput = {
  lines: JournalLineBalance[];
  periodKey: string;
};

export type TrialBalanceLine = {
  accountId: string;
  accountName: string;
  debitMinor: number;
  creditMinor: number;
  netMinor: number;
  side: 'debit' | 'credit' | 'nil';
};

export type TrialBalanceResult = {
  lines: TrialBalanceLine[];
  totalDebitsMinor: number;
  totalCreditsMinor: number;
  isBalanced: boolean;
  differenceMinor: number;
  explanation: string;
};

export function computeTrialBalance(
  inputs: TrialBalanceInput,
): CalculatorResult<TrialBalanceResult> {
  const { lines, periodKey } = inputs;

  if (lines.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one journal line required');

  const accountMap = new Map<string, { name: string; debit: number; credit: number }>();

  for (const line of lines) {
    const existing = accountMap.get(line.accountId) ?? { name: line.accountName, debit: 0, credit: 0 };
    existing.debit += line.debitMinor;
    existing.credit += line.creditMinor;
    accountMap.set(line.accountId, existing);
  }

  const tbLines: TrialBalanceLine[] = [...accountMap.entries()].map(([accountId, data]) => {
    const netMinor = data.debit - data.credit;
    return {
      accountId,
      accountName: data.name,
      debitMinor: data.debit,
      creditMinor: data.credit,
      netMinor,
      side: netMinor > 0 ? 'debit' : netMinor < 0 ? 'credit' : 'nil',
    };
  });

  const totalDebitsMinor = tbLines.reduce((s, l) => s + l.debitMinor, 0);
  const totalCreditsMinor = tbLines.reduce((s, l) => s + l.creditMinor, 0);
  const differenceMinor = totalDebitsMinor - totalCreditsMinor;
  const isBalanced = differenceMinor === 0;

  const explanation = isBalanced
    ? `Trial balance ${periodKey} (IAS 1.10): balanced at ${totalDebitsMinor}, ${tbLines.length} accounts`
    : `Trial balance ${periodKey} (IAS 1.10): UNBALANCED — debits ${totalDebitsMinor}, credits ${totalCreditsMinor}, diff ${differenceMinor}`;

  return {
    result: { lines: tbLines, totalDebitsMinor, totalCreditsMinor, isBalanced, differenceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
