import type { CalculatorResult } from 'afenda-canon';

/**
 * IAS 2 Inventory Valuation Calculators
 *
 * Pure deterministic functions — no I/O.
 */

export type InventoryCostResult = {
  unitCostMinor: number;
  totalCostMinor: number;
  method: 'fifo' | 'weighted-average' | 'specific-identification';
  explanation: string;
};

export type NrvTestResult = {
  costMinor: number;
  nrvMinor: number;
  carryingMinor: number;
  writedownMinor: number;
  explanation: string;
};

/**
 * IAS 2.23-27 — Compute inventory cost using the specified formula.
 *
 * FIFO: first-in, first-out — uses provided layers.
 * Weighted-average: total cost / total qty.
 * Specific: direct identification (identity preserved).
 */
export function computeInventoryCost(inputs: {
  method: 'fifo' | 'weighted-average' | 'specific-identification';
  totalCostMinor: number;
  quantityOnHand: number;
}): CalculatorResult<InventoryCostResult> {
  const { method, totalCostMinor, quantityOnHand } = inputs;

  if (quantityOnHand <= 0) {
    const explanation = 'Zero or negative quantity — no cost';
    return {
      result: { unitCostMinor: 0, totalCostMinor: 0, method, explanation },
      inputs,
      explanation,
    };
  }

  const unitCostMinor = Math.round(totalCostMinor / quantityOnHand);

  const explanation = `${method}: unit cost ${unitCostMinor} from ${totalCostMinor} / ${quantityOnHand}`;
  return {
    result: { unitCostMinor, totalCostMinor, method, explanation },
    inputs,
    explanation,
  };
}

/**
 * IAS 2.28-33 — Net realisable value test.
 *
 * Inventories shall be measured at the lower of cost and NRV.
 * NRV = estimated selling price - estimated costs of completion - estimated costs to sell.
 */
export function testNrv(inputs: {
  costMinor: number;
  nrvMinor: number;
}): CalculatorResult<NrvTestResult> {
  const { costMinor, nrvMinor } = inputs;
  const carryingMinor = Math.min(costMinor, nrvMinor);
  const writedownMinor = Math.max(0, costMinor - nrvMinor);

  const explanation =
    writedownMinor > 0
      ? `NRV ${nrvMinor} < cost ${costMinor} — write-down ${writedownMinor}`
      : `NRV ${nrvMinor} ≥ cost ${costMinor} — no write-down`;

  return {
    result: { costMinor, nrvMinor, carryingMinor, writedownMinor, explanation },
    inputs,
    explanation,
  };
}
