import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * AP-05 — Supplier Statement Reconciliation
 *
 * Matches supplier statement lines against internal AP ledger entries.
 * Identifies discrepancies (missing in ledger, missing on statement, amount mismatches).
 *
 * Pure function — no I/O.
 */

export type SupplierStatementLine = {
  refNumber: string;
  dateIso: string;
  amountMinor: number;
  description: string;
};

export type LedgerEntry = {
  invoiceNumber: string;
  dateIso: string;
  amountMinor: number;
};

export type ReconDiscrepancy = {
  refNumber: string;
  type: 'missing_in_ledger' | 'missing_on_statement' | 'amount_mismatch';
  statementAmountMinor: number | null;
  ledgerAmountMinor: number | null;
  differenceMinor: number;
};

export type SupplierReconResult = {
  matchedCount: number;
  discrepancies: ReconDiscrepancy[];
  statementTotalMinor: number;
  ledgerTotalMinor: number;
  netDifferenceMinor: number;
  isReconciled: boolean;
};

export function reconcileSupplierStatement(
  statementLines: SupplierStatementLine[],
  ledgerEntries: LedgerEntry[],
): CalculatorResult<SupplierReconResult> {
  if (statementLines.length === 0 && ledgerEntries.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Both statement and ledger are empty');
  }

  const ledgerMap = new Map(ledgerEntries.map((e) => [e.invoiceNumber, e]));
  const matchedRefs = new Set<string>();
  const discrepancies: ReconDiscrepancy[] = [];
  let matchedCount = 0;

  for (const sl of statementLines) {
    const le = ledgerMap.get(sl.refNumber);
    if (!le) {
      discrepancies.push({ refNumber: sl.refNumber, type: 'missing_in_ledger', statementAmountMinor: sl.amountMinor, ledgerAmountMinor: null, differenceMinor: sl.amountMinor });
    } else if (sl.amountMinor !== le.amountMinor) {
      discrepancies.push({ refNumber: sl.refNumber, type: 'amount_mismatch', statementAmountMinor: sl.amountMinor, ledgerAmountMinor: le.amountMinor, differenceMinor: sl.amountMinor - le.amountMinor });
      matchedRefs.add(sl.refNumber);
    } else {
      matchedCount++;
      matchedRefs.add(sl.refNumber);
    }
  }

  for (const le of ledgerEntries) {
    if (!matchedRefs.has(le.invoiceNumber) && !statementLines.some((s) => s.refNumber === le.invoiceNumber)) {
      discrepancies.push({ refNumber: le.invoiceNumber, type: 'missing_on_statement', statementAmountMinor: null, ledgerAmountMinor: le.amountMinor, differenceMinor: -le.amountMinor });
    }
  }

  const statementTotalMinor = statementLines.reduce((s, l) => s + l.amountMinor, 0);
  const ledgerTotalMinor = ledgerEntries.reduce((s, l) => s + l.amountMinor, 0);

  return {
    result: {
      matchedCount,
      discrepancies,
      statementTotalMinor,
      ledgerTotalMinor,
      netDifferenceMinor: statementTotalMinor - ledgerTotalMinor,
      isReconciled: discrepancies.length === 0,
    },
    inputs: { statementLineCount: statementLines.length, ledgerEntryCount: ledgerEntries.length },
    explanation: `Supplier recon: ${matchedCount} matched, ${discrepancies.length} discrepancies, diff=${statementTotalMinor - ledgerTotalMinor}`,
  };
}
