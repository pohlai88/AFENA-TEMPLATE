import { describe, expect, it, vi } from 'vitest';

import { getSbpGrant, listActiveGrants } from '../queries/sbp-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getSbpGrant', () => {
  it('returns grant when found', async () => {
    const row = {
      id: 'sbp-1', grantDate: '2025-01-15', vestingPeriodMonths: 36,
      currencyCode: 'MYR', exercisePriceMinor: 500, fairValuePerUnitMinor: 200,
      unitsGranted: 10_000, unitsVested: 3_000, unitsCancelled: 0,
      settlementType: 'equity', status: 'active',
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getSbpGrant(db, mockCtx, 'sbp-1');
    expect(result.unitsGranted).toBe(10_000);
    expect(result.settlementType).toBe('equity');
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getSbpGrant(db, mockCtx, 'missing')).rejects.toThrow('SBP grant not found');
  });
});

describe('listActiveGrants', () => {
  it('returns empty array when no grants', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listActiveGrants(db, mockCtx);
    expect(result).toEqual([]);
  });
});
