import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-03 / TR-08 — Investment Portfolio Tracking (IFRS 9)
 *
 * Classifies and values investment holdings per IFRS 9 measurement categories:
 * - Amortised cost (AC)
 * - Fair value through OCI (FVOCI)
 * - Fair value through P&L (FVTPL)
 *
 * Pure function — no I/O.
 */

export type InvestmentHolding = {
  holdingId: string;
  instrumentName: string;
  classification: 'AC' | 'FVOCI' | 'FVTPL';
  nominalMinor: number;
  costMinor: number;
  currentFairValueMinor: number;
  accruedInterestMinor: number;
  currency: string;
};

export type PortfolioValuation = {
  holdings: InvestmentHoldingValued[];
  totalCostMinor: number;
  totalFairValueMinor: number;
  totalUnrealisedGainLossMinor: number;
  totalAccruedInterestMinor: number;
  byClassification: Record<string, { count: number; fairValueMinor: number }>;
};

export type InvestmentHoldingValued = InvestmentHolding & {
  unrealisedGainLossMinor: number;
  gainLossRecognition: 'P&L' | 'OCI' | 'none';
};

export function valuePortfolio(
  holdings: InvestmentHolding[],
): CalculatorResult<PortfolioValuation> {
  if (holdings.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Portfolio must have at least one holding');
  }

  const valued: InvestmentHoldingValued[] = holdings.map((h) => {
    const unrealisedGainLossMinor = h.currentFairValueMinor - h.costMinor;
    let gainLossRecognition: 'P&L' | 'OCI' | 'none';
    switch (h.classification) {
      case 'FVTPL':
        gainLossRecognition = 'P&L';
        break;
      case 'FVOCI':
        gainLossRecognition = 'OCI';
        break;
      case 'AC':
        gainLossRecognition = 'none';
        break;
    }
    return { ...h, unrealisedGainLossMinor, gainLossRecognition };
  });

  const byClassification: Record<string, { count: number; fairValueMinor: number }> = {};
  for (const v of valued) {
    const entry = byClassification[v.classification] ?? { count: 0, fairValueMinor: 0 };
    entry.count++;
    entry.fairValueMinor += v.currentFairValueMinor;
    byClassification[v.classification] = entry;
  }

  return {
    result: {
      holdings: valued,
      totalCostMinor: valued.reduce((s, v) => s + v.costMinor, 0),
      totalFairValueMinor: valued.reduce((s, v) => s + v.currentFairValueMinor, 0),
      totalUnrealisedGainLossMinor: valued.reduce((s, v) => s + v.unrealisedGainLossMinor, 0),
      totalAccruedInterestMinor: valued.reduce((s, v) => s + v.accruedInterestMinor, 0),
      byClassification,
    },
    inputs: { holdingCount: holdings.length },
    explanation: `Portfolio: ${holdings.length} holdings, FV ${valued.reduce((s, v) => s + v.currentFairValueMinor, 0)}, unrealised G/L ${valued.reduce((s, v) => s + v.unrealisedGainLossMinor, 0)}`,
  };
}
