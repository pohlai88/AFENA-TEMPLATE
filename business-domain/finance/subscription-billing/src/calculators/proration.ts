import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SB-05 — Upgrade / downgrade mid-cycle proration
 */
export type ProratedResult = { proratedMinor: number; dailyRateMinor: number; unusedDays: number };

export function prorateBilling(
  planAmountMinor: number,
  billingCycleDays: number,
  usedDays: number,
): CalculatorResult<ProratedResult> {
  if (!Number.isInteger(planAmountMinor) || planAmountMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `planAmountMinor must be a non-negative integer, got ${planAmountMinor}`,
    );
  }
  if (!Number.isInteger(billingCycleDays) || billingCycleDays <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `billingCycleDays must be a positive integer, got ${billingCycleDays}`,
    );
  }
  if (!Number.isInteger(usedDays) || usedDays < 0 || usedDays > billingCycleDays) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `usedDays must be 0..${billingCycleDays}, got ${usedDays}`,
    );
  }

  const dailyRateMinor = Math.round(planAmountMinor / billingCycleDays);
  const proratedMinor = dailyRateMinor * usedDays;
  const unusedDays = billingCycleDays - usedDays;

  return {
    result: { proratedMinor, dailyRateMinor, unusedDays },
    inputs: { planAmountMinor, billingCycleDays, usedDays },
    explanation: `Proration: ${usedDays}/${billingCycleDays} days, daily rate=${dailyRateMinor}, prorated=${proratedMinor}`,
  };
}
