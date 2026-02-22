import { describe, expect, it, vi } from 'vitest';

import { getInventoryValuation, listByItem, listByPeriod } from '../queries/inventory-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getInventoryValuation', () => {
  it('returns valuation when found', async () => {
    const row = {
      id: 'iv-1',
      itemId: 'item-1',
      periodKey: '2025-P12',
      costMethod: 'weighted-average',
      currencyCode: 'MYR',
      totalCostMinor: 100_000,
      unitCostMinor: 2_000,
      nrvMinor: 110_000,
      writedownMinor: 0,
      quantityOnHand: '50',
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getInventoryValuation(db, mockCtx, 'iv-1');
    expect(result.itemId).toBe('item-1');
    expect(result.totalCostMinor).toBe(100_000);
    expect(result.costMethod).toBe('weighted-average');
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getInventoryValuation(db, mockCtx, 'missing')).rejects.toThrow(
      'Inventory valuation not found',
    );
  });
});

describe('listByItem', () => {
  it('returns empty array when no valuations', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByItem(db, mockCtx, 'item-1');
    expect(result).toEqual([]);
  });

  it('returns all valuations for an item', async () => {
    const rows = [
      {
        id: 'iv-1',
        itemId: 'item-1',
        periodKey: '2025-P11',
        costMethod: 'fifo',
        currencyCode: 'MYR',
        totalCostMinor: 90_000,
        unitCostMinor: 1_800,
        nrvMinor: 95_000,
        writedownMinor: 0,
        quantityOnHand: '50',
      },
      {
        id: 'iv-2',
        itemId: 'item-1',
        periodKey: '2025-P12',
        costMethod: 'fifo',
        currencyCode: 'MYR',
        totalCostMinor: 100_000,
        unitCostMinor: 2_000,
        nrvMinor: 110_000,
        writedownMinor: 0,
        quantityOnHand: '50',
      },
    ];
    const db = { read: vi.fn().mockResolvedValue(rows) } as any;
    const result = await listByItem(db, mockCtx, 'item-1');
    expect(result).toHaveLength(2);
  });
});

describe('listByPeriod', () => {
  it('returns empty array when no valuations for period', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByPeriod(db, mockCtx, '2025-P12');
    expect(result).toEqual([]);
  });

  it('returns all valuations for a period', async () => {
    const rows = [
      {
        id: 'iv-1',
        itemId: 'item-1',
        periodKey: '2025-P12',
        costMethod: 'weighted-average',
        currencyCode: 'MYR',
        totalCostMinor: 100_000,
        unitCostMinor: 2_000,
        nrvMinor: 110_000,
        writedownMinor: 0,
        quantityOnHand: '50',
      },
      {
        id: 'iv-2',
        itemId: 'item-2',
        periodKey: '2025-P12',
        costMethod: 'fifo',
        currencyCode: 'MYR',
        totalCostMinor: 200_000,
        unitCostMinor: 4_000,
        nrvMinor: 180_000,
        writedownMinor: 20_000,
        quantityOnHand: '50',
      },
    ];
    const db = { read: vi.fn().mockResolvedValue(rows) } as any;
    const result = await listByPeriod(db, mockCtx, '2025-P12');
    expect(result).toHaveLength(2);
    expect(result[1]!.writedownMinor).toBe(20_000);
  });
});
