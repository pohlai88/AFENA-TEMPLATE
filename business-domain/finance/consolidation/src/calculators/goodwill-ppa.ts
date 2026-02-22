import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CO-05 — Goodwill on Acquisition (IFRS 3): Purchase Price Allocation
 *
 * Computes goodwill = consideration transferred − fair value of net identifiable assets.
 * Handles bargain purchase (negative goodwill → recognised immediately in P&L).
 * Pure function — no I/O.
 */

export type IdentifiableAsset = {
  name: string;
  fairValueMinor: number;
};

export type IdentifiableLiability = {
  name: string;
  fairValueMinor: number;
};

export type PpaInput = {
  acquireeId: string;
  considerationTransferredMinor: number;
  nciMeasurementMinor: number;
  previouslyHeldEquityFvMinor: number;
  identifiableAssets: IdentifiableAsset[];
  identifiableLiabilities: IdentifiableLiability[];
};

export type PpaResult = {
  acquireeId: string;
  totalAssetsMinor: number;
  totalLiabilitiesMinor: number;
  netIdentifiableAssetsMinor: number;
  totalConsiderationMinor: number;
  goodwillMinor: number;
  isBargainPurchase: boolean;
  bargainPurchaseGainMinor: number;
};

export function computePurchasePriceAllocation(input: PpaInput): CalculatorResult<PpaResult> {
  const { acquireeId, considerationTransferredMinor, nciMeasurementMinor, previouslyHeldEquityFvMinor, identifiableAssets, identifiableLiabilities } = input;

  if (!acquireeId) throw new DomainError('VALIDATION_FAILED', 'acquireeId is required');
  if (considerationTransferredMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Consideration must be non-negative');

  const totalAssets = identifiableAssets.reduce((s, a) => s + a.fairValueMinor, 0);
  const totalLiabilities = identifiableLiabilities.reduce((s, l) => s + l.fairValueMinor, 0);
  const netIdentifiable = totalAssets - totalLiabilities;

  // IFRS 3 §32: Goodwill = consideration + NCI + previously held equity − net identifiable assets
  const totalConsideration = considerationTransferredMinor + nciMeasurementMinor + previouslyHeldEquityFvMinor;
  const goodwill = totalConsideration - netIdentifiable;

  const isBargain = goodwill < 0;
  const bargainGain = isBargain ? Math.abs(goodwill) : 0;

  return {
    result: {
      acquireeId,
      totalAssetsMinor: totalAssets,
      totalLiabilitiesMinor: totalLiabilities,
      netIdentifiableAssetsMinor: netIdentifiable,
      totalConsiderationMinor: totalConsideration,
      goodwillMinor: isBargain ? 0 : goodwill,
      isBargainPurchase: isBargain,
      bargainPurchaseGainMinor: bargainGain,
    },
    inputs: { acquireeId, considerationTransferredMinor, assetCount: identifiableAssets.length, liabilityCount: identifiableLiabilities.length },
    explanation: isBargain
      ? `Bargain purchase of ${acquireeId}: gain=${bargainGain} recognised in P&L`
      : `Goodwill on acquisition of ${acquireeId}: ${goodwill} (consideration=${totalConsideration} − net assets=${netIdentifiable})`,
  };
}
