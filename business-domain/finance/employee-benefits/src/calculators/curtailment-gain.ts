/**
 * IAS 19.102-103 — Curtailment Gain/Loss
 *
 * A curtailment occurs when an entity significantly reduces the number
 * of employees covered by a plan, or amends the terms so that a
 * significant element of future service will no longer qualify.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CurtailmentGainInput = {
  preCurtailmentDboMinor: number;
  postCurtailmentDboMinor: number;
  unrecognisedPastServiceCostMinor: number;
  planAssetsSettledMinor: number;
};

export type CurtailmentGainResult = {
  curtailmentGainLossMinor: number;
  dboReductionMinor: number;
  isGain: boolean;
  explanation: string;
};

export function computeCurtailmentGain(
  inputs: CurtailmentGainInput,
): CalculatorResult<CurtailmentGainResult> {
  const { preCurtailmentDboMinor, postCurtailmentDboMinor, unrecognisedPastServiceCostMinor, planAssetsSettledMinor } = inputs;

  if (preCurtailmentDboMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Pre-curtailment DBO cannot be negative');

  const dboReductionMinor = preCurtailmentDboMinor - postCurtailmentDboMinor;
  const curtailmentGainLossMinor = dboReductionMinor - unrecognisedPastServiceCostMinor - planAssetsSettledMinor;
  const isGain = curtailmentGainLossMinor > 0;

  const explanation =
    `Curtailment (IAS 19.102): DBO reduction ${dboReductionMinor}, ` +
    `past service cost ${unrecognisedPastServiceCostMinor}, settled ${planAssetsSettledMinor} → ` +
    `${isGain ? 'gain' : 'loss'} ${Math.abs(curtailmentGainLossMinor)} to P&L`;

  return {
    result: { curtailmentGainLossMinor, dboReductionMinor, isGain, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
