import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type JournalLine = {
  side: 'debit' | 'credit';
  amountMinor: number;
};

export type JournalBalanceResult = {
  debitTotal: number;
  creditTotal: number;
  balanced: boolean;
};

export function validateJournalBalance(
  lines: JournalLine[],
): CalculatorResult<JournalBalanceResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Journal must have at least one line');
  }

  let dr = 0;
  let cr = 0;

  for (const l of lines) {
    if (!Number.isInteger(l.amountMinor)) {
      throw new DomainError('VALIDATION_FAILED', 'amountMinor must be integer minor units', {
        value: l.amountMinor,
      });
    }
    if (l.amountMinor < 0) {
      throw new DomainError('VALIDATION_FAILED', 'amountMinor must be non-negative', {
        value: l.amountMinor,
      });
    }
    if (l.side === 'debit') {
      dr += l.amountMinor;
    } else {
      cr += l.amountMinor;
    }
  }

  if (dr !== cr) {
    throw new DomainError('VALIDATION_FAILED', `Journal imbalance: DR ${dr} ≠ CR ${cr}`, {
      debitMinor: dr,
      creditMinor: cr,
    });
  }

  return {
    result: { debitTotal: dr, creditTotal: cr, balanced: true },
    inputs: { lineCount: lines.length },
    explanation: `Journal balanced: DR ${dr} = CR ${cr} across ${lines.length} lines`,
  };
}
