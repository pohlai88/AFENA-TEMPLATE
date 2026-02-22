import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CA-01 — Standard cost vs actual cost variance analysis
 * @see CA-03 — Activity-Based Costing (ABC)
 * @see CA-04 — Cost centre hierarchy and allocation rules
 * @see CA-06 — Overhead absorption rate calculation
 * @see CA-09 — Transfer pricing for internal cost allocation
 *
 * Allocates overhead costs to cost objects through activity cost pools
 * and driver consumption rates (IMA Practice of Management Accounting).
 * Pure function — no I/O.
 */

export type Activity = {
  activityId: string;
  name: string;
  costPoolMinor: number;
  driverName: string;
  totalDriverUnits: number;
};

export type CostObjectConsumption = {
  costObjectId: string;
  /** Map of activityId → driver units consumed by this cost object */
  driverConsumption: Record<string, number>;
};

export type AbcAllocation = {
  costObjectId: string;
  allocations: { activityId: string; driverUnits: number; ratePerUnit: number; allocatedMinor: number }[];
  totalAllocatedMinor: number;
};

export type AbcResult = {
  activityRates: { activityId: string; ratePerUnit: number }[];
  allocations: AbcAllocation[];
  totalAllocatedMinor: number;
};

export function computeActivityBasedCost(
  activities: Activity[],
  costObjects: CostObjectConsumption[],
): CalculatorResult<AbcResult> {
  if (activities.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one activity required');
  if (costObjects.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one cost object required');

  for (const a of activities) {
    if (a.costPoolMinor < 0) throw new DomainError('VALIDATION_FAILED', `Negative cost pool for activity ${a.activityId}`);
    if (a.totalDriverUnits <= 0) throw new DomainError('VALIDATION_FAILED', `Driver units must be positive for activity ${a.activityId}`);
  }

  // Step 1: compute rate per driver unit for each activity
  const activityRates = activities.map((a) => ({
    activityId: a.activityId,
    ratePerUnit: a.costPoolMinor / a.totalDriverUnits,
  }));

  const rateMap = new Map(activityRates.map((r) => [r.activityId, r.ratePerUnit]));

  // Step 2: allocate to each cost object
  let grandTotal = 0;
  const allocations: AbcAllocation[] = costObjects.map((co) => {
    const allocs: AbcAllocation['allocations'] = [];
    let objTotal = 0;

    for (const [activityId, driverUnits] of Object.entries(co.driverConsumption)) {
      const rate = rateMap.get(activityId);
      if (rate === undefined) throw new DomainError('VALIDATION_FAILED', `Unknown activity ${activityId} for cost object ${co.costObjectId}`);
      const allocated = Math.round(rate * driverUnits);
      allocs.push({ activityId, driverUnits, ratePerUnit: rate, allocatedMinor: allocated });
      objTotal += allocated;
    }

    grandTotal += objTotal;
    return { costObjectId: co.costObjectId, allocations: allocs, totalAllocatedMinor: objTotal };
  });

  return {
    result: { activityRates, allocations, totalAllocatedMinor: grandTotal },
    inputs: { activityCount: activities.length, costObjectCount: costObjects.length },
    explanation: `ABC: ${activities.length} activities allocated to ${costObjects.length} cost objects, total=${grandTotal}`,
  };
}
