/**
 * IAS 2.23 — FIFO Costing
 *
 * Computes inventory cost using the First-In-First-Out method.
 * Items purchased or produced first are sold/consumed first.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type FifoLayer = {
  quantity: number;
  unitCostMinor: number;
  dateAcquired: string;
};

export type FifoCostingInput = {
  layers: FifoLayer[];
  quantityToConsume: number;
};

export type FifoCostingResult = {
  costOfGoodsSoldMinor: number;
  remainingLayers: FifoLayer[];
  remainingQuantity: number;
  remainingValueMinor: number;
  explanation: string;
};

export function computeFifoCosting(
  inputs: FifoCostingInput,
): CalculatorResult<FifoCostingResult> {
  const { layers, quantityToConsume } = inputs;

  if (quantityToConsume < 0) throw new DomainError('VALIDATION_FAILED', 'Quantity to consume cannot be negative');

  const totalAvailable = layers.reduce((s, l) => s + l.quantity, 0);
  if (quantityToConsume > totalAvailable) {
    throw new DomainError('VALIDATION_FAILED', `Insufficient inventory: need ${quantityToConsume}, have ${totalAvailable}`);
  }

  let remaining = quantityToConsume;
  let costOfGoodsSoldMinor = 0;
  const remainingLayers: FifoLayer[] = [];

  const sorted = [...layers].sort((a, b) => a.dateAcquired.localeCompare(b.dateAcquired));

  for (const layer of sorted) {
    if (remaining <= 0) {
      remainingLayers.push({ ...layer });
      continue;
    }
    const consumed = Math.min(remaining, layer.quantity);
    costOfGoodsSoldMinor += Math.round(consumed * layer.unitCostMinor);
    remaining -= consumed;
    if (layer.quantity - consumed > 0) {
      remainingLayers.push({ ...layer, quantity: layer.quantity - consumed });
    }
  }

  const remainingQuantity = remainingLayers.reduce((s, l) => s + l.quantity, 0);
  const remainingValueMinor = remainingLayers.reduce((s, l) => s + Math.round(l.quantity * l.unitCostMinor), 0);

  const explanation =
    `FIFO costing (IAS 2.23): consumed ${quantityToConsume} units, COGS ${costOfGoodsSoldMinor}, ` +
    `remaining ${remainingQuantity} units valued at ${remainingValueMinor}`;

  return {
    result: { costOfGoodsSoldMinor, remainingLayers, remainingQuantity, remainingValueMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
