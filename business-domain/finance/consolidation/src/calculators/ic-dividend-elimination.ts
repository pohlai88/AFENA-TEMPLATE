import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CO-01 — Group ownership hierarchy (parent → subsidiary → sub-subsidi
 * @see CO-03 — IC elimination: revenue vs cost, receivable vs payable
 * CO-08 — Intercompany Dividend Elimination (IFRS 10 §B86)
 *
 * Eliminates IC dividends: subsidiary dividend income in parent = equity reduction in subsidiary.
 * Pure function — no I/O.
 */

export type IcDividend = { subsidiaryId: string; parentId: string; dividendMinor: number; ownershipPct: number };

export type DividendEliminationEntry = { subsidiaryId: string; parentId: string; eliminationMinor: number; nciShareMinor: number };

export type DividendEliminationResult = { entries: DividendEliminationEntry[]; totalEliminatedMinor: number; totalNciShareMinor: number };

export function eliminateIcDividends(dividends: IcDividend[]): CalculatorResult<DividendEliminationResult> {
  if (dividends.length === 0) throw new DomainError('VALIDATION_FAILED', 'No IC dividends provided');

  const entries: DividendEliminationEntry[] = dividends.map((d) => {
    const eliminationMinor = Math.round(d.dividendMinor * d.ownershipPct / 100);
    const nciShareMinor = d.dividendMinor - eliminationMinor;
    return { subsidiaryId: d.subsidiaryId, parentId: d.parentId, eliminationMinor, nciShareMinor };
  });

  return {
    result: { entries, totalEliminatedMinor: entries.reduce((s, e) => s + e.eliminationMinor, 0), totalNciShareMinor: entries.reduce((s, e) => s + e.nciShareMinor, 0) },
    inputs: { count: dividends.length },
    explanation: `IC dividend elimination: ${entries.length} entries, total eliminated=${entries.reduce((s, e) => s + e.eliminationMinor, 0)}`,
  };
}
