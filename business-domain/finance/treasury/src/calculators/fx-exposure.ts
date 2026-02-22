import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TR-07 — FX exposure reporting: net open position by currency
 */
export type CurrencyPosition = {
  currency: string;
  receivablesMinor: number;
  payablesMinor: number;
  cashMinor: number;
  hedgedMinor: number;
};

export type FxExposureResult = {
  positions: Array<{ currency: string; netOpenMinor: number; hedgedMinor: number; unhedgedMinor: number }>;
  totalUnhedgedMinor: number;
  currencyCount: number;
  largestExposureCurrency: string;
};

export function computeFxExposure(
  positions: CurrencyPosition[],
): CalculatorResult<FxExposureResult> {
  if (positions.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one currency position');
  }

  const results = positions.map((p) => {
    const netOpen = p.receivablesMinor + p.cashMinor - p.payablesMinor;
    const unhedged = Math.abs(netOpen) - Math.min(Math.abs(netOpen), p.hedgedMinor);
    return { currency: p.currency, netOpenMinor: netOpen, hedgedMinor: p.hedgedMinor, unhedgedMinor: unhedged };
  });

  const totalUnhedged = results.reduce((s, r) => s + r.unhedgedMinor, 0);
  const largest = results.reduce((max, r) => (Math.abs(r.netOpenMinor) > Math.abs(max.netOpenMinor) ? r : max));

  return {
    result: { positions: results, totalUnhedgedMinor: totalUnhedged, currencyCount: positions.length, largestExposureCurrency: largest.currency },
    inputs: { currencyCount: positions.length },
    explanation: `FX exposure across ${positions.length} currencies. Total unhedged: ${totalUnhedged}. Largest exposure: ${largest.currency} (net ${largest.netOpenMinor}).`,
  };
}
