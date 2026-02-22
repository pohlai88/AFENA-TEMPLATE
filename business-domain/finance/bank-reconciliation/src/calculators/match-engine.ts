import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see BR-02 — Auto-matching rules (amount, date, reference)
 * @see BR-03 — Tolerance matching for rounding differences
 * @see BR-04 — Many-to-one / one-to-many matching
 * @see BR-07 — Bank fee reconciliation
 */

export type BankLine = {
  lineId: string;
  amountMinor: number;
  dateIso: string;
  reference: string;
};

export type LedgerEntry = {
  entryId: string;
  amountMinor: number;
  dateIso: string;
  reference: string;
};

export type MatchCandidate = {
  bankLineId: string;
  ledgerEntryId: string;
  confidence: number;
};

export function findMatches(
  bankLines: BankLine[],
  ledgerEntries: LedgerEntry[],
  toleranceDays: number,
): CalculatorResult<MatchCandidate[]> {
  if (toleranceDays < 0 || !Number.isInteger(toleranceDays)) {
    throw new DomainError('VALIDATION_FAILED', 'toleranceDays must be non-negative integer', {
      value: toleranceDays,
    });
  }

  const matches: MatchCandidate[] = [];

  for (const bl of bankLines) {
    for (const le of ledgerEntries) {
      if (bl.amountMinor !== le.amountMinor) continue;

      const daysDiff = Math.abs(daysBetween(bl.dateIso, le.dateIso));
      if (daysDiff > toleranceDays) continue;

      let confidence = 0.5;
      if (daysDiff === 0) confidence += 0.3;
      else if (daysDiff <= 1) confidence += 0.2;
      else if (daysDiff <= 3) confidence += 0.1;

      if (bl.reference && le.reference && bl.reference === le.reference) {
        confidence += 0.2;
      }

      matches.push({
        bankLineId: bl.lineId,
        ledgerEntryId: le.entryId,
        confidence: Math.min(confidence, 1.0),
      });
    }
  }

  const sorted = matches.sort((a, b) => b.confidence - a.confidence);
  return {
    result: sorted,
    inputs: { bankLines, ledgerEntries, toleranceDays },
    explanation: `Matched ${sorted.length} candidates from ${bankLines.length} bank lines and ${ledgerEntries.length} ledger entries (tolerance: ${toleranceDays}d)`,
  };
}

function daysBetween(a: string, b: string): number {
  const msA = Date.parse(a.slice(0, 10) + 'T00:00:00Z');
  const msB = Date.parse(b.slice(0, 10) + 'T00:00:00Z');
  return Math.round((msA - msB) / 86_400_000);
}
