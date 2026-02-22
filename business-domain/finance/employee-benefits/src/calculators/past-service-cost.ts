/**
 * IAS 19.103 — Past Service Cost
 *
 * Past service cost is the change in the present value of the DBO
 * resulting from a plan amendment or curtailment. Recognised immediately
 * in P&L when the amendment/curtailment occurs.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type PastServiceCostInput = {
  priorDboMinor: number;
  revisedDboMinor: number;
  amendmentType: 'benefit-increase' | 'benefit-decrease' | 'plan-closure';
};

export type PastServiceCostResult = {
  pastServiceCostMinor: number;
  isCredit: boolean;
  recogniseTo: 'pnl';
  explanation: string;
};

export function computePastServiceCost(
  inputs: PastServiceCostInput,
): CalculatorResult<PastServiceCostResult> {
  const { priorDboMinor, revisedDboMinor, amendmentType } = inputs;

  if (priorDboMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Prior DBO cannot be negative');

  const pastServiceCostMinor = revisedDboMinor - priorDboMinor;
  const isCredit = pastServiceCostMinor < 0;

  const explanation =
    `Past service cost (IAS 19.103, ${amendmentType}): DBO ${priorDboMinor} → ${revisedDboMinor}, ` +
    `${isCredit ? 'credit' : 'cost'} ${Math.abs(pastServiceCostMinor)} recognised immediately in P&L`;

  return {
    result: { pastServiceCostMinor, isCredit, recogniseTo: 'pnl', explanation },
    inputs: { ...inputs },
    explanation,
  };
}
