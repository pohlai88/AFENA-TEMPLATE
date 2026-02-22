import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { fetchCloseChecklist, fetchCloseStatus, validateCloseReadiness } from '../services/close-service';

describeIntegration('Financial Close — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('fetchCloseChecklist returns tasks for a period', async () => {
    const result = await fetchCloseChecklist(db, ctx, {
      ledgerId: '00000000-0000-0000-0000-000000000000',
      fiscalYear: '2026',
      periodNumber: 1,
    });
    expect(result.kind).toBe('read');
  });

  it('fetchCloseStatus returns status for a period', async () => {
    const result = await fetchCloseStatus(db, ctx, {
      ledgerId: '00000000-0000-0000-0000-000000000000',
      fiscalYear: '2026',
      periodNumber: 1,
    });
    expect(result.kind).toBe('read');
  });

  it('validateCloseReadiness works with empty requirements', () => {
    const result = validateCloseReadiness([]);
    expect(result.allPassed).toBe(true);
    expect(result.failedCount).toBe(0);
  });
});
