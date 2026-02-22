import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-08 / BU-10 — Budget Import from CSV
 *
 * Parses and validates CSV budget data, mapping columns to budget line items.
 * Detects duplicates, validates account IDs, and returns structured import result.
 *
 * Pure function — no I/O.
 */

export type CsvBudgetRow = {
  rowNumber: number;
  accountId: string;
  departmentId: string;
  periodKey: string;
  amountMinor: number;
  description: string;
};

export type ImportValidationError = {
  rowNumber: number;
  field: string;
  message: string;
};

export type BudgetImportResult = {
  validRows: CsvBudgetRow[];
  errors: ImportValidationError[];
  duplicates: { rowA: number; rowB: number; key: string }[];
  totalValidAmountMinor: number;
  totalRowCount: number;
  validRowCount: number;
  errorRowCount: number;
  isClean: boolean;
};

/**
 * Validate and deduplicate CSV budget import data.
 *
 * @param rows            - Parsed CSV rows
 * @param validAccountIds - Set of valid account IDs for validation
 */
export function validateBudgetImport(
  rows: CsvBudgetRow[],
  validAccountIds: Set<string>,
): CalculatorResult<BudgetImportResult> {
  if (rows.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Import file must contain at least one row');
  }

  const errors: ImportValidationError[] = [];
  const validRows: CsvBudgetRow[] = [];
  const seen = new Map<string, number>();
  const duplicates: { rowA: number; rowB: number; key: string }[] = [];

  for (const row of rows) {
    let hasError = false;

    if (!row.accountId || row.accountId.trim() === '') {
      errors.push({ rowNumber: row.rowNumber, field: 'accountId', message: 'Account ID is required' });
      hasError = true;
    } else if (validAccountIds.size > 0 && !validAccountIds.has(row.accountId)) {
      errors.push({ rowNumber: row.rowNumber, field: 'accountId', message: `Unknown account: ${row.accountId}` });
      hasError = true;
    }

    if (!row.periodKey || !/^\d{4}-P\d{1,2}$/.test(row.periodKey)) {
      errors.push({ rowNumber: row.rowNumber, field: 'periodKey', message: `Invalid period format: ${row.periodKey}` });
      hasError = true;
    }

    if (!Number.isFinite(row.amountMinor)) {
      errors.push({ rowNumber: row.rowNumber, field: 'amountMinor', message: 'Amount must be a finite number' });
      hasError = true;
    }

    const key = `${row.accountId}|${row.departmentId}|${row.periodKey}`;
    const prevRow = seen.get(key);
    if (prevRow !== undefined) {
      duplicates.push({ rowA: prevRow, rowB: row.rowNumber, key });
    }
    seen.set(key, row.rowNumber);

    if (!hasError) {
      validRows.push(row);
    }
  }

  return {
    result: {
      validRows,
      errors,
      duplicates,
      totalValidAmountMinor: validRows.reduce((s, r) => s + r.amountMinor, 0),
      totalRowCount: rows.length,
      validRowCount: validRows.length,
      errorRowCount: rows.length - validRows.length,
      isClean: errors.length === 0 && duplicates.length === 0,
    },
    inputs: { rowCount: rows.length, accountIdCount: validAccountIds.size },
    explanation: `Import: ${validRows.length}/${rows.length} valid, ${errors.length} errors, ${duplicates.length} duplicates`,
  };
}
