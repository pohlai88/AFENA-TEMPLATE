/**
 * IAS 37.86 — Contingent Liability Assessment
 *
 * Evaluates whether an obligation should be disclosed as a contingent
 * liability (not recognised) or recognised as a provision.
 */

import type { CalculatorResult } from 'afenda-canon';

export type ContingentLiabilityInput = {
  description: string;
  isProbable: boolean;
  isPossible: boolean;
  isRemote: boolean;
  canEstimate: boolean;
  bestEstimateMinor?: number;
};

export type ContingentLiabilityResult = {
  classification: 'provision' | 'contingent-liability-disclose' | 'no-disclosure';
  recogniseMinor: number;
  discloseMinor: number;
  explanation: string;
};

export function assessContingentLiability(
  inputs: ContingentLiabilityInput,
): CalculatorResult<ContingentLiabilityResult> {
  const { isProbable, isPossible, isRemote, canEstimate, bestEstimateMinor = 0 } = inputs;

  if (isProbable && canEstimate) {
    const explanation = `Recognise as provision: probable outflow and reliable estimate ${bestEstimateMinor} (IAS 37.14)`;
    return {
      result: { classification: 'provision', recogniseMinor: bestEstimateMinor, discloseMinor: 0, explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  if (isProbable && !canEstimate) {
    const explanation = `Disclose as contingent liability: probable but cannot reliably estimate (IAS 37.86)`;
    return {
      result: { classification: 'contingent-liability-disclose', recogniseMinor: 0, discloseMinor: bestEstimateMinor, explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  if (isPossible && !isRemote) {
    const explanation = `Disclose as contingent liability: possible outflow (IAS 37.86)`;
    return {
      result: { classification: 'contingent-liability-disclose', recogniseMinor: 0, discloseMinor: bestEstimateMinor, explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  const explanation = `No disclosure required: remote possibility (IAS 37.86)`;
  return {
    result: { classification: 'no-disclosure', recogniseMinor: 0, discloseMinor: 0, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
