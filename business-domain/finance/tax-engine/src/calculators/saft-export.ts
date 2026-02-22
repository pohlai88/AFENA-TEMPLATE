import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TX-05 — SAF-T (Standard Audit File for Tax) Export
 *
 * Validates and structures financial data for OECD SAF-T export.
 * Checks completeness of required fields per SAF-T schema.
 *
 * Pure function — no I/O.
 */

export type SaftTransaction = {
  transactionId: string;
  dateIso: string;
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  taxCode: string | null;
  description: string;
  sourceDocument: string;
};

export type SaftValidationIssue = {
  transactionId: string;
  field: string;
  message: string;
};

export type SaftExportResult = {
  validTransactions: number;
  invalidTransactions: number;
  issues: SaftValidationIssue[];
  totalDebitMinor: number;
  totalCreditMinor: number;
  isBalanced: boolean;
  readyForExport: boolean;
};

export function validateSaftData(
  transactions: SaftTransaction[],
): CalculatorResult<SaftExportResult> {
  if (transactions.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No transactions provided for SAF-T export');
  }

  const issues: SaftValidationIssue[] = [];

  for (const tx of transactions) {
    if (!tx.dateIso) issues.push({ transactionId: tx.transactionId, field: 'dateIso', message: 'Date is required' });
    if (!tx.accountId) issues.push({ transactionId: tx.transactionId, field: 'accountId', message: 'Account ID is required' });
    if (tx.debitMinor === 0 && tx.creditMinor === 0) issues.push({ transactionId: tx.transactionId, field: 'amount', message: 'Debit or credit must be non-zero' });
    if (!tx.sourceDocument) issues.push({ transactionId: tx.transactionId, field: 'sourceDocument', message: 'Source document reference required' });
  }

  const invalidIds = new Set(issues.map((i) => i.transactionId));
  const totalDebitMinor = transactions.reduce((s, t) => s + t.debitMinor, 0);
  const totalCreditMinor = transactions.reduce((s, t) => s + t.creditMinor, 0);

  return {
    result: {
      validTransactions: transactions.length - invalidIds.size,
      invalidTransactions: invalidIds.size,
      issues,
      totalDebitMinor,
      totalCreditMinor,
      isBalanced: totalDebitMinor === totalCreditMinor,
      readyForExport: issues.length === 0 && totalDebitMinor === totalCreditMinor,
    },
    inputs: { transactionCount: transactions.length },
    explanation: `SAF-T validation: ${transactions.length - invalidIds.size}/${transactions.length} valid, balanced=${totalDebitMinor === totalCreditMinor}`,
  };
}
