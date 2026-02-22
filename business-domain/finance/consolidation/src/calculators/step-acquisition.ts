import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CO-07 — Ownership % Change Over Time (Acquisition / Disposal)
 *
 * Step acquisition: remeasure previously held equity interest at acquisition-date
 * fair value, compute gain/loss on remeasurement, calculate new goodwill.
 * Disposal: derecognise subsidiary, compute gain/loss.
 * Pure function — no I/O.
 */

export type StepAcquisitionInput = {
  subsidiaryId: string;
  previousOwnershipPct: number;
  newOwnershipPct: number;
  previousCarryingMinor: number;
  acquisitionDateFairValueMinor: number;
  considerationForNewSharesMinor: number;
  netIdentifiableAssetsMinor: number;
};

export type StepAcquisitionResult = {
  subsidiaryId: string;
  previousOwnershipPct: number;
  newOwnershipPct: number;
  remeasurementGainLossMinor: number;
  goodwillMinor: number;
  totalConsiderationMinor: number;
  isDisposal: boolean;
};

export function computeStepAcquisition(input: StepAcquisitionInput): CalculatorResult<StepAcquisitionResult> {
  const { subsidiaryId, previousOwnershipPct, newOwnershipPct, previousCarryingMinor, acquisitionDateFairValueMinor, considerationForNewSharesMinor, netIdentifiableAssetsMinor } = input;

  if (!subsidiaryId) throw new DomainError('VALIDATION_FAILED', 'subsidiaryId is required');
  if (previousOwnershipPct < 0 || previousOwnershipPct > 100) throw new DomainError('VALIDATION_FAILED', 'previousOwnershipPct must be 0–100');
  if (newOwnershipPct < 0 || newOwnershipPct > 100) throw new DomainError('VALIDATION_FAILED', 'newOwnershipPct must be 0–100');

  const isDisposal = newOwnershipPct < previousOwnershipPct;

  // Remeasurement gain/loss on previously held interest (IFRS 3 §42)
  const remeasurementGainLoss = acquisitionDateFairValueMinor - previousCarryingMinor;

  // Total consideration = FV of previously held + cash for new shares
  const totalConsideration = acquisitionDateFairValueMinor + considerationForNewSharesMinor;

  // Goodwill = total consideration − share of net identifiable assets at new ownership %
  const shareOfNetAssets = Math.round(netIdentifiableAssetsMinor * (newOwnershipPct / 100));
  const goodwill = Math.max(0, totalConsideration - shareOfNetAssets);

  return {
    result: {
      subsidiaryId,
      previousOwnershipPct,
      newOwnershipPct,
      remeasurementGainLossMinor: remeasurementGainLoss,
      goodwillMinor: goodwill,
      totalConsiderationMinor: totalConsideration,
      isDisposal,
    },
    inputs: { subsidiaryId, previousOwnershipPct, newOwnershipPct },
    explanation: isDisposal
      ? `Disposal of ${subsidiaryId}: ownership ${previousOwnershipPct}% → ${newOwnershipPct}%, remeasurement gain/loss=${remeasurementGainLoss}`
      : `Step acquisition of ${subsidiaryId}: ownership ${previousOwnershipPct}% → ${newOwnershipPct}%, goodwill=${goodwill}, remeasurement=${remeasurementGainLoss}`,
  };
}
