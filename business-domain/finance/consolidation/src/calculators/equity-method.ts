import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-09 — Equity Method Consolidation (IAS 28 / IFRS 11)
 *
 * Three consolidation methods based on ownership percentage:
 * - Full consolidation (>50%): line-by-line with NCI — handled by existing calculators
 * - Equity method (20-50%): single-line investment + share of P&L
 * - Fair value (<20%): investment at cost/fair value, dividend income only
 *
 * Joint ventures (IFRS 11): equity method (not proportionate consolidation under IFRS)
 *
 * Pure function — no I/O.
 */

export type ConsolidationMethod = 'full' | 'equity' | 'fair_value';

export type InvesteeData = {
  investeeId: string;
  name: string;
  ownershipPct: number;
  /** Cost of investment in minor units */
  investmentCostMinor: number;
  /** Investee net assets at reporting date */
  netAssetsMinor: number;
  /** Investee profit/loss for the period */
  profitLossMinor: number;
  /** Dividends received from investee in the period */
  dividendsReceivedMinor: number;
  /** Other comprehensive income of investee */
  ociMinor?: number;
  /** Fair value of investment at reporting date (for <20% holdings) */
  fairValueMinor?: number;
  /** Is this a joint venture (IFRS 11)? Forces equity method regardless of % */
  isJointVenture?: boolean;
};

export type EquityMethodResult = {
  investeeId: string;
  method: ConsolidationMethod;
  ownershipPct: number;
  /** Carrying amount of investment */
  carryingAmountMinor: number;
  /** Share of profit/loss recognized in P&L */
  shareOfProfitLossMinor: number;
  /** Share of OCI recognized */
  shareOfOciMinor: number;
  /** Dividend income (fair value method only) */
  dividendIncomeMinor: number;
  /** Goodwill implicit in investment (equity method) */
  implicitGoodwillMinor: number;
};

export type EquityMethodPortfolioResult = {
  investments: EquityMethodResult[];
  totalCarryingAmountMinor: number;
  totalShareOfProfitLossMinor: number;
  totalDividendIncomeMinor: number;
};

export function classifyConsolidationMethod(
  ownershipPct: number,
  isJointVenture?: boolean,
): ConsolidationMethod {
  if (isJointVenture) return 'equity';
  if (ownershipPct > 50) return 'full';
  if (ownershipPct >= 20) return 'equity';
  return 'fair_value';
}

export function computeEquityMethodConsolidation(
  investees: InvesteeData[],
): CalculatorResult<EquityMethodPortfolioResult> {
  if (investees.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No investees provided');
  }

  const investments: EquityMethodResult[] = investees.map((inv) => {
    if (inv.ownershipPct < 0 || inv.ownershipPct > 100) {
      throw new DomainError('VALIDATION_FAILED', `Invalid ownership ${inv.ownershipPct}% for ${inv.investeeId}`);
    }

    const method = classifyConsolidationMethod(inv.ownershipPct, inv.isJointVenture);
    const oci = inv.ociMinor ?? 0;

    switch (method) {
      case 'equity': {
        const shareOfPL = Math.round(inv.profitLossMinor * inv.ownershipPct / 100);
        const shareOfOci = Math.round(oci * inv.ownershipPct / 100);
        const shareOfNetAssets = Math.round(inv.netAssetsMinor * inv.ownershipPct / 100);
        const implicitGoodwill = Math.max(0, inv.investmentCostMinor - shareOfNetAssets);
        const carryingAmount = inv.investmentCostMinor + shareOfPL + shareOfOci - inv.dividendsReceivedMinor;
        return {
          investeeId: inv.investeeId, method, ownershipPct: inv.ownershipPct,
          carryingAmountMinor: carryingAmount,
          shareOfProfitLossMinor: shareOfPL,
          shareOfOciMinor: shareOfOci,
          dividendIncomeMinor: 0,
          implicitGoodwillMinor: implicitGoodwill,
        };
      }
      case 'fair_value': {
        const carryingAmount = inv.fairValueMinor ?? inv.investmentCostMinor;
        return {
          investeeId: inv.investeeId, method, ownershipPct: inv.ownershipPct,
          carryingAmountMinor: carryingAmount,
          shareOfProfitLossMinor: 0,
          shareOfOciMinor: 0,
          dividendIncomeMinor: inv.dividendsReceivedMinor,
          implicitGoodwillMinor: 0,
        };
      }
      case 'full': {
        throw new DomainError('VALIDATION_FAILED', `Investee ${inv.investeeId} has ${inv.ownershipPct}% ownership — use full consolidation calculators`);
      }
    }
  });

  const totalCarrying = investments.reduce((s, i) => s + i.carryingAmountMinor, 0);
  const totalPL = investments.reduce((s, i) => s + i.shareOfProfitLossMinor, 0);
  const totalDiv = investments.reduce((s, i) => s + i.dividendIncomeMinor, 0);

  return {
    result: {
      investments,
      totalCarryingAmountMinor: totalCarrying,
      totalShareOfProfitLossMinor: totalPL,
      totalDividendIncomeMinor: totalDiv,
    },
    inputs: { count: investees.length },
    explanation: `Equity method: ${investments.length} investees, carrying=${totalCarrying}, P&L share=${totalPL}, dividends=${totalDiv}`,
  };
}
