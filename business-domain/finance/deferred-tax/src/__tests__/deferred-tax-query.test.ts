import { describe, expect, it, vi } from 'vitest';

import { getDeferredTaxItem, listByPeriod } from '../queries/deferred-tax-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getDeferredTaxItem', () => {
  it('returns item when found', async () => {
    const row = {
      id: 'dt-1', periodKey: '2025-12', accountId: 'acc-1',
      assetOrLiability: 'asset', carryingMinor: 100_000, taxBaseMinor: 80_000,
      temporaryDiffMinor: 20_000, taxRateBps: 2500, dtaMinor: 5_000,
      dtlMinor: 0, currencyCode: 'MYR',
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getDeferredTaxItem(db, mockCtx, 'dt-1');
    expect(result.id).toBe('dt-1');
    expect(result.temporaryDiffMinor).toBe(20_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getDeferredTaxItem(db, mockCtx, 'missing')).rejects.toThrow('Deferred tax item not found');
  });
});

describe('listByPeriod', () => {
  it('returns empty array when no items', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByPeriod(db, mockCtx, '2025-12');
    expect(result).toEqual([]);
  });
});
