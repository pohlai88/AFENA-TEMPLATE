/**
 * IAS 41.13 — Harvest at Fair Value
 *
 * Computes the initial measurement of agricultural produce at the
 * point of harvest. The FV less CTS at harvest becomes the deemed
 * cost for IAS 2 (Inventories).
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type HarvestAtFairValueInput = {
  assetId: string;
  produceType: string;
  quantityHarvested: number;
  uom: string;
  fvPerUnitMinor: number;
  costsToSellPerUnitMinor: number;
};

export type HarvestAtFairValueResult = {
  totalFvMinor: number;
  totalCtsMinor: number;
  inventoryCostMinor: number;
  costPerUnitMinor: number;
  explanation: string;
};

export function computeHarvestAtFairValue(
  inputs: HarvestAtFairValueInput,
): CalculatorResult<HarvestAtFairValueResult> {
  const { quantityHarvested, fvPerUnitMinor, costsToSellPerUnitMinor } = inputs;

  if (quantityHarvested <= 0) throw new DomainError('VALIDATION_FAILED', 'Quantity harvested must be positive');
  if (fvPerUnitMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Fair value per unit cannot be negative');
  if (costsToSellPerUnitMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Costs to sell cannot be negative');

  const totalFvMinor = Math.round(quantityHarvested * fvPerUnitMinor);
  const totalCtsMinor = Math.round(quantityHarvested * costsToSellPerUnitMinor);
  const inventoryCostMinor = Math.max(0, totalFvMinor - totalCtsMinor);
  const costPerUnitMinor = Math.round(inventoryCostMinor / quantityHarvested);

  const explanation =
    `Harvest ${quantityHarvested} ${inputs.uom}: FV ${totalFvMinor} - CTS ${totalCtsMinor} = ` +
    `inventory cost ${inventoryCostMinor} (${costPerUnitMinor}/unit) (IAS 41.13)`;

  return {
    result: { totalFvMinor, totalCtsMinor, inventoryCostMinor, costPerUnitMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
