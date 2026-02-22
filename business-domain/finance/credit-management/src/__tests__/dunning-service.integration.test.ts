import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import {
  describeIntegration,
  mockDbSession,
  testCtx,
} from '../../../test-utils/integration-helper';
import {
  createDunningRun,
  getDunningRunNotices,
  listDunningRuns,
} from '../services/dunning-service';

describeIntegration('Dunning Service — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('createDunningRun generates intent with notices from calculator', async () => {
    const result = await createDunningRun(db, ctx, {
      runDate: '2026-02-22',
      cutoffDate: '2026-02-15',
      overdueCustomers: [
        { customerId: 'CUST-001', overdueDays: 35, overdueMinor: 500000, noticesSent: 0 },
        { customerId: 'CUST-002', overdueDays: 95, overdueMinor: 1200000, noticesSent: 2 },
      ],
    });

    expect(result.kind).toBe('intent+read');
    expect(result.intents).toHaveLength(1);
    expect(result.intents![0]!.type).toBe('credit.dunning.create');
    expect(result.data!.actions.length).toBeGreaterThan(0);
  });

  it('createDunningRun handles empty customer list', async () => {
    const result = await createDunningRun(db, ctx, {
      runDate: '2026-02-22',
      cutoffDate: '2026-02-15',
      overdueCustomers: [],
    });

    expect(result.kind).toBe('read');
    expect(result.data!.actions).toHaveLength(0);
    expect(result.intents).toBeUndefined();
  });

  it('listDunningRuns returns empty from mockDb', async () => {
    const result = await listDunningRuns(db, ctx, {});
    expect(result.kind).toBe('read');
    expect(result.data).toEqual([]);
  });

  it('getDunningRunNotices returns empty from mockDb', async () => {
    const result = await getDunningRunNotices(db, ctx, { dunningRunId: 'run-001' });
    expect(result.kind).toBe('read');
    expect(result.data).toEqual([]);
  });
});
