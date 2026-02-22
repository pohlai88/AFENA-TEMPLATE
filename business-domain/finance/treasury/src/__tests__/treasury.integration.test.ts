import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it, vi } from 'vitest';
import {
  describeIntegration,
  mockDbSession,
  testCtx,
} from '../../../test-utils/integration-helper';
import type { CashAccountReadModel } from '../queries/treasury-query';
import { getCashForecast, getCashPosition, transferCash } from '../services/treasury-service';

const { mockAccount } = vi.hoisted(() => {
  const mockAccount: CashAccountReadModel = {
    id: 'CA-001',
    accountNo: 'ACCT-001',
    bankName: 'Test Bank',
    accountType: 'current',
    currencyCode: 'USD',
    bookBalanceMinor: 500000,
    asOfDate: '2026-01-01',
    isActive: true,
  };
  return { mockAccount };
});

vi.mock('../queries/treasury-query', () => ({
  getCashAccount: vi.fn().mockResolvedValue(mockAccount),
  listActiveCashAccounts: vi.fn().mockResolvedValue([]),
}));

describeIntegration('Treasury — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('getCashPosition computes position from accounts', async () => {
    const result = await getCashPosition(db, ctx, {
      accounts: [
        { accountId: 'CA-001', balanceMinor: 500000, currency: 'USD', bankName: 'Test Bank' },
        { accountId: 'CA-002', balanceMinor: 200000, currency: 'EUR', bankName: 'EU Bank' },
      ],
    });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data.totalMinor).toBeDefined();
    }
  });

  it('getCashForecast projects cash flows', async () => {
    const result = await getCashForecast(db, ctx, {
      startingBalanceMinor: 1000000,
      inflows: [
        { dateIso: '2026-01-15', amountMinor: 50000, category: 'receivables', probability: 0.9 },
      ],
      outflows: [
        { dateIso: '2026-01-20', amountMinor: 30000, category: 'payables', probability: 1.0 },
      ],
      horizonDays: 30,
      startDateIso: '2026-01-01',
    });
    expect(result.kind).toBe('read');
  });

  it('transferCash returns intent+read', async () => {
    const result = await transferCash(db, ctx, {
      fromAccountId: 'CA-001',
      toAccountId: 'CA-002',
      amountMinor: 100000,
      currency: 'USD',
      transferDate: '2026-01-15',
    });
    expect(result.kind).toBe('intent+read');
  });
});
