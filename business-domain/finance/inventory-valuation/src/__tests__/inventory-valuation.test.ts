import { describe, expect, it, vi } from 'vitest';

import { computeInventoryCost, testNrv } from '../calculators/inventory-calc';
import { buildInventoryCostingIntent, buildNrvAdjustIntent } from '../commands/inventory-intent';
import { adjustNrv, valueInventory } from '../services/inventory-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('computeInventoryCost', () => {
  it('computes weighted-average unit cost', () => {
    const { result: r } = computeInventoryCost({
      method: 'weighted-average',
      totalCostMinor: 100_000,
      quantityOnHand: 50,
    });
    expect(r.unitCostMinor).toBe(2_000);
    expect(r.totalCostMinor).toBe(100_000);
  });

  it('returns zero for zero quantity', () => {
    const { result: r } = computeInventoryCost({
      method: 'fifo',
      totalCostMinor: 50_000,
      quantityOnHand: 0,
    });
    expect(r.unitCostMinor).toBe(0);
    expect(r.totalCostMinor).toBe(0);
  });

  it('rounds unit cost to integer', () => {
    const { result: r } = computeInventoryCost({
      method: 'fifo',
      totalCostMinor: 10_000,
      quantityOnHand: 3,
    });
    expect(r.unitCostMinor).toBe(3_333);
  });
});

describe('testNrv', () => {
  it('detects write-down when NRV < cost', () => {
    const { result: r } = testNrv({ costMinor: 100_000, nrvMinor: 80_000 });
    expect(r.writedownMinor).toBe(20_000);
    expect(r.carryingMinor).toBe(80_000);
  });

  it('returns zero write-down when NRV ≥ cost', () => {
    const { result: r } = testNrv({ costMinor: 100_000, nrvMinor: 110_000 });
    expect(r.writedownMinor).toBe(0);
    expect(r.carryingMinor).toBe(100_000);
  });

  it('handles exact equality', () => {
    const { result: r } = testNrv({ costMinor: 50_000, nrvMinor: 50_000 });
    expect(r.writedownMinor).toBe(0);
  });
});

describe('buildInventoryCostingIntent', () => {
  it('builds inventory.costing intent', () => {
    const intent = buildInventoryCostingIntent({
      itemId: 'item-1',
      method: 'weighted-average',
      quantityOnHand: 50,
      totalCostMinor: 100_000,
      unitCostMinor: 2_000,
      periodKey: '2025-P12',
    });
    expect(intent.type).toBe('inventory.costing');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildNrvAdjustIntent', () => {
  it('builds inventory.nrv.adjust intent', () => {
    const intent = buildNrvAdjustIntent({
      itemId: 'item-1',
      costMinor: 100_000,
      nrvMinor: 80_000,
      writedownMinor: 20_000,
      periodKey: '2025-P12',
      direction: 'writedown',
    });
    expect(intent.type).toBe('inventory.nrv.adjust');
  });
});

describe('valueInventory (service)', () => {
  it('returns inventory.costing intent', async () => {
    const r = await valueInventory({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      itemId: 'i-1',
      method: 'fifo',
      totalCostMinor: 100_000,
      quantityOnHand: 50,
      periodKey: '2025-P12',
    });
    expect(r.kind).toBe('intent');
  });
});

describe('adjustNrv (service)', () => {
  it('returns nrv.adjust intent when writedown needed', async () => {
    const r = await adjustNrv({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      itemId: 'i-1',
      costMinor: 100_000,
      nrvMinor: 80_000,
      periodKey: '2025-P12',
    });
    expect(r.kind).toBe('intent');
  });

  it('returns read when no writedown needed', async () => {
    const r = await adjustNrv({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      itemId: 'i-1',
      costMinor: 100_000,
      nrvMinor: 120_000,
      periodKey: '2025-P12',
    });
    expect(r.kind).toBe('read');
  });
});
