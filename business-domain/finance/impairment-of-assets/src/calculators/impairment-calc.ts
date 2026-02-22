import type { CalculatorResult } from 'afenda-canon';

/**
 * IAS 36 Impairment Calculators
 *
 * Pure deterministic functions — no I/O.
 */

export type ImpairmentCalcResult = {
  recoverableAmountMinor: number;
  isImpaired: boolean;
  lossMinor: number;
  explanation: string;
};

/**
 * IAS 36.18 — Recoverable amount is the higher of:
 *  - Fair value less costs of disposal (FVLCD)
 *  - Value in use (VIU) — present value of future cash flows
 */
export function computeRecoverableAmount(inputs: {
  viuMinor: number;
  fvlcdMinor: number;
}): CalculatorResult<number> {
  const result = Math.max(inputs.viuMinor, inputs.fvlcdMinor);
  const explanation = `Recoverable amount = max(VIU ${inputs.viuMinor}, FVLCD ${inputs.fvlcdMinor}) = ${result}`;
  return {
    result,
    inputs: { viuMinor: inputs.viuMinor, fvlcdMinor: inputs.fvlcdMinor },
    explanation,
  };
}

/**
 * IAS 36.59 — An asset is impaired when carrying amount exceeds recoverable amount.
 * Loss = carrying - recoverable (if positive).
 */
export function testImpairment(inputs: {
  carryingAmountMinor: number;
  viuMinor: number;
  fvlcdMinor: number;
}): CalculatorResult<ImpairmentCalcResult> {
  const { carryingAmountMinor, viuMinor, fvlcdMinor } = inputs;
  const recoverableAmountMinor = computeRecoverableAmount({ viuMinor, fvlcdMinor }).result;
  const lossMinor = Math.max(0, carryingAmountMinor - recoverableAmountMinor);
  const isImpaired = lossMinor > 0;

  const explanation = isImpaired
    ? `Impaired: carrying ${carryingAmountMinor} > recoverable ${recoverableAmountMinor}, loss = ${lossMinor}`
    : `Not impaired: carrying ${carryingAmountMinor} ≤ recoverable ${recoverableAmountMinor}`;
  return {
    result: {
      recoverableAmountMinor,
      isImpaired,
      lossMinor,
      explanation,
    },
    inputs: { carryingAmountMinor, viuMinor, fvlcdMinor },
    explanation,
  };
}
