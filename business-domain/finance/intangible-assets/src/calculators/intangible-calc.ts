import type { CalculatorResult } from 'afenda-canon';

/**
 * @see IA-04 — Amortization: useful life determination (finite vs indefinit
 * @see IA-05 — Impairment test for indefinite-life intangibles (annual)
 * @see IA-10 — Disclosure: gross carrying amount, accumulated amortization
 * IAS 38 Intangible Asset Calculators
 *
 * Pure deterministic functions — no I/O, no side effects.
 */

export type CapitaliseResult = {
  shouldCapitalise: boolean;
  capitaliseAmountMinor: number;
  expenseAmountMinor: number;
  explanation: string;
};

export type AmortisationResult = {
  periodAmortisationMinor: number;
  newAccumulatedMinor: number;
  newCarryingMinor: number;
  explanation: string;
};

/**
 * Determines whether R&D costs should be capitalised under IAS 38.
 *
 * Research phase → always expense (IAS 38.54)
 * Development phase → capitalise only if all 6 criteria met (IAS 38.57):
 *   1. Technical feasibility
 *   2. Intention to complete
 *   3. Ability to use or sell
 *   4. Future economic benefits
 *   5. Adequate resources
 *   6. Reliable cost measurement
 */
export function capitaliseRnD(inputs: {
  phase: 'research' | 'development';
  costsMinor: number;
  criteriaMet: boolean;
}): CalculatorResult<CapitaliseResult> {
  const { phase, costsMinor, criteriaMet } = inputs;

  if (phase === 'research') {
    const explanation = 'Research phase — always expensed per IAS 38.54';
    return {
      result: {
        shouldCapitalise: false,
        capitaliseAmountMinor: 0,
        expenseAmountMinor: costsMinor,
        explanation,
      },
      inputs: { phase, costsMinor, criteriaMet },
      explanation,
    };
  }

  if (!criteriaMet) {
    const explanation = 'Development phase but IAS 38.57 criteria not met — expensed';
    return {
      result: {
        shouldCapitalise: false,
        capitaliseAmountMinor: 0,
        expenseAmountMinor: costsMinor,
        explanation,
      },
      inputs: { phase, costsMinor, criteriaMet },
      explanation,
    };
  }

  const explanation = `Development phase, criteria met — capitalise ${costsMinor}`;
  return {
    result: {
      shouldCapitalise: true,
      capitaliseAmountMinor: costsMinor,
      expenseAmountMinor: 0,
      explanation,
    },
    inputs: { phase, costsMinor, criteriaMet },
    explanation,
  };
}

/**
 * Computes periodic amortisation for a finite-life intangible.
 *
 * Straight-line: (cost - residual) / usefulLifeMonths
 * Reducing-balance: carryingAmount * (annualRate / 12)
 * Units-of-production: (cost - residual) * (unitsThisPeriod / totalUnits)
 */
export function calculateAmortisation(inputs: {
  acquisitionCostMinor: number;
  residualValueMinor: number;
  accumulatedAmortisationMinor: number;
  accumulatedImpairmentMinor: number;
  usefulLifeMonths: number;
  method: 'straight-line' | 'units-of-production' | 'reducing-balance';
  monthsElapsed?: number;
  unitsThisPeriod?: number;
  totalUnits?: number;
}): CalculatorResult<AmortisationResult> {
  const {
    acquisitionCostMinor,
    residualValueMinor,
    accumulatedAmortisationMinor,
    accumulatedImpairmentMinor,
    usefulLifeMonths,
    method,
    unitsThisPeriod,
    totalUnits,
  } = inputs;

  const carryingAmount =
    acquisitionCostMinor - accumulatedAmortisationMinor - accumulatedImpairmentMinor;
  const depreciableBase = acquisitionCostMinor - residualValueMinor;

  let periodAmortisationMinor: number;

  switch (method) {
    case 'straight-line':
      periodAmortisationMinor = Math.round(depreciableBase / usefulLifeMonths);
      break;

    case 'reducing-balance': {
      const annualRate = 2 / (usefulLifeMonths / 12);
      periodAmortisationMinor = Math.round(carryingAmount * (annualRate / 12));
      break;
    }

    case 'units-of-production':
      if (!unitsThisPeriod || !totalUnits || totalUnits === 0) {
        periodAmortisationMinor = 0;
      } else {
        periodAmortisationMinor = Math.round(depreciableBase * (unitsThisPeriod / totalUnits));
      }
      break;
  }

  // Cap so we never amortise below residual
  const maxAmortisation = carryingAmount - residualValueMinor;
  periodAmortisationMinor = Math.min(periodAmortisationMinor, Math.max(0, maxAmortisation));

  const newAccumulatedMinor = accumulatedAmortisationMinor + periodAmortisationMinor;
  const newCarryingMinor = acquisitionCostMinor - newAccumulatedMinor - accumulatedImpairmentMinor;

  const explanation = `${method}: amortise ${periodAmortisationMinor}, carrying ${newCarryingMinor}`;
  return {
    result: {
      periodAmortisationMinor,
      newAccumulatedMinor,
      newCarryingMinor,
      explanation,
    },
    inputs: {
      acquisitionCostMinor,
      residualValueMinor,
      accumulatedAmortisationMinor,
      accumulatedImpairmentMinor,
      usefulLifeMonths,
      method,
      unitsThisPeriod,
      totalUnits,
    },
    explanation,
  };
}
