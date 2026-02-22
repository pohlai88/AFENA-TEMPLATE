/**
 * IFRS 2.44-52 — SBP Disclosure Computation
 *
 * Computes disclosure amounts for share-based payment arrangements:
 * expense recognised, outstanding instruments, and weighted averages.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type SbpGrant = {
  grantId: string;
  settlementType: 'equity' | 'cash';
  instrumentsOutstanding: number;
  weightedAvgExercisePriceMinor: number;
  expenseThisPeriodMinor: number;
};

export type SbpDisclosureInput = {
  grants: SbpGrant[];
};

export type SbpDisclosureResult = {
  totalExpenseMinor: number;
  equitySettledExpenseMinor: number;
  cashSettledExpenseMinor: number;
  totalInstrumentsOutstanding: number;
  weightedAvgExercisePriceMinor: number;
  explanation: string;
};

export function computeSbpDisclosure(
  inputs: SbpDisclosureInput,
): CalculatorResult<SbpDisclosureResult> {
  const { grants } = inputs;

  if (grants.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one grant required');

  const totalExpenseMinor = grants.reduce((s, g) => s + g.expenseThisPeriodMinor, 0);
  const equitySettledExpenseMinor = grants.filter((g) => g.settlementType === 'equity').reduce((s, g) => s + g.expenseThisPeriodMinor, 0);
  const cashSettledExpenseMinor = grants.filter((g) => g.settlementType === 'cash').reduce((s, g) => s + g.expenseThisPeriodMinor, 0);
  const totalInstrumentsOutstanding = grants.reduce((s, g) => s + g.instrumentsOutstanding, 0);

  const weightedAvgExercisePriceMinor = totalInstrumentsOutstanding > 0
    ? Math.round(grants.reduce((s, g) => s + g.weightedAvgExercisePriceMinor * g.instrumentsOutstanding, 0) / totalInstrumentsOutstanding)
    : 0;

  const explanation =
    `SBP disclosure (IFRS 2.44): total expense ${totalExpenseMinor} ` +
    `(equity ${equitySettledExpenseMinor}, cash ${cashSettledExpenseMinor}), ` +
    `${totalInstrumentsOutstanding} instruments outstanding, WAEP ${weightedAvgExercisePriceMinor}`;

  return {
    result: { totalExpenseMinor, equitySettledExpenseMinor, cashSettledExpenseMinor, totalInstrumentsOutstanding, weightedAvgExercisePriceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
