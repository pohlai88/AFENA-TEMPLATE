import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { publishMapping, runAccrual, runAllocation, runReclassification } from '../services/accounting-hub-service';

describeIntegration('Accounting Hub — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('publishMapping returns intent', async () => {
    const result = await publishMapping(db, ctx, {
      mappingId: 'MAP-001',
      version: 1,
      ruleCount: 5,
    });
    expect(result.kind).toBe('intent');
  });

  it('runReclassification returns intent', async () => {
    const result = await runReclassification(db, ctx, {
      periodKey: '2026-01',
      entries: [
        { fromAccountId: 'ACC-100', toAccountId: 'ACC-200', amountMinor: 5000 },
      ],
    });
    expect(result.kind).toBe('intent');
  });

  it('runAllocation returns intent', async () => {
    const result = await runAllocation(db, ctx, {
      periodKey: '2026-01',
      totalMinor: 100000,
      method: 'proportional',
      targets: [
        { costCenterId: 'CC-100', weight: 60 },
        { costCenterId: 'CC-200', weight: 40 },
      ],
    });
    expect(result.kind).toBe('intent');
  });

  it('runAccrual returns intent', async () => {
    const result = await runAccrual(db, ctx, {
      periodKey: '2026-01',
      accruals: [
        {
          expenseAccountId: 'ACC-500',
          liabilityAccountId: 'ACC-600',
          totalMinor: 10000,
          totalPeriods: 12,
          currentPeriod: 1,
        },
      ],
    });
    expect(result.kind).toBe('intent');
  });
});
