import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';

export type TrialBalanceEntry = {
  accountId: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  amountMinor: number;
  sourceCurrency: string;
};

export type TranslatedEntry = {
  accountId: string;
  originalMinor: number;
  translatedMinor: number;
  sourceCurrency: string;
  targetCurrency: string;
  rateUsed: string;
};

export type TranslationRates = {
  closingRate: string;
  averageRate: string;
  historicalRate: string;
};

export function translateTrialBalance(
  entries: TrialBalanceEntry[],
  rates: TranslationRates,
  targetCurrency: string,
): CalculatorResult<TranslatedEntry[]> {
  const translated = entries.map((entry) => {
    if (entry.sourceCurrency === targetCurrency) {
      return {
        accountId: entry.accountId,
        originalMinor: entry.amountMinor,
        translatedMinor: entry.amountMinor,
        sourceCurrency: entry.sourceCurrency,
        targetCurrency,
        rateUsed: '1',
      };
    }

    const rate = selectRate(entry.accountType, rates);
    const translated = new Decimal(entry.amountMinor)
      .mul(new Decimal(rate))
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();

    return {
      accountId: entry.accountId,
      originalMinor: entry.amountMinor,
      translatedMinor: translated,
      sourceCurrency: entry.sourceCurrency,
      targetCurrency,
      rateUsed: rate,
    };
  });

  return {
    result: translated,
    inputs: { entries, rates, targetCurrency },
    explanation: `Translated ${entries.length} entries to ${targetCurrency}`,
  };
}

function selectRate(
  accountType: TrialBalanceEntry['accountType'],
  rates: TranslationRates,
): string {
  switch (accountType) {
    case 'asset':
    case 'liability':
      return rates.closingRate;
    case 'revenue':
    case 'expense':
      return rates.averageRate;
    case 'equity':
      return rates.historicalRate;
    default: {
      const _exhaustive: never = accountType;
      throw new DomainError('VALIDATION_FAILED', 'Unknown account type', {
        accountType: _exhaustive,
      });
    }
  }
}
