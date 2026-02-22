import type { IsoDateTime } from './branded';

export type DomainEvent =
  | { type: 'invoice.posted'; payload: { invoiceId: string } }
  | { type: 'stock.adjusted'; payload: { itemId: string; deltaQty: number } }
  | { type: 'payment.settled'; payload: { paymentId: string } };

/**
 * AccountingEvent — the contract emitted by operational domain packages
 * instead of hand-crafting journal entries directly (enforced by FIN-05).
 *
 * Hash recipe (two separate identities — do NOT mix):
 *   eventId      = sha256(org_id + source_domain + source_event_id)
 *                  Stable across mapping version changes. Same business event = same eventId.
 *   derivationId = sha256(eventId + mapping_version + inputs_hash)
 *                  Lives on acct_derived_entries. Changes when mapping rules are republished.
 *
 * inputsHash = sha256(stableCanonicalJson(attributesJson))
 *   Use packages/canon/src/utils/stable-json.ts — never JSON.stringify directly.
 *
 * effectiveAt drives period assignment (gl_periods lookup by effectiveAt, not occurredAt).
 */
export interface AccountingEvent {
  type: 'acct.event';
  schemaVersion: number;
  eventId: string;
  sourceDomain: string;
  sourceEventId: string;
  sourceSystem?: string;
  eventClass: string;
  occurredAt: IsoDateTime;
  effectiveAt: IsoDateTime;
  attributesJson: Record<string, unknown>;
  inputsHash: string;
}
