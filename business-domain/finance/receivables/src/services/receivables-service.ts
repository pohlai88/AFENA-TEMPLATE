import type { DomainContext, DomainResult, ReceivablesInvoicePostPayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import type { AgingReport } from '../calculators/aging';
import { computeAging } from '../calculators/aging';
import { buildArInvoicePostIntent, buildReceivablesAllocateIntent } from '../commands/receivables-intent';
import { getOutstandingReceivables } from '../queries/receivables-query';

export type OutstandingInvoice = {
  invoiceId: string;
  outstandingMinor: number;
  dueDateIso: string;
  customerId: string;
};

export async function getReceivablesAging(
  _db: DbSession,
  _ctx: DomainContext,
  input: { asOf: string },
): Promise<DomainResult<AgingReport>> {
  // TODO: Wire to sales_invoices table once domain query is implemented
  const invoices: Array<{ outstandingMinor: number; dueDateIso: string }> = [];
  const calc = computeAging(invoices, input.asOf);
  return { kind: 'read', data: calc.result };
}

export async function getReceivablesAgingFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { asOf: string; companyId: string; arAccountId: string },
): Promise<DomainResult<AgingReport>> {
  const invoices = await getOutstandingReceivables(db, ctx, {
    companyId: input.companyId,
  });
  const calc = computeAging(
    invoices.map((i) => ({ outstandingMinor: i.outstandingMinor, dueDateIso: i.dueDateIso })),
    input.asOf,
  );
  return { kind: 'read', data: calc.result };
}

export async function allocatePayment(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    paymentId: string;
    effectiveAt: string;
    allocations: Array<{ invoiceId: string; amountMinor: number }>;
    method: 'fifo' | 'specific' | 'oldest_first';
  },
): Promise<DomainResult> {
  const intent = buildReceivablesAllocateIntent(
    {
      paymentId: input.paymentId,
      effectiveAt: input.effectiveAt,
      allocations: input.allocations,
      method: input.method,
    },
    stableCanonicalJson({ paymentId: input.paymentId }),
  );
  return { kind: 'intent', intents: [intent] };
}

/**
 * @see FIN-AR-INV-01 — Post an AR invoice, generating governed GL entries.
 *
 * Validates line totals match header, then emits a posting intent.
 * Credit policy is enforced upstream by credit-management package.
 */
export async function postArInvoice(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    invoiceId: string;
    customerId: string;
    companyId: string;
    ledgerId: string;
    totalMinor: number;
    currency: string;
    effectiveAt: string;
    lines: Array<{ accountId: string; amountMinor: number }>;
  },
): Promise<DomainResult> {
  const lineTotal = input.lines.reduce((sum, l) => sum + l.amountMinor, 0);
  if (lineTotal !== input.totalMinor) {
    throw new Error(
      `Line total ${lineTotal} does not match invoice total ${input.totalMinor}`,
    );
  }

  const payload: ReceivablesInvoicePostPayload = {
    invoiceId: input.invoiceId,
    customerId: input.customerId,
    companyId: input.companyId,
    ledgerId: input.ledgerId,
    totalMinor: input.totalMinor,
    currency: input.currency,
    effectiveAt: input.effectiveAt,
    lines: input.lines,
  };

  return {
    kind: 'intent',
    intents: [buildArInvoicePostIntent(payload, stableCanonicalJson({ invoiceId: input.invoiceId }))],
  };
}
