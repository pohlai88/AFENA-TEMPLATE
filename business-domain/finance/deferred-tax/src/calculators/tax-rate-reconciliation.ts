/**
 * IAS 12.81(c) — Tax Rate Reconciliation
 *
 * Reconciles the effective tax rate to the statutory rate by
 * identifying permanent differences, rate changes, and other items.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ReconciliationItem = {
  description: string;
  amountMinor: number;
  ratePct: number;
};

export type TaxRateReconciliationInput = {
  profitBeforeTaxMinor: number;
  statutoryRate: number;
  permanentDifferences: Array<{ description: string; amountMinor: number }>;
  rateChangeEffect: number;
  foreignRateDifferentials: number;
  otherAdjustments: number;
  actualTaxExpenseMinor: number;
};

export type TaxRateReconciliationResult = {
  statutoryTaxMinor: number;
  effectiveRate: number;
  effectiveRatePct: string;
  reconciliationItems: ReconciliationItem[];
  unexplainedDifferenceMinor: number;
  explanation: string;
};

export function computeTaxRateReconciliation(
  inputs: TaxRateReconciliationInput,
): CalculatorResult<TaxRateReconciliationResult> {
  const {
    profitBeforeTaxMinor, statutoryRate, permanentDifferences,
    rateChangeEffect, foreignRateDifferentials, otherAdjustments, actualTaxExpenseMinor,
  } = inputs;

  if (statutoryRate < 0 || statutoryRate > 1) {
    throw new DomainError('VALIDATION_FAILED', 'Statutory rate must be between 0 and 1');
  }

  const statutoryTaxMinor = Math.round(profitBeforeTaxMinor * statutoryRate);

  const items: ReconciliationItem[] = [
    { description: 'Tax at statutory rate', amountMinor: statutoryTaxMinor, ratePct: statutoryRate * 100 },
  ];

  let reconciledMinor = statutoryTaxMinor;

  for (const pd of permanentDifferences) {
    const effect = Math.round(pd.amountMinor * statutoryRate);
    items.push({ description: pd.description, amountMinor: effect, ratePct: 0 });
    reconciledMinor += effect;
  }

  if (rateChangeEffect !== 0) {
    items.push({ description: 'Rate change effect', amountMinor: Math.round(rateChangeEffect), ratePct: 0 });
    reconciledMinor += Math.round(rateChangeEffect);
  }
  if (foreignRateDifferentials !== 0) {
    items.push({ description: 'Foreign rate differentials', amountMinor: Math.round(foreignRateDifferentials), ratePct: 0 });
    reconciledMinor += Math.round(foreignRateDifferentials);
  }
  if (otherAdjustments !== 0) {
    items.push({ description: 'Other adjustments', amountMinor: Math.round(otherAdjustments), ratePct: 0 });
    reconciledMinor += Math.round(otherAdjustments);
  }

  const unexplainedDifferenceMinor = actualTaxExpenseMinor - reconciledMinor;
  const effectiveRate = profitBeforeTaxMinor !== 0 ? actualTaxExpenseMinor / profitBeforeTaxMinor : 0;

  const explanation =
    `Tax reconciliation (IAS 12.81(c)): statutory ${statutoryTaxMinor} → actual ${actualTaxExpenseMinor}, ` +
    `effective rate ${(effectiveRate * 100).toFixed(2)}%, unexplained ${unexplainedDifferenceMinor}`;

  return {
    result: {
      statutoryTaxMinor,
      effectiveRate,
      effectiveRatePct: `${(effectiveRate * 100).toFixed(2)}%`,
      reconciliationItems: items,
      unexplainedDifferenceMinor,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
