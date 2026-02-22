import { describe, expect, it, vi } from 'vitest';

import { getCashAccount, listActiveCashAccounts } from '../queries/treasury-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

function mockDb(rows: any[]) {
  return { read: vi.fn((fn: any) => fn({ select: () => ({ from: () => ({ where: () => ({ limit: () => rows, orderBy: () => rows }), orderBy: () => rows }) }) })) } as any;
}

describe('getCashAccount', () => {
  it('returns account when found', async () => {
    const row = {
      id: 'acc-1', accountNo: 'BA-001', bankName: 'Test Bank',
      accountType: 'current', currencyCode: 'MYR', bookBalanceMinor: 100_000,
      asOfDate: '2025-12-31', isActive: true,
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getCashAccount(db, mockCtx, 'acc-1');
    expect(result.id).toBe('acc-1');
    expect(result.currencyCode).toBe('MYR');
    expect(db.read).toHaveBeenCalledOnce();
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getCashAccount(db, mockCtx, 'missing')).rejects.toThrow('Cash account not found');
  });
});

describe('listActiveCashAccounts', () => {
  it('returns empty array when no accounts', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listActiveCashAccounts(db, mockCtx);
    expect(result).toEqual([]);
  });
});
