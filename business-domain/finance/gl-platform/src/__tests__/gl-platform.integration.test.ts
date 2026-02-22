import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import {
  fetchChartOfAccounts,
  fetchLedger,
  listCompanyLedgers,
  listPeriods,
} from '../services/gl-platform-service';

describeIntegration('GL Platform — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('listCompanyLedgers returns an array (may be empty)', async () => {
    const result = await listCompanyLedgers(db, ctx, 'test-company');
    expect(result.kind).toBe('read');
  });

  it('fetchLedger returns or throws for non-existent ledger', async () => {
    await expect(
      fetchLedger(db, ctx, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow();
  });

  it('fetchChartOfAccounts returns for test company', async () => {
    const result = await fetchChartOfAccounts(db, ctx, 'test-company');
    expect(result.kind).toBe('read');
  });

  it('listPeriods returns for test ledger', async () => {
    const result = await listPeriods(db, ctx, {
      ledgerId: '00000000-0000-0000-0000-000000000000',
      companyId: 'test-company',
    });
    expect(result.kind).toBe('read');
  });
});
