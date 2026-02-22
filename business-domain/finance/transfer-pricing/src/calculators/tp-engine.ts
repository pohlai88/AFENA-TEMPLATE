/**
 * @see TP-01 — Arm's-length principle: IC price = comparable uncontrolled p
 * @see TP-07 — TP adjustment: year-end true-up journal
 * Transfer Pricing Calculator
 *
 * Implements the five OECD transfer pricing methods:
 * - CUP (Comparable Uncontrolled Price)
 * - RPM (Resale Price Method)
 * - CPM (Cost Plus Method)
 * - TNMM (Transactional Net Margin Method)
 * - PSM (Profit Split Method)
 *
 * Each method computes a PLI (Profit Level Indicator) and validates
 * whether the intercompany price falls within the arm's-length range.
 */

export type TpMethod = 'cup' | 'rpm' | 'cpm' | 'tnmm' | 'psm';

export interface TpCalculationInput {
  method: TpMethod;
  transactionValueMinor: number;
  currencyCode: string;
  /** PLI config varies by method — JSON from policy */
  pliConfig: TpPliConfig;
  /** Arm's-length range from policy benchmarking */
  armLengthRange: { low: number; median: number; high: number };
}

export interface TpPliConfig {
  /** CUP: comparable price */
  comparablePrice?: number;
  /** RPM: gross margin % (e.g., 0.30 for 30%) */
  grossMarginPct?: number;
  /** CPM: cost markup % (e.g., 0.15 for 15%) */
  costMarkupPct?: number;
  /** CPM: total cost */
  totalCostMinor?: number;
  /** TNMM: operating expenses */
  operatingExpensesMinor?: number;
  /** TNMM: revenue */
  revenueMinor?: number;
  /** PSM: combined profit */
  combinedProfitMinor?: number;
  /** PSM: party's contribution factor (0-1) */
  contributionFactor?: number;
}

export interface TpCalculationResult {
  method: TpMethod;
  pliValue: number;
  rangeLow: number;
  rangeMedian: number;
  rangeHigh: number;
  result: 'within-range' | 'below-range' | 'above-range';
  adjustmentMinor: number;
  transactionValueMinor: number;
  computedPriceMinor: number;
}

/**
 * Compute the transfer price and validate against arm's-length range.
 */
export function computeTransferPrice(
  input: TpCalculationInput,
): CalculatorResult<TpCalculationResult> {
  const { method, transactionValueMinor, pliConfig, armLengthRange } = input;

  let pliValue: number;
  let computedPriceMinor: number;

  switch (method) {
    case 'cup':
      computedPriceMinor = pliConfig.comparablePrice ?? transactionValueMinor;
      pliValue = computedPriceMinor;
      break;

    case 'rpm': {
      const grossMargin = pliConfig.grossMarginPct ?? 0;
      // Resale price = transaction value; arm's-length price = resale * (1 - margin)
      computedPriceMinor = Math.round(transactionValueMinor * (1 - grossMargin));
      pliValue = grossMargin;
      break;
    }

    case 'cpm': {
      const markup = pliConfig.costMarkupPct ?? 0;
      const totalCost = pliConfig.totalCostMinor ?? transactionValueMinor;
      // Arm's-length price = cost * (1 + markup)
      computedPriceMinor = Math.round(totalCost * (1 + markup));
      pliValue = markup;
      break;
    }

    case 'tnmm': {
      const opex = pliConfig.operatingExpensesMinor ?? 0;
      const revenue = pliConfig.revenueMinor ?? transactionValueMinor;
      // Net margin = (revenue - opex) / revenue
      pliValue = revenue === 0 ? 0 : (revenue - opex) / revenue;
      computedPriceMinor = transactionValueMinor;
      break;
    }

    case 'psm': {
      const combinedProfit = pliConfig.combinedProfitMinor ?? 0;
      const factor = pliConfig.contributionFactor ?? 0.5;
      // Allocated profit = combined profit * contribution factor
      computedPriceMinor = Math.round(combinedProfit * factor);
      pliValue = factor;
      break;
    }

    default:
      throw new Error(`Unknown TP method: ${method}`);
  }

  // Determine if within arm's-length range
  let resultStatus: 'within-range' | 'below-range' | 'above-range';
  let adjustmentMinor = 0;

  if (pliValue < armLengthRange.low) {
    resultStatus = 'below-range';
    // Adjustment to bring to median
    adjustmentMinor = computeAdjustment(
      method,
      pliValue,
      armLengthRange.median,
      transactionValueMinor,
      pliConfig,
    );
  } else if (pliValue > armLengthRange.high) {
    resultStatus = 'above-range';
    adjustmentMinor = computeAdjustment(
      method,
      pliValue,
      armLengthRange.median,
      transactionValueMinor,
      pliConfig,
    );
  } else {
    resultStatus = 'within-range';
  }

  return {
    result: {
      method,
      pliValue,
      rangeLow: armLengthRange.low,
      rangeMedian: armLengthRange.median,
      rangeHigh: armLengthRange.high,
      result: resultStatus,
      adjustmentMinor,
      transactionValueMinor,
      computedPriceMinor,
    },
    inputs: { method, transactionValueMinor, currencyCode: input.currencyCode },
    explanation: `TP ${method}: PLI=${pliValue.toFixed(4)}, range [${armLengthRange.low}–${armLengthRange.high}], status=${resultStatus}, adj=${adjustmentMinor}`,
  };
}

function computeAdjustment(
  method: TpMethod,
  currentPli: number,
  targetPli: number,
  transactionValue: number,
  pliConfig: TpPliConfig,
): number {
  switch (method) {
    case 'cup':
      return Math.round(targetPli - currentPli);

    case 'rpm': {
      // Adjust transaction value to achieve target margin
      const currentPrice = Math.round(transactionValue * (1 - currentPli));
      const targetPrice = Math.round(transactionValue * (1 - targetPli));
      return Math.abs(targetPrice - currentPrice);
    }

    case 'cpm': {
      const totalCost = pliConfig.totalCostMinor ?? transactionValue;
      const currentPrice = Math.round(totalCost * (1 + currentPli));
      const targetPrice = Math.round(totalCost * (1 + targetPli));
      return Math.abs(targetPrice - currentPrice);
    }

    case 'tnmm': {
      const revenue = pliConfig.revenueMinor ?? transactionValue;
      return Math.abs(Math.round(revenue * (targetPli - currentPli)));
    }

    case 'psm': {
      const combined = pliConfig.combinedProfitMinor ?? 0;
      return Math.abs(Math.round(combined * (targetPli - currentPli)));
    }

    default:
      return 0;
  }
}

/**
 * Validate that a TP calculation result is consistent.
 */
export function validateTpResult(
  tpResult: TpCalculationResult,
): CalculatorResult<{ valid: boolean; message: string }> {
  if (tpResult.result === 'within-range' && tpResult.adjustmentMinor !== 0) {
    return {
      result: { valid: false, message: 'Within-range result should have zero adjustment' },
      inputs: { method: tpResult.method, resultStatus: tpResult.result },
      explanation: 'Validation failed: within-range with non-zero adjustment',
    };
  }
  if (tpResult.result !== 'within-range' && tpResult.adjustmentMinor === 0) {
    return {
      result: { valid: false, message: 'Out-of-range result should have non-zero adjustment' },
      inputs: { method: tpResult.method, resultStatus: tpResult.result },
      explanation: 'Validation failed: out-of-range with zero adjustment',
    };
  }
  return {
    result: { valid: true, message: 'OK' },
    inputs: { method: tpResult.method, resultStatus: tpResult.result },
    explanation: 'TP result validation passed',
  };
}
