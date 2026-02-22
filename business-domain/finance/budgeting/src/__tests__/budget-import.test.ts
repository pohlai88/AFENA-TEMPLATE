import { describe, expect, it } from 'vitest';
import { validateBudgetImport } from '../calculators/budget-import';
import type { CsvBudgetRow } from '../calculators/budget-import';

const validAccounts = new Set(['acc-100', 'acc-200', 'acc-300']);

const goodRows: CsvBudgetRow[] = [
  { rowNumber: 1, accountId: 'acc-100', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 500000, description: 'Salaries' },
  { rowNumber: 2, accountId: 'acc-200', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 200000, description: 'Rent' },
];

describe('validateBudgetImport', () => {
  it('accepts valid rows', () => {
    const { result } = validateBudgetImport(goodRows, validAccounts);
    expect(result.isClean).toBe(true);
    expect(result.validRowCount).toBe(2);
    expect(result.errorRowCount).toBe(0);
  });

  it('rejects unknown account IDs', () => {
    const rows: CsvBudgetRow[] = [
      { rowNumber: 1, accountId: 'acc-999', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 100, description: 'Bad' },
    ];
    const { result } = validateBudgetImport(rows, validAccounts);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]!.message).toContain('Unknown account');
  });

  it('rejects invalid period format', () => {
    const rows: CsvBudgetRow[] = [
      { rowNumber: 1, accountId: 'acc-100', departmentId: 'dept-1', periodKey: 'Jan-2026', amountMinor: 100, description: 'Bad' },
    ];
    const { result } = validateBudgetImport(rows, validAccounts);
    expect(result.errors[0]!.field).toBe('periodKey');
  });

  it('detects duplicate rows', () => {
    const rows: CsvBudgetRow[] = [
      { rowNumber: 1, accountId: 'acc-100', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 500, description: 'A' },
      { rowNumber: 2, accountId: 'acc-100', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 600, description: 'B' },
    ];
    const { result } = validateBudgetImport(rows, validAccounts);
    expect(result.duplicates).toHaveLength(1);
    expect(result.isClean).toBe(false);
  });

  it('computes total valid amount', () => {
    const { result } = validateBudgetImport(goodRows, validAccounts);
    expect(result.totalValidAmountMinor).toBe(700000);
  });

  it('skips account validation when set is empty', () => {
    const rows: CsvBudgetRow[] = [
      { rowNumber: 1, accountId: 'any-account', departmentId: 'dept-1', periodKey: '2026-P1', amountMinor: 100, description: 'OK' },
    ];
    const { result } = validateBudgetImport(rows, new Set());
    expect(result.validRowCount).toBe(1);
  });

  it('throws for empty rows', () => {
    expect(() => validateBudgetImport([], validAccounts)).toThrow('at least one row');
  });
});
