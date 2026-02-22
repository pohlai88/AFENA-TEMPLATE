import { describe, expect, it } from 'vitest';
import { computeActivityBasedCost } from '../calculators/activity-based-costing';

describe('CA-03 — Activity-Based Costing', () => {
  const activities = [
    { activityId: 'A1', name: 'Machine Setup', costPoolMinor: 100_000, driverName: 'setups', totalDriverUnits: 50 },
    { activityId: 'A2', name: 'Quality Inspection', costPoolMinor: 60_000, driverName: 'inspections', totalDriverUnits: 200 },
  ];

  it('allocates costs based on driver consumption', () => {
    const costObjects = [
      { costObjectId: 'P1', driverConsumption: { A1: 30, A2: 120 } },
      { costObjectId: 'P2', driverConsumption: { A1: 20, A2: 80 } },
    ];
    const { result } = computeActivityBasedCost(activities, costObjects);

    expect(result.activityRates).toHaveLength(2);
    expect(result.activityRates[0].ratePerUnit).toBe(2000); // 100000/50
    expect(result.activityRates[1].ratePerUnit).toBe(300);  // 60000/200

    expect(result.allocations[0].totalAllocatedMinor).toBe(30 * 2000 + 120 * 300); // 96000
    expect(result.allocations[1].totalAllocatedMinor).toBe(20 * 2000 + 80 * 300);  // 64000
    expect(result.totalAllocatedMinor).toBe(160_000);
  });

  it('returns CalculatorResult shape', () => {
    const costObjects = [{ costObjectId: 'P1', driverConsumption: { A1: 10 } }];
    const res = computeActivityBasedCost(activities, costObjects);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty activities', () => {
    expect(() => computeActivityBasedCost([], [{ costObjectId: 'P1', driverConsumption: {} }])).toThrow('At least one activity');
  });

  it('throws on empty cost objects', () => {
    expect(() => computeActivityBasedCost(activities, [])).toThrow('At least one cost object');
  });

  it('throws on unknown activity in consumption', () => {
    const costObjects = [{ costObjectId: 'P1', driverConsumption: { UNKNOWN: 10 } }];
    expect(() => computeActivityBasedCost(activities, costObjects)).toThrow('Unknown activity');
  });

  it('throws on negative cost pool', () => {
    const bad = [{ ...activities[0], costPoolMinor: -100 }];
    expect(() => computeActivityBasedCost(bad, [{ costObjectId: 'P1', driverConsumption: { A1: 1 } }])).toThrow('Negative cost pool');
  });

  it('handles single activity single object', () => {
    const acts = [{ activityId: 'X', name: 'X', costPoolMinor: 50_000, driverName: 'd', totalDriverUnits: 100 }];
    const cos = [{ costObjectId: 'O1', driverConsumption: { X: 100 } }];
    const { result } = computeActivityBasedCost(acts, cos);
    expect(result.totalAllocatedMinor).toBe(50_000);
  });
});
