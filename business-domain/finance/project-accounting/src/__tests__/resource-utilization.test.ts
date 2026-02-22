import { describe, expect, it } from 'vitest';
import { computeResourceUtilization } from '../calculators/resource-utilization';
import type { ResourceAllocation } from '../calculators/resource-utilization';

const allocations: ResourceAllocation[] = [
  { resourceId: 'r1', resourceName: 'Alice', projectId: 'p1', allocatedHours: 80, actualHours: 120, billableRate: 150 },
  { resourceId: 'r1', resourceName: 'Alice', projectId: 'p2', allocatedHours: 40, actualHours: 40, billableRate: 150 },
  { resourceId: 'r2', resourceName: 'Bob', projectId: 'p1', allocatedHours: 100, actualHours: 80, billableRate: 120 },
];

describe('computeResourceUtilization', () => {
  it('aggregates hours per resource', () => {
    const { result } = computeResourceUtilization(allocations, 160);
    const alice = result.resources.find((r) => r.resourceId === 'r1')!;
    expect(alice.totalActualHours).toBe(160);
    expect(alice.utilizationPct).toBe(100);
  });

  it('classifies utilization status', () => {
    const { result } = computeResourceUtilization(allocations, 160);
    const alice = result.resources.find((r) => r.resourceId === 'r1')!;
    const bob = result.resources.find((r) => r.resourceId === 'r2')!;
    expect(alice.status).toBe('optimal');
    expect(bob.status).toBe('under-utilized');
  });

  it('computes billable amounts', () => {
    const { result } = computeResourceUtilization(allocations, 160);
    expect(result.totalBillableMinor).toBeGreaterThan(0);
  });

  it('counts over/under utilized', () => {
    const { result } = computeResourceUtilization(allocations, 160);
    expect(result.underUtilizedCount).toBe(1);
  });

  it('throws for empty allocations', () => {
    expect(() => computeResourceUtilization([], 160)).toThrow('At least one');
  });

  it('throws for zero available hours', () => {
    expect(() => computeResourceUtilization(allocations, 0)).toThrow('positive');
  });
});
