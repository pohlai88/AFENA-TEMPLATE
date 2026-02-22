import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FI-06 — Derecognition: transfer of risks and rewards test (IFRS 9 §3.2)
 *
 * Evaluates whether a financial asset should be derecognised based on
 * the transfer of substantially all risks and rewards of ownership.
 *
 * Pure function — no I/O.
 */

export type TransferDetails = {
  assetId: string;
  carryingAmountMinor: number;
  considerationReceivedMinor: number;
  risksTransferredPercent: number;
  rewardsTransferredPercent: number;
  controlRetained: boolean;
};

export type DerecognitionResult = {
  derecognize: boolean;
  reason: 'risks_rewards_transferred' | 'risks_rewards_retained' | 'continuing_involvement';
  gainOrLossMinor: number;
  retainedInterestMinor: number;
};

export function evaluateDerecognition(
  transfer: TransferDetails,
): CalculatorResult<DerecognitionResult> {
  if (!transfer || !transfer.assetId)
    throw new DomainError('VALIDATION_FAILED', 'transfer.assetId is required');
  if (!Number.isInteger(transfer.carryingAmountMinor) || transfer.carryingAmountMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'carryingAmountMinor must be a non-negative integer');
  if (!Number.isInteger(transfer.considerationReceivedMinor) || transfer.considerationReceivedMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'considerationReceivedMinor must be a non-negative integer');
  if (transfer.risksTransferredPercent < 0 || transfer.risksTransferredPercent > 100)
    throw new DomainError('VALIDATION_FAILED', 'risksTransferredPercent must be 0–100');
  if (transfer.rewardsTransferredPercent < 0 || transfer.rewardsTransferredPercent > 100)
    throw new DomainError('VALIDATION_FAILED', 'rewardsTransferredPercent must be 0–100');

  const avgTransferred = (transfer.risksTransferredPercent + transfer.rewardsTransferredPercent) / 2;

  let derecognize: boolean;
  let reason: DerecognitionResult['reason'];
  let retainedInterestMinor: number;

  if (avgTransferred >= 90) {
    derecognize = true;
    reason = 'risks_rewards_transferred';
    retainedInterestMinor = 0;
  } else if (avgTransferred <= 10) {
    derecognize = false;
    reason = 'risks_rewards_retained';
    retainedInterestMinor = transfer.carryingAmountMinor;
  } else {
    derecognize = !transfer.controlRetained;
    reason = 'continuing_involvement';
    const retainedPct = (100 - avgTransferred) / 100;
    retainedInterestMinor = Math.round(transfer.carryingAmountMinor * retainedPct);
  }

  const gainOrLossMinor = derecognize
    ? transfer.considerationReceivedMinor - transfer.carryingAmountMinor + retainedInterestMinor
    : 0;

  return {
    result: { derecognize, reason, gainOrLossMinor, retainedInterestMinor },
    inputs: transfer,
    explanation: derecognize
      ? `Derecognise: ${reason}, gain/loss=${gainOrLossMinor}`
      : `Do not derecognise: ${reason}, retained interest=${retainedInterestMinor}`,
  };
}
