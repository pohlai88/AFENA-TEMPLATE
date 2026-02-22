/**
 * IAS 23.14 — Weighted Average Borrowing Rate
 *
 * Computes the capitalisation rate for general borrowings as the
 * weighted average of borrowing costs / outstanding borrowings.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BorrowingFacility = {
  facilityId: string;
  principalOutstandingMinor: number;
  interestCostMinor: number;
};

export type WeightedAvgBorrowingRateResult = {
  weightedAvgRate: number;
  totalPrincipalMinor: number;
  totalInterestMinor: number;
  explanation: string;
};

export function computeWeightedAvgBorrowingRate(
  inputs: { facilities: BorrowingFacility[] },
): CalculatorResult<WeightedAvgBorrowingRateResult> {
  const { facilities } = inputs;

  if (facilities.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one borrowing facility required');
  }

  const totalPrincipalMinor = facilities.reduce((s, f) => s + f.principalOutstandingMinor, 0);
  const totalInterestMinor = facilities.reduce((s, f) => s + f.interestCostMinor, 0);

  if (totalPrincipalMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Total principal must be positive');
  }

  const weightedAvgRate = totalInterestMinor / totalPrincipalMinor;

  const explanation =
    `Weighted avg borrowing rate: ${totalInterestMinor}/${totalPrincipalMinor} = ` +
    `${(weightedAvgRate * 100).toFixed(4)}% across ${facilities.length} facilities (IAS 23.14)`;

  return {
    result: { weightedAvgRate, totalPrincipalMinor, totalInterestMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
