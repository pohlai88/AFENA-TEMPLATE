import { describe, expect, it, vi } from 'vitest';

import { getProperty, listActiveProperties } from '../queries/inv-property-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getProperty', () => {
  it('returns property when found', async () => {
    const row = {
      id: 'ip-1', propertyName: 'Office Tower A', category: 'commercial',
      measurementModel: 'fair-value', measurementDate: '2025-12-31',
      currencyCode: 'MYR', fairValueMinor: 5_000_000, costMinor: 4_000_000,
      accumulatedDeprMinor: 200_000, isActive: true,
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getProperty(db, mockCtx, 'ip-1');
    expect(result.propertyName).toBe('Office Tower A');
    expect(result.fairValueMinor).toBe(5_000_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getProperty(db, mockCtx, 'missing')).rejects.toThrow('Investment property not found');
  });
});

describe('listActiveProperties', () => {
  it('returns empty array when no properties', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listActiveProperties(db, mockCtx);
    expect(result).toEqual([]);
  });
});
