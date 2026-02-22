import { describe, expect, it, vi } from 'vitest';

import { getGrant, listActiveGrants } from '../queries/grant-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getGrant', () => {
  it('returns grant when found', async () => {
    const row = {
      id: 'g-1', grantNo: 'GR-001', grantType: 'income',
      periodKey: '2025-12', currencyCode: 'MYR', grantAmountMinor: 200_000,
      amortisedMinor: 50_000, deferredMinor: 150_000, relatedAssetId: null,
      conditions: 'Employment retention', isActive: true,
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getGrant(db, mockCtx, 'g-1');
    expect(result.grantNo).toBe('GR-001');
    expect(result.deferredMinor).toBe(150_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getGrant(db, mockCtx, 'missing')).rejects.toThrow('Grant not found');
  });
});

describe('listActiveGrants', () => {
  it('returns empty array when no grants', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listActiveGrants(db, mockCtx, '2025-12');
    expect(result).toEqual([]);
  });
});
