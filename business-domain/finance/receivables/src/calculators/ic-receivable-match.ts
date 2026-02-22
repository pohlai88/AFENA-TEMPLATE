import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AR-08 — Intercompany receivable matching
 */
export type IcReceivableEntry = {
  companyId: string;
  counterpartyId: string;
  amountMinor: number;
  currency: string;
  referenceId: string;
};

export type IcMatchResult = {
  matchedPairs: Array<{ receivable: IcReceivableEntry; payable: IcReceivableEntry; differenceMinor: number }>;
  unmatchedReceivables: IcReceivableEntry[];
  unmatchedPayables: IcReceivableEntry[];
  totalMatchedMinor: number;
  matchRate: number;
};

export function matchIcReceivables(
  receivables: IcReceivableEntry[],
  payables: IcReceivableEntry[],
  toleranceMinor: number = 0,
): CalculatorResult<IcMatchResult> {
  if (receivables.length === 0 && payables.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one receivable or payable');
  }

  const matched: IcMatchResult['matchedPairs'] = [];
  const usedPayables = new Set<number>();
  const unmatchedReceivables: IcReceivableEntry[] = [];

  for (const rec of receivables) {
    let found = false;
    for (let i = 0; i < payables.length; i++) {
      if (usedPayables.has(i)) continue;
      const pay = payables[i]!;
      if (
        rec.counterpartyId === pay.companyId &&
        rec.companyId === pay.counterpartyId &&
        rec.currency === pay.currency &&
        Math.abs(rec.amountMinor - pay.amountMinor) <= toleranceMinor
      ) {
        matched.push({ receivable: rec, payable: pay, differenceMinor: rec.amountMinor - pay.amountMinor });
        usedPayables.add(i);
        found = true;
        break;
      }
    }
    if (!found) unmatchedReceivables.push(rec);
  }

  const unmatchedPayables = payables.filter((_, i) => !usedPayables.has(i));
  const totalMatchedMinor = matched.reduce((s, m) => s + m.receivable.amountMinor, 0);
  const totalItems = receivables.length + payables.length;
  const matchRate = totalItems > 0 ? Math.round((matched.length * 2 * 100) / totalItems) : 0;

  return {
    result: { matchedPairs: matched, unmatchedReceivables, unmatchedPayables, totalMatchedMinor, matchRate },
    inputs: { receivableCount: receivables.length, payableCount: payables.length, toleranceMinor },
    explanation: `IC matching: ${matched.length} pairs matched (${matchRate}% rate), ${unmatchedReceivables.length} unmatched receivables, ${unmatchedPayables.length} unmatched payables.`,
  };
}
