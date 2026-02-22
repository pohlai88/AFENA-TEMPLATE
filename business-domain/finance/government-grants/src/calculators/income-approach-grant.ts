/**
 * IAS 20.26 — Income Approach Grant
 *
 * Grants related to income are recognised in P&L on a systematic
 * basis over the periods in which the related costs are recognised.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IncomeApproachGrantInput = {
  grantAmountMinor: number;
  relatedCostsThisPeriodMinor: number;
  totalExpectedCostsMinor: number;
  priorRecognisedMinor: number;
};

export type IncomeApproachGrantResult = {
  periodIncomeMinor: number;
  cumulativeRecognisedMinor: number;
  deferredBalanceMinor: number;
  explanation: string;
};

export function computeIncomeApproachGrant(
  inputs: IncomeApproachGrantInput,
): CalculatorResult<IncomeApproachGrantResult> {
  const { grantAmountMinor, relatedCostsThisPeriodMinor, totalExpectedCostsMinor, priorRecognisedMinor } = inputs;

  if (grantAmountMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Grant amount must be positive');
  if (totalExpectedCostsMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Total expected costs must be positive');

  const costRatio = relatedCostsThisPeriodMinor / totalExpectedCostsMinor;
  const periodIncomeMinor = Math.round(grantAmountMinor * costRatio);
  const cumulativeRecognisedMinor = Math.min(grantAmountMinor, priorRecognisedMinor + periodIncomeMinor);
  const deferredBalanceMinor = grantAmountMinor - cumulativeRecognisedMinor;

  const explanation =
    `Income approach (IAS 20.26): costs ${relatedCostsThisPeriodMinor}/${totalExpectedCostsMinor} = ` +
    `${(costRatio * 100).toFixed(1)}%, income ${periodIncomeMinor}, deferred ${deferredBalanceMinor}`;

  return {
    result: { periodIncomeMinor, cumulativeRecognisedMinor, deferredBalanceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
