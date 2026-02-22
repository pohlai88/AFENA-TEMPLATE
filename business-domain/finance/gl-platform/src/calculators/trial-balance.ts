/**
 * @see GL-07 — Account balance = sum of all posted journal lines (no separa
 * @see GL-08 — Trial balance at any point-in-time (`asOf`) — not just perio
 * Trial Balance at Date Computation
 *
 * Pure calculator that aggregates journal line balances into a trial balance.
 * Receives pre-fetched data from the query layer — no DB access.
 */

export type TrialBalanceInput = {
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
};

export type TrialBalanceRow = {
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  netMinor: number;
};

export type TrialBalanceResult = {
  result: TrialBalanceRow[];
  inputs: { lines: readonly TrialBalanceInput[]; asOf: string };
  explanation: string;
};

/**
 * Aggregates journal lines into a trial balance.
 * Lines should already be filtered to the desired date range by the query layer.
 */
export function computeTrialBalance(
  lines: readonly TrialBalanceInput[],
  asOf: string,
): TrialBalanceResult {
  const map = new Map<string, { dr: number; cr: number }>();

  for (const l of lines) {
    const entry = map.get(l.accountId) ?? { dr: 0, cr: 0 };
    if (l.side === 'debit') {
      entry.dr += l.amountMinor;
    } else {
      entry.cr += l.amountMinor;
    }
    map.set(l.accountId, entry);
  }

  const result: TrialBalanceRow[] = [];
  for (const [accountId, { dr, cr }] of map.entries()) {
    result.push({
      accountId,
      debitMinor: dr,
      creditMinor: cr,
      netMinor: dr - cr,
    });
  }

  result.sort((a, b) => a.accountId.localeCompare(b.accountId));

  const totalDr = result.reduce((sum, r) => sum + r.debitMinor, 0);
  const totalCr = result.reduce((sum, r) => sum + r.creditMinor, 0);

  return {
    result,
    inputs: { lines, asOf },
    explanation: `Trial balance as of ${asOf}: ${result.length} accounts, total DR ${totalDr}, total CR ${totalCr}, net ${totalDr - totalCr}.`,
  };
}
