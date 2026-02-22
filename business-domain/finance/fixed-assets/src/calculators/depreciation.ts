import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FA-02 — Depreciation methods: straight-line, declining balance, unit
 */
export type DepreciationMethod =
  | 'straight_line'
  | 'declining_balance'
  | 'double_declining'
  | 'sum_of_years'
  | 'units_of_production';

export type DepreciationResult = {
  periodDepreciationMinor: number;
  accumulatedMinor: number;
  netBookValueMinor: number;
};

export function calculateDepreciation(
  costMinor: number,
  salvageMinor: number,
  usefulLifeMonths: number,
  method: DepreciationMethod,
  elapsedMonths: number,
): CalculatorResult<DepreciationResult> {
  if (!Number.isInteger(costMinor) || costMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `costMinor must be a non-negative integer, got ${costMinor}`,
    );
  }
  if (!Number.isInteger(salvageMinor) || salvageMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `salvageMinor must be a non-negative integer, got ${salvageMinor}`,
    );
  }
  if (!Number.isInteger(usefulLifeMonths) || usefulLifeMonths <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `usefulLifeMonths must be a positive integer, got ${usefulLifeMonths}`,
    );
  }
  if (!Number.isInteger(elapsedMonths) || elapsedMonths < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `elapsedMonths must be a non-negative integer, got ${elapsedMonths}`,
    );
  }

  const depreciableBase = costMinor - salvageMinor;
  if (depreciableBase <= 0) {
    return {
      result: { periodDepreciationMinor: 0, accumulatedMinor: 0, netBookValueMinor: costMinor },
      inputs: { costMinor, salvageMinor, usefulLifeMonths, method, elapsedMonths },
      explanation: 'No depreciation: depreciable base is zero or negative',
    };
  }

  let periodDep: number;
  let accumulated: number;

  switch (method) {
    case 'straight_line': {
      const monthlyDep = Math.round(depreciableBase / usefulLifeMonths);
      periodDep = elapsedMonths >= usefulLifeMonths ? 0 : monthlyDep;
      accumulated = Math.min(
        monthlyDep * Math.min(elapsedMonths, usefulLifeMonths),
        depreciableBase,
      );
      break;
    }
    case 'declining_balance': {
      const rate = 1 / usefulLifeMonths;
      let nbv = costMinor;
      accumulated = 0;
      periodDep = 0;
      for (let m = 0; m < Math.min(elapsedMonths + 1, usefulLifeMonths); m++) {
        const dep = Math.round(nbv * rate);
        if (m === elapsedMonths) {
          periodDep = Math.min(dep, nbv - salvageMinor);
        }
        const actualDep = Math.min(dep, nbv - salvageMinor);
        if (m <= elapsedMonths) accumulated += actualDep;
        nbv -= actualDep;
        if (nbv <= salvageMinor) break;
      }
      break;
    }
    case 'double_declining': {
      const rate = 2 / usefulLifeMonths;
      let nbv = costMinor;
      accumulated = 0;
      periodDep = 0;
      for (let m = 0; m < Math.min(elapsedMonths + 1, usefulLifeMonths); m++) {
        const dep = Math.round(nbv * rate);
        const actualDep = Math.min(dep, nbv - salvageMinor);
        if (m === elapsedMonths) periodDep = Math.max(actualDep, 0);
        if (m <= elapsedMonths) accumulated += Math.max(actualDep, 0);
        nbv -= Math.max(actualDep, 0);
        if (nbv <= salvageMinor) break;
      }
      break;
    }
    case 'sum_of_years': {
      const sumOfYears = (usefulLifeMonths * (usefulLifeMonths + 1)) / 2;
      const remaining = Math.max(usefulLifeMonths - elapsedMonths, 0);
      periodDep = remaining > 0 ? Math.round((remaining / sumOfYears) * depreciableBase) : 0;
      accumulated = 0;
      for (let m = 0; m < Math.min(elapsedMonths, usefulLifeMonths); m++) {
        const r = usefulLifeMonths - m;
        accumulated += Math.round((r / sumOfYears) * depreciableBase);
      }
      accumulated = Math.min(accumulated, depreciableBase);
      break;
    }
    case 'units_of_production': {
      const monthlyDep = Math.round(depreciableBase / usefulLifeMonths);
      periodDep = elapsedMonths >= usefulLifeMonths ? 0 : monthlyDep;
      accumulated = Math.min(
        monthlyDep * Math.min(elapsedMonths, usefulLifeMonths),
        depreciableBase,
      );
      break;
    }
  }

  const netBookValueMinor = costMinor - accumulated;
  return {
    result: {
      periodDepreciationMinor: periodDep,
      accumulatedMinor: accumulated,
      netBookValueMinor,
    },
    inputs: { costMinor, salvageMinor, usefulLifeMonths, method, elapsedMonths },
    explanation: `Depreciation (${method}): period=${periodDep}, accumulated=${accumulated}, NBV=${netBookValueMinor}`,
  };
}
