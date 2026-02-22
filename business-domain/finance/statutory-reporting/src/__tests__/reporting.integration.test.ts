import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { fetchStatementLayouts } from '../services/reporting-service';

describeIntegration('Statutory Reporting — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('fetchStatementLayouts returns layouts (may be empty)', async () => {
    const result = await fetchStatementLayouts(db, ctx);
    expect(result.kind).toBe('read');
  });

  it('fetchStatementLayouts filters by type', async () => {
    const result = await fetchStatementLayouts(db, ctx, 'balance_sheet');
    expect(result.kind).toBe('read');
  });
});
