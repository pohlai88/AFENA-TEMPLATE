import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FX-03 — OCI translation difference tracking (functional → presentati
 * FX-10 — Functional Currency Determination (IAS 21 §9-14)
 *
 * Determines the functional currency of an entity based on the
 * primary economic environment indicators defined in IAS 21.
 *
 * Pure function — no I/O.
 */

export type CurrencyIndicator = {
  currency: string;
  indicatorType: 'revenue' | 'cost' | 'financing' | 'operating_receipts';
  weightMinor: number;
  description: string;
};

export type FunctionalCurrencyResult = {
  determinedCurrency: string;
  confidence: 'high' | 'medium' | 'low';
  currencyScores: { currency: string; score: number; percentage: number }[];
  primaryIndicators: string[];
};

/**
 * Determine functional currency per IAS 21 §9 primary indicators:
 *
 * (a) Currency that mainly influences sales prices (revenue indicator)
 * (b) Currency of the country whose competitive forces and regulations
 *     mainly determine sales prices (revenue indicator)
 * (c) Currency that mainly influences labour, material, and other costs
 *     (cost indicator)
 *
 * Secondary indicators (§10): financing and operating receipts.
 *
 * Primary indicators carry 2x weight vs secondary.
 */
export function determineFunctionalCurrency(
  indicators: CurrencyIndicator[],
): CalculatorResult<FunctionalCurrencyResult> {
  if (indicators.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one currency indicator required');
  }

  const PRIMARY_TYPES = new Set(['revenue', 'cost']);
  const PRIMARY_MULTIPLIER = 2;
  const SECONDARY_MULTIPLIER = 1;

  const scores = new Map<string, number>();

  for (const ind of indicators) {
    if (ind.weightMinor < 0) {
      throw new DomainError('VALIDATION_FAILED', `Negative weight not allowed: ${ind.description}`);
    }
    const multiplier = PRIMARY_TYPES.has(ind.indicatorType) ? PRIMARY_MULTIPLIER : SECONDARY_MULTIPLIER;
    const current = scores.get(ind.currency) ?? 0;
    scores.set(ind.currency, current + ind.weightMinor * multiplier);
  }

  const totalScore = [...scores.values()].reduce((s, v) => s + v, 0);

  const currencyScores = [...scores.entries()]
    .map(([currency, score]) => ({
      currency,
      score,
      percentage: totalScore === 0 ? 0 : Math.round((score / totalScore) * 10000) / 100,
    }))
    .sort((a, b) => b.score - a.score);

  const top = currencyScores[0]!;
  const runner = currencyScores[1];

  let confidence: 'high' | 'medium' | 'low';
  if (top.percentage >= 60) {
    confidence = 'high';
  } else if (!runner || top.percentage - runner.percentage >= 15) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  const primaryIndicators = indicators
    .filter((i) => PRIMARY_TYPES.has(i.indicatorType) && i.currency === top.currency)
    .map((i) => i.description);

  return {
    result: {
      determinedCurrency: top.currency,
      confidence,
      currencyScores,
      primaryIndicators,
    },
    inputs: { indicatorCount: indicators.length },
    explanation: `Functional currency: ${top.currency} (${top.percentage}% score, ${confidence} confidence)`,
  };
}
