import { describe, expect, it } from 'vitest';
import { reconcileMultiCurrency } from '../calculators/multi-currency-recon';

describe('reconcileMultiCurrency', () => {
  it('matches entries with same transaction amount', () => {
    const bank = [{ entryId: 'B1', transactionCurrency: 'EUR', transactionAmountMinor: 1000, functionalCurrency: 'USD', functionalAmountMinor: 1100, fxRateUsed: 1.1, source: 'bank' as const }];
    const ledger = [{ entryId: 'L1', transactionCurrency: 'EUR', transactionAmountMinor: 1000, functionalCurrency: 'USD', functionalAmountMinor: 1105, fxRateUsed: 1.105, source: 'ledger' as const }];
    const r = reconcileMultiCurrency(bank, ledger, 10);
    expect(r.result.matchedCount).toBe(1);
    expect(r.result.fxVarianceMinor).toBe(5);
  });

  it('reports unmatched when amounts differ', () => {
    const bank = [{ entryId: 'B1', transactionCurrency: 'EUR', transactionAmountMinor: 1000, functionalCurrency: 'USD', functionalAmountMinor: 1100, fxRateUsed: 1.1, source: 'bank' as const }];
    const r = reconcileMultiCurrency(bank, [], 0);
    expect(r.result.unmatchedCount).toBe(1);
  });

  it('throws on empty inputs', () => {
    expect(() => reconcileMultiCurrency([], [])).toThrow('at least one');
  });
});
