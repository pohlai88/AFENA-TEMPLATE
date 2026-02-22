import type { CalculatorResult } from 'afenda-canon';

/**
 * @see PA-10 — Grant accounting: conditions + deferred income
 * IAS 20 Government Grant Calculators
 */

export type GrantAmortisationResult = {
  periodAmortisationMinor: number;
  remainingDeferredMinor: number;
  explanation: string;
};

/**
 * IAS 20.12 — Systematic recognition of grant income over the periods
 * in which the related costs are recognised.
 *
 * For capital approach: amortise over useful life of related asset.
 * For income approach: offset against related expense.
 */
export function computeGrantAmortisation(inputs: {
  totalGrantMinor: number;
  cumulativeAmortisedMinor: number;
  usefulLifeMonths: number;
}): CalculatorResult<GrantAmortisationResult> {
  const { totalGrantMinor, cumulativeAmortisedMinor, usefulLifeMonths } = inputs;

  if (usefulLifeMonths <= 0) {
    const explanation = 'Zero useful life — no amortisation';
    return {
      result: {
        periodAmortisationMinor: 0,
        remainingDeferredMinor: totalGrantMinor - cumulativeAmortisedMinor,
        explanation,
      },
      inputs: { totalGrantMinor, cumulativeAmortisedMinor, usefulLifeMonths },
      explanation,
    };
  }

  const monthlyAmount = Math.round(totalGrantMinor / usefulLifeMonths);
  const remaining = totalGrantMinor - cumulativeAmortisedMinor;
  const periodAmortisationMinor = Math.min(monthlyAmount, remaining);
  const remainingDeferredMinor = remaining - periodAmortisationMinor;

  const explanation = `Amortise ${periodAmortisationMinor}/month over ${usefulLifeMonths}m, remaining: ${remainingDeferredMinor}`;
  return {
    result: {
      periodAmortisationMinor,
      remainingDeferredMinor,
      explanation,
    },
    inputs: { totalGrantMinor, cumulativeAmortisedMinor, usefulLifeMonths },
    explanation,
  };
}
