import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-10 / PA-09 — Resource Utilization Tracking
 *
 * Tracks resource allocation across projects, computes utilization rates,
 * and identifies over/under-allocated resources.
 *
 * Pure function — no I/O.
 */

export type ResourceAllocation = {
  resourceId: string;
  resourceName: string;
  projectId: string;
  allocatedHours: number;
  actualHours: number;
  billableRate: number;
};

export type ResourceUtilizationEntry = {
  resourceId: string;
  resourceName: string;
  totalAllocatedHours: number;
  totalActualHours: number;
  availableHours: number;
  utilizationPct: number;
  billableAmountMinor: number;
  status: 'under-utilized' | 'optimal' | 'over-utilized';
};

export type UtilizationResult = {
  resources: ResourceUtilizationEntry[];
  averageUtilizationPct: number;
  totalBillableMinor: number;
  overUtilizedCount: number;
  underUtilizedCount: number;
};

/**
 * Compute resource utilization across projects.
 *
 * @param allocations     - Resource-project allocation records
 * @param availableHours  - Standard available hours per resource (e.g. 160/month)
 */
export function computeResourceUtilization(
  allocations: ResourceAllocation[],
  availableHours: number,
): CalculatorResult<UtilizationResult> {
  if (allocations.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one resource allocation required');
  }
  if (availableHours <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Available hours must be positive');
  }

  const byResource = new Map<string, { name: string; allocated: number; actual: number; billable: number }>();

  for (const a of allocations) {
    const entry = byResource.get(a.resourceId) ?? { name: a.resourceName, allocated: 0, actual: 0, billable: 0 };
    entry.allocated += a.allocatedHours;
    entry.actual += a.actualHours;
    entry.billable += Math.round(a.actualHours * a.billableRate * 100);
    byResource.set(a.resourceId, entry);
  }

  const resources: ResourceUtilizationEntry[] = [...byResource.entries()].map(([id, data]) => {
    const utilizationPct = Math.round((data.actual / availableHours) * 10000) / 100;
    let status: 'under-utilized' | 'optimal' | 'over-utilized';
    if (utilizationPct < 70) status = 'under-utilized';
    else if (utilizationPct <= 100) status = 'optimal';
    else status = 'over-utilized';

    return {
      resourceId: id,
      resourceName: data.name,
      totalAllocatedHours: data.allocated,
      totalActualHours: data.actual,
      availableHours,
      utilizationPct,
      billableAmountMinor: data.billable,
      status,
    };
  });

  const avgUtil = resources.length === 0 ? 0 : Math.round(resources.reduce((s, r) => s + r.utilizationPct, 0) / resources.length * 100) / 100;

  return {
    result: {
      resources,
      averageUtilizationPct: avgUtil,
      totalBillableMinor: resources.reduce((s, r) => s + r.billableAmountMinor, 0),
      overUtilizedCount: resources.filter((r) => r.status === 'over-utilized').length,
      underUtilizedCount: resources.filter((r) => r.status === 'under-utilized').length,
    },
    inputs: { allocationCount: allocations.length, availableHours },
    explanation: `Utilization: ${resources.length} resources, avg ${avgUtil}%, ${resources.filter((r) => r.status === 'over-utilized').length} over-utilized`,
  };
}
