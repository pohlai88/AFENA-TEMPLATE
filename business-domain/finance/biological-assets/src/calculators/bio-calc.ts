/**
 * IAS 41 Biological Asset Calculators
 *
 * Pure deterministic functions — no I/O.
 */

import type { CalculatorResult } from 'afenda-canon';

export type BioMeasurementResult = {
  fvLessCtsMinor: number;
  gainLossMinor: number;
  recogniseTo: 'pnl';
  explanation: string;
};

export type HarvestValueResult = {
  /** FV at point of harvest less costs to sell (becomes IAS 2 cost) */
  inventoryCostMinor: number;
  explanation: string;
};

/**
 * IAS 41.12 — Biological asset measured at fair value less costs to sell.
 * Gain/loss on change recognised in P&L for the period.
 */
export function measureBioAsset(inputs: {
  prevFvMinor: number;
  currFvMinor: number;
  costsToSellMinor: number;
}): CalculatorResult<BioMeasurementResult> {
  const { prevFvMinor, currFvMinor, costsToSellMinor } = inputs;
  const fvLessCtsMinor = currFvMinor - costsToSellMinor;
  const prevNet = prevFvMinor - costsToSellMinor;
  const gainLossMinor = fvLessCtsMinor - prevNet;

  const explanation = `FV less CTS: ${fvLessCtsMinor}, gain/loss: ${gainLossMinor} → P&L (IAS 41.26)`;
  return {
    result: {
      fvLessCtsMinor,
      gainLossMinor,
      recogniseTo: 'pnl',
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}

/**
 * IAS 41.13 — Agricultural produce harvested from biological assets
 * is measured at fair value less costs to sell at the point of harvest.
 * This becomes the cost for IAS 2 (Inventories) purposes.
 */
export function computeHarvestValue(inputs: {
  fvAtHarvestMinor: number;
  costsToSellMinor: number;
}): CalculatorResult<HarvestValueResult> {
  const inventoryCostMinor = inputs.fvAtHarvestMinor - inputs.costsToSellMinor;

  const explanation = `Harvest FV ${inputs.fvAtHarvestMinor} - CTS ${inputs.costsToSellMinor} = inventory cost ${inventoryCostMinor}`;
  return {
    result: {
      inventoryCostMinor: Math.max(0, inventoryCostMinor),
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
