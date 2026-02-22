import { describe, expect, it } from 'vitest';
import { translateTrialBalance } from '../calculators/fx-translation';

import type { TranslationRates, TrialBalanceEntry } from '../calculators/fx-translation';

describe('translateTrialBalance', () => {
  const rates: TranslationRates = {
    closingRate: '0.22',
    averageRate: '0.21',
    historicalRate: '0.20',
  };

  it('returns identity for same currency', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'asset', amountMinor: 10000, sourceCurrency: 'USD' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.translatedMinor).toBe(10000);
    expect(result[0]?.rateUsed).toBe('1');
  });

  it('uses closing rate for assets', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'asset', amountMinor: 10000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.translatedMinor).toBe(2200);
    expect(result[0]?.rateUsed).toBe('0.22');
  });

  it('uses closing rate for liabilities', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'liability', amountMinor: 10000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.rateUsed).toBe('0.22');
  });

  it('uses average rate for revenue', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'revenue', amountMinor: 10000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.translatedMinor).toBe(2100);
    expect(result[0]?.rateUsed).toBe('0.21');
  });

  it('uses average rate for expenses', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'expense', amountMinor: 10000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.rateUsed).toBe('0.21');
  });

  it('uses historical rate for equity', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'equity', amountMinor: 10000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result[0]?.translatedMinor).toBe(2000);
    expect(result[0]?.rateUsed).toBe('0.20');
  });

  it('translates multiple entries with correct rates', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'asset', amountMinor: 10000, sourceCurrency: 'MYR' },
      { accountId: 'a2', accountType: 'revenue', amountMinor: 5000, sourceCurrency: 'MYR' },
      { accountId: 'a3', accountType: 'equity', amountMinor: 8000, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, rates, 'USD').result;
    expect(result).toHaveLength(3);
    expect(result[0]?.rateUsed).toBe('0.22');
    expect(result[1]?.rateUsed).toBe('0.21');
    expect(result[2]?.rateUsed).toBe('0.20');
  });

  it('rounds half-up', () => {
    const entries: TrialBalanceEntry[] = [
      { accountId: 'a1', accountType: 'asset', amountMinor: 1001, sourceCurrency: 'MYR' },
    ];
    const result = translateTrialBalance(entries, { ...rates, closingRate: '0.225' }, 'USD').result;
    expect(result[0]?.translatedMinor).toBe(225);
  });

  it('returns empty for empty entries', () => {
    expect(translateTrialBalance([], rates, 'USD').result).toHaveLength(0);
  });
});
