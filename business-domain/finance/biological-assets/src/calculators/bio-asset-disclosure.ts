/**
 * IAS 41.40-57 — Biological Asset Disclosure Computation
 *
 * Computes the reconciliation of carrying amounts required by IAS 41.50,
 * including opening balance, increases, decreases, FV changes, and closing.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type BioAssetDisclosureInput = {
  openingCarryingMinor: number;
  purchasesMinor: number;
  salesDisposalsMinor: number;
  fvGainLossMinor: number;
  harvestTransfersMinor: number;
  fxTranslationMinor: number;
};

export type BioAssetDisclosureResult = {
  closingCarryingMinor: number;
  reconciliation: {
    opening: number;
    purchases: number;
    salesDisposals: number;
    fvGainLoss: number;
    harvestTransfers: number;
    fxTranslation: number;
    closing: number;
  };
  explanation: string;
};

export function computeBioAssetDisclosure(
  inputs: BioAssetDisclosureInput,
): CalculatorResult<BioAssetDisclosureResult> {
  const {
    openingCarryingMinor, purchasesMinor, salesDisposalsMinor,
    fvGainLossMinor, harvestTransfersMinor, fxTranslationMinor,
  } = inputs;

  if (openingCarryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Opening carrying amount cannot be negative');

  const closingCarryingMinor =
    openingCarryingMinor +
    purchasesMinor -
    salesDisposalsMinor +
    fvGainLossMinor -
    harvestTransfersMinor +
    fxTranslationMinor;

  const reconciliation = {
    opening: openingCarryingMinor,
    purchases: purchasesMinor,
    salesDisposals: salesDisposalsMinor,
    fvGainLoss: fvGainLossMinor,
    harvestTransfers: harvestTransfersMinor,
    fxTranslation: fxTranslationMinor,
    closing: closingCarryingMinor,
  };

  const explanation =
    `Bio asset reconciliation (IAS 41.50): opening ${openingCarryingMinor} → closing ${closingCarryingMinor}`;

  return {
    result: { closingCarryingMinor, reconciliation, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
