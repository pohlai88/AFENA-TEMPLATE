/**
 * Period Overlap Validation
 *
 * Ensures that a proposed posting period does not overlap with existing periods
 * for the same ledger. Used before opening new periods.
 */
import { DomainError } from 'afenda-canon';

export type PeriodRange = {
  periodKey: string;
  startDate: string;
  endDate: string;
};

export type PeriodOverlapResult = {
  result: boolean;
  inputs: { proposed: PeriodRange; existing: readonly PeriodRange[] };
  explanation: string;
};

/**
 * Validates that the proposed period does not overlap any existing period.
 * Dates are ISO strings (YYYY-MM-DD) compared lexicographically.
 */
export function validatePeriodOverlap(
  proposed: PeriodRange,
  existing: readonly PeriodRange[],
): PeriodOverlapResult {
  for (const ep of existing) {
    if (proposed.startDate <= ep.endDate && proposed.endDate >= ep.startDate) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `Period ${proposed.periodKey} overlaps with ${ep.periodKey} (${ep.startDate}–${ep.endDate})`,
        { proposed, overlapping: ep },
      );
    }
  }

  return {
    result: true,
    inputs: { proposed, existing },
    explanation: `Period ${proposed.periodKey} (${proposed.startDate}–${proposed.endDate}) has no overlap with ${existing.length} existing period(s).`,
  };
}
