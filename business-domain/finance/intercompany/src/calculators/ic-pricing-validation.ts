/**
 * IAS 24 / OECD TP Guidelines — IC Pricing Validation
 *
 * Validates that intercompany transaction prices fall within
 * an arm's-length range, flagging deviations for review.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IcPricingValidationInput = {
  transactionId: string;
  icPriceMinor: number;
  armLengthLowMinor: number;
  armLengthHighMinor: number;
  transactionType: 'goods' | 'services' | 'royalty' | 'interest' | 'management-fee';
};

export type IcPricingValidationResult = {
  isWithinRange: boolean;
  deviationMinor: number;
  deviationPct: string;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
};

export function validateIcPricing(
  inputs: IcPricingValidationInput,
): CalculatorResult<IcPricingValidationResult> {
  const { icPriceMinor, armLengthLowMinor, armLengthHighMinor, transactionType } = inputs;

  if (armLengthLowMinor > armLengthHighMinor) {
    throw new DomainError('VALIDATION_FAILED', 'Arm\'s-length low cannot exceed high');
  }

  const isWithinRange = icPriceMinor >= armLengthLowMinor && icPriceMinor <= armLengthHighMinor;
  const midpoint = Math.round((armLengthLowMinor + armLengthHighMinor) / 2);
  const deviationMinor = isWithinRange ? 0 : (icPriceMinor < armLengthLowMinor
    ? armLengthLowMinor - icPriceMinor
    : icPriceMinor - armLengthHighMinor);

  const deviationPct = midpoint > 0
    ? `${((deviationMinor / midpoint) * 100).toFixed(2)}%`
    : '0.00%';

  const riskLevel = isWithinRange ? 'low' : deviationMinor > midpoint * 0.1 ? 'high' : 'medium';

  const explanation = isWithinRange
    ? `IC price ${icPriceMinor} within arm's-length range [${armLengthLowMinor}, ${armLengthHighMinor}] for ${transactionType}`
    : `IC price ${icPriceMinor} OUTSIDE arm's-length range [${armLengthLowMinor}, ${armLengthHighMinor}] — deviation ${deviationMinor} (${deviationPct}), risk: ${riskLevel}`;

  return {
    result: { isWithinRange, deviationMinor, deviationPct, riskLevel, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
