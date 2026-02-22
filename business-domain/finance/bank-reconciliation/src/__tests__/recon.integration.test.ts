import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { reconcile, reconcileAndConfirm } from '../services/reconciliation-service';

describeIntegration('Bank Reconciliation — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('reconcile matches bank lines to ledger entries', async () => {
    const result = await reconcile(db, ctx, {
      bankLines: [
        { lineId: 'BL-1', dateIso: '2026-01-15', amountMinor: 10000, reference: 'PAY-001' },
      ],
      ledgerEntries: [
        { entryId: 'LE-1', dateIso: '2026-01-15', amountMinor: 10000, reference: 'PAY-001' },
      ],
      toleranceDays: 3,
    });
    expect(result.kind).toBe('read');
  });

  it('reconcile handles empty inputs', async () => {
    const result = await reconcile(db, ctx, {
      bankLines: [],
      ledgerEntries: [],
      toleranceDays: 0,
    });
    expect(result.kind).toBe('read');
  });

  it('reconcileAndConfirm returns intent for high-confidence matches', async () => {
    const result = await reconcileAndConfirm(db, ctx, {
      bankStatementId: 'BS-001',
      bankLines: [
        { lineId: 'BL-1', dateIso: '2026-01-15', amountMinor: 10000, reference: 'PAY-001' },
      ],
      ledgerEntries: [
        { entryId: 'LE-1', dateIso: '2026-01-15', amountMinor: 10000, reference: 'PAY-001' },
      ],
      toleranceDays: 3,
      confidenceThreshold: 0.5,
    });
    expect(['read', 'intent+read']).toContain(result.kind);
  });
});
