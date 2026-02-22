import type { DomainContext, DomainResult, PayablesInvoicePostPayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import type { PaymentBatch, PaymentScheduleEntry } from '../calculators/payment-scheduling';
import { buildPaymentBatch } from '../calculators/payment-scheduling';
import {
  buildApInvoiceApproveIntent,
  buildApInvoicePostIntent,
  buildPaymentApproveIntent,
  buildPaymentRunIntent,
} from '../commands/payables-intent';
import { getOpenSupplierInvoices } from '../queries/payables-query';

export async function schedulePayments(
  _db: DbSession,
  _ctx: DomainContext,
  input: { invoices: PaymentScheduleEntry[]; budgetMinor: number },
): Promise<DomainResult<PaymentBatch>> {
  const calc = buildPaymentBatch(input.invoices, input.budgetMinor);
  return { kind: 'read', data: calc.result };
}

export async function createPaymentRun(
  db: DbSession,
  ctx: DomainContext,
  input: {
    companyId: string;
    bankAccountId: string;
    paymentDate: string;
    budgetMinor: number;
    paymentRunId: string;
  },
): Promise<DomainResult<PaymentBatch>> {
  const openInvoices = await getOpenSupplierInvoices(db, ctx, {
    companyId: input.companyId,
    dueBefore: input.paymentDate,
  });

  const asScheduleEntry = (inv: (typeof openInvoices)[number]): PaymentScheduleEntry => ({
    vendorId: inv.supplierId,
    invoiceId: inv.invoiceId,
    amountMinor: inv.outstandingMinor,
    dueDateIso: inv.dueDate,
    priority: 'medium',
  });

  const calc = buildPaymentBatch(openInvoices.map(asScheduleEntry), input.budgetMinor);

  const intent = buildPaymentRunIntent(
    {
      paymentRunId: input.paymentRunId,
      invoiceIds: calc.result.entries.map((e) => e.invoiceId),
      bankAccountId: input.bankAccountId,
      paymentDate: input.paymentDate,
      totalMinor: calc.result.totalMinor,
    },
    stableCanonicalJson({ paymentRunId: input.paymentRunId }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * @see FIN-AP-INV-01 — Post an AP invoice, generating governed GL entries.
 *
 * Validates the invoice lines sum to the header total, then emits
 * a posting intent that the accounting-hub will derive into journal lines.
 */
export async function postApInvoice(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    invoiceId: string;
    vendorId: string;
    companyId: string;
    ledgerId: string;
    totalMinor: number;
    currency: string;
    effectiveAt: string;
    lines: Array<{ accountId: string; amountMinor: number; costCenter?: string }>;
  },
): Promise<DomainResult> {
  const lineTotal = input.lines.reduce((sum, l) => sum + l.amountMinor, 0);
  if (lineTotal !== input.totalMinor) {
    throw new Error(
      `Line total ${lineTotal} does not match invoice total ${input.totalMinor}`,
    );
  }

  const payload: PayablesInvoicePostPayload = {
    invoiceId: input.invoiceId,
    vendorId: input.vendorId,
    companyId: input.companyId,
    ledgerId: input.ledgerId,
    totalMinor: input.totalMinor,
    currency: input.currency,
    effectiveAt: input.effectiveAt,
    lines: input.lines,
  };

  return {
    kind: 'intent',
    intents: [buildApInvoicePostIntent(payload, stableCanonicalJson({ invoiceId: input.invoiceId }))],
  };
}

/**
 * @see FIN-AP-INV-01 — Approve or reject an AP invoice (SoD: approver ≠ creator).
 */
export async function approveApInvoice(
  _db: DbSession,
  ctx: DomainContext,
  input: { invoiceId: string; decision: 'approve' | 'reject'; reason?: string },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildApInvoiceApproveIntent(
        { invoiceId: input.invoiceId, approverId: ctx.actor.userId, decision: input.decision, ...(input.reason ? { reason: input.reason } : {}) },
        stableCanonicalJson({ invoiceId: input.invoiceId, approverId: ctx.actor.userId }),
      ),
    ],
  };
}

/**
 * @see FIN-AP-PAY-01 — Approve a payment run (maker-checker control).
 */
export async function approvePaymentRun(
  _db: DbSession,
  ctx: DomainContext,
  input: { paymentRunId: string; decision: 'approve' | 'reject'; reason?: string },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildPaymentApproveIntent(
        { paymentRunId: input.paymentRunId, approverId: ctx.actor.userId, decision: input.decision, ...(input.reason ? { reason: input.reason } : {}) },
        stableCanonicalJson({ paymentRunId: input.paymentRunId, approverId: ctx.actor.userId }),
      ),
    ],
  };
}
