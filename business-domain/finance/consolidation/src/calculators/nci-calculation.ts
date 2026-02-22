import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CO-04 — Non-Controlling Interest (NCI) Calculation (IFRS 10 §22)
 *
 * Computes NCI share of subsidiary net assets and profit/loss.
 * Pure function — no I/O.
 */

export type SubsidiaryData = {
  subsidiaryId: string;
  name: string;
  parentOwnershipPct: number;
  netAssetsMinor: number;
  profitLossMinor: number;
};

export type NciResult = {
  subsidiaryId: string;
  nciPct: number;
  nciNetAssetsMinor: number;
  nciProfitLossMinor: number;
  parentShareNetAssetsMinor: number;
  parentShareProfitLossMinor: number;
};

export type NciPortfolioResult = { subsidiaries: NciResult[]; totalNciNetAssetsMinor: number; totalNciProfitLossMinor: number };

export function computeNci(subsidiaries: SubsidiaryData[]): CalculatorResult<NciPortfolioResult> {
  if (subsidiaries.length === 0) throw new DomainError('VALIDATION_FAILED', 'No subsidiaries provided');

  const results: NciResult[] = subsidiaries.map((s) => {
    if (s.parentOwnershipPct < 0 || s.parentOwnershipPct > 100) throw new DomainError('VALIDATION_FAILED', `Invalid ownership ${s.parentOwnershipPct}% for ${s.subsidiaryId}`);
    const nciPct = 100 - s.parentOwnershipPct;
    return {
      subsidiaryId: s.subsidiaryId, nciPct,
      nciNetAssetsMinor: Math.round(s.netAssetsMinor * nciPct / 100),
      nciProfitLossMinor: Math.round(s.profitLossMinor * nciPct / 100),
      parentShareNetAssetsMinor: Math.round(s.netAssetsMinor * s.parentOwnershipPct / 100),
      parentShareProfitLossMinor: Math.round(s.profitLossMinor * s.parentOwnershipPct / 100),
    };
  });

  return {
    result: { subsidiaries: results, totalNciNetAssetsMinor: results.reduce((s, r) => s + r.nciNetAssetsMinor, 0), totalNciProfitLossMinor: results.reduce((s, r) => s + r.nciProfitLossMinor, 0) },
    inputs: { count: subsidiaries.length },
    explanation: `NCI: ${results.length} subsidiaries, total NCI net assets=${results.reduce((s, r) => s + r.nciNetAssetsMinor, 0)}`,
  };
}
