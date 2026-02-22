import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CO-06 — Currency translation: functional → presentation currency (IA
 * CO-10 — Auto-Generated Consolidation Journal from IC Match
 *
 * Given a set of matched intercompany transactions, generates the
 * elimination journal entries for consolidation.
 *
 * Pure function — no I/O.
 */

export type IcMatchedPair = {
  matchId: string;
  fromCompanyId: string;
  toCompanyId: string;
  amountMinor: number;
  currency: string;
  icAccountFrom: string;
  icAccountTo: string;
  description: string;
};

export type ConsolJournalLine = {
  accountId: string;
  companyId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
  memo: string;
};

export type ConsolJournalResult = {
  lines: ConsolJournalLine[];
  totalEliminatedMinor: number;
  matchCount: number;
  isBalanced: boolean;
};

/**
 * Generate elimination journal entries from matched IC pairs.
 *
 * For each matched pair:
 * - Debit the IC payable account (toCompany side) to eliminate the liability
 * - Credit the IC receivable account (fromCompany side) to eliminate the asset
 */
export function generateConsolJournal(
  matches: IcMatchedPair[],
): CalculatorResult<ConsolJournalResult> {
  if (matches.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one IC matched pair required');
  }

  const lines: ConsolJournalLine[] = [];
  let totalEliminatedMinor = 0;

  for (const m of matches) {
    if (m.amountMinor <= 0) {
      throw new DomainError('VALIDATION_FAILED', `IC match ${m.matchId}: amount must be positive`);
    }
    if (m.fromCompanyId === m.toCompanyId) {
      throw new DomainError('VALIDATION_FAILED', `IC match ${m.matchId}: from and to company must differ`);
    }

    lines.push({
      accountId: m.icAccountTo,
      companyId: m.toCompanyId,
      side: 'debit',
      amountMinor: m.amountMinor,
      memo: `IC elimination: ${m.description} (match ${m.matchId})`,
    });

    lines.push({
      accountId: m.icAccountFrom,
      companyId: m.fromCompanyId,
      side: 'credit',
      amountMinor: m.amountMinor,
      memo: `IC elimination: ${m.description} (match ${m.matchId})`,
    });

    totalEliminatedMinor += m.amountMinor;
  }

  const totalDebit = lines.filter((l) => l.side === 'debit').reduce((s, l) => s + l.amountMinor, 0);
  const totalCredit = lines.filter((l) => l.side === 'credit').reduce((s, l) => s + l.amountMinor, 0);

  return {
    result: {
      lines,
      totalEliminatedMinor,
      matchCount: matches.length,
      isBalanced: totalDebit === totalCredit,
    },
    inputs: { matchCount: matches.length },
    explanation: `Consolidation journal: ${matches.length} IC pairs eliminated, total ${totalEliminatedMinor} minor units`,
  };
}
