import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * FA-09 — Intercompany Asset Transfer
 *
 * Computes transfer values and journal entries when an asset moves between
 * companies or cost centers. Handles NBV transfer and IC gain/loss elimination.
 *
 * Pure function — no I/O.
 */

export type AssetTransferInput = {
  assetId: string;
  fromCompanyId: string;
  toCompanyId: string;
  costMinor: number;
  accumulatedDepreciationMinor: number;
  transferPriceMinor: number;
  transferDateIso: string;
};

export type AssetTransferResult = {
  assetId: string;
  nbvAtTransferMinor: number;
  transferPriceMinor: number;
  icGainLossMinor: number;
  requiresElimination: boolean;
  fromCompanyDerecognitionMinor: number;
  toCompanyCostMinor: number;
};

export function computeAssetTransfer(
  input: AssetTransferInput,
): CalculatorResult<AssetTransferResult> {
  if (input.costMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Asset cost must be positive');
  }
  if (input.fromCompanyId === input.toCompanyId) {
    throw new DomainError('VALIDATION_FAILED', 'From and to company must differ for IC transfer');
  }

  const nbvAtTransferMinor = input.costMinor - input.accumulatedDepreciationMinor;
  const icGainLossMinor = input.transferPriceMinor - nbvAtTransferMinor;
  const requiresElimination = icGainLossMinor !== 0;

  return {
    result: {
      assetId: input.assetId,
      nbvAtTransferMinor,
      transferPriceMinor: input.transferPriceMinor,
      icGainLossMinor,
      requiresElimination,
      fromCompanyDerecognitionMinor: nbvAtTransferMinor,
      toCompanyCostMinor: input.transferPriceMinor,
    },
    inputs: input,
    explanation: `IC asset transfer: NBV=${nbvAtTransferMinor}, price=${input.transferPriceMinor}, IC gain/loss=${icGainLossMinor}`,
  };
}
