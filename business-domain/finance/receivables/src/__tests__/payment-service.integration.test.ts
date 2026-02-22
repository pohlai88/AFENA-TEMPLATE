import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { beforeAll, expect, it } from 'vitest';
import {
  describeIntegration,
  mockDbSession,
  testCtx,
} from '../../../test-utils/integration-helper';
import {
  createPayment,
  getPayment,
  listBankAccountPayments,
  listPartyPayments,
} from '../services/payment-service';

describeIntegration('Payment Service — Integration', () => {
  let db: DbSession;
  let ctx: DomainContext;

  beforeAll(() => {
    db = mockDbSession();
    ctx = testCtx();
  });

  it('createPayment emits payment.create intent for receive payment', async () => {
    const result = await createPayment(db, ctx, {
      paymentType: 'receive',
      partyType: 'customer',
      partyId: 'cust-001',
      paidFromAccountId: 'acct-001',
      paidToAccountId: 'acct-002',
      paidAmountMinor: 100000,
      paidCurrencyCode: 'USD',
      receivedAmountMinor: 100000,
      receivedCurrencyCode: 'USD',
      paymentDate: '2026-02-22',
    });
    expect(result.kind).toBe('intent');
    expect(result.intents).toHaveLength(1);
    expect(result.intents![0]!.type).toBe('payment.create');
  });

  it('createPayment rejects zero amount', async () => {
    await expect(
      createPayment(db, ctx, {
        paymentType: 'pay',
        partyType: 'supplier',
        partyId: 'sup-001',
        paidFromAccountId: 'acct-001',
        paidToAccountId: 'acct-002',
        paidAmountMinor: 0,
        paidCurrencyCode: 'USD',
        receivedAmountMinor: 100000,
        receivedCurrencyCode: 'USD',
        paymentDate: '2026-02-22',
      }),
    ).rejects.toThrow('Paid amount must be greater than zero');
  });

  it('createPayment rejects non-transfer without partyId', async () => {
    await expect(
      createPayment(db, ctx, {
        paymentType: 'receive',
        partyType: 'customer',
        paidFromAccountId: 'acct-001',
        paidToAccountId: 'acct-002',
        paidAmountMinor: 50000,
        paidCurrencyCode: 'USD',
        receivedAmountMinor: 50000,
        receivedCurrencyCode: 'USD',
        paymentDate: '2026-02-22',
      }),
    ).rejects.toThrow('partyId is required');
  });

  it('createPayment allows internal transfer without partyId', async () => {
    const result = await createPayment(db, ctx, {
      paymentType: 'internal_transfer',
      paidFromAccountId: 'acct-001',
      paidToAccountId: 'acct-002',
      paidAmountMinor: 200000,
      paidCurrencyCode: 'USD',
      receivedAmountMinor: 200000,
      receivedCurrencyCode: 'USD',
      paymentDate: '2026-02-22',
    });
    expect(result.kind).toBe('intent');
  });

  it('getPayment throws on nonexistent payment', async () => {
    await expect(getPayment(db, ctx, { paymentId: 'nonexistent' })).rejects.toThrow(
      'Payment not found',
    );
  });

  it('listPartyPayments returns empty array from mockDb', async () => {
    const result = await listPartyPayments(db, ctx, {
      partyType: 'customer',
      partyId: 'cust-001',
    });
    expect(result.kind).toBe('read');
    expect(result.data).toEqual([]);
  });

  it('listBankAccountPayments returns empty array from mockDb', async () => {
    const result = await listBankAccountPayments(db, ctx, {
      bankAccountId: 'ba-001',
    });
    expect(result.kind).toBe('read');
    expect(result.data).toEqual([]);
  });
});
