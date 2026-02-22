import { describe, expect, it } from 'vitest';

import { validateDocumentCurrencies } from '../calculators/document-currency-validator';

describe('DE-03 — Functional currency + transaction currency on every line', () => {
  it('passes when all lines have both currencies', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, functionalCurrency: 'USD', transactionCurrency: 'EUR', amountMinor: 1000 },
      { lineIndex: 1, functionalCurrency: 'USD', transactionCurrency: 'USD', amountMinor: 2000 },
    ]);
    expect(r.result.valid).toBe(true);
    expect(r.result.violatingLines).toEqual([]);
  });

  it('detects missing functional currency', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, transactionCurrency: 'EUR', amountMinor: 1000 },
      { lineIndex: 1, functionalCurrency: 'USD', transactionCurrency: 'USD', amountMinor: 2000 },
    ]);
    expect(r.result.valid).toBe(false);
    expect(r.result.missingFunctional).toEqual([0]);
  });

  it('detects missing transaction currency', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, functionalCurrency: 'USD', amountMinor: 1000 },
    ]);
    expect(r.result.valid).toBe(false);
    expect(r.result.missingTransaction).toEqual([0]);
  });

  it('detects empty string currencies', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, functionalCurrency: '', transactionCurrency: '  ', amountMinor: 500 },
    ]);
    expect(r.result.valid).toBe(false);
    expect(r.result.missingFunctional).toEqual([0]);
    expect(r.result.missingTransaction).toEqual([0]);
  });

  it('reports correct total and violating counts', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, functionalCurrency: 'USD', transactionCurrency: 'EUR', amountMinor: 100 },
      { lineIndex: 1, amountMinor: 200 },
      { lineIndex: 2, functionalCurrency: 'USD', amountMinor: 300 },
    ]);
    expect(r.result.totalLines).toBe(3);
    expect(r.result.violatingLines).toEqual([1, 2]);
  });

  it('throws on empty lines array', () => {
    expect(() => validateDocumentCurrencies([])).toThrow('non-empty');
  });

  it('includes explanation', () => {
    const r = validateDocumentCurrencies([
      { lineIndex: 0, functionalCurrency: 'USD', transactionCurrency: 'EUR', amountMinor: 100 },
    ]);
    expect(r.explanation).toContain('All 1 lines');
  });
});
