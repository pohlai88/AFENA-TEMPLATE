import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see DE-01 — Double-entry enforcement: every debit has equal credit
 * @see DE-02 — Multi-currency journal: transaction + functional currency on every line
 * @see DE-03 — Functional currency + transaction currency on every line (IAS 21)
 * @see DE-04 — Reversal entries: linked to original, auto-generated
 * @see DE-08 — Batch Posting with Rollback on Any Line Failure
 * @see DE-10 — Intercompany elimination entries auto-generated
 *
 * Validates a batch of journal entries for posting. If any single entry
 * fails validation, the entire batch is rejected (all-or-nothing semantics).
 * Pure function — no I/O, no actual DB writes.
 */

export type BatchJournalEntry = {
  entryId: string;
  debitAccountId: string;
  creditAccountId: string;
  amountMinor: number;
  currency: string;
  description: string;
};

export type BatchEntryResult = {
  entryId: string;
  valid: boolean;
  error?: string;
};

export type BatchPostingResult = {
  batchId: string;
  totalEntries: number;
  validEntries: number;
  failedEntries: number;
  accepted: boolean;
  entryResults: BatchEntryResult[];
  totalDebitMinor: number;
  totalCreditMinor: number;
};

function validateEntry(entry: BatchJournalEntry): BatchEntryResult {
  if (!entry.entryId) return { entryId: entry.entryId, valid: false, error: 'entryId is required' };
  if (!entry.debitAccountId) return { entryId: entry.entryId, valid: false, error: 'debitAccountId is required' };
  if (!entry.creditAccountId) return { entryId: entry.entryId, valid: false, error: 'creditAccountId is required' };
  if (entry.debitAccountId === entry.creditAccountId) return { entryId: entry.entryId, valid: false, error: 'Debit and credit accounts must differ' };
  if (!Number.isInteger(entry.amountMinor) || entry.amountMinor <= 0) return { entryId: entry.entryId, valid: false, error: 'amountMinor must be a positive integer' };
  if (!entry.currency) return { entryId: entry.entryId, valid: false, error: 'currency is required' };
  return { entryId: entry.entryId, valid: true };
}

export function validateBatchPosting(
  batchId: string,
  entries: BatchJournalEntry[],
): CalculatorResult<BatchPostingResult> {
  if (!batchId) throw new DomainError('VALIDATION_FAILED', 'batchId is required');
  if (entries.length === 0) throw new DomainError('VALIDATION_FAILED', 'Batch must contain at least one entry');

  const entryResults = entries.map(validateEntry);
  const validCount = entryResults.filter((r) => r.valid).length;
  const failedCount = entryResults.length - validCount;

  // All-or-nothing: if any entry fails, entire batch is rejected
  const accepted = failedCount === 0;

  const totalDebit = entries.reduce((s, e) => s + e.amountMinor, 0);
  const totalCredit = totalDebit; // Double-entry: debit always equals credit per entry

  return {
    result: {
      batchId,
      totalEntries: entries.length,
      validEntries: validCount,
      failedEntries: failedCount,
      accepted,
      entryResults,
      totalDebitMinor: totalDebit,
      totalCreditMinor: totalCredit,
    },
    inputs: { batchId, entryCount: entries.length },
    explanation: accepted
      ? `Batch ${batchId}: ${entries.length} entries validated, all accepted for posting`
      : `Batch ${batchId}: REJECTED — ${failedCount}/${entries.length} entries failed, rollback all`,
  };
}
