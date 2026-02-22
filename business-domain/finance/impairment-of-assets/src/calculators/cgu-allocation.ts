/**
 * IAS 36.80-87 — CGU Allocation
 *
 * Allocates goodwill and corporate assets to cash-generating units
 * for impairment testing purposes.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CguData = {
  cguId: string;
  carryingAmountMinor: number;
  allocationBasis: number;
};

export type CguAllocationInput = {
  goodwillMinor: number;
  corporateAssetsMinor: number;
  cgus: CguData[];
};

export type CguAllocationResult = {
  allocations: Array<{
    cguId: string;
    carryingAmountMinor: number;
    goodwillAllocatedMinor: number;
    corporateAssetsAllocatedMinor: number;
    totalForTestingMinor: number;
  }>;
  explanation: string;
};

export function allocateGoodwillToCgus(
  inputs: CguAllocationInput,
): CalculatorResult<CguAllocationResult> {
  const { goodwillMinor, corporateAssetsMinor, cgus } = inputs;

  if (cgus.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one CGU required');
  if (goodwillMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Goodwill cannot be negative');

  const totalBasis = cgus.reduce((s, c) => s + c.allocationBasis, 0);
  if (totalBasis <= 0) throw new DomainError('VALIDATION_FAILED', 'Total allocation basis must be positive');

  const allocations = cgus.map((cgu) => {
    const ratio = cgu.allocationBasis / totalBasis;
    const goodwillAllocatedMinor = Math.round(goodwillMinor * ratio);
    const corporateAssetsAllocatedMinor = Math.round(corporateAssetsMinor * ratio);
    return {
      cguId: cgu.cguId,
      carryingAmountMinor: cgu.carryingAmountMinor,
      goodwillAllocatedMinor,
      corporateAssetsAllocatedMinor,
      totalForTestingMinor: cgu.carryingAmountMinor + goodwillAllocatedMinor + corporateAssetsAllocatedMinor,
    };
  });

  const explanation =
    `CGU allocation (IAS 36.80): goodwill ${goodwillMinor} + corporate ${corporateAssetsMinor} ` +
    `allocated across ${cgus.length} CGUs by relative basis`;

  return {
    result: { allocations, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
