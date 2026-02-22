import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * SR-09 — Earnings Per Share (IAS 33)
 * Pure function — no I/O.
 */

export type EpsInput = { netIncomeMinor: number; preferredDividendsMinor: number; weightedAvgShares: number; dilutiveOptions: number; optionExercisePrice: number; marketPrice: number };

export type EpsResult = { basicEpsMinor: number; dilutedEpsMinor: number; dilutiveSharesAdded: number; earningsForBasicMinor: number; earningsForDilutedMinor: number };

export function computeEarningsPerShare(input: EpsInput): CalculatorResult<EpsResult> {
  if (input.weightedAvgShares <= 0) throw new DomainError('VALIDATION_FAILED', 'Weighted average shares must be positive');
  const earningsForBasicMinor = input.netIncomeMinor - input.preferredDividendsMinor;
  const basicEpsMinor = Math.round(earningsForBasicMinor / input.weightedAvgShares);

  let dilutiveSharesAdded = 0;
  if (input.dilutiveOptions > 0 && input.marketPrice > input.optionExercisePrice) {
    const proceedsPerShare = input.optionExercisePrice;
    const sharesBuyback = Math.floor(input.dilutiveOptions * proceedsPerShare / input.marketPrice);
    dilutiveSharesAdded = input.dilutiveOptions - sharesBuyback;
  }

  const dilutedShares = input.weightedAvgShares + dilutiveSharesAdded;
  const dilutedEpsMinor = Math.round(earningsForBasicMinor / dilutedShares);

  return { result: { basicEpsMinor, dilutedEpsMinor, dilutiveSharesAdded, earningsForBasicMinor, earningsForDilutedMinor: earningsForBasicMinor }, inputs: input, explanation: `EPS: basic=${basicEpsMinor}, diluted=${dilutedEpsMinor}, dilutive shares=${dilutiveSharesAdded}` };
}
