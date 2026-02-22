import type { DomainContext, DomainResult, PaymentCreatePayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { buildPaymentCreateIntent } from '../commands/payment-intent';
import type { PaymentReadModel } from '../queries/payment-query';
import {
  getPaymentById,
  getPaymentsByBankAccount,
  getPaymentsByParty,
} from '../queries/payment-query';

/**
 * Create a payment document.
 * Emits a `payment.create` intent for downstream processing
 * (GL posting via journal_entries.sourceType='payment').
 *
 * @see PAY-01 — Payment creation
 */
export async function createPayment(
  _db: DbSession,
  _ctx: DomainContext,
  input: PaymentCreatePayload,
): Promise<DomainResult> {
  if (input.paidAmountMinor <= 0) {
    throw new Error('Paid amount must be greater than zero');
  }
  if (input.receivedAmountMinor <= 0) {
    throw new Error('Received amount must be greater than zero');
  }
  if (input.paymentType !== 'internal_transfer' && !input.partyId) {
    throw new Error('partyId is required for non-transfer payments');
  }

  const intent = buildPaymentCreateIntent(
    input,
    stableCanonicalJson({
      paymentType: input.paymentType,
      partyId: input.partyId,
      paidAmountMinor: input.paidAmountMinor,
      paymentDate: input.paymentDate,
    }),
  );

  return { kind: 'intent', intents: [intent] };
}

/**
 * Retrieve a single payment.
 */
export async function getPayment(
  db: DbSession,
  ctx: DomainContext,
  input: { paymentId: string },
): Promise<DomainResult<PaymentReadModel>> {
  const payment = await getPaymentById(db, ctx, input.paymentId);
  return { kind: 'read', data: payment };
}

/**
 * List payments for a party (customer/supplier).
 */
export async function listPartyPayments(
  db: DbSession,
  ctx: DomainContext,
  input: { partyType: string; partyId: string },
): Promise<DomainResult<PaymentReadModel[]>> {
  const payments = await getPaymentsByParty(db, ctx, input);
  return { kind: 'read', data: payments };
}

/**
 * List payments for a bank account.
 */
export async function listBankAccountPayments(
  db: DbSession,
  ctx: DomainContext,
  input: { bankAccountId: string },
): Promise<DomainResult<PaymentReadModel[]>> {
  const payments = await getPaymentsByBankAccount(db, ctx, input);
  return { kind: 'read', data: payments };
}
