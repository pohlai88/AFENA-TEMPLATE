/**
 * @see TX-08 — Tax provision calculation (current + deferred)
 * IAS 12 Deferred Tax Calculators
 *
 * Pure deterministic functions — no I/O.
 */

import type { CalculatorResult } from 'afenda-canon';

export type TemporaryDifference = {
  accountId: string;
  carryingMinor: number;
  taxBaseMinor: number;
  differenceMinor: number;
  differenceType: 'taxable' | 'deductible';
};

export type DeferredTaxResult = {
  dtaMinor: number;
  dtlMinor: number;
  netPositionMinor: number;
  movementMinor: number;
  differences: TemporaryDifference[];
  explanation: string;
};

/**
 * IAS 12.5 — Identify temporary differences between carrying amounts
 * and tax bases for each account.
 */
export function calculateTemporaryDifferences(
  items: Array<{ accountId: string; carryingMinor: number; taxBaseMinor: number }>,
): CalculatorResult<TemporaryDifference[]> {
  const result: TemporaryDifference[] = items.map((item) => {
    const differenceMinor = item.carryingMinor - item.taxBaseMinor;
    return {
      accountId: item.accountId,
      carryingMinor: item.carryingMinor,
      taxBaseMinor: item.taxBaseMinor,
      differenceMinor,
      differenceType: differenceMinor > 0 ? 'taxable' : 'deductible',
    };
  });
  const explanation = `Identified ${result.length} temporary differences from ${items.length} items`;
  return {
    result,
    inputs: { items },
    explanation,
  };
}

/**
 * IAS 12.15/24 — Compute deferred tax asset (DTA) and liability (DTL).
 *
 * DTL = taxable temporary differences × tax rate
 * DTA = deductible temporary differences × tax rate (if probable future taxable profit)
 */
export function computeDeferredTax(inputs: {
  differences: TemporaryDifference[];
  taxRate: number;
  priorDtaMinor?: number;
  priorDtlMinor?: number;
}): CalculatorResult<DeferredTaxResult> {
  const { differences, taxRate, priorDtaMinor = 0, priorDtlMinor = 0 } = inputs;

  let dtlMinor = 0;
  let dtaMinor = 0;

  for (const diff of differences) {
    const taxEffect = Math.round(Math.abs(diff.differenceMinor) * taxRate);
    if (diff.differenceType === 'taxable') {
      dtlMinor += taxEffect;
    } else {
      dtaMinor += taxEffect;
    }
  }

  const netPositionMinor = dtaMinor - dtlMinor;
  const priorNet = priorDtaMinor - priorDtlMinor;
  const movementMinor = netPositionMinor - priorNet;

  const explanation = `DTA: ${dtaMinor}, DTL: ${dtlMinor}, net: ${netPositionMinor}, movement: ${movementMinor}`;
  return {
    result: {
      dtaMinor,
      dtlMinor,
      netPositionMinor,
      movementMinor,
      differences,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
