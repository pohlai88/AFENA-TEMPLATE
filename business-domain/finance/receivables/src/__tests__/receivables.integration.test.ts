import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { allocatePayment, getReceivablesAging, getReceivablesAgingFromDb } from '../services/receivables-service';

describeIntegration('Receivables — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('getReceivablesAging returns aging report (stub path)', async () => {
    const result = await getReceivablesAging(db, ctx, { asOf: '2026-01-31' });
    expect(result.kind).toBe('read');
    if (result.kind === 'read') {
      expect(result.data).toBeDefined();
    }
  });

  it('getReceivablesAgingFromDb returns aging from real query', async () => {
    const result = await getReceivablesAgingFromDb(db, ctx, {
      asOf: '2026-01-31',
      companyId: 'test-company',
      arAccountId: 'AR-100',
    });
    expect(result.kind).toBe('read');
  });

  it('allocatePayment returns intent', async () => {
    const result = await allocatePayment(db, ctx, {
      paymentId: 'PAY-INT-001',
      allocations: [{ invoiceId: 'INV-1', amountMinor: 5000 }],
      method: 'fifo',
    });
    expect(result.kind).toBe('intent');
  });
});
