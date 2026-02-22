/**
 * IAS 23.20-21 — Suspension Period Assessment
 *
 * Determines whether capitalisation should be suspended during
 * periods when active development is interrupted.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type SuspensionPeriodInput = {
  suspensionStartDate: string;
  suspensionEndDate?: string;
  /** Calendar days of suspension */
  suspensionDays: number;
  /** Threshold in days beyond which suspension triggers cessation */
  extendedSuspensionThresholdDays: number;
  borrowingCostDuringSuspensionMinor: number;
};

export type SuspensionPeriodResult = {
  isSuspended: boolean;
  isExtendedSuspension: boolean;
  expensedCostMinor: number;
  explanation: string;
};

export function evaluateSuspensionPeriod(
  inputs: SuspensionPeriodInput,
): CalculatorResult<SuspensionPeriodResult> {
  const { suspensionDays, extendedSuspensionThresholdDays, borrowingCostDuringSuspensionMinor } = inputs;

  if (suspensionDays < 0) throw new DomainError('VALIDATION_FAILED', 'Suspension days cannot be negative');

  const isSuspended = suspensionDays > 0;
  const isExtendedSuspension = suspensionDays > extendedSuspensionThresholdDays;
  const expensedCostMinor = isSuspended ? borrowingCostDuringSuspensionMinor : 0;

  const explanation = isExtendedSuspension
    ? `Extended suspension (${suspensionDays}d > ${extendedSuspensionThresholdDays}d threshold): expense ${expensedCostMinor}, consider cessation (IAS 23.20)`
    : isSuspended
      ? `Temporary suspension (${suspensionDays}d): expense ${expensedCostMinor} during suspension (IAS 23.21)`
      : 'No suspension — capitalisation continues';

  return {
    result: { isSuspended, isExtendedSuspension, expensedCostMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
