/**
 * @see DE-09 — Audit trail: who posted, when, from which source document
 * @see FC-04 — Reclassification journals (reclass)
 * Reclassification Calculator
 *
 * Produces journal reclassification lines: moves balance from one account
 * to another while maintaining DR=CR equality.
 */
import { DomainError } from 'afenda-canon';

export type ReclassEntry = {
  fromAccountId: string;
  toAccountId: string;
  amountMinor: number;
};

export type ReclassLine = {
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
};

export type ReclassResult = {
  result: ReclassLine[];
  inputs: { entries: readonly ReclassEntry[] };
  explanation: string;
};

/**
 * Converts reclassification entries into balanced journal lines.
 * Each entry produces a debit on the destination and a credit on the source.
 */
export function computeReclassLines(entries: readonly ReclassEntry[]): ReclassResult {
  if (entries.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Reclassification requires at least one entry');
  }

  const lines: ReclassLine[] = [];
  let total = 0;

  for (const e of entries) {
    if (e.amountMinor <= 0) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `Reclass amount must be positive, got ${e.amountMinor}`,
      );
    }
    if (e.fromAccountId === e.toAccountId) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `Cannot reclassify from account to itself: ${e.fromAccountId}`,
      );
    }
    lines.push({ accountId: e.fromAccountId, side: 'credit', amountMinor: e.amountMinor });
    lines.push({ accountId: e.toAccountId, side: 'debit', amountMinor: e.amountMinor });
    total += e.amountMinor;
  }

  return {
    result: lines,
    inputs: { entries },
    explanation: `Reclassification: ${entries.length} entries, total ${total} minor units moved.`,
  };
}
