import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see SB-02 — Ratable revenue recognition over service period
 *
 * Recognises subscription / SaaS revenue ratably (straight-line)
 * over the service period. Returns recognised vs deferred split
 * for a given elapsed-day count.
 *
 * Pure function — no I/O.
 */

export type RatableRecognitionResult = {
  dailyRateMinor: number;
  recognizedMinor: number;
  deferredMinor: number;
  percentRecognized: number;
};

export function computeRatableRecognition(
  totalAmountMinor: number,
  servicePeriodDays: number,
  elapsedDays: number,
): CalculatorResult<RatableRecognitionResult> {
  if (!Number.isInteger(totalAmountMinor) || totalAmountMinor < 0)
    throw new DomainError('VALIDATION_FAILED', 'totalAmountMinor must be a non-negative integer');
  if (!Number.isInteger(servicePeriodDays) || servicePeriodDays <= 0)
    throw new DomainError('VALIDATION_FAILED', 'servicePeriodDays must be a positive integer');
  if (!Number.isInteger(elapsedDays) || elapsedDays < 0)
    throw new DomainError('VALIDATION_FAILED', 'elapsedDays must be a non-negative integer');
  if (elapsedDays > servicePeriodDays)
    throw new DomainError('VALIDATION_FAILED', 'elapsedDays cannot exceed servicePeriodDays');

  const dailyRateMinor = Math.round(totalAmountMinor / servicePeriodDays);
  const recognizedMinor = Math.min(dailyRateMinor * elapsedDays, totalAmountMinor);
  const deferredMinor = totalAmountMinor - recognizedMinor;
  const percentRecognized = servicePeriodDays === 0 ? 0 : Math.round((elapsedDays / servicePeriodDays) * 10000) / 10000;

  return {
    result: { dailyRateMinor, recognizedMinor, deferredMinor, percentRecognized },
    inputs: { totalAmountMinor, servicePeriodDays, elapsedDays },
    explanation: `Ratable: ${recognizedMinor} recognised (${(percentRecognized * 100).toFixed(1)}%), ${deferredMinor} deferred over ${servicePeriodDays}d`,
  };
}
