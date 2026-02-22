import { describe, expect, it, vi } from 'vitest';

import { getBorrowingCost, listByAssetAndPeriod } from '../queries/borrow-cost-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getBorrowingCost', () => {
  it('returns item when found', async () => {
    const row = {
      id: 'bc-1', periodKey: '2025-12', qualifyingAssetId: 'asset-1',
      currencyCode: 'MYR', borrowingMinor: 50_000, capitalisedMinor: 30_000,
      expensedMinor: 20_000, capitalisationRateBps: 600, status: 'active',
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getBorrowingCost(db, mockCtx, 'bc-1');
    expect(result.capitalisedMinor).toBe(30_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getBorrowingCost(db, mockCtx, 'missing')).rejects.toThrow('Borrowing cost item not found');
  });
});

describe('listByAssetAndPeriod', () => {
  it('returns empty array when no items', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByAssetAndPeriod(db, mockCtx, 'asset-1', '2025-12');
    expect(result).toEqual([]);
  });
});
