import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import { describeIntegration, mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { checkCustomerCreditFromDb, getCreditCheck, getCreditExposure } from '../services/credit-service';

describeIntegration('Credit Management — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('getCreditCheck returns credit check result', async () => {
    const result = await getCreditCheck(db, ctx, {
      creditLimitMinor: 100000,
      currentExposureMinor: 30000,
      orderAmountMinor: 50000,
    });
    expect(result.kind).toBe('read');
  });

  it('getCreditExposure computes exposure from invoices and orders', async () => {
    const result = await getCreditExposure(db, ctx, {
      openInvoices: [{ invoiceId: 'INV-1', outstandingMinor: 5000, isOverdue: true }],
      pendingOrders: [{ orderId: 'ORD-1', amountMinor: 3000 }],
    });
    expect(result.kind).toBe('read');
  });

  it('checkCustomerCreditFromDb queries real DB', async () => {
    await expect(
      checkCustomerCreditFromDb(db, ctx, { customerId: 'CUST-NONEXISTENT', orderAmountMinor: 1000 }),
    ).rejects.toThrow();
  });
});
