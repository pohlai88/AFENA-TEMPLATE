import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type Subscription = {
  id: string;
  mrrMinor: number;
  renewalDateIso: string;
  churnProbability: number;
};

export type RenewalForecast = {
  expectedMrrMinor: number;
  atRiskMrrMinor: number;
  churnedMrrMinor: number;
  netMrrMinor: number;
};

export function forecastRenewals(
  subscriptions: Subscription[],
  horizonMonths: number = 12,
): CalculatorResult<RenewalForecast> {
  if (!Number.isInteger(horizonMonths) || horizonMonths <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `horizonMonths must be a positive integer, got ${horizonMonths}`,
    );
  }
  let expectedMrrMinor = 0;
  let atRiskMrrMinor = 0;
  let churnedMrrMinor = 0;

  for (const sub of subscriptions) {
    if (sub.churnProbability < 0 || sub.churnProbability > 1) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `churnProbability must be 0..1, got ${sub.churnProbability}`,
      );
    }
    const retained = Math.round(sub.mrrMinor * (1 - sub.churnProbability));
    const churned = sub.mrrMinor - retained;
    expectedMrrMinor += retained;
    churnedMrrMinor += churned;
    if (sub.churnProbability > 0.3) {
      atRiskMrrMinor += sub.mrrMinor;
    }
  }

  return {
    result: {
      expectedMrrMinor,
      atRiskMrrMinor,
      churnedMrrMinor,
      netMrrMinor: expectedMrrMinor,
    },
    inputs: { subscriptions, horizonMonths },
    explanation: `Renewal forecast over ${horizonMonths}mo: expected MRR=${expectedMrrMinor}, at-risk=${atRiskMrrMinor}, churned=${churnedMrrMinor}`,
  };
}
