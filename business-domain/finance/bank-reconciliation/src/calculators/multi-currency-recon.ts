import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FX-07 — Multi-currency bank reconciliation
 * @see BR-05 — Unmatched item investigation workflow
 * @see BR-08 — Multi-currency reconciliation
 */
export type MultiCurrencyEntry = {
  entryId: string;
  transactionCurrency: string;
  transactionAmountMinor: number;
  functionalCurrency: string;
  functionalAmountMinor: number;
  fxRateUsed: number;
  source: 'bank' | 'ledger';
};

export type MultiCurrencyReconResult = {
  matchedCount: number;
  unmatchedCount: number;
  fxVarianceMinor: number;
  currenciesProcessed: string[];
  entries: Array<{ entryId: string; currency: string; varianceMinor: number; matched: boolean }>;
};

export function reconcileMultiCurrency(
  bankEntries: MultiCurrencyEntry[],
  ledgerEntries: MultiCurrencyEntry[],
  fxToleranceMinor: number = 100,
): CalculatorResult<MultiCurrencyReconResult> {
  if (bankEntries.length === 0 && ledgerEntries.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one entry');
  }

  const currencies = new Set<string>();
  const results: MultiCurrencyReconResult['entries'] = [];
  const usedLedger = new Set<number>();
  let totalVariance = 0;

  for (const bank of bankEntries) {
    currencies.add(bank.transactionCurrency);
    let matched = false;
    for (let i = 0; i < ledgerEntries.length; i++) {
      if (usedLedger.has(i)) continue;
      const ledger = ledgerEntries[i]!;
      if (
        bank.transactionCurrency === ledger.transactionCurrency &&
        bank.transactionAmountMinor === ledger.transactionAmountMinor
      ) {
        const variance = Math.abs(bank.functionalAmountMinor - ledger.functionalAmountMinor);
        totalVariance += variance;
        results.push({ entryId: bank.entryId, currency: bank.transactionCurrency, varianceMinor: variance, matched: variance <= fxToleranceMinor });
        if (variance <= fxToleranceMinor) matched = true;
        usedLedger.add(i);
        break;
      }
    }
    if (!matched && !results.some((r) => r.entryId === bank.entryId)) {
      results.push({ entryId: bank.entryId, currency: bank.transactionCurrency, varianceMinor: 0, matched: false });
    }
  }

  const matchedCount = results.filter((r) => r.matched).length;

  return {
    result: { matchedCount, unmatchedCount: bankEntries.length - matchedCount, fxVarianceMinor: totalVariance, currenciesProcessed: [...currencies], entries: results },
    inputs: { bankCount: bankEntries.length, ledgerCount: ledgerEntries.length, fxToleranceMinor },
    explanation: `Multi-currency recon: ${matchedCount}/${bankEntries.length} matched across ${currencies.size} currencies. FX variance: ${totalVariance}.`,
  };
}
