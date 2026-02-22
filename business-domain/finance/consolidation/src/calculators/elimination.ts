import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IntercompanyBalance = {
  fromCompanyId: string;
  toCompanyId: string;
  accountId: string;
  amountMinor: number;
  currency: string;
};

export type EliminationEntry = {
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
  currency: string;
  memo: string;
};

export function computeEliminations(
  balances: IntercompanyBalance[],
): CalculatorResult<EliminationEntry[]> {
  if (balances.length === 0)
    return { result: [], inputs: { balances }, explanation: 'No IC balances to eliminate' };

  const entries: EliminationEntry[] = [];

  for (const bal of balances) {
    if (!Number.isInteger(bal.amountMinor) || bal.amountMinor < 0) {
      throw new DomainError('VALIDATION_FAILED', 'amountMinor must be non-negative integer', {
        value: bal.amountMinor,
      });
    }
    if (bal.fromCompanyId === bal.toCompanyId) {
      throw new DomainError(
        'VALIDATION_FAILED',
        'Intercompany balance cannot be within same company',
        {
          fromCompanyId: bal.fromCompanyId,
          toCompanyId: bal.toCompanyId,
        },
      );
    }

    entries.push(
      {
        accountId: bal.accountId,
        side: 'debit',
        amountMinor: bal.amountMinor,
        currency: bal.currency,
        memo: `IC elimination: ${bal.fromCompanyId} → ${bal.toCompanyId}`,
      },
      {
        accountId: bal.accountId,
        side: 'credit',
        amountMinor: bal.amountMinor,
        currency: bal.currency,
        memo: `IC elimination: ${bal.toCompanyId} → ${bal.fromCompanyId}`,
      },
    );
  }

  return {
    result: entries,
    inputs: { balances },
    explanation: `IC elimination: ${entries.length / 2} pairs eliminated from ${balances.length} balances`,
  };
}
