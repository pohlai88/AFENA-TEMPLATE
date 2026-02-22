import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FX-06 — FX gain/loss: realized vs unrealized separation
 * FX-04 — Forward Contract Fair Value Calculation
 *
 * Computes mark-to-market fair value of an FX forward contract using
 * spot rate, forward points, discount factor, and notional amount.
 * Pure function — no I/O.
 */

export type ForwardContractInput = {
  contractId: string;
  buyCurrency: string;
  sellCurrency: string;
  notionalMinor: number;
  contractedForwardRate: number;
  currentSpotRate: number;
  currentForwardPoints: number;
  remainingDays: number;
  annualDiscountRatePct: number;
};

export type ForwardContractResult = {
  contractId: string;
  currentForwardRate: number;
  discountFactor: number;
  fairValueMinor: number;
  gainOrLoss: 'gain' | 'loss' | 'zero';
};

export function computeForwardContractFairValue(input: ForwardContractInput): CalculatorResult<ForwardContractResult> {
  const { contractId, notionalMinor, contractedForwardRate, currentSpotRate, currentForwardPoints, remainingDays, annualDiscountRatePct } = input;

  if (!contractId) throw new DomainError('VALIDATION_FAILED', 'contractId is required');
  if (notionalMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'notionalMinor must be positive');
  if (contractedForwardRate <= 0) throw new DomainError('VALIDATION_FAILED', 'contractedForwardRate must be positive');
  if (currentSpotRate <= 0) throw new DomainError('VALIDATION_FAILED', 'currentSpotRate must be positive');
  if (remainingDays < 0) throw new DomainError('VALIDATION_FAILED', 'remainingDays must be non-negative');

  // Current forward rate = spot + forward points (points expressed as rate adjustment)
  const currentForwardRate = currentSpotRate + currentForwardPoints;

  // Discount factor = 1 / (1 + r * days/360)
  const discountFactor = 1 / (1 + (annualDiscountRatePct / 100) * (remainingDays / 360));

  // Fair value = (current forward rate − contracted forward rate) × notional × discount factor
  const rawFairValue = (currentForwardRate - contractedForwardRate) * (notionalMinor / 100) * discountFactor;
  const fairValue = Math.round(rawFairValue);

  let gainOrLoss: ForwardContractResult['gainOrLoss'] = 'zero';
  if (fairValue > 0) gainOrLoss = 'gain';
  else if (fairValue < 0) gainOrLoss = 'loss';

  return {
    result: {
      contractId,
      currentForwardRate: Math.round(currentForwardRate * 1_000_000) / 1_000_000,
      discountFactor: Math.round(discountFactor * 1_000_000) / 1_000_000,
      fairValueMinor: fairValue,
      gainOrLoss,
    },
    inputs: { contractId, notionalMinor, contractedForwardRate, remainingDays },
    explanation: `Forward ${contractId}: FV=${fairValue} (${gainOrLoss}), current fwd=${currentForwardRate.toFixed(6)}, contracted=${contractedForwardRate}, DF=${discountFactor.toFixed(6)}`,
  };
}
