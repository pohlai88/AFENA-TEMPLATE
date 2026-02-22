/**
 * IAS 2.25 — Weighted Average Cost
 *
 * Computes the weighted average cost per unit for inventory items
 * using the periodic or perpetual weighted average method.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type InventoryMovement = {
  type: 'purchase' | 'return';
  quantity: number;
  unitCostMinor: number;
};

export type WeightedAvgCostInput = {
  openingQuantity: number;
  openingTotalCostMinor: number;
  movements: InventoryMovement[];
};

export type WeightedAvgCostResult = {
  weightedAvgUnitCostMinor: number;
  totalQuantity: number;
  totalCostMinor: number;
  explanation: string;
};

export function computeWeightedAvgCost(
  inputs: WeightedAvgCostInput,
): CalculatorResult<WeightedAvgCostResult> {
  const { openingQuantity, openingTotalCostMinor, movements } = inputs;

  if (openingQuantity < 0) throw new DomainError('VALIDATION_FAILED', 'Opening quantity cannot be negative');

  let totalQuantity = openingQuantity;
  let totalCostMinor = openingTotalCostMinor;

  for (const m of movements) {
    if (m.type === 'purchase') {
      totalQuantity += m.quantity;
      totalCostMinor += Math.round(m.quantity * m.unitCostMinor);
    } else {
      totalQuantity -= m.quantity;
      totalCostMinor -= Math.round(m.quantity * m.unitCostMinor);
    }
  }

  if (totalQuantity < 0) throw new DomainError('VALIDATION_FAILED', 'Resulting quantity cannot be negative');

  const weightedAvgUnitCostMinor = totalQuantity > 0 ? Math.round(totalCostMinor / totalQuantity) : 0;

  const explanation =
    `Weighted avg cost (IAS 2.25): ${totalQuantity} units at ${weightedAvgUnitCostMinor}/unit, total ${totalCostMinor}`;

  return {
    result: { weightedAvgUnitCostMinor, totalQuantity, totalCostMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
