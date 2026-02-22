import { describe, expect, it } from 'vitest';

import { validateSaftData } from '../calculators/saft-export';

describe('TX-05 — SAF-T (Standard Audit File for Tax) export', () => {
  const validTxns = [
    { transactionId: 'T-1', dateIso: '2025-12-01', accountId: 'A-100', debitMinor: 10_000, creditMinor: 0, taxCode: 'V20', description: 'Sale', sourceDocument: 'INV-001' },
    { transactionId: 'T-2', dateIso: '2025-12-01', accountId: 'A-200', debitMinor: 0, creditMinor: 10_000, taxCode: 'V20', description: 'Sale revenue', sourceDocument: 'INV-001' },
  ];

  it('validates balanced transactions as ready for export', () => {
    const r = validateSaftData(validTxns);
    expect(r.result.readyForExport).toBe(true);
    expect(r.result.isBalanced).toBe(true);
    expect(r.result.validTransactions).toBe(2);
  });

  it('detects unbalanced totals', () => {
    const unbalanced = [
      { transactionId: 'T-1', dateIso: '2025-12-01', accountId: 'A-100', debitMinor: 10_000, creditMinor: 0, taxCode: 'V20', description: 'Sale', sourceDocument: 'INV-001' },
    ];
    const r = validateSaftData(unbalanced);
    expect(r.result.isBalanced).toBe(false);
  });

  it('reports validation issues for missing fields', () => {
    const bad = [
      { transactionId: 'T-1', dateIso: '', accountId: 'A-100', debitMinor: 10_000, creditMinor: 0, taxCode: null, description: 'Test', sourceDocument: '' },
    ];
    const r = validateSaftData(bad);
    expect(r.result.issues.length).toBeGreaterThan(0);
    expect(r.result.invalidTransactions).toBeGreaterThan(0);
  });

  it('computes total debits and credits', () => {
    const r = validateSaftData(validTxns);
    expect(r.result.totalDebitMinor).toBe(10_000);
    expect(r.result.totalCreditMinor).toBe(10_000);
  });

  it('throws on empty transactions', () => {
    expect(() => validateSaftData([])).toThrow();
  });
});
