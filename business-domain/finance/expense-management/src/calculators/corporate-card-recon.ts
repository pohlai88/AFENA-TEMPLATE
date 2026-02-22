import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see EM-01 — Expense claim submission with receipt attachment
 * @see EM-04 — Mileage rate calculation (per km/mile)
 * @see EM-07 — Foreign currency expense reimbursement (IAS 21)
 * EM-06 — Corporate Card Reconciliation Hook
 * Pure function — no I/O.
 */

export type CardTransaction = { txnId: string; cardLast4: string; amountMinor: number; dateIso: string; merchantName: string };
export type ExpenseClaim = { claimId: string; amountMinor: number; dateIso: string; merchantName: string };

export type CardReconMatch = { txnId: string; claimId: string | null; status: 'matched' | 'unmatched_txn' | 'unmatched_claim'; amountMinor: number };
export type CardReconResult = { matches: CardReconMatch[]; matchedCount: number; unmatchedTxnCount: number; unmatchedClaimCount: number };

export function reconcileCorporateCard(transactions: CardTransaction[], claims: ExpenseClaim[]): CalculatorResult<CardReconResult> {
  if (transactions.length === 0 && claims.length === 0) throw new DomainError('VALIDATION_FAILED', 'No data');
  const claimMap = new Map(claims.map((c) => [`${c.amountMinor}|${c.dateIso}`, c]));
  const matchedClaimIds = new Set<string>();
  const matches: CardReconMatch[] = [];

  for (const txn of transactions) {
    const key = `${txn.amountMinor}|${txn.dateIso}`;
    const claim = claimMap.get(key);
    if (claim && !matchedClaimIds.has(claim.claimId)) {
      matches.push({ txnId: txn.txnId, claimId: claim.claimId, status: 'matched', amountMinor: txn.amountMinor });
      matchedClaimIds.add(claim.claimId);
    } else {
      matches.push({ txnId: txn.txnId, claimId: null, status: 'unmatched_txn', amountMinor: txn.amountMinor });
    }
  }
  for (const claim of claims) {
    if (!matchedClaimIds.has(claim.claimId)) matches.push({ txnId: '', claimId: claim.claimId, status: 'unmatched_claim', amountMinor: claim.amountMinor });
  }

  return { result: { matches, matchedCount: matches.filter((m) => m.status === 'matched').length, unmatchedTxnCount: matches.filter((m) => m.status === 'unmatched_txn').length, unmatchedClaimCount: matches.filter((m) => m.status === 'unmatched_claim').length }, inputs: { txnCount: transactions.length, claimCount: claims.length }, explanation: `Card recon: ${matches.filter((m) => m.status === 'matched').length} matched` };
}
