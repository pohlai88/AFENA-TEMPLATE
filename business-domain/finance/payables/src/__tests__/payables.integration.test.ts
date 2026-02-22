import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { createPaymentRun, schedulePayments } from '../services/payables-service';

describeIntegration('Payables — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('schedulePayments returns payment batch', async () => {
    const result = await schedulePayments(db, ctx, {
      invoices: [
        { vendorId: 'V1', invoiceId: 'INV-1', amountMinor: 10000, dueDateIso: '2026-01-15', priority: 'high' },
        { vendorId: 'V2', invoiceId: 'INV-2', amountMinor: 5000, dueDateIso: '2026-01-20', priority: 'medium' },
      ],
      budgetMinor: 12000,
    });
    expect(result.kind).toBe('read');
  });

  it('createPaymentRun queries DB and returns intent+read', async () => {
    const result = await createPaymentRun(db, ctx, {
      companyId: 'test-company',
      bankAccountId: 'BA-001',
      paymentDate: '2026-01-31',
      budgetMinor: 100000,
      paymentRunId: 'PR-INT-001',
    });
    expect(['read', 'intent+read']).toContain(result.kind);
  });
});
