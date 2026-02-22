/**
 * IAS 41.26 — Biological Asset Gain/Loss Analysis
 *
 * Decomposes the total fair value change into price change,
 * physical change, and costs-to-sell movement for disclosure.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BioAssetGainLossInput = {
  openingFvMinor: number;
  closingFvMinor: number;
  purchasesMinor: number;
  disposalsMinor: number;
  harvestFvMinor: number;
  openingCtsMinor: number;
  closingCtsMinor: number;
};

export type BioAssetGainLossResult = {
  totalChangeMinor: number;
  fvChangeMinor: number;
  ctsMovementMinor: number;
  netGainLossMinor: number;
  explanation: string;
};

export function analyseBioAssetGainLoss(
  inputs: BioAssetGainLossInput,
): CalculatorResult<BioAssetGainLossResult> {
  const {
    openingFvMinor, closingFvMinor, purchasesMinor,
    disposalsMinor, harvestFvMinor, openingCtsMinor, closingCtsMinor,
  } = inputs;

  if (openingFvMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Opening FV cannot be negative');

  const totalChangeMinor = closingFvMinor - openingFvMinor;
  const fvChangeMinor = totalChangeMinor - purchasesMinor + disposalsMinor + harvestFvMinor;
  const ctsMovementMinor = closingCtsMinor - openingCtsMinor;
  const netGainLossMinor = fvChangeMinor - ctsMovementMinor;

  const explanation =
    `Bio asset FV change: ${totalChangeMinor}, ` +
    `attributable FV movement: ${fvChangeMinor}, ` +
    `CTS movement: ${ctsMovementMinor}, ` +
    `net gain/loss to P&L: ${netGainLossMinor} (IAS 41.26)`;

  return {
    result: { totalChangeMinor, fvChangeMinor, ctsMovementMinor, netGainLossMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
