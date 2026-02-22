import type {
  DomainIntent,
  PayablesInvoiceApprovePayload,
  PayablesInvoicePostPayload,
  PayablesPayPayload,
  PayablesPaymentApprovePayload,
} from 'afenda-canon';

export type { PayablesInvoiceApprovePayload, PayablesInvoicePostPayload, PayablesPaymentApprovePayload };

export function buildPaymentRunIntent(
  payload: PayablesPayPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'payables.pay', payload, idempotencyKey };
}

/**
 * @see FIN-AP-INV-01 — AP invoice posting produces governed GL entries
 */
export function buildApInvoicePostIntent(
  payload: PayablesInvoicePostPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'payables.invoice.post', payload, idempotencyKey };
}

/**
 * @see FIN-AP-INV-01 — AP invoice approval chain
 */
export function buildApInvoiceApproveIntent(
  payload: PayablesInvoiceApprovePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'payables.invoice.approve', payload, idempotencyKey };
}

/**
 * @see FIN-AP-PAY-01 — Payment approval (maker-checker)
 */
export function buildPaymentApproveIntent(
  payload: PayablesPaymentApprovePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'payables.payment.approve', payload, idempotencyKey };
}
