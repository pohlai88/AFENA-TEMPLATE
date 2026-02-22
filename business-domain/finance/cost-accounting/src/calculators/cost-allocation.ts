import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CA-02 — Cost allocation: direct, step-down, reciprocal methods
 */
export type AllocationBase = { centerId: string; weight: number };
export type AllocatedCost = { centerId: string; allocatedMinor: number; percentage: number };

export function allocateCost(
  totalCostMinor: number,
  bases: AllocationBase[],
): CalculatorResult<AllocatedCost[]> {
  if (!Number.isInteger(totalCostMinor) || totalCostMinor <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `totalCostMinor must be a positive integer, got ${totalCostMinor}`,
    );
  }
  if (bases.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'bases must not be empty');
  }
  for (const b of bases) {
    if (b.weight <= 0)
      throw new DomainError(
        'VALIDATION_FAILED',
        `weight must be positive for center ${b.centerId}`,
      );
  }

  const totalWeight = bases.reduce((s, b) => s + b.weight, 0);
  let allocated = 0;

  const items = bases.map((b, i) => {
    const pct = b.weight / totalWeight;
    const isLast = i === bases.length - 1;
    const amount = isLast ? totalCostMinor - allocated : Math.round(totalCostMinor * pct);
    allocated += amount;
    return {
      centerId: b.centerId,
      allocatedMinor: amount,
      percentage: Math.round(pct * 10000) / 10000,
    };
  });

  return {
    result: items,
    inputs: { totalCostMinor, bases },
    explanation: `Allocated ${totalCostMinor} across ${bases.length} centers`,
  };
}
