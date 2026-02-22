import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TR-01 — Bank account master: IBAN, SWIFT, currency, company
 * @see TR-05 — Bank statement import: OFX, MT940, camt.053, CSV
 */
export type BankStatementLine = {
  date: string;
  reference: string;
  description: string;
  amountMinor: number;
  currency: string;
  balanceMinor: number;
};

export type StatementFormat = 'mt940' | 'camt053' | 'ofx' | 'csv';

export type BankStatementImportResult = {
  format: StatementFormat;
  lineCount: number;
  totalDebitsMinor: number;
  totalCreditsMinor: number;
  openingBalanceMinor: number;
  closingBalanceMinor: number;
  currencies: string[];
  isBalanced: boolean;
};

export function validateBankStatement(
  lines: BankStatementLine[],
  format: StatementFormat,
  openingBalanceMinor: number,
): CalculatorResult<BankStatementImportResult> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Statement must contain at least one line');
  }

  let debits = 0;
  let credits = 0;
  const currencies = new Set<string>();

  for (const line of lines) {
    currencies.add(line.currency);
    if (line.amountMinor >= 0) credits += line.amountMinor;
    else debits += Math.abs(line.amountMinor);
  }

  const closingBalance = openingBalanceMinor + credits - debits;
  const lastLine = lines[lines.length - 1]!;
  const isBalanced = closingBalance === lastLine.balanceMinor;

  return {
    result: {
      format,
      lineCount: lines.length,
      totalDebitsMinor: debits,
      totalCreditsMinor: credits,
      openingBalanceMinor,
      closingBalanceMinor: closingBalance,
      currencies: [...currencies],
      isBalanced,
    },
    inputs: { format, lineCount: lines.length, openingBalanceMinor },
    explanation: `${format.toUpperCase()} statement: ${lines.length} lines, debits ${debits}, credits ${credits}, closing ${closingBalance}. ${isBalanced ? 'Balanced.' : 'UNBALANCED — closing does not match last line balance.'}`,
  };
}
