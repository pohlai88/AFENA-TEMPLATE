import type { DomainIntent, ReceivablesAllocatePayload, ReceivablesInvoicePostPayload } from 'afenda-canon';

export type { ReceivablesInvoicePostPayload as ArInvoicePostPayload };

export function buildReceivablesAllocateIntent(
  payload: ReceivablesAllocatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'receivables.allocate', payload, idempotencyKey };
}

/**
 * @see FIN-AR-INV-01 — AR invoice posting generates GL entries
 */
export function buildArInvoicePostIntent(
  payload: ReceivablesInvoicePostPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'receivables.invoice.post', payload, idempotencyKey };
}
