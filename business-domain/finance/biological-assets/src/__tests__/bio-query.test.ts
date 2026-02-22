import { describe, expect, it, vi } from 'vitest';

import { getBioAsset, listByClass } from '../queries/bio-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getBioAsset', () => {
  it('returns asset when found', async () => {
    const row = {
      id: 'ba-1', assetName: 'Palm Oil Plantation', assetClass: 'bearer-plant',
      measurementDate: '2025-12-31', currencyCode: 'MYR', fairValueMinor: 1_000_000,
      costMinor: 800_000, harvestYield: '500', harvestUom: 'tonnes',
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getBioAsset(db, mockCtx, 'ba-1');
    expect(result.assetClass).toBe('bearer-plant');
    expect(result.fairValueMinor).toBe(1_000_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getBioAsset(db, mockCtx, 'missing')).rejects.toThrow('Biological asset not found');
  });
});

describe('listByClass', () => {
  it('returns empty array when no assets', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByClass(db, mockCtx, 'bearer-plant');
    expect(result).toEqual([]);
  });
});
