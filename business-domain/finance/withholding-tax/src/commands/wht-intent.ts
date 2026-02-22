/**
 * Withholding Tax Intent Builders
 *
 * Constructs DomainIntent objects for WHT operations.
 * Intent types: wht.certificate.issue, wht.remit
 */
import type { DomainIntent, WhtCertificateIssuePayload, WhtRemitPayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildIssueCertificateIntent(
  payload: WhtCertificateIssuePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'wht.certificate.issue',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        certificateNo: payload.certificateNo,
        whtCode: payload.whtCode,
        taxPeriod: payload.taxPeriod,
      }),
  };
}

export function buildRemitIntent(payload: WhtRemitPayload, idempotencyKey?: string): DomainIntent {
  return {
    type: 'wht.remit',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        remittanceId: payload.remittanceId,
        taxAuthority: payload.taxAuthority,
        taxPeriod: payload.taxPeriod,
      }),
  };
}
