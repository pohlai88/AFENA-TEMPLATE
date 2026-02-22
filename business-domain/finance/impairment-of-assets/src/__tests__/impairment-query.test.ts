import { describe, expect, it, vi } from 'vitest';

import { getImpairmentTest, listByAsset } from '../queries/impairment-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getImpairmentTest', () => {
  it('returns test when found', async () => {
    const row = {
      id: 'imp-1', testDate: '2025-12-31', assetId: 'asset-1', cguId: null,
      currencyCode: 'MYR', carryingMinor: 500_000, recoverableMinor: 400_000,
      impairmentMinor: 100_000, recoveryMethod: 'value-in-use', isReversed: false,
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getImpairmentTest(db, mockCtx, 'imp-1');
    expect(result.impairmentMinor).toBe(100_000);
    expect(result.recoveryMethod).toBe('value-in-use');
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getImpairmentTest(db, mockCtx, 'missing')).rejects.toThrow('Impairment test not found');
  });
});

describe('listByAsset', () => {
  it('returns empty array when no tests', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listByAsset(db, mockCtx, 'asset-1');
    expect(result).toEqual([]);
  });
});
