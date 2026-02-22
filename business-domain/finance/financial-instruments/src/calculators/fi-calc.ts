import type { CalculatorResult } from 'afenda-canon';

/**
 * @see FI-06 — Derecognition: transfer of risks and rewards test
 * @see FI-01 — IFRS 9 classification: amortised cost / FVOCI / FVTPL
 * @see FI-03 — Effective interest rate (EIR) method
 * @see FI-04 — Fair value measurement (Level 1/2/3 hierarchy)
 * @see FI-05 — Expected credit loss (ECL) — simplified + general approach
 * @see FI-07 — Hedge accounting entries (fair value / cash flow)
 *
 * IFRS 9 Financial Instrument Calculators
 *
 * Pure deterministic functions — no I/O, no side effects.
 */

export type Classification = 'amortised-cost' | 'fvoci' | 'fvtpl';

export type ClassificationResult = {
  classification: Classification;
  explanation: string;
};

export type EirResult = {
  interestMinor: number;
  newCarryingMinor: number;
  explanation: string;
};

export type FvChangeResult = {
  changeMinor: number;
  recogniseTo: 'pnl' | 'oci';
  explanation: string;
};

/**
 * IFRS 9 §4.1 classification tree:
 *
 * 1. Business model = hold-to-collect AND SPPI test passes → Amortised Cost
 * 2. Business model = hold-to-collect-and-sell AND SPPI passes → FVOCI
 * 3. All others → FVTPL
 */
export function classifyInstrument(inputs: {
  businessModel: 'hold-to-collect' | 'hold-to-collect-and-sell' | 'other';
  sppiPassed: boolean;
}): CalculatorResult<ClassificationResult> {
  const { businessModel, sppiPassed } = inputs;

  if (businessModel === 'hold-to-collect' && sppiPassed) {
    const explanation = 'Hold-to-collect + SPPI passed → Amortised Cost (IFRS 9 §4.1.2)';
    return {
      result: { classification: 'amortised-cost', explanation },
      inputs: { businessModel, sppiPassed },
      explanation,
    };
  }

  if (businessModel === 'hold-to-collect-and-sell' && sppiPassed) {
    const explanation = 'Hold-to-collect-and-sell + SPPI passed → FVOCI (IFRS 9 §4.1.2A)';
    return {
      result: { classification: 'fvoci', explanation },
      inputs: { businessModel, sppiPassed },
      explanation,
    };
  }

  const explanation = sppiPassed
    ? `Business model "${businessModel}" → FVTPL (IFRS 9 §4.1.4)`
    : 'SPPI test failed → FVTPL (IFRS 9 §4.1.4)';
  return {
    result: { classification: 'fvtpl', explanation },
    inputs: { businessModel, sppiPassed },
    explanation,
  };
}

/**
 * Computes periodic interest accrual using the effective interest rate.
 * EIR method: interest = carrying_amount * effective_rate / 12
 */
export function computeEffectiveInterest(inputs: {
  carryingMinor: number;
  effectiveRate: number;
}): CalculatorResult<EirResult> {
  const { carryingMinor, effectiveRate } = inputs;

  const monthlyRate = effectiveRate / 12;
  const interestMinor = Math.round(carryingMinor * monthlyRate);
  const newCarryingMinor = carryingMinor + interestMinor;

  const explanation = `EIR accrual: ${interestMinor} at monthly rate ${(monthlyRate * 100).toFixed(4)}%`;
  return {
    result: { interestMinor, newCarryingMinor, explanation },
    inputs: { carryingMinor, effectiveRate },
    explanation,
  };
}

/**
 * Routes fair value change to P&L or OCI based on classification.
 *
 * - FVTPL → all changes to P&L
 * - FVOCI → changes to OCI (reclassified to P&L on derecognition)
 * - Amortised Cost → no FV changes (EIR method only)
 */
export function computeFairValueChange(inputs: {
  prevFvMinor: number;
  currFvMinor: number;
  classification: Classification;
}): CalculatorResult<FvChangeResult> {
  const { prevFvMinor, currFvMinor, classification } = inputs;
  const changeMinor = currFvMinor - prevFvMinor;

  if (classification === 'amortised-cost') {
    const explanation = 'Amortised cost — no FV change recognised (EIR method only)';
    return {
      result: { changeMinor: 0, recogniseTo: 'pnl', explanation },
      inputs: { prevFvMinor, currFvMinor, classification },
      explanation,
    };
  }

  const recogniseTo = classification === 'fvtpl' ? 'pnl' : 'oci';
  const explanation = `FV change ${changeMinor} → ${recogniseTo.toUpperCase()} (${classification})`;
  return {
    result: { changeMinor, recogniseTo, explanation },
    inputs: { prevFvMinor, currFvMinor, classification },
    explanation,
  };
}
