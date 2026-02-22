/**
 * @see DE-06 — Document splitting by segment/cost center (proportional allo
 * Allocation Engine Calculator
 *
 * Splits an amount across multiple cost centers using configurable methods:
 * - proportional: split by given weights
 * - fixed: fixed amount per target
 * - step_down: sequential allocation with cascading
 */
import { DomainError } from 'afenda-canon';

export type AllocationTarget = {
  costCenterId: string;
  weight: number;
};

export type AllocationLine = {
  costCenterId: string;
  amountMinor: number;
};

export type AllocationResult = {
  result: AllocationLine[];
  inputs: { totalMinor: number; method: string; targets: readonly AllocationTarget[] };
  explanation: string;
};

/**
 * Proportional allocation: distributes totalMinor by relative weights.
 * Ensures pennies are distributed to avoid rounding drift.
 */
export function allocateProportional(
  totalMinor: number,
  targets: readonly AllocationTarget[],
): AllocationResult {
  if (targets.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Allocation requires at least one target');
  }
  if (totalMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Total amount must be non-negative');
  }

  const totalWeight = targets.reduce((s, t) => s + t.weight, 0);
  if (totalWeight <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Total weight must be positive');
  }

  const lines: AllocationLine[] = [];
  let allocated = 0;

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]!;
    const isLast = i === targets.length - 1;
    const amount = isLast
      ? totalMinor - allocated
      : Math.round((totalMinor * target.weight) / totalWeight);

    lines.push({ costCenterId: target.costCenterId, amountMinor: amount });
    allocated += amount;
  }

  return {
    result: lines,
    inputs: { totalMinor, method: 'proportional', targets },
    explanation: `Proportional allocation of ${totalMinor} across ${targets.length} targets (total weight ${totalWeight}).`,
  };
}
