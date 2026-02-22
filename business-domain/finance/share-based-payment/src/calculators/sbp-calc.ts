import type { CalculatorResult } from 'afenda-canon';

/**
 * IFRS 2 Share-Based Payment Calculators
 *
 * Pure deterministic functions — no I/O.
 */

export type VestingExpenseResult = {
  /** Cumulative expense to recognise by end of current period */
  cumulativeExpenseMinor: number;
  /** Incremental expense for this period */
  periodExpenseMinor: number;
  /** Adjusted instruments after forfeiture estimate */
  adjustedInstruments: number;
  explanation: string;
};

export type PeriodExpenseResult = {
  expenseMinor: number;
  recogniseTo: 'pnl';
  explanation: string;
};

/**
 * IFRS 2.10–15 — Compute vesting expense for equity-settled SBP.
 *
 * Cumulative expense = (FV at grant × instruments × (1 - forfeitureRate)) × (elapsed / vesting).
 * Period expense = cumulative - previously recognised.
 */
export function computeVestingExpense(inputs: {
  instrumentsGranted: number;
  fairValuePerUnitMinor: number;
  vestingPeriodMonths: number;
  elapsedMonths: number;
  forfeitureRate: number;
  prevCumulativeMinor: number;
}): CalculatorResult<VestingExpenseResult> {
  const {
    instrumentsGranted,
    fairValuePerUnitMinor,
    vestingPeriodMonths,
    elapsedMonths,
    forfeitureRate,
    prevCumulativeMinor,
  } = inputs;

  const adjustedInstruments = Math.round(instrumentsGranted * (1 - forfeitureRate));
  const totalFvMinor = adjustedInstruments * fairValuePerUnitMinor;
  const vestingFraction = Math.min(elapsedMonths / vestingPeriodMonths, 1);
  const cumulativeExpenseMinor = Math.round(totalFvMinor * vestingFraction);
  const periodExpenseMinor = cumulativeExpenseMinor - prevCumulativeMinor;

  const explanation = `${adjustedInstruments} instruments × FV ${fairValuePerUnitMinor} × ${(vestingFraction * 100).toFixed(1)}% vested = cumulative ${cumulativeExpenseMinor}; period ${periodExpenseMinor} (IFRS 2.10)`;
  return {
    result: { cumulativeExpenseMinor, periodExpenseMinor, adjustedInstruments, explanation },
    inputs,
    explanation,
  };
}

/**
 * IFRS 2.51 — Compute period expense (used for both equity and cash-settled).
 * Simple wrapper that computes the difference to recognise.
 */
export function computePeriodExpense(inputs: {
  expenseMinor: number;
}): CalculatorResult<PeriodExpenseResult> {
  const explanation = `SBP expense ${inputs.expenseMinor} → P&L (IFRS 2.51)`;
  return {
    result: { expenseMinor: inputs.expenseMinor, recogniseTo: 'pnl', explanation },
    inputs,
    explanation,
  };
}
