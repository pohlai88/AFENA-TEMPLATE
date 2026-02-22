/**
 * E-Invoice Intent Builders
 *
 * Constructs DomainIntent objects for e-invoicing operations.
 * Intent types: einvoice.issue, einvoice.submit, einvoice.clear
 */
import type {
  DomainIntent,
  EInvoiceClearPayload,
  EInvoiceIssuePayload,
  EInvoiceSubmitPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildEInvoiceIssueIntent(
  payload: EInvoiceIssuePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'einvoice.issue',
    payload,
    idempotencyKey: idempotencyKey ?? stableCanonicalJson({ invoiceId: payload.invoiceId }),
  };
}

export function buildEInvoiceSubmitIntent(
  payload: EInvoiceSubmitPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'einvoice.submit',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        invoiceId: payload.invoiceId,
        submissionId: payload.submissionId,
      }),
  };
}

export function buildEInvoiceClearIntent(
  payload: EInvoiceClearPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'einvoice.clear',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        invoiceId: payload.invoiceId,
        submissionId: payload.submissionId,
      }),
  };
}
