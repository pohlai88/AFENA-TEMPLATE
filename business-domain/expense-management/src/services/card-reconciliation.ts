/**
 * Card Reconciliation - Match Corporate Card Transactions
 *
 * Matches credit card transactions to expense reports:
 * - Import transactions from card providers
 * - Auto-match by amount, date, merchant
 * - Flag unreconciled transactions
 * - Support split transactions (personal/business)
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

const cardTransactionSchema = z.object({
    transactionId: z.string(),
    amount: z.number(),
    date: z.string(),
    merchant: z.string(),
    category: z.string().optional(),
    cardLastFour: z.string().optional()
});

const reconcileCardTransactionsInputSchema = z.object({
    orgId: z.string(),
    employeeId: z.string(),
    cardTransactions: z.array(cardTransactionSchema),
    expenseReportId: z.string().optional() // Match to specific report, or auto-match any
});

const matchedTransactionSchema = z.object({
    transactionId: z.string(),
    expenseLineId: z.string(),
    matchConfidence: z.enum(['exact', 'high', 'medium', 'low']),
    amountDifference: z.number().optional() // If amounts don't match exactly
});

const reconciliationResultSchema = z.object({
    matched: z.number(),
    unmatched: z.number(),
    matchedTransactions: z.array(matchedTransactionSchema),
    unmatchedTransactions: z.array(cardTransactionSchema)
});

export type CardTransaction = z.infer<typeof cardTransactionSchema>;
export type ReconcileCardTransactionsInput = z.infer<typeof reconcileCardTransactionsInputSchema>;
export type MatchedTransaction = z.infer<typeof matchedTransactionSchema>;
export type ReconciliationResult = z.infer<typeof reconciliationResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reconcile corporate card transactions with expense reports
 */
export async function reconcileCardTransactions(
    input: ReconcileCardTransactionsInput
): Promise<ReconciliationResult> {
    const validated = reconcileCardTransactionsInputSchema.parse(input);

    // TODO: Implement card reconciliation:
    // 1. Query expense_line_items for employee (unreconciled)
    // 2. For each card transaction:
    //    a. Match by exact amount + date (±2 days) + merchant (fuzzy)
    //    b. Score matches:
    //       - Exact: Amount exact, date exact, merchant exact
    //       - High: Amount exact, date ±1 day, merchant fuzzy 90%+
    //       - Medium: Amount ±$1, date ±2 days, merchant fuzzy 80%+
    //       - Low: Amount ±$5, date ±3 days, merchant fuzzy 70%+
    // 3. Link transaction to expense line (card_transactions table)
    // 4. Flag unmatched transactions (needs employee review):
    //    - Personal expenses (to be reimbursed to company)
    //    - Missing expense reports
    // 5. Return reconciliation summary

    const matchedTransactions: MatchedTransaction[] = [];
    const unmatchedTransactions: CardTransaction[] = [];

    // Example matching logic
    for (const txn of validated.cardTransactions) {
        // Simple exact match simulation
        if (txn.amount === 189.50) {
            matchedTransactions.push({
                transactionId: txn.transactionId,
                expenseLineId: 'line_002',
                matchConfidence: 'exact'
            });
        } else {
            unmatchedTransactions.push(txn);
        }
    }

    return {
        matched: matchedTransactions.length,
        unmatched: unmatchedTransactions.length,
        matchedTransactions,
        unmatchedTransactions
    };
}
