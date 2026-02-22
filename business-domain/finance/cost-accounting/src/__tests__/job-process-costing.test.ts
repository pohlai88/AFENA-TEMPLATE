import { describe, expect, it } from 'vitest';
import { computeJobCost, computeProcessCost } from '../calculators/job-process-costing';

describe('CA-05 — Job Costing', () => {
  it('accumulates costs by category', () => {
    const { result } = computeJobCost('J-100', [
      { category: 'material', amountMinor: 50_000 },
      { category: 'labor', amountMinor: 30_000 },
      { category: 'overhead', amountMinor: 20_000 },
      { category: 'material', amountMinor: 10_000 },
    ]);
    expect(result.materialMinor).toBe(60_000);
    expect(result.laborMinor).toBe(30_000);
    expect(result.overheadMinor).toBe(20_000);
    expect(result.totalCostMinor).toBe(110_000);
    expect(result.jobId).toBe('J-100');
  });

  it('returns CalculatorResult shape', () => {
    const res = computeJobCost('J-1', [{ category: 'material', amountMinor: 100 }]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty jobId', () => {
    expect(() => computeJobCost('', [{ category: 'material', amountMinor: 100 }])).toThrow('jobId is required');
  });

  it('throws on empty entries', () => {
    expect(() => computeJobCost('J-1', [])).toThrow('At least one cost entry');
  });

  it('throws on negative amount', () => {
    expect(() => computeJobCost('J-1', [{ category: 'labor', amountMinor: -5 }])).toThrow('non-negative');
  });
});

describe('CA-05 — Process Costing', () => {
  it('computes weighted-average cost per equivalent unit', () => {
    const { result } = computeProcessCost({
      beginningWipUnits: 200,
      beginningWipCompletionPct: 60,
      unitsStarted: 800,
      unitsCompleted: 900,
      endingWipCompletionPct: 40,
      totalCostMinor: 400_000,
      beginningWipCostMinor: 100_000,
      method: 'weighted-average',
    });
    // ending WIP = 200 + 800 - 900 = 100
    // equiv units = 900 + 100*0.4 = 940
    // cost pool = 100000 + 400000 = 500000
    // cost/unit = 500000/940 ≈ 531.91
    expect(result.endingWipUnits).toBe(100);
    expect(result.equivalentUnits).toBeCloseTo(940, 0);
    expect(result.costPerEquivalentUnit).toBeCloseTo(531.91, 0);
  });

  it('computes FIFO cost per equivalent unit', () => {
    const { result } = computeProcessCost({
      beginningWipUnits: 200,
      beginningWipCompletionPct: 60,
      unitsStarted: 800,
      unitsCompleted: 900,
      endingWipCompletionPct: 40,
      totalCostMinor: 400_000,
      beginningWipCostMinor: 100_000,
      method: 'fifo',
    });
    // FIFO equiv units = (900-200) + 200*(40/100) + 100*(40/100) = 700 + 80 + 40 = 820
    expect(result.endingWipUnits).toBe(100);
    expect(result.equivalentUnits).toBeCloseTo(820, 0);
  });

  it('throws on invalid completion percentage', () => {
    expect(() => computeProcessCost({
      beginningWipUnits: 0, beginningWipCompletionPct: 0,
      unitsStarted: 100, unitsCompleted: 50, endingWipCompletionPct: 150,
      totalCostMinor: 10_000, beginningWipCostMinor: 0, method: 'weighted-average',
    })).toThrow('endingWipCompletionPct must be 0–100');
  });

  it('throws on negative ending WIP', () => {
    expect(() => computeProcessCost({
      beginningWipUnits: 0, beginningWipCompletionPct: 0,
      unitsStarted: 10, unitsCompleted: 20, endingWipCompletionPct: 50,
      totalCostMinor: 10_000, beginningWipCostMinor: 0, method: 'weighted-average',
    })).toThrow('Ending WIP units cannot be negative');
  });
});
