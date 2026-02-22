import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { payments } from 'afenda-database';
import { and, desc, eq } from 'drizzle-orm';

// ── Read Models ─────────────────────────────────────────────

export type PaymentReadModel = {
  paymentId: string;
  paymentNo: string | null;
  paymentType: string;
  partyType: string | null;
  partyId: string | null;
  paidAmountMinor: number;
  paidCurrencyCode: string;
  receivedAmountMinor: number;
  receivedCurrencyCode: string;
  paymentDate: string;
  bankAccountId: string | null;
  paymentMethodId: string | null;
  referenceNo: string | null;
  memo: string | null;
  docStatus: string;
};

// ── Queries ─────────────────────────────────────────────────

/**
 * Get a single payment by ID.
 */
export async function getPaymentById(
  db: DbSession,
  ctx: DomainContext,
  paymentId: string,
): Promise<PaymentReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        paymentId: payments.id,
        paymentNo: payments.paymentNo,
        paymentType: payments.paymentType,
        partyType: payments.partyType,
        partyId: payments.partyId,
        paidAmountMinor: payments.paidAmountMinor,
        paidCurrencyCode: payments.paidCurrencyCode,
        receivedAmountMinor: payments.receivedAmountMinor,
        receivedCurrencyCode: payments.receivedCurrencyCode,
        paymentDate: payments.paymentDate,
        bankAccountId: payments.bankAccountId,
        paymentMethodId: payments.paymentMethodId,
        referenceNo: payments.referenceNo,
        memo: payments.memo,
        docStatus: payments.docStatus,
      })
      .from(payments)
      .where(
        and(
          eq(payments.orgId, ctx.orgId),
          eq(payments.id, paymentId),
          eq(payments.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Payment not found: ${paymentId}`, { paymentId });
  }

  return toReadModel(rows[0]!);
}

/**
 * List payments for a party (customer or supplier).
 */
export async function getPaymentsByParty(
  db: DbSession,
  ctx: DomainContext,
  input: { partyType: string; partyId: string },
): Promise<PaymentReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        paymentId: payments.id,
        paymentNo: payments.paymentNo,
        paymentType: payments.paymentType,
        partyType: payments.partyType,
        partyId: payments.partyId,
        paidAmountMinor: payments.paidAmountMinor,
        paidCurrencyCode: payments.paidCurrencyCode,
        receivedAmountMinor: payments.receivedAmountMinor,
        receivedCurrencyCode: payments.receivedCurrencyCode,
        paymentDate: payments.paymentDate,
        bankAccountId: payments.bankAccountId,
        paymentMethodId: payments.paymentMethodId,
        referenceNo: payments.referenceNo,
        memo: payments.memo,
        docStatus: payments.docStatus,
      })
      .from(payments)
      .where(
        and(
          eq(payments.orgId, ctx.orgId),
          eq(payments.partyType, input.partyType),
          eq(payments.partyId, input.partyId),
          eq(payments.isDeleted, false),
        ),
      )
      .orderBy(desc(payments.paymentDate)),
  );

  return rows.map(toReadModel);
}

/**
 * List payments for a bank account.
 */
export async function getPaymentsByBankAccount(
  db: DbSession,
  ctx: DomainContext,
  input: { bankAccountId: string },
): Promise<PaymentReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        paymentId: payments.id,
        paymentNo: payments.paymentNo,
        paymentType: payments.paymentType,
        partyType: payments.partyType,
        partyId: payments.partyId,
        paidAmountMinor: payments.paidAmountMinor,
        paidCurrencyCode: payments.paidCurrencyCode,
        receivedAmountMinor: payments.receivedAmountMinor,
        receivedCurrencyCode: payments.receivedCurrencyCode,
        paymentDate: payments.paymentDate,
        bankAccountId: payments.bankAccountId,
        paymentMethodId: payments.paymentMethodId,
        referenceNo: payments.referenceNo,
        memo: payments.memo,
        docStatus: payments.docStatus,
      })
      .from(payments)
      .where(
        and(
          eq(payments.orgId, ctx.orgId),
          eq(payments.bankAccountId, input.bankAccountId),
          eq(payments.isDeleted, false),
        ),
      )
      .orderBy(desc(payments.paymentDate)),
  );

  return rows.map(toReadModel);
}

// ── Helpers ─────────────────────────────────────────────────

function toReadModel(r: {
  paymentId: string;
  paymentNo: string | null;
  paymentType: string;
  partyType: string | null;
  partyId: string | null;
  paidAmountMinor: unknown;
  paidCurrencyCode: string;
  receivedAmountMinor: unknown;
  receivedCurrencyCode: string;
  paymentDate: unknown;
  bankAccountId: string | null;
  paymentMethodId: string | null;
  referenceNo: string | null;
  memo: string | null;
  docStatus: string;
}): PaymentReadModel {
  return {
    ...r,
    paidAmountMinor: Number(r.paidAmountMinor),
    receivedAmountMinor: Number(r.receivedAmountMinor),
    paymentDate: String(r.paymentDate),
  };
}
