import type { CalculatorResult } from 'afenda-canon';

/**
 * @see PR-01 — Provision recognition criteria (IAS 37 §14)
 * @see PR-02 — Best estimate measurement (IAS 37 §36–40)
 * @see PR-03 — Discount rate for long-term provisions (IAS 37 §45–47)
 * @see PR-06 — Contingent liability disclosure (not recognized)
 * @see PR-10 — Provision adequacy review at each reporting date
 *
 * IAS 37 Provision Calculators
 *
 * Pure deterministic functions — no I/O, no side effects.
 */

export type ProvisionResult = {
  shouldRecognise: boolean;
  bestEstimateMinor: number;
  presentValueMinor: number | null;
  explanation: string;
};

export type UnwindResult = {
  unwindChargeMinor: number;
  newCarryingMinor: number;
  explanation: string;
};

/**
 * Determines whether a provision should be recognised under IAS 37.14:
 *  - Present obligation from past event
 *  - Probable outflow of resources
 *  - Reliable estimate of the amount
 *
 * If a discount rate is provided, computes present value.
 */
export function recogniseProvision(inputs: {
  isProbable: boolean;
  canEstimate: boolean;
  bestEstimateMinor: number;
  discountRate?: number;
  periodsToSettlement?: number;
}): CalculatorResult<ProvisionResult> {
  const { isProbable, canEstimate, bestEstimateMinor, discountRate, periodsToSettlement } = inputs;

  if (!isProbable || !canEstimate) {
    const explanation = !isProbable
      ? 'Outflow not probable — disclose as contingent liability if possible'
      : 'Cannot make reliable estimate — disclose as contingent liability';
    return {
      result: {
        shouldRecognise: false,
        bestEstimateMinor: 0,
        presentValueMinor: null,
        explanation,
      },
      inputs,
      explanation,
    };
  }

  let presentValueMinor: number | null = null;
  if (discountRate && discountRate > 0 && periodsToSettlement && periodsToSettlement > 0) {
    presentValueMinor = Math.round(
      bestEstimateMinor / Math.pow(1 + discountRate, periodsToSettlement),
    );
  }

  const explanation = presentValueMinor
    ? `Recognise provision at PV ${presentValueMinor} (best estimate ${bestEstimateMinor}, rate ${discountRate}, ${periodsToSettlement} periods)`
    : `Recognise provision at best estimate ${bestEstimateMinor}`;

  return {
    result: { shouldRecognise: true, bestEstimateMinor, presentValueMinor, explanation },
    inputs,
    explanation,
  };
}

/**
 * Computes the discount unwinding charge for a provision measured at PV.
 * IAS 37.60: increase in provision due to passage of time → finance cost.
 */
export function unwindDiscount(inputs: {
  currentCarryingMinor: number;
  discountRate: number;
}): CalculatorResult<UnwindResult> {
  const { currentCarryingMinor, discountRate } = inputs;

  if (discountRate <= 0) {
    const explanation = 'No discount rate — no unwinding required';
    return {
      result: { unwindChargeMinor: 0, newCarryingMinor: currentCarryingMinor, explanation },
      inputs,
      explanation,
    };
  }

  const unwindChargeMinor = Math.round(currentCarryingMinor * discountRate);
  const newCarryingMinor = currentCarryingMinor + unwindChargeMinor;

  const explanation = `Unwind ${unwindChargeMinor} at rate ${discountRate} — new carrying amount ${newCarryingMinor}`;
  return {
    result: { unwindChargeMinor, newCarryingMinor, explanation },
    inputs,
    explanation,
  };
}
