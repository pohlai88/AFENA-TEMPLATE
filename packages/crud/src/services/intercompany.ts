import { and, eq, intercompanyTransactions, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Intercompany transaction pair result.
 */
export interface IntercompanyPairResult {
  transactionId: string;
  sourceCompanyId: string;
  targetCompanyId: string;
  amountMinor: number;
  currencyCode: string;
  status: string;
}

/**
 * Elimination entry for consolidated reporting.
 */
export interface EliminationEntry {
  sourceCompanyId: string;
  targetCompanyId: string;
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  memo: string;
}

/**
 * Create an intercompany transaction pair.
 *
 * PRD G0.9 — Intercompany:
 * - Records a transaction between two companies in the same org
 * - Both sides must be journalized separately
 * - Status tracks matching/elimination state
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param params - Transaction parameters
 */
export async function createIntercompanyTransaction(
  tx: NeonHttpDatabase,
  orgId: string,
  params: {
    sourceCompanyId: string;
    targetCompanyId: string;
    transactionType: 'invoice' | 'payment' | 'transfer' | 'allocation' | 'elimination';
    amountMinor: number;
    baseAmountMinor: number;
    currencyCode?: string;
    sourceDocType?: string;
    sourceDocId?: string;
    memo?: string;
  },
): Promise<IntercompanyPairResult> {
  const {
    sourceCompanyId,
    targetCompanyId,
    transactionType,
    amountMinor,
    baseAmountMinor,
    currencyCode = 'MYR',
    memo,
  } = params;

  if (sourceCompanyId === targetCompanyId) {
    throw new Error('Intercompany transaction requires different companies');
  }

  const [row] = await (tx as any)
    .insert(intercompanyTransactions)
    .values({
      orgId,
      sourceCompanyId,
      targetCompanyId,
      transactionType,
      amountMinor,
      baseAmountMinor,
      currencyCode,
      memo: memo ?? null,
      status: 'pending',
    })
    .returning({
      id: intercompanyTransactions.id,
      sourceCompanyId: intercompanyTransactions.sourceCompanyId,
      targetCompanyId: intercompanyTransactions.targetCompanyId,
      amountMinor: intercompanyTransactions.amountMinor,
      currencyCode: intercompanyTransactions.currencyCode,
      status: intercompanyTransactions.status,
    });

  return {
    transactionId: row.id,
    sourceCompanyId: row.sourceCompanyId,
    targetCompanyId: row.targetCompanyId,
    amountMinor: Number(row.amountMinor),
    currencyCode: row.currencyCode,
    status: row.status,
  };
}

/**
 * Generate elimination entries for a set of matched intercompany transactions.
 *
 * PRD G0.9 — Elimination rules:
 * - For each matched pair, create offsetting journal entries
 * - Debit the receivable on the from-company side
 * - Credit the payable on the to-company side
 * - Pure function — does not persist (caller journals the result)
 *
 * @param transactions - Matched intercompany transactions
 * @param receivableAccountId - Intercompany receivable account
 * @param payableAccountId - Intercompany payable account
 */
export function generateEliminationEntries(
  transactions: IntercompanyPairResult[],
  receivableAccountId: string,
  payableAccountId: string,
): EliminationEntry[] {
  const entries: EliminationEntry[] = [];

  for (const txn of transactions) {
    // Eliminate receivable on source company
    entries.push({
      sourceCompanyId: txn.sourceCompanyId,
      targetCompanyId: txn.targetCompanyId,
      accountId: receivableAccountId,
      debitMinor: 0,
      creditMinor: txn.amountMinor,
      memo: `IC elimination: ${txn.sourceCompanyId} -> ${txn.targetCompanyId}`,
    });

    // Eliminate payable on target company
    entries.push({
      sourceCompanyId: txn.targetCompanyId,
      targetCompanyId: txn.sourceCompanyId,
      accountId: payableAccountId,
      debitMinor: txn.amountMinor,
      creditMinor: 0,
      memo: `IC elimination: ${txn.targetCompanyId} <- ${txn.sourceCompanyId}`,
    });
  }

  return entries;
}

/**
 * Mark intercompany transactions as eliminated.
 *
 * @param tx - Transaction handle
 * @param orgId - Tenant org ID
 * @param transactionIds - IDs to mark as eliminated
 */
export async function markEliminated(
  tx: NeonHttpDatabase,
  orgId: string,
  transactionIds: string[],
): Promise<number> {
  if (transactionIds.length === 0) return 0;

  const result = await (tx as any)
    .update(intercompanyTransactions)
    .set({ status: 'eliminated' })
    .where(
      and(
        eq(intercompanyTransactions.orgId, orgId),
        sql`${intercompanyTransactions.id} = ANY(${transactionIds})`,
        eq(intercompanyTransactions.status, 'matched'),
      ),
    )
    .returning({ id: intercompanyTransactions.id });

  return result.length;
}
