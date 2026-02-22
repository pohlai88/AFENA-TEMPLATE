import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see DE-03 — Functional currency + transaction currency on every line (IAS 21)
 *
 * Validates that every journal line carries both a functional currency
 * and a transaction currency. Returns validation result with any
 * violating line indices.
 *
 * Pure function — no I/O.
 */

export type CurrencyLine = {
  lineIndex: number;
  functionalCurrency?: string;
  transactionCurrency?: string;
  amountMinor: number;
};

export type DocumentCurrencyValidationResult = {
  valid: boolean;
  totalLines: number;
  violatingLines: number[];
  missingFunctional: number[];
  missingTransaction: number[];
};

export function validateDocumentCurrencies(
  lines: CurrencyLine[],
): CalculatorResult<DocumentCurrencyValidationResult> {
  if (!Array.isArray(lines) || lines.length === 0)
    throw new DomainError('VALIDATION_FAILED', 'lines must be a non-empty array');

  const missingFunctional: number[] = [];
  const missingTransaction: number[] = [];

  for (const line of lines) {
    if (!line.functionalCurrency || line.functionalCurrency.trim().length === 0) {
      missingFunctional.push(line.lineIndex);
    }
    if (!line.transactionCurrency || line.transactionCurrency.trim().length === 0) {
      missingTransaction.push(line.lineIndex);
    }
  }

  const violatingLines = [...new Set([...missingFunctional, ...missingTransaction])].sort((a, b) => a - b);
  const valid = violatingLines.length === 0;

  return {
    result: {
      valid,
      totalLines: lines.length,
      violatingLines,
      missingFunctional,
      missingTransaction,
    },
    inputs: { lineCount: lines.length },
    explanation: valid
      ? `All ${lines.length} lines have both functional and transaction currency`
      : `${violatingLines.length} of ${lines.length} lines missing currency (functional: ${missingFunctional.length}, transaction: ${missingTransaction.length})`,
  };
}
