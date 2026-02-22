import { describe, expect, it } from 'vitest';

import { computeWeightedAvgCost } from '../calculators/weighted-avg-cost';
import { computeFifoCosting } from '../calculators/fifo-costing';
import { computeInventoryWriteDown } from '../calculators/inventory-write-down';
import { computeInventoryDisclosure } from '../calculators/inventory-disclosure';

describe('computeWeightedAvgCost', () => {
  it('computes weighted average unit cost', () => {
    const { result } = computeWeightedAvgCost({
      openingQuantity: 100, openingTotalCostMinor: 10_000,
      movements: [
        { type: 'purchase', quantity: 200, unitCostMinor: 120 },
      ],
    });
    expect(result.totalQuantity).toBe(300);
    expect(result.totalCostMinor).toBe(34_000);
    expect(result.weightedAvgUnitCostMinor).toBe(113);
  });

  it('handles returns', () => {
    const { result } = computeWeightedAvgCost({
      openingQuantity: 100, openingTotalCostMinor: 10_000,
      movements: [{ type: 'return', quantity: 20, unitCostMinor: 100 }],
    });
    expect(result.totalQuantity).toBe(80);
  });

  it('throws on negative resulting quantity', () => {
    expect(() => computeWeightedAvgCost({
      openingQuantity: 10, openingTotalCostMinor: 1_000,
      movements: [{ type: 'return', quantity: 20, unitCostMinor: 100 }],
    })).toThrow('cannot be negative');
  });
});

describe('computeFifoCosting', () => {
  it('consumes oldest layers first', () => {
    const { result } = computeFifoCosting({
      layers: [
        { quantity: 50, unitCostMinor: 100, dateAcquired: '2025-01-01' },
        { quantity: 50, unitCostMinor: 120, dateAcquired: '2025-02-01' },
      ],
      quantityToConsume: 60,
    });
    expect(result.costOfGoodsSoldMinor).toBe(6_200);
    expect(result.remainingQuantity).toBe(40);
    expect(result.remainingLayers).toHaveLength(1);
  });

  it('throws on insufficient inventory', () => {
    expect(() => computeFifoCosting({
      layers: [{ quantity: 10, unitCostMinor: 100, dateAcquired: '2025-01-01' }],
      quantityToConsume: 20,
    })).toThrow('Insufficient inventory');
  });
});

describe('computeInventoryWriteDown', () => {
  it('writes down when cost exceeds NRV', () => {
    const { result } = computeInventoryWriteDown({
      itemId: 'i1', costMinor: 100_000, nrvMinor: 80_000, priorWriteDownMinor: 0,
    });
    expect(result.writeDownMinor).toBe(20_000);
    expect(result.carryingAmountMinor).toBe(80_000);
  });

  it('reverses when NRV increases', () => {
    const { result } = computeInventoryWriteDown({
      itemId: 'i1', costMinor: 100_000, nrvMinor: 95_000, priorWriteDownMinor: 20_000,
    });
    expect(result.reversalMinor).toBe(15_000);
    expect(result.writeDownMinor).toBe(0);
  });

  it('no adjustment when NRV exceeds cost', () => {
    const { result } = computeInventoryWriteDown({
      itemId: 'i1', costMinor: 100_000, nrvMinor: 110_000, priorWriteDownMinor: 0,
    });
    expect(result.writeDownMinor).toBe(0);
    expect(result.reversalMinor).toBe(0);
  });
});

describe('computeInventoryDisclosure', () => {
  it('aggregates categories', () => {
    const { result } = computeInventoryDisclosure({
      categories: [
        { category: 'raw', costMinor: 50_000, carryingMinor: 48_000, writeDownMinor: 2_000 },
        { category: 'finished', costMinor: 100_000, carryingMinor: 95_000, writeDownMinor: 5_000 },
      ],
      cogsMinor: 200_000, writeDownsThisPeriodMinor: 7_000, reversalsThisPeriodMinor: 2_000,
    });
    expect(result.totalCostMinor).toBe(150_000);
    expect(result.totalWriteDownMinor).toBe(7_000);
    expect(result.netWriteDownMovementMinor).toBe(5_000);
  });
});
