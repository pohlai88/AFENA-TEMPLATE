import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see HA-05 — Ineffectiveness: recognized immediately in P&L
 * HA-06 — Hedge Discontinuation (IFRS 9 §6.5.6)
 *
 * Discontinue hedge accounting on effectiveness failure or voluntary de-designation.
 * Computes OCI reclassification amounts and remaining amortisation schedule.
 * Pure function — no I/O.
 */

export type HedgeDiscontinuationInput = {
  hedgeId: string;
  hedgeType: 'cash-flow' | 'fair-value' | 'net-investment';
  reason: 'effectiveness-failure' | 'voluntary' | 'hedged-item-expired' | 'hedging-instrument-expired';
  ociReserveMinor: number;
  hedgedItemStillExists: boolean;
  remainingAmortisationMonths: number;
};

export type DiscontinuationResult = {
  hedgeId: string;
  reason: string;
  ociReclassifiedToPnlMinor: number;
  ociRetainedMinor: number;
  monthlyAmortisationMinor: number;
  amortisationSchedule: { month: number; amountMinor: number; remainingMinor: number }[];
};

export function computeHedgeDiscontinuation(input: HedgeDiscontinuationInput): CalculatorResult<DiscontinuationResult> {
  const { hedgeId, hedgeType, reason, ociReserveMinor, hedgedItemStillExists, remainingAmortisationMonths } = input;

  if (!hedgeId) throw new DomainError('VALIDATION_FAILED', 'hedgeId is required');
  if (remainingAmortisationMonths < 0) throw new DomainError('VALIDATION_FAILED', 'remainingAmortisationMonths must be non-negative');

  let ociReclassified = 0;
  let ociRetained = 0;
  let monthlyAmort = 0;
  const schedule: DiscontinuationResult['amortisationSchedule'] = [];

  if (hedgeType === 'cash-flow') {
    if (!hedgedItemStillExists) {
      // IFRS 9 §6.5.12(b): if hedged item no longer expected, reclassify entire OCI to P&L immediately
      ociReclassified = ociReserveMinor;
      ociRetained = 0;
    } else if (remainingAmortisationMonths > 0) {
      // Hedged item still exists: OCI stays in reserve, amortised over remaining life
      ociRetained = ociReserveMinor;
      monthlyAmort = Math.round(ociReserveMinor / remainingAmortisationMonths);

      let remaining = ociReserveMinor;
      for (let m = 1; m <= remainingAmortisationMonths; m++) {
        const isLast = m === remainingAmortisationMonths;
        const amount = isLast ? remaining : monthlyAmort;
        remaining -= amount;
        schedule.push({ month: m, amountMinor: amount, remainingMinor: remaining });
      }
    } else {
      // No remaining life: reclassify immediately
      ociReclassified = ociReserveMinor;
    }
  } else if (hedgeType === 'fair-value') {
    // Fair value hedge: basis adjustment stays on hedged item, no OCI to reclassify
    ociReclassified = 0;
    ociRetained = 0;
  } else {
    // Net investment hedge: OCI reclassified only on disposal of foreign operation
    ociRetained = ociReserveMinor;
  }

  return {
    result: {
      hedgeId,
      reason,
      ociReclassifiedToPnlMinor: ociReclassified,
      ociRetainedMinor: ociRetained,
      monthlyAmortisationMinor: monthlyAmort,
      amortisationSchedule: schedule,
    },
    inputs: { hedgeId, hedgeType, reason, ociReserveMinor, hedgedItemStillExists },
    explanation: `Hedge discontinuation ${hedgeId} (${reason}): OCI reclassified=${ociReclassified}, retained=${ociRetained}, amort=${monthlyAmort}/month over ${schedule.length} months`,
  };
}
